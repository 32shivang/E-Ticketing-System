var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Finwego', {useNewUrlParser: true});
var con = mongoose.connection;
var seatsSchema = new mongoose.Schema({
    TrainNumber:String,
    avaBerths:String,
    avaBertha1:String,
    avaBertha2:String,
    avaBertha3:String,

  });
  var seatsmodel = mongoose.model('seats', seatsSchema);
  
  

module.exports=seatsmodel;