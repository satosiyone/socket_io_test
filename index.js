var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});

// everyoneにsocket.ioのイベント発火(emit)
io.emit('some event',{for: 'everyone' });

// 全員にメッセージをブロードキャスト
io.on('connection', function(socket){
    socket.broadcast.emit('hi');
});

// 同時全員送信
io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        // クライアント側からの'chat message'を受け取る
        io.emit('chat message', msg);
    })
})

http.listen(3000, function(){
    console.log('listening on *:3000');
});
