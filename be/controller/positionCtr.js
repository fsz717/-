const {add,find,del,updateMany,update}=require('../model/positionModel')
const moment=require('moment')
//增
const positionsCtr_add=async (req, res) =>{
    //get 获取参数 req.query
    //post 获取参数  req.body
     //通过三方的插件来处理createTime
    const time= moment().format('YYYY-MM-DD,hh:mm:ss a')
    req.body.createTime=time;
    const arr=await find({});//查到的是一个数组
    const tokenId=arr.length+1;
    req.body.tokenId=tokenId;
    const result=await add(req.body);
    if (result) {
        res.send({ status: true, msg: "保存成功"});
    } else {
        res.send({ status: false, msg: "保存失败" })
    }
  }
  //删
//   const positionsCtr_del=async(req,res)=>{
//         // req.query是一个对象
//         const tokenId=parseInt(req.query.tokenId)
//         const result=await del(tokenId);
//         const flag=await updateMany(tokenId)
//         if(result.n&&flag){
//             res.send({ status: true, msg: "删除成功" });
//         } else {
//             res.send({ status: false, msg: "删除失败" })
//         }
//   }

//rerestful风格   删
 const positionsCtr_del=async(req,res)=>{
    //获取动态路由的值 req.params
    const tokenId=parseInt(req.params.id)//id是路由上路径写的名
    const result=await del(tokenId);
    const flag=await updateMany(tokenId)
    if(result.n&&flag){
        res.send({ status: true, msg: "删除成功" });
    } else {
        res.send({ status: false, msg: "删除失败" })
    }
}

  //改
  const positionsCtr_update=async (req,res)=>{
      //此处的req.body是对象，是你传入的数据
    console.log(req.body)
    const tokenId=parseInt(req.body.tokenId)
    const result=await update(tokenId,req.body);
    if(result.n){
        res.send({ status: true, msg: "修改成功" });
    } else {
        res.send({ status: false, msg: "修改失败" })
    }
  }

  //查
  const positionsCtr_find=async(req,res)=>{
      //前端传递过来参数
        //1.page 2.count 3.key
        //page-1*count 公式

        //查找所有数据长度
        const arr1=await find({})
        const len=arr1.length;

        let num=parseInt(req.query.num)||5;//一次返回多少条数据
        let page=(req.query.page-1)*num;//前端传递的页码
        //处理field字段
        //1.用户传了一个id过来 返回当前id对应的数据
        //2.用户点击搜索的时候 传递一个关键字 需要使用正则进行数据库匹配再返回
        //3.用户什么都没传
        //加入前端同时传了两个值 告诉前端出错
        let field = "";
        if(req.query.key&&req.query.tokenId){
            res.send({satus:false,msg:"不要同时传两个参数"})
        }
        if(req.query.tokenId){
            field={tokenId:req.query.tokenId-0}
        }else if(req.query.key){
            field={companyName: new RegExp(req.query.key)}
        }else{
            field={}
        }

        //查找搜索的词的数据长度
        const key_arr=await find({field})
        const nums=key_arr.length;

        const result=await find({num,page,field});
        const count=result.length;
        if(result.length!=0){
            res.send({ status: true,count:count, msg: "查找成功" ,list:result,"len":len,'nums':nums,key_arr,listAll:arr1});
        }else {
            res.send({ status: result, msg: "查找失败" })
        }
  }

  module.exports={
      positionsCtr_add,
      positionsCtr_find,
      positionsCtr_del,
      positionsCtr_update
  }