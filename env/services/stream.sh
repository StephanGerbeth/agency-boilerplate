#!/bin/bash
ffmpeg -re -i ./public/tmp/bbb720.mp4 -vcodec libx264 -preset veryfast -maxrate 1984k -bufsize 3968k -vf "format=yuv420p" -g 60 -acodec libmp3lame -b:a 128k -ar 44100 -f flv -s 1280x720 "rtmp://rtmp-api.facebook.com:80/rtmp/1433593550000641?ds=1&a=AabVh4vES_FWxxi_"
