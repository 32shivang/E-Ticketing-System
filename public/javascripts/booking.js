$(function() {

    $(document).ready(function () {
     var todaysDate = new Date(); 
      var year = todaysDate.getFullYear();                        
      var month = ("0" + (todaysDate.getMonth() + 1)).slice(-2);  
      var day = ("0" + todaysDate.getDate()).slice(-2);           
      var minDate = (year +"-"+ month +"-"+ day); 
      $('#date').attr('min',minDate);
    });
  });
$(document).ready(function(){
    var maxField = 10; //Input fields increment limitation
    var addButton = $('.add_button'); //Add button selector
    var wrapper = $('.field_wrapper'); //Input field wrapper
    var fieldHTML = '<div style="margin-top:10px;" class="row"><div class="col">Name: <input type="text" name="PassengersName[]" /></div><div class="col">Age: <input type="text" name="PassengersAge[]" /></div><div class="col">'
            +'Gender: <input type="text" name="PassengersGender[]"/> </div> <div class="col"><a href="javascript:void(0);" class="remove_button" title="remove field"><i class="fa fa-minus"> Remove Passanger</i></a></div></div> ' 
    var x = 1; //Initial field counter is 1
    
    //Once add button is clicked
    $(addButton).click(function(){
        //Check maximum number of input fields
        if(x < maxField){ 
            x++; //Increment field counter
            $(wrapper).append(fieldHTML); //Add field html
        }
    });
    
    //Once remove button is clicked
    $(wrapper).on('click', '.remove_button', function(e){
        e.preventDefault();
        $(this).parent('div').parent('div').remove(); 
        $(this).parent('br').remove(); 
        
        x--; 
    });
});


