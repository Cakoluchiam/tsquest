$(function() {
  var log = function(id,msg) {
    var args = Array.from(arguments);
    args.shift();
    if(!id) {
      console.log.apply(null,args);
    } else {
      $(id).html(msg);
    }
  }
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

  $.getJSON("cards.json",function(data){
    cards = data;
    hero_options = cards.Heroes;
    spell_options = cards.Spells;
    item_options = cards.Items;
    weapon_options = cards.Weapons;
    monster_options = cards.Monsters;
    guardian_options = cards.Guardians;
    room_options = cards["Dungeon Rooms"];
    log(null,"Cards loaded:",cards);
  }).fail(function() {
    cards = getCards();
    hero_options = cards.Heroes;
    spell_options = cards.Spells;
    item_options = cards.Items;
    weapon_options = cards.Weapons;
    monster_options = cards.Monsters;
    guardian_options = cards.Guardians;
    room_options = cards["Dungeon Rooms"];
    log(null,"Could not load cards from file.",cards)
  });

  $(".generate").button();

  $("button").click(function(event){
    event.preventDefault();
  });

  $("#choose_heroes").click(function(event){
    log("#hero_choices",choose(4,hero_options).join(', '));
  });

  $("#choose_items").click(function(event){
    log("#item_choices",choose(4,item_options).join(', '));
  });

  $("#choose_spells").click(function(event){
    log("#spell_choices",choose(4,spell_options).join(', '));
  });

  $("#choose_weapons").click(function(event){
    log("#weapon_choices",choose(4,weapon_options).join(', '));
  });

  $("#choose_monsters_random").click(function(event){
    log("#monster_choices",choose(3,monster_options).join(', '));
  });

  $("#choose_guardian").click(function(event){
    log("#room_choices",choose(1,guardian_options).join(', '));
  });

  $("#choose_rooms_random").click(function(event){
    log("#guardian_choice",choose(6,room_options).join(', '));
  });

  $("#choose_monsters_leveled").click(function(event){
    log(null,"Coming soon⁢…");
    // log(null,choose(3,monster_options).join(', '));
  });

  $("#choose_rooms_leveled").click(function(event){
    log(null,"Coming soon⁢…");
    // log(null,choose(4,monster_options).join(', '));
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
                    "Quest": "Promos"
                  },
                  "Stalker": {
                    "Quest": "Promos"
                  },
                  "The Yellow Knight": {
                    "Quest": "Promos"
                  },
                  "Edlin": {
                    "Quest": "Bandits of Black Rock"
                  },
                  "Gorlandor": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Hawkswood": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Pylorian": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Scathian": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Silverhelm": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Stormhand": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Avania": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Brimstone": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Ehrlingal": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Felin": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Gendarme": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Sephilest": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Bahran": {
                    "Quest": "Risen from the Mire"
                  },
                  "Darameric": {
                    "Quest": "Risen from the Mire"
                  },
                  "Linsha": {
                    "Quest": "Risen from the Mire"
                  },
                  "Markennan": {
                    "Quest": "Risen from the Mire"
                  },
                  "Nimblefingers": {
                    "Quest": "Risen from the Mire"
                  },
                  "Regalen": {
                    "Quest": "Risen from the Mire"
                  },
                  "Darkrend": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Grimwolf": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Honormain": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Jadress": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Moonblades": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Stormskull": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Aird": {
                    "Quest": "Ripples in Time"
                  },
                  "Arcanian": {
                    "Quest": "Ripples in Time"
                  },
                  "Dunardic": {
                    "Quest": "Ripples in Time"
                  },
                  "Regian": {
                    "Quest": "Ripples in Time"
                  },
                  "Terakian": {
                    "Quest": "Ripples in Time"
                  },
                  "Veris": {
                    "Quest": "Ripples in Time"
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
                    "Quest": "Bandits of Black Rock"
                  },
                  "Kobold Skirmishers": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Goblin Grunts": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Hobgoblin Brutes": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Spider Terrors": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Ancient Adventurers": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Goblin King's Guard": {
                    "Quest": "A Mirror in the Dark"
                  },
                  "Twisted Creatures": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Woodland Sprites": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Corrupted Elves": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Foundational Keepers": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Corrupted Centaurs": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Treefolk": {
                    "Quest": "Total Eclipse of the Sun"
                  },
                  "Ensnaring Vines": {
                    "Quest": "Risen from the Mire"
                  },
                  "Bog Zombies": {
                    "Quest": "Risen from the Mire"
                  },
                  "Chaos Lizards": {
                    "Quest": "Risen from the Mire"
                  },
                  "Moor Skeletons": {
                    "Quest": "Risen from the Mire"
                  },
                  "Marsh Trolls": {
                    "Quest": "Risen from the Mire"
                  },
                  "Swamp Spirits": {
                    "Quest": "Risen from the Mire"
                  },
                  "Air Servitors": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Water Servitors": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Earth Servitors": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Fire Servitors": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Divine Founders": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Abyssal Founders": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Doomknights": {
                    "Quest": "Ripples in Time"
                  },
                  "Gnoll Raiders": {
                    "Quest": "Ripples in Time"
                  },
                  "Minions of Chaos": {
                    "Quest": "Ripples in Time"
                  },
                  "Torments": {
                    "Quest": "Ripples in Time"
                  },
                  "Ancient Wyrms": {
                    "Quest": "Ripples in Time"
                  },
                  "Ancient Protectors": {
                    "Quest": "Ripples in Time"
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
                    "Special": {
                      "Unless": {
                        "Rogue": 1
                      },
                      "Penalty": {
                        "Card": {
                          "Choose": 1
                        },
                        "Battle": {
                          "Health": "Special"
                        }
                      },
                      "Text": "Unless you have a Rogue, discard 1 card from your deck. +[Health] = the card's [Cost]"
                    }
                  },
                  "Alchemy Chamber": {
                    "Quest": "Risen from the Mire",
                    "Level": 1,
                    "Light": 0,
                    "Battle": {
                      "Health": "Special"
                    },
                    "Special": {
                      "Unless": {
                        "Magic": 1
                      },
                      "Penalty": {
                        "Battle": {
                          "Health": 1
                        }
                      }
                    }
                  },
                  "The Servant's Tombs": {
                    "Quest": "Risen from the Mire",
                    "Level": 1,
                    "Light": 0,
                    "Battle": {
                      "Armor": "Special"
                    },
                    "Special": {
                      "Unless": {
                        "Light": 1
                      },
                      "Penalty": {
                        "Battle": {
                          "Health": 2
                        }
                      }
                    }
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
                    "Special": {
                      "Unless": {
                        "Light": 2
                      },
                      "Penalty": {
                        "Battle": {
                          "Armor": 3
                        }
                      }
                    },
                    "Reward": {
                      "Iron Rations": 1
                    }
                  },
                  "Blood Altar Room": {
                    "Quest": "Risen from the Mire",
                    "Level": 3,
                    "Light": 2,
                    "Alert": true,
                    "Special": {
                      "Cost": {
                        "Wound": 1
                      },
                      "Light": -1,
                      "Text": "You may take 1 or more [Wound] to reduce this room's [Light] by 1 for each [Wound] taken."
                    },
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
                    "Special": {
                      "Text": "Roll 2d6. +[Health] = the lower value rolled, or the total value if you rolled doubles."
                    },
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
                    "Special": {
                      "Text": "Refill this room from the other [I] room. Then, refill that room from the Monster deck."
                    },
                    "Reward": {
                      "Iron Rations": 1
                    }
                  },
                  "Earth Temple": {
                    "Quest": "At the Foundations of the World",
                    "Level": 2,
                    "Light": 1,
                    "Special": {
                      "Requires": {
                        "Text": "If your total Attack ([Physical] + [Magic]) exceeds this Monster's [Health] by 3 or more, you have +1 HP."
                      },
                      "Reward": {
                        "HP": 1
                      }
                    }
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
                    "Special": {
                      "Cost": {
                        "Return": 0
                      },
                      "XP": "Special",
                      "Text": "Gain [XP] equal to your total [Light]. At the end of the turn, place your Champion in the 0 room."
                    }
                  },
                  "Celestial Temple": {
                    "Quest": "At the Foundations of the World"
                  },
                  "Gate Cavern": {
                    "Quest": "Ripples in Time"
                  },
                  "Dangerous Passageway": {
                    "Quest": "Ripples in Time"
                  },
                  "Fire Chasm": {
                    "Quest": "Ripples in Time"
                  }
                }
              };
             }