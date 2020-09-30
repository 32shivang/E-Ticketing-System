var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Finwego', {useNewUrlParser: true});
var con = mongoose.connection;
var passangerSchema = new mongoose.Schema({
    pnr:String,
    Email:String,
    TrainNumber:String,
    TrainName:String,
    boardingDate:String,
    passangersName:String,
    passangersAge:String,
    passangersGender:String,
    coaches:String,
    berths:String,
    totalPrice:String,
    filledBerths:String,
    filledBertha1:String,
    filledBertha2:String,
    filledBertha3:String,
    avaBerths:String,
    avaBertha1:String,
    avaBertha2:String,
    avaBertha3:String,

  });
  var passangermodel = mongoose.model('bookingDetails', passangerSchema);
  
  

module.exports=passangermodel;