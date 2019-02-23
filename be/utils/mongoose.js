const mongoose=require('mongoose');
const url='mongodb://127.0.0.1:27017/h51802';
mongoose.connect(url);
const db=mongoose.connection;
db.on('error',console.error.bind(console,"连接错误"));
db.once('open',function(){
    console.log("数据库连接成功")
})
//定义职位的模型，定义字段
const positionSchema={
    companyLogo: String,
    tokenId:{ type: Number, required: true },
    companyName: { type: String, required: true },//required为true 表示必填选项
    positionName: { type: String, required: true },
    city: { type: String, required: true },
    salary: { type: String, required: true },
    degree: { type: String, required: true },
    type: { type: String, required: true },
    experience: { type: String, required: true },
    description: { type: String, required: true },
    createTime: { type: String, required: true },
}
const MongooseModel=mongoose.model('positions',positionSchema)
//定义用户注册字段
const usersSchema={
    userName:{type:String,required:true},
    password:{type:String,required:true},
    phoneNum:{type:Number,required:true},
    email:{type:String,required:true},
    sex:{type:String,required:true},
    hobby:{type:String},
    randomNum:{type:String}
}
const MongooseModel2=mongoose.model('users',usersSchema)

module.exports={
    MongooseModel,
    MongooseModel2
}