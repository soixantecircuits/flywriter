var io = require('socket.io')(5555);
var fs = require('fs');
var file;
var prevColor;

io.on('connection', function (socket){
  socket
  .emit('connect')
  .on('binding', function (data){
    file = data.path;
    prevColor = data.color;
  })
  .on('update-color', function (color){
    io.emit('live-change', color);
  })
  .on('update-file', function (data){
    if(file){
      fs.writeFile(file, '{"colors": ' + JSON.stringify(data, null, '\t') + '}', 'utf8', function (err) {
         if (err){
          return err;
         } else {
          console.log('changed', file);
          io.emit('reload-config');
         }
      });
    } else {
      console.log('No such file, sorry');
    }
  })
});