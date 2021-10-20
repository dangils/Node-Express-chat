const express = require('express')
const http = require('http')
const app = express();
const router = express.Router();
const server =http.createServer(app);
const fs = require('fs')
const io = require('socket.io')(server) 
        //양방향 통신을 위한 socket.io 모듈을 설정

const mongoose = require("mongoose");

mongoose.connect('MongooseURI 입략')
.then(()=> console.log('MongoDB Connected!!')).catch(err => console.log(err));



app.use(express.static('src')) //정적 파일 설정 

app.get('/',function(req,res){ //사용자가 접근할 url 경로
                //접속 성공시 아래 메서드 수행,readFile : 파일 전체를 비동기로 읽어옴
    fs.readFile('./src/index.html',(err,data)=>{
        if(err) throw err;

        res.writeHead(200, {
            'Content-Type' : 'text/html'
            //응답 스트림에 헤더와 상태코드 작성
        })
        .write(data) // 체이닝으로 응답 바디 작성
        .end() //요청 전송 종료
    })
})





/*
newUserConnect 접속한다 -> 대화명 저장(name) -> 메세지 설정 -> 메세지 업데이트 함수호출
*/
io.sockets.on('connection', function(socket){ 
    //여기서 socket 인자는 현재 접속된 소켓의 객체

//io.sockets -> 나를 포함한 모든 소켓의 객체 / on 메서드를 통해 이벤트 바인딩 -> connection 이벤트가 호출되면 실행


//on: 수신 , emit : 발신
    socket.on('newUserConnect', function(name){
        //최초 소케 연결시 socket.name 에 name 저장
        socket.name = name;

        io.sockets.emit('updateMessage',{
            name:'SERVER',
           //newUserConnect는 서버에 전달하는 메세지로 
           //name에는 'SERVER'라고 작성
            message:name + '님이 접속했습니다'
            // 2초간 보여주고 사라짐
        })
    })
    

    socket.on('disconnect',function(){

        socket.broadcast.emit('updateMessage',{
        //socket.broadcase는 나를 제외한 전체 소켓
            name:'SERVER',
            message:socket.name + '님이 퇴장했습니다'
        })
    })

    socket.on('sendMessage',function(data){
        data.name = socket.name;
        io.sockets.emit('updateMessage',data);
    })
})







server.listen(3000,function(){
    console.log('3000번 포트 서버 실행!')
})

