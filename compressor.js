const fs = require('fs');
const byteData = require('byte-data');

let writeStream;

if (process.argv.length < 4) {
  /*  console.error(` 
    ///////////////////////////////////////////
    //                                       //
    //        Echo Replay Compressor         //
    //                                       //
    ///////////////////////////////////////////

    Usage
    node compressor.js <input-replay> <output-file>
    `);
    process.exit(1); */
}

function buildFileHeader(json){
    const replayHeader = {
        "author": json.client_name,
        "players":[],
        "numbers": []
    }
    let p = players(json)
    let byte = 0b00000000
    if(json.private_match !== false){
        byte = byte | 0b10000000
    } 

    if(json.match_type !== 'Echo_Arena'){
        byte = byte | 0b01000000
    } 

    if(json.tournament_match !== false){
        byte = byte | 0b00100000
    }
    replayHeader.numbers = p.numbers
    replayHeader.players = p.names
    let header = JSON.stringify(replayHeader)+String.fromCharCode(byte);
    toBytes(header)
}

function players(json){
    const players = {
        "numbers": [[],[]],
        "names": [[],[]],
    }
    for (var i = 0; i < json.teams.length; i++) {
        json.teams[i].players.map(function(p) { 
            players.names[i].push(p.name)
            players.numbers[i].push(p.number)
        });
    }
    return players
}

function floatToByte(array){
    let buffer = [];
    array.forEach(function(float){
       buffer = buffer.concat(byteData.pack(float, {bits: 16, fp: true}))
    });
    return buffer
}

function buildFrameHeader(json){
    let bytes = [254,253]
    let time = byteData.pack(json.game_clock, {bits: 16, fp: true});
    bytes = bytes.concat(json.blue_points,json.orange_points,time)
    for (var i = 0; i < json.teams.length; i++) {
        bytes = bytes.concat(collectStatFrame(json.teams[i].stats))
        json.teams[i].players.map(function(p) {
            bytes = bytes.concat(collectStatFrame(p.stats))
        });
    }
    
    toBytes(bytes)
}

//Chunks contain everything
function createChunk(json){
    let bytes = [253,254]
    let possession = [[0,0,0,0],[0,0,0,0]]
    let blocking = [[0,0,0,0],[0,0,0,0]]
    let stunned = [[0,0,0,0],[0,0,0,0]]
    let bools = []
    bytes = bytes.concat(floatToByte(json.disc.position))
    bytes = bytes.concat(setGameState(json.game_status))
    for (var i = 0; i < json.teams.length; i++) {
        json.teams[i].players.map(function(p,index) {
            let types = [p.position,p.rhand,p.lhand,p.left,p.up,p.forward,p.velocity]
            types.forEach(function(type){
                bytes = bytes.concat(floatToByte(type))
            });

            if(p.possession == true){
                possession[i][index] = 1
            } 
            if(p.blocking == true){
                blocking[i][index] = 1
            } 
            if(p.stunned == true){
                stunned[i][index] = 1
            } 
        });
        possession[i] = possession[i].join('')
        blocking[i] = blocking[i].join('')
        stunned[i] = stunned[i].join('')
        
    }
    bools.push(possession.join(''),blocking.join(''),stunned.join(''))
    bools.forEach(function(bool){
       bytes = bytes.concat(boolToByte(bool))
    });

    toBytes(bytes)
    return
}

function setGameState(state){
    switch(state) {
        case "pre_match": state = 0 ; break
        case "round_start": state = 1 ; break
        case "playing": state = 2 ; break
        case "score": state = 3 ; break
        case "round_over": state = 4 ; break
        case "post_match": state = 5 ; break
        case "pre_sudden_death": state = 6 ; break
        case "sudden_death": state = 7 ; break
        case "post_sudden_death": state = 8 ; break
    }
    return state
}

function boolToByte(array){
    //Adds enough bits to make full
    if(array.length < 8){
        let diff = 8-array.length
        array += "0".repeat(diff)
    }
    return parseInt(array,2)
}

function collectStatFrame(json){
    let arr = []
    for(var key in json) {
        let value = json[key];
        if(key == 'possession_time'){
            let packed = byteData.pack(value, {bits: 16, fp: true});
            arr = arr.concat(packed)
        } else{
            arr = arr.concat(value)
        }
    }
    return arr
}

function toBytes(bytes){
    let str = Buffer.from(bytes)
    fileStream(str)
}

module.exports = { 
    startCompress(out, rate) {
        writeStream = fs.createWriteStream(out);

        fs.readFile("./temp", 'utf8', function(err, contents) {
            let file = JSON.parse(contents);
            buildFileHeader(file.frames[0])
            let allFrames = file.frames
            let iterations = allFrames.length/rate
            for(var i=0; i < iterations;i++){
                let arr = allFrames.slice(0, rate);
                allFrames = allFrames.slice(rate, allFrames.length);
                if(i == iterations.length-2){
                    console.log(allFrames)
                }
                buildFrameHeader(arr[0])
                arr.forEach(function(frame){
                    createChunk(frame)
                });
            }
            writeStream.end()
            writeStream.on('finish', () => {
                fs.unlinkSync('temp')
            });
        });
    }
}

function fileStream(data){
    writeStream.write(data);
}
