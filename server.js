var io = require('socket.io')(5555);
var fs = require('fs');
var file;

io.on('connection', function (socket){
  socket
  .emit('connect')
  .on('binding', function (path){
    file = path;
  })
  .on('update-file', function (data){
    var rgba = data.rgba.r.toString() + ',' + data.rgba.g.toString() + ',' + data.rgba.b.toString() + ',' + data.rgba.a.toString();
    console.log(rgba);

    var liner = require('./liner');
    var source = fs.createReadStream(file);

    source.pipe(liner);
    liner
    .on('readable', function () {
      var line = liner.read();
      console.log(line);
    })
    .on('end', function (){
      console.log('stream ended');
      source.unpipe(liner);
      liner.end();
    });

  })
})
