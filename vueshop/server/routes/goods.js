var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require("../models/goods")

//连接MongDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/vue_shop_lesson');

//线上地址
// mongoose.connect("mongodb://dn_dba:pwd_song@101.200.129.112:27017/vue_shop_lesson", {auto_reconnect: true});

mongoose.connection.on("connected",function(){
  console.log("MongoDB connected success")
})

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param('pageSize'));
  let sort = req.param("sort");
  let skip = (page-1)*pageSize;
  let params = {};
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({"salePrice":sort});
  goodsModel.exec(function(err,doc){
    if (err){
      res.json({
        status:1,
        msg:err.message
      })
    }else {
      res.json({
        status:0,
        msg:"",
        result:{
          count: doc.length,
          list: doc
        }
      })
    }
  })
});

module.exports = router;
