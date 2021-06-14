const fs = require('fs');
const path = require('path');
const { Utils } = require('./core.js')
const TWEEN = require('@tweenjs/tween.js');
const {keys} = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json')));
const {keyCodes} = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'keys.json')));
const ioHook = require('iohook');
const Concentrate = require('concentrate');
const Dissolve = require('dissolve');
const {read, write, openProcess, addresses} = require('./mod-lib.js')

const mapped_keys = {}

initKeyboard()
openProcess()

let d = {
    "x":[],
    "y":[],
    "z":[],
    "i":[],
    "j":[],
    "k":[],
    "fov":[]
}

const scene = {
    "tween": '',
    "key":0
}

const camera = {
    "easing": TWEEN.Easing.Linear.None,
    "interpolation": TWEEN.Interpolation.CatmullRom,
    "repeat": Infinity,
    "repeat_delay":1000,
    "duration":10000,
}

const jump = {
    First: function(){
        getSingleKeyframe(0)
        scene.key = 0
    },
    Last: function(){
        scene.key = d.x.length - 1
        getSingleKeyframe(scene.key)
    },
    Next: function(){
        if(scene.key < d.x.length - 1){
            scene.key ++
        } else {
            scene.key = 0
        }
        getSingleKeyframe(scene.key)
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
        console.log(d)
        console.log(camera.duration)
    }
}

const tween = {
    Start: function(){
        let k = getKeyframes()
        scene.tween = new TWEEN.Tween(k[0])
            .to(k[1], camera.duration)
            .interpolation(camera.interpolation)
            .repeat(camera.repeat)
            .repeatDelay(camera.repeat_delay)
            .onUpdate(function(object) {
                let e = [object.i, object.j, object.k]
                let q = Utils.toQuaternion(e)
                convertToBuffer(q, object)
            })
            .start();
    
        loop = setInterval(function(){
            TWEEN.update();
        }, 16); 
    },
    Stop: function(){
        scene.tween.stop()
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
    let euler = Utils.toEuler(q);
    camera.i = euler[0]
    camera.j = euler[1]
    camera.k = euler[2]
    delete camera.w
    
    camera.fov = read.Memory(addresses['fov'],'float')
    Object.keys(camera).forEach(function(axis){
        d[axis].push(camera[axis])
    })
}

function getSingleKeyframe(num){
    let first = {}
    Object.keys(d).forEach(function(e){
        first[e] = d[e][num]
    })
    let e = [first.i, first.j, first.k]
    let q = Utils.toQuaternion(e)
    convertToBuffer(q, first)
}

function getKeyframes(){
    let keys = []
    let first = {}
    let remaining = {}
    Object.keys(d).forEach(function(e){
        first[e] = d[e][0]
        remaining[e] = d[e].slice(1, d[e].length)
    })
    keys.push(first, remaining)
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

function initKeyboard(){
    mapKeys()
    ioHook.on('keydown', e => {
        if(e.altKey == false){
            let action = mapped_keys[e.rawcode.toString()]
            findAction(action)
        }
    });
    // Register and start hook
    ioHook.start();
    console.clear()
}

function mapKeys(){
    Object.keys(keys).forEach(function(e){
        mapped_keys[keyCodes[e]] = keys[e]
    });
}

function changeTime(amount){
    camera.duration += amount
}

function findAction(action){
    switch(action) {
        case 'start':
            tween.Start()
            break;
        case 'stop':
            tween.Stop()
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
            break;
        case 'get_info':
            cam_action.Get_info()
            break;
        case 'duration_decrease':
            changeTime(-1000)
            break;
        case 'duration_increase':
            changeTime(1000)
            break;
        case 'save':
            saveCamera()
            break;     
        case 'zoom_in':
            let zoom_in = read.Memory(addresses['fov'],'float')
            zoom_in -= 0.05
            write.Memory(addresses['fov'], zoom_in, 'float')
            break;    
        case 'zoom_out':
            let zoom_out = read.Memory(addresses['fov'],'float')
            zoom_out += 0.05
            write.Memory(addresses['fov'], zoom_out, 'float')
            break;    
        case 'first_keyframe':
            jump.First()
            break;  
        case 'last_keyframe':
            jump.Last()
            break; 
        case 'next_keyframe':
            jump.Next()
            break;  
        default:
            // code block
    }
}


function saveCamera(){
    let outfile = {
        "time":camera.duration,
        "data":data
    }
    console.log('Saved File')
    fs.writeFile('./paths/'+Utils.Random_String() +'.json', JSON.stringify(outfile),function(err) {});
}
