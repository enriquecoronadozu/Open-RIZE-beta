
Vue.mixin({
  data: function () {
    return {
      drawer: null,
      items_menus: [
        { title: 'Use tablet', icon: 'mdi-tablet-ipad' },
        { title: 'Use joycon', icon: 'mdi-nintendo-switch' },
        { title: 'Use smartphone', icon: 'mdi-cellphone-android' },
        { title: 'Use assistant', icon: 'mdi-google-assistant' }
      ],

      someChildProperty: true,
      robot_name: rize_robot,
      block_name: "",
      rizeReactions: [],
      rizeGoals: [],
      rizeModules: [],
      rizePatterns: [],
      current_type: "",
      current_primitive: {
      },
      tabs_name: ["Home", "Reactions", "Goals", "Modules"],
      model_mainInput: "",
      items_dropdown: [],
      main_dialog: true,
      dialog_primitives: false,

      dialog_modules: false,
      dialog_patterns: false,
      dialog_code: false,
      dialog_robot_ready: false,
      dialog_robot_error: false,
      dialog_connect: false,
      dialog_pepper_start: false,
      alert: true,
      colorM: "info",
      status_robot_dialog: "noconnected",

      model: 'tab-Home',

      text_code: "",
      pause: false,
      project: {
        name: "Pepper",               // Current project name
        selected_project: 'default',
        robot_ip: "127.0.0.1",
        selected_module: '',
        chips_robots: '',
        volume: 50,
        chips_language: "English",
        words: [{ "name": "hello" }],
        sentences: [{ "name": "hello" }],
        idle_behavior_name: "",
        version: "Initial",
        versions: { "Initial": "no_saved" }
      },
      global_versions: {

      },
      current_type: "",
      model_options: {},
      items_modules: [],
      items_patterns: [],
      chips_modules: "",
      chips_patterns: "",
      items_robots: [],
      chips_robots: "",
      selected_version: "",
      selected_day: "",
      dialog_modules_idle: false,
      robot_ip: "",
      robot_port: 9559,
      robot_status: "Robot not connected",
      sheet: false,
      path_block_folder_date: "",
      items_block: [],
      items_days: [],
      temp_xml: "",
      path_block_folder_day: "",
      // Language


    }
  },

  watch: {
    dialog_connect(val) {
      if (!val) return
      setTimeout(() => (this.dialog_connect = false), 10000)
    },
    dialog_pepper_start(val) {
      if (!val) return
      setTimeout(() => (this.dialog_pepper_start = false), 8000)
    },
    dialog_robot_ready(val) {
      if (!val) return
      setTimeout(() => (this.dialog_robot_ready = false), 5000)
    }
  },

  created() {

    this.items_robots = [this.robot_name]
    this.chips_robots = this.robot_name
    this.project.chips_robots = this.robot_name

  },

  methods:
  {

    onSaveVersion(type_saved) {

      if (AppVue.sheet === false) {


        var path_project = rizeObject.directoryProjects + "/" + this.project.name
        var path_folder = path_project + "/versions/" + AppVue.project.version + "/" + AppVue.current_type + "/versions"

        rizeObject.onCreateFolder(path_folder)
        var path_block_folder = path_folder + "/" + AppVue.block_name

        rizeObject.onCreateFolder(path_block_folder)
        var path_block_folder_date = path_folder + "/" + AppVue.block_name
        console.log(path_block_folder_date)
        rizeObject.onCreateFolder(path_block_folder_date)

        var xml_module = Blockly.Xml.workspaceToDom(WORKSPACE);
        let source_code = "";
        let source = Blockly.Python.workspaceToCode(WORKSPACE);
        var json_list = source.split("#...#");


        json_list.forEach(function (element) {
          if (element == "") {
            console.log("No elements")
          }
          else {
            json_element = JSON.parse(element)
            string_data = JSON.stringify(json_element["data"], null, 4)
            source_code = string_data
          }
        });

        // Transform a xml text in a more redeable xml text
        xml_module = Blockly.Xml.domToPrettyText(xml_module);



        var d = new Date();
        var hr = String(d.getHours());
        var min = String(d.getMinutes());
        var sec = d.getSeconds();

        if (min < 10) {
          min = "0" + min;
        }

        if (sec < 10) {
          sec = "0" + sec;
        }

        var date = d.getDate();
        var month = d.getMonth();
        var year = d.getFullYear();

        if (month < 10) {
          month = "0" + month;
        }

        if (date < 10) {
          date = "0" + date;
        }

        var path_files = path_block_folder_date + "/" + year + "_" + month + "_" + date + "_" + hr + "hr" + min + "min" + sec + "sec" + "___" + type_saved + ".xml"

        rizeObject.onSaveFileSync(path_files, xml_module)

        this.path_block_folder_date = path_block_folder_date



        var path_folder = path_project + "/versions/" + AppVue.project.version + "/" + AppVue.current_type + "/bt"
        rizeObject.onCreateFolder(path_folder)
        var path_block_folder = path_folder + "/" + AppVue.block_name
        rizeObject.onCreateFolder(path_block_folder)
        var path_block_folder_date = path_folder + "/" + AppVue.block_name
        console.log(path_block_folder_date)
        rizeObject.onCreateFolder(path_block_folder_date)

        var path_files = path_block_folder_date + "/" + year + "_" + month + "_" + date + "_" + hr + "hr" + min + "min" + sec + "sec" + "___" + type_saved + ".json"
        source_code = rizeBlockly.replaceAll(source_code, '"**', "")
        source_code = rizeBlockly.replaceAll(source_code, '**"', "")
        source_code = rizeBlockly.replaceAll(source_code, '"  **', "")
        console.log(source_code)
        rizeObject.onSaveFileSync(path_files, source_code)



      }
    },


    onCloseBlock: function () {
      try {
        AppVue.dialog_primitives = true
        AppVue.dialog_primitives = false
        AppVue.main_dialog = true
        AppVue.onSaveBlock()
        AppVue.SaveProject()
        AppVue.onLoadJSFunctions()
        AppVue.onBuildBTProgram()

        AppVue.SaveProject()
        AppVue.onLoadJSFunctions()
        AppVue.onBuildBTProgram()

        AppVue.onSaveBlock()
        AppVue.SaveProject()
        AppVue.onLoadJSFunctions()
        AppVue.onBuildBTProgram()

        AppVue.SaveProject()
        AppVue.onLoadJSFunctions()
        AppVue.onBuildBTProgram()

        try {

          // rosbridge
          if (using_ros === true) {
            var str = new ROSLIB.Message({
              data: JSON.stringify({ "action": "save_block", "input": AppVue.block_name })
            });
            publisher_rize.publish(str)
          }
        } catch (error) {

        }
      }
      catch{
        AppVue.main_dialog = true
        console.log("Error saving")
      }

    },


    onBackElement() {

      try {
        var number = this.items_block.indexOf(this.selected_version)
        this.selected_version = this.items_block[number - 1]

        var xml_path = this.path_block_folder_day + "/" + this.selected_version

        console.log(xml_path)
        fetch(xml_path)
          .then(response => response.text())
          .then(data => {
            xml = Blockly.Xml.textToDom(data);
            WORKSPACE.clear();
            Blockly.Xml.domToWorkspace(xml, WORKSPACE);
            WORKSPACE.clearUndo();
            WORKSPACE.undo(false);
            WORKSPACE.undo(true);
          })

      } catch (error) {

        this.selected_version = this.items_block[0]

        var xml_path = this.path_block_folder_day + "/" + this.selected_version

        console.log(xml_path)
        fetch(xml_path)
          .then(response => response.text())
          .then(data => {
            xml = Blockly.Xml.textToDom(data);
            WORKSPACE.clear();
            Blockly.Xml.domToWorkspace(xml, WORKSPACE);
            WORKSPACE.clearUndo();
            WORKSPACE.undo(false);
            WORKSPACE.undo(true);
          })

      }


    },
    onNextElement() {

      try {
        var number = this.items_block.indexOf(this.selected_version)
        this.selected_version = this.items_block[number + 1]

        var xml_path = this.path_block_folder_day + "/" + this.selected_version

        console.log(xml_path)
        fetch(xml_path)
          .then(response => response.text())
          .then(data => {
            xml = Blockly.Xml.textToDom(data);
            WORKSPACE.clear();
            Blockly.Xml.domToWorkspace(xml, WORKSPACE);
            WORKSPACE.clearUndo();
            WORKSPACE.undo(false);
            WORKSPACE.undo(true);
          })

      } catch (error) {

        this.selected_version = this.items_block[this.items_block.length]

        var xml_path = this.path_block_folder_day + "/" + this.selected_version

        console.log(xml_path)
        fetch(xml_path)
          .then(response => response.text())
          .then(data => {
            xml = Blockly.Xml.textToDom(data);
            WORKSPACE.clear();
            Blockly.Xml.domToWorkspace(xml, WORKSPACE);
            WORKSPACE.clearUndo();
            WORKSPACE.undo(false);
            WORKSPACE.undo(true);
          })

      }

    },

    onHistory() {

      console.log("Load history")
      this.onSaveVersion("see_history")

      var path_project = rizeObject.directoryProjects + "/" + this.project.name
      var path_folder = path_project + "/versions/" + AppVue.project.version + "/" + AppVue.current_type + "/versions"
      var path_block_folder = path_folder + "/" + AppVue.block_name

      var days = rizeObject.onGetListFiles(path_block_folder)


      console.log(days)
      this.items_days = days
      this.onSetVersion()


    },

    onSetVersion() {

      var path_project = rizeObject.directoryProjects + "/" + this.project.name
      var path_folder = path_project + "/versions/" + AppVue.project.version + "/" + AppVue.current_type + "/versions"
      this.path_block_folder_day = path_folder + "/" + AppVue.block_name
      var lista = rizeObject.onGetListFiles(this.path_block_folder_day)
      console.log(lista)
      this.items_block = lista
    },

    onResetTemporal() {
      var xml = Blockly.Xml.textToDom(this.temp_xml);
      Blockly.Xml.domToWorkspace(xml, WORKSPACE);
    },

    onHistoryVersion() {

      var xml_path = this.path_block_folder_day + "/" + this.selected_version

      console.log(xml_path)
      fetch(xml_path)
        .then(response => response.text())
        .then(data => {
          xml = Blockly.Xml.textToDom(data);
          WORKSPACE.clear();
          Blockly.Xml.domToWorkspace(xml, WORKSPACE);
          WORKSPACE.clearUndo();
          WORKSPACE.undo(false);
          WORKSPACE.undo(true);
        })

    },

    // Next change
    onUndo: function () {
      WORKSPACE.undo(false);
    },

    // Last change
    onRedo: function () {
      WORKSPACE.undo(true);
    },
    onLast: function () {
      AppVue.main_dialog = true
    },
    onNext: function () {
      AppVue.main_dialog = true
    },

    onSaveBlockMenu: function () {
      AppVue.onSaveVersion("save")
      AppVue.onSaveBlock()
      AppVue.SaveProject()
      AppVue.onLoadJSFunctions()
      AppVue.onBuildBTProgram()

      AppVue.SaveProject()
      AppVue.onLoadJSFunctions()
      AppVue.onBuildBTProgram()
    },


    onSetIdleModule: function () {

      //console.log(this.chips_modules)
      this.rizeModules.forEach(element => {
        if (this.chips_modules === element["name"]) {
          this.project.idle_behavior_name = element["name"]
        }
      });
      this.dialog_modules_idle = false;

    },


    onSetIdle: function () {

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
      //console.log(AppVue.items_modules)
      AppVue.dialog_modules_idle = true;

    },

    onConnectPepper: function () {

      try {
        AppVue.robot_status = "Trying to connect " + rize_robot + " in: (" + AppVue.robot_ip + ") ... "
        this.robot_connected = rize_robot

        console.log(rize_robot)
        if (rize_robot === "NAO" || rize_robot === "Pepper") {
          console.log("Connecting NAO Javascript")
          connectRobot(AppVue.robot_ip)
        }

        //var robot_script = rizeObject.directoryRobots +  "/pepper/pepper.py"

        var robot_script = script_path.join(__dirname, '.', 'python_scripts/' + rize_robot + '_robot.py')

        console.log(__dirname);
        var opsys = process.platform;

        if (developer_mode === false) {
          if (opsys == "darwin") {
            robot_script = script_path.join(__dirname, '..', 'python_scripts/' + rize_robot + '_robot.py')
          } else if (opsys == "win32" || opsys == "win64") {
            robot_script = script_path.join(__dirname, '..', 'python_scripts/' + rize_robot + '_robot.py')
          } else if (opsys == "linux") {
            robot_script = script_path.join(__dirname, '.', 'python_scripts/' + rize_robot + '_robot.py')
          }
        }

        var args = [JSON.stringify(json_robot)];
        args.unshift(robot_script);
        console.log(args)


        robot_process = spawn('python', args);

        if (rizeObject.opsys === "Windows") {
          robot_process = spawn('C:/Python27/python', args);
        }

        this.dialog_settings = false;

        robot_process.stdout.on('data', (data) => {
          console.log("--------ROBOT -----")
          console.log(`stdout: ${data}`);
        });

        robot_process.stderr.on('data', (data) => {
          console.log("--------ROBOT -----")
          AppVue.robot_status = "Error connecting robot"
          console.error(`stderr: ${data}`);
        });

        robot_process.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
        });

      } catch (error) {
        AppVue.robot_status = "Error connecting robot"
      }

    },
    // Load block module (if any) in the interface
    onLoadBlock: function (project_name, name) {
      this.onLoadJSFunctions()
      if (AppVue.model === "tab-Reactions") {
        AppVue.current_type = "reaction"
      }
      if (AppVue.model === "tab-Goals") {
        AppVue.current_type = "goal"
      }
      if (AppVue.model === "tab-Modules") {
        AppVue.current_type = "module"
      }
      if (AppVue.model === "tab-Patterns") {
        AppVue.current_type = "behavior"
      }

      //this.onLoadJSFunctions()
      current_type = AppVue.current_type
      block_name = name
      this.project_name = project_name
      AppVue.block_name = name
      //console.log(AppVue.block_name)

      var path_project = rizeObject.directoryProjects + "/" + this.project.name
      var path_folder = path_project + "/" + AppVue.current_type + "/versions"
      this.path_block_folder_version = path_folder + "/" + AppVue.block_name + "/" + this.project.version

      var path_list = rizeObject.getPathProjects() + "/" + AppVue.project.name + "/" + AppVue.current_type + "/versions/" + AppVue.block_name
      console.log(path_list)

      var lista = rizeObject.onGetListFiles(rizeObject.getPathProjects() + "/" + AppVue.project.name + "/versions/" + this.project.version + "/" + AppVue.current_type + "/versions/" + AppVue.block_name)

      console.log(lista)
      //var xml_path = rizeObject.getPathProjects() + "/" + AppVue.project.name + "/" + AppVue.current_type + "/xml/" + AppVue.block_name + ".xml"

      var xml_path = rizeObject.getPathProjects() + "/" + AppVue.project.name + "/versions/" + this.project.version + "/" + AppVue.current_type + "/versions/" + AppVue.block_name + "/" + lista[lista.length - 1]
      console.log(xml_path)

      console.log(xml_path)
      fetch(xml_path)
        .then(response => response.text())
        .then(data => {
          xml = Blockly.Xml.textToDom(data);
          WORKSPACE.clear();
          Blockly.Xml.domToWorkspace(xml, WORKSPACE);
          WORKSPACE.clearUndo();
          WORKSPACE.undo(false);
          WORKSPACE.undo(true);
        })
    },

    onSetModuleName: function () {

      let input_ = this.chips_modules
      block_selected.setFieldValue(input_, "module_name");
      this.dialog_modules = false;

    },

    onSetPatternName: function () {

      let input_ = this.chips_patterns
      block_selected.setFieldValue(input_, "module_name");
      this.dialog_patterns = false;

    },

    // Load block module (if any) in the interface
    onLoadNewBlock: function (name) {
      module_name = name
      if (AppVue.model === "tab-Reactions") {
        AppVue.current_type = "reaction"
      }
      if (AppVue.model === "tab-Goals") {
        AppVue.current_type = "goal"
      }
      if (AppVue.model === "tab-Modules") {
        AppVue.current_type = "module"
      }
      if (AppVue.model === "tab-Patterns") {
        AppVue.current_type = "behavior"
      }

      AppVue.block_name = name
      console.log(AppVue.block_name)
      var init_xml_path = "init_" + AppVue.current_type + ".xml"
      console.log(init_xml_path)

      fetch(init_xml_path)
        .then(response => response.text())
        .then(data => {
          xml = Blockly.Xml.textToDom(data);
          WORKSPACE.clear();
          Blockly.Xml.domToWorkspace(xml, WORKSPACE);
          WORKSPACE.clearUndo();
          WORKSPACE.undo(false);
          WORKSPACE.undo(true);
        })
    },

    CleanProject() {
      this.project = {
        name: AppVue.project.name,               // Current project name
        selected_project: AppVue.project.name,
        selected_module: '',
        chips_robots: this.robot_name,
        volume: 50,
        chips_language: "English",
        words: [{ "name": "hello" }],
        sentences: [{ "name": "hello" }],
        version: "Initial",
        versions: { "Initial": "NoSaved" },
      },
        this.rizeReactions = []
      this.rizeGoals = []
      this.rizeModules = []
      this.rizePatterns = []
      this.model = "Home"

    },

    onDeleteFilesModule(name, type) {

      let path = rizeObject.getPathProjects() + "/" + project_name

      try {
        rizeObject.onDeleteFile(path + "/" + type + "/xml/" + name + ".xml")
      } catch (error) { }

      try {
        rizeObject.onDeleteFile(path + "/" + type + "/json/" + type + "_" + name + ".json")
      } catch (error) { }

      try {
        rizeObject.onDeleteFile(path + "/" + type + "/js/" + name + ".js")
      } catch (error) { }

      AppVue.SaveProject()
      AppVue.onLoadJSFunctions()

    },

    SaveProject() {

      console.log("Saving project")
      console.log(this.project.name)
      var path_project = rizeObject.directoryProjects + "/" + this.project.name
      rizeObject.onCreateFolder(path_project)
      var path_folder = path_project + "/versions"
      rizeObject.onCreateFolder(path_folder)

      var d = new Date();
      var hr = String(d.getHours());
      var min = String(d.getMinutes());
      var sec = d.getSeconds();

      if (min < 10) {
        min = "0" + min;
      }

      if (month < 10) {
        month = "0" + month;
      }
      var date = d.getDate();
      var month = d.getMonth();
      var year = d.getFullYear();

      AppVue.project.versions[AppVue.project.version] = year + "/" + month + "/" + date + " " + hr + ":" + min

      project_name = AppVue.project.name
      if (project_name === "default") {

      }
      else {

        rizeObject.onSaveBlockProgram(project_name)
        rizeObject.onSaveBlockVersion(AppVue.project.version)
        rizeObject.onBuildBlockCodeJS(project_name, AppVue.project.version)
        console.log("saving")

        var config_version = {
          "sentences": AppVue.project.sentences,
          "words": AppVue.project.words,
          "name": AppVue.project.name,
          "robot_name": AppVue.project.robot_name,
          "language": AppVue.project.chips_language,
          "volume": AppVue.project.volume,
          "rizeReactions": AppVue.rizeReactions,
          "rizeGoals": AppVue.rizeGoals,
          "rizeModules": AppVue.rizeModules,
          "version": AppVue.project.version,
          "rizePatterns": AppVue.rizePatterns,
          "idleBehaviior": AppVue.project.idle_behavior_name,
          "robot_ip": AppVue.project.robot_ip
        }

        var config = {
          "version": AppVue.project.version,
          "versions": AppVue.project.versions,
        }

        console.log(config)
        rizeObject.onSaveJSON(rizeObject.getPathProjects() + "/" + project_name + "/config.json", config)
        rizeObject.onCreateFolder(rizeObject.getPathProjects() + "/" + project_name + "/versions/" + AppVue.project.version)
        rizeObject.onSaveJSON(rizeObject.getPathProjects() + "/" + project_name + "/versions/" + AppVue.project.version + "/config.json", config_version)

      }
    },




  }

})



