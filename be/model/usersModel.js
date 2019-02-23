const {MongooseModel2}=require('../utils/mongoose');

//注册时往数据库添加数据
const add=(data)=>{
    const users=new MongooseModel2(data);
    console.log(data)
    return users.save()
        .then((res)=>{
            console.log("保存的结果")
            return true;
        })
        .catch((err)=>{
            return false;
        })
}
//删
const del=(usn)=>{
    return MongooseModel2.deleteOne({userName:usn})
            .then(result=>{
                return result;//{ n: 1, ok: 1 },当没有数据删除，或者删除不成功时n=0;
            })
}
//改
const update=(usn,datas)=>{
    return MongooseModel2.updateOne({"userName":usn},datas)
            .then((result)=>{
                return result;
            })
}
//登录时查询数据总数据
const find=(query={})=>{
    return MongooseModel2.find(query)
            .then((res)=>{
                return res;
            })
            .catch(err=>{
                return false;
            })
}

const find1=(query={})=>{
    return MongooseModel2.find(query.field).limit(query.num).skip(query.page)
            .then((result)=>{
                return result;
            })
            .catch(err=>{
                return false;
            })
}
module.exports={
    add,find,find1,del,update
}