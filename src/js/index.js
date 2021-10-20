'use strict'
// Strict Mode란?

// Strict Mode는 코드에 더 나은 오류 검사를 적용하는 방법입니다.
// Strict Mode를 사용하면, 예를 들어 암시적으로 선언한 변수를 사용하거나 읽기 전용 속성에 값을 할당하거나 확장할 수 없는 개체에 속성을 추가할 수 없습니다.


let socket = io();
let chatWindow = document.getElementById('chatWindow')
let sendButton = document.getElementById('chatMessageSendBtn')
let chatInput = document.getElementById('chatInput')

socket.on('connect', function () {
    let name = prompt('대화명을 입력해주세요.', '');
    socket.emit('newUserConnect', name);
    //입력받은 name을 app.js의 newUserConnect 함수를 수행하며 이름 저장
})

socket.on('updateMessage', function (data) {
    if (data.name === 'SERVER') {
        let info = document.getElementById('info');
        info.innerHTML = data.message;
        setTimeout(() => {
            info.innerText = '';
        }, 2000);


    } else {
        let chatMessageEl = drawChatMessage(data); chatWindow.appendChild(chatMessageEl);
        /*
        사용자가 전달한 텍스트는 drawChatMessage()함수를 통해 객체를 생성해 chatWindow에 삽입
        */
        chatWindow.scrollTop = chatWindow.scrollHeight;
        //chatWindow의 스크롤을 chatWindow의 스크롤 높이만큼 내려주는 
    }
});



$('input#chatInput').keydown(function(key){
    if(key.keyCode==13){
                //엔터버튼 누르면 수행
        let message = chatInput.value;
        if (!message) return false;
        // message입력값이 없을 경우 전송이 안되도록 false 반환
        socket.emit('sendMessage', {
            //메세지가 정상적으로 있으면 app.js의 sendMessage 함수로 message 전달 (data)
            message
        });
        chatInput.value = '';
        //메세지를 보낸후 value값을 비워줌, 비워주지 않을 경우 input에 메세지가 그대로 있음
    
    }
})


function drawChatMessage(data) {
    let wrap = document.createElement('p');
    //p태그로 전체를 감싸줄 객체 
    let message = document.createElement('span');
    //span태그로 메세지를 담을 객체 
    let name = document.createElement('span');
    //span태그로 대화명을 담을 객체

    name.innerText = data.name;
    message.innerText = data.message;


    name.classList.add('output__user__name');
    message.classList.add('output__user__message');

    wrap.classList.add('output__user');
    wrap.dataset.id = socket.id;
    wrap.appendChild(name); wrap.appendChild(message);
    return wrap;
}


// -입장 시

// connect (index.js) -> newUserConnect (app.js) -> updateMessage (index.js)

// 소켓연결, 대화명입력받음 ->  대화명저장, 메세지 작성, 메세지 전달 -> 브라우저에 데이터 삽입


// -대화 시

// click (index.js) -> sendMessage (app.js) -> updateMessage (index.js) 

// 클릭, 메세지 작성 -> 대화명저장, 메세지 전달 -> 브라우저에 데이터 삽입



// -퇴장 시

// disconnect (app.js) -> updateMessage (index.js)

// 소켓종료, 메세지작성, 메세지 전달 -> 브라우저에 데이터 삽입

