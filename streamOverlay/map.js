$(function() {
    const request = require('request');
    var hScaleFactor= ($('#canvas').height()*.80) / 30;
    var wScaleFactor= ($('#canvas').width()*.90) / 80;
    var x = []
    var z = []
    var n = []
    var pos = []
    var dx;
    var dz;

    document.onkeydown = KeyPress;
    function KeyPress(e) {
        var evtobj = window.event? event : e
        if (evtobj.keyCode == 90 && evtobj.ctrlKey){
            
        } 
    }

    function apiRequest(cb){
        request('http://127.0.0.1/session', { json: true }, (err, reg, body) => {
            cb(body)
        });
    }

    function jsonHandle(json){
        x = [[],[]]
        z = [[],[]]
        n= [[],[]]
        pos = [[],[]]
        dx = json.disc.position[0]*hScaleFactor
        dz = json.disc.position[2]*wScaleFactor
        for (i = 0; i < json.teams.length; i++) {
            json.teams[i].players.map(function(player) { 
                pos[i].push(player.possession)
                n[i].push(player.number)
                x[i].push(player.position[0]*hScaleFactor)
                z[i].push(player.position[2]*wScaleFactor)
            return 
            });
        }
        draw()
    }

    loop = window.setInterval(function(){
        try {
            apiRequest(jsonHandle)
        }
        catch(err){
            console.log(err)
        }
    }, 30);


    //Minimap Draw
    var canvas = document.getElementById("miniMap");
    var ctx = canvas.getContext("2d");
    canvas.style.width='98%';
    canvas.style.height='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.lineWidth = 1.5;
    ctx.font="600 11px"
    ctx.textAlign = "center"; 
    var circleSize = 6
    var playerX = canvas.height/2.2;
    var playerZ = canvas.width/2;
    var image=new Image();
    var colors = ['rgba(51, 102, 255,1)','rgba(244, 188, 46,1)']
    image.src="./images/disc.png";
    var bg=new Image();
    bg.src="./images/map.svg";

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMap()
        drawDisc(dx,dz);
        for(var t = 0; t < x.length;t++){
            for (var p = 0; p < x[t].length; p++) {
                drawPlayer(x[t][p],z[t][p],t,pos[t][p],n[t][p]);
            } 
        }
    }

    function drawPlayer(px,pz,team,possess,num){
        if(possess == true && px >= dx-4 && px <= dx+4 && pz >= dz-4 && pz <= dz+4){
            ctx.beginPath();
            ctx.arc(playerZ-pz-3, playerX+px-3, 8, 0, Math.PI*2, false);
            ctx.strokeStyle = colors[team];
            ctx.stroke(); 
            ctx.closePath();
            //Inner Circle
            ctx.beginPath();
            ctx.arc(playerZ-pz-3, playerX+px-3, 7, 0, Math.PI*2, false);
            ctx.fillStyle = colors[team];
            ctx.strokeStyle = 'transparent';
            ctx.stroke(); 
            ctx.fill()
            ctx.closePath();
            ctx.beginPath();
            ctx.fillStyle = '#17191b';
            ctx.fillText(num, playerZ-pz-3, playerX+px+1); 
            ctx.closePath();
        }   else {
            ctx.beginPath();
            ctx.arc(playerZ-pz-3, playerX+px-3, 8, 0, Math.PI*2, false);
            ctx.strokeStyle = colors[team];
            ctx.stroke(); 
            ctx.closePath();
            ctx.beginPath();
            ctx.fillStyle = '#e6e6e6';
            ctx.fillText(num, playerZ-pz-3, playerX+px+1); 
            ctx.closePath();
        }
    }

    function drawDisc(dx,dz) {
        ctx.beginPath();
        ctx.drawImage(image,playerZ-dz, playerX+dx,12,12);
        ctx.closePath();
    }

    function drawMap() {
        ctx.beginPath();
        ctx.drawImage(bg,6,0,canvas.width, canvas.height);
        ctx.closePath();
    }

    function render(totalGrowth, time,pz,px,color) {
        ctx.beginPath();
        ctx.arc(playerZ-pz-3, playerX+px-3, circleSize, 0, Math.PI*2, false);
        ctx.strokeStyle = color
        ctx.stroke()
        var growthPerFrame = time / totalGrowth / 60;
        circleSize += growthPerFrame;
        opacity -= opacityGrowth;
        if (circleSize > totalGrowth) circleSize = 6;
        ctx.closePath();
      };

    function animate(){
        window.requestAnimFrame(animate);
        apiRequest(jsonHandle)
    }

    /*window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
      })();
      animate() */
});