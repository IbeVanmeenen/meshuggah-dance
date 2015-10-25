/* ==========================================================================
   Danceparty
   ========================================================================== */

var danceparty = danceparty || {};

danceparty.app = function(undefined) {

    var exports = this.app;

    var init,
        timer, loadMainVideo, playNextChapter, startVideo, loopChapter;

    var body;

    var clickFrame, videoElement, loaderProgress;

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
            var percent = (videoElement.buffered.end(0)/videoElement.duration) * 100;

            loaderProgress.innerHTML = parseInt(percent, 10) + '%';

            if( percent >= 100 && !startYtVideo) {
                videoElement.removeEventListener('progress', loadMainVideoProgress, false);
                videoElement.currentTime = 0;
                startYtVideo = true;
                ytStart();
            }

            videoElement.currentTime++;
        }
    };


    // Load main video
    loadMainVideo = function() {
        var source = document.createElement('source');
        source.src = 'dist/video/edited/full-xs.mp4';
        // source.src = 'https://vjnblq-ch3301.files.1drv.com/y3meZoYzBtnlmx68ii0QJk4sDrpm3jx8xykUKWN-UnOrELYonP50CKLE77L6iXqNqtUhq9jI9RlKdrVg_5u_Y1bd-UqS0gnpkXDDc_5Kw0WgeEP7W6ff56COLoMtbmCpPcNNSi1f59bZ4dK1ukAHpnmCA/full-sm.mp4?psid=1?&videoformat=dash&part=index&pretranscode=0&transcodeahead=0';
        // source.src = 'https://drive.google.com/file/d/0B8Gzpe7fYcWRdlB5akJWTG14VjQ/view?usp=sharing';
        // source.src = 'https://docs.google.com/uc?id=0B8Gzpe7fYcWRdlB5akJWTG14VjQ&export=download';
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

        window.setTimeout(timer, 521.73913);
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

        videoElement = document.getElementById('main-video');
        videoElement.volume = 0;
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







// Play Next
// playNextVideo = function() {
//     nextVideoWaiting = false;
//
//     nextVideo.play();
//
//     if (isClick) {
//         isClick = false;
//         if (first) {
//             lastVideo = nextVideo;
//             first = false;
//         } else {
//             lastVideo.remove();
//             lastVideo = nextVideo;
//         }
//
//         if (currentIndex === 18) {
//             currentIndex = 0;
//         } else {
//             currentIndex += 1;
//         }
//
//         clickAllowed = true;
//     }
// };


// Video Loop
// startVideo = function() {
//     timer();
//
//     body.classList.add('yt-started--play');
//
//     clickFrame.addEventListener('click', function(e) {
//
//         if (clickAllowed) {
//             clickAllowed = false;
//             isClick = true;
//
//             e.preventDefault();
//
//             if (first) {
//                 body.classList.add('party-started');
//             }
//
//             nextVideo = document.createElement('video');
//             vidFrame.appendChild(nextVideo);
//
//             nextVideo.src = videoUrls[currentIndex];
//             nextVideo.volume = 0;
//             nextVideo.loop = true;
//             nextVideo.preload = 'auto';
//             nextVideo.classList.add('vid-container__video');
//
//             nextVideo.oncanplay = function() {
//                 nextVideoWaiting = true;
//             };
//
//             nextVideo.onended = function () {
//                 this.currentTime = 0;
//                 this.play();
//             };
//         }
//
//     });
// };
