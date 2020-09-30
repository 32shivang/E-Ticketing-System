var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Finwego', {useNewUrlParser: true});
var con = mongoose.connection;
var trainSchema = new mongoose.Schema({
    TrainNumber:String,
    TrainName:String,
    SrcStation:String,
    SrcStationTime:String,
    DesStation:String,
    DesStationTime:String,
    Prices:String,
    nums:String,
    Pricea1:String,
    numa1:String,
    Pricea2:String,
    numa2:String,
    Pricea3:String,
    numa3:String,
    Discount:String,

  });
  var trainmodel = mongoose.model('train-details', trainSchema);
  
  

module.exports=trainmodel;