
Vue.use(rizeBlockly)
var AppVue = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  components:
  {
    'rize-foot': RizeFoot,
    'rize-menu': RizeMenu,
    'rize-dialog-send': DialogSend,
    'rize-dialog-posture': DialogPosture,
    'rize-welcome': WelcomeSocial,
    'blocks-foot': BlocksFoot
  },
  data() {

    return {
      dialog_send: false,

      dialog_posture: false,
      dialog_start: false,
      someChildProperty: true,
      menu_h: 400,
      model_options: {},
      Reactions: [],
      Goals: [],
      Modules: [],
      Patterns: [],
      items_language: ["English", "Japanese", "French"],     // Languages
      chips_language: "English",

    }
  },

  created() {

    window.addEventListener('resize', this.handleResize)
    this.handleResize();
    avaliable_primitives = rizeObject.onLoadPrimitives()

    // Blockly --------------------------------------------
    list_robots = rizeObject.onLoadRobots()
    //Clear global variable list_robots, used in Blockly
    input_robots["options"] = []
    items_robots = []
    // Update global variable list_robots
    list_robots.forEach(element => {
      input_robots["options"].push([element["name"], element["name"]])
      items_robots.push(element["name"])
    });
    // Blockly --------------------------------------------
    this.onStartRobot()  // DELETE FOR FULL VERSION
  },



  methods: {

    onStartRobot: function () {
      list_robots.forEach(element => {
        let temp_name = element["name"]
        if (rize_robot === temp_name) {
          type_robot = element["type"]
          json_robot = element
        }
      });
      console.log(json_robot)
    },



    onSetPrimitive: function () {
      // AppVue.current_primitive have info about current primitive
      console.log(this.current_primitive)
      block_selected.setFieldValue(this.model_mainInput, "inp_1");
      try {
        block_selected.setFieldValue(JSON.stringify(this.model_options), "inp_2");
      } catch (error) {

      }

      this.dialog_primitives = false

      try {
        // rosbridge
        if (using_ros === true) {
          var str = new ROSLIB.Message({
            data: JSON.stringify({ "action": "edit_primitive", "input": this.current_primitive.primitive})
          });
          publisher_rize.publish(str)
        }
      } catch (error) {

      }

    },

    onClose: function () {
      console.log(this.current_primitive)
      AppVue.dialog_primitives = false
    },

    handleResize(event) {
      this.menu_h = window.innerHeight;
    },


    blockEvent(masterEvent) {
      // To select the block properties we can use json["newValue"] (for ui in element== "selected") or json["blockId"] (for create and move)
      // Convert event to JSON.  This could then be transmitted across the net.
      var json = masterEvent.toJson();
      console.log(json);
      console.log(masterEvent.type)
      console.log(masterEvent.element)




      if (masterEvent.type == "create") {
        rizeBlockly.onCreate(json)
      }
      if (masterEvent.type == "move" || masterEvent.type == "delete") {
        console.log("saving")
        this.onSaveVersion(masterEvent.type)

      }

      if (masterEvent.type == "ui") {

        if (masterEvent.element == "selected") {
          if (json["newValue"] != null) {
            block_selected = WORKSPACE.getBlockById(json["newValue"]) //  Select block json from id
            //console.log(block_selected.type);
            if (block_selected.type == "do_module" || block_selected.type == "do_behavior" || block_selected.type == "do_action" || block_selected.type == "reaction" || block_selected.type == "goal" || block_selected.type == "module" || block_selected.type == "two_options_question_wait_answer") {
              this.current_primitive = { "primitive": "nothing", "options": {} }
            }
            else {
              try {
                this.current_primitive = avaliable_primitives[block_selected.type]
                if (this.current_primitive.input === "dropdown") {
                  if (block_selected.type === "animation") {
                    var animation_list = rizeObject.onReadJSONFile(rizeObject.directoryAnimations + "/list_" + rize_robot + ".json");
                    AppVue.items_dropdown = animation_list["values"]
                  }
                  else {
                    AppVue.items_dropdown = this.current_primitive.input_options
                  }
                }
                // console.log(this.current_primitive)

              } catch (error) {
                // console.log("Error here")
                this.current_primitive = { "primitive": "nothing", "options": {} }
              }
            }
          }
        }
      }
    },


    // Get all javascript function 
    onLoadJSFunctions: function () {

      // Convert main.js to BT JSON specifications
      jquery.getScript(rizeObject.getPathProjects() + "/" + project_name + "/versions/" + this.project.version + "/code.js", function (data, textStatus, jqxhr) {
        //console.log("Saving goals as BT ...")
        list_goals = [];
        names_goals = [];
        list_reactions = [];
        names_reactions = [];
        main_program = window[project_name]
        var value = "module_" + AppVue.project.idle_behavior_name
        try {
          idle_behavior = main_program[value]()

        } catch (error) {

        }
        //console.log(main_program)

        try {
          k = Object.keys(main_program)
          k.forEach(function (element) {
            if (element.includes("goal_")) {
              try {
                list_goals.push(main_program[element]())
                names_goals.push(element)
              }
              catch (err) {
                console.log("Error in block names")
              }
            }
            if (element.includes("reaction_")) {
              try {
                list_reactions.push(main_program[element]())
                names_reactions.push(element)

              }
              catch (err) {
                console.log("Error in block names")
              }
            }
          });


        } catch (error) {
          console.log("RIZE ERROR: code.js have not code")
        }
      });
    },

    // Save current block module status
    onSaveBlock: function () {

      // Transform block program to xml format
      var xml_module = Blockly.Xml.workspaceToDom(WORKSPACE);
      // Transform a xml text in a more redeable xml text
      xml_module = Blockly.Xml.domToPrettyText(xml_module);
      var code = rizeBlockly.onwWorkspacToJavascriptFunctions(WORKSPACE)

      // Keeep functions
      code = rizeBlockly.replaceAll(code, '"**', "")
      code = rizeBlockly.replaceAll(code, '**"', "")
      code = rizeBlockly.replaceAll(code, '"  **', "")

      // Update current code to show
      this.text_code = code;
      // Save mesage to send

      let path = rizeObject.getPathProjects() + "/" + AppVue.project.name + "/versions/" + AppVue.project.version + "/" + AppVue.current_type + "/js/" + AppVue.block_name + ".js"
      rizeObject.onSaveFileSync(path, code)
      path = rizeObject.getPathProjects() + "/" + AppVue.project.name + "/versions/" + AppVue.project.version + "/" + AppVue.current_type + "/xml/" + AppVue.block_name + ".xml"
      rizeObject.onSaveFileSync(path, xml_module)

      this.SaveProject()
      this.onLoadJSFunctions()




    },

    onBuildBTProgram: function () {


      let path_projects = rizeObject.getPathProjects()
      let path_project = path_projects + "/" + this.project.name + "/versions/" + this.project.version
      rizeObject.onCreateFolder(path_project + "/" + "goal/json")
      rizeObject.onCreateFolder(path_project + "/" + "reaction/json")

      var l_goals = names_goals
      var code_goals = list_goals

      var l_reactions = names_reactions
      var code_reactions = list_reactions

      var path = path_projects + "/" + project_name + "/versions/" + this.project.version + "/goal/json"
      for (let index = 0; index < names_goals.length; index++) {
        const element = names_goals[index];
        var path_ = path + "/" + element + ".json"
        //console.log(path_)
        rizeObject.onSaveJSON(path_, code_goals[index])
      }

      var path = path_projects + "/" + project_name + "/versions/" + this.project.version + "/reaction/json"
      for (let index = 0; index < names_reactions.length; index++) {
        const element = names_reactions[index]
        var path_ = path + "/" + element + ".json"
        //console.log(path_)
        rizeObject.onSaveJSON(path_, code_reactions[index])
      }
    },


    // Save project
    onSave() {

      if (current_project_defined === false) {
        this.dialog_new = true
      }
      else {
        project_name = this.project.name
        // Create folders of the project
        rizeObject.onSaveBlockProgram(project_name)
        // Create JS files with functions
        rizeObject.onBuildBlockCodeJS(project_name)


        var config = {
          "words": this.words,
          "robots": this.chips_robots,
          "perception": this.chips_devices,
          "language": this.chips_language,
          "speech_recognition": this.chips_method,
          "volume": 50,
          "blockModules": this.blockModules
        }

        // Save configuration
        rizeObject.onSaveJSON(rizeObject.getPathProjects() + "/" + project_name + "/config.json", config)
        this.dialog_new = false;
        this.dialog_save_wait = true
        // Get javascript function from Js files
        this.onLoadJSFunctions()
      }

    },
  },
})