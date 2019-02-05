var app = require('express')();
var http  = require('http').Server(app);
var io = require('socket.io')(http);

// Nodeサーバにアクセスがあるとindex.htmlへ遷移
app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
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

http.listen((process.env.PORT || 3000), function(){
    console.log('listening on *:3000');
});
