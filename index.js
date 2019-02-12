var app = require('express')();
var http  = require('http').Server(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
//var loginUsers = []; // この書き方だと SS -> CS で undefined になる
var loginUsers = {}; //ログインユーザ // connection内で宣言すると毎回初期化される

// Nodeサーバにアクセスがあるとindex.htmlへ遷移
app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});

// ログイン
io.on('connection', function(socket){
    // ログイン処理
    socket.on('login', function(userInfo){
        loginUsers[userInfo.userID] = userInfo.userName;
        for(let i in loginUsers){
            console.log('A:ユーザーリスト = ' + loginUsers[i]);
        }
    });

    // メッセージ送信処理
    socket.on('chat message', function(msg){
        userName = loginUsers[socket.id];
        io.emit('chat message',{
            userName: userName,
            message: msg
        });
        // ユーザリスト表示
        io.emit('user list', loginUsers);
    });
});

http.listen((PORT), function(){
    console.log('listening on *:3000');
});
