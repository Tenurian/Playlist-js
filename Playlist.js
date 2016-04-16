var Playlist = function (data) {
    var SongList = [],
        elementName = (data.hasOwnProperty('elementName')) ? data.elementName : false,
        currentTarget = -1,
        folder = (data.hasOwnProperty('folder')) ? data.folder : null,
        mediaType = (data.hasOwnProperty('mediaType')) ? data.mediaType : 'audio',
        extension = (data.hasOwnProperty('filetype')) ? data.filetype : (mediaType == 'audio') ? '.mp3' : '.mp4',
        shuffle = (data.hasOwnProperty('shuffle')) ? data.shuffle : false,
        loop = (data.hasOwnProperty('loop')) ? data.loop : false,
        autoplay = (data.hasOwnProperty('autoplay')) ? data.autoplay : false,
        links = (data.hasOwnProperty('links')) ? data.links : false,
        showAll = (data.hasOwnProperty('showAll')) ? data.showAll : true,
        alwaysShowControls = (data.hasOwnProperty('alwaysShowControls')) ? data.alwaysShowControls : true,
        displayName = (data.hasOwnProperty('displayName')) ? data.displayName : true,
        progressBarHeight = (data.hasOwnProperty('progressBarHeight')) ? data.progressBarHeight : "30px",
        progressBarColor = (data.hasOwnProperty('progressBarColor')) ? data.progressBarColor : "#3f79e0",
        progressBarBorder = (data.hasOwnProperty('progressBarBorder')) ? data.progressBarBorder : "3px solid #3f79e0",
        progressBarBackground = (data.hasOwnProperty('progressBarBackground')) ? data.progressBarBackground : "#4a4a4a",
        progressBarRadius = (data.hasOwnProperty('progressBarRadius')) ? data.progressBarRadius : "2px",
        songBarBackground = (data.hasOwnProperty('songBarBackground')) ? data.songBarBackground : "#000",
        songBarColor = (data.hasOwnProperty('songBarColor')) ? data.songBarColor : "#FFF",
        songBarHighlight = (data.hasOwnProperty('songBarHighlight')) ? data.songBarHighlight : "#aaa",
        songBarBorder = (data.hasOwnProperty('songBarBorder')) ? data.songBarBorder : "2px solid " + songBarHighlight + "",
        songBarRadius = (data.hasOwnProperty('songBarRadius')) ? data.songBarRadius : "5px",
        videoHeight = (data.hasOwnProperty('videoHeight')) ? data.videoHeight : '240px',
        videoWidth = (data.hasOwnProperty('videoWidth')) ? data.videoWidth : '320px',
        videoborder = (data.hasOwnProperty('videoborder')) ? data.videoborder : '1px solid ' + songBarHighlight + '',
        skipAmount = (data.hasOwnProperty("skipAmount")) ? data.skipAmount : 5000,
        debug = (data.hasOwnProperty('debug')) ? data.debug : false;

    Element.prototype.documentOffsetTop = function () {
        return this.offsetTop + (this.offsetParent ? this.offsetParent.documentOffsetTop() : 0);
    };


    function shuffleArray(a) {
        var j, x, i;
        for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }

    var skipForward = function () {
        document.getElementById(elementName + "-track-" + currentTarget).currentTime += (skipAmount / 1000);
    }
    var skipBackward = function () {
        document.getElementById(elementName + "-track-" + currentTarget).currentTime -= (skipAmount / 1000);
    }
    var playNext = function () {
        togglePlayPause(currentTarget);
        currentTarget = SongList[((SongList.indexOf(currentTarget) + 1) % SongList.length)];
        console.log(currentTarget);
        togglePlayPause(currentTarget);
        switchControls();
    }
    var playPrevious = function () {
        togglePlayPause(currentTarget);
        currentTarget = SongList[((SongList.length + SongList.indexOf(currentTarget) - 1) % SongList.length)];
        console.log(currentTarget);
        togglePlayPause(currentTarget);
        switchControls();
    }
    var toggleLoop = function () {
        loop = !loop;
        var c;
        for (c = 0; c < links.length; c++) {
            document.getElementById(elementName + "-loop-" + c).className = (loop) ? 'fa fa-retweet' : 'fa fa-retweet highlight';
        }
    }
    var toggleShuffle = function () {
        shuffle = !shuffle;

        if (shuffle) {
            shuffleArray(SongList);
        }
        var c;
        for (c = 0; c < links.length; c++) {
            document.getElementById(elementName + "-shuffle-" + c).className = (shuffle) ? 'fa fa-random' : 'fa fa-random highlight';
            if (!shuffle) {
                SongList[c] = c;
            }
        }
    }
    var togglePlayPause = function (number) {
        var track = document.getElementById(elementName + "-track-" + number);
        if (currentTarget == number) {
            if (track.paused) {
                track.play();
                document.getElementById(elementName + "-play-pause-" + number).className = "fa fa-pause";
            } else {
                track.pause();
                document.getElementById(elementName + "-play-pause-" + number).className = "fa fa-play";
            }
        } else {
            document.getElementById(elementName + "-track-" + currentTarget).pause();
            document.getElementById(elementName + "-play-pause-" + currentTarget).className = "fa fa-play";
            document.getElementById(elementName + "-play-pause-" + number).className = "fa fa-pause";
            track.play();
            currentTarget = number;
        }

        var top = document.getElementById(elementName + '-track-' + currentTarget).documentOffsetTop() - (window.innerHeight / 2);
        window.scrollTo(0, top);
    }
    var switchControls = function () {
        if (!alwaysShowControls) {
            var c;
            for (c = 0; c < links.length; c++) {
                document.getElementById(elementName + "-controls-" + c).className = elementName + "-controls " + ((c == currentTarget) ? "" : "hidden");
            }
        }
    }
    var updateProgress = function (percent) {
        document.getElementById(elementName + "-filler-" + currentTarget).style.width = percent + "%";
    }

    var main = function () {
        if (links) {
            if (links.length >= 1) {
                var i;
                currentTarget = 0;
                content = "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'>";
                for (i = 0; i < links.length; i++) {
                    SongList[i] = i;

                    content += "<div class='" + elementName + "-media " + ((showAll) ? "" : ((i == 0) ? "" : "hidden")) + "'>";
                    content += "<div class='" + elementName + "-media-container'>";
                    content += "<" + mediaType + " " + ((mediaType == 'video') ? ((debug) ? "controls" : "") + " width='" + videoWidth + "' height='" + videoHeight + "' " : '' + " " + ((debug) ? "controls" : "")) + " " + ((loop) ? 'loop' : '') + " id='" + elementName + "-track-" + i + "' class='" + elementName + "-track " + ((debug) ? '' : ((mediaType == 'video') ? "center" : "hidden")) + "' >";
                    content += "<source src='" + links[i] + "' > Your browser does not support the HTML5 " + mediaType + " element";
                    content += "<br></" + mediaType + ">";
                    content += "</div>";
                    /******************** Replace this with canvas later ********************/
                    content += "<div id='" + elementName + "-fill-bar-" + i + "' class='" + elementName + "-fill-bar'>";
                    content += "<div id='" + elementName + "-filler-" + i + "' class='" + elementName + "-filler'></div>";
                    content += "</div>";
                    /**************************** Controls **********************************/
                    content += "<div id='" + elementName + "-controls-" + i + "' class='" + elementName + "-controls " + ((alwaysShowControls) ? '' : ((i == 0) ? "" : "hidden")) + "'>";
                    content += "<i id='" + elementName + "-back-" + i + "' class='fa fa-fast-backward'></i>";
                    content += "<i id='" + elementName + "-rwd-" + i + "' class='fa fa-backward'></i>";
                    content += "<i id='" + elementName + "-play-pause-" + i + "' class='fa fa-play'></i>";
                    content += "<i id='" + elementName + "-fwd-" + i + "' class='fa fa-forward'></i>";
                    content += "<i id='" + elementName + "-skip-" + i + "' class='fa fa-fast-forward'></i>";
                    content += "<i id='" + elementName + "-loop-" + i + "' class='fa fa-retweet " + ((loop) ? '' : 'highlight') + "'></i>";
                    content += "<i id='" + elementName + "-shuffle-" + i + "' class='fa fa-random " + ((shuffle) ? '' : 'highlight') + "'></i>";
                    content += "<span id='" + elementName + "-time-" + i + "' class='" + elementName + "-time'><h5>0:00</h5></span>"
                    content += "</div>";
                    content += "</div>";
                    content += "</div>";
                }
                content += "<style>";
                content += "i{cursor: pointer; margin-left: 10px; margin-top: 10px}";
                content += ".highlight{color:" + songBarHighlight + "}";
                content += "." + elementName + "-media{padding:5px; margin 10px auto; color: " + songBarColor + "; background-color:" + songBarBackground + "; border:" + songBarBorder + "; border-radius:" + songBarRadius + "}";
                content += "." + elementName + "-fill-bar{height:" + progressBarHeight + ";background-color:" + progressBarBackground + ";width:100%;border:" + progressBarBorder + ";border-radius:" + progressBarRadius + "}";
                content += "." + elementName + "-filler{float:left; height:calc(" + (progressBarHeight.slice(0, -2) - (progressBarBorder.split(" ")[0].split('').slice(0, -2).join() * 2)) + "px);background-color:" + progressBarColor + "}";
                content += "." + elementName + "-controls{text-align:left; width: 100%; color:" + songBarColor + "}";
                content += "." + elementName + "-time{float: right; margin-right: 10px}"
                content += "</style>";
                /*************** Manual Styling for now ***************/
                document.getElementById(elementName).style.width = "75%";
                document.getElementById(elementName).style.margin = "0 auto";
                document.getElementById(elementName).style.textAlign = "center";

                document.getElementById(elementName).innerHTML = content;
                if (shuffle) {
                    shuffleArray(SongList);
                }
                var c;
                for (c = 0; c < links.length; c++) { //hehe...
                    document.getElementById(elementName + "-track-" + c).onclick = function () {
                        var number = this.id.slice(this.id.lastIndexOf('-') + 1);
                        togglePlayPause(number);
                    }
                    document.getElementById(elementName + "-track-" + c).addEventListener("ended", function () {
                        switchControls();
                        document.getElementById(elementName + "-track-" + currentTarget).currentTime = 0;
                        document.getElementById(elementName + "-track-" + currentTarget).play();
                        if (!loop) {
                            playNext();
                        }
                    })
                    document.getElementById(elementName + "-track-" + c).addEventListener('timeupdate', function () {
                        var ms = this.currentTime;

                        var min = (ms / 60) << 0,
                            sec = (ms) % 60;
                        document.getElementById(elementName + '-time-' + currentTarget).innerHTML = (((min > 0) ? min : "0") + ":" + ((sec >= 10) ? Math.floor(sec) : "0" + Math.floor(sec)));
                        var per = (100 * (document.getElementById(elementName + "-track-" + currentTarget)).currentTime / (document.getElementById(elementName + "-track-" + currentTarget)).duration);
                        updateProgress(per);
                    }, false);

                    document.getElementById(elementName + "-back-" + c).onclick = function () {
                        var number = this.id.slice(this.id.lastIndexOf('-') + 1);
                        playPrevious();
                    }
                    document.getElementById(elementName + "-rwd-" + c).onclick = function () {
                        var number = this.id.slice(this.id.lastIndexOf('-') + 1);
                        skipBackward();
                    }
                    document.getElementById(elementName + "-play-pause-" + c).onclick = function () {
                        var number = this.id.slice(this.id.lastIndexOf('-') + 1);
                        togglePlayPause(number);
                    }
                    document.getElementById(elementName + "-fwd-" + c).onclick = function () {
                        var number = this.id.slice(this.id.lastIndexOf('-') + 1);
                        skipForward();
                    }
                    document.getElementById(elementName + "-skip-" + c).onclick = function () {
                        var number = this.id.slice(this.id.lastIndexOf('-') + 1);
                        playNext();
                    }
                    document.getElementById(elementName + "-loop-" + c).onclick = function () {
                        var number = this.id.slice(this.id.lastIndexOf('-') + 1);
                        toggleLoop();
                    }
                    document.getElementById(elementName + "-shuffle-" + c).onclick = function () {
                        var number = this.id.slice(this.id.lastIndexOf('-') + 1);
                        toggleShuffle();
                    }

                }
                //                document.activeElement = document.getElementById(elementName);
                document.getElementById(elementName).tabIndex = 1;

                document.getElementById(elementName).onkeydown = function (e) {
                    var key = e.keyCode ? e.keyCode : e.which;
                    var locker;
                    //                    console.log("Key " + key + " was pressed on " + elementName);

                    if (!locker) {
                        switch (key) {
                        case 13:
                        case 32:
                            locker = true;
                            togglePlayPause(currentTarget);
                            e.preventDefault();
                            return false;
                            break;
                        case 39:
                            locker = true;
                            playNext();
                            break;
                        case 37:
                            locker = true;
                            //left arrow
                            playPrevious();
                            break;
                        case 83:
                            locker = true;
                            //'s'
                            toggleShuffle();
                            break;
                        case 82:
                        case 76:
                            locker = true;
                            toggleLoop();
                            break;
                        }
                        setTimeout(function () {
                            locker = false
                        }, 200);
                    }

                }

            } else {
                console.error("Playlist-js: Links Array must have at least one item");
            }
        } else {
            //            console.error("Playlist-js: You must provide an array of links or the folder name");
            console.error("Playlist-js: You must provide an array of links");
        }
    }

    if (document.getElementById(elementName)) {
        if (mediaType != 'audio' && mediaType != 'video') {
            console.error('Playlist-js: the mediaType must be either audio or video');
        } else {
            console.log("Playlist-js: Media type is " + mediaType);
            main();
        }

    } else {
        console.error("Playlist-js: You must include an elementName in the constructor");
    }
}