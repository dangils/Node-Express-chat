//채팅정보 스키마 생성

const mongoose = require('mongoose');


const userchatSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength:50
    },
    message: {
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



// //DB의 채팅내역을 받아옴

// router.get('/chathistory',(req,res)=>{

//     let name = req.query.type
//     let message = rea.query.


// })
