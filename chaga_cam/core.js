const Utils = {
    Time: function(new_time){
        return Math.round(new_time / 10) * 10
    },
    Threshold(value, n_max, n_min){
        // ((remap_value - 0) / (127 - 0) ) * (new_max - new_min) + new_min
        return ((value - 0) * n_max / 127) + n_min
    },
    Random_String(){
        return Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
    },
    toEuler(quat){
        const q0 = quat[0];
        const q1 = quat[1];
        const q2 = quat[2];
        const q3 = quat[3];
      
        const Rx = Math.atan2(2 * (q0 * q1 + q2 * q3), 1 - (2 * (q1 * q1 + q2 * q2)));
        const Ry = Math.asin(2 * (q0 * q2 - q3 * q1));
        const Rz = Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - (2  * (q2 * q2 + q3 * q3)));
      
        const euler = [Rx, Ry, Rz];
      
        return(euler);
    },
    toQuaternion: function(euler) {
        const Rx = euler[0];
        const Ry = euler[1];
        const Rz = euler[2];
      
        const q0 = (Math.cos(Rx/2) * Math.cos(Ry/2) * Math.cos(Rz/2) + Math.sin(Rx/2) * Math.sin(Ry/2) * Math.sin(Rz/2));
        const q1 = (Math.sin(Rx/2) * Math.cos(Ry/2) * Math.cos(Rz/2) - Math.cos(Rx/2) * Math.sin(Ry/2) * Math.sin(Rz/2));
        const q2 = (Math.cos(Rx/2) * Math.sin(Ry/2) * Math.cos(Rz/2) + Math.sin(Rx/2) * Math.cos(Ry/2) * Math.sin(Rz/2));
        const q3 = (Math.cos(Rx/2) * Math.cos(Ry/2) * Math.sin(Rz/2) - Math.sin(Rx/2) * Math.sin(Ry/2) * Math.cos(Rz/2));
        
        const quat = [q0,q1,q2,q3];
        return(quat);
    }
}

module.exports = {
    Utils
}