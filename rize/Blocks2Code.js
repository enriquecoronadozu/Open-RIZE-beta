// Code Generators of main behavior blocks of RIZE

var rizeBlocks = {


  do_action_robot: function (value_input, value_robots) {
    let json_action = bt_blocks.action(value_input, value_robots)
    return JSON.stringify(json_action) + "#..#"
  },


  do_action: function (value_input) {
    let json_action = bt_blocks.action(value_input, rize_robot)
    return JSON.stringify(json_action) + "#..#"
  },

  codeToList: function (code) {
    //console.log(code)
    let branchlist = code.split("#..#");
    let json_list = [];
    //console.log(branchlist)
    for (index = 0; index < branchlist.length - 1; ++index) {
      try {
        json_list.push(JSON.parse(branchlist[index]))
      }
      catch (e) {
        json_list.push(branchlist[index])
      }
    }

    return json_list
  },

  module: function (text_behavior_name, statements_behavior, dropdown_mode) {

    text_behavior_name = module_name
    let actions = rizeBlocks.codeToList(statements_behavior);
    if (dropdown_mode == "sequence") {
      let module = bt_blocks.sequence(actions)
      return '{"name":"module_' + text_behavior_name + '", "data":' + JSON.stringify(module) + "}" + "#...#";
    }
    else {
      let module = bt_blocks.random_selector(actions)
      return '{"name":"module_' + text_behavior_name + '", "data":' + JSON.stringify(module) + "}" + "#...#";
    }
  },

  module_selector: function (statements_behavior) {

    let actions = rizeBlocks.codeToList(statements_behavior);
    let module = bt_blocks.selector(actions)
    return JSON.stringify(module) + "#..#";

  },


  do_module: function (text_name) {
    //let code =  JSON.stringify(main_program["module_"+text_name]()) + "#..#";
    var string = "module_" + text_name
    let code = "**main_program['" + string + "']()**" + "#..#";
    return code;
  },


  build_conditions(value, keep = true) {
    try {
      console.log(value)
      var conditions = JSON.parse(value);
      console.log(conditions)

      if ("node" in conditions) {
        var childrens = conditions.children;
        console.log(childrens)
        var new_childrens = [];
        if (Array.isArray(childrens)) {
          childrens.forEach(element => {
            if (keep) {
              element["options"] = { "remember": 3, "keep": false };
              var cond = bt_blocks.condition(element);
              new_childrens.push(cond);
            }
            else {
              var cond = bt_blocks.condition(element);
              new_childrens.push(cond);
            }
          });
        }

        conditions.children = new_childrens;
        return conditions;

      }
      else {

        var start_condition = "";
        var list_conditions = [];

        if (Array.isArray(conditions)) {
          conditions.forEach(element => {
            if (keep) {
              element["options"] = { "remember": 3, "keep": false };
              var cond = bt_blocks.condition(element);
              list_conditions.push(cond);
            }
            else {
              var cond = bt_blocks.condition(element);
              list_conditions.push(cond);
            }
          });
          start_condition = bt_blocks.sequence(list_conditions);
        }
        else {
          if (keep) {
            conditions["options"] = { "remember": 3, "keep": false };
            start_condition = bt_blocks.condition(conditions);
          }
          else {
            start_condition = bt_blocks.condition(conditions);
          }
        }

        return start_condition;

      }

    } catch (error) {

      return "";
    }

  },


  check_perception(value_option1, statements_seq2) {
    var start_condition = this.build_conditions(value_option1);
    let lista = rizeBlocks.codeToList(statements_seq2);
    let init_bt = bt_blocks.sequence(lista)
    let bt = bt_blocks.sequence([start_condition, init_bt])
    return JSON.stringify(bt) + "#..#";
  },


  reaction: function (text_name_reaction, conditions, statements_behavior_code, text_utility) {
    text_name_reaction = module_name
    console.log(conditions)
    console.log(JSON.parse(conditions))
    var start_condition = this.build_conditions(conditions, false);
    let lista = rizeBlocks.codeToList(statements_behavior_code);
    let bt = bt_blocks.sequence(lista)
    let utility = 0
    if (text_utility == "high") {
      utility = 3
    }
    else if (text_utility == "normal") {
      utility = 2
    }
    else {
      utility = 1
    }
    let reaction = bt_blocks.reaction(text_name_reaction, start_condition, bt, utility) //Last is the utility
    return '{"name":"reaction_' + text_name_reaction + '", "data":' + JSON.stringify(reaction) + "}" + "#...#";
  },


  do_behavior: function (text_behavior) {
    var string = "behavior_" + text_behavior
    let code = "**main_program['" + string + "']()**" + "#..#";
    return code;
  },

  logic_all: function (value_input) {
    var json_conditions = []
    var value_json = JSON.parse(value_input)

    value_json.forEach(element => {
      json_conditions.push(bt_blocks.condition(element))

    });

    var seq = bt_blocks.sequence(json_conditions)
    console.log(seq)
    return JSON.stringify(seq)
  },

  // Define the JSON value of a goal
  goal: function (text_goal_name, value_activated, statements_behavior, value_canceled, text_utility, delay) {

    // Set name
    text_goal_name = module_name
    // Set conditions
    var start_condition = this.build_conditions(value_activated, false);
    var stop_condition = this.build_conditions(value_canceled, false);
    // Set Behaviors
    let lista = rizeBlocks.codeToList(statements_behavior);
    let bt = bt_blocks.sequence(lista)
    // Set priority
    let utility = 0
    if (text_utility == "high") {
      utility = 3
    }
    else if (text_utility == "normal") {
      utility = 2
    }
    else {
      utility = 1
    }
    // Get JSON
    let goal = bt_blocks.goal(text_goal_name, start_condition, stop_condition, bt, {}, {}, utility, {}, delay)
    return '{"name":"goal_' + text_goal_name + '", "data":' + JSON.stringify(goal) + "}" + "#...#";
  },
}


