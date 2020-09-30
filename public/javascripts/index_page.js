function validate() {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var email = document.forms["idform"]["email"].value;
    var password = document.forms["idform"]["password"].value;
    if (email == "") {
      document.getElementById("error").innerHTML="Please Enter Your Email";
      return false;
    }
    else if(!email.match(mailformat)){
      document.getElementById("error").innerHTML="Please Enter Your Email Correctly";
      return false;
    }
    else if(password==""){
      document.getElementById("error").innerHTML="Please Enter Your Password";
      return false;
    }
    else{
        return true;
    }
  }