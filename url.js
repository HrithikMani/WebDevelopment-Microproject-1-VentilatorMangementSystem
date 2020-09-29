const express = require('express')

const app = express();
const fs = require('fs');

const MongoClient = require('mongodb').MongoClient;
const Mongo = require('mongodb');
const { send } = require('process');
url = "mongodb://localhost:27017/";


 app.use('/css',express.static(__dirname+"/static/css"))
 app.use('/js',express.static(__dirname+"/static/js"))

 app.set("view engine",'ejs');


app.get("/getDe",function(req,res){
  MongoClient.connect(url,function(err,db){
    var dbo =db.db("Hospital");
    dbo.collection("name").find({}).toArray(function(err,r){
      var arr = [];
      for(var i =0;i<r.length;i++){
        arr.push({id:r[i].id,name:r[i].name});
      }
      res.render("loadHos.ejs",{data:arr});
    });
  });
});



 app.get('/', function (req, res) {
  console.log("Sever Restarted");
  
  res.sendFile(__dirname+'/templates/index.html');
})

// hospitals names

app.get('/hos', function (req, res) {
    var a = req.query.id;
  MongoClient.connect(url,function(err,db){
    var dbo = db.db("Hospital");
    
    dbo.collection("name").find({id:a}).project({_id:false,id:true,name:true}).toArray(function(err,data){
     res.send(data[0].name);  
    });
    
  });

});

//active

app.get("/active",function(req,res){
  var a = req.query.id;
  var b = req.query.occ;
  var decider = "false";
  if(b == "0"){
    decider = "false";
  }else{
    decider = "true";
  }
  MongoClient.connect(url,function(err,db){
    var dbo = db.db("Hospital");
    
    dbo.collection("venti").find({hosID:a,occup:decider}).project({_id:true,occup:true,ventNo:true}).toArray(function(err,data){
      res.send(data);
    });

  });
});

//update

app.get("/update",function(req,res){
  var a = req.query.id;
  var b = req.query.setTo;
  var decider = "";
  if(b == "0"){
    decider="false";
  }else{
    decider="true";
  }
  MongoClient.connect(url,function(er,db){
    var dbo = db.db("Hospital");
    var b = Mongo.ObjectID(a);
    dbo.collection("venti").updateOne({_id:b},{$set:{occup:decider}},function(err,re){
      if (err) throw err;
      res.send("Upadeted");
    });
      
  });
});



//delete



app.get("/delete",function(req,res){
  var a = req.query.id;
  if(a == null || a == ""|| a.length<24){
    res.send("Give delete id");
    return;
  }
  MongoClient.connect(url,function(er,db){
    var dbo = db.db("Hospital");
    var b = Mongo.ObjectID(a);
    dbo.collection("venti").deleteOne({_id:b},function(err,re){
      if (err) throw err;
      res.send("Deleted");
    });
      
  });
});

//add
app.get("/add",function(req,res){
  var a = req.query.id;
  if(a == null){
    res.send("Give Hospital id")
  }
  MongoClient.connect(url,function(err,db){
    var dbo = db.db("Hospital");
    dbo.collection("venti").find({hosID:a}).toArray(function(err,data){
        var sum=0;
        for(var i=0 ;i<data.length;i++){
          var x = parseInt(data[i].ventNo);
          sum = sum + x  
        }
        var z = (((data.length + 1)*((data.length+1) + 1))/2);
      var venMiss =  z-(sum); 
        if(venMiss == 0){
          venMiss = data.length + 1;
          }
        var ad = {hosID:a,ventNo:venMiss,occup:"false"} 
        dbo.collection("venti").insertOne(ad,function(err,res1){
          res.send("Added");
        });
    });
  });
});

app.get("/addHos",function(req,res){
var a = req.query.name;
if(a == null){
  res.send("Give a name");
  return;
}
MongoClient.connect(url,function(err,db){
  var dbo = db.db("Hospital");
  dbo.collection("name").find({}).limit(1).sort({$natural:-1}).toArray(function(err,data){
    var nid = parseInt(data[0].id) + 1;
    dbo.collection("name").insertOne({id:nid,name:a}, function(err,r){
      res.send("Added");
    });
  });
  
});
});


app.get("/vents",function(req,res){
  var a = req.query.id;
  MongoClient.connect(url,function(err,db){
    var dbo = db.db("Hospital");
    dbo.collection("venti").find({hosID:a}).sort({ventNo:1}).toArray(function(err,data){
      res.render("loadCard.ejs",{arr:data});
    });
  });
});


app.get("/search",function(req,res){
  var a = req.query.name;
  MongoClient.connect(url,function(err,db){
    var dbo =db.db("Hospital");
    dbo.collection("name").find({name:a}).toArray(function(err,r){
      var arr = [];
      if(r.length == 0){
        res.send("No hospitals found with that name!");
        return;
      }
      for(var i =0;i<r.length;i++){
        arr.push({id:r[i].id,name:r[i].name});
      }
      res.render("loadHos.ejs",{data:arr});
    });
  });
});





app.get("/deleteHos",function(req,res){
  var a = req.query.id;
  if(a == null || a == ""){
    res.send("Give delete id");
    return;
  }
  a = parseInt(a);
  MongoClient.connect(url,function(er,db){
    var dbo = db.db("Hospital");
    dbo.collection("name").deleteOne({id:a},function(err,re){
      if (err) throw err;
      res.send("Deleted");
    });
  });
});


app.listen(3000)