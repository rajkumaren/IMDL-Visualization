var app = require('express')()
  , express = require('express') 
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , AssetProvider= require ('./assetprovider').AssetProvider
  
  , mongo = require("mongodb")
  , QueryCommand = mongo.QueryCommand
  , Cursor = mongo.Cursor
  , Collection = mongo.Collection;
  
  
    var os = require("os");
  var host = os.hostname();
  console.log('Host : ');
  console.log(host);
  
  
  var assetProvider= new AssetProvider(host, 27017);
//var assetProvider= new AssetProvider('localhost', 27017);
  
//var local = new Db('local',new Server('localhost',27017,{safe:false},{auto_reconnect:true}, {}));
  
  
server.listen(3030);
  
//Specify the views folder

//app.set("views",__dirname);


//View engine is Jade

//app.set("view engine", "jade");
app.use(express.static(__dirname +'/public'));

app.get('/', function (req, res) {
  console.log('in app.get() method');
  res.sendfile(__dirname + '/saml.html');
  //res.render("index");
});
  
io.on('connection', function (socket) {
console.log('connected');
  assetProvider.getCollection(function(error,asset_collection){
  //console.log(asset_collection);
  /*var latestCursor =  asset_collection.find().sort({$natural: -1}).limit(1);
  console.log(latestCursor);
  latestCursor.nextObject(function(err, latest) {
    if (latest) {
	var obj = [];
      obj._id = {$gt: latest._id};
    }
    var options = {
      tailable: true,
      await_data: true,
      numberOfRetries: -1
    };
    var stream = asset_collection.find(obj, options).sort({$natural: -1}).stream();
    stream.on('data',function(item){console.log(item);});
    });*/
    readAndSend(socket,asset_collection);
  /*asset_collection.find({}, {"tailable": 1, "sort": [["$natural", 1]]}, function(err, cursor) {
		cursor.intervalEach(300, function(err, item) { 
		console.log("ho");
			if(item != null) {
				console.log(item);
				}
			});
		});*/
  });
	
  socket.on('my other event', function (data) {
    console.log(data);
  });
 socket.emit("jinga",{lala:'hu'});
 socket.on('jinga', function (blah){
 console.log("jinga");
 console.log(blah); 
  });
 socket.emit("change");
 socket.on("start",function(data){
		console.log(data);
		assetProvider.findAsset(1,function(error,result){
		socket.emit("first",result);});
		assetProvider.findAsset(2,function(error,result){
		socket.emit("second",result);});
		assetProvider.findAsset(3,function(error,result){
		socket.emit("third",result);});
		assetProvider.findAsset(4,function(error,result){
		socket.emit("fourth",result);});
 });

  socket.on("onmousedown", function (data) {
    var abc=data;
    console.log("id = " + data.lock);
    assetProvider.findAsset(data.lock,function(error,result){
			console.log(result);
                        console.log(result.status);
			if (result.status=='unlock')
				{console.log("Go Ahead");
				socket.emit("ok",data);
				var newStat = "lock";
				assetProvider.updateStat(data.lock,newStat,function(error,newStat){console.log("updated");});}
			else
				console.log("Shut the **** up.");
			});    
  });
  socket.on("onmousemove", function (data) {
    var xyz=data;
    console.log("left:" +xyz.left+" , top:" +xyz.top);
    assetProvider.updateLoc(xyz.id,xyz,function(error,xyz){
				socket.broadcast.emit("new",data);});
  });
  socket.on("onmouseup", function (data) {
    console.log("id = " +data.unlock);
    var newStat = "unlock";
  assetProvider.updateStat(data.unlock,newStat,function(error,newStat){console.log("updated");});
  socket.broadcast.emit("mouseup",data);
  });
});

Cursor.prototype.intervalEach = function(interval, callback) {
    var self = this;
    if (!callback) {
		throw new Error("callback is mandatory");
    }

    if(this.state != Cursor.CLOSED) {
		setTimeout(function(){
			self.nextObject(function(err, item) {        
				if(err != null) return callback(err, null);
				if(item != null) {
					callback(null, item);
					self.intervalEach(interval, callback);
				} else {
					self.state = Cursor.CLOSED;
					callback(err, null);
				}

				item = null;
			});
		}, interval);
    } else {
		callback(new Error("Cursor is closed"), null);
    }
};

  
function readAndSend (socket, collection) {
    console.log('readAndSend method');
  //  collection.find({}, {"tailable": 1, "sort": [["$natural", 1]]}, function(err, cursor) {
	//	cursor.intervalEach(5, function(err, item) { 
	//		if(item != null ) {
				console.log(collection);
	//		}
	//	});
	//});
};
