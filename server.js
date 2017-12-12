const http = require('http');
const fs = require('fs'); // for static files
const path = require('path'); // for static files
const qs = require('querystring'); // for parse cookie
const server = http.createServer();
const Jimp = require("jimp")
const mongoose = require("mongoose");
const md5 = require("md5");
const XLSX = require('xlsx');


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/fortunebom", {useMongoClient: true})
//database config
var productItemSchema = new mongoose.Schema({
  "Product Item Id" : String,
  "Product Name": String,
  "Prepare by": String,
  "Date": Number,
  "Rev": String,
  "Customer": String,
  "Verify by": String,
  "Page": String,
  "Part Number Set": Object
});
var ProductItem = mongoose.model("ProductItem", productItemSchema);

var productPartSchema = new mongoose.Schema({
  "Product Item Id": String,
  "Product Name": String,
  "Prepare by": String,
  "Date": String,
  "Rev": String,
  "Customer": String,
  "Verify by": String,
  "Page": String,
  
  "Part Number": String,
  "Item": Number,
  "Level": String,
  "Usage": String,
  "Part Name": String,
  "Mtl Specification": String,
  "Unit": String,
  "Q\'ty\/Set": String,
  "Vendor": String,
  "Remark": String
});
var ProductPart = mongoose.model("ProductPart", productPartSchema);

var sessionSet = {} // sid: [_id,ip]
function updateIdToSession(id,ip){
  var ifRollingDices = true;
  var sid = "";
  while(ifRollingDices){
    sid = (Math.floor(Math.random() * 10000000)).toString(36)
    if (!(sid in sessionSet)){
      ifRollingDices = false; // new sid value is here
    }else{
      //the sid can still be used if sessionSet[sid] is added too long ago
      var nowTime = new Date().getTime();
      //90 days = 7776000000 ms
      if(sessionSet[sid].time <= nowTime - 7776000000)
        ifRollingDices = false;
    }
  }
  
  var time = new Date().getTime();
  sessionSet[sid] = {
    id,
    ip,
    time 
  }
  return sid;
}

function reqIdentity(sid,ip) {
  if(!(sid in sessionSet)){
    return "";
  }else{
    if(sessionSet[sid].ip != ip){
      return "";
    }
    else{
      var tempTime = new Date().getTime();
      if(sessionSet[sid].time <= tempTime - 7776000000){
        return "";
      }else{
        return sessionSet[sid].id;
      }
    }
  }
}

//for dev only:
let jpIp = "67.188.116.141";
var time = new Date().getTime();
sessionSet["00000"] = {
  id: "gogogo",
  ip: jpIp,
  time 
}

//helper functions
function getCellValue(wb,sheetIdx,cellAddr){
  var ws = wb.Sheets[wb.SheetNames[sheetIdx]];
  var desired_cell = ws[cellAddr];
  return desired_cell?desired_cell.v:undefined;
}

function getItemInfo(wb){
  
  let productNum = getCellValue(wb,0,'A7')
  productNum = productNum.split("：#")
  productNum = productNum[1]
  
  let preparer = getCellValue(wb,0,'E7')
  preparer = preparer.split(":")
  preparer = preparer[1]
  
  let dt = getCellValue(wb,0,'H7');
  dt = (dt-1) * 8.64e7 -2208960000000
  
  let productName = getCellValue(wb,0,'A8')
  productName = productName.split("：")
  productName = productName[1]
  
  let rev = getCellValue(wb,0,'H8')
  
  let customer = getCellValue(wb,0,'A9')
  customer = customer.split("：")
  customer = customer[1]
  
  let verifier = getCellValue(wb,0,'E9')
  verifier = verifier.split("：")
  verifier = verifier[1]
  
  let pageNum = getCellValue(wb,0,'H9')
  let currentItem = new ProductItem({
    "Product Item Id" : productNum,
    "Product Name": productName,
    "Prepare by": preparer,
    "Date": dt,
    "Rev": rev,
    "Customer": customer,
    "Verify by": verifier,
    "Page": pageNum,
    "Part Number Set": {}
  })
  currentItem.save(function(error,data){
    if(error)console.log('when saveing currentItem, meet error: ',error)
  })
  
  let rowNum = 12;
  let seqNoNumber = 0;
  let currentUsage = "";
  let maxSeqNoNumber = 5
  while(seqNoNumber <= maxSeqNoNumber){
    let item = getCellValue(wb,0,'A'+rowNum);
    // console.log(item)
    if(typeof item !== "number"){
      seqNoNumber += 1
      rowNum += 1;
      continue
    }else{
      seqNoNumber = 0
    }
    
    let level = getCellValue(wb,0,'B'+rowNum);
    
    let usage = getCellValue(wb,0,'C'+rowNum);
    if(usage) currentUsage = usage;
    
    let partName = getCellValue(wb,0,'D'+rowNum);
    
    let partNum = "000" + item.toString()
    partNum = productNum + '-' + partNum.slice(-3)
    
    let mtlSpec = getCellValue(wb,0,'E' + rowNum);
    
    let unit = getCellValue(wb,0,'F' + rowNum);
    
    let qty = getCellValue(wb,0,'G' + rowNum)
    
    let vendor = getCellValue(wb,0,'H' + rowNum)
    
    let remark = getCellValue(wb,0,'I' + rowNum)
    
    let currentPart = new ProductPart({
      "Product Item Id" : productNum,
      "Product Name": productName,
      "Prepare by": preparer,
      "Date": dt,
      "Rev": rev,
      "Customer": customer,
      "Verify by": verifier,
      "Page": pageNum,
      
      "Part Number": partNum,
      "Item": item,
      "Level": level,
      "Usage": currentUsage,
      "Part Name": partName,
      "Mtl Specification": mtlSpec,
      "Unit": unit,
      "Q\'ty\/Set": qty,
      "Vendor": vendor,
      "Remark": remark
    })
    
    currentPart.save(function(error,data){
      if(error) console.log('when saving current part, meet error: ', error)
    })
    
    rowNum += 1;
  }
}


//sever running
server.on('request',function(req,res){
  
  // console.log(req.headers['x-forwarded-for'])
  
  const urlSep = req.url.split('/') // "/part1/part2/" => ["","part1","part2",""]
  if(req.method === "GET"){
    if(req.url === "/"){
      const filePath = './client/index.html'
      fs.readFile(filePath, function(error, content) {
        // console.log(content)
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        res.end(content,'utf-8');
        return;
      })
    }
    
    // if src is "/js/xxx.js"
    else if(urlSep[1] === "js"){
      const filePath = './client' + req.url;
      fs.readFile(filePath, function(error, content) {
        // console.log(content)
        if(error) res.end()
        res.writeHead(200, {
            'Content-Type': 'text/javascript'
        })
        res.end(content,'utf-8');
        return;
      })
    }
    
    // img tag src = /img/xxx
    else if(urlSep[1] === "img"){
      const filePath = './client' + req.url;
      fs.readFile(filePath, function(error, content) {
        // console.log(content)
        if(error) res.end()
        res.writeHead(200, {
            'Content-Type': 'image/jpeg'
        })
        res.end(content,'utf-8');
        return;
      })
    }
    
    // css href = /css/xxx
    else if(urlSep[1] === "css"){
      const filePath = './client' + req.url;
      fs.readFile(filePath, function(error, content) {
        // console.log(content)
        if(error) res.end()
        res.writeHead(200, {
            'Content-Type': 'text/css'
        })
        res.end(content,'utf-8');
        return;
      })
    }
    
    // css href = /html/xxx
    else if(urlSep[1] === "html"){
      const filePath = './client' + req.url;
      fs.readFile(filePath, function(error, content) {
        // console.log(content)
        if(error) res.end()
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        res.end(content,'utf-8');
        return;
      })
    }
    
    //no idea why cloud9 love sending such request
    else if(req.url === "/favicon.ico"){
      const filePath = './client/img/favicon.ico'
      fs.readFile(filePath,function(error,content){
        res.writeHead(200,{
          'Content-Type': 'image/ico'
        })
        res.end(content,'utf-8');
        return;
      })
      res.end();
      return;
    }
    
    //no fucking idea what this GET request is about
    else{
      console.log(`Cannot process req with url of ${req.url} and method of ${req.method}`)
      res.end()
      return;
    }
  }

  else if(req.method === "POST"){
    req.body = [];
    req.on('data', function(chunk) {
      req.body.push(chunk);
    });
    req.on('end', function(){
      var bodyStr = Buffer.concat(req.body).toString();
      var bodyJson = {};
      try{
        bodyJson  = JSON.parse(bodyStr);
      }catch(e){
        console.log(`Cannot process req with url of ${req.url} and method of ${req.method}`)
        res.end(JSON.stringify({error:"cannot parse the request"}))
      }
      
      console.log(`got req with action of ${bodyJson["action"]}`)
      //for dev Test
      if(bodyJson.action === "imgtest"){
          var toBuf = bodyJson.actualData.replace(/^data:image\/\w+;base64,/, "")
          var buf = new Buffer(toBuf,'base64')
          Jimp.read(buf,function(error,image){
            if(!!error){
              console.log(error)
            }else{
              var w = image.bitmap.width;
              var h = image.bitmap.height;
              var hTow = 1.4;
              var w_id = 250, h_id = w_id * hTow;
              
              var resizeArg1, resizeArg2;
              if(h / w < hTow){
                resizeArg1 = Jimp.AUTO;
                resizeArg2 = h_id;
              }else{
                resizeArg1 = w_id;
                resizeArg2 = Jimp.AUTO;
              }
              
              image.resize(resizeArg1,resizeArg2,function(error,imageResized){
                if(!!error){
                  res.end(JSON.stringify({"error": "fail to resize the image"}));
                  return;
                }
                w = imageResized.bitmap.width;
                h = imageResized.bitmap.height;
                
                var x,y;
                if(h / w < hTow){
                  x = (w - w_id) / 2;
                  y = 0;
                }else{
                  x = 0;
                  y = (h - h_id) / 2;
                }
                imageResized.crop(x, y, w_id, h_id, function(error,imageCroped){
                  if(!!error){
                    res.end(JSON.stringify({"error": "fail to crop the image"}));
                    return;
                  }
                  imageCroped.write("./temp/ho7.jpg",function(error,data){
                    if(!!error){
                      res.end(JSON.stringify({"error": "fail to save the image"}));
                      return;
                    }
                    res.end(JSON.stringify({"error": null}));
                  })
                })
              })
              
              
              
            }
          })
      }
      
      //sid verification
      else if(bodyJson.action === "sidVerfication"){
        if(bodyJson.sid === ""){
          res.end(JSON.stringify({error: null, ifLoggedIn: false})); return;
        }else{
          var usrIdInMongo = reqIdentity(bodyJson.sid, req.headers['x-forwarded-for']);
          if(usrIdInMongo === ""){
            res.end(JSON.stringify({error: null, ifLoggedIn: false})); return;
          }else{
            res.end(JSON.stringify({error: null, ifLoggedIn: true})); return;
          }
        }
      }
      
      //post excel
      else if(bodyJson.action === "postExcel"){
        // console.log(bodyJson.actualData)
        var workbook = XLSX.read(bodyJson.actualData, { type: 'binary' });
        // console.log(getCellValue(workbook,0,'C12'))
        getItemInfo(workbook)
        
        res.end(JSON.stringify({error: null}));
      }
      
      //request info from part numbers
      else if(bodyJson.action === "reqPartInfo"){
        console.log(bodyJson.actualData)
        ProductPart.find({"Part Number": {$in: bodyJson.actualData}},function(error,data){
          // console.log(data)
          let toRes = {};
          for(let i = 0; i < data.length; i++){
            toRes[data[i]["Part Number"]] = data[i];
          }
          console.log(toRes)
          res.end(JSON.stringify({error:null, actualData: toRes}))
        })
        
      }
      
      // I dont know what this post req is
      else{
        console.log(`Cannot process req with url of ${req.url} and method of ${req.method}`)
        res.end(JSON.stringify({error: "hit else, unspecified or non-understandable action specified"}));
        return;
      }
      // var postData = qs.parse(bodyStr);
      
    })
  }
  
  
  
  //I don't know what the fuck this req is
  else{
    console.log(`Cannot process req with url of ${req.url} and method of ${req.method}`)
    res.end();
    return;
  }
})

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

// function fn60sec() {
//     // runs every 60 sec and runs on init.
//     console.log("yoyoyoyoyo")
// }
// fn60sec();
// setInterval(fn60sec, 2*1000);