var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Finwego', {useNewUrlParser: true});
var con = mongoose.connection;
var loginSchema = new mongoose.Schema({
    Name:String,
    Email:String,
    Password:String,
    Phone:String,
    role:String

  });
  var loginmodel = mongoose.model('logins', loginSchema);
  
  

module.exports=loginmodel;