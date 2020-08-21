var RizeMenu = {
  props: ["dialog_start"],
  data: function () {
    return {
      panel: [0, 1],
      disabled: false,
      disabled_ros: false,
      robot_ip: "127.0.0.1",
      ros_ip: "127.0.0.1",
      robot_port: 9559,
      someChildProperty: true,
      action_number: 1,
      dialog_load: false,
      dialog_new: false,
      robot_selected: "Pepper",
      dialog_pepper: false,
      dialog_version: false,
      dialog_version_load: false,
      dialog_config: false,
      dialog_speech: false,
      speech_color: "primary",
      items_program: [],
      items_program_real: [],
      icon_speech: "mdi-text-to-speech",
      speech_message: "Enable Speech Recognition",
      mode_track: false,
      color_live: "white",
      color_track: "white",
      tabs_name: ["Home", "Reactions", "Goals", "Modules"],
      robot_types: ['Pepper', 'NAO', 'ROS'],
      tile: "Rize",
      project_name: "",
      list_v: ["Hello"],
      speech_feedback: true,
      leds_feedback: true,
      speech_on: false,
      program_started: false,
      new_version: "",
      items_version: ["Intial"],
      version_selected: "",
      project: {
        name: "",               // Current project name
        selected_project: '',
        selected_module: '',
        words: "",
        sentences: "",
      },

      headers_version: [
        {
          text: 'Name',
          align: 'start',
          value: 'name',
        },
        { text: 'Date', value: 'date' },
      ],
      version_values: [
        {
          name: 'Init',
          date: "No saved",
        },
      ],

      dialog: false,
      headers: [
        {
          text: 'Words',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        name: '',
      },
      defaultItem: {
        name: ''
      },
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },

    dialog_speech(val) {
      this.desserts = AppVue.project.words
    },
  },

  created() {
    this.initialize()
  },


  methods: {

    initialize() {


    },


    onRunAction: function (action) {
      response = btManager.tick(action) // IMPORTANT: require the definition of bt for action execution
      console.log(action)

      try {

        // rosbridge
        if (using_ros === true) {
          var str = new ROSLIB.Message({
            data: JSON.stringify({ "action": "debugg", "input": action })
          });
          publisher_rize.publish(str)
        }
      } catch (error) {

      }
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const index = this.desserts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      AppVue.project.words = this.desserts
      this.close()
    },

    onMore() {
      AppVue.drawer = true

    },


    onPosture() {

      AppVue.dialog_posture = true;

    },

    onOpenDialogSpeech() {
      this.dialog_speech = true;
    },

    onStartSpeech() {

      console.log("Start speech ")
      this.list_v = []
      this.desserts.forEach(element => {
        this.list_v.push(element.name)
      });

      console.log(this.list_v)
      console.log(this.speech_feedback)
      console.log(this.leds_feedback)
      speechStart(this.list_v, this.speech_feedback, this.leds_feedback)
    },

    onStopSpeech() {
      stopSpeech()
    },

    onOpenDialogSend() {
      AppVue.dialog_send = true
    },

    onCloseNewProjectDialog: function () {
      this.dialog_new = false
    },

    onNewProjectDialog: function () {
      this.dialog_new = true
    },


    // Save new projet
    onCreateNewProject() {
      this.project_name = this.project.name
      project_name = this.project.name
      console.log("New project name: " + this.project.name)

      var letters = /^[A-Za-z0-9_]+$/;
      if (project_name.match(letters)) {
        if (this.items_program.indexOf(project_name) >= 0) {
          console.log("_Name module name error")
          alert("Other project have the same name");
        }
        else {
          AppVue.project.name = "_" + this.project.name
          console.log(AppVue.project.name)
          AppVue.CleanProject()
          AppVue.SaveProject()
          this.onCloseNewProjectDialog()
          current_project_defined = true
          this.dialog_save_wait = true
          AppVue.project.name = "_" + this.project.name
          AppVue.SaveProject()
          this.dialog_new = false;
          AppVue.onLoadJSFunctions()
          this.program_started = true
          this.project.name = ""
        }
      }
      else {
        console.log("_Name module name error")
        alert("Please input alphabet characters or numbers only, instead of spaces use _");

      }


    },

    onConsole() {
      var { ipcRenderer } = require('electron')
      console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

      ipcRenderer.on('asynchronous-reply', (event, arg) => {
        console.log(arg) // prints "pong"
      })
      ipcRenderer.send('asynchronous-message', 'ping')
    },

    // Save project
    onSaveAll() {
      AppVue.project.robot_name = this.robot_selected
      AppVue.project.robot_ip = this.robot_ip

      if (current_project_defined === false) {
        this.dialog_new = true
      }
      else {
        AppVue.SaveProject()
        this.dialog_new = false;
        this.dialog_save_wait = true
        AppVue.onLoadJSFunctions()
        AppVue.onBuildBTProgram()

        AppVue.SaveProject()
        AppVue.onLoadJSFunctions()
        AppVue.onBuildBTProgram()
      }

      try {
        // rosbridge
        if (using_ros === true) {
          var str = new ROSLIB.Message({
            data: JSON.stringify({ "action": "save_all" })
          });
          publisher_rize.publish(str)
        }
      } catch (error) {

      }


    },

    onReturnNew: function () {

      AppVue.dialog_start = true
      this.dialog_load = false
      this.dialog_new = false

    },

    onReturnLoad: function () {

      AppVue.dialog_start = true
      this.dialog_load = false
      this.dialog_new = false

    },


    changedProject: function (value) {
      AppVue.project.selected_project = value
      console.log("selected project is: " + value)
    },


    onLoadProjectsList: function () {

      this.dialog_load = true
      rizeObject.onUpdateProjects()
      let list_projects = rizeObject.getListProjects()
      this.items_program_real = []
      this.items_program = list_projects
      console.log(list_projects)



      this.items_program.forEach(element => {
        var res = element.split("_");
        var temp_name = "";
        for (let index = 1; index < res.length; index++) {
          temp_name = temp_name + res[index];
        }
        if (temp_name === "") {

        }
        else {
          this.items_program_real.push(temp_name)
        }

      });


    },

    onOpenIP: function () {
      this.dialog_pepper = true
    },


    onChangeIP: function () {

      AppVue.robot_name = this.robot_selected;
      rize_robot = this.robot_selected;



      var save_json = {}
      if (this.disabled === true) {
        json_robot = { "name": this.robot_name, "type": this.robot_name, "ip": "127.0.0.1", "port": this.robot_port, "middleware": "ZMQ", "python": "default" }
        save_json = { "name": this.robot_name, "type": this.robot_name, "ip": this.robot_ip, "port": 9559, "middleware": "ZMQ", "python": "default" }
      }
      else {

        json_robot = { "name": this.robot_name, "type": this.robot_name, "ip": this.robot_ip, "port": 9559, "middleware": "ZMQ", "python": "default" }
        save_json = { "name": this.robot_name, "type": this.robot_name, "ip": this.robot_ip, "port": 9559, "middleware": "ZMQ", "python": "default" }
        AppVue.robot_port = 9559

      }


      AppVue.robot_ip = this.robot_ip
      AppVue.robot_status = "IP robot changed to: " + AppVue.robot_ip
      this.dialog_pepper = false

    },



    NewStart: function () {

      AppVue.dialog_start = false
      this.dialog_new = true

      // Load projects
      rizeObject.onUpdateProjects()
      let list_projects = rizeObject.getListProjects()
      this.items_program_real = []
      this.items_program = list_projects
      console.log(list_projects)

      this.items_program.forEach(element => {
        var res = element.split("_");
        var temp_name = "";
        for (let index = 1; index < res.length; index++) {
          temp_name = temp_name + res[index];
        }
        if (temp_name === "") {

        }
        else {
          this.items_program_real.push(temp_name)
        }

      });
    },

    onCreateNewVersion: function () {

      this.dialog_version = false

      var path_project = rizeObject.directoryProjects + "/" + AppVue.project.name
      var path_folder = path_project + "/versions/" + this.new_version
      rizeObject.onCreateFolder(path_folder)
      var source_files = rizeObject.directoryProjects + "/" + AppVue.project.name + "/versions/" + AppVue.project.version
      console.log(source_files)
      console.log(path_folder)
      copyFolderRecursiveSync(source_files + "/behavior", path_folder)
      copyFolderRecursiveSync(source_files + "/goal", path_folder)
      copyFolderRecursiveSync(source_files + "/module", path_folder)
      copyFolderRecursiveSync(source_files + "/reaction", path_folder)
      copyFileSync(source_files + "/config.json", path_folder)


      AppVue.project.version = this.new_version
      console.log(this.new_version)

      var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var d = new Date();
      var day = days[d.getDay()];
      var hr = d.getHours();
      var min = d.getMinutes();


      if (min < 10) {
        min = "0" + min;
      }

      var date = d.getDate();
      var month = d.getMonth();
      var year = d.getFullYear();

      if (month < 10) {
        month = "0" + month;
      }

      AppVue.global_versions[this.new_version] = year + "/" + month + "/" + date + " " + hr + ":" + min

      this.new_version = ""
    },

    onCreateNewBranch: function () {

      this.dialog_version = true

    },

    onCreateLoadBranch: function () {


      this.version_values = []
      this.items_version = []

      for (const [key, value] of Object.entries(AppVue.global_versions)) {
        this.version_values.push({ name: key, date: value })
        this.items_version.push(key)
      }

      this.dialog_version_load = true

    },

    onLoadVersion: function () {

      AppVue.project.version = this.version_selected
      this.dialog_version_load = false;
      console.log(AppVue.project.version);


      let full_path = rizeObject.directoryProjects + "/" + AppVue.project.name + "/versions/" + this.version_selected + "/config.json"
      let config = rizeObject.onReadJSONFile(full_path);


      AppVue.project.words = config.words
      AppVue.project.sentences = config.sentences
      AppVue.project.name = config.name
      AppVue.project.chips_robots = config.name
      AppVue.project.chips_language = config.language
      AppVue.project.robot_ip = config.robot_ip
      AppVue.project.robot_name = config.robot_name
      AppVue.rizeReactions = config.rizeReactions
      AppVue.rizeGoals = config.rizeGoals
      AppVue.rizeModules = config.rizeModules
      AppVue.project.volume = config.volume



      AppVue.model = "Home"
      this.dialog_load = false
      this.program_started = true

      this.robot_selected = AppVue.project.robot_name
      this.robot_ip = AppVue.project.robot_ip


      AppVue.robot_ip = config.robot_ip
      AppVue.robot_name = config.robot_name
      this.robot_name = AppVue.project.robot_name

    },



    onStartROS: function () {
      console.log("Start rosbridge in: " + this.ros_ip)
      sharo.useROS(this.ros_ip)
      start_ros_pubs(this.ros_ip)
    },

    LoadStart: function () {
      this.onLoadProjectsList()
      AppVue.dialog_start = false
      this.dialog_load = true
    },



    onLoadProject: function () {

      AppVue.project.name = "_" + AppVue.project.selected_project

      if (AppVue.project.selected_project === "default") {

        console.log("Project not opened")

      }
      else {

        current_project_defined = true

        project_name = AppVue.project.name
        this.project_name = AppVue.project.selected_project
        console.log("Loading project " + AppVue.project.name)

        let config = rizeObject.onLoadProject(project_name)
        console.log(config)

        AppVue.project.version = config.version
        AppVue.global_versions = config.versions

        this.dialog_version_load = false;
        console.log(AppVue.project.version);


        let full_path = rizeObject.directoryProjects + "/" + AppVue.project.name + "/versions/" + config.version + "/config.json"
        config = rizeObject.onReadJSONFile(full_path);


        AppVue.project.words = config.words
        AppVue.project.sentences = config.sentences
        AppVue.project.name = config.name
        AppVue.project.chips_robots = config.name
        AppVue.project.chips_language = config.language
        AppVue.project.robot_ip = config.robot_ip
        AppVue.project.robot_name = config.robot_name
        AppVue.rizeReactions = config.rizeReactions
        AppVue.rizeGoals = config.rizeGoals
        AppVue.rizeModules = config.rizeModules
        AppVue.project.volume = config.volume



        AppVue.model = "Home"
        this.dialog_load = false
        this.program_started = true

        this.robot_selected = AppVue.project.robot_name
        this.robot_ip = AppVue.project.robot_ip


        AppVue.robot_ip = config.robot_ip
        AppVue.robot_name = config.robot_name
        this.robot_name = AppVue.project.robot_name

      }

    },

  },
  template: `
  <v-app-bar color="indigo"  clipped-right dense dark promminent flat>



  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn class="mx-4" text v-on:click="onNewProjectDialog" v-on="on">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <span>New project</span>
  </v-tooltip>


  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn class="mx-4" text v-on:click="onLoadProjectsList" v-on="on">
        <v-icon>mdi-folder-open</v-icon>
      </v-btn>
    </template>
    <span>Load Project</span>
  </v-tooltip>

  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn class="mx-4" text v-on:click="onSaveAll" v-on="on">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </template>
    <span>Save all</span>
  </v-tooltip>

  
  <v-tooltip bottom>
  <template v-slot:activator="{ on }">
    <v-btn class="mx-4" text v-on:click="onOpenIP" v-on="on">
      <v-icon>mdi-ip</v-icon>
    </v-btn>
  </template>
  <span>Change IP address</span>
  </v-tooltip>

    <v-divider
    inset
    vertical
  ></v-divider>

  <v-tooltip bottom>
  <template v-slot:activator="{ on }">
    <v-btn class="mx-4" text v-on:click="onCreateNewBranch"  v-on="on">
    <v-icon>mdi-source-branch-plus</v-icon>
    </v-btn>
  </template>
  <span>New version</span>
  </v-tooltip>

  

  <v-tooltip bottom>
  <template v-slot:activator="{ on }">
    <v-btn class="mx-4" text v-on:click="onCreateLoadBranch"  v-on="on">
    <v-icon>mdi-source-branch</v-icon>
    </v-btn>
  </template>
  <span>Go to version</span>
  </v-tooltip>

</v-tooltip>



  <v-spacer></v-spacer>

  <div v-if="project_name===''">
  <v-chip class="ma-2" color="teal" text-color="white">
    Project not saved/loaded
  </v-chip>
  </div>
  <div v-if="project_name!==''">
  <v-chip class="ma-2" color="teal" text-color="white">
    {{project_name}}
  </v-chip>
  </div>


  <v-spacer></v-spacer>


    <v-btn class="mx-4" text >
    <v-icon></v-icon>
    </v-btn>
    <v-btn class="mx-4" text >
    <v-icon></v-icon>
    </v-btn>


  <v-tooltip bottom>
  <template v-slot:activator="{ on }">
    <v-btn class="mx-4" text v-on:click="onOpenDialogSpeech"  v-on="on">
    <v-icon>mdi-text-to-speech</v-icon>
    </v-btn>
  </template>
  <span>Speech recognition</span>
  </v-tooltip>

  
  <v-tooltip bottom>
  <template v-slot:activator="{ on }">
    <v-btn :color=color_live v-on:click="onPosture" class="mx-4" text v-on="on">
    <v-icon>mdi-yoga</v-icon>
    </v-btn>
  </template>
  <span>Postures and animations</span>
  </v-tooltip>




  <v-tooltip bottom>
  <template v-slot:activator="{ on }">
    <v-btn class="mx-4" text v-on:click="onOpenDialogSend" v-on="on">
      <v-icon>mdi-send</v-icon>
    </v-btn>
  </template>
  <span>Text to speech</span>
  </v-tooltip>


    <v-divider
  inset
  vertical
  ></v-divider>


  <v-tooltip bottom>
  <template v-slot:activator="{ on }">
    <v-btn class="mx-4" text v-on:click="onConsole"  v-on="on">
    <v-icon>mdi-console</v-icon>
    </v-btn>
  </template>
  <span>Label experiment</span>
  </v-tooltip>




  <v-dialog v-model="dialog_start" persistent max-width="420">
    <v-card>
      <v-card-title class="headline">Select you desired action </v-card-title>
      <v-container>

      <v-row align="center">

      <v-col class="text-center" cols="12" sm="12">
      <v-btn class="ma-2" depressed color="info"   @click="NewStart">
      <v-icon left>mdi-file-plus</v-icon> New project
      </v-btn>
        <div class="my-2">
          <v-btn class="ma-2" depressed color="primary" @click="LoadStart" >
          <v-icon left>mdi-folder-open</v-icon> Load project
          </v-btn>
        </div>
      </v-col>
    </v-row>
    </v-container>

    </v-card>
  </v-dialog>



  <v-dialog v-model="dialog_speech" fullscreen hide-overlay persistent max-width="650px">
        <v-card>
          <v-toolbar flat dense dark color="indigo">
            <v-btn icon dark @click.native="dialog_speech = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Speech settings</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon>mdi-text-to-speech</v-icon>
            <v-toolbar-items></v-toolbar-items>
          </v-toolbar>

          <v-card-text>
            <v-container fluid grid-list-lg>
              <v-layout wrap align-center justify-center>
                <v-flex xs12>



                  <v-container>
                    <v-row>
                      <v-col cols="7">
                        <v-data-table :headers="headers" :items="desserts" sort-by="calories" class="elevation-1">
                          <template v-slot:top>
                            <v-toolbar flat color="white">
                              <v-toolbar-title>Words/sentences to recognize</v-toolbar-title>
                              <v-divider class="mx-4" inset vertical></v-divider>
                              <v-spacer></v-spacer>
                              <v-dialog v-model="dialog" max-width="500px">
                                <template v-slot:activator="{ on }">
                                  <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
                                </template>
                                <v-card>
                                  <v-card-title>
                                    <span class="headline">{{ formTitle }}</span>
                                  </v-card-title>

                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col cols="12" sm="8" md="8">
                                          <v-text-field v-model="editedItem.name" label="Word/Sentence"></v-text-field>
                                        </v-col>


                                      </v-row>
                                    </v-container>
                                  </v-card-text>

                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </v-toolbar>
                          </template>
                          <template v-slot:item.actions="{ item }">
                            <v-icon small class="mr-2" @click="editItem(item)">
                              mdi-pencil
                            </v-icon>
                            <v-icon small @click="deleteItem(item)">
                              mdi-delete
                            </v-icon>
                          </template>
                          <template v-slot:no-data>
                            <v-btn color="primary" @click="initialize">Reset</v-btn>
                          </template>
                        </v-data-table>



                      </v-col>
                      <v-col cols="5">
                      <v-container>

                        <v-row align="center">
                        <v-col class="text-center" cols="12" sm="6">
                        <v-checkbox v-model="leds_feedback" label="Leds feedback" required></v-checkbox>
                        </v-col>
                        <v-col class="text-center" cols="12" sm="6">
                        <v-checkbox v-model="speech_feedback" label="Sound feedback" required></v-checkbox>
                        </v-col>
                        </v-row>
                      </v-container>
                      <v-container>
                      <v-row align="center">
                      <v-btn class="ma-2" v-on:click="onStartSpeech" dark :color=speech_color>
                      <v-icon left>{{icon_speech}}</v-icon> Start speech recognition
                      </v-btn>
                      </v-row>
                      <v-row align="center">
                      <v-btn class="ma-2" v-on:click="onStopSpeech" dark color="pink darken-4">
                      <v-icon left>mdi-file-send</v-icon> Stop speech recognition
                      </v-btn>
                      </v-row>
                      </v-container>        

                      </v-col>

                    </v-row>
                  </v-container>

                </v-flex>
              </v-layout>
            </v-container>

                            
     
          </v-card-text>

          <v-footer  color = "white" absolute  class="font-weight-medium"  >
            <v-col  class="text-center"   cols="12" >
  
            <v-alert dense text type="error">
              It is recommended to stop speech recognition before closing RIZE
            </v-alert>

            </v-col>
          </v-footer>
        </v-card>
      </v-dialog>



  <v-dialog v-model="dialog_new" persistent width="500px">

    <v-card>
      <v-toolbar flat dense dark color="pink darken-4">
       <div v-if="program_started===true">
        <v-btn icon dark @click.native="dialog_new = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        </div>
        <v-toolbar-title>Create/Save new project</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon>mdi-file-plus</v-icon>

        <v-toolbar-items></v-toolbar-items>
      </v-toolbar>

      <v-container fill-height fluid>

      <v-flex xs12 sm12 d-flex></v-flex>
      <div class="headline"><span style="font-size: 18px"> Set project name: </span></div>
      </v-flex>

      <v-flex xs12 sm12 d-flex></v-flex>
      <v-text-field single-line filled v-model="project.name" label=""
      hint="Please input alphabet characters, do not start with a number, do not use spaces (use _ instead) of spaces">
      </v-text-field>
      </v-flex>

    

      </v-container>

      <v-card-actions>
        <div v-if="program_started===false">
        <v-btn icon v-on:click="onReturnLoad">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="pink darken-4" outlined v-on:click="onCreateNewProject">Create</v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>


  <v-dialog v-model="dialog_version" persistent width="500px">

  <v-card>
    <v-toolbar flat dense dark color="grey darken-3">
     <div v-if="program_started===true">
      <v-btn icon dark @click.native="dialog_version = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      </div>
      <v-toolbar-title>New version</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon>mdi-source-branch-plus</v-icon>

      <v-toolbar-items></v-toolbar-items>
    </v-toolbar>

    <v-container fill-height fluid>

    <v-flex xs12 sm12 d-flex></v-flex>
    <div class="headline"><span style="font-size: 18px"> Set version name: </span></div>
    </v-flex>

    <v-flex xs12 sm12 d-flex></v-flex>
    <v-text-field single-line filled v-model="new_version" label=""
    hint="Please input alphabet characters, do not start with a number, do not use spaces (use _ instead) of spaces">
    </v-text-field>
    </v-flex>

  

    </v-container>

    <v-card-actions>
      <div v-if="program_started===false">
      <v-btn icon v-on:click="onReturnLoad">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="grey darken-3" outlined v-on:click="onCreateNewVersion">Create</v-btn>

    </v-card-actions>
  </v-card>
</v-dialog>


<v-dialog v-model="dialog_version_load" persistent max-width="500px">
    </v-btn>
    <v-card>
      <v-toolbar flat dense dark color="grey darken-3">
      <div v-if="program_started===true">
        <v-btn icon dark @click.native="dialog_version_load = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
        <v-toolbar-title>Load Version</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon>mdi-source-branch</v-icon>
        <v-toolbar-items></v-toolbar-items>
      </v-toolbar>
      <v-container fluid grid-list-xl>
        <v-layout wrap align-center>
          <v-flex xs12 sm12 d-flex></v-flex>
          

          
  <v-card flat>


    <v-container fill-height fluid>


    <v-data-table
    :headers="headers_version"
    :items="version_values"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
  

    </v-container>

  
  </v-card>


          <div class="headline"><span style="font-size: 18px"> &nbsp; Select version: </span></div>
          </v-flex>
          <v-flex xs12 sm12 d-flex>
            <v-select :items="items_version"  v-model="version_selected" outlined>
            </v-select>
          </v-flex>
        </v-layout>

        <v-spacer></v-spacer>

        <v-layout wrap align-center>
          &nbsp;
          &nbsp;
          <div v-if="program_started===false">
          <v-btn icon v-on:click="onReturnNew">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          </div>
          <v-spacer></v-spacer>
          <v-btn outlined color="grey darken-3" v-on:click="onLoadVersion" dark>LOAD
          </v-btn>
          &nbsp;
          &nbsp;
        </v-layout>

      </v-container>

    </v-card>
  </v-dialog>


  <v-dialog v-model="dialog_load" persistent max-width="500px">
    </v-btn>
    <v-card>
      <v-toolbar flat dense dark color="pink darken-4">
      <div v-if="program_started===true">
        <v-btn icon dark @click.native="dialog_load = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
        <v-toolbar-title>Load Project</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon>mdi-folder-open</v-icon>
        <v-toolbar-items></v-toolbar-items>
      </v-toolbar>
      <v-container fluid grid-list-xl>
        <v-layout wrap align-center>
          <v-flex xs12 sm12 d-flex></v-flex>
          <div class="headline"><span style="font-size: 18px"> &nbsp; Select project: </span></div>
          </v-flex>
          <v-flex xs12 sm12 d-flex>
            <v-select :items="items_program_real" value="data.project.selected_project" outlined @change="changedProject">
            </v-select>
          </v-flex>
        </v-layout>

        <v-spacer></v-spacer>

        <v-layout wrap align-center>
          &nbsp;
          &nbsp;
          <div v-if="program_started===false">
          <v-btn icon v-on:click="onReturnNew">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          </div>
          <v-spacer></v-spacer>
          <v-btn outlined color="pink darken-4" v-on:click="onLoadProject" dark>LOAD
          </v-btn>
          &nbsp;
          &nbsp;
        </v-layout>

      </v-container>

    </v-card>
  </v-dialog>


  <v-dialog v-model="dialog_pepper" max-width="400px">
    </v-btn>
    <v-card>
      <v-toolbar flat dense dark color="pink darken-4">
        <v-btn icon dark @click.native="dialog_pepper = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Robot IP</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon>mdi-ip</v-icon>
        <v-toolbar-items></v-toolbar-items>
      </v-toolbar>
      <v-container fluid grid-list-xl>
        <v-layout wrap align-center>
          <v-flex xs12 sm12 d-flex></v-flex>
          <div class="headline"><span style="font-size: 20px"> &nbsp; Set IP address of {{robot_selected}}: </span></div>
          </v-flex>
          <v-flex xs12 sm12 d-flex>
          <v-text-field v-model="robot_ip" required></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 d-flex>
          <v-select
          :items="robot_types"
          v-model="robot_selected"
          filled
          label="Select robot"
        ></v-select>
          </v-flex>
        </v-layout>

        <div>
        <div class="d-flex">
        <v-checkbox
          v-model="disabled_ros"
          label="Use ROSbridge"
        ></v-checkbox>
        </div>

        <div v-if="disabled_ros === true">

        <card>
        <div class="headline"><span style="font-size: 20px"> Set rosbridge IP </span></div>
        <v-text-field v-model="ros_ip" required></v-text-field>

       
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined color="pink darken-4" v-on:click="onStartROS" dark> Start ROSbridge
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>

        </card>

        </div>

        <div class="d-flex">
          <v-checkbox
            v-model="disabled"
            label="Use simulator from Choregraphe"
          ></v-checkbox>
        </div>

        <div v-if="disabled === true">

        <card>
        <div class="headline"><span style="font-size: 20px"> Set port from Chorepraphe </span></div>

        <v-text-field
          placeholder="9559"
          v-model="robot_port" 
        ></v-text-field>

        </card>

        </div>

      </div>
      </v-container>

      <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn outlined color="pink darken-4" v-on:click="onChangeIP" dark> Save configuration
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>

    </v-card>
  </v-dialog>

  <v-dialog v-model="dialog_config" fullscreen hide-overlay transition="dialog-bottom-transition">
  <v-card>
    <v-toolbar dense dark promminent flat color="indigo">
      <v-btn icon dark @click="dialog_config = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Settings</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon>mdi-cogs</v-icon>
    </v-toolbar>
   
  </v-card>
</v-dialog>

  </v-menu>
</v-app-bar>
`
}
