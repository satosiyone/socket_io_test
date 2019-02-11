var app = require('express')();
var http  = require('http').Server(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
var loginUsers = []; //ログインユーザ // connection内で宣言すると毎回初期化される

// Nodeサーバにアクセスがあるとindex.htmlへ遷移
app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});

// ログイン
io.on('connection', function(socket){
    // ログイン処理
    socket.on('login', function(userInfo){
        loginUsers[userInfo.userID] = userInfo.userName;
        for (var i in loginUsers) {
            console.log("SS:list[" + i + "]=", loginUsers[i]);
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
        console.log('SS:メッセージ送信');
        var length = Object.keys(loginUsers).length;
        console.log('SS:length = ' + length);
        // var str = '文字列'
        // var obj = {A:'aaa',B:'bbb'};
        var obj = [];
        obj['AAA'] = 'a1';
        obj['BBB'] = 'b2';
        var length = Object.keys(obj).length;
        for(var i in obj){
            console.log('obj[' + i +'] = ' + obj[i]);
        };
        console.log('SS:length obj = ' + length);
        // io.emit('user list', obj);

        // テスト
        var obj1 = { hoge: 'hoge' };
        io.emit('test1', obj1);

        var obj2 = {};
        obj['fuga'] = 'fuga';        
        io.emit('test2', obj2);
    });
});

http.listen((PORT), function(){
    console.log('listening on *:3000');
});
