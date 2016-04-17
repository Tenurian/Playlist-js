var Playlist = function (data) {
    var SongList = [],
        elementName = (data.hasOwnProperty('elementName')) ? data.elementName : false,
        currentTarget = -1,
        width = (data.hasOwnProperty('width')) ? data.width : "1000px",
        folder = (data.hasOwnProperty('folder')) ? data.folder : null,
        mediaType = (data.hasOwnProperty('mediaType')) ? data.mediaType : 'audio',
        extension = (data.hasOwnProperty('filetype')) ? data.filetype : (mediaType == 'audio') ? '.mp3' : '.mp4',
        focusPlaying = (data.hasOwnProperty('focusPlaying')) ? data.focusPlaying : false,
        shuffle = (data.hasOwnProperty('shuffle')) ? data.shuffle : false,
        loop = (data.hasOwnProperty('loop')) ? data.loop : false,
        links = (data.hasOwnProperty('links')) ? data.links : false,
        showAll = (data.hasOwnProperty('showAll')) ? data.showAll : true,
        alwaysShowControls = (data.hasOwnProperty('alwaysShowControls')) ? data.alwaysShowControls : true,
        controlsSize = (data.hasOwnProperty('controlsSize')) ? data.controlsSize : 0,
        fontSize = (data.hasOwnProperty('fontSize')) ? data.fontSize : false,
        displayName = (data.hasOwnProperty('displayName')) ? data.displayName : true,
        progressBarHeight = (data.hasOwnProperty('progressBarHeight')) ? data.progressBarHeight : "30px",
        progressBarWidth = ((data.hasOwnProperty('progressBarWidth')) ? data.progressBarWidth : ((width.indexOf('%') > -1) ? .9 * (window.innerWidth * ((width.slice(0, (width.indexOf('%')))) / 100)) : (Math.ceil(Number(width.slice(0, -2)) * .9))) + "px"),
        progressBarColor = (data.hasOwnProperty('progressBarColor')) ? data.progressBarColor : "#3f79e0",
        progressBarBorder = (data.hasOwnProperty('progressBarBorder')) ? data.progressBarBorder : "3px solid" + progressBarColor,
        progressBarBackground = (data.hasOwnProperty('progressBarBackground')) ? data.progressBarBackground : "#4a4a4a",
        progressBarRadius = (data.hasOwnProperty('progressBarRadius')) ? data.progressBarRadius : "2px",
        songBarBackground = (data.hasOwnProperty('songBarBackground')) ? data.songBarBackground : "#000",
        songBarColor = (data.hasOwnProperty('songBarColor')) ? data.songBarColor : "#FFF",
        songBarHighlight = (data.hasOwnProperty('songBarHighlight')) ? data.songBarHighlight : "#aaa",
        songBarBorder = (data.hasOwnProperty('songBarBorder')) ? data.songBarBorder : "2px solid " + songBarHighlight + "",
        songBarRadius = (data.hasOwnProperty('songBarRadius')) ? data.songBarRadius : "5px",
        videoWidth = (data.hasOwnProperty('videoWidth')) ? data.videoWidth : 'auto',
        videoHeight = (data.hasOwnProperty('videoHeight')) ? data.videoHeight : 'auto',
        videoborder = (data.hasOwnProperty('videoborder')) ? data.videoborder : '1px solid ' + songBarHighlight + '',
        skipAmount = (data.hasOwnProperty("skipAmount")) ? data.skipAmount : 5000,
        debug = (data.hasOwnProperty('debug')) ? data.debug : false,
        goFullscreen = false,
        isFullscreen = false,
        mouseIsDown = false;
    Element.prototype.documentOffsetTop = function () {
        return this.offsetTop + (this.offsetParent ? this.offsetParent.documentOffsetTop() : 0);
    };

    var attemptGoFullscreen = function () {
        if (mediaType == "video") {
            var track = document.getElementById(elementName + "-track-" + currentTarget);
            if (track.requestFullscreen) {
                if (isFullscreen) {
                    track.exitFullscreen();
                } else {
                    track.requestFullscreen();
                }
            } else if (track.mozRequestFullScreen) {
                if (isFullscreen) {
                    track.mozCancelFullScreen();
                } else {
                    track.mozRequestFullScreen();
                }
            } else if (track.webkitRequestFullscreen) {
                if (isFullscreen) {
                    track.webkitExitFullscreen();
                } else {
                    track.webkitRequestFullscreen();
                }
            }
            if (track.paused) {
                track.play();
            }
            isFullscreen = !isFullscreen;
        }
    }
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
        var track = document.getElementById(elementName + "-track-" + currentTarget);
        if (track.currentTime + (skipAmount / 1000) < track.duration) {
            track.currentTime += (skipAmount / 1000);
        } else {
            if (loop) {
                track.currentTime = 0;
            } else {
                playNext();
            }
        }
    }
    var skipBackward = function () {
        var track = document.getElementById(elementName + "-track-" + currentTarget);
        if (track.currentTime - (skipAmount / 1000) > 0) {
            track.currentTime -= (skipAmount / 1000);
        } else {
            playPrevious();
        }
    }
    var playNext = function () {
        if (isFullscreen) {
            attemptGoFullscreen();
        }
        if (!document.getElementById(elementName + "-track-" + currentTarget).paused) {
            togglePlayPause(currentTarget);
        }
        currentTarget = SongList[((SongList.indexOf(currentTarget) + 1) % SongList.length)];
        togglePlayPause(currentTarget);
        switchControls();
    }
    var playPrevious = function () {
        if (isFullscreen) {
            attemptGoFullscreen();
        }
        if (!document.getElementById(elementName + "-track-" + currentTarget).paused) {
            togglePlayPause(currentTarget);
        }
        currentTarget = SongList[((SongList.length + SongList.indexOf(currentTarget) - 1) % SongList.length)];
        togglePlayPause(currentTarget);
        switchControls();
    }
    var toggleLoop = function () {
        loop = !loop;
        var c;
        for (c = 0; c < links.length; c++) {
            document.getElementById(elementName + "-loop-" + c).className = (loop) ? 'fa fa-retweet' : 'fa fa-retweet '+elementName+'-highlight';
        }
    }
    var toggleShuffle = function () {
        shuffle = !shuffle;

        if (shuffle) {
            shuffleArray(SongList);
        }
        var c;
        for (c = 0; c < links.length; c++) {
            document.getElementById(elementName + "-shuffle-" + c).className = (shuffle) ? 'fa fa-random' : 'fa fa-random '+elementName+'-highlight';
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
                document.getElementById(elementName + "-play-pause-" + number).className = controlsSize + " fa fa-pause";
            } else {
                track.pause();
                document.getElementById(elementName + "-play-pause-" + number).className = controlsSize + " fa fa-play";
            }
        } else {
            document.getElementById(elementName + "-track-" + currentTarget).pause();
            document.getElementById(elementName + "-play-pause-" + currentTarget).className = controlsSize + " fa fa-play";
            document.getElementById(elementName + "-play-pause-" + number).className = controlsSize + " fa fa-pause";
            track.play();
            currentTarget = number;
        }
        if (focusPlaying) {
            var top = document.getElementById(elementName + '-track-' + currentTarget).documentOffsetTop() - (window.innerHeight / 2);
            window.scrollTo(0, top);
        }
    }
    var switchControls = function () {
        var c;
        if (!alwaysShowControls) {
            for (c = 0; c < links.length; c++) {
                document.getElementById(elementName + "-controls-" + c).className = elementName + "-controls " + ((c == currentTarget) ? "" : "hidden");
            }
        }
        if (!showAll) {
            for (c = 0; c < links.length; c++) {
                document.getElementById(elementName + "-media-" + c).className = elementName + "-media " + ((c == currentTarget) ? "" : " hidden");
            }
        }
    }
    var updateProgress = function (percent) {
        var canvas = document.getElementById(elementName + "-filler-" + currentTarget),
            ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = progressBarColor;
        ctx.fillRect(0, 0, Math.ceil(canvas.width * (percent / 100)), canvas.height);
    }

    /*lel, what are conventions?*/
    var main = function () {
        if (links) {
            if (links.length >= 1) {
                switch (controlsSize) {
                case 0:
                    controlsSize = "";
                    break;
                case 1:
                    controlsSize = "fa-lg";
                    break;
                    break;
                case 2:
                    controlsSize = "fa-2x";
                    break;
                case 3:
                    controlsSize = "fa-3x";
                    break;
                case 4:
                    controlsSize = "fa-4x";
                    break;
                case 5:
                    controlsSize = "fa-5x";
                    break;
                default:
                    console.error("Playlist-js: controlsSize must be a number between 0 and 5 (inclusive)");
                    break;
                }
                var i;
                currentTarget = 0;
                content = "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'>";
                for (i = 0; i < links.length; i++) {
                    SongList[i] = i;

                    content += "<div id='" + elementName + "-media-" + i + "' class='" + elementName + "-media " + ((showAll) ? "" : ((i == 0) ? "" : "hidden")) + "'>";
                    if (displayName) {
                        content += "<div id='" + elementName + "-name-" + i + "' class='" + elementName + "-name'><h3>" + links[i].replace(/\\/g, '\/').split('/')[links[i].replace(/\\/g, '\/').split('/').length - 1].replace(/%20/g, ' ').replace(/%5B/g, '[').replace(/%5D/g, ']').slice(0, links[i].lastIndexOf('.') - links[i].length) + "</h3></div>";
                    }
                    content += "<div class='" + elementName + "-media-container'>";
                    content += "<" + mediaType + " " + ((mediaType == 'video') ? ((debug) ? "controls" : "") + " width='" + videoWidth + "' height='" + videoHeight + "' " : '' + " " + ((debug) ? "controls" : "")) + " " + ((loop) ? 'loop' : '') + " id='" + elementName + "-track-" + i + "' class='" + elementName + "-track " + ((debug) ? '' : ((mediaType == 'video') ? "center" : "hidden")) + "' preload:'auto'>";
                    content += "<source src='" + links[i] + "' > Your browser does not support the HTML5 " + mediaType + " element";
                    content += "<br></" + mediaType + ">";
                    content += "</div>";
                    /******************************* PlayBar *******************************/

                    content += "<div id='" + elementName + "-fill-bar-" + i + "' class='" + elementName + "-fill-bar'>";
                    content += "<canvas width='" + (Number(progressBarWidth.slice(0, -2)) - (Number(progressBarBorder.split(" ")[0].slice(0, -2)) * 2)) + "' height='" + (progressBarHeight.slice(0, -2) - (progressBarBorder.split(" ")[0].split('').slice(0, -2).join() * 2)) + "' id='" + elementName + "-filler-" + i + "' class='" + elementName + "-filler'>Your browser does not support the html5 canvas element</canvas>";
                    content += "</div>";

                    /**************************** Controls **********************************/
                    content += "<div id='" + elementName + "-controls-" + i + "' class='" + elementName + "-controls " + ((alwaysShowControls) ? '' : ((i == 0) ? "" : "hidden")) + "'>";
                    content += "<i id='" + elementName + "-back-" + i + "' class='fa fa-fast-backward " + controlsSize + "'></i>";
                    content += "<i id='" + elementName + "-rwd-" + i + "' class='fa fa-backward " + controlsSize + "'></i>";
                    content += "<i id='" + elementName + "-play-pause-" + i + "' class='fa fa-play "+elementName+"-highlight " + controlsSize + "'></i>";
                    content += "<i id='" + elementName + "-fwd-" + i + "' class='fa fa-forward " + controlsSize + "'></i>";
                    content += "<i id='" + elementName + "-skip-" + i + "' class='fa fa-fast-forward " + controlsSize + "'></i>";
                    content += "<i id='" + elementName + "-loop-" + i + "' class='fa fa-retweet " + ((loop) ? '' : elementName+'-highlight') + " " + controlsSize + "'></i>";
                    content += "<i id='" + elementName + "-shuffle-" + i + "' class='fa fa-random " + ((shuffle) ? '' : elementName+'-highlight') + " " + controlsSize + "'></i>";
                    content += "<span id='" + elementName + "-loading-" + i + "' ><i class='fa fa-cog fa-spin  fa-fw margin-bottom "+elementName+-"highlight " + controlsSize + "'></i>Loading media...</span>";
                    content += "<span id='" + elementName + "-time-" + i + "' class='" + elementName + "-time'><h5>0:00</h5></span>"
                    content += "</div>";
                    content += "</div>";
                    content += "</div>";
                }
                content += "<style>";
                content += "#" + elementName + "{width:" + width + "; min-width: " + progressBarWidth + "; margin:0 auto; padding: 25px}";
                content += ".fa{text-align:left; cursor: pointer; margin-left: 10px; margin-top: 10px}";
                content += "." + elementName + "-media{padding:5px; margin: 10px auto; color: " + songBarColor + "; background-color:" + songBarBackground + "; border:" + songBarBorder + "; border-radius:" + songBarRadius + "; min-width: " + (Number(Number(progressBarWidth.slice(0, -2)) + (Number(progressBarBorder.split(" ")[0].slice(0, -2)) * 2)) + 20) + "px}";
                content += "." + elementName + "-media-container{text-align:center}";
                content += "." + elementName + "-fill-bar{margin:0 auto;height:" + progressBarHeight + ";background-color:" + progressBarBackground + ";width:" + progressBarWidth + ";border:" + progressBarBorder + ";border-radius:" + progressBarRadius + "}";
                content += "." + elementName + "-filler{float:left; height:calc(" + (progressBarHeight.slice(0, -2) - (progressBarBorder.split(" ")[0].split('').slice(0, -2).join() * 2)) + "px);background-color: transparent; width:100%}";
                content += "." + elementName + "-controls{ width: 100%; color:" + songBarColor + "}";
                content += "." + elementName + "-controls .fa{z-index:3;text-align:left; color:" + songBarColor + "}";
                content += "." + elementName + "-time{float: right; margin-right: 10px}";
                content += "." + elementName + "-time h5{" + ((fontSize) ? "font-size:" + fontSize + "px" : "") + "}";
                content += "." + elementName + "-name{width:100%;text-align:center}";
                content += "." + elementName + "-name>h3{margin-top:10px;padding-top:0; color:" + songBarColor + "}";
                content += "." + elementName + "-highlight{color:" + songBarHighlight + " !important}";
                content += "</style>";
                /*************** Manual Styling for now ***************/
                //                document.getElementById(elementName).style.width = "75%";
                //                document.getElementById(elementName).style.margin = "0 auto";
                //                document.getElementById(elementName).style.textAlign = "center";

                document.getElementById(elementName).innerHTML = content;
                if (shuffle) {
                    shuffleArray(SongList);
                }
                var c;
                for (c = 0; c < links.length; c++) { //hehe...
                    var track = document.getElementById(elementName + "-track-" + c);
                    track.onclick = function () {
                        if (goFullscreen) {
                            attemptGoFullscreen();
                        } else {
                            var number = this.id.slice(this.id.lastIndexOf('-') + 1);
                            togglePlayPause(number);
                            goFullscreen = true;
                            setTimeout(function () {
                                goFullscreen = false
                            }, 200);
                        }
                    }
                    track.addEventListener("ended", function () {
                        switchControls();
                        document.getElementById(elementName + "-track-" + currentTarget).currentTime = 0;
                        document.getElementById(elementName + "-track-" + currentTarget).play();
                        if (!loop) {
                            playNext();
                        }
                    })
                    track.addEventListener('timeupdate', function () {
                        var ms = this.currentTime;

                        var min = (ms / 60) << 0,
                            sec = (ms) % 60;
                        document.getElementById(elementName + '-time-' + currentTarget).innerHTML = "<h5>" + (((min > 0) ? min : "0") + ":" + ((sec >= 10) ? Math.floor(sec) : "0" + Math.floor(sec))) + "</h5>";
                        var per = (100 * (document.getElementById(elementName + "-track-" + currentTarget)).currentTime / (document.getElementById(elementName + "-track-" + currentTarget)).duration);
                        updateProgress(per);
                    }, false);
                    track.onloadeddata = function () {
                        document.getElementById(elementName + "-play-pause-" + this.id.slice(this.id.lastIndexOf('-') + 1, this.id.length)).className = controlsSize + " fa fa-play";
                        document.getElementById(elementName + "-loading-" + this.id.slice(this.id.lastIndexOf('-') + 1, this.id.length)).className = controlsSize + "hidden";
                    }

                    document.getElementById(elementName + "-filler-" + c).addEventListener("mousedown", function (ev) {
                        mouseIsDown = true;
                        if (this.id.slice(this.id.lastIndexOf('-') + 1) != currentTarget) {
                            //                            togglePlayPause();
                            //                            currentTarget = ;
                            togglePlayPause(this.id.slice(this.id.lastIndexOf('-') + 1));

                        }
                        if (document.getElementById(elementName + "-track-" + this.id.slice(this.id.lastIndexOf('-') + 1)).paused) {
                            document.getElementById(elementName + "-track-" + this.id.slice(this.id.lastIndexOf('-') + 1)).play;
                        }
                        var canvas = document.getElementById(elementName + "-filler-" + this.id.slice(this.id.lastIndexOf('-') + 1));
                        var tk = document.getElementById(elementName + "-track-" + this.id.slice(this.id.lastIndexOf('-') + 1));
                        tk.currentTime = Math.ceil(tk.duration * ((ev.clientX - canvas.offsetLeft) / canvas.width));
                    }, false);
                    window.addEventListener("mouseup", function (ev) {
                        mouseIsDown = false;
                    }, false);
                    document.getElementById(elementName + "-filler-" + c).addEventListener("mousemove", function (ev) {
                        if (mouseIsDown) {
                            var canvas = document.getElementById(elementName + "-filler-" + this.id.slice(this.id.lastIndexOf('-') + 1));
                            var tk = document.getElementById(elementName + "-track-" + this.id.slice(this.id.lastIndexOf('-') + 1));
                            tk.currentTime = Math.ceil(tk.duration * ((ev.clientX - canvas.offsetLeft) / canvas.width));
                        }
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
                        case 70:
                            //attempt to go fullscreen
                            attemptGoFullscreen();
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
            console.error("Playlist-js: You must provide an array of links");
        }
    }

    if (document.getElementById(elementName)) {
        if (mediaType != 'audio' && mediaType != 'video') {
            console.error('Playlist-js: the mediaType must be either audio or video');
        } else {
            if (folder) {
                /*
                    The commented code below is the implementation for JQuery
                    For the purposes of this assignment, they have been disabled
                    that being said, I have tested it with both audio and video elements, and everything works
                */
                //                var f = folder;
                //                $.ajax({
                //                    url: f,
                //                    success: function (stuff) {
                //                        links = [];
                //                        if (extension == '.*') {
                //                            $.each(['.3ga', '.aac', '.aiff', '.amr', '.ape', '.asf', '.asx', '.cda', '.dvf', '.flac', '.gp4', '.gp5', '.gpx', '.logic', '.m4a', '.m4b', '.m4p', '.midi', '.mp3', '.ogg', '.pcm', '.rec', '.snd', '.sng', '.uax', '.wav', '.wma', '.wpl'], function (index, value) {
                //                                $(stuff).find("a:contains(" + value + ")").each(function () {
                //                                    var ix = $(this).attr("href");
                //                                    links[index] = ix.replace(/%20/g, " ");
                //                                });
                //                            });
                //                        } else {
                //                            $(stuff).find("a:contains(" + extension + ")").each(function (ind3x, valu3) {
                //                                var ix = $(this).attr("href");
                //                                links[ind3x] = ix.replace(/%20/g, " ");
                //                            });
                //                        }
                //                        main();
                //
                //                    },
                //                    error: function (xlh) {
                //                        console.error("ERROR: " + xlh);
                //                    }
                //                });

                /*disable this call if JQUERY is enabled*/
                console.error('This functionality requires JQuery to be used, and for the purposes of this assignment have been shut off. (<sarcasm>Thanks Mr. Beatty</sarcasm>)');
                main();
            } else {
                main();
            }
        }

    } else {
        console.error("Playlist-js: You must include an elementName in the constructor");
    }
}