var zmq = require('zmq')
  , sock = zmq.socket('sub');

sock.subscribe('job1');
sock.connect('tcp://127.0.0.1:6795');

sock.on('message', function(msg){
  console.log(msg.toString());
})
