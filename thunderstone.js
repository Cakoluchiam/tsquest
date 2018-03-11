$(function() {
  var log = function(id,msg) {
    var args = Array.from(arguments);
    args.shift();
    if(!id) {
      console.log.apply(null,args);
    } else {
      $(id).html(msg);
    }
  };
  var cs;
  var sets;
  var groups;

  var options = {
    Heroes: {
      All: {},
      Cleric: {},
      Fighter: {},
      Rogue: {},
      Wizard: {}
    },
    Marketplace: {
      All: {},
      Spells: {},
      Items: {},
      Weapons: {}
    },
    Monsters: {
      All: {},
      1: {},
      2: {},
      3: {}
    },
    Guardians: {
      All: {}
    },
    "Dungeon Rooms": {
      All: {},
      1: {},
      2: {},
      3: {}
    },
  };

  var getCard = function(thing, type) {
    return groups[type][thing];
  };

  var toggle = function(type,on) {
    if(type === "Heroes") {
      return function(hero) {
        options.Heroes.All[hero] = on;
        getCard(hero,"Heroes").Classes.forEach(function(type) {
          options.Heroes[type][hero] = on;
        });
      };
    } else if(type === "Monsters" || type === "Dungeon Rooms") {
      return function(thing) {
        options[type].All[thing] = on;
        options[type][getCard(thing,type).Level][thing] = on;
      };
    } else if(type === "Items" || type === "Spells" || type === "Weapons") {
      return function(thing) {
        options.Marketplace.All[thing] = on;
        options.Marketplace[type][thing] = on;
      };
    } else if(type === "Guardians") {
      return function(thing) {
        options[type].All[thing] = on;
      };
    } else if(["Treasures"].indexOf(type) !== -1) {
      return function() {};
    } else {
      throw new Error("Invalid type: "+type);
      // return
    }
  };

  $.getJSON("enums.json",function(data){
    cs = data;
    log(null,"Enums loaded:",cs);
  }).fail(function(){
    cs = getEnums();
    log(null,"Could not load enums from file.",cs);
  });

  $.getJSON("sets.json",function(data){
    sets = data;
    log(null,"Sets loaded:",sets);
  }).fail(function() {
    sets = getSets();
    log(null,"Could not load sets from file.",sets);
  });

  var parseGroups = function(data) {
    Object.keys(data).forEach(function(group) {
      Object.keys(data[group]).forEach(toggle(group,true));
    });
    log(null,"Options:",options);
  };

  // TODO: database the cards separately from their groups
  $.getJSON("cards.json",function(data){
    groups = data;
    parseGroups(groups);
    log(null,"Cards loaded:",groups);
  }).fail(function() {
    groups = getCards();
    log(null,"Could not load groups from file.",groups);
    parseGroups(groups);
  });

  $(".generate").button();

  $("button").click(function(event){
    event.preventDefault();
  });

  $("#choose_heroes_classed").click(function(event){
    var choices = {
      Cleric: choose(1,options.Heroes.Cleric)[0],
      Fighter: choose(1,options.Heroes.Fighter)[0],
      Rogue: choose(1,options.Heroes.Rogue)[0],
      Wizard: choose(1,options.Heroes.Wizard)[0]
    };

    var classes;

    while(choices.Cleric === choices.Fighter ||
          choices.Cleric === choices.Rogue ||
          choices.Cleric === choices.Wizard ||
          choices.Fighter === choices.Rogue ||
          choices.Fighter === choices.Wizard ||
          choices.Rogue === choices.Wizard) {
      classes = Object.keys(choices);

      class1 = classes.splice(Math.floor(Math.random()*4),1);
      class2 = classes.splice(Math.floor(Math.random()*3),1);

      if(choices[class1] === choices[class2]) {
        log(null,"Chose "+choices[class1]+" for both "+class1+" and "+class2+".");
        if(Object.keys(options.Heroes[class1]).length < 2) {
          if(Object.keys(options.Heroes[class2]).length < 2) {
            throw new Error("Cannot choose different heroes for "+class1+" and "+class2+"; "+choices[class1]+" is the only hero of both classes.");
          } else {
            choices[class2] = choose(1,options.Heroes[class2])[0];
          }
        } else {
          choices[class1] = choose(1,options.Heroes[class1])[0];
        }
      }
    }

    log("#hero_choices",'<ul><li>'+
      [choices.Cleric, choices.Fighter, choices.Rogue, choices.Wizard].map(function(hero) {
      return hero + ' (' + getCard(hero,"Heroes").Classes.join(', ') + ')';
    }).join('</li><li>')+'</li></ul>');
  });

  $("#choose_heroes_random").click(function(event){
    log("#hero_choices",'<ul><li>'+choose(4,options.Heroes.All).map(function(hero) {
      return hero + ' (' + getCard(hero,"Heroes").Classes.join(', ') + ')';
      }).join('</li><li>')+'</li></ul>');
  });

  $("#choose_marketplace").click(function(event){
    var market = [2,2,2];
    market[Math.floor(Math.random()*3)] += 1;
    market[Math.floor(Math.random()*3)] += 1;
    log("#item_choices",'<ul><li>'+choose(market[0],options.Marketplace.Items).join('</li><li>')+'</li></ul>');
    log("#spell_choices",'<ul><li>'+choose(market[1],options.Marketplace.Spells).join('</li><li>')+'</li></ul>');
    log("#weapon_choices",'<ul><li>'+choose(market[2],options.Marketplace.Weapons).join('</li><li>')+'</li></ul>');
  });

  $("#choose_items").click(function(event){
    log("#item_choices",'<ul><li>'+choose(4,options.Marketplace.Items).join('</li><li>')+'</li></ul>');
  });

  $("#choose_spells").click(function(event){
    log("#spell_choices",'<ul><li>'+choose(4,options.Marketplace.Spells).join('</li><li>')+'</li></ul>');
  });

  $("#choose_weapons").click(function(event){
    log("#weapon_choices",'<ul><li>'+choose(4,options.Marketplace.Weapons).join('</li><li>')+'</li></ul>');
  });

  $("#choose_monsters_random").click(function(event){
    log("#monster_choices",'<ul><li>'+choose(3,options.Monsters.All).map(function(e){
      return e + ' (' + getCard(e,"Monsters").Level + ')';
    }).join('</li><li>')+'</li></ul>');
  });

  $("#choose_guardian").click(function(event){
    log("#guardian_choice",'<ul><li>'+choose(1,options.Guardians.All).join('</li><li>')+'</li></ul>');
  });

  $("#choose_rooms_random").click(function(event){
    log("#room_choices",'<ul><li>'+choose(6,options["Dungeon Rooms"].All).map(function(e){
      return e + ' (' + getCard(e,"Dungeon Rooms").Level + ')';
    }).join('</li><li>')+'</li></ul>');
  });

  $("#choose_monsters_leveled").click(function(event){
    log("#monster_choices",'<ul><li>'+choose(1,options.Monsters[1]).concat(
             choose(1,options.Monsters[2])).concat(
             choose(1,options.Monsters[3])).map(function(e){
              return e + ' (' + getCard(e,"Monsters").Level + ')';
             }).join('</li><li>')+'</li></ul>');
  });

  $("#choose_rooms_leveled").click(function(event){
    log("#room_choices",'<ul><li>'+choose(2,options["Dungeon Rooms"][1]).concat(
             choose(2,options["Dungeon Rooms"][2])).concat(
             choose(2,options["Dungeon Rooms"][3])).map(function(e){
              return e + ' (' + getCard(e,"Dungeon Rooms").Level + ')';
             }).join('</li><li>')+'</li></ul>');
  });

  // `from` is an object whose keys will be selected
  // If you want details on an item, use from[choices[i]]
  function choose(num, from){
    choices = [];
    from = Object.keys(from);
    if(from.length < num) {
      return from;
    }

    while(choices.length < num && from.length > 0) {
      choices.push(from.splice(Math.floor(Math.random()*from.length),1)[0]);
    }
    return choices;
  }
});

function getEnums(){
              return {
                "ids":{
                  "base":"Base Set",
                  "promos":"Promos",
                  "quest0":"Bandits of Black Rock",
                  "quest1":"A Mirror in the Dark",
                  "quest2":"Risen from the Mire",
                  "quest3":"At the Foundations of the World",
                  "quest4":"Total Eclipse of the Sun",
                  "quest5":"Ripple in Time"
                },
                "color":{
                  "onbuttoncolor": "green",
                  "ontextcolor": "white",
                  "offbuttoncolor": "red",
                  "offtextcolor": "white"
                }
              };
             }

function getSets(){
              return {
                "sets": {
                  "Base Set":{
                    "Quest Number":-2
                  },
                  "Promos":{
                    "Quest Number":-1,
                    "Heroes":[
                      "Outlands",
                      "Stalker",
                      "The Yellow Knight"
                    ],
                    "Items":[
                      "Necklace of Dawn"
                    ],
                    "Spells":[
                      "Form of the Juggernaut"
                    ],
                    "Weapons":[
                      "Hand Axe"
                    ]
                  },
                  "Bandits of Black Rock":{
                    "Quest Number":0,
                    "Heroes":[
                      "Edlin"
                    ],
                    "Items":[
                      "Scionic Annals"
                    ],
                    "Spells":[
                      "Dark Fire Torch"
                    ],
                    "Weapons":[
                      "Rapier"
                    ],
                    "Treasures":[
                      "Miricelle"
                    ],
                    "Monsters":[
                      "Black Rock Bandits"
                    ]
                  },
                  "A Mirror in the Dark":{
                    "Quest Number":1,
                    "Heroes":[
                      "Gorlandor",
                      "Hawkswood",
                      "Pylorian",
                      "Scathian",
                      "Silverhelm",
                      "Stormhand"
                    ],
                    "Items":[
                      "Amulet of Infravision",
                      "Gem of Healing",
                      "Tome of Knowledge"
                    ],
                    "Spells":[
                      "Fireball",
                      "Future Vision",
                      "Magic Missile",
                      "Moonlight"
                    ],
                    "Weapons":[
                      "Hammer",
                      "Maul",
                      "Shortbow",
                      "Shortspear",
                      "Shortsword"
                    ],
                    "Monsters":[
                      "Kobold Skirmishers",
                      "Goblin Grunts",
                      "Hobgoblin Brutes",
                      "Spider Terrors",
                      "Ancient Adventurers",
                      "Goblin King's Guard"
                    ],
                    "Guardians":[
                      "Smorga the Queen"
                    ],
                    "Treasures":[
                      "Stormland Mirror",
                      "Treasure Cache",
                      "Treasure Cache"
                    ],
                    "Dungeon Rooms":[
                      "Abandoned Gate",
                      "Mine",
                      "Crypt",
                      "Sunken Well",
                      "Throne Room",
                      "Vault"
                    ]
                  },
                  "Total Eclipse of the Sun":{
                    "Quest Number":2,
                    "Heroes":[
                      "Avania",
                      "Brimstone",
                      "Ehrlingal",
                      "Felin",
                      "Gendarme",
                      "Sephilest"
                    ],
                    "Items":[
                      "Elven Ring",
                      "Headband of Intellect",
                      "Strength Gauntlets",
                      "Wand of Light"
                    ],
                    "Spells":[
                      "Arcane Touch",
                      "Consecration",
                      "Lightning Bolt",
                      "Nature's Fury"
                    ],
                    "Weapons":[
                      "Longbow",
                      "Longsword",
                      "Punching Dagger",
                      "Quarterstaff"
                    ],
                    "Monsters":[
                      "Twisted Creatures",
                      "Woodland Sprites",
                      "Corrupted Elves",
                      "Foundational Keepers",
                      "Corrupted Centaurs",
                      "Treefolk"
                    ],
                    "Guardians":[
                      "Guardian of the Sun"
                    ],
                    "Treasures":[
                      "Sun of the Forest",
                      "Treasure Cache",
                      "Treasure Cache"
                    ],
                    "Dungeon Rooms":[
                      "Fairy Meadow",
                      "Ominous Looking Road",
                      "Hollow Tree",
                      "Tree House",
                      "Elven Outpost",
                      "Elven Ruins"
                    ]
                  },
                  "Risen from the Mire":{
                    "Quest Number":3,
                    "Heroes":[
                      "Bahran",
                      "Darameric",
                      "Linsha",
                      "Markennan",
                      "Nimblefingers",
                      "Regalen"
                    ],
                    "Items":[
                      "Crystal of Scrying",
                      "Holy Symbol",
                      "Potion of Stamina",
                      "Ring of Learning"
                    ],
                    "Spells":[
                      "Arcane Aura",
                      "Charm Monster",
                      "Enchant Weapons",
                      "Vampiric Touch"
                    ],
                    "Weapons":[
                      "Battle Axe",
                      "Boomerang",
                      "Crystal Dagger",
                      "Holy Mace"
                    ],
                    "Monsters":[
                      "Ensnaring Vines",
                      "Bog Zombies",
                      "Chaos Lizards",
                      "Moor Skeletons",
                      "Marsh Trolls",
                      "Swamp Spirits"
                    ],
                    "Guardians":[
                      "Baalok, the Flesh Weaver"
                    ],
                    "Treasures":[
                      "Elemental Elixir",
                      "Treasure Cache",
                      "Treasure Cache"
                    ],
                    "Dungeon Rooms":[
                      "Alchemy Chamber",
                      "The Servant's Tombs",
                      "Bog",
                      "Sunken Graveyard",
                      "Blood Altar Room",
                      "The Lich's Tomb"
                    ]
                  },
                  "At the Foundations of the World":{
                    "Quest Number":4,
                    "Heroes":[
                      "Darkrend",
                      "Grimwolf",
                      "Honormain",
                      "Jadress",
                      "Moonblades",
                      "Stormskull"
                    ],
                    "Items":[
                      "Damilu Huskie",
                      "Daramere's Cloak",
                      "Potion of Light",
                      "Ring of Proficiency"
                    ],
                    "Spells":[
                      "Death Pact",
                      "Mirror Image",
                      "Tempest",
                      "True Seeing"
                    ],
                    "Weapons":[
                      "Broadsword",
                      "Crossbow",
                      "Flail",
                      "Two-Handed Sword"
                    ],
                    "Monsters":[
                      "Air Servitors",
                      "Water Servitors",
                      "Earth Servitors",
                      "Fire Servitors",
                      "Divine Founders",
                      "Abyssal Founders"
                    ],
                    "Guardians":[
                      "Miricelle, Scion Defender"
                    ],
                    "Treasures":[
                      "Elmoran",
                      "Treasure Cache",
                      "Treasure Cache"
                    ],
                    "Dungeon Rooms":[
                      "Air Temple",
                      "Water Temple",
                      "Earth Temple",
                      "Fire Temple",
                      "Abyssal Temple",
                      "Celestial Temple"
                    ]
                  },
                  "Ripples in Time":{
                    "Quest Number":5,
                    "Heroes":[
                      "Aird",
                      "Arcanian",
                      "Dunardic",
                      "Regian",
                      "Terakian",
                      "Veris"
                    ],
                    "Items":[
                      "Amulet of Power",
                      "Lightstone Gem",
                      "Nature's Amulet",
                      "Ring of Spell Storing"
                    ],
                    "Spells":[
                      "Creeping Death",
                      "Frostbolt",
                      "Mind Control",
                      "Summon Storm"
                    ],
                    "Weapons":[
                      "Cursed Mace",
                      "King's Sword",
                      "Longspear",
                      "Magi Staff"
                    ],
                    "Monsters":[
                      "Doomknights",
                      "Gnoll Raiders",
                      "Minions of Chaos",
                      "Torments",
                      "Ancient Wyrms",
                      "Ancient Protectors"
                    ],
                    "Guardians":[
                      "Death Sentinel"
                    ],
                    "Treasures":[
                      "Axe of the Giants",
                      "Lightbringer"
                    ],
                    "Dungeon Rooms":[
                      "Gate Cavern",
                      "Dangerous Passageway",
                      "Fire Chasm"
                    ]
                  }
                }
              };
             }

function getCards(){
              return {
                "Heroes": {
                  "Outlands": {
                    "Quest": "Promos",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Fighter"
                    ],
                    "Cost": 7,
                    "Attack": "Physical"
                  },
                  "Stalker": {
                    "Quest": "Promos",
                    "Races": [
                      "Elf"
                    ],
                    "Classes": [
                      "Rogue"
                    ],
                    "Cost": 6,
                    "Attack": "Physical",
                    "Gold": true,
                    "Summary": "Stalker uses Gear tokens for strength and provides [Light] at [III]."
                  },
                  "The Yellow Knight": {
                    "Quest": "Promos",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Fighter"
                    ],
                    "Cost": 8,
                    "Attack": "Physical"
                  },
                  "Edlin": {
                    "Quest": "Bandits of Black Rock",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Fighter"
                    ],
                    "Cost": 6,
                    "Attack": "Physical"
                  },
                  "Gorlandor": {
                    "Quest": "A Mirror in the Dark",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Fighter"
                    ],
                    "Cost": 7,
                    "Attack": "Physical"
                  },
                  "Hawkswood": {
                    "Quest": "A Mirror in the Dark",
                    "Races": [
                      "Avian",
                      "Elf"
                    ],
                    "Classes": [
                      "Rogue"
                    ],
                    "Cost": 6,
                    "Attack": "Physical",
                    "Gold": true,
                    "Light": true
                  },
                  "Pylorian": {
                    "Quest": "A Mirror in the Dark",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Wizard"
                    ],
                    "Cost": 6,
                    "Attack": "Magic",
                    "Summary": "[Arcane Spell] specialist."
                  },
                  "Scathian": {
                    "Quest": "A Mirror in the Dark",
                    "Races": [
                      "Halfling"
                    ],
                    "Classes": [
                      "Rogue",
                      "Wizard"
                    ],
                    "Cost": 8,
                    "Attack": "Magic",
                    "Gold": true
                  },
                  "Silverhelm": {
                    "Quest": "A Mirror in the Dark",
                    "Races": [
                      "Dwarf"
                    ],
                    "Classes": [
                      "Cleric",
                      "Fighter"
                    ],
                    "Cost": 6,
                    "Attack": "Physical"
                  },
                  "Stormhand": {
                    "Quest": "A Mirror in the Dark",
                    "Races": [
                      "Dwarf"
                    ],
                    "Classes": [
                      "Fighter"
                    ],
                    "Cost": 7,
                    "Attack": "Physical",
                    "Summary": "[Edged Weapon] specialist."
                  },
                  "Avania": {
                    "Quest": "Total Eclipse of the Sun",
                    "Races": [
                      "Celestial",
                      "Human"
                    ],
                    "Classes": [
                      "Cleric"
                    ],
                    "Cost": 6,
                    "Attack": "Magic"
                  },
                  "Brimstone": {
                    "Quest": "Total Eclipse of the Sun",
                    "Races": [
                      "Dwarf"
                    ],
                    "Classes": [
                      "Rogue"
                    ],
                    "Cost": 8,
                    "Attack": "Physical",
                    "Gold": true,
                    "Light": true,
                    "Summary": "The more [Light] you have, the more powerful Brimstone gets."
                  },
                  "Ehrlingal": {
                    "Quest": "Total Eclipse of the Sun",
                    "Races": [
                      "Halfling"
                    ],
                    "Classes": [
                      "Rogue"
                    ],
                    "Cost": 7,
                    "Attack": "Physical",
                    "Gold": true,
                    "Summary": "Ehrlingal provides [Light] at [II] and is a [Dagger] specialist."
                  },
                  "Felin": {
                    "Quest": "Total Eclipse of the Sun",
                    "Races": [
                      "Elf"
                    ],
                    "Classes": [
                      "Cleric",
                      "Wizard"
                    ],
                    "Cost": 8,
                    "Attack": "Physical",
                    "Light": true,
                    "Summary": "Felin can shapeshift her form, depending on the situation."
                  },
                  "Gendarme": {
                    "Quest": "Total Eclipse of the Sun",
                    "Races": [
                      "Dwarf"
                    ],
                    "Classes": [
                      "Wizard"
                    ],
                    "Cost": 6,
                    "Attack": "Magic",
                    "Summary": "Gendarme uses secret Dwarven magic to empower your [Weapons]."
                  },
                  "Sephilest": {
                    "Quest": "Total Eclipse of the Sun",
                    "Races": [
                      "Elf"
                    ],
                    "Classes": [
                      "Fighter"
                    ],
                    "Cost": 8,
                    "Attack": "Physical"
                  },
                  "Baharan": {
                    "Quest": "Risen from the Mire",
                    "Races": [
                      "Triton"
                    ],
                    "Classes": [
                      "Cleric"
                    ],
                    "Cost": 7,
                    "Attack": "Magic",
                    "Summary": "Baharan uses strange magics, allowing you to discard cards for bonuses."
                  },
                  "Darameric": {
                    "Quest": "Risen from the Mire",
                    "Races": [
                      "Elf"
                    ],
                    "Classes": [
                      "Cleric",
                      "Wizard"
                    ],
                    "Cost": 9,
                    "Attack": "Magic"
                  },
                  "Linsha": {
                    "Quest": "Risen from the Mire",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Fighter"
                    ],
                    "Cost": 7,
                    "Attack": "Physical"
                  },
                  "Markennan": {
                    "Quest": "Risen from the Mire",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Fighter"
                    ],
                    "Cost": 7,
                    "Attack": "Physical",
                    "Summary": "[Blunt Weapon] specialist."
                  },
                  "Nimblefingers": {
                    "Quest": "Risen from the Mire",
                    "Races": [
                      "Elf"
                    ],
                    "Classes": [
                      "Rogue"
                    ],
                    "Cost": 8,
                    "Attack": "Physical",
                    "Light": true
                  },
                  "Regalen": {
                    "Quest": "Risen from the Mire",
                    "Races": [
                      "Elf"
                    ],
                    "Classes": [
                      "Wizard"
                    ],
                    "Cost": 8,
                    "Attack": "Magic"
                  },
                  "Darkrend": {
                    "Quest": "At the Foundations of the World",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Wizard"
                    ],
                    "Cost": 8,
                    "Attack": "Magic",
                    "Summary": "Using forbidden blood magic, Darkrend inflicts [Wound] to power her attacks."
                  },
                  "Grimwolf": {
                    "Quest": "At the Foundations of the World",
                    "Races": [
                      "Undead",
                      "Human"
                    ],
                    "Classes": [
                      "Fighter"
                    ],
                    "Cost": 6,
                    "Attack": "Physical",
                    "Summary": "Risen to complete his mission, Grimwolf bleeds ([Wound]) to power himself."
                  },
                  "Honormain": {
                    "Quest": "At the Foundations of the World",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Cleric"
                    ],
                    "Cost": 7,
                    "Attack": "Physical"
                  },
                  "Jadress": {
                    "Quest": "At the Foundations of the World",
                    "Races": [
                      "Elf"
                    ],
                    "Classes": [
                      "Rogue"
                    ],
                    "Cost": 6,
                    "Attack": "Physical",
                    "Gold": true,
                    "Summary": "[Bow Weapon] specialist."
                  },
                  "Moonblades": {
                    "Quest": "At the Foundations of the World",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Fighter",
                      "Rogue"
                    ],
                    "Attack": "Physical",
                    "Cost": 7,
                    "Gold": true
                  },
                  "Stormskull": {
                    "Quest": "At the Foundations of the World",
                    "Races": [
                      "Human",
                      "Orc"
                    ],
                    "Classes": [
                      "Wizard"
                    ],
                    "Cost": 8,
                    "Attack": "Magic",
                    "Light": true
                  },
                  "Aird": {
                    "Quest": "Ripples in Time",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Rogue"
                    ],
                    "Cost": 6,
                    "Attack": "Physical",
                    "Gold": true,
                    "Summary": "Aird uses your opponents' strengths against them."
                  },
                  "Arcanian": {
                    "Quest": "Ripples in Time",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Wizard"
                    ],
                    "Cost": 8,
                    "Attack": "Magic",
                    "Summary": "Arcanian's sorcery changes dice rolls. She also provides [Light] at [II]."
                  },
                  "Dunardic": {
                    "Quest": "Ripples in Time",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Fighter"
                    ],
                    "Cost": 6,
                    "Attack": "Physical",
                    "Summary": "Once a Town Guard, Dunardic uses your [XP] as a resource."
                  },
                  "Regian": {
                    "Quest": "Ripples in Time",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Cleric"
                    ],
                    "Cost": 7,
                    "Attack": "Magic"
                  },
                  "Terakian": {
                    "Quest": "Ripples in Time",
                    "Races": [
                      "Human"
                    ],
                    "Classes": [
                      "Cleric",
                      "Fighter"
                    ],
                    "Cost": 8,
                    "Attack": "Physical",
                    "Summary": "[Potion] specialist."
                  },
                  "Veris": {
                    "Quest": "Ripples in Time",
                    "Races": [
                      "Elf"
                    ],
                    "Classes": [
                      "Wizard"
                    ],
                    "Cost": 7,
                    "Attack": "Magic",
                    "Light": true,
                    "Summary": "Veris has the ability to make [Weapons] glow bright."
                  }
                },
                "Items": {
                  "Necklace of Dawn": {
                    "Quest": "Promos"
                  },
                  "Scionic Annals": {
                    "Quest": "Bandits of Black Rock"
                  },
                  "Amulet of Infravision": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Gem of Healing": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Tome of Knowledge": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Elven Ring": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Headband of Intellect": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Strength Gauntlets": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Wand of Light": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Crystal of Scrying": {
                    "Quest": "Risen from the Mire"
                  },
                  "Holy Symbol": {
                    "Quest": "Risen from the Mire"
                  },
                  "Potion of Stamina": {
                    "Quest": "Risen from the Mire"
                  },
                  "Ring of Learning": {
                    "Quest": "Risen from the Mire"
                  },
                  "Damilu Huskie": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Daramere's Cloak": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Potion of Light": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Ring of Proficiency": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Amulet of Power": {
                    "Quest": "Ripples in Time"
                  },
                  "Lightstone Gem": {
                    "Quest": "Ripples in Time"
                  },
                  "Nature's Amulet": {
                    "Quest": "Ripples in Time"
                  },
                  "Ring of Spell Storing": {
                    "Quest": "Ripples in Time"
                  }
                },
                "Spells": {
                  "Form of the Juggernaut": {
                    "Quest": "Promos"
                  },
                  "Dark Fire Torch": {
                    "Quest": "Bandits of Black Rock"
                  },
                  "Fireball": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Future Vision": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Magic Missile": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Moonlight": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Arcane Touch": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Consecration": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Lightning Bolt": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Nature's Fury": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Arcane Aura": {
                    "Quest": "Risen from the Mire"
                  },
                  "Charm Monster": {
                    "Quest": "Risen from the Mire"
                  },
                  "Enchant Weapons": {
                    "Quest": "Risen from the Mire"
                  },
                  "Vampiric Touch": {
                    "Quest": "Risen from the Mire"
                  },
                  "Death Pact": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Mirror Image": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Tempest": {
                    "Quest": "At the Foundations of the World"
                  },
                  "True Seeing": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Creeping Death": {
                    "Quest": "Ripples in Time"
                  },
                  "Frostbolt": {
                    "Quest": "Ripples in Time"
                  },
                  "Mind Control": {
                    "Quest": "Ripples in Time"
                  },
                  "Summon Storm": {
                    "Quest": "Ripples in Time"
                  }
                },
                "Weapons": {
                  "Hand Axe": {
                    "Quest": "Promos"
                  },
                  "Rapier": {
                    "Quest": "Bandits of Black Rock"
                  },
                  "Hammer": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Maul": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Shortbow": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Shortspear": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Shortsword": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Longbow": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Longsword": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Punching Dagger": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Quarterstaff": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Battle Axe": {
                    "Quest": "Risen from the Mire"
                  },
                  "Boomerang": {
                    "Quest": "Risen from the Mire"
                  },
                  "Crystal Dagger": {
                    "Quest": "Risen from the Mire"
                  },
                  "Holy Mace": {
                    "Quest": "Risen from the Mire"
                  },
                  "Broadsword": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Crossbow": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Flail": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Two-Handed Sword": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Cursed Mace": {
                    "Quest": "Ripples in Time"
                  },
                  "King's Sword": {
                    "Quest": "Ripples in Time"
                  },
                  "Longspear": {
                    "Quest": "Ripples in Time"
                  },
                  "Magi Staff": {
                    "Quest": "Ripples in Time"
                  }
                },
                "Treasures": {
                  "Miricelle": {
                    "Quest": "Bandits of Black Rock"
                  },
                  "Stormland Mirror": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Sun of the Forest": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Elemental Elixir": {
                    "Quest": "Risen from the Mire"
                  },
                  "Elmoran": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Axe of the Giants": {
                    "Quest": "Ripples in Time"
                  },
                  "Lightbringer": {
                    "Quest": "Ripples in Time"
                  }
                },
                "Monsters": {
                  "Black Rock Bandits": {
                    "Quest": "Bandits of Black Rock",
                    "Level": 1,
                    "Types": [
                      "Humanoid"
                    ],
                    "Summary": "They attack your Marketplace cards."
                  },
                  "Kobold Skirmishers": {
                    "Quest": "A Mirror in the Dark",
                    "Level": 1,
                    "Types": [
                      "Humanoid"
                    ],
                    "Alert": true
                  },
                  "Goblin Grunts": {
                    "Quest": "A Mirror in the Dark",
                    "Level": 1,
                    "Types": [
                      "Humanoid"
                    ]
                  },
                  "Hobgoblin Brutes": {
                    "Quest": "A Mirror in the Dark",
                    "Level": 2,
                    "Types": [
                      "Humanoid"
                    ],
                    "Summary": "They attack Heroes and their equipment."
                  },
                  "Spider Terrors": {
                    "Quest": "A Mirror in the Dark",
                    "Level": 2,
                    "Types": [
                      "Giant",
                      "Vermin"
                    ],
                    "Summary": "They wound heavily ([Wound] and [Festering]) and are drawn to equipment."
                  },
                  "Ancient Adventurers": {
                    "Quest": "A Mirror in the Dark",
                    "Level": 3,
                    "Types": [
                      "Undead"
                    ]
                  },
                  "Goblin King's Guard": {
                    "Quest": "A Mirror in the Dark",
                    "Level": 3,
                    "Types": [
                      "Humanoid"
                    ]
                  },
                  "Twisted Creatures": {
                    "Quest": "Total Eclipse of the Sun",
                    "Level": 1,
                    "Types": [
                      "Beast"
                    ]
                  },
                  "Woodland Sprites": {
                    "Quest": "Total Eclipse of the Sun",
                    "Level": 1,
                    "Types": [
                      "Fey"
                    ],
                    "Summary": "They deal Festering Wounds ([Festering])."
                  },
                  "Corrupted Elves": {
                    "Quest": "Total Eclipse of the Sun",
                    "Level": 2,
                    "Types": [
                      "Humanoid"
                    ],
                    "Summary": "Destroy your [XP] or suffer their wrath."
                  },
                  "Foundational Keepers": {
                    "Quest": "Total Eclipse of the Sun",
                    "Level": 2,
                    "Types": [
                      "Elemental",
                      "Giant",
                      "Humanoid"
                    ],
                    "Summary": "These Ogres attack as soon as they refill the Dungeon (but not at game setup)."
                  },
                  "Corrupted Centaurs": {
                    "Quest": "Total Eclipse of the Sun",
                    "Level": 3,
                    "Types": [
                      "Beast",
                      "Humanoid"
                    ],
                    "Summary": "They are each susceptible to a particular Class, but resilient against others."
                  },
                  "Treefolk": {
                    "Quest": "Total Eclipse of the Sun",
                    "Level": 3,
                    "Types": [
                      "Giant",
                      "Plant"
                    ],
                    "Summary": "They are worth much more if you defeat them convincingly."
                  },
                  "Ensnaring Vines": {
                    "Quest": "Risen from the Mire",
                    "Level": 1,
                    "Types": [
                      "Plant"
                    ],
                    "Alert": true
                  },
                  "Bog Zombies": {
                    "Quest": "Risen from the Mire",
                    "Level": 1,
                    "Types": [
                      "Undead"
                    ],
                    "Summary": "They deal Festering Wounds ([Festering])."
                  },
                  "Chaos Lizards": {
                    "Quest": "Risen from the Mire",
                    "Level": 2,
                    "Types": [
                      "Humanoid"
                    ],
                    "Summary": "They discard your cards based on the outcome of dice rolls."
                  },
                  "Moor Skeletons": {
                    "Quest": "Risen from the Mire",
                    "Level": 2,
                    "Types": [
                      "Undead"
                    ],
                    "Summary": "They deal [Festering] and are resistant to [Physical Attack] and [Edged Weapons]."
                  },
                  "Marsh Trolls": {
                    "Quest": "Risen from the Mire",
                    "Level": 3,
                    "Types": [
                      "Giant"
                    ],
                    "Summary": "They have immunities to different cards."
                  },
                  "Swamp Spirits": {
                    "Quest": "Risen from the Mire",
                    "Level": 3,
                    "Types": [
                      "Undead"
                    ],
                    "Summary": "They hunger for (attack) your [Heroes]."
                  },
                  "Air Servitors": {
                    "Quest": "At the Foundations of the World",
                    "Level": 1,
                    "Types": [
                      "Elemental"
                    ],
                    "Summary": "They tend to be vulnerable to [Magic Attack]"
                  },
                  "Water Servitors": {
                    "Quest": "At the Foundations of the World",
                    "Level": 1,
                    "Types": [
                      "Elemental"
                    ],
                    "Summary": "They move throughout the dungeon making it unpredictable.",
                    "Alert": true
                  },
                  "Earth Servitors": {
                    "Quest": "At the Foundations of the World",
                    "Level": 2,
                    "Types": [
                      "Elemental"
                    ],
                    "Summary": "They are strong against [Physical Attack]."
                  },
                  "Fire Servitors": {
                    "Quest": "At the Foundations of the World",
                    "Level": 2,
                    "Types": [
                      "Elemental"
                    ],
                    "Summary": "They attack your [Skill] and Weapons."
                  },
                  "Divine Founders": {
                    "Quest": "At the Foundations of the World",
                    "Level": 3,
                    "Types": [
                      "Elemental",
                      "Celestial"
                    ],
                    "Summary": "They judge (attack) your Heroes harshly."
                  },
                  "Abyssal Founders": {
                    "Quest": "At the Foundations of the World",
                    "Level": 3,
                    "Types": [
                      "Elemental",
                      "Demon"
                    ],
                    "Summary": "The chaotic nature of their dice rolls make them unpredicatble. [sic]"
                  },
                  "Doomknights": {
                    "Quest": "Ripples in Time",
                    "Level": 1,
                    "Types": [
                      "Undead"
                    ],
                    "Summary": "They attack Heroes who try to move through their room."
                  },
                  "Gnoll Raiders": {
                    "Quest": "Ripples in Time",
                    "Level": 1,
                    "Types": [
                      "Humanoid"
                    ],
                    "Summary": "They destroy your Weapons and Gear."
                  },
                  "Minions of Chaos": {
                    "Quest": "Ripples in Time",
                    "Level": 2,
                    "Types": [
                      "Demon"
                    ],
                    "Summary": "They destroy your Heroes based on the outcome of dice rolls."
                  },
                  "Torments": {
                    "Quest": "Ripples in Time",
                    "Level": 2,
                    "Types": [
                      "Elemental"
                    ],
                    "Summary": "They are strong against [Magic Attack]."
                  },
                  "Ancient Wyrms": {
                    "Quest": "Ripples in Time",
                    "Level": 3,
                    "Types": [
                      "Dragon"
                    ],
                    "Summary": "They like to snack on (attack) your Heroes."
                  },
                  "Ancient Protectors": {
                    "Quest": "Ripples in Time",
                    "Level": 3,
                    "Types": [
                      "Golem"
                    ],
                    "Summary": "They are immune to Heroes with low [Skill]."
                  }
                },
                "Guardians": {
                  "Smorga the Queen": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Guardian of the Sun": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Baalok, the Flesh Weaver": {
                    "Quest": "Risen from the Mire"
                  },
                  "Miricelle, Scion Defender": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Death Sentinel": {
                    "Quest": "Ripples in Time"
                  }
                },
                "Dungeon Rooms": {
                  "Abandoned Gate": {
                    "Quest": "A Mirror in the Dark",
                    "Level": 1,
                    "Light": 0
                  },
                  "Mine": {
                    "Quest": "A Mirror in the Dark",
                    "Level": 1,
                    "Light": 0,
                    "Battle": {
                      "Health": 1
                    },
                    "Reward": {
                      "Iron Rations": 1
                    }
                  },
                  "Crypt": {
                    "Quest": "A Mirror in the Dark",
                    "Level": 2,
                    "Light": 1,
                    "Alert": true,
                    "Entry": {
                      "Unless": {
                        "Rogue": 1
                      },
                      "Penalty": {
                        "Gear": {
                          "Choose": 1
                        }
                      }
                    },
                    "Battle": {
                      "Wound": 1
                    },
                    "Reward": {
                      "XP": 1
                    }
                  },
                  "Sunken Well": {
                    "Quest": "A Mirror in the Dark",
                    "Level": 2,
                    "Light": 1,
                    "Battle": {
                      "Health": 1
                    },
                    "Reward": {
                      "Lantern": 1
                    }
                  },
                  "Throne Room": {
                    "Quest": "A Mirror in the Dark",
                    "Level": 3,
                    "Light": 2,
                    "Alert": true,
                    "Entry": {
                      "Unless": {
                        "Rogue": 1
                      },
                      "Penalty": {
                        "Card": {
                          "Random": 1
                        }
                      }
                    },
                    "After Battle": {
                      "Return": 0,
                      "Text": "Place your Champion in the [0] room."
                    },
                    "Reward": {
                      "XP": 2
                    }
                  },
                  "Vault": {
                    "Quest": "A Mirror in the Dark",
                    "Level": 3,
                    "Light": 2,
                    "Battle": {
                      "Wound": 1
                    },
                    "Reward": {
                      "Treasure": 1
                    },
                    "After Battle": {
                      "Return": 2,
                      "Text": "Place your Champion in a [II] room."
                    }
                  },
                  "Fairy Meadow": {
                    "Quest": "Total Eclipse of the Sun",
                    "Level": 1,
                    "Light": 0,
                    "Battle": {
                      "Magic Resistance": 2
                    },
                    "Reward": {
                      "Lantern": 1
                    }
                  },
                  "Ominous Looking Road": {
                    "Quest": "Total Eclipse of the Sun",
                    "Level": 1,
                    "Light": 0,
                    "Battle": {
                      "Armor": 1
                    },
                    "Spoils": {
                      "Buy": {
                        "Spell": 1,
                        "Weapon": 1,
                        "Gold": {
                          "Bonus": 1
                        }
                      }
                    }
                  },
                  "Hollow Tree": {
                    "Quest": "Total Eclipse of the Sun",
                    "Level": 2,
                    "Light": 2,
                    "Reward": {
                      "Potion": 1
                    },
                    "After Battle": {
                      "Return": 0,
                      "Text": "Place your Champion in the [0] room."
                    }
                  },
                  "Tree House": {
                    "Quest": "Total Eclipse of the Sun",
                    "Level": 2,
                    "Light": 1,
                    "Battle": {
                      "Health": 2
                    },
                    "Spoils": {
                      "Destroy": {
                        "Type": "Starter",
                        "Amount": 1
                      }
                    }
                  },
                  "Elven Outpost": {
                    "Quest": "Total Eclipse of the Sun",
                    "Level": 3,
                    "Light": 2,
                    "Battle": {
                      "Wound": 1
                    },
                    "Spoils": {
                      "Level Up": {
                        "XP": {
                          "Discount": 2
                        }
                      },
                      "Return": 0,
                      "Text": "Level up a Hero for 2 less [XP]. Place your Champion in the [0] room."
                    }
                  },
                  "Elven Ruins": {
                    "Quest": "Total Eclipse of the Sun",
                    "Level": 3,
                    "Light": 2,
                    "Battle": {
                      "Health": "Special"
                    },
                    "Special": [
                      {
                        "Unless": {
                          "Rogue": 1
                        },
                        "Card": {
                          "Choose": -1,
                          "From": "Hand",
                          "To": "Discard"
                        },
                        "Battle": {
                          "Health": "Special"
                        },
                        "Text": "Unless you have a Rogue, discard 1 card from your deck. +[Health] = the card's [Cost]"
                      }
                    ]
                  },
                  "Alchemy Chamber": {
                    "Quest": "Risen from the Mire",
                    "Level": 1,
                    "Light": 0,
                    "Battle": {
                      "Health": "Special"
                    },
                    "Special": [
                      {
                        "Unless": {
                          "Magic": 1
                        },
                        "Battle": {
                          "Health": 1
                        }
                      }
                    ]
                  },
                  "The Servant's Tombs": {
                    "Quest": "Risen from the Mire",
                    "Level": 1,
                    "Light": 0,
                    "Battle": {
                      "Armor": "Special"
                    },
                    "Special": [
                      {
                        "Unless": {
                          "Light": 1
                        },
                        "Battle": {
                          "Health": 2
                        }
                      }
                    ]
                  },
                  "Bog": {
                    "Quest": "Risen from the Mire",
                    "Level": 2,
                    "Light": 1,
                    "Battle": {
                      "Heroes": {
                        "Skill": -1
                      }
                    },
                    "Spoils": {
                      "Buy": {
                        "Spell": 1,
                        "Weapon": 1
                      }
                    }
                  },
                  "Sunken Graveyard": {
                    "Quest": "Risen from the Mire",
                    "Level": 2,
                    "Light": 0,
                    "Battle": {
                      "Health": 2,
                      "Armor": "Special"
                    },
                    "Special": [
                      {
                        "Unless": {
                          "Light": 2
                        },
                        "Battle": {
                          "Armor": 3
                        }
                      }
                    ],
                    "Reward": {
                      "Iron Rations": 1
                    }
                  },
                  "Blood Altar Room": {
                    "Quest": "Risen from the Mire",
                    "Level": 3,
                    "Light": 2,
                    "Alert": true,
                    "Special": [
                      {
                        "Cost": {
                          "Wound": 1
                        },
                        "Light": -1,
                        "Text": "You may take 1 or more [Wound] to reduce this room's [Light] by 1 for each [Wound] taken."
                      }
                    ],
                    "Battle": {
                      "Health": 2
                    },
                    "Reward": {
                      "XP": 2
                    },
                    "After Battle": {
                      "Return": 0
                    }
                  },
                  "The Lich's Tomb": {
                    "Quest": "Risen from the Mire",
                    "Level": 3,
                    "Light": 1,
                    "Battle": {
                      "Health": "Special"
                    },
                    "Special": [
                      {
                        "Text": "Roll 2d6. +[Health] = the lower value rolled, or the total value if you rolled doubles."
                      }
                    ],
                    "Reward": {
                      "XP": 3
                    },
                    "After Battle": {
                      "Return": 0
                    }
                  },
                  "Air Temple": {
                    "Quest": "At the Foundations of the World",
                    "Level": 1,
                    "Light": 0,
                    "Battle": {
                      "Magic Resistance": 1
                    },
                    "Spoils": {
                      "Buy": {
                        "Item": 1
                      }
                    }
                  },
                  "Water Temple": {
                    "Quest": "At the Foundations of the World",
                    "Level": 1,
                    "Light": 1,
                    "Special": [
                      {
                        "Text": "Refill this room from the other [I] room. Then, refill that room from the Monster deck."
                      }
                    ],
                    "Reward": {
                      "Iron Rations": 1
                    }
                  },
                  "Earth Temple": {
                    "Quest": "At the Foundations of the World",
                    "Level": 2,
                    "Light": 1,
                    "Special": [
                      {
                        "Requires": {
                          "Text": "If your total Attack ([Physical] + [Magic]) exceeds this Monster's [Health] by 3 or more, you have +1 HP."
                        },
                        "Reward": {
                          "HP": 1
                        }
                      }
                    ]
                  },
                  "Fire Temple": {
                    "Quest": "At the Foundations of the World",
                    "Level": 2,
                    "Light": 0,
                    "Battle": {
                      "Weapons": {
                        "Skill": 2
                      },
                      "Wound": 1
                    },
                    "Reward": {
                      "Lantern": 2
                    }
                  },
                  "Abyssal Temple": {
                    "Quest": "At the Foundations of the World",
                    "Level": 3,
                    "Light": 2,
                    "After Battle": {
                      "Text": "Refill this room face down. Turn this room's Monster face up before a battle here; if it is not defeated put it at the bottom of its deck."
                    },
                    "Spoils": {
                      "Return": 0,
                      "XP": "Special",
                      "Text": "Gain [XP] equal to your total [Light]. At the end of the turn, place your Champion in the 0 room."
                    },
                    "Special": [
                      {
                        "Cost": {
                          "Return": 0
                        },
                        "XP": "Special",
                        "Text": "Gain [XP] equal to your total [Light]. At the end of the turn, place your Champion in the 0 room."
                      }
                    ]
                  },
                  "Celestial Temple": {
                    "Quest": "At the Foundations of the World",
                    "Level": 3,
                    "Light": 2,
                    "Battle": {
                      "Health": 1,
                      "Magic Resistance": 2
                    },
                    "Reward": {
                      "Treasure": 1
                    },
                    "After Battle": {
                      "Return": 0,
                      "Text": "Place your Champion in the [0] room."
                    }
                  },
                  "Gate Cavern": {
                    "Quest": "Ripples in Time",
                    "Level": 1,
                    "Light": 0,
                    "Battle": {
                      "Health": 2
                    },
                    "Special": [
                      {
                        "Requires": {
                          "Light": 1
                        },
                        "Bonus": {
                          "Health": -2
                        },
                        "Repeatable": true,
                        "Text": "For each [Light] you have, reduce the [Health] boost of this room by 2."
                      }
                    ]
                  },
                  "Dangerous Passageway": {
                    "Quest": "Ripples in Time",
                    "Level": 2,
                    "Light": 0,
                    "Battle": {
                      "Health": 4
                    },
                    "Special": [
                      {
                        "Requires": {
                          "Light": 1
                        },
                        "Bonus": {
                          "Health": -2
                        },
                        "Repeatable": true,
                        "Text": "For each [Light] you have, reduce the [Health] boost of this room by 2."
                      }
                    ]
                  },
                  "Fire Chasm": {
                    "Quest": "Ripples in Time",
                    "Level": 3,
                    "Light": 0,
                    "Battle": {
                      "Health": 6
                    },
                    "Special": [
                      {
                        "Requires": {
                          "Light": 1
                        },
                        "Bonus": {
                          "Health": -2
                        },
                        "Repeatable": true,
                        "Text": "For each [Light] you have, reduce the [Health] boost of this room by 2."
                      }
                    ]
                  }
                }
              };
             }