/**COPYRIGHT 2016 - THOMAS FEUERBORN
ALL RIGHTS RESERVED


*/

var _lock = false;

var Playlist = function (data) {
    if (!_lock) {
        //        _lock = true;
        var SongList = [],
            elementName = (data.hasOwnProperty('elementName')) ? data.elementName : 'playlist',
            currentSong = -1,
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
            if (currently_playing.indexOf(true) == -1) {
                currently_playing[0] = true;
            }
            var track = document.getElementById(elementName + '-track-' + currently_playing.indexOf(true));
            track.currentTime += (skipAmount / 1000);
        }

        Element.prototype.documentOffsetTop = function () {
            return this.offsetTop + (this.offsetParent ? this.offsetParent.documentOffsetTop() : 0);
        };

        var switchControls = function () {
            //        ((i == SongList[currentSong]) ? "" : "hidden")
            if (!alwaysShowControls) {

                var i;
                for (i = 0; i < document.getElementsByClassName(elementName + '-controls').length; i++) {
                    document.getElementsByClassName(elementName + '-controls')[i].className = "controls left " + ((currently_playing[i]) ? "" : "hidden")
                }

                if (showAll) {
                    var top = document.getElementById(elementName + '-media-' + currently_playing.indexOf(true)).documentOffsetTop() - (window.innerHeight / 2);
                    window.scrollTo(0, top);

                    //        document.getElementById(elementName+'-media-'+currently_playing.indexOf(true)).scrollIntoView({
                    //            behavior: "smooth",
                    //            block: "start"
                    //        });
                }
            }
        }

        var playNext = function () {
            var track = document.getElementById(elementName + "-track-" + SongList[currentSong]),
                play_pause = document.getElementById(elementName + "-play-pause-button-" + SongList[currentSong]);

            track.pause();
            track.currentTime = 0;
            play_pause.className = "player fa fa-play";
            currently_playing[SongList[currentSong]] = false;
            currentSong++;
            currentSong = currentSong % SongList.length;
            currently_playing[SongList[currentSong]] = true;

            var tracks = document.getElementsByClassName(elementName + '-media');
            var x;
            for (x = 0; x < tracks.length; x++) {
                var xtrack = tracks[x];
                if (!showAll) {
                    if (currently_playing[x]) {
                        xtrack.className = elementName + '-media';
                    } else {
                        xtrack.className = elementName + '-media hidden';
                    }
                }
            }

            var next = document.getElementById(elementName + '-track-' + SongList[currentSong]);
            next.play();
            document.getElementById(elementName + '-play-pause-button-' + SongList[currentSong]).className = "player fa fa-pause";
            switchControls();

            //console.log("Now Playing song: " + SongList[currentSong]);
        }

        var playPrevious = function () {
            //check to see if the time that has passed from the start is less than 2 seconds, and either restart or go to the previous member of the array
            if (currently_playing.indexOf(true) >= 0) {
                var track = document.getElementById(elementName + '-track-' + currently_playing.indexOf(true)),
                    play_pause = document.getElementById(elementName + "-play-pause-button-" + SongList[currentSong]);
                if ((track.currentTime % 60) > 1) {
                    track.currentTime = 0;
                } else {
                    var wasPaused = track.paused;
                    track.pause();
                    track.currentTime = 0;
                    play_pause.className = "player fa fa-play";
                    currently_playing[SongList[currentSong]] = false;
                    currentSong += SongList.length - 1;
                    currentSong = currentSong % SongList.length;
                    currently_playing[SongList[currentSong]] = true;

                    var tracks = document.getElementsByClassName(elementName + '-media');
                    var x;
                    for (x = 0; x < tracks.length; x++) {
                        var xtrack = tracks[x];
                        if (!showAll) {
                            if (currently_playing[x]) {
                                xtrack.className = elementName + '-media';
                            } else {
                                xtrack.className = elementName + '-media hidden';
                            }
                        }
                    }

                    var next = document.getElementById(elementName + '-track-' + SongList[currentSong]);
                    if (!wasPaused) {
                        next.play();
                        document.getElementById(elementName + '-play-pause-button-' + SongList[currentSong]).className = "player fa fa-pause";
                    }
                }
                switchControls();
            } else {
                var track = document.getElementById(elementName + '-track-' + SongList[currentSong]),
                    play_pause = document.getElementById(elementName + "-play-pause-button-" + SongList[currentSong]);
                if ((track.currentTime % 60) > 1) {
                    track.currentTime = 0;
                } else {
                    var wasPaused = track.paused;
                    track.pause();
                    track.currentTime = 0;
                    play_pause.className = "player fa fa-play";
                    currently_playing[SongList[currentSong]] = false;
                    currentSong += SongList.length - 1;
                    currentSong = currentSong % SongList.length;
                    currently_playing[SongList[currentSong]] = true;

                    var tracks = document.getElementsByClassName(elementName + '-media');
                    var x;
                    for (x = 0; x < tracks.length; x++) {
                        var xtrack = tracks[x];
                        if (!showAll) {
                            if (currently_playing[x]) {
                                xtrack.className = elementName + '-media';
                            } else {
                                xtrack.className = elementName + '-media hidden';
                            }
                        }
                    }

                    var next = document.getElementById(elementName + '-track-' + SongList[currentSong]);
                    if (!wasPaused) {
                        next.play()
                        document.getElementById(elementName + '-play-pause-button-' + SongList[currentSong]).className = "player fa fa-pause";
                    }
                }
            }
        }

        var skipBackward = function () {
            if (currently_playing.indexOf(true) == -1) {
                currently_playing[0] = true;
            }
            var track = document.getElementById(elementName + '-track-' + currently_playing.indexOf(true));
            track.currentTime -= (skipAmount / 1000);
        }

        var loopToggle = function () {
            if (currently_playing.indexOf(true) == -1) {
                currently_playing[0] = true;
            } //prevent a massive error
            loop = !loop;
            var c;
            for (c = 0; c < document.getElementsByClassName(elementName + '-loop').length; c++) {
                document.getElementsByClassName(elementName + '-loop')[c].className = (loop) ? 'fa fa-retweet player' : 'fa fa-retweet player highlight';
            }
            //        document.getElementById(elementName+'-loop-button-' + (currently_playing.indexOf(true))).className = (loop) ? 'fa fa-retweet player' : 'fa fa-retweet player highlight';

        }

        var shuffleToggle = function (sh) {
            var c;
            if (sh != null) {
                for (c = 0; c < document.getElementsByClassName(elementName + '-loop').length; c++) {
                    if (sh) {
                        document.getElementsByClassName(elementName + '-loop')[c].className = "fa fa-random player";
                    } else {
                        document.getElementsByClassName(elementName + '-loop')[c].className = "fa fa-random player highlight";
                    }
                }
            } else {
                shuffle = !shuffle;
                if (shuffle) {
                    shuffleArray(SongList);
                    var x, temp = currently_playing.indexOf(true);
                    if (temp == -1) {
                        temp = 0;
                        currently_playing[0] = true;
                    }

                    currentSong = SongList.indexOf(temp);
                } else {
                    var t;
                    currentSong = SongList[currentSong];
                    for (t = 0; t < SongList.length; t++) {
                        SongList[t] = t;
                        if (t == currentSong) {
                            currently_playing[t] = true;
                        } else {
                            currently_playing[t] = false;
                        }
                    }
                }

                var tracks = document.getElementsByClassName(elementName + '-media');
                var x;
                for (x = 0; x < tracks.length; x++) {
                    var xtrack = tracks[x];
                    if (!showAll) {
                        if (currently_playing[x]) {
                            xtrack.className = elementName + '-media';
                        } else {
                            xtrack.className = elementName + '-media hidden';
                        }
                    }
                }
                currently_playing[SongList[currentSong]] = true;

                var next = document.getElementById(elementName + '-track-' + SongList[currentSong]);
                for (c = 0; c < document.getElementsByClassName(elementName + '-loop').length; c++) {
                    if (shuffle) {
                        document.getElementsByClassName(elementName + '-loop')[c].className = "fa fa-random player";
                    } else {
                        document.getElementsByClassName(elementName + '-loop')[c].className = "fa fa-random player highlight";
                    }
                }
            }

        }

        var PlaylistElement = document.getElementById(elementName);
        var currently_playing = [];
        if (PlaylistElement) {

            /*JQUERY CODE IS HERE, COMMENT OUT TO LINE 505-ish*/

            if (mediaType != 'audio' && mediaType != 'video') {
                console.error('Playlist-js: the mediaType must be either audio or video');
            } else {
                console.error("Playlist-js: Media type is " + mediaType);
            }

            var main = function () {
                if (links) {
                    if (links.length == 0) {
                        console.error("Playlist-js: Links array must contain at least one item");
                    } else {
                        currentSong = 0;
                        var i = 0;
                        for (i = 0; i < links.length; i++) {
                            SongList[i] = i;
                        }
                        if (shuffle) {
                            shuffleArray(SongList);
                        }
                        var cockroach = "";
                        content = "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'>";
                        for (i = 0; i < links.length; i++) {
                            //console.log("i:" + i + " - currentSong: " + currentSong + " - SongList[currentSong]:" + SongList[currentSong]);
                            currently_playing[i] = false;
                            content += "<div class='media " + ((showAll) ? "" : ((i == SongList[currentSong]) ? "" : "hidden")) + "' id='" + elementName + "-media-" + i + "'>";
                            content += "<div class='media-container'><" + mediaType + " " + ((mediaType == 'video') ? "width='" + videoWidth + "' height='" + videoHeight + "' " : '') + " " + ((debug) ? "controls" : "") + " " + ((loop) ? 'loop' : '') + " class = 'track " + ((debug) ? '' : ((mediaType == 'video') ? "center" : "hidden")) + "' id = '" + elementName + "-track-" + i + "' > ";

                            content += "<source src='" + links[i] + "' > Your browser does not support the HTML5 " + mediaType + " element</" + mediaType + "></div><br>";
                            content += "<div                       id='" + elementName + "-trackpercent-" + i + "'      class='" + elementName + "-trackpercent'>"
                            content += "<div                       id='" + elementName + "-fillpercent-" + i + "'       class='" + elementName + "-fillpercent'></div></div><br>";
                           
                            content += "<div clear='both'><span    id='" + elementName + "-controls-" + i + "'          class='" + elementName + "-controls left " + ((alwaysShowControls) ? '' : ((i == SongList[currentSong]) ? "" : "hidden")) + "'>"
                            content += "<i style='cursor: pointer' id='" + elementName + "-fback-button-" + i + "'      class='fa fa-fast-backward player'></i>";
                            content += "<i style='cursor: pointer' id='" + elementName + "-back-button-" + i + "'       class='fa fa-backward player'></i>";
                            content += "<span                      id='" + elementName + "-play-pause-" + i + "'        class='" + elementName + "-play-pause'>";
                            content += "<i style='cursor: pointer' id='" + elementName + "-play-pause-button-" + i + "'   class='fa fa-play player'></i>";
                            content += "</span>";
                            content += "<i style='cursor: pointer' id='" + elementName + "-fwd-button-" + i + "'          class='fa fa-forward player'></i>";
                            content += "<i style='cursor: pointer' id='" + elementName + "-ffwd-button-" + i + "'         class='fa fa-fast-forward player'></i>";
                            content += "<i style='cursor: pointer' id='" + elementName + "-shuffle-button-" + i + "'      class='fa fa-random player " + ((shuffle) ? '' : 'highlight') + "'></i>";
                            content += "<i style='cursor: pointer' id='" + elementName + "-loop-button-" + i + "'         class='" + elementName + "-loop fa fa-retweet player " + ((loop) ? '' : 'highlight') + "'></i>";
                            content += "</span><span               id='" + elementName + "-tracktime-" + i + "'         class='right'>0:00</span></div>";
                            content += (displayName) ? "<div><p>" + links[i].split('/')[links[i].split('/').length - 1].replace(/%20/g, ' ').replace(/%5B/g, '[').replace(/%5D/g, ']').slice(0, links[i].lastIndexOf('.') - links[i].length) + "</p></div>" : "";
                            content += "</div>";

                            /*******************Debugging stuffs*********************/

                        }
                        content += "<style>"
                        content += "i{float:left}
                            .media{padding: 5px; margin: 10px auto;border: " + songBarBorder + ";width:" + ((data.hasOwnProperty('width')) ? data.width : "75%") + ";background-color:" + songBarBackground + "; color:" + songBarColor + "; border-radius:" + songBarRadius + "}
                        .hidden{visibility: hidden; display:none; padding: 0; margin: 0;}
                        .left{float:left}
                        .right{float:right}
                        .player{padding-left:5px;padding-right:5px}
                        .highlight{color:" + songBarHighlight + "}
                        .clear-left{clear: left}
                        ."+elementName+"-trackpercent{background-color: " + progressBarBackground + ";height:" + progressBarHeight + "; width:100%; border:" + progressBarBorder + "; border-radius:" + progressBarRadius + "}
                        ."+elementName+"-trackpercent>div{float:left; height:20px; background-color: '" + progressBarColor + "'}
                        .center{width:100%; margin: 0 auto}
                        .media-container{width:100%}
                        ."+elementName+"-track{cursor:pointer;" + ((mediaType == 'video') ? 'border:' + videoborder : '') + "}"
                        content += "</style>";
                        PlaylistElement.innerHTML = content + "<br>" + cockroach;

                        var tracks = document.getElementsByClassName(elementName + '-track');
                        shuffleToggle(shuffle);

                        var c;

                        for (c = 0; c < document.getElementsByClassName(elementName + '-track').length; c++) {
                            document.getElementById(elementName + '-track-' + c).onclick = function () {
                                //console.log(this.id);
                                var patt = /track\-[0-9]+/g;
                                if (this.id.match(patt)) {
                                    var song_number = /[0-9]+/g.exec(this.id)[0];
                                    currentSong = SongList.indexOf(Math.floor(song_number));
                                    //console.log(song_number);
                                    //console.log(currently_playing.length);
                                    var a;
                                    for (a = 0; a < currently_playing.length; a++) {
                                        if (a != song_number) {
                                            currently_playing[a] = false;
                                        }
                                    }
                                    currently_playing[song_number] = !currently_playing[song_number];
                                    for (a = 0; a < currently_playing.length; a++) {
                                        var track = document.getElementById(elementName + "-track-" + a),
                                            play_pause = document.getElementById(elementName + "-play-pause-button-" + a);
                                        if (currently_playing[a]) {
                                            play_pause.className = "player fa fa-pause";
                                            track.play();
                                        } else {
                                            play_pause.className = "player fa fa-play";
                                            track.pause();
                                        }
                                    }
                                }

                            }
                            document.getElementById(elementName + '-play-pause-' + c).onclick = function () {
                                //console.log(this.id);
                                var patt = /play\-pause\-[0-9]+/g;
                                if (this.id.match(patt)) {
                                    var song_number = /[0-9]+/g.exec(this.id)[0];
                                    currentSong = SongList.indexOf(Math.floor(song_number));
                                    //console.log(song_number);
                                    //console.log(currently_playing.length);
                                    var a;
                                    for (a = 0; a < currently_playing.length; a++) {
                                        if (a != song_number) {
                                            currently_playing[a] = false;
                                        }
                                    }
                                    currently_playing[song_number] = !currently_playing[song_number];
                                    for (a = 0; a < currently_playing.length; a++) {
                                        var track = document.getElementById(elementName + "-track-" + a),
                                            play_pause = document.getElementById(elementName + "-play-pause-button-" + a);
                                        if (currently_playing[a]) {
                                            play_pause.className = "player fa fa-pause";
                                            track.play();
                                        } else {
                                            play_pause.className = "player fa fa-play";
                                            track.pause();
                                        }
                                    }
                                }
                            }
                            document.getElementById(elementName + '-fwd-button-' + c).onclick = function () {
                                skipForward();
                            }
                            document.getElementById(elementName + '-back-button-' + c).onclick = function () {
                                skipBackward();
                            }
                            document.getElementById(elementName + '-shuffle-button-' + c).onclick = function () {
                                shuffleToggle();
                            }
                            document.getElementById(elementName + '-loop-button-' + c).onclick = function () {
                                loopToggle();
                            }
                            document.getElementById(elementName + '-ffwd-button-' + c).onclick = function () {
                                playPrevious();
                            }
                            document.getElementById(elementName + '-fback-button-' + c).onclick = function () {
                                var track = document.getElementById(elementName + '-track-' + SongList[currentSong]),
                                    play_pause = document.getElementById(elementName + "-play-pause-button-" + SongList[currentSong]);
                                if (!track.paused) {
                                    play_pause.className = "player fa fa-play";
                                }
                                playNext();
                            }

                            var tk = document.getElementById(elementName + '-track-' + c);

                            //console.log(tk.id);

                            tk.addEventListener('timeupdate', function () {
                                var ms = this.currentTime;

                                var min = (ms / 60) << 0,
                                    sec = (ms) % 60;

                                var TID = (this.id.match(/\d/g).toString().replace(/,/g, ""));

                                document.getElementById(elementName + '-tracktime-' + TID).innerHTML = (((min > 0) ? min : "0") + ":" + ((sec >= 10) ? Math.floor(sec) : "0" + Math.floor(sec)));
                                //console.log(Math.floor(100 * (document.getElementById(elementName+"-track-" + TID)).currentTime / (document.getElementById(elementName+"-track-" + TID)).duration));
                                var per = Math.ceil(100 * (document.getElementById(elementName + "-track-" + TID)).currentTime / (document.getElementById(elementName + "-track-" + TID)).duration);
                                document.getElementById(elementName + '-fillpercent-' + [TID]).style.width = (((per <= 100) ? per : 100) + "%");
                                document.getElementById(elementName + '-fillpercent-' + [TID]).style.height = "100%";
                                document.getElementById(elementName + '-fillpercent-' + [TID]).style.backgroundColor = progressBarColor;


                            }, false);

                            tk.addEventListener('ended', function () {
                                if (loop) {
                                    document.getElementById(elementName + '-track-' + currently_playing.indexOf(true)).currentTime = 0;
                                    document.getElementById(elementName + '-track-' + currently_playing.indexOf(true)).play();
                                } else {
                                    playNext();
                                }
                            })

                            window.onkeydown = function (e) { //prevent screen from scrolling when pressing the spacebar
                                if (e.keyCode == 32 && e.target == document.body) {
                                    e.preventDefault();
                                    return false;
                                }
                            };

                            window.onkeyup = function (e) {
                                var key = e.keyCode ? e.keyCode : e.which;
                                var locker;

                                if (!locker) {
                                    locker = true;
                                    //console.log('Space was pressed');
                                    switch (key) {
                                    case 13:
                                    case 32:
                                        var c;
                                        if (currently_playing.indexOf(true) == -1) {
                                            var track = document.getElementById(elementName + '-track-' + SongList[currentSong]),
                                                play_pause = document.getElementById(elementName + "-play-pause-button-" + SongList[currentSong]);
                                            currently_playing[SongList[currentSong]] = true;
                                            track.play();
                                            play_pause.className = "player fa fa-pause";
                                        } else {
                                            for (c = 0; c < currently_playing.length; c++) {
                                                if (currently_playing[c]) {
                                                    var track = document.getElementById(elementName + '-track-' + c),
                                                        play_pause = document.getElementById(elementName + "-play-pause-button-" + c);
                                                    if (track.paused) {
                                                        //console.log("playing");
                                                        track.play();
                                                        play_pause.className = "player fa fa-pause";
                                                    } else {
                                                        //console.log("pausing");
                                                        track.pause();
                                                        play_pause.className = "player fa fa-play";
                                                    }
                                                }
                                            }
                                        }
                                        e.preventDefault();
                                        return false;
                                        break;
                                    case 39:
                                        var track = document.getElementById(elementName + '-track-' + SongList[currentSong]),
                                            play_pause = document.getElementById(elementName + "-play-pause-button-" + SongList[currentSong]);
                                        if (!track.paused) {
                                            play_pause.className = "player fa fa-play";
                                        }
                                        playNext();
                                        break;
                                    case 37:
                                        //left arrow
                                        playPrevious();
                                        break;
                                    case 83:
                                        //'s'
                                        shuffleToggle();
                                        break;
                                    case 82:
                                    case 76:
                                        loopToggle();
                                        break;
                                    }
                                    setTimeout(function () {
                                        locker = false
                                    }, 200);
                                }

                            }

                        }
                    }
                } else {
                    console.error("Playlist-jf: JSON Object does not contain an array of links");
                }
            }

            //            if (folder) {
            //                console.error('This functionality requires JQuery to be used, and for the purposes of this assignment have been shut off. (<sarcasm>Thanks Mr. Beatty</sarcasm>)')
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
            //                        console.log(links);
            //
            //                        main();
            //
            //                    },
            //                    error: function (xlh) {
            //                        console.error("ERROR: " + xlh);
            //                    }
            //                });
            //            }

            main();

            /************************NON-JQUERY CODE*************************/


        } else {
            console.error("Playlist-js: You must provide an elementName in the Playlist Constructor or create a div with id of playlist");
        }
    } else {
        console.error('Playlist-js: You may only have one playlist per page (Kinda lame, I know... I\'m working on a solution though!)')
    }
}

/********** CODE FOR JQUERY IMPLEMENTATION **********/