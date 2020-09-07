$(function() {
  const electron = require('electron');
  const ipc = electron.ipcRenderer;
  const remote = require('electron').remote;
  let window = remote.getCurrentWindow();
  let whitelist = []
  let matchIDs = []
  let savedmatchsettings = {}
  let user,settings,version,headers
  let listCon = $("#matchlist-container")
  let matchclips = new ClipboardJS('.matchlink');


  $(document).ready(function(){
    version = ipcMessage('getVersion')
    headers = {'User-Agent':'Atlas/'+version}
    settings = ipcMessage('getSettings')
    if(settings.captureFlag == "-capturevp2"){
      $("#enableCapture").toggleClass("capture-enabled");
      $("#enableCapture").attr('data-state', "1");
    }
    $('#version').html(version)
    $('#directoryInput').val(settings.directory);

    $('[data-toggle="tooltip"]').tooltip()

    matchclips.on('success',function(e){e.clearSelection();
      console.info('Action:',e.action);
      console.info('Text:',e.text);
      console.info('Trigger:',e.trigger);
    });
  });

  //Refresh Match List
  $("#refresh").click(function() {
    $(this).find('i:first').addClass('fa-spin');
    ipcMessage('refresh')
    console.log('refreshed')
  });
  
  //Click Game button at top
  $("#game").click(function() {
    ipcMessage('startGame', '')
  });

  //Click Game button at top
  $("#pubjoin").click(function() {
    ipcMessage('autopubs', '')
  });

  //Enable Capture Click 
  $("#enableCapture").click(function() {
    var val = $(this).attr('data-state') == '1' ? '0' : '1';
    $(this).attr('data-state', val)
    $(this).toggleClass("capture-enabled");
    response = ipcMessage('setCaptureFlag', val)
  });

  //Close App
  $("#close").click(function(){
    window.close();
  });

  //Minimize App
  $("#minimize").click(function(){
    window.minimize();
  });

  //Set Directory Click
  $("#setDir").click(function() {
    response = ipcMessage('setDirectory', $("#directoryInput").val())
    if (response == 'fSlash') {
      $('#directoryInput').removeClass('is-valid').addClass('is-invalid');
      $('#setDir-feedback').text("Don't use forward slashes");

    } else if (response == 'Fail') {
      $('#directoryInput').removeClass('is-valid').addClass('is-invalid');
      $('#setDir-feedback').text('Not a valid directory');
    } else {
      $('#directoryInput').val(response).removeClass('is-invalid').addClass('is-valid');
    }
  });

  //Send Sync Communication with Main.JS
  function ipcMessage(type, msg,arg) {
    let response = ipc.sendSync('messaging', type, msg, arg)
    return response
  }

  function createUI(json){
    $('#matchlist-container').empty();
    try{
      json.matches.forEach(function(match) {
        console.log(match,user)
        createNew(match)
      });
    }
    catch(e){
      console.log(e)
    }
    matchCount()
  }

  function createNew(json){
    /** 
    * Creates the ui elements for a match in the main window
    * 
    * json is the match object
    */
    var prepend = false;
    var listposition = 'beforeend';
    var matchclasses = 'card matchcard bg-lessdark';

    if(json.username == user){
      prepend = true
      listposition = 'afterbegin';
      matchclasses += 'border border-primary';
    }

    var matchmins = Math.floor(json.game_clock/60)
    var matchclock = pad2(matchmins)+':'+pad2(json.game_clock - matchmins *60)

    var matchdiv = '<div id="'+json.matchid+'" class="'+matchclasses+'"><div class="card-header bg-lessdark pr-2 pl-3"><div class="d-inline-block matchhead"><div class="d-inline-block align-middle pr-2">';
    if(json.is_protected==true){
      matchdiv += '<i class="text-muted fas fa-lock align-middle mx-auto" data-toggle="tooltip" data-placement="bottom" data-html="true" title="This is a <u>LOCKED</u> atlas match<br>Only users in the whitelist or users that have the matchid can join through atlas"></i>';
    } else {
      matchdiv += ' &nbsp; &nbsp; ';
    }
    matchdiv += '</div><div class="d-inline-block align-middle mx-auto"><a class="d-block matchtitle stretched-link" data-toggle="collapse" href="#collapse'+json.matchid+'" role="button" aria-expanded="false" aria-controls="collapse'+json.matchid+'">'+json.title+'</a><div class="d-block text-muted"><span>'+json.slots+'</span> - <span>'+json.username+'</span></div></div></div>';
    matchdiv += '<div class="d-inline-block align-middle mx-auto float-right"><div class="btn-group float-right matchbuttons align-middle mx-auto" role="group" aria-label=""><button type="button" class="btn btn-primary mr-atlas matchjoin hand" data-toggle="tooltip" data-placement="bottom" title="Join Match"><i class="fas fa-sign-in"></i></button><button type="button" class="btn btn-primary mr-atlas matchspectate hand" data-toggle="tooltip" data-placement="bottom" title="Join as Spectator"><i class="fas fa-video"></i></button><button type="button" href="#copy" class="matchlink btn btn-primary mr-atlas hand" data-clipboard-text="atlas://join/'+json.matchid+'" data-clipboard-action="copy" data-toggle="tooltip" data-placement="bottom" title="Copy Atlas Match Link to Clipboard"><i class="fas fa-link"></i></button>';
    if(json.username == user){
      matchdiv += '<button type="button" class="btn btn-danger hand mr-atlas matchremove" data-toggle="tooltip" data-placement="bottom" title="Remove Match"><i class="fas fa-trash-alt"></i></button>';
    }
    matchdiv += '</div></div></div><div id="collapse'+json.matchid+'" class="collapse" data-parent="#matchlist-container"><div class="card-body match-details"><div class="d-block w-100 text-center"><div class="d-inline-block align-top"><span class="badge badge-warning team-badge p-2">'+json.orange_points+'</span></div><div class="d-inline-block align-top"><div class="d-block"><span class="badge badge-light clock-badge p-2">'+matchclock+'</span></div><div class="d-block px-2"><span class="badge badge-dark clock-badge">'+json.game_status+'</span></div></div><div class="d-inline-block align-top"><span class="badge badge-primary team-badge p-2">'+json.blue_points+'</span></div></div><div class="row"><div class="col-6"><ul class="list-group player-list list-group-flush text-right">';
    
    if('orange_team' in json) {
      json.orange_team.forEach(playername => {
        matchdiv += '<li class="list-group-item">'+ playername +'</li>';
      });
    }
    matchdiv += '</ul></div><div class="col-6"><ul class="list-group player-list list-group-flush text-left">'
    if('blue_team' in json) {
      json.blue_team.forEach(playername => {
        matchdiv += '<li class="list-group-item">'+ playername +'</li>';
      });
    }
    matchdiv += '</ul></div></div></div><div class="card-footer text-muted text-center"><button class="matchlink btn btn-sm btn-link text-muted pl-1 hand" data-clipboard-text="'+json.matchid+'" data-clipboard-action="copy" data-toggle="tooltip" data-placement="bottom" title="Copy to Clipboard">'+json.matchid+'</button><button class="matchlink btn btn-sm btn-primary mr-2 hand" data-clipboard-text="atlas://join/'+json.matchid+'" data-clipboard-action="copy" data-toggle="tooltip" data-placement="bottom" title="Copy Atlas Match Link to Clipboard"><i class="fas fa-link"></i></button><button class="matchlink btn btn-sm btn-primary hand" data-clipboard-text="atlas://spectate/'+json.matchid+'" data-clipboard-action="copy" data-toggle="tooltip" data-placement="bottom" title="Copy Atlas Spectate Match Link to Clipboard"><i class="far fa-eye"></i></button></div></div></div>'

    var listCon = document.getElementById("matchlist-container");
    listCon.insertAdjacentHTML(listposition, matchdiv);
  }

  //Checks if there's any matchObjects and if not, sets a message
  function matchCount() {
    let objectCount = document.querySelectorAll('#matchlist-container .matchcard').length;
    if (objectCount < 1 || objectCount == undefined) {
      $("#noMatches").show();
    } else {
      $("#noMatches").hide();
    }
  }

  //Join Match
  $('#matchlist-container').on('click', '.matchjoin', function(){
    console.log('START JOIN')
    ipcMessage('join', $(this).closest('.matchcard').attr("id"))
  });

  //Join as Spectator 
  $('#matchlist-container').on('click', '.matchspectate', function(){
    console.log('START SPECTATOR JOIN')
    ipcMessage('spectate', $(this).closest('.matchcard').attr("id"))
  });

  //Remove your match
  $('#matchlist-container').on('click', '.matchremove', function(){
    console.log('START REMOVE')
    removeID = $(this).closest('.matchcard').attr("id");
    ipcMessage('removeMatch',user, removeID.toString())
  });

  function removeMatch(id){
    $("#"+ id).remove()
    matchIDs.forEach(function(object,index) {
      if(object.matchid == id){
        matchIDs.slice(index)
      }
    });
  }

  function hostMatch(json){
    if('match' in json) {
      removeMatch(json.match.matchid);
      createNew(json.match);
    } else {
      console.log('Match Not Returned');
    }
  }

  ipc.on('master', (e, type, msg,arg) => {
    try{
      switch (type) {
        case 'newMatch': user = arg;createUI(msg); break
        case 'hostMatch': hostMatch(msg); break;
        case 'removeMatch' : removeMatch(msg); matchCount(); break
        case 'user': 
          user = msg
          $('#useridsection').html(user);
          break
        case 'error':
          console.log('error');
          var alertdiv = '<div class="col-12 alert alert-danger text-center alert-dismissible fade show" role="alert"><h4 class="alert-heading">'+msg+'!  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> </h4><p class="mb-0">'+arg+'</p></div>';
          var maincontainer = document.getElementById("maincontainer");
          maincontainer.insertAdjacentHTML('afterbegin', alertdiv);
          break
      }
    }
    catch (e) {
      console.log(e)
      txt = "ERROR\n\n"+"Directory is invalid\n";
    }
    finally {
      setTimeout(function() {
        $('#refresh').find('i:first').removeClass('fa-spin');
      }, 1000);

    }
  });

  //Host Match
  $("#host").click(function() {
    const matchsettings = {
      whitelist: whitelist,
      is_protected: $("#isPrivate").is(".locked"),
      allow_spectators: true,
      //max_slots: $('input[name=radio-group]:checked').val(),
      max_slots: 10,
      lfg: $("#isLFG").is(".locked"),
      title: $("#lobbyname").val()
    }
    console.log(matchsettings)
    savedmatchsettings = matchsettings;
    ipcMessage('createMatch', matchsettings);
  });

  $('#isPrivate').click(function(){
    $('.whitelistref').toggleClass("text-primary locked");
    /* toggle click state for edit whitelist text button */
  });

  $('#isLFG').click(function(){
    $(this).toggleClass("text-primary locked");
    /* toggle click state */
  });

  //Add to Whitelist by enter
  $('.inputAdd').keypress(function(e){
    if(e.which == 13) {
      $("#addplayer").focus().click();
    }
  });

  var input = document.querySelector('input[name=whitelist]'),
  tagify = new Tagify(input, {whitelist:[]}), controller;
  tagify.on('input', onInput)
  tagify.on('add', onAddTag)
  tagify.on('remove', onRemoveTag)

  // add a class to Tagify's input element
  tagify.DOM.input.classList.add('tagify__input--outside');

  // replace Tagify's input element outside of the  element (tagify.DOM.scope), just before it
  tagify.DOM.scope.parentNode.insertBefore(tagify.DOM.input, tagify.DOM.scope);

  function onInput( e ){
    var value = e.detail;
    tagify.settings.whitelist.length = 0; // reset the whitelist
    controller && controller.abort();
    controller = new AbortController();

    fetch("<SEARCH API URL>" + value, {headers:headers,signal:controller.signal})
      .then(RES => RES.json())
      .then(function(results){
        tagify.settings.whitelist = results.results;
        tagify.dropdown.show.call(tagify, value); // render the suggestions dropdown
    })
  }

  $("#cleartags").click(function(){
    tagify.removeAllTags();
  });
  

  function onAddTag(e){
    if(e.detail.data.value.startsWith("@")){
      tagify.removeTag(e.detail.tag);
      tagify.addTags(e.detail.data.value.split(" ").slice(1));
    }
    test = JSON.parse(input.value);
    var i;
    for (i = 0; i < test.length; i++) {
      whitelist.push(test[i].value);
    }
    whitelist = [ ...new Set(whitelist) ];
  }

  function onRemoveTag(e){
    test = e.detail.data;
    var index = whitelist.indexOf(test.value)
    whitelist.splice(index,1);
  }

  function pad2(n){
    return (n < 10 ? '0' : '') + n
  }

});