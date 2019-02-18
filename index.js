var app = require('express')();
var http  = require('http').Server(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
//var loginUsers = []; // この書き方だと SS -> CS へ emit するときに undefined になる // 半日ハマった
var idMap = new Map();

// Nodeサーバにアクセスがあるとindex.htmlへ遷移
app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});

// connection
io.on('connection', function(socket){
    // ログイン処理
    socket.on('login', function(userInfo){
        let obj = {name: userInfo.userName, answer: 'yet', vote: 'yet', counts: 0};
        idMap.set(userInfo.userID, obj);
        // ユーザリスト表示
        let htmlStr = '<ul>';
        idMap.forEach(function(value, key){
            htmlStr += '<li id=list_' + key + '>' + value.name + '</li>';
            htmlStr += '<button class=btnVote id=btn_' + key + '>投票</button>';
            htmlStr += '<button class=btnHang id=hang_' + key + '>正体を暴く</button>';
        });
        htmlStr += '</ul>';
        io.emit('user list', htmlStr);
    });

    // メッセージ送信処理
    socket.on('chat message', function(msg){
        userName = idMap.get(socket.id).name;
        io.emit('chat message',{
            userName: userName,
            message: msg
        });
    });

    // STARTボタン押下時
    socket.on('btnStart',function(){
        let htmlStr = '';
        let odai = ['A:夏 B:冬', 'A:たけのこ B:キノコ', 'A:父親 B:母親', 'A:数字の２ B:数字の３'];
        let rand = Math.floor(Math.random() * 3);
        htmlStr += odai[rand];
        //お題表示
        io.emit('odai', htmlStr);
    });

    // A/Bボタン押下時
    socket.on('btnA',function(id){
        io.emit('btnA', id);
        idMap.get(id).answer = 'A';
    });

    socket.on('btnB',function(id){
        io.emit('btnB', id);
        idMap.get(id).answer = 'B';
    });

    // 集計ボタン押下時
    socket.on('btnResults',function(){
        let counts = {};
        idMap.forEach(function(value){
            let key = value.answer;
            counts[key] = (counts[key]) ? counts[key] + 1 : 1;
        });
        let htmlStrA = 'A: ' + (counts['A'] ? counts['A'] : '0');
        let htmlStrB = ' B: ' + (counts['B'] ? counts['B'] : '0');
        io.emit('btnResults', htmlStrA + htmlStrB);
    });

    // リセットボタン押下時
    socket.on('btnReset',function(){
        idMap = new Map();
    });

    // 投票ボタン押下時
    socket.on('btnVote',function(voteFrom, voteTo){
        // key:投票した人 value:投票相手
        idMap.get(voteFrom).vote = voteTo;
    });

    // 暴くボタン押下時
    socket.on('btnHang',function(id){
        io.emit('btnHang', id, idMap.get(id).answer);
    });

    // 開票結果ボタン押下時
    socket.on('btnOpen',function(){
        let counts = {};
        idMap.forEach(function(value){
            let key = value.vote;
            counts[key] = (counts[key]) ? counts[key] + 1 : 1;
        });

        let htmlStr = '';
        idMap.forEach(function(value, key){
            htmlStr += value.name + ' : ' + (counts[key] ? counts[key] : '0') + ' ';
        });
        io.emit('btnOpen', htmlStr);
    });
});

http.listen((PORT), function(){
    console.log('listening on *:3000');
});
