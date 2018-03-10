$(function() {
  var log = console.log;
  var cs;
  var sets;
  var cards;

  $.getJSON("enums.json",function(data){
    cs = data;
    log("Enums loaded:",cs);
  });

  $.getJSON("sets.json",function(data){
    sets = data;
    log("Sets loaded:",sets);
  });

  $.getJSON("cards.json",function(data){
    cards = data;
    log("Cards loaded:",cards);
  });

  $("#group_selector button").button();
  $("button").click(function(event){
    event.preventDefault();
    log("hello world");
  });
  $("#group_select_base").click(function(event){
    log("Selecting Base Set");
    log(event);
  });
});