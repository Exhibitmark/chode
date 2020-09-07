$(function() {
    const electron = require('electron');
    const ipc = electron.ipcRenderer;

    $('#orangeTeam').change(function() {
        messaging('teams', $('#orangeTeam').val(), 1)
      });
  
      $('#blueTeam').change(function() {
        messaging('teams', $('#blueTeam').val(), 0)
      });
  
      $('#roundAmount').change(function() {
        messaging('round', $('#roundAmount').val())
      });
  
      $('#resetScore').click(function() {
        messaging('resetScore','','')
      });

      $('#resetAll').click(function() {
        messaging('resetAll','','')
      });
  
      $('#orangePoints').change(function() {
        messaging('pointsUpdate', $('#orangePoints').val(), 1)
      });
  
      $('#bluePoints').change(function() {
        messaging('pointsUpdate', $('#bluePoints').val(), 0)
      });
  
      function messaging(type, arg, id) {
        ipc.send('message',type, arg,id)
      }
});