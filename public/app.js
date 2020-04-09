
    $('.modal').modal();
  
  $(".modal-trigger").on("click", function(){
      console.log($(this).attr("data-id"))
      $("#mod").text($(this).attr("data-id"))
  })