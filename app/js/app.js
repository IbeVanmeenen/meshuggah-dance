/* ==========================================================================
   Danceparty
   ========================================================================== */

var danceparty = danceparty || {};

danceparty.app = function(undefined) {

    var exports = this.app;

    var init,
        timer, loadMainVideo, playNextChapter, startVideo, loopChapter;

    var body;

    var clickFrame, videoElement, startBtn, loaderProgress;

    var ytPlayer,
        ytStart, ytOnPlayerReady, ytOnPlayerStateChange;

    var loadMainVideo, loadMainVideoProgress, lastVideo, nextVideo,
        currentChapterIndex = 0,
        firstPlay = true,
        clickAllowed = true,
        isClick = true;

    var millisec = 0,
        nextChapterWaiting = false;

    var startTime = 0,
        stopTime = 0;


    // Youtube
    exports.initYoutube = function() {

        player = new YT.Player('yt-iframe', {
            height: '390',
            width: '640',
            videoId: 'qc98u-eGzlc',
            events: {
                'onReady': ytOnPlayerReady,
                'onStateChange': ytOnPlayerStateChange
            }
        });
    };


    // Youtube: start video
    ytStart = function() {
        player.playVideo();

        body.classList.add('yt-started');
    };


    // Youtube: Player ready
    ytOnPlayerReady = function(e) {
        loadMainVideo();
    }

    // Youtube: Player State Change
    var ytFirst = true;
    ytOnPlayerStateChange = function(e) {

        if (e.data == YT.PlayerState.PLAYING) {

            if(ytFirst) {
                window.setTimeout(startVideo, 9610);
                ytFirst = false;
            }
        }
    }


    // Progress Handler
    var startYtVideo = false;
    loadMainVideoProgress = function() {

        if(videoElement.duration) {
            var percent = (parseInt(videoElement.buffered.end(0),10)/parseInt(videoElement.duration,10)) * 100;
            percent = parseInt(percent, 10);

            loaderProgress.innerHTML = percent + '%';

            if(percent >= 100 && !startYtVideo) {
                videoElement.removeEventListener('progress', loadMainVideoProgress, false);
                videoElement.currentTime = 0;
                startYtVideo = true;
                body.classList.add('show-start-btn');
            } else {
                videoElement.currentTime++;
            }
        }
    };


    // Load main video
    loadMainVideo = function() {
        var source = document.createElement('source');
        source.src = 'https://s3.eu-central-1.amazonaws.com/meshuggah-dance/full-sm.mp4';
        source.type = 'video/mp4';

        videoElement.appendChild(source);
        videoElement.addEventListener('progress', loadMainVideoProgress, false);
        videoElement.load();
    };


    // BPM Timer
    timer = function() {
        millisec += 1;

        if(nextChapterWaiting) {
            playNextChapter();
        }

        window.setTimeout(timer, 521.73910);
    };


    // Video
    startVideo = function() {
        timer();

        body.classList.add('yt-started--play');

        clickFrame.addEventListener('click', function(e) {
            if (clickAllowed) {
                clickAllowed = false;
                e.preventDefault();

                nextChapterWaiting = true;
            }
        });
    };


    // Play Next
    playNextChapter = function() {
        nextChapterWaiting = false;

        videoElement.removeEventListener('timeupdate', loopChapter, false);

        startTime = chapters[currentChapterIndex].start;
        stopTime = chapters[currentChapterIndex].stop;

        console.log('startTime: ' + startTime);
        console.log('stopTime: ' + stopTime);

        if (firstPlay) {
            firstPlay = false;
            videoElement.play();
            body.classList.add('party-started');
        } else if (currentChapterIndex === 0) {
            videoElement.play();
        } else {
            videoElement.currentTime = startTime;
        }

        videoElement.addEventListener('timeupdate', loopChapter, false);

        if (currentChapterIndex === 19) {
            currentChapterIndex = 0;
        } else {
            currentChapterIndex += 1;
        }

        clickAllowed = true;
    };


    // Loop
    loopChapter = function() {
        if (videoElement.currentTime >= stopTime) {
            console.log('replay');
            videoElement.currentTime = startTime;
        }
    };


    // Init
    init = function() {
        body = document.getElementById('body');
        clickFrame = document.getElementById('click-frame');
        loaderProgress = document.getElementById('loader-progress');
        startBtn = document.getElementById('start-btn');

        videoElement = document.getElementById('main-video');
        videoElement.volume = 0;

        startBtn.addEventListener('click', function(e) {
            ytStart();
        }, false);
    }();
};

danceparty.app();

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
    danceparty.app.initYoutube();
};
