const express = require('express')
const http = require('http')
const app = express();
const router = express.Router();
const server =http.createServer(app);
const fs = require('fs')
const io = require('socket.io')(server) 
        //양방향 통신을 위한 socket.io 모듈을 설정



const {UserChat} = require("./src/models/UserChat")

const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://hangil:gksrlf3%23@cluster0.icdbf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
.then(()=> console.log('MongoDB Connected!!')).catch(err => console.log(err));


//UserChat 스키마에 받아온 정보들을 넣어준다
// router.post("/", async(req,res)=>{
//     const userChat = new UserChat(req.body)

//     chat.save((err)=>{
//         if(err) return res.status(400).json({success:false,err})
//         return res.status(200).json({success:true})
//     })
// })


/*
app.use는 기본적으로 모든 라우터/모든 메서드에 적용되는 미들웨어를 넣을 때 사용 특정 주소에만 적용하고 싶으시면 app.use(주소, 미들웨어) 
*/

app.use(express.static('src')) //정적 파일 설정  , SRC폴더에잇는 파일들을 로드할 수 있음

//app.get
// 주소창에 입력 받았을 때 실행할 사항들을 나타내는 라우트 함수
app.get('/',function(req,res){ //사용자가 접근할 url 경로
                //접속 성공시 아래 메서드 수행,readFile : 파일 전체를 비동기로 읽어옴
    fs.readFile('./src/index.html',(err,data)=>{
        if(err) throw err;

        res.writeHead(200, {
            'Content-Type' : 'text/html'
            //응답 스트림에 헤더와 상태코드 작성, Content-Type으로 
        })
        .write(data) // 체이닝으로 응답 바디 작성
        .end() //요청 전송 종료
    })
})





/*
newUserConnect 접속한다 -> 대화명 저장(name) -> 메세지 설정 -> 메세지 업데이트 함수호출
*/
io.sockets.on('connection', function(socket){ 
    //connection 이벤트가 호출되면 실행될 함수를 바인딩
    //여기서 socket 인자는 현재 접속된 소켓의 객체

//io.sockets -> 나를 포함한 모든 소켓의 객체 / on 메서드를 통해 이벤트 바인딩 -> connection 이벤트가 호출되면 실행
console.log('connect seuccess!')

//접속 메세지 출력 함수 
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
    
    // 퇴장 메세지 출력 함수
    socket.on('disconnect',function(){

        socket.broadcast.emit('updateMessage',{
        //socket.broadcase는 나를 제외한 전체 소켓
            name:'SERVER',
            message:socket.name + '님이 퇴장했습니다'
        })
    })

    //메세지 수신 함수 
    /*
    socket.on으로 sendMessage라는 소켓의 데이터를 받고, 
    io.sockets (나를 포함한 모든 소켓) 으로 emit(송신) 한다.
    updateMessage라는 소켓으로 메세지를 송신하고

    */
    socket.on('sendMessage',function(data){
        data.name = socket.name;
        io.sockets.emit('updateMessage',data);
        console.log(socket.name , data.message)
        
        const body = {
            name:socket.name,
            message:data.message
        }
            const userChat = new UserChat(body)
            userChat.save()

    })
})


server.listen(3000,function(){
    console.log('3000번 포트 서버 실행!')
})

