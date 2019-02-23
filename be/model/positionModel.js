//Model专注于存储数据 在数据变化时更新控制器。
const {MongooseModel}=require('../utils/mongoose');
//增
const add=(data)=>{
     //如果要保存一条数据 1.先new 模型 2.调用save方法
    const position=new MongooseModel(data);//括号里面放要保存的参数
    return position.save() 
            .then(result=>{
                return true;
            })
            .catch(err=>{
                console.log(err)
                return false;
            })
            //也是个promise对象
}
//删
const del=(tokenId)=>{
    return MongooseModel.deleteOne({tokenId:tokenId})
            .then(result=>{
                // console.log(result)
                return result;//{ n: 1, ok: 1 },当没有数据删除，或者删除不成功时n=0;
            })
}

//更新全部
  //因为我们是根据tokenId来查询数据并删除，而tokenId的值是来自保存的数据的长度，
  //但是当我们把数据删除时，他的长度就减少了，此时tokenId就乱了.所以我们可每次删除后，更新tokenId把所有tokenId值大于删除的值都自减1.
  const updateMany=(tokenId)=>{
    const query={"tokenId":{$gt:tokenId}}
    const newd={$inc:{tokenId:-1}}
   return MongooseModel.updateMany(query,newd)
            .then(result=>{
                return true
            })
            .catch(err=>{
                return false
            })
  }

//改
const update=(tokenId,datas)=>{
    return MongooseModel.updateOne({"tokenId":tokenId},datas)
            .then((result)=>{
                console.log(result)
                return result;
            })
}
//查
const find=(query)=>{
    return MongooseModel.find(query.field).limit(query.num).skip(query.page)
            .then((result)=>{
                // console.log(result)
                return result;
            })
            .catch(err=>{
                // console.log(err);
                return false;
            })
}
module.exports={
    add,find,del,updateMany,update
}