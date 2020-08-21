var BlocksFoot = {
  data: function () {
    return {
      dialog_wait_save: false,
    }
  },

  watch: {
    dialog_wait_save(val) {
      if (!val) return
      setTimeout(() => (this.onRunAgain()), 3000)
    },
  },

  methods: {


    onBuildBTProgram: function () {

      console.log("Build program")
      console.log(list_goals)
      console.log(names_goals)
      console.log(list_reactions)
      console.log(names_reactions)



      let path_projects = rizeObject.getPathProjects()
      let path_project = path_projects + "/" + project_name
      rizeObject.onCreateFolder(path_project + "/" + "goal/json")
      rizeObject.onCreateFolder(path_project + "/" + "reaction/json")

      var l_goals = names_goals
      var code_goals = list_goals

      var l_reactions = names_reactions
      var code_reactions = list_reactions

      var path = path_projects + "/" + project_name + "/goal/json"
      for (let index = 0; index < names_goals.length; index++) {
        const element = names_goals[index];
        var path_ = path + "/" + element + ".json"
        console.log(path_)
        rizeObject.onSaveJSON(path_, code_goals[index])
      }

      var path = path_projects + "/" + project_name + "/reaction/json"
      for (let index = 0; index < names_reactions.length; index++) {
        const element = names_reactions[index];
        var path_ = path + "/" + element + ".json"
        console.log(path_)
        rizeObject.onSaveJSON(path_, code_reactions[index])
      }
    },

    onRunAgain() {

      this.dialog_wait_save = false
      AppVue.onSaveBlock()
      AppVue.SaveProject()
      AppVue.onLoadJSFunctions()
      AppVue.onBuildBTProgram()

      AppVue.SaveProject()
      AppVue.onLoadJSFunctions()
      AppVue.onBuildBTProgram()

      var path = rizeObject.directoryProjects + "/" + project_name + "/versions/" + AppVue.project.version + "/" + AppVue.current_type + "/json/" + AppVue.current_type + "_" + AppVue.block_name + ".json"
      console.log(path)

      var module = rizeObject.onReadJSONFile(path)
      console.log(module)
      btRun.current_module = module["bt"]

      runModule(module["bt"], AppVue.current_type)

    },

    onPlay: function () {

      stopProgram()

      try {
        AppVue.onSaveBlock()
        AppVue.SaveProject()
        AppVue.onLoadJSFunctions()
        AppVue.onBuildBTProgram()

        AppVue.SaveProject()
        AppVue.onLoadJSFunctions()
        AppVue.onBuildBTProgram()

        var path = rizeObject.directoryProjects + "/" + project_name + "/versions/" + AppVue.project.version + "/" + AppVue.current_type + "/json/" + AppVue.current_type + "_" + block_name + ".json"
        console.log(path)

        var module = rizeObject.onReadJSONFile(path)
        console.log(module)
        btRun.current_module = module["bt"]

        runModule(module["bt"], AppVue.current_type)

        try {

          // rosbridge
          if (using_ros === true) {
            var str = new ROSLIB.Message({
              data: JSON.stringify({ "action": "debug_module", "input": block_name })
            });
            publisher_rize.publish(str)
          }

        } catch (error) {

        }


      } catch (error) {

        this.dialog_wait_save = true

      }


    },

    onStop: function () {

      stopProgram()
      try {
        clearInterval(runModuleTimer);
      } catch (error) {

      }

    },

    onPause: function () {

    },

    onSeeCode: function () {
      this.dialog_code = true
      var code = rizeBlockly.onwWorkspacToJavascriptFunctions(WORKSPACE)
      code = rizeBlockly.replaceAll(code, '"**', "")
      code = rizeBlockly.replaceAll(code, '**"', "")
      code = rizeBlockly.replaceAll(code, '"  **', "")
      console.log(code)
      this.text_code = code;
    },


  },
  template: `

  
  <v-footer dark padless height="auto" fixed>

  
  <v-dialog v-model="dialog_code" scrollable max-width="800px">
  <v-card>
    <v-toolbar flat dense dark color="primary">
      <v-btn icon dark @click.native="dialog_code = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Code</v-toolbar-title>
      <v-spacer></v-spacer>
    
      <v-toolbar-items></v-toolbar-items>
    </v-toolbar>
    <v-card>
    <pre> {{text_code}}</pre>
    </v-card>
  </v-card>
  </v-dialog>

    <v-dialog
    v-model="dialog_wait_save"
    hide-overlay
    persistent
    width="300"
    >
    <v-card
      color="primary"
      dark
    >
      <v-card-text>
        Saving new behavior before playing
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
  
  <v-card class="flex" flat tile>
    <v-card-title class="grey darken-2">


      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn text class="mx-4" v-on:click="onPlay" v-on="on">
            <v-icon>mdi-play</v-icon>
          </v-btn>
        </template>
        <span>Play</span>
      </v-tooltip>

      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn text  class="mx-4" v-on:click="onStop" v-on="on">
            <v-icon>mdi-stop</v-icon>
          </v-btn>
        </template>
        <span>Stop</span>
      </v-tooltip>
      <v-spacer></v-spacer>


      <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn text  class="mx-4"  v-on:click="onSeeCode" v-on="on">
          <v-icon>mdi-code-tags</v-icon>
        </v-btn>
      </template>
      <span>See Code</span>
    </v-tooltip>

    
    </v-card-title>

 
  </v-card>
</v-footer>

`
}







