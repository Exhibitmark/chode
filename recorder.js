const axios = require("axios");
const fs = require('fs');
const compress = require("./compressor.js")

const frameRate = process.argv[2];
const outFile = process.argv[3];
const tickRate = 1000/frameRate

if (process.argv.length < 3) {
 console.error(` 
  ///////////////////////////////////////////
  //                                       //
  //          Echo Replay Recorder         //
  //                                       //
  ///////////////////////////////////////////

  Usage
  node recorder.js frameRate <output-file>
  `);
  process.exit(1); 
}

let writeStream = fs.createWriteStream('temp', {flags:'a'});
writeStream.write('{"frames":[')

let chunk = []
let chunkCount = 0
let seconds = 0
let mainLoop

function loop(){
  let frameNum = 0
  mainLoop = setInterval(function() {
    if(frameNum <= frameRate){
      echoAPI()
      frameNum++;
    } else {
      chunkCount+=chunk.length
      let chunkClean = JSON.stringify(chunk)
      chunkClean = chunkClean.substring(1, chunkClean.length-1);
      fileStream(chunkClean+",")
      frameNum = 0
      seconds++
    }
  }, tickRate);
}

async function echoAPI() {
  try {
    let res = await axios.get('http://127.0.0.1/session');
    chunk.push(res.data)
    if(res.data.game_status == 'post_match'){
      let chunkClean = JSON.stringify(chunk)
      chunkClean = chunkClean.substring(1, chunkClean.length-1);
      fileStream(chunkClean)
      end()
    }
  }
  catch(e){}
}

function end(){
  clearInterval(mainLoop)
  let chunkClean = JSON.stringify(chunk)
  chunkClean = chunkClean.substring(1, chunkClean.length-1);
  fileStream(chunkClean)
  let rate = capRate()
  writeStream.write('],"chunks":'+chunkCount+'}')
  
  writeStream.end()
  writeStream.on('finish', () => {
    
    compress.startCompress(outFile+'.milk',frameRate)
  });
}

function fileStream(data){
  writeStream.write(data)
  resetGlobals()
}

function resetGlobals(){
  chunk = []
  start = new Date().getTime();
}

function capRate(){
  let avgCapRate = (seconds*1000)/chunkCount
  return 1000/avgCapRate
}

process.on('SIGINT', function() {
  end()
});

loop()
