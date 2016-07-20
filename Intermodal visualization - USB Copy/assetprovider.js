var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var assetDbMock = '{ "asset" : [{"_id" : "3", "left" : "492px", "status" : "unlock", "top" : "305px" },'+
'{ "_id" : "4", "left" : "172px", "status" : "unlock", "top" : "261px" },' +
'{ "_id" : "2", "left" : "686px", "status" : "unlock", "top" : "602px" },'+
'{ "_id" : "1", "left" : "182px", "status" : "unlock", "top" : "397px" },'+
'{ "_id" : "5", "left" : "300px", "top" : "332px", "status" : "unlock" },'+
'{ "_id" : "6", "left" : "450px", "top" : "150px", "status" : "unlock" }]}';

var assetCollection;

AssetProvider = function(host, port) {
  console.log('in AssetProvider.function(host,port)');
  assetCollection = JSON.parse(assetDbMock);
//  this.db= new Db('assetDb', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
//  this.db.open(function(){});
};

AssetProvider.prototype.getCollection= function(callback) {
//  this.db.collection('asset', function(error, asset_collection) {
  //  if( error ) callback(error);
    //else callback(null, asset_collection);
    callback(null, assetCollection["asset"]);
  //});
};

/*var local = new Db('local',new Server('localhost',27017,{safe:false},{auto_reconnect:true}, {}));
AssetProvider.prototype.getLog= function(callback) {
	local.open(function(){});
	local.collection('oplog.$main', function(error, log_collection) {
		if( error ) callback(error);
		else callback(null, log_collection);
  });
};*/


//find asset by Id
AssetProvider.prototype.findAsset = function(id,callback) {
    this.getCollection(function(error, asset_collection) {
      if( error ) callback(error)
      else {
          assetbyid = asset_collection.filter(function(anAsset){     
	    return anAsset._id == id;	  
	  });
	 callback(null, assetbyid[0]);
      }
    });
};

//update asset status
AssetProvider.prototype.updateStat = function(assetId, newStatus, callback) {
    //this.getCollection(function(error, asset_collection) {
      //if( error ) callback(error);
      //else {
	 this.findAsset(assetId, function(error, result) {
	  if(error) callback(error)
          else {		
	        result.status = newStatus;
//		console.log("id = " + result._id);
//		console.log("status = " + result.status);
		callback(null, newStatus);
		}
          });
//        asset_collection.update(
  //                                      {_id: parseInt(assetId)},
    //                                    {$set:{status:newStatus}},
      //                                  function(error, newStatus) {
        //                                        if(error) callback(error);
          //                                      else callback(null,newStatus)       
            //                            });
      //}
    //});
};

//update asset location
AssetProvider.prototype.updateLoc= function(assetId, newlocation, callback) {
	 this.findAsset(assetId, function(error, result) {
	  if(error) callback(error)
          else {		
	        result.left = newlocation.left;
		result.top = newlocation.top;
//		console.log("id = " + result._id);
//		console.log("top = " + result.top);
		callback(null, newlocation);
		}
          });

//    this.getCollection(function(error, asset_collection) {
//      if( error ) callback(error);
//      else {
//        asset_collection.update(
 //                                       {_id: parseInt(assetId)},
//                                        {$set:{left:newlocation.left,
//					top:newlocation.top}},
//                                        function(error, newlocation) {
//                                                if(error) callback(error)
//                                                else callback(null,newlocation)       
//                                        });
//      }
//    });
};

exports.AssetProvider = AssetProvider;
