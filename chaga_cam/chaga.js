const fs = require('fs');
const path = require('path');
const { Utils } = require('./core.js')
const TWEEN = require('@tweenjs/tween.js');
const {keys, buttons, midi, defaults} = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json')));
//const ioHook = require('iohook');
const Concentrate = require('concentrate');
const Dissolve = require('dissolve');
const easymidi = require('easymidi');
let input = new easymidi.Input(midi);
const {read, write, openProcess, addresses} = require('./mod-lib.js')

if(defaults.mode = 'midi'){
    initMIDI()
} 

openProcess()

let tween;
const data = {"keyframes": []}

const d = {
    "x":[],
    "y":[],
    "z":[],
    "i":[],
    "j":[],
    "k":[],
    "fov":[]
}

const camera = {
    "easing": TWEEN.Easing.Linear.None,
    "interpolation": TWEEN.Interpolation.CatmullRom,
    "repeat": Infinity,
    "delay_before_repeat":1000,
    "duration":10000,
}

const cameraOffsets = {
    "pitch": 12,
    "yaw": 16,
    "roll": 20
}

const jump = {
    First: function(){
        convertToBuffer(data.keyframes[0])
    },
    Last: function(){
        let last = data.keyframes[1].x.length-1
        const newP = {
            x:data.keyframes[1].x[last],
            y:data.keyframes[1].y[last],
            z:data.keyframes[1].z[last],
            p:data.keyframes[1].p[last],
            r:data.keyframes[1].r[last],
            n:data.keyframes[1].n[last],
            fov:data.keyframes[1].fov[last],
        }
        convertToBuffer(newP)
    }
}

const ease = {
    Type: function(type){
        return easings[current.ease][type]
    },
    Easing: function(type){
        camera.easing = type
        console.log(camera.easing)
        return easings[type][0]
    }
}

const cam_action = {
    Rotate_reset: function(){
        const buf = Buffer.alloc(12);
        write.Buffer(addresses['camera']+12, buf)
    },
    Rotate: function(val, axis){
        write.Memory(addresses['camera'] - axis, val, 'float')
    },
    Get_info: function(){
        console.log("Start Position:", data.keyframes[0])
        console.log("All other positions:", data.keyframes[1])
        console.log("Movement duration:", camera.duration / 1000, "seconds")
    }
}

function readCamera(cb){
    const buf = read.Buffer(addresses['camera'], 28)
    parse(buf,cb)
}

function parse(buf, cb){
    const parser = Dissolve().loop(function(end) {
        this
        .floatle("i")
        .floatle("j")
        .floatle("k")
        .floatle("w")
        .floatle("x")
        .floatle("y")
        .floatle("z")
        .tap(function() {
            this.push(this.vars);
            this.vars = {};
        });
    });
    
    parser.on("readable", function() {
        let e;
        while (e = parser.read()) {
            cb(e)
        }
    });
    parser.write(buf);
}

function storeCamera(camera){
    let q = [camera.i,camera.j,camera.k,camera.w]
    var euler = Utils.toEuler(q);
    delete camera.i
    delete camera.j
    delete camera.k
    delete camera.w

    let fov = read.Memory(addresses['fov'],'float')
    Object.keys(camera).forEach(function(axis){
        d[axis].push(camera[axis])
    })
    d["i"].push(euler[0])
    d["j"].push(euler[1])
    d["k"].push(euler[2])
    d["fov"].push(fov)
}

function getKeyframes(){
    let keys = []
    let first = {}
    let remaining = {}
    Object.keys(d).forEach(function(e){
        first[e] = d[e][0]
        remaining[e] = d[e].slice(1, d[e].length)
        
    })
    keys.push(first,remaining)
    return keys
}


function convertToBuffer(quat, pos){
    const buffer = Concentrate()
        .floatle(quat[0])
        .floatle(quat[1])
        .floatle(quat[2])
        .floatle(quat[3])
        .floatle(pos.x)
        .floatle(pos.y)
        .floatle(pos.z)
        .result();
        
    write.Memory(addresses['fov'], pos.fov, 'float')
    write.Buffer(buffer, addresses['camera']);
}

function movement(){
    let k = getKeyframes()
    console.log(k)
    tween = new TWEEN.Tween(k[0])
        .to(k[1],camera.duration)
        .interpolation(camera.interpolation)
        .repeat(Infinity)
        .repeatDelay(1000)
        .onUpdate(function(object) {
            let e = [object.i, object.j, object.k]
            let q = Utils.toQuaternion(e)
            convertToBuffer(q, object)
        })
        .start();

    loop = setInterval(function(){
        TWEEN.update();
    }, 16); 
} 


function saveCamera(){
    let outfile = {
        "time":camera.duration,
        "data":data
        //"relative":relative.build(data)
    }
    console.log('Saved File')
    fs.writeFile('./paths/'+Utils.Random_String() +'.json', JSON.stringify(outfile),function(err) {});
}

function initMIDI(){
    input.on('noteon', (msg) => {
        let action = buttons[msg.note.toString()]
        findAction(action)
    });
    
    input.on('cc', function (msg) {
        let newVal;
        switch(msg.controller) {
            case 2:
                newVal = Utils.Threshold(msg.value, 1, 0)
                write.Memory(addresses['fov'], newVal, 'float')
                break;
            case 6:
                newVal = Utils.Threshold(msg.value, 60, 0) * 1000
                camera.duration = Utils.Time(newVal)
                break;
            default:
              // code block
          } 
    });
}

function findAction(action){
    switch(action) {
        case 'start':
            movement()
            break;
        case 'stop':
            tween.stop()
            break;
        case 'keyframe':
            console.log("Keyframe Set")
            readCamera(storeCamera)
            break;
        case 'clear':
            console.log("Keyframes cleared")
            d = {
                "x":[],
                "y":[],
                "z":[],
                "i":[],
                "j":[],
                "k":[],
                "fov":[]
            }
            data.keyframes.length = 0;
            break;
        case 'get_info':
            cam_action.Get_info()
            break;
        case 'save':
            saveCamera()
            break;     
        default:
            // code block
    }
}

//Old Code
/*
function storeCamera(camera,index){
    let q = [camera.i,camera.j,camera.k,camera.w]
    var euler = Utils.toEuler(q);
    delete camera.i
    delete camera.j
    delete camera.k
    delete camera.w
    let fov = read.Memory(addresses['fov'],'float')
    if(index == undefined){
        if(data.keyframes.length == 0){
            first_key = {
                "i":euler[0],"j":euler[1],"k":euler[2],"x":camera.x, "y":camera.y, "z":camera.z,"fov":fov
            };
            data.keyframes.push({
                "i":euler[0],"j":euler[1],"k":euler[2],"x":camera.x, "y":camera.y, "z":camera.z,"fov":fov
            },
            {
                i:[],j:[],k:[],x:[],y:[],z:[],fov:[]
            })
        } else{
            Object.keys(camera).forEach(function(axis){
                data.keyframes[1][axis].push(camera[axis])
            })
            data.keyframes[1]["i"].push(euler[0])
            data.keyframes[1]["j"].push(euler[1])
            data.keyframes[1]["k"].push(euler[2])
            data.keyframes[1]["fov"].push(fov)
        }
    }
}

function movement(){
    tween = new TWEEN.Tween(data.keyframes[0])
        .to(data.keyframes[1],camera.duration)
        .interpolation(camera.interpolation)
        .repeat(Infinity)
        .repeatDelay(1000)
        .onUpdate(function(object) {
            let e = [object.i, object.j, object.k]
            let q = Utils.toQuaternion(e)
            convertToBuffer(q, object)
        })
        .start();

    loop = setInterval(function(){
        TWEEN.update();
    }, 16); 
} 

*/