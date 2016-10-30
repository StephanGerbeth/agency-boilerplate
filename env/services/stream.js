"use strict";

const spawn = require('child_process').spawn;
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const url = Symbol();
const process = Symbol();

class Stream {
    constructor(streamUrl) {
        this[url] = streamUrl;
        this[process] = null;
    }

    start() {
        this[process] = consoleWebcamFFMPEG(this[url]);
    }

    destroy() {
        this[process].kill('SIGINT');
    }
}

function consoleWebcamFFMPEG(streamUrl) {
    var childProcess = spawn('ffmpeg', [
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
        '-vf', "format=yuv420p",
        '-g', '60',
        '-acodec', 'libmp3lame',
        '-b:a', '128k',
        '-ar', '44100',
        '-f', 'flv',
        '-s', '640x360',
        streamUrl
    ]);
    childProcess.stdout.on('data', data => console.log(data.toString()));
    childProcess.stderr.on('data', data => console.log(data.toString()));
    childProcess.on('close', code => {
        console.log(`done! (${code})`);
    });
    return childProcess;
}

function consoleFFMPEG(streamUrl) {
    var childProcess = spawn('ffmpeg', [
        '-re',
        '-i', __dirname + '/public/tmp/bbb720.mp4',
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
    childProcess.stdout.on('data', data => console.log(data.toString()));
    childProcess.stderr.on('data', data => console.log(data.toString()));
    childProcess.on('close', code => {
        console.log(`done! (${code})`);
    });
}

function fluentWebcamFFMPEG(streamUrl) {
    console.log('START STREAM');
    ffmpeg('default')
    .inputFormat('avfoundation')
    .inputFPS('30')
    // .input(fs.createReadStream(__dirname + '/public/tmp/bbb720_2mb.mp4'))
    .format('flv')
    .size('640x?')
    .videoBitrate('1984k')
    .videoCodec('libx264')
    .audioBitrate('128k')
    .audioCodec('aac')
    .audioFrequency(44100)
    .audioChannels(2)
    .outputOptions([
        '-movflags faststart',
        '-pix_fmt yuv420p'
    ])
    .on('error', function(err) {
        console.log('An error occurred: ' + err.message, arguments);
    })
    .on('end', function() {
        console.log('Processing finished !');
    }).save(streamUrl);
}


function fluentFFMPEG(streamUrl) {
    console.log('START STREAM');
    ffmpeg({})
    .input(fs.createReadStream(__dirname + '/public/tmp/bbb720_2mb.mp4'))
    .format('flv')
    .flvmeta()
    .size('1280x?')
    .videoBitrate('1984k')
    .videoCodec('libx264')
    .audioBitrate('128k')
    .audioCodec('aac')
    .audioFrequency(44100)
    .audioChannels(2)
    .outputOptions([
        '-movflags faststart',
        '-pix_fmt yuv420p'
    ])
    .on('error', function(err) {
        console.log('An error occurred: ' + err.message, arguments);
    })
    .on('end', function() {
        console.log('Processing finished !');
    }).save(streamUrl);
}

module.exports = Stream;
// var stream = new Stream();
// stream.start();
