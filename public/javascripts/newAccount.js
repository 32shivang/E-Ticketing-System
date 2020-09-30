function validate() {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var name = document.forms["idform"]["name"].value;
    console.log(name)
    var email = document.forms["idform"]["email"].value;
    var password = document.forms["idform"]["password"].value;
    var phone = document.forms["idform"]["phone"].value;
    if (name == "") {
        document.getElementById("error").innerHTML="Please Enter Your Name";
        return false;
      }
    
    else if (email == "") {
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
    else if(phone==""){
        document.getElementById("error").innerHTML="Please Enter Your Phone Number";
        return false;
      }
    else{
        return true;
    }
  }
  function confirm(){
    var pass=document.getElementById("password1").value;
    var confirm=document.getElementById("password2").value;
    if(pass=="" && confirm==""){
      document.getElementById("info2").innerHTML="";
      $('#test4').attr("disabled", false);
    }
    else if(pass!=confirm){
      document.getElementById("info2").style.color="red";
      document.getElementById("info2").innerHTML="Password not matched";
      $('#test4').attr("disabled", true);
    }
    else if(pass==confirm){
      document.getElementById("info2").style.color="green";
   
      document.getElementById("info2").innerHTML="Password Matched";
      $('#test4').attr("disabled", false);
    }
  }
  function restrictAlphabets(e){
    var x=e.which||e.keycode;
    if((x>=48 && x<=57) || x==8 ||
        (x>=35 && x<=40)|| x==46 ){
        return true;
        }
    else{
        return false;
        }
        
}