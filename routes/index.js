var express = require('express');
var loginModel = require('../modules/login');
var trainModel = require('../modules/train_details');
var bookingModel = require('../modules/bookingDetails');
var seatsModel = require('../modules/seats');
var crypto = require('crypto');
var router = express.Router();



function md5(string) {
  return crypto.createHash('md5').update(string).digest("hex");
}
function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
router.post('/index', function (req, res, next) {
  var pass = md5(req.body.userpass)
  console.log(pass)
  var logins = loginModel.find({ Email: req.body.email, Password: pass })
  logins.exec(function (err, data1) {
    console.log(data1)
    if (data1.length == 0) {
      res.render('index', { error: "error", success: "" });
    }
    else if (data1[0].role == "admin") {
      res.cookie('login_email', req.body.email, { maxAge: 90000000, secure: false, overwrite: true })
      res.cookie('login_password', pass, { maxAge: 90000000, secure: false, overwrite: true })
      res.render('admin_dashboard', { error: "", success: "" });
    }
    else if (data1[0].role == "customer") {
      res.cookie('login_email', req.body.email, { maxAge: 90000000, secure: false, overwrite: true })
      res.cookie('login_password', pass, { maxAge: 90000000, secure: false, overwrite: true })
      var currentTime = new Date();

      var currentOffset = currentTime.getTimezoneOffset();

      var ISTOffset = 330;   // IST offset UTC +5:30 

      var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
      let date = ("0" + ISTTime.getDate() + 1).slice(-2);



      let month = ("0" + (ISTTime.getMonth() + 1)).slice(-2);
      let year = ISTTime.getFullYear();
      let hours = ISTTime.getHours();
      let minutes = ISTTime.getMinutes();
      res.cookie('boardingDate', date + "-" + month + "-" + year, { maxAge: 90000000, secure: false, overwrite: true })
      var cust = loginModel.find({ Email: req.body.email })
      cust.exec(function (err, data4) {
        var trains = trainModel.find({})
        trains.exec(function (err, data5) {
          var train_seats = seatsModel.find({})
          train_seats.exec(function (err, data3) {
            res.render('customerDashboard', { error: "", success: "", customer: data4, trains: data5, booking: data3, date: date + "-" + month + "-" + year, });
          })
        })
      })
    }
  })
});



router.post('/changeDate', function (req, res, next) {
  res.cookie('boardingDate', req.body.date, { maxAge: 90000000, secure: false, overwrite: true })
  var cust = loginModel.find({ Email: req.cookies.login_email })
  cust.exec(function (err, data4) {
    var trains = trainModel.find({})
    trains.exec(function (err, data5) {
      var train_seats = seatsModel.find({})
      train_seats.exec(function (err, data3) {
        res.render('customerDashboard', { error: "", success: "", customer: data4, trains: data5, booking: data3, date: req.body.date });
      })
    })
  })
})
router.get('/', function (req, res, next) {
  if (req.cookies.login_email) {
    let login = loginModel.find({ Email: req.cookies.login_email });
    login.exec(function (err, data1) {
      var r = data1[0].role;

      if (r == "admin") {
        res.render('admin_dashboard', { success: "", error: "" });
      }
      else if (r == "customer") {

        var cust = loginModel.find({ Email: req.cookies.login_email })
        cust.exec(function (err, data4) {
          var trains = trainModel.find({})
          trains.exec(function (err, data5) {
            var train_seats = seatsModel.find({})
            train_seats.exec(function (err, data3) {
              res.render('customerDashboard', { error: "", success: "", customer: data4, trains: data5, booking: data3, date: req.cookies.boardingDate });
            })
          })
        })
      }

    })
  }
  else {
    res.render('index', { error: "", success: "" });
  }
})

router.get('/admin', function (req, res, next) {
  if (req.cookies.login_email) {
    let login = loginModel.find({ Email: req.cookies.login_email });
    login.exec(function (err, data1) {
      var r = data1[0].role;

      if (r == "admin") {
        res.render('admin_dashboard', { success: "", error: "" });
      }
      else if (r == "customer") {
        res.render('index', { error: "", success: "" });
      }

    })
  }
  else {
    res.render('index', { error: "", success: "" });
  }
})

router.get('/logout', function (req, res, next) {
  res.clearCookie("login_email");
  res.clearCookie("login_password");
  res.clearCookie("boardingDate");
  res.render('index', { error: "", success: "" });
});




router.post('/add_train', function (req, res, next) {
  var exits = trainModel.find({ TrainNumber: req.body.Train_number }).count()
  exits.exec(function (err, data1) {
    if (data1 == 0) {
      var traindetails = new trainModel({
        TrainNumber: req.body.Train_number,
        TrainName: req.body.name,
        SrcStation: req.body.src_station,
        SrcStationTime: req.body.src_station_time,
        DesStation: req.body.des_station,
        DesStationTime: req.body.des_station_time,
        TravelDays: req.body.days,
        Prices: req.body.prices,
        nums: req.body.nums,
        Pricea1: req.body.pricea1,
        numa1: req.body.numa1,
        Pricea2: req.body.pricea2,
        numa2: req.body.numa2,
        Pricea3: req.body.pricea3,
        numa3: req.body.numa3,
        Discount: req.body.discount,

      });
      traindetails.save(function (err, res1) {
        var available = new seatsModel({
          TrainNumber: req.body.Train_number,
          avaBerths: parseInt(req.body.nums) * 72,
          avaBertha1: parseInt(req.body.numa1) * 72,
          avaBertha2: parseInt(req.body.numa2) * 72,
          avaBertha3: parseInt(req.body.numa3) * 72,
        });
        available.save(function (err, res1) {
          res.render('admin_dashboard', { success: "yes", error: "" });
        });
      })
    }
    else {
      res.render('admin_dashboard', { success: "", error: "yes" });
    }
  })
});


//updateTrain
router.get('/updateTrain', function (req, res, next) {
  var trains = trainModel.find({})
  trains.exec(function (err, data2) {
    if (req.cookies.login_email) {
      let login = loginModel.find({ Email: req.cookies.login_email });
      login.exec(function (err, data1) {
        var r = data1[0].role;

        if (r == "admin") {

          res.render('updateTrain', { success: "", error: "", trains: data2, refresh: "" });
        }
        else if (r == "customer") {
          res.render('index', { error: "", success: "" });
        }

      })
    }
    else {
      res.render('index', { error: "", success: "" });
    }
  })
})


router.post('/updateTrain', function (req, res, next) {
  var trains = trainModel.find({})
  trains.exec(function (err, data2) {
    if (req.cookies.login_email) {
      let login = loginModel.find({ Email: req.cookies.login_email });
      login.exec(function (err, data1) {
        var r = data1[0].role;

        if (r == "admin") {
          var number = req.query.TrainNumber
          var update = trainModel.update({ TrainNumber: number }, {
            $set: {
              TrainNumber: req.body.Train_number, TrainName: req.body.name, SrcStation: req.body.src_station, SrcStationTime: req.body.src_station_time,
              DesStation: req.body.des_station, DesStationTime: req.body.des_station_time, TravelDays: req.body.days, Prices: req.body.prices, nums: req.body.nums, Pricea1: req.body.pricea1, numa1: req.body.numa1, Pricea2: req.body.pricea2, numa2: req.body.numa2,
              Pricea3: req.body.pricea3, numa3: req.body.numa3, Discount: req.body.discount
            }
          })
          update.exec(function (err, data4) {
            res.render('updateTrain', { success: "", error: "", trains: data2, refresh: "yes" });
          })
        }
        else if (r == "customer") {
          res.render('index', { error: "", success: "" });
        }

      })
    }
    else {
      res.render('index', { error: "", success: "" });
    }
  })
})
router.get('/updateTrains/update', function (req, res, next) {
  var trains = trainModel.find({})
  trains.exec(function (err, data2) {
    if (req.cookies.login_email) {
      let login = loginModel.find({ Email: req.cookies.login_email });
      login.exec(function (err, data1) {
        var r = data1[0].role;

        if (r == "admin") {

          var number = req.query.TrainNumber
          if (number == undefined) {
            res.render('updateTrain', { success: "", error: "", trains: data2, refresh: "" });
          }
          else {
            var train = trainModel.find({ TrainNumber: number })
            train.exec(function (err, data3) {

              res.render('updateTrain2', { success: "", error: "", train: data3, TrainNumber: number });
            })
          }
        }
        else if (r == "customer") {
          res.render('index', { error: "", success: "" });
        }

      })
    }
    else {
      res.render('index', { error: "", success: "" });
    }
  })
})



router.get('/deleteTrain', function (req, res, next) {
  var trains = trainModel.find({})
  trains.exec(function (err, data2) {
    if (req.cookies.login_email) {
      let login = loginModel.find({ Email: req.cookies.login_email });
      login.exec(function (err, data1) {
        var r = data1[0].role;

        if (r == "admin") {

          res.render('deleteTrain', { success: "", error: "", trains: data2, refresh: "" });
        }
        else if (r == "customer") {
          res.render('index', { error: "", success: "" });
        }

      })
    }
    else {
      res.render('index', { error: "", success: "" });
    }
  })
})



router.get('/deleteTrains/delete', function (req, res, next) {
  var trains = trainModel.find({})
  trains.exec(function (err, data2) {
    if (req.cookies.login_email) {
      let login = loginModel.find({ Email: req.cookies.login_email });
      login.exec(function (err, data1) {
        var r = data1[0].role;

        if (r == "admin") {

          var number = req.query.TrainNumber
          if (number == undefined) {
            res.render('deleteTrain', { success: "", error: "", trains: data2, refresh: "" });
          }
          else {
            var train = trainModel.find({})
            train.exec(function (err, data3) {
              var del = trainModel.remove({ TrainNumber: number })
              del.exec(function (err, data4) {
                res.render('deleteTrain', { success: "", error: "", trains: data3, TrainNumber: number, refresh: "yes" });
              })
            })
          }
        }

        else if (r == "customer") {
          res.render('index', { error: "", success: "" });
        }

      })
    }
    else {
      res.render('index', { error: "", success: "" });
    }
  })
})



router.get('/newAccount', function (req, res, next) {

  res.render('newAccount', { error: "" });

})

router.post('/newAccount', function (req, res, next) {
  var exits = trainModel.find({ Email: req.body.email }).count()
  exits.exec(function (err, data1) {
    if (data1 == 0) {
      var userdetails = new loginModel({
        Name: req.body.name,
        Email: req.body.email,
        Password: md5(req.body.userpass),
        Phone: req.body.phone,
        role: "customer",

      });
      userdetails.save(function (err, res1) {
        res.render('index', { success: "yes", error: "" });
      });
    }
    else {
      res.render('newAccount', { error: "yes" });
    }
  })
});

router.get('/trainBooking', function (req, res, next) {
  if (req.cookies.login_email) {
    let login = loginModel.find({ Email: req.cookies.login_email });
    login.exec(function (err, data1) {
      var r = data1[0].role;

      if (r == "admin") {
        res.render('index', { error: "", success: "" });
      }
      else if (r == "customer") {
        var train = trainModel.find({ TrainNumber: req.query.Train })
        train.exec(function (err, data2) {
          var cust = loginModel.find({ Email: req.cookies.login_email })
          cust.exec(function (err, data4) {
            var train_seats = seatsModel.find({ TrainNumber: req.query.Train })
            train_seats.exec(function (err, data3) {
              console.log(data3)
              res.render('trainBooking', { error: "", success: "", train: data2, customer: data4, booking: data3, date: req.cookies.boardingDate });
            })
          })
        })
      }

    })
  }
  else {
    res.render('index', { error: "", success: "" });
  }
})

router.get('/bookingHistory', function (req, res, next) {
  if (req.cookies.login_email) {
    let login = loginModel.find({ Email: req.cookies.login_email });
    login.exec(function (err, data1) {
      var r = data1[0].role;

      if (r == "admin") {
        res.render('index', { error: "", success: "" });
      }
      else if (r == "customer") {
        var booking = bookingModel.find({ Email: req.cookies.login_email })
        booking.exec(function (err, data2) {
          console.log(data2)
          var cust = loginModel.find({ Email: req.cookies.login_email })
          cust.exec(function (err, data4) {
            res.render('bookingHistory', { error: "", success: "", booking: data2, customer: data4, date: req.cookies.boardingDate });
          })

        })

      }

    })
  }
  else {
    res.render('index', { error: "", success: "" });
  }
})

router.get('/trainCancel', function (req, res, next) {
  if (req.cookies.login_email) {
    let login = loginModel.find({ Email: req.cookies.login_email });
    login.exec(function (err, data1) {
      var r = data1[0].role;

      if (r == "admin") {
        res.render('index', { error: "", success: "" });
      }
      else if (r == "customer") {
        var booking = bookingModel.find({ Email: req.cookies.login_email })
        booking.exec(function (err, data2) {
          var booking = bookingModel.find({ pnr: req.query.pnr })
          booking.exec(function (err, data3) {
            console.log(data2)
            var cust = loginModel.find({ Email: req.cookies.login_email })
            cust.exec(function (err, data4) {
              var del = bookingModel.remove({ pnr: req.query.pnr })
              del.exec(function (err, data6) {
              })
              var berths = req.query.berths
              berths = berths.split(",")
              var len = berths.length;
              var coaches = req.query.coaches
              coaches = coaches.split(",")
              var coach = coaches[0];
              console.log(coach[0])
              console.log(len)
              if (coach[0] == "S") {

                var ava = parseInt(data3[0].avaBerths) + len
                console.log(ava)
                var update = seatsModel.update({ TrainNumber: req.query.TrainNumber }, { $set: { avaBerths: ava } })
                update.exec(function (err, data6) {
                })
              }
              if (coach[0] == "A") {
                var ava = parseInt(data3[0].avaBertha1) + len
                var update = seatsModel.update({ TrainNumber: req.query.TrainNumber }, { $set: { avaBertha1: ava } })
                update.exec(function (err, data6) {
                })
              }
              if (coach[0] == "B") {
                var ava = parseInt(data3[0].avaBertha2) + len
                console.log(ava)
                var update = seatsModel.update({ TrainNumber: req.query.TrainNumber }, { $set: { avaBertha2: ava } })
                update.exec(function (err, data6) {
                })
              }
              if (coach[0] == "C") {
                var ava = parseInt(data3[0].avaBertha3) + len
                console.log(ava)
                var update = seatsModel.update({ TrainNumber: req.query.TrainNumber }, { $set: { avaBertha3: ava } })
                update.exec(function (err, data6) {
                })
              }

              res.render('bookingHistory', { error: "", success: "yes", booking: data2, customer: data4, date: req.cookies.boardingDate });

            })
          })

        })

      }

    })
  }
  else {
    res.render('index', { error: "", success: "" });
  }
})

//Sample project test another


router.post('/trainBooking', function (req, res, next) {
  var train = req.body.number;


  var train = trainModel.find({ TrainNumber: train })
  train.exec(function (err, data2) {
    var filled = bookingModel.find({ TrainNumber: data2[0].TrainNumber, boardingDate: req.cookies.boardingDate })
    filled.exec(function (err, data7) {

      var cust = loginModel.find({ Email: req.cookies.login_email })
      cust.exec(function (err, data4) {
        var currentTime = new Date();

        var currentOffset = currentTime.getTimezoneOffset();

        var ISTOffset = 330;   // IST offset UTC +5:30 

        var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
        let date = ("0" + ISTTime.getDate()).slice(-2);



        let month = ("0" + (ISTTime.getMonth() + 1)).slice(-2);
        let year = ISTTime.getFullYear();
        let hours = ISTTime.getHours();
        let minutes = ISTTime.getMinutes();
        let seconds = ISTTime.getSeconds();
        var pnr = year + month + date + hours + minutes + seconds;
        console.log(pnr)


        var passangersName = ""
        var passangersAge = ""
        var passangersGender = ""
        var c = 0



        let coaches = ""
        let berths = ""
        let totalPrice = 0
        if (req.body.PName1 != "") {
          c = c + 1
          passangersName = passangersName + req.body.PName1 + ","
          passangersAge = passangersAge + req.body.PAge1 + ","
          passangersGender = passangersGender + req.body.PGender1 + ","
          if (req.body.PName2 != "") {
            c = c + 1
            passangersName = passangersName + req.body.PName2 + ","
            passangersAge = passangersAge + req.body.PAge2 + ","
            passangersGender = passangersGender + req.body.PGender2 + ","
            if (req.body.PName3 != "") {
              c = c + 1
              passangersName = passangersName + req.body.PName3 + ","
              passangersAge = passangersAge + req.body.PAge3 + ","
              passangersGender = passangersGender + req.body.PGender3 + ","
              if (req.body.PName4 != "") {
                c = c + 1
                passangersName = passangersName + req.body.PName4 + ","
                passangersAge = passangersAge + req.body.PAge4 + ","
                passangersGender = passangersGender + req.body.PGende4 + ","
              }
              if (req.body.PName5 != "") {
                c = c + 1
                passangersName = passangersName + req.body.PName5 + ","
                passangersAge = passangersAge + req.body.PAge5 + ","
                passangersGender = passangersGender + req.body.PGender5 + ","
              }
              if (req.body.PName6 != "") {
                c = c + 1
                passangersName = passangersName + req.body.PName6 + ","
                passangersAge = passangersAge + req.body.PAge6 + ","
                passangersGender = passangersGender + req.body.PGender6 + ","
              }
            }
          }

        }

        console.log(passangersName)
        console.log(passangersAge)
        console.log(passangersGender)
        console.log(c)
        var train_num = bookingModel.find({ TrainNumber: data2[0].TrainNumber, boardingDate: req.cookies.boardingDate }).count()

        train_num.exec(function (err, data6) {
          if (data6 > 0) {
            var filledBerths = data7[data6 - 1].filledBerths
            var filledBertha1 = data7[data6 - 1].filledBertha1
            var filledBertha2 = data7[data6 - 1].filledBertha2
            var filledBertha3 = data7[data6 - 1].filledBertha3
          }


          console.log(c)
          if (data6 == 0) {
            filledBerths = 0
            filledBertha1 = 0
            filledBertha2 = 0
            filledBertha3 = 0
            if (req.body.class == "Sleeper") {
              for (i = 1; i <= c; i++) {
                if (i == c) {
                  coaches = coaches + "S1"
                  berths = berths + i
                }
                else {
                  coaches = coaches + "S1" + ","
                  berths = berths + i + ","
                }

              }
              var price = parseInt(data2[0].Prices)

              var ages = passangersAge.split(",")
              console.log(ages)
              for (i = 0; i < ages.length - 1; i++) {
                if (ages[i] > 60 || ages[i] < 13) {
                  totalPrice = parseInt(totalPrice) + (price * 0.5)
                }
                else {
                  totalPrice = parseInt(totalPrice) + price
                }
              }
              filledBerths = filledBerths + c
            }
            else if (req.body.class == "AC1") {
              for (i = 1; i <= c; i++) {
                if (i == c) {
                  coaches = coaches + "A1"
                  berths = berths + i
                }
                else {
                  coaches = coaches + "A1" + ","
                  berths = berths + i + ","
                }

              }
              var price = parseInt(data2[0].Pricea1)

              var ages = passangersAge.split(",")
              console.log(ages)
              for (i = 0; i < ages.length - 1; i++) {
                if (ages[i] > 60 || ages[i] < 13) {
                  totalPrice = parseInt(totalPrice) + (price * 0.5)
                }
                else {
                  totalPrice = parseInt(totalPrice) + price
                }
              }
              filledBertha1 = filledBertha1 + c
            }

            else if (req.body.class == "AC2") {
              for (i = 1; i <= c; i++) {
                if (i == c) {
                  coaches = coaches + "B1"
                  berths = berths + i
                }
                else {
                  coaches = coaches + "B1" + ","
                  berths = berths + i + ","
                }

              }
              var price = parseInt(data2[0].Pricea2)

              var ages = passangersAge.split(",")
              console.log(ages)
              for (i = 0; i < ages.length - 1; i++) {
                if (ages[i] > 60 || ages[i] < 13) {
                  totalPrice = parseInt(totalPrice) + (price * 0.5)
                }
                else {
                  totalPrice = parseInt(totalPrice) + price
                }
              }
              filledBertha2 = filledBertha2 + c
            }
            else if (req.body.class == "AC3") {
              for (i = 1; i <= c; i++) {
                if (i == c) {
                  coaches = coaches + "C1"
                  berths = berths + i
                }
                else {
                  coaches = coaches + "C1" + ","
                  berths = berths + i + ","
                }

              }
              var price = parseInt(data2[0].Pricea3)

              var ages = passangersAge.split(",")
              console.log(ages)
              for (i = 0; i < ages.length - 1; i++) {
                if (ages[i] > 60 || ages[i] < 13) {
                  totalPrice = parseInt(totalPrice) + (price * 0.5)
                }
                else {
                  totalPrice = parseInt(totalPrice) + price
                }
              }
              filledBertha3 = filledBertha3 + c
            }

          }
          else {

            if (req.body.class == "Sleeper") {
              fill = data7[data6 - 1].filledBerths
              var filledcouches = (parseInt(fill) / 73) + 1;
              var remaining = 73 - parseInt(fill)

              if (remaining >= c) {
                for (i = parseInt(fill) + 1; i <= c + parseInt(fill); i++) {

                  if (i == c + parseInt(fill)) {

                    coaches = coaches + "S" + parseInt(filledcouches)
                    berths = berths + i
                  }
                  else {
                    coaches = coaches + "S" + parseInt(filledcouches) + ","
                    berths = berths + i + ","
                  }

                }
              }
              else {
                filledcouches = parseInt(filledcouches) + 1
                for (i = 1; i <= c; i++) {

                  if (i == c) {
                    coaches = coaches + "S" + filledcouches
                    berths = berths + i
                  }
                  else {
                    coaches = coaches + "S" + filledcouches + ","
                    berths = berths + i + ","
                  }
                }
              }
              var price = parseInt(data2[0].Prices)

              var ages = passangersAge.split(",")
              console.log(ages)
              for (i = 0; i < ages.length - 1; i++) {
                if (ages[i] > 60 || ages[i] < 13) {
                  totalPrice = parseInt(totalPrice) + (price * 0.5)
                }
                else {
                  totalPrice = parseInt(totalPrice) + price
                }
              }
              filledBerths = parseInt(filledBerths) + c
            }
            else if (req.body.class == "AC1") {
              var fill = data7[data6 - 1].filledBertha1
              var filledcouches = (parseInt(fill) / 73) + 1;
              var remaining = 73 - parseInt(fill)
              if (remaining >= c) {
                for (i = parseInt(fill) + 1; i <= c + parseInt(fill); i++) {

                  if (i == c + parseInt(fill)) {

                    coaches = coaches + "A" + parseInt(filledcouches)
                    berths = berths + i
                  }
                  else {
                    coaches = coaches + "A" + parseInt(filledcouches) + ","
                    berths = berths + i + ","
                  }

                }
              }
              else {
                for (i = 1; i <= c; i++) {

                  if (i == c) {
                    coaches = coaches + "A" + parseInt(filledcouches)
                    berths = berths + i
                  }
                  else {
                    coaches = coaches + "A" + parseInt(filledcouches) + ","
                    berths = berths + i + ","
                  }
                }
              }
              var price = parseInt(data2[0].Pricea1)

              var ages = passangersAge.split(",")
              console.log(ages)
              for (i = 0; i < ages.length - 1; i++) {
                if (ages[i] > 60 || ages[i] < 13) {
                  totalPrice = parseInt(totalPrice) + (price * 0.5)
                }
                else {
                  totalPrice = parseInt(totalPrice) + price
                }
              }
              filledBertha1 = parseInt(filledBertha1) + c
            }

            else if (req.body.class == "AC2") {
              var fill = data7[data6 - 1].filledBertha2
              var filledcouches = (parseInt(fill) / 73) + 1;
              var remaining = 73 - parseInt(fill)
              if (remaining >= c) {
                for (i = parseInt(fill) + 1; i <= c + parseInt(fill); i++) {

                  if (i == c + parseInt(fill)) {

                    coaches = coaches + "B" + parseInt(filledcouches)
                    berths = berths + i
                  }
                  else {
                    coaches = coaches + "B" + parseInt(filledcouches) + ","
                    berths = berths + i + ","
                  }

                }
              }
              else {
                for (i = 1; i <= c; i++) {

                  if (i == c) {
                    coaches = coaches + "B" + parseInt(filledcouches)
                    berths = berths + i
                  }
                  else {
                    coaches = coaches + "B" + parseInt(filledcouches) + ","
                    berths = berths + i + ","
                  }
                }
              }
              var price = parseInt(data2[0].Pricea2)

              var ages = passangersAge.split(",")
              console.log(ages)
              for (i = 0; i < ages.length - 1; i++) {
                if (ages[i] > 60 || ages[i] < 13) {
                  totalPrice = parseInt(totalPrice) + (price * 0.5)
                }
                else {
                  totalPrice = parseInt(totalPrice) + price
                }
              }
              filledBertha2 = parseInt(filledBertha2) + c

            }
            else if (req.body.class == "AC3") {

              var fill = data7[data6 - 1].filledBertha3
              var filledcouches = (parseInt(fill) / 73) + 1;
              var remaining = 73 - parseInt(fill)
              if (remaining >= c) {
                for (i = parseInt(fill) + 1; i <= c + parseInt(fill); i++) {

                  if (i == c + parseInt(fill)) {

                    coaches = coaches + "C" + parseInt(filledcouches)
                    berths = berths + i
                  }
                  else {
                    coaches = coaches + "C" + parseInt(filledcouches) + ","
                    berths = berths + i + ","
                  }

                }
              }
              else {
                for (i = 1; i <= c; i++) {

                  if (i == c) {
                    coaches = coaches + "C" + parseInt(filledcouches)
                    berths = berths + i
                  }
                  else {
                    coaches = coaches + "C" + parseInt(filledcouches) + ","
                    berths = berths + i + ","
                  }
                }
              }
              var price = parseInt(data2[0].Pricea3)

              var ages = passangersAge.split(",")
              console.log(ages)
              for (i = 0; i < ages.length - 1; i++) {
                if (ages[i] > 60 || ages[i] < 13) {
                  totalPrice = parseInt(totalPrice) + (price * 0.5)
                }
                else {
                  totalPrice = parseInt(totalPrice) + price
                }
              }
              filledBertha3 = parseInt(filledBertha3) + c
            }


          }

          var PDetails = new bookingModel({
            pnr: pnr,
            Email: req.cookies.login_email,
            TrainNumber: data2[0].TrainNumber,
            TrainName: data2[0].TrainName,
            boardingDate: req.cookies.boardingDate,
            passangersName: passangersName,
            passangersAge: passangersAge,
            passangersGender: passangersGender,
            coaches: coaches,
            berths: berths,
            totalPrice: totalPrice,
            filledBerths: filledBerths,
            filledBertha1: filledBertha1,
            filledBertha2: filledBertha2,
            filledBertha3: filledBertha3,
            avaBerths: (data2[0].nums * 72) - filledBerths,
            avaBertha1: (data2[0].numa1 * 72) - filledBertha1,
            avaBertha2: (data2[0].numa2 * 72) - filledBertha2,
            avaBertha3: (data2[0].numa3 * 72) - filledBertha3,
          });
          PDetails.save(function (err, res1) {

            var seatsupdate = seatsModel.update({ TrainNumber: data2[0].TrainNumber }, {
              $set: {
                avaBerths: (data2[0].nums * 72) - filledBerths,
                avaBertha1: (data2[0].numa1 * 72) - filledBertha1,
                avaBertha2: (data2[0].numa2 * 72) - filledBertha2,
                avaBertha3: (data2[0].numa3 * 72) - filledBertha3
              }
            })
            seatsupdate.exec(function (err, data10) {
            })

            console.log(err)
            console.log("saving")
            res.render('preview', { error: "", success: "", totalPrice: totalPrice });
          })
        })
      })
    })
  })
})
module.exports = router;
