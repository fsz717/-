var express = require('express');
var router = express.Router();
const uploads=require('../middlewares/uploads')//上传文件中间件
const {positionsCtr_add,positionsCtr_find,positionsCtr_del,positionsCtr_update}=require('../controller/positionCtr')

//增
router.post('/add',uploads,positionsCtr_add);
//删
// router.get('/del',positionsCtr_del)

//restful风格 删
router.get('/del/:id',positionsCtr_del)

//改
router.post('/update',uploads,positionsCtr_update)
//查
router.get('/getList',positionsCtr_find);
module.exports = router;
