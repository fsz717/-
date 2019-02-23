const multer=require('multer')
const path=require('path')
const uploads=(req,res,next)=>{//中间件函数
    var storage = multer.diskStorage({//设置上传的文件磁盘存储
        destination: function (req, file, cb) {//设置文件存储的路径
          //会将一个file files对象添加到req，此刻还未添加，要等到Multer在解析完请求体后
          // console.log(file)//输出一个对象，包含
          cb(null, path.join(__dirname,'../public',"/images"));
        },
        filename: function (req, file, cb) {//设置文件存储的名字
          //处理文件的存储名称
          //1、设置文件后缀名
        //   const result=Date.now()+/\.[^\.]+$/.exec(file.originalname);
        const result=file.originalname.split(".")[0]+/\.[^\.]+$/.exec(file.originalname);
          //直接给req.body添加属性 图片地址 存储到数据库(因为中间件的req是一个对象，也可以在控制层（controller中写）)
          const imgUrl='http://127.0.0.1:666/images/'+result;
          req.body.companyLogo=imgUrl;
          cb(null, result)
        }
      })
      var upload=multer({storage}).single('companyLogo');
      upload(req,res,function(err){
        if(err){
            console.log(err);
            res.send({res:false,msg:"图片上传错误"})
        }else{
            next()
        }
      })
}
module.exports=uploads;
