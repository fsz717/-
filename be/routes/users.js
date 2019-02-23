const express = require('express')
const router = express.Router();
const { usersCtr_login, usersCtr_register, usersCtr_find, usersCtr_find_sigle,usersCtr_update,usersCtr_del,checkCtr } = require('../controller/usersCtr')

router.post("/register", usersCtr_register)

router.post("/login", usersCtr_login)
router.get('/getInfo', usersCtr_find);
router.get('/getInfo_sigle', usersCtr_find_sigle);
//restful风格 删
router.get('/del/:usn', usersCtr_del)
//改
router.post('/update', usersCtr_update)
router.post('/check',checkCtr)
module.exports = router;