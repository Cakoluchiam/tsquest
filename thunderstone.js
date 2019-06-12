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

  var exclude = {
    Quest: {
      "A Mirror in the Dark": false,
      "Risen from the Mire": false,
      "At the Foundations of the World": false,
      "Total Eclipse of the Sun": false,
      "Ripple in Time": false, 
      "What Lies Beneath": false, 
      "Frozen in Time": false,
      "Promos": false, 
      "Bandits of Black Rock": false
    },
    Types: {
      //
    },
    Keywords: {
      //
    }
  };

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

  $.getJSON("enums.json",function(data){
    cs = data;
    log(null,"Enums loaded:",cs);
  }).fail(function(){
    log(null,"Could not load enums from file.",cs);
    throw new Error("Enum database missing or inaccessible.");
  });

  $.getJSON("sets.json",function(data){
    sets = data;
    log(null,"Sets loaded:",sets);
  }).fail(function() {
    log(null,"Could not load sets from file.",sets);
    throw new Error("Set database missing or inaccessible.");
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
    log(null,"Could not load cards from file.",groups);
    throw new Error("Card database missing or inaccessible.");
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
    var runtime = Date.now();

    while(choices.Cleric === choices.Fighter ||
          choices.Cleric === choices.Rogue ||
          choices.Cleric === choices.Wizard ||
          choices.Fighter === choices.Rogue ||
          choices.Fighter === choices.Wizard ||
          choices.Rogue === choices.Wizard) {
      if(Date.now() - runtime > 1000) {
        log(null,"Runtime exceeded for rerolling duplicate heroes. Select different filters if you want different choices.");
        break;
      }
      classes = Object.keys(choices);

      class1 = classes.splice(Math.floor(Math.random()*4),1);
      class2 = classes.splice(Math.floor(Math.random()*3),1);

      if(choices[class1] === choices[class2]) {
        log(null,"Chose "+choices[class1]+" for both "+class1+" and "+class2+".");
        if(Object.keys(options.Heroes[class1]).length < 2) {
          if(Object.keys(options.Heroes[class2]).length < 2) {
            throw new Error("Cannot choose different heroes for "+class1+" and "+class2+"; "+choices[class1]+" is the only available hero of both classes.");
          } else {
            log(null,"Rerolling "+class2);
            choices[class2] = choose(1,options.Heroes[class2])[0];
          }
        } else {
          log(null,"Rerolling "+class1);
          choices[class1] = choose(1,options.Heroes[class1])[0];
        }
      }
    }

    log("#hero_choices",'<ul><li>'+
      [choices.Cleric, choices.Fighter, choices.Rogue, choices.Wizard].map(function(hero) {
        var card = getCard(hero,"Heroes");
      return hero + ' (' + card.Classes.join(', ') + ')';
    }).join('</li><li>')+'</li></ul>');
  });

  $("#choose_heroes_random").click(function(event){
    log("#hero_choices",'<ul><li>'+choose(4,options.Heroes.All).map(function(hero) {
      var card = getCard(hero,"Heroes");
      return hero + ' (' + card.Classes.join(', ') + ')';
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

  // `from` is an object for selecting cards by name
  // based on whether the value `from[card]` is true.
  function choose(num, from){
    choices = [];
    from = Object.keys(from).filter(function(card) {
      return from[card];
    });

    while(choices.length < num && from.length > 0) {
      choices.push(from.splice(Math.floor(Math.random()*from.length),1)[0]);
    }
    while(choices.length < num) {
      choices.push("\&lt;not enough choices\&gt;");
    }
    return choices;
  }

  function getCard(thing, type) {
    if(thing === "\&lt;not enough choices\&gt;") {
      return {
        Level:"N/A",
        Classes:["N/A"]
      };
    } else if(type === "Marketplace") {
      return groups.Items[thing] ||
             groups.Spells[thing] ||
             groups.Weapons[thing];
    } else {
      return groups[type][thing];
    }
  }

  function toggle(type,on) {
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
    } else if(type === "Marketplace") {
      return function(thing) {
        options.Marketplace.All[thing] = on;
        var type = getCard(thing, "Marketplace").Category;
        options.Marketplace[type][thing] = on;
      };
    }else if(type === "Guardians") {
      return function(thing) {
        options[type].All[thing] = on;
      };
    } else if(["Treasures"].indexOf(type) !== -1) {
      return function() {};
    } else {
      throw new Error("Invalid type: "+type);
      // return
    }
  }

  function checkExclude(card) {
    return Object.keys(card).reduce(function(acc,group) {
      if(exclude[group] === undefined) {
        return acc;
      }

      var filtered = false;

      if(Array.isArray(card[group])) {
        card[group].forEach(function(attr) {
          filtered = filtered || exclude[group][attr];
        });
      } else if(typeof(card[group]) === "object") {
        Object.keys(card[group]).forEach(function(attr){
          filtered = filtered || (exclude[group][attr] && card[group][attr]);
        });
      } else {
        filtered = exclude[group][card[group]];
      }

      return acc || Boolean(filtered);
    },false);
  }

  $(".quest").mSwitch({
    onRender:function(elem){
      // allows to apply a first state to the rendering of the CHECKBOX 
    },
    onRendered:function(elem){
      // exec your logic when the render is complete
    },
    onTurnOn:function(elem){
      // exec your logic when the switch is activated
      var quest = $(elem).attr("name");
      exclude.Quest[quest] = false;
      var affectedCards = {};
      Object.keys(options).forEach(function(groupName) {
        var group = options[groupName].All;
        var toggleFunc = toggle(groupName,true);
        affectedCards[groupName] = [];
        Object.keys(group).forEach(function(cardName) {
          if(group[cardName] === true) {
            return;
          }
          var card = getCard(cardName,groupName);
          if(card.Quest === quest && !checkExclude(card)) {
            affectedCards[groupName].push(cardName);
            toggleFunc(cardName);
          }
        });
      });
      log(null,"Including cards:",affectedCards);
      var remaining = {
        Heroes:Object.keys(options.Heroes.All).filter(function(e){
          return options.Heroes.All[e];
        }),
        Items:Object.keys(options.Marketplace.Items).filter(function(e){
          return options.Marketplace.Items[e];
        }),
        Spells:Object.keys(options.Marketplace.Spells).filter(function(e){
          return options.Marketplace.Spells[e];
        }),
        Weapons:Object.keys(options.Marketplace.Weapons).filter(function(e){
          return options.Marketplace.Weapons[e];
        }),
        Monsters:Object.keys(options.Monsters.All).filter(function(e){
          return options.Monsters.All[e];
        }),
        Guardians:Object.keys(options.Guardians.All).filter(function(e){
          return options.Guardians.All[e];
        }),
        Rooms:Object.keys(options["Dungeon Rooms"].All).filter(function(e){
          return options["Dungeon Rooms"].All[e];
        })
      };
      log(null,"Available cards:",remaining);
    },
    onTurnOff:function(elem){
      // exec your logic when the switch is deactivated
      var quest = $(elem).attr("name");
      exclude.Quest[quest] = true;
      var affectedCards = {};
      Object.keys(options).forEach(function(groupName) {
        var group = options[groupName].All;
        var toggleFunc = toggle(groupName,false);
        affectedCards[groupName] = [];
        Object.keys(group).forEach(function(cardName) {
          if(group[cardName] === false) {
            return;
          }
          var card = getCard(cardName,groupName);
          if(group[cardName] && (card.Quest === quest)) {
            affectedCards[groupName].push(cardName);
            toggleFunc(cardName);
          }
        });
      });
      log(null,"Disabling cards:",affectedCards);
      var remaining = {
        Heroes:Object.keys(options.Heroes.All).filter(function(e){
          return options.Heroes.All[e];
        }),
        Items:Object.keys(options.Marketplace.Items).filter(function(e){
          return options.Marketplace.Items[e];
        }),
        Spells:Object.keys(options.Marketplace.Spells).filter(function(e){
          return options.Marketplace.Spells[e];
        }),
        Weapons:Object.keys(options.Marketplace.Weapons).filter(function(e){
          return options.Marketplace.Weapons[e];
        }),
        Monsters:Object.keys(options.Monsters.All).filter(function(e){
          return options.Monsters.All[e];
        }),
        Guardians:Object.keys(options.Guardians.All).filter(function(e){
          return options.Guardians.All[e];
        }),
        Rooms:Object.keys(options["Dungeon Rooms"].All).filter(function(e){
          return options["Dungeon Rooms"].All[e];
        })
      };
      log(null,"Available cards:",remaining);
    }
  });
    
});