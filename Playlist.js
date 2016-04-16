var Playlist = function (data) {
    var SongList = [],
        elementName = (data.hasOwnProperty('elementName')) ? data.elementName : false,
        currentSong = -1,
        currently_playing = [],
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

    var skipForward = function () {}
    var skipBackward = function () {}
    var playNext = function () {}
    var playPrevious = function () {}
    var toggleLoop = function () {}
    var toggleShuffle = function () {}
    var switchControls = function () {}
    
    if(document.getElementById(elementName)){
        
    }else{
        console.error("Playlist-js: You must include an elementName in the constructor");
    }
}