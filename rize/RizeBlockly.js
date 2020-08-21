// *************** Functions used to manage Google Blockly and programming environment ************************


// Main project variables  ----------- Do not change
var rize_robot = "Pepper"
var current_type = ""
var block_name = ""
var list_robots = []  // List of robots from RIZE Robots
var items_robots = [] // List of robots from RIZE Robots
var avaliable_primitives = [] // It have all the info and options of primitives for form generation
var module_name = "" // Very important variable for code generation
var current_project_defined = false; // Used to see if some project is defined

// Robot configuration
var json_robot = {}
var robot_ip = ""
var robot_port = "9559"

// BT Global variables 
var runModuleTimer = "";
var btRun = {};
var input_behaviors = { "options": [["option", "OPTIONNAME"]] }
var reactions_list_paths = []
var goals_list_paths = []
var reactions_bt_list = []
var goals_bt_list = []
var reactions_bt_json = {}
var goals_bt_json = {}
var active_reactions = []
var active_goals = []
var cancel_goals = []
var return_bt = {}
var idle_behavior = {}
var current_reaction = {}
var current_goal = {}

// Save list and name of avaliable goals and reactions
var list_goals = [];
var names_goals = [];
var list_reactions = [];
var names_reactions = [];

// Where Javascript functions will be saved to build the program
var main_program = ""

// Variables used for Google Blockly
var module_name = ""
var project_type = ""
var current_primitive = ""

// Images 
var configuration_image = "images/edit.png"
var play_edit = "images/edit.png"
var play_image = "images/play.png"

// Robots 
// Not used
var input_robots = { "options": [["pepper", "pepper"]] }

// -- Blockly variables -- 
var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');
var WORKSPACE = Blockly.inject('blocklyDiv', options);
WORKSPACE.addChangeListener(blockEvent);

// -- Project --

var current_project_defined = false
var project_name = ""
var temp_project_name = ""
var current_module = "blocks"
var list_projects = []
var json_list = {}


// Enable to adapt blockly space to the screen and windows size
var onResizeBlockly = function (e) {
  // Get absolute coordinates and dimensions of blocklyArea.
  var element = blocklyArea;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);

  // Position blocklyDiv over blocklyArea.
  blocklyDiv.style.left = x + 'px';
  blocklyDiv.style.top = 120 + 'px';
  blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
  let scream_h = window.innerHeight - 200
  if (scream_h < 200) {
    scream_h = 200
  }
  blocklyDiv.style.height = scream_h + 'px';
  console.log()
};


// ================================= Events ========================================


// Resize  blockly area in base the initial windows size and if this changes
document.getElementById("blocklyArea").style.marginRight = "0px"
onResizeBlockly();
Blockly.svgResize(WORKSPACE);

window.addEventListener("resize", function () {
  onResizeBlockly();
  Blockly.svgResize(WORKSPACE);
});

function blockEvent(masterEvent) {
  AppVue.blockEvent(masterEvent)
}


// Enable user to select a moudule using a form interface
var edit_module = function () {
  let words = JSON.parse(JSON.stringify(AppVue.rizeModules))
  let list_modules = [];
  words.forEach(function (element) {
    if (element["name"] === AppVue.block_name) {
      console.log(element["name"] + " not added")
    }
    else {
      console.log()
      list_modules.push(element["name"])
    }
  });
  AppVue.items_modules = list_modules;
  console.log(AppVue.items_modules)
  AppVue.dialog_modules = true;

}


// Enable user to select a pattern using a form interface
var edit_pattern = function () {

  let words = JSON.parse(JSON.stringify(AppVue.rizePatterns))
  let list_patterns = [];
  words.forEach(function (element) {
    if (element["name"] === AppVue.block_name) {
      console.log(element["name"] + " not added")
    }
    else {
      console.log()
      list_patterns.push(element["name"])
    }
  });
  AppVue.items_patterns = list_patterns;
  console.log(AppVue.items_patterns)
  AppVue.dialog_patterns = true;

}

// Used for debbug/execute an action
var play_event = function () {
  // Delete all dont needed code
  let next_blocks = block_selected.getNextBlock();
  let full_code_block = Blockly.Python.blockToCode(block_selected);
  let code = "";
  try {
    code_to_delete = Blockly.Python.blockToCode(next_blocks);
    code = full_code_block.replace(code_to_delete, '')
  }
  catch (err) {
    console.log("block is alone")
  }
  // See the code in the console (for example the Chorme console)
  json_list = code.split("#..#");
  var action = json_list[0]
  console.log("Play event")
  let json_val = JSON.parse(action)
  console.log(json_val)
  onRunAction(json_val)

}

// Used to set parameters of primitives
var edit_primitive = function () {

  try {
    AppVue.model_options = {} // Reset options
    AppVue.model_mainInput = block_selected.getFieldValue("inp_1") // Get input one
    var options = block_selected.getFieldValue("inp_2"); // Get input two
    var options2fill = JSON.parse(options) // Convert option 2 two JSON
    AppVue.model_options = options2fill // Fill form
  }
  catch
  {
    var primitive_default_values = JSON.parse(JSON.stringify(AppVue.current_primitive.options))
    console.log(primitive_default_values)
    for (var key_e in primitive_default_values) {

      if (primitive_default_values[key_e] === "bool") { primitive_default_values[key_e] = false }
      if (primitive_default_values[key_e] === "number") { primitive_default_values[key_e] = 0 }
      if (primitive_default_values[key_e] === "int") { primitive_default_values[key_e] = 0 }
      if (primitive_default_values[key_e] === "percentage") { primitive_default_values[key_e] = 50 }
      if (primitive_default_values[key_e] === "volume") { primitive_default_values[key_e] = 50 }
      if (primitive_default_values[key_e] === "degrees") { primitive_default_values[key_e] = 1 }
      if (primitive_default_values[key_e] === "meters") { primitive_default_values[key_e] = 0.1 }
      if (primitive_default_values[key_e] === "hours") { primitive_default_values[key_e] = 12 }
      if (primitive_default_values[key_e] === "seconds") { primitive_default_values[key_e] = 5 }
      AppVue.model_options = primitive_default_values
    }
    AppVue.model_options
    console.log(block_selected.getFieldValue("inp_1"))
    console.log(block_selected.getFieldValue("inp_2"))
  }
  // Open dialog
  AppVue.dialog_primitives = true;
}

//  of functions used for manage Google Blockly
var rizeBlockly = {

  // ----------- Set current block_name when created in WOKKSPACE -------------------
  onCreate: function (json) {
    block_selected = WORKSPACE.getBlockById(json["blockId"]) //  Select block json from id
    let type_selected = block_selected.type
    if (type_selected == "reaction" || type_selected == "goal" || type_selected == "goal_advanced" || type_selected == "module" || type_selected == "behavior") {
      block_selected.setFieldValue(AppVue.block_name, "module_name")
    }
  },

  // ---------------------- Set default options --------------------------
  formatOptions: function (options_dic) {
    if (options_dic == "edit") { options_dic = "{}" }
    if (options_dic == "") { options_dic = "{}" }
    return options_dic
  },

  // ------------------------onXML2Workspace --------------------------
  // Description: Clear the workspace and add the blocks from an XML file
  onXML2Workspace: function (path) {

    $.ajax({
      'url': path,
      'dataType': 'text',
      'cache': false,
      'success': function (xml) {
        xml = Blockly.Xml.textToDom(xml);
        WORKSPACE.clear();
        Blockly.Xml.domToWorkspace(xml, WORKSPACE);
        WORKSPACE.clearUndo();
        WORKSPACE.undo(false);
        WORKSPACE.undo(true);
      },
      'error': function (XMLHttpRequest, textStatus, errorThrown) {
        if (project_type == "reaction") {
          Blockly.Xml.domToWorkspace(xml_reaction, WORKSPACE);
        }
      }
    });
  },


  // ------------------------onBuildGoals --------------------------
  // Build BTs of Goals

  onBuildGoals: function () {

    let source_code = ""
    var source = Blockly.Python.workspaceToCode(WORKSPACE);
    var json_list = source.split("#...#")
    json_list.forEach(function (element) {
      try {
        json_element = JSON.parse(element)
        string_data = JSON.stringify(json_element["data"], null, 4)
        source_code = source_code + json_element["name"] + " : " + "function() { return " + string_data + "}, \n";
        w_modules.forEach(function (values) {
          let string_val = '"' + values + '"';
          let string_val_ident = '"  ' + values + '"';
          source_code = source_code.replace(string_val_ident, values);
          source_code = source_code.replace(string_val, values);
        });
      }
      catch (err) {
        console.log("error building goal")
      }
    });
    source_code = "var " + project_name + " = " + "{" + source_code + "}"
    source_goals = source_code;
    return source_code;
  },

  // ------------------------onBuildReactions --------------------------
  // Build BTs of Reactions
  onBuildReactions: function () {

    let source_code = ""
    var source = Blockly.Python.workspaceToCode(WORKSPACE_reactions);
    var json_list = source.split("#...#")

    json_list.forEach(function (element) {
      try {
        json_element = JSON.parse(element)
        string_data = JSON.stringify(json_element["data"], null, 4)
        source_code = source_code + json_element["name"] + " : " + "function() { return " + string_data + "}, \n"
      }
      catch (err) {
        console.log("error building reaction")
      }
    });
    source_code = "var " + project_name + " = " + "{" + source_code + "}";
    source_reactions = source_code;
    return source_code;
  },

  // ------------------------ onwWorkspacToJavascriptFunctions  --------------------------
  // Build JS files
  onwWorkspacToJavascriptFunctions: function (workspace) {
    // Save goals
    let source_code = "";
    let source = Blockly.Python.workspaceToCode(workspace);
    var json_list = source.split("#...#");

    json_list.forEach(function (element) {
      if (element == "") {
        console.log("No elements")
      }
      else {
        json_element = JSON.parse(element)
        string_data = JSON.stringify(json_element["data"], null, 4)
        source_code = source_code + json_element["name"] + " : " + "function() { return " + string_data + "}, \n"
      }
    });
    return source_code
  },



  // --------------------- Replace all ocurrences of a string  ------------------------

  escapeRegExp: function (str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  },

  replaceAll: function (str, find, replace) {
    return str.replace(new RegExp(rizeBlockly.escapeRegExp(find), 'g'), replace);
  },

  realoadCache: function (str) {
    location.reload(true)
  },

  //  ----------------- Interface commands -------------------------

  onStopBehaviorsRobot: function () {

    let robot_type = document.getElementById("type_robot").value;
    let robot_name = document.getElementById("name_robot").value;
    primitives = JSON.stringify({
      "primitive": "stop_behavior",
      "input": "none",
      "options": {}
    })
    let action = nepki.action(primitives, robot_name)
    console.log(action)
    rizeBlockly.onRunActionCode(JSON.stringify(action))
  },

  onStopAutonomusRobot: function () {
    let robot_type = document.getElementById("type_robot").value;
    let robot_name = document.getElementById("name_robot").value;
    primitives = JSON.stringify({
      "primitive": "stop_autonomus",
      "input": "none",
      "options": {}
    })
    let action = nepki.action(primitives, robot_name)
    rizeBlockly.onRunActionCode(JSON.stringify(action))
  },

  onWakeUpRobot: function () {
    let robot_type = document.getElementById("type_robot").value;
    let robot_name = document.getElementById("name_robot").value;
    primitives = JSON.stringify({
      "primitive": "wake_up",
      "input": "none",
      "options": {}
    })
    let action = nepki.action(primitives, robot_name)
    rizeBlockly.onRunActionCode(JSON.stringify(action))
  },

  onRestRobot: function () {
    let robot_type = document.getElementById("type_robot").value;
    let robot_name = document.getElementById("name_robot").value;
    primitives = JSON.stringify({
      "primitive": "rest",
      "input": "none",
      "options": {}
    })
    let action = nepki.action(primitives, robot_name)
    rizeBlockly.onRunActionCode(JSON.stringify(action))
  },
}






