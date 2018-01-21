var express = require("express");
var router = express.Router();
var User = require("./../models/users");

router.post("/login",function(req,res,next){
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param,function(err,doc){
    if (err){
      dealErr(res,err)
    }else{
      if (doc){
        res.cookie("userId",doc.userId,{
          path:"/",
          maxAge:1000*60*60  //有效期一小时
        })
        res.cookie("userName",doc.userId,{
          path:"/",
          maxAge:1000*60*60  //有效期一小时
        })
        res.json({
          status:0,
          msg:"",
          result:{
            userName:doc.userName
          }
        })
      }
    }
  })
})

//登出接口
router.post("/logout",function(req,res,next){
  res.cookie("userId","",{
    path:"/",
    maxAge:-1
  });
  res.json({
    status:0,
    msg:"",
    result:""
  })
})

function dealErr(res,err){
  res.json({
    status:1,
    msg:err.message
  })
}
module.exports = router;
