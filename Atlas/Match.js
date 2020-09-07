'use strict'
class Match {
    constructor(json,matchsettings) {
        this.matchid = json.sessionid;
        this.username = json.client_name;
        if(matchsettings.title.length == 0){
            this.title = json.client_name+"'s Game"
        } else {
            this.title = matchsettings.title;
        }

        if('players' in json.teams[0]){
            this.blue_team = json.teams[0].players.map(function(player) {
                return player['name']
            });
        }else{
            this.blue_team = [];
        }

        if('players' in json.teams[1]){
            this.orange_team = json.teams[1].players.map(function(player) {
                return player['name']
            });
        } else {
            this.orange_team = [];

        }
        console.log('done');

        this.blue_points = json.blue_points;
        this.orange_points = json.orange_points;
        this.game_status = json.game_status;
        this.slots = this.blue_team.length + this.orange_team.length;
        this.whitelist = matchsettings.whitelist;
        this.is_protected = matchsettings.is_protected;
        this.allow_spectators = matchsettings.allow_spectators;
        this.max_slots = matchsettings.max_slots;
        this.is_lfg = matchsettings.lfg;
        this.private_match = json.private_match;
        this.tournament_match = json.tournament_match;
        this.game_clock_display = json.game_clock_display;

        return this
    }
}

module.exports = Match