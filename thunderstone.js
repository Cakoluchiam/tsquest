$(function() {
  var log = console.log;
  var cs;
  var sets;
  var cards;

  var hero_options;
  var spell_options;
  var item_options;
  var weapon_options;
  var monster_options;
  var guardian_options;
  var room_options;

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
    hero_options = cards.Heroes;
    spell_options = cards.Spells;
    item_options = cards.Items;
    weapon_options = cards.Weapons;
    monster_options = cards.Monsters;
    guardian_options = cards.Guardians;
    room_options = cards["Dungeon Rooms"];
    log("Cards loaded:",cards);
  });

  $(".generate").button();

  $("#choose_heroes .generate").click(function(event){
    choices = [];
    options = Array.from(Object.keys(hero_options));

    while(choices.length < 4) {
      choices.push(options.slice(Math.floor(Math.random()*options.length)));
    }
    console.log(choices);
  });

  $("button").click(function(event){
    event.preventDefault();
  });
});