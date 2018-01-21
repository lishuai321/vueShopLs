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
  let priceLevel = req.param("priceLevel");
  let params = {};
  switch (priceLevel){
    case '0': params = {"salePrice":{$gt:0,$lte:100}}; break;
    case '1': params = {"salePrice":{$gt:100,$lte:500}};break;
    case '2': params = {"salePrice":{$gt:500,$lte:1000}};break;
    case '3': params = {"salePrice":{$gt:1000,$lte:2000}};break;
    case '4': params = {"salePrice":{$gt:2000,$lte:3000}};break;
    case '5': params = {"salePrice":{$gt:3000,$lte:6000}};break;
    case "all": params = {};break;
    default: break;
  }
  console.log(params);
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({"salePrice":sort});
  goodsModel.exec(function(err,doc){
    if (err){
      res.json({
        status:1,
        msg:err.message
      })
    }else {
      console.log(doc)
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
