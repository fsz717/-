const { find, add, find1, del, update } = require("../model/usersModel")
var jwt = require('jsonwebtoken')
//添加用户
const usersCtr_add = async (req, res) => {
    let data = req.body;
    let result = await add(data);
    if (result) {
        res.send({ status: true, msg: "保存成功" });
    } else {
        res.send({ status: false, msg: "保存失败" })
    }
}
//查询
const usersCtr_find = async (req, res) => {
    let field = {}
    console.log(req.query)
    if (req.query) {
        field = req.query
    }
    let result = await find(field);
    if (result.length != 0) {
        res.send({ status: true, msg: "用户名已存在", arr: result })
    } else {
        res.send({ status: false, msg: '用户名不存在' })
    }
}
//查询并分页
const usersCtr_find_sigle = async (req, res) => {
    let field = "";
    let num = parseInt(req.query.num) || 5;//一次返回多少条数据
    let page = (req.query.page - 1) * num;//前端传递的页码
    if (req.query.key) {
        field = { userName: new RegExp(req.query.key) }
    } else {
        field = {}
    }
    const key_arr = await find(field)
    const nums = key_arr.length;
    const result = await find1({ num, page, field });
    if (result.length != 0) {
        res.send({ status: true, msg: "用户名已存在", arr: result, nums ,key_arr:key_arr})
    } else {
        res.send({ status: false, msg: '用户名不存在' })
    }
}
//删
const usersCtr_del = async (req, res) => {
    //获取动态路由的值 req.params
    const usn = req.params.usn//id是路由上路径写的名
    const result = await del(usn);
    if (result.n) {
        res.send({ status: true, msg: "删除成功" });
    } else {
        res.send({ status: false, msg: "删除失败" })
    }
}

//改
const usersCtr_update = async (req, res) => {
    //此处的req.body是对象，是你传入的数据
    console.log(req.body)
    const tokenId = parseInt(req.body.tokenId)
    const result = await update(tokenId, req.body);
    if (result.n) {
        res.send({ status: true, msg: "修改成功" });
    } else {
        res.send({ status: false, msg: "修改失败" })
    }
}

//注册
const usersCtr_register = async (req, res) => {
    let data = req.body;
    let result1 = await find({ userName: data.userName });
    if (result1.length === 0) {
        let result = await add(data);
        if (result) {
            res.send({ status: true, msg: "保存成功" });
        } else {
            res.send({ status: false, msg: "保存失败" })
        }
    } else {
        res.send({ status: false, })
    }
}
//登录
const usersCtr_login = async (req, res) => {
    let field = {}
    if (req.body) {
        field = req.body
    }
    let result = await find(field);
    if (result.length != 0) {
        //生成token
        let payload = {
            userName: req.body.userName
        }
        let secrect = 'fsz';//自定义的一个变量和字符串
        let token = jwt.sign(payload, secrect, {
            expiresIn: '10h',//指定token生效的时间,30h位30小时,60为60s
        })
        res.send({ status: true, msg: "登入成功", arr: result, token: token,userName:req.body.userName})
    } else {
        res.send({ status: false, msg: '账号或密码错误', arr: req.body })
    }
}
const checkCtr = ((req, res) => {
    //验证使用jwt.verify(token,secrect,callback)
    let token = req.body.token;
    let secrect = 'fsz';
    jwt.verify(token, secrect, (err, decode) => {
        //如果验证不通过，err就有值了
        if (err) {
            res.send({ msg: "验证失败" })
        } else {
            console.log(decode)
            res.send({ msg: "验证通过", userName: decode.userName })
        }
    })
})
module.exports = {
    usersCtr_login,
    usersCtr_add,
    usersCtr_find,
    usersCtr_find_sigle,
    usersCtr_update,
    usersCtr_del,
    usersCtr_register,
    checkCtr
}