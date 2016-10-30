"use strict";

const token = Symbol();
const validate = Symbol();
const stream = Symbol();
const comments = Symbol();

const fb = require('../facebook');
const spawn = require('child_process').spawn;
const google = require('../google');
const Comment = require('./Comment');

class LiveVideo {
    constructor(accessToken) {
        this[token] = accessToken;
        this[validate] = false;
        this[stream] = null;
        this[comments] = {};

        this.id = null;
        this.url = null;
        this.shortUrl = null;
    }

    create(pageId, config, resolve, reject) {
        fb.api(this[token], pageId + '/live_videos', 'post', config.stream, function (res) {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                reject();
            }
            this.id = res.id;

            // if(config.webcam) {
            //     this[stream] = streamWebcamToUrl(res.stream_url);
            // } else {
            //     this[stream] = streamVideoToUrl(res.stream_url);
            // }
            this[stream] = streamPIPToUrl(res.stream_url);
            this.getInfo(pageId, resolve, reject);
        }.bind(this));
    }

    getInfo(pageId, resolve, reject) {
        fb.api(this[token], this.id, 'get', {fields:'permalink_url,video'}, function (res) {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                reject();
            }
            this.id = pageId + '_' + res.video.id;
            this.url = 'http://www.facebook.com' + res.permalink_url;
            google.createShortUrl(this.url, function(result) {
                this.shortUrl = result;
                resolve(this);
            }.bind(this), reject);
        }.bind(this));
    }

    addComment(data) {
        this[comments][data.comment_id] = new Comment(data);
    }

    destroy() {
        this[stream].kill('SIGINT');
    }
}

module.exports = LiveVideo;

function streamPIPToUrl(streamUrl) {
    return spawnProcess([
        '-re',
        '-threads', '0',
        '-rtbufsize', '100M',

        '-thread_queue_size', '50',
        '-f', 'avfoundation',
        '-framerate', '30',
        '-video_size', '1280x720',
        '-i', '1',

        '-thread_queue_size', '50',
        '-f', 'avfoundation',
        '-framerate', '30',
        '-video_size', '1280x720',
        '-i', '0',

        '-f', 'lavfi',
        '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',

        '-i', __dirname + '/Canon.mp3',

        '-filter_complex',
            '[0:v]scale=640:-1,setpts=PTS-STARTPTS,colorkey=0xD39C29:0.3:0.2[ck];' +
            '[1:v]scale=1280:-1,setpts=PTS-STARTPTS[bg];' +
            '[2:a][3:a]amix=inputs=2:duration=first:dropout_transition=2[a];' +
            '[bg][ck]overlay=(main_w-overlay_w-100):(main_h-overlay_h-100)[v]',

        '-map', '[v]',
        '-vcodec', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-deinterlace',
        '-qp', '0', //tells x264 to encode in lossless mode
        '-profile:v', 'baseline',
        // '-level', '1.2',
        '-crf', '18', //The range of the quantizer scale is 0-51: where 0 is lossless, 23 is default, and 51 is worst possible. A lower value is a higher quality and a subjectively sane range is 18-28. Consider 18 to be visually lossless or nearly so: it should look the same or nearly the same as the input but it isn't technically lossless.
        '-preset', 'ultrafast',
        '-maxrate', '1500k',
        '-vb', '400k',
        '-bufsize', '6000k',
        '-g', '30',
        '-r', '30',
        '-f', 'flv',
        '-s', '1280x720',

        '-map', '[a]',
        '-acodec', 'libmp3lame',
        '-ar', '44100',
        '-b:a', '128k',
        '-b:v', '768k',
        '-movflags', 'faststart',

        streamUrl
    ]);
}

function streamWebcamToUrl(streamUrl) {
    return spawnProcess([
        '-rtbufsize', '100M',
        '-f', 'avfoundation',
        '-video_size', '1280x720',
        '-framerate', '30',
        '-i', '0:0' ,
        '-vcodec', 'libx264',
        '-profile:v', 'baseline',
        '-level', '1.2',
        '-preset', 'ultrafast',
        '-maxrate', '1984k',
        '-bufsize', '3968k',
        '-pix_fmt', 'yuv420p',
        '-g', '60',
        '-acodec', 'libmp3lame',
        '-b:a', '128k',
        '-ar', '44100',
        '-f', 'flv',
        '-s', '640x360',
        streamUrl
    ]);
}

function streamVideoToUrl(streamUrl) {
    return spawnProcess([
        '-threads', '2',
        '-re',
        '-stream_loop', '-1',
        '-fflags', '+genpts',
        '-i', __dirname + '/../public/tmp/bbb720.mp4',
        '-c', 'copy',
        '-vcodec', 'libx264',
        '-preset', 'veryfast',
        '-maxrate', '1984k',
        '-bufsize', '3968k',
        '-vf', "format=yuv420p",
        '-g', '60',
        '-acodec', 'libmp3lame',
        '-b:a', '128k',
        '-ar', '44100',
        '-f', 'flv',
        '-s', '1280x720',
        streamUrl
    ]);
}

function spawnProcess(config) {
    var childProcess = spawn('ffmpeg', config);

    childProcess.stdout.on('data', data => console.log(data.toString()));
    childProcess.stderr.on('data', data => console.log(data.toString()));
    childProcess.on('close', code => {
        console.log(`done! (${code})`);
    });

    return childProcess;
}
