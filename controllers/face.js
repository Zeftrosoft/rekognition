var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config')

var FaceSchema = new Schema({
  image_path: String,
  day: Number,
  month:Number,
  year :Number,
  hour :Number,
  min :Number,
  isMatched: Boolean,
  matched_name: String,
  similarity: Number,
  confidance: Number
},{collection:config.tables.FACE})

var Face = module.exports = mongoose.model('Face',FaceSchema,config.tables.FACE);

module.exports.index = (req, res) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching faces, Try again",
    details: []
  };
  Face.find({}, {__v:0},(err, faces)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Faces";
      retObj.details = faces;
      retObj.title = "Faces"
      res.render('face',retObj )
      //res.json(retObj )
    }
  });
 
}

module.exports.getAllFaces = (req, res) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching faces, Try again",
    details: []
  };
  Face.find({}, {__v:0},(err, faces)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Faces";
      retObj.details = faces;
      res.json(retObj)
    }
  });
}

module.exports.getFaceById = (req, res) => {
  var faceId = req.params['_id'] 
  var retObj = {
    status: false,
    message: "Err Querying database while fetching face by id, Try again",
    details: []
  };
  Processor.findById(faceId, {__v:0}, (err, face)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Face By Id";
      retObj.details = face;
      res.json(retObj)
    }
  });
}

module.exports.upsertFace = (req, res) => {
  var face = req.body
  console.log(face);
  var retObj = {
    status: false,
    message: "Err Adding face, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (face._id) {
    query = { _id: face._id };
  }
  Face.updateOne(query, face, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Face");
      console.log(err);
      res.json(retObj)
    } else {
      if(face._id) {
        retObj.message = "Updated Successfully"
      } else {
        retObj.message = "Inserted Successfully"
      }
      retObj.status = true;
      retObj.details = result;
      res.json(retObj)
    }
  });
}
