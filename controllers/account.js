var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config')

var AccountSchema = new Schema({
  first_name: String,
  last_name: String,
  contact_no: String,
  contact_person: String,
  street: String, 
  city : String ,
  state: String,
  zip: Number,
  role: String,
  day: Number,
  month: Number,
  year: Number,
  active: Boolean,
  email: String,
  password: String 
  
},{collection:config.tables.ACCOUNT})

var Account = module.exports = mongoose.model('Account',AccountSchema,config.tables.ACCOUNT);

module.exports.index = (req, res) => {
  res.render('account', {
    title: "Account"
  })
}

module.exports.getAllAccounts = (req, res) => {
  var retObj = {
    status: false,
    message: "Err Querying database while fetching accounts, Try again",
    details: []
  };
  Account.find({}, {__v:0},(err, accounts)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found All Accounts";
      retObj.details = accounts;
      res.json(retObj)
    }
  });
}

module.exports.getAccountById = (req, res) => {
  var accountId = req.params['_id'] 
  var retObj = {
    status: false,
    message: "Err Querying database while fetching account by id, Try again",
    details: []
  };
  Processor.findById(accountId, {__v:0}, (err, account)=>{
    if(err) {
      res.json(retObj)
    } else {
      retObj.status = true;
      retObj.message = "Found Account By Id";
      retObj.details = account;
      res.json(retObj)
    }
  });
}

module.exports.upsertAccount = (req, res) => {
  console.log('Error O')
  var account = req.body
  console.log(account);
  var retObj = {
    status: false,
    message: "Err Adding account, Try again",
    details: []
  };
  var query = { _id: mongoose.Types.ObjectId() };
  if (account._id) {
    query = { _id: account._id };
  }
  Account.updateOne(query, account, {upsert: true}, (err, result)=>{
    if(err) {
      console.log("Error In Upsert Account");
      console.log(err);
      res.json(retObj)
    } else {
      if(account._id) {
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
