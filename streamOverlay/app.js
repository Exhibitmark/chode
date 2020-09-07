$(function() {
  const electron = require('electron');
  const ipc = electron.ipcRenderer;
  
  let curRound = 1
  let maxRounds 
  let teamNames = ["Input Blue","Input Orange"]
  let score = []
  let doc = {
    "teams": [],
    "goalDisplay": [],
    "score":[],
    "stats":[]
  }

  initialize()
  function KeyPress(e) {
    var evtobj = window.event? event : e
    if (evtobj.keyCode == 90 && evtobj.ctrlKey){
      $('#statsBoard').toggle();
      ipc.send('message','stat')
    } 
  }

  function initialize(){
    $(".team").each(function(entry) {
      doc.teams.unshift(this.id)
    });

    $(".score").each(function(entry) {
      doc.score.unshift(this.id)
    });

    $('ul','#newGoal').each(function(){
      doc.goalDisplay.push($(this).attr('id')); 
    })
    $('ul','#oStats').each(function(){
      doc.stats.push($(this).attr('id')); 
    })
    $('ul','#bStats').each(function(){
      doc.stats.push($(this).attr('id')); 
    })
    doc.goalDisplay.splice(3,1)
    doc.goalDisplay.splice(4,1)
    doc.goalDisplay.splice(5,1)
  }

  //Messaging Switch
  ipc.on('messaging', (e, type, arg, arg2) => {  
    switch (type) {
      case 'time' : time(arg); break
      case 'stats' : statBuild(arg); break
      case 'round' : roundSet(arg); break
      case 'score' : setScores(arg); break //arg = points
      case 'goal' : goalDisplay(arg) ; break //arg = json
      case 'possession' : possession(arg) ; break
      case 'teams' : setTeamNames(arg,arg2) ; break
    } 
  }); 

  function setTeamNames(teams,id) {
    for (i = 0; i < teams.length; i++) {
      $('#'+doc.teams[i]).html(teams[i])
    }
  }

  function setScores(scoreArr) {
    for (i = 0; i < scoreArr.length; i++) {
      $('#'+doc.score[i]).html(scoreArr[i])
    }
  }

  function possession(owner){
    if(owner == 0){
      $("#oPossess").css("background-color", "#222222");
      $("#bPossess").css("background-color", "rgba(51, 102, 255,1)");
    } else if(owner == 1){
      $("#oPossess").css("background-color", "rgba(244, 188, 46,1)");
      $("#bPossess").css("background-color", "#222222");
    }
  }

  function time(clock){
    $("#time").html(clock)  
  }

  function goalDisplay(json) {
    //Get scoring team
    for (i = 0; i < json.length; i++) {
      $('#'+doc.goalDisplay[i]).html(json[i])
    }

    //Slide out goal stat
    setTimeout(function(){
      $(".newGoal").css('transform', 'translateY(0px)');
    }, 1000);

    //Wait 6 seconds then slide back
    setTimeout(function(){
      $(".newGoal").css('transition', 'all 1s cubic-bezier(.54,.01,.93,.31)')
      $(".newGoal").css('transform', 'translateY(-300px)');
    }, 6000);

    setTimeout(function(){
      $(".newGoal").css('transition', 'all 1s cubic-bezier(.06,.48,.23,.98)')
    }, 1000);
  }

  function roundSet(amount) {
    maxRounds = amount
    $('#round').html("ROUND "+ curRound+" OF " + maxRounds)
    return amount
  }

  function statBuild(json){
    var teamNames = []
    for (var i = 0; i < 2; i++) {
      teamNames.push($('#'+doc.teams[i]).text())
    }
    var blue = [
      teamNames[0],
      json.blue_points,
      Math.ceil(json.teams[0].stats.possession_time * 100) / 100+" seconds",
      json.teams[0].stats.interceptions,
      json.teams[0].stats.saves,
      json.teams[0].stats.assists,
      json.teams[0].stats.shots_taken
    ]
    var orange = [
      teamNames[1],
      json.orange_points,
      Math.ceil(json.teams[1].stats.possession_time * 100) / 100+" seconds",
      json.teams[1].stats.interceptions,
      json.teams[1].stats.saves,
      json.teams[1].stats.assists,
      json.teams[1].stats.shots_taken
    ]
    for (i = 0; i < doc.stats.length/2; i++) {
      $('#'+doc.stats[i]).html(orange[i])
    }
    var k = 0
    for (i = 7; i < doc.stats.length; i++) {
      $('#'+doc.stats[i]).html(blue[k])
      k++
    }
  }

  //EVENT LISTENERS
  document.onkeydown = KeyPress;
  $('#round').click(function() {
    curRound++;
    if(maxRounds== undefined){
      maxRounds = 2
    }
    if (curRound > maxRounds){
      curRound = 1
    }
    $('#round').html("ROUND "+ curRound+" OF " + maxRounds)
  });

});