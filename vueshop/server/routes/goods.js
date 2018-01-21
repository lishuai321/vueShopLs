var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require("../models/goods");
var Users = require("../models/users");

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
//查询商品列表
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
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({"salePrice":sort});
  goodsModel.exec(function(err,doc){
    if (err){
      dealErr(res,err);
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
//加入购物车
router.post("/addCart",function(req,res,next){
  console.log(11111)
  var userId = '100000077',productId = req.body.productId;
  Users.findOne({userId:userId},function(err,userDoc){
      if (err){
        dealErr(res,err);
      }else {
        if (userDoc){
          var goodItem = '';
          userDoc.cartList.forEach(function (item) {
            if (item.productId == productId){
              goodItem = item;
              item.productNum ++;
            }
          })
          if (goodItem){
            console.log(22222222222222222222)
            userDoc.save(function (err) {
              if (err){
                dealErr(res,err);
              }else {
                res.json({
                  status:'0',
                  msg:'',
                  result:'suc'
                })
              }
            })
          }else {
            Goods.findOne({productId:productId},function (err,goodsDoc) {
              if (err){
                dealErr(res,err)
              }else{
                goodsDoc.productNum = 1;
                goodsDoc.checked = 1;
                userDoc.cartList.push(goodsDoc);
                userDoc.save(function (err) {
                  if (err){
                    dealErr(res,err);
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'suc'
                    })
                  }
                })
              }
            })
          }
        }
      }
  })
})
function dealErr(res,err){
  res.json({
    status:1,
    msg:err.message
  })
}
module.exports = router;
