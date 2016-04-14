/**COPYRIGHT 2016 - THOMAS FEUERBORN
ALL RIGHTS RESERVED


*/

var Playlist = function (data) {
    var SongList = [],
        currentSong = -1,
        shuffle = (data.hasOwnProperty('shuffle')) ? data.shuffle : false,
        loop = ((data.hasOwnProperty('loop')) ? data.loop : false) ? 'loop' : '',
        autoplay = (data.hasOwnProperty('autoplay')) ? data.autoplay : false,
        links = (data.hasOwnProperty('links')) ? data.links : false,
        showAll = (data.hasOwnProperty('showAll')) ? data.showAll : false,
        displayName = (data.hasOwnProperty('displayName')) ? data.displayName : true,
        debug = (data.hasOwnProperty('debug')) ? data.debug : false;
    //console.log(loop);

    function shuffleArray(a) {
        var j, x, i;
        for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }

    var playNext = function () {
        var track = document.getElementById("track-" + SongList[currentSong]),
            play_pause = document.getElementById("play-pause-button-" + SongList[currentSong]);

        track.pause();
        track.currentTime = 0;
        play_pause.className = "player fa fa-play";
        currently_playing[SongList[currentSong]] = false;
        currentSong++;
        currentSong = currentSong % SongList.length;
        currently_playing[SongList[currentSong]] = true;

        var tracks = document.getElementsByClassName('song');
        var x;
        for (x = 0; x < tracks.length; x++) {
            var xtrack = tracks[x];
            if (!showAll) {
                if (currently_playing[x]) {
                    xtrack.className = 'song';
                } else {
                    xtrack.className = 'song hidden';
                }
            }
        }

        var next = document.getElementById('track-' + SongList[currentSong]);
        next.play();
        document.getElementById('play-pause-button-' + SongList[currentSong]).className = "player fa fa-pause";

        //console.log("Now Playing song: " + SongList[currentSong]);
    }

    var playPrevious = function () {
        //check to see if the time that has passed from the start is less than 2 seconds, and either restart or go to the previous member of the array
        if (currently_playing.indexOf(true) >= 0) {
            var track = document.getElementById('track-' + currently_playing.indexOf(true)),
                play_pause = document.getElementById("play-pause-button-" + SongList[currentSong]);
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

                var tracks = document.getElementsByClassName('song');
                var x;
                for (x = 0; x < tracks.length; x++) {
                    var xtrack = tracks[x];
                    if (!showAll) {
                        if (currently_playing[x]) {
                            xtrack.className = 'song';
                        } else {
                            xtrack.className = 'song hidden';
                        }
                    }
                }

                var next = document.getElementById('track-' + SongList[currentSong]);
                if (!wasPaused) {
                    next.play();
                    document.getElementById('play-pause-button-' + SongList[currentSong]).className = "player fa fa-pause";
                }
            }
        } else {
            var track = document.getElementById('track-' + SongList[currentSong]),
                play_pause = document.getElementById("play-pause-button-" + SongList[currentSong]);
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

                var tracks = document.getElementsByClassName('song');
                var x;
                for (x = 0; x < tracks.length; x++) {
                    var xtrack = tracks[x];
                    if (!showAll) {
                        if (currently_playing[x]) {
                            xtrack.className = 'song';
                        } else {
                            xtrack.className = 'song hidden';
                        }
                    }
                }

                var next = document.getElementById('track-' + SongList[currentSong]);
                if (!wasPaused) {
                    next.play()
                    document.getElementById('play-pause-button-' + SongList[currentSong]).className = "player fa fa-pause";
                }
            }
        }
    }

    var shuffleToggle = function (sh) {

        var c;
        if (sh) {
            for (c = 0; c < document.getElementsByClassName('fa-random').length; c++) {
                if (sh) {
                    document.getElementsByClassName('fa-random')[c].className = "fa fa-random player highlight";
                } else {
                    document.getElementsByClassName('fa-random')[c].className = "fa fa-random player";
                }
            }
        } else {
            shuffle = !shuffle;
            if (shuffle) {
                shuffleArray(SongList);
                var x, temp = currently_playing.indexOf(true);
                //                for (x = 0; x < currently_playing.length; x++) {
                //                    currently_playing[x] = false;
                //                }
                //                //console.log(temp);
                //                currently_playing[SongList.indexOf(temp)] = true;
                currentSong = SongList.indexOf(temp);
                //console.log(currentSong);
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

            var tracks = document.getElementsByClassName('song');
            var x;
            for (x = 0; x < tracks.length; x++) {
                var xtrack = tracks[x];
                if (!showAll) {
                    if (currently_playing[x]) {
                        xtrack.className = 'song';
                    } else {
                        xtrack.className = 'song hidden';
                    }
                }
            }
            currently_playing[SongList[currentSong]] = true;

            var next = document.getElementById('track-' + SongList[currentSong]);
            for (c = 0; c < document.getElementsByClassName('fa-random').length; c++) {
                if (shuffle) {
                    document.getElementsByClassName('fa-random')[c].className = "fa fa-random player highlight";
                } else {
                    document.getElementsByClassName('fa-random')[c].className = "fa fa-random player";
                }
            }
        }

        //console.log(SongList);
        //console.log(currently_playing);

    }

    var PlaylistElement = document.getElementById("playlist");
    var currently_playing = [];
    if (PlaylistElement) {
        if (links) {
            if (links.length == 0) {
                console.error("Links array must contain at least one item");
            } else {
                currentSong = 0;
                var i = 0;
                for (i = 0; i < links.length; i++) {
                    SongList[i] = i;
                }
                if (shuffle) {
                    shuffleArray(SongList);
                }
                //console.log(SongList);

                content = "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'>";
                for (i = 0; i < links.length; i++) {
                    currently_playing[i] = false;
                    content += "<div class='song " + ((showAll) ? "" : ((i == SongList[currentSong]) ? "" : "hidden")) + "' id='song-" + i + "'>";
                    content += '<i style="cursor: pointer" id="fback-button-' + i + '" class="fa fa-fast-backward player"></i>';
                    content += '<i style="cursor: pointer" id="back-button-' + i + '" class="fa fa-backward player"></i>';
                    content += "<span class='play-pause' id='play-pause-" + i + "'>";
                    content += '<i style="cursor: pointer" id="play-pause-button-' + i + '" class="fa fa-play player"></i>';
                    content += "</span><span class='right' id='tracktime-" + i + "'>0:00</span>";
                    content += '<i style="cursor: pointer" id="fwd-button-' + i + '" class="fa fa-forward player"></i>';
                    content += '<i style="cursor: pointer" id="ffwd-button-' + i + '" class="fa fa-fast-forward player"></i>';
                    content += '<i style="cursor: pointer" id="shuffle-button-' + i + '" class="fa fa-random player"></i>';
                    content += (displayName) ? '<p>' + links[i] + '</p>' : '';
                    content += "</div>";
                    content += "<audio " + ((debug) ? "controls" : "") + " " + loop + " class = 'track' id = 'track-" + i + "' > ";
                    content += "<source src='" + links[i] + "' > Your browser does not support the HTML5 Audio element</audio>";
                    //                    content += "<hr>";

                }
                content += "<style>.hidden{visibility: collapse; display:none}.right{float:right}.song{width:" + ((data.hasOwnProperty('width')) ? data.width : "500px") + "}.player{padding-left:5px;padding-right:5px}.highlight{color:#aaa}</style>";
                PlaylistElement.innerHTML = content;

                var tracks = document.getElementsByClassName('track');
                //console.log("Tracks length: " + tracks.length);

                shuffleToggle(shuffle);

                var c;

                for (c = 0; c < document.getElementsByClassName('fa-random').length; c++) {
                    document.getElementsByClassName('fa-random')[c].onclick = function () {
                        shuffleToggle();
                    }
                    document.getElementsByClassName('fa-fast-backward')[c].onclick = function () {
                        playPrevious();
                    }
                }

                for (c = 0; c < tracks.length; c++) { //hehe
                    var tk = document.getElementById('track-' + c);

                    //console.log(tk.id);

                    tk.addEventListener('timeupdate', function () {
                        //console.log(this);
                        var ms = this.currentTime * 1000;
                        //console.log(this.id+": "+currentTimeMs);

                        var min = (ms / 1000 / 60) << 0,
                            sec = (ms / 1000) % 60;
                        //console.log(min + " :: " + sec);
                        //                        //console.log((this.id.match(/\d/g).toString().replace(/,/g, "")));

                        document.getElementById('tracktime-' + (this.id.match(/\d/g).toString().replace(/,/g, ""))).innerHTML = (((min > 0) ? min : "0") + ":" + ((sec >= 10) ? Math.floor(sec) : "0" + Math.floor(sec)));

                    }, false);

                    tk.addEventListener('ended', function () {
                        //console.log('Song has ended');
                        playNext();
                        //var play_pause = document.getElementById("play-pause-button-" + SongList[currentSong]);
                        //play_pause.className = "player fa fa-play";
                        //currentSong++;
                        //currentSong = currentSong % SongList.length;
                        //
                        //var tracks2 = document.getElementsByClassName('song');
                        //var x;
                        //for (x = 0; x < tracks2.length; x++) {
                        //    var tk2 = tracks2[x];
                        //    if (tk2.id.match(/\d/g) == SongList[currentSong]) {
                        //        tk2.className = 'song';
                        //    } else {
                        //        tk2.className = 'song hidden';
                        //    }
                        //}
                        //
                        //var next = document.getElementById('track-' + SongList[currentSong]);
                        //next.play();
                        //document.getElementById('play-pause-button-' + SongList[currentSong]).className = "player fa fa-pause";
                        //
                        //console.log("Now Playing song: " + SongList[currentSong]);


                    })

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
                                    var track = document.getElementById('track-' + SongList[currentSong]),
                                        play_pause = document.getElementById("play-pause-button-" + SongList[currentSong]);
                                    currently_playing[SongList[currentSong]] = true;
                                    //console.log("playing");
                                    track.play();
                                    play_pause.className = "player fa fa-pause";
                                } else {
                                    for (c = 0; c < currently_playing.length; c++) {
                                        if (currently_playing[c]) {
                                            var track = document.getElementById('track-' + c),
                                                play_pause = document.getElementById("play-pause-button-" + c);
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
                                setTimeout(function () {
                                    locker = false
                                }, 200);
                                break;
                            case 39:
                                var track = document.getElementById('track-' + SongList[currentSong]),
                                    play_pause = document.getElementById("play-pause-button-" + SongList[currentSong]);
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
                            }
                        }

                    }
                }

                /********************setting the play/pause buttons to have functionality**********************/

                for (i = 0; i < document.getElementsByClassName('play-pause').length; i++) {
                    var x = document.getElementsByClassName('play-pause')[i],
                        ffwd = document.getElementsByClassName('fa-fast-forward')[i],
                        fwd = document.getElementsByClassName('fa-forward')[i],
                        back = document.getElementsByClassName('fa-backward')[i],
                        fback = document.getElementsByClassName('fa-fast-backward')[i];
                    x.onclick = function () {
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
                                var track = document.getElementById("track-" + a),
                                    play_pause = document.getElementById("play-pause-button-" + a);
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
                    ffwd.onclick = function () {
                        var track = document.getElementById('track-' + SongList[currentSong]),
                            play_pause = document.getElementById("play-pause-button-" + SongList[currentSong]);
                        if (!track.paused) {
                            play_pause.className = "player fa fa-play";
                        }
                        playNext();
                    }
                }
            }
        } else {
            console.error("JSON Object does not contain an array of links");
        }

    } else {
        console.error("HTML does not contain a <div> with id='playlist'");
    }
}

/********** CODE FOR JQUERY IMPLEMENTATION **********/
//    if (data.hasOwnProperty('folder')) {
//        var extension = ".mp3";
//        if (data.hasOwnProperty('filetype')) {
//            //console.log("Filetype found");
//            extension = data.filetype;
//        }
//
//        //console.log(extension);
//
//        //console.log("Folder Found");
//
//        //replace this with non-jquery later. . .
//        $.ajax({
//            url: data.folder,
//            success: function (stuff) {
//                //console.log("Success");
//                var content = "<ul>";
//
//                if (extension == '.*') {
//                    $.each(['.3ga', '.aac', '.aiff', '.amr', '.ape', '.asf', '.asx', '.cda', '.dvf', '.flac', '.gp4', '.gp5', '.gpx', '.logic', '.m4a', '.m4b', '.m4p', '.midi', '.mp3', '.ogg', '.pcm', '.rec', '.snd', '.sng', '.uax', '.wav', '.wma', '.wpl'], function (index, value) {
//$(stuff).find("a:contains(" + value + ")").each(function () {
//    // will loop through 
//    var ix = $(this).attr("href");
//    //console.log(ix);
//    content += "<li>" + ix.replace(/%20/g, " ") + "</li>";
//});
//                    });
//                } else {
//                    $(stuff).find("a:contains(" + extension + ")").each(function () {
//// will loop through 
//var ix = $(this).attr("href");
//console.log(ix);
//content += "<li>" + ix.replace(/%20/g, " ") + "</li>";
//                    });
//                }
//                content += "</ul>"
//                document.getElementById("playlist").innerHTML = content;
//            },
//            error: function (xlh) {
//                //console.log("ERROR: " + xlh);
//            }
//        });
//
//    } else {
//        //shit don't exist, fam
//        //console.log("shit don't exist, fam");
//    }