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

// ログイン
io.on('connection', function(socket){
    var loginUsers = []; //ログインユーザ

    // ログイン処理
    socket.on('login', function(userInfo){
        loginUsers[userInfo.userID] = userInfo.userName;
    });

    // メッセージ送信処理
    socket.on('chat message', function(msg){
        userName = loginUsers[socket.id];
        io.emit('chat message',{
            userName: userName,
            message: msg
        });
    });
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
