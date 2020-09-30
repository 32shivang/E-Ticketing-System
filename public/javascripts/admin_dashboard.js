function validate() {
    var train_num = document.forms["idform"]["Train_number"].value;
    var train_name = document.forms["idform"]["name"].value;
    var src = document.forms["idform"]["src-station"].value;
    var des = document.forms["idform"]["des-station"].value;
    var days = document.forms["idform"]["days"].value;
    var price = document.forms["idform"]["price"].value;
    var discount = document.forms["idform"]["discount"].value;
    if (train_num == "") {
    document.getElementById("error").innerHTML="Please Enter Train Number";
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
      return false;
    }
    else if(train_name==""){
      document.getElementById("error").innerHTML="Please Enter Train Name";
      document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
      return false;
    }
    else if(src==""){
        document.getElementById("error").innerHTML="Please Enter Source Station";
        document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
        return false;
      }
      else if(des==""){
        document.getElementById("error").innerHTML="Please Enter Destination Station";
        document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
        return false;
      }
      else if(days==""){
        document.getElementById("error").innerHTML="Please Enter Travel Days";
        document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
        return false;
      }
      else if(price==""){
        document.getElementById("error").innerHTML="Please Enter Train Price";
        document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
        return false;
      }
      else if(discount==""){
        document.getElementById("error").innerHTML="Please Enter Discountcare";
        document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
        return false;
      }
      
    else{
        return true;
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
     

       