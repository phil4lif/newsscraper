
    $('.modal').modal();
  
  $(".modal-trigger").on("click", function(){
      console.log($(this).attr("data-id"))
      $("#mod").text($(this).attr("data-id"))
  })

  $("#scrape").on("click", function(){
      console.log("scraping for new articles")
  })