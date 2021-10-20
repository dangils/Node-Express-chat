//채팅정보 스키마 생성

const mongoose = require('mongoose');

const userchatSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength:50
    },
    content: {
        type: String
    },
}, { timestamps: true })

// productSchema.index({ // title,description에 포함된 text도 검색
//     title: 'text',
//     description: 'text'
// }, {
//     weights: {
//         title: 5, //검색시 title의 중요도를 높임
//         description: 1
//     }
// })


const UserChat = mongoose.model('UserChat', userchatSchema);

module.exports = { UserChat }


// //DB에 채팅 데이터 저장
// router.post('/',(req,res) =>{


//     const userchat = new UserChat(req.body)
//     //request body 의 key-value값을 받아옴

//     userchat.save((err)=>{
//         //에러 처리
//         if(err) return res.status(400).json({success:false, err})
//         return res.status(200).json({success:true})
//     })
// })


// //DB의 채팅내역을 받아옴

// router.get('/chathistory',(req,res)=>{

//     let name = req.query.type
//     let message = rea.query.


// })
