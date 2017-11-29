var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("connected -homepage");
  
  var io = req.app.io;
  io.sockets.on('connect',function(socket)
        {
                io.emit('message',{"text":"Connect recieved"});
                console.log("Connect");
        });

        io.sockets.on("connection",function(socket)
        {
                io.emit('message',{"text":"You have connected to mighty esperer"});    
                console.log("Connected");
        });



  res.render('index', { title: 'Express' });
});

module.exports = router;
