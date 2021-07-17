var tag = document.createElement('script');
var remoteFlag = 0;
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function parseVideoID(link){
    return new URL(link).searchParams.get('v')
    
}

var player;
function onYouTubeIframeAPIReady() {
    fetch("/link").then((response)=>{
        return response.json()
    }).then((j)=>{
        console.log(j.ytlink)
        var vidId = parseVideoID(j.ytlink) 
        player = new YT.Player('player', {
            videoId: vidId,
            playerVars: {
                'playsinline': 1,
                'controls': 0,
                'disablekb': 1
            },
            events: {
            }
        });
    })
    
}

window.onload = function(){
    window.setInterval(function() {
        document.querySelector("#progress").value = player.playerInfo.currentTime/player.playerInfo.duration*100.0;
    },1000)
    document.querySelector("#playpause").onclick = function(){
        if(this.value == "Pause"){
            player.pauseVideo()
            socket.emit("paused", player.playerInfo.currentTime)
            this.value = "Play"
    
        }else{
            player.playVideo()
            socket.emit("playing", player.playerInfo.currentTime)
            this.value = "Pause"
        }
    }
    
    document.querySelector("#progress").onclick = function(){
        var x = this.value/100*player.playerInfo.duration;
        player.seekTo(x,true)
        socket.emit("seek",x) 
        console.log(x,player.playerInfo.currentTime);
    }
    document.querySelector("#idsubmit").onclick = function(){
        var vidLink = document.querySelector("#ytlink").value
        socket.emit("load",vidLink)
        player.loadVideoById(parseVideoID(vidLink))
        document.querySelector("#playpause").value = "Pause" 
    }

}


var socket = io();
socket.on("playvideo", (time) => {
    console.log("playing video")
    player.seekTo(time)
    player.playVideo()
    document.querySelector("#progress").value = time/player.playerInfo.duration*100
    document.querySelector("#playpause").value = "Pause"
})
socket.on("pausevideo", (time) => {
    console.log("pausing video")
    player.pauseVideo()
    document.querySelector("#playpause").value = "Play"
})
socket.on("seek", (time) => {
    console.log("seeking video")
    player.seekTo(time,true)
})
socket.on("load", (vidLink) => {
    player.loadVideoById(parseVideoID(vidLink)) 
    document.querySelector("#playpause").value = "Pause" 
})