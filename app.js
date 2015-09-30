

var spark = require('spark');
var sparkDevice = null;

spark.login({accessToken: process.env.ACCESS_TOKEN}).then(
  function(token){
    console.log("done");
    spark.getDevice(process.env.DEVICE_ID, function(err, device) {
       sparkDevice = device; 
       startSparkInterval();
    });
  },
  function(err) {
    
  }
);

function startSparkInterval(){
  setInterval(getSparkVariables,5000);
}

function getSparkVariables(){
  
  console.log("get spark var");
  sparkDevice.getVariable('stacey', function(err, data) {
  if (err) {
    console.log("Issue with Result");
    
  } else {
     console.log("data.result: "+data.result);
    io.emit('message', { msg: data.result });
    // Send through Socket IO 
  }
});
}


var http = require('http'),
  fs = require('fs'),
  // okay sync just cos its booting this bad stuff up

  index = fs.readFileSync(__dirname + '/index.html');

// K i am sending back a basic file here yo
var app = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(index);
});
app.listen(process.env.port||3000);
// Socket.io server listens to our app
var io = require('socket.io').listen(app);

io.on('connection', function (socket) {
  socket.emit('welcome', { message: 'Welcome!', id: socket.id });
});

// Send current time to all connected clients
function sendMessage() {
  io.emit('message', { msg: new Date().toJSON() });
}




