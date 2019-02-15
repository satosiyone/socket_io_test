var app = require('express')();
var http  = require('http').Server(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
//var loginUsers = []; // この書き方だと SS -> CS へ emit するときに undefined になる // 半日ハマった
var loginUsers = {}; //ログインユーザ // connection内で宣言すると毎回初期化される
var answers = {}; // 回答

// Nodeサーバにアクセスがあるとindex.htmlへ遷移
app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});

// connection
io.on('connection', function(socket){
    // ログイン処理
    socket.on('login', function(userInfo){
        loginUsers[userInfo.userID] = userInfo.userName;
        // ユーザリスト表示
        io.emit('user list', loginUsers);
    });

    // メッセージ送信処理
    socket.on('chat message', function(msg){
        userName = loginUsers[socket.id];
        io.emit('chat message',{
            userName: userName,
            message: msg
        });
    });

    // STARTボタン押下時
    socket.on('btnStart',function(){
        let htmlStr = '';
        let odai = ['A:夏 B:冬', 'A:たけのこ B:キノコ', 'A:父親 B:母親'];
        let rand = Math.floor(Math.random() * 3);
        htmlStr += odai[rand];
        //お題表示
        io.emit('odai', htmlStr);
    });

    // A/Bボタン押下時
    socket.on('btnA',function(id){
        io.emit('btnA', id);
        answers[id] = 'A';
    });

    socket.on('btnB',function(id){
        io.emit('btnB', id);
        answers[id] = 'B';
    });

    // 集計ボタン押下時
    socket.on('btnResults',function(){
        let counts = {};
        for(let id in answers){
            let key = answers[id];
            counts[key] = (counts[key]) ? counts[key] + 1 : 1;
        };
        let htmlStr = 'A: ' + counts['A'] + ' B: ' + counts['B'];
        io.emit('btnResults', htmlStr);
    });

    // リセットボタン押下時
    socket.on('btnReset',function(){
        loginUsers = {};
        answers = {};
    });
});

http.listen((PORT), function(){
    console.log('listening on *:3000');
});
