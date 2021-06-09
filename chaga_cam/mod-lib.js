const m = require('bindings')('../taskDependents/memoryjs.node')
const o = require('./offsets.json')
const addresses = []
let proc;
const processName = "echovr.exe"

const read = {
    //Address: Start location to read buffer
    //Size: Amount in bytes to read of the buffer
    Buffer: function (address, size) {
        return m.readBuffer(proc.handle, address, size);
    },
    Memory: function (address, type) {
        return m.readMemory(proc.handle, address, type);
    },
    Pointer: (address) => {
        return read.Memory(address , 'pointer')
    }
}

const write = {
    Buffer: function (buffer, address) {
        m.writeBuffer(proc.handle, address, buffer);
    },
    Memory: function (address, value, type) {
        m.writeMemory(proc.handle, address, value , type);
    }
}

//Internal functions
function getGameAddresses(){
    let base = addresses['base']
    Object.keys(o).forEach(function(e){
        addresses[e] = pointerBuild(base, o[e].list)
    })

    console.log(addresses['camera'].toString(16))
    console.log(addresses['fov'].toString(16))

    console.log('Stored game addresses')
}

function pointerBuild(base,n){
    for(var i = 0; i < n.length-1; i++){
        base = read.Pointer(base + parseInt(n[i],16))
        //console.log(base.toString(16))
    }
    return base + parseInt(n[n.length-1],16)
}

module.exports = {
    openProcess: () => {
        m.openProcess(processName, (error, processObject) => {
            if(processObject.szExeFile) {
                proc = processObject
                addresses['base'] = proc.modBaseAddr
                getGameAddresses()
            } else {
                console.log("Couldn't open handle on", processName);
                console.log("This is probably because the game isn't running.")
            }
        });
    },
    getGameAddresses,
    addresses,
    read,
    write
}
