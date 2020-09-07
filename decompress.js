const fs = require('fs');
const byteData = require('byte-data');

let inputFile = process.argv[2];
const header = {}

function sec2time(timeInSeconds) {
    var pad = function(num, size) { return ('000' + num).slice(size * -1); },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60),
    milliseconds = time.slice(-3);

    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2) + ',' + pad(milliseconds, 3);
}

function readFile(){
    let input = fs.readFileSync(inputFile);
    return Buffer.from(input)
}

function byteToFloat(array){
    //Array fed in should be either 2 bytes which will return 1 float, or 6 bytes to return 3 floats 
    //ie. Single Coord or Full 3-axis vector XYZ
    let buffer = byteData.unpackArray(array, {bits: 16,fp: true})
    return buffer
}

function getFrames(file){
    let frameStart = file.indexOf("FEFD", 0, "hex");
    header = file.slice(0,frameStart-1);
    let fileNoHeader = file.slice(frameStart,file.length);
    let frameEnd = fileNoHeader.indexOf("FEFD", 2, "hex");
    let frame = fileNoHeader.slice(0,frameEnd);
    return frame
}

function getChunk(frame){
    let chunkStart = frame.indexOf("FDFE", 0, "hex");
    frame = frame.slice(chunkStart,frame.length);
    let chunkEnd = frame.indexOf("FDFE", 2, "hex");
    let chunk = frame.slice(2,chunkEnd);
    return chunk
}

function decodeChunk(chunk){
    let disc = chunk.slice(0,6);
    let state = Number(chunk.slice(6,7).toString('hex'))
    let current = 7
    let json = {
        disc:byteToFloat(disc),
        gameStatus:getGameState(state)
    }

    let pChunk = []
    while(current <= chunk.length-4){
        pChunk.push(chunk.slice(current,current+42))
        current+=42
    }
    pChunk.forEach(function(p){    
        let obj = {
            position: byteToFloat(p.slice(0,6)),
            rHand: byteToFloat(p.slice(6,12)),
            lHand: byteToFloat(p.slice(12,18)),
            left: byteToFloat(p.slice(18,24)),
            up: byteToFloat(p.slice(24,30)),
            forward: byteToFloat(p.slice(30,36)),
            velocity: byteToFloat(p.slice(36,42))
        }
    });
}

function getGameState(state){
    switch(state) {
        case 0: state = "pre_match" ; break
        case 1: state = "round_start" ; break
        case 2: state = "playing" ; break
        case 3: state = "score" ; break
        case 4: state = "round_over" ; break
        case 5: state = "round_start" ; break
        case 6: state = "post_match" ; break
        case 7: state = "pre_sudden_death" ; break
        case 8: state = "sudden_death" ; break
        case 9: state = "post_sudden_death" ; break
    }
    return state
}

function getHeader(file){
    let frameStart = file.indexOf("FEFD", 0, "hex");
    let header = JSON.parse(file.slice(0,frameStart-1))
    let playerCount = 0
    header.players.forEach(function(team){
        playerCount += team.length
    });

    header.totalPlayers = playerCount

    return file.slice(frameStart, file.length)
}

let file = readFile()
//let f = getFrame(file)
let allFrames = getHeader(file)
let frames = getFrames(allFrames)
let c = getChunk(f)
let nC = decodeChunk(c)