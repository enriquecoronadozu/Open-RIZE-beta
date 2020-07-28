
var DialogPosture = {

  props: ["dialog_posture", "items_robots_list"],
  data: function () {
    return {
      action_number: 1,
      posture: 'Stand',
      dialog_error: false,
      wake_up: false,
      volume: 50,
      dialog_wait: false,
      animation_name: "",
      contextual: true,
      text2say: "",
      dialog_animation: false,
      chips_robots: rize_robot, // global variable on index.html
      dialog: false,
      text_value: "",
      items: ['Stand', 'Crouch', 'LyingBack', 'LyingBelly', 'Sit', 'SitRelax', 'Stand', 'StandInit'],
      headers: [
        {
          text: 'Animation',
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

  watch: {
    dialog_wait(val) {
      if (!val) return

      setTimeout(() => (this.dialog_wait = false), 4000)
    },
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  created() {
    this.initialize()
  },

  methods: {


    initialize() {

      this.onUpdate()
    },

    onPosture() {

      if (this.wake_up === false) {

        this.dialog_error = true

      }
      else {

        if (program_running) {
          this.dialog_error = true
        }
        else {

          this.action_number++;
          let action = {
            "node": "action",
            "primitives": [{ primitive: "posture", input: this.posture, options: {} }],
            "robots": this.chips_robots, "state": "idle",
            "times": 0, "id": "action001" + String(this.action_number)
          }
          this.onRunAction(action)
        }

      }


    },


    onUpdate() {


      try {

        var path_ = require('path');
        var { spawn } = require('child_process');

        var python_script = ""
        console.log(__dirname);
        if (opsys == "darwin") {
          python_script = path_.join(__dirname, '..', 'python_scripts/build_database.py')
        } else if (opsys == "win32" || opsys == "win64") {
          python_script = path_.join(__dirname, '..', 'python_scripts/build_database.py')
        } else if (opsys == "linux") {
          python_script = path_.join(__dirname, '.', 'python_scripts/build_database.py')
        }

        if (developer_mode) {
          python_script = path_.join(__dirname, '.', 'python_scripts/build_database.py')
        }

        console.log(python_script)
        var process = spawn('python', [python_script]);

        process.stdout.on('data', (data) => {
          console.log("-------- animation -----")
          console.log(`stdout: ${data}`);
        });

        process.stderr.on('data', (data) => {
          console.log("-------- animation -----")
          console.error(`stderr: ${data}`);
        });

      } catch (error) {
        console.log("Error building data base")
      }


      this.desserts = [];

      try {
        var path = rizeObject.pathRIZE + "/animations" + "/list_" + rize_robot + ".json";
        var lsita = rizeObject.onReadJSONFile(path);
        console.log(lsita);


        lsita.values.forEach(element => {
          this.desserts.push({ "name": element });
        });

      } catch (error) {
        console.log("Error: reading animations")
      }


      this.dialog_animation = false;

    },

    onImport() {

      if (this.animation_name === "") {
        console.log("name not ok")
      }
      else {
        var robot_ = rize_robot
        if (rize_robot === "Pepper") {
          robot_ = "Pepper"
        }

        var fs = require('fs');

        var folder = rizeObject.pathRIZE + "/animations/"
        rizeObject.onCreateFolder(folder + "NAO")
        rizeObject.onCreateFolder(folder + "Pepper")

        var letters = /^[A-Za-z0-9_]+$/;
        if (this.animation_name.match(letters)) {

          fs.writeFile(folder + robot_ + "/" + this.animation_name + ".txt", this.text_value, function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          });

          try {

            var path_ = require('path');
            var { spawn } = require('child_process');

            var python_script = ""
            console.log(__dirname);
            if (opsys == "darwin") {
              python_script = path_.join(__dirname, '..', 'python_scripts/build_database.py')
            } else if (opsys == "win32" || opsys == "win64") {
              python_script = path_.join(__dirname, '..', 'python_scripts/build_database.py')
            } else if (opsys == "linux") {
              python_script = path_.join(__dirname, '.', 'python_scripts/build_database.py')
            }

            console.log(python_script)
            var process = spawn('python', [python_script]);

            process.stdout.on('data', (data) => {
              console.log("-------- animation -----")
              console.log(`stdout: ${data}`);
            });

            process.stderr.on('data', (data) => {
              console.log("-------- animation -----")
              console.error(`stderr: ${data}`);
            });

          } catch (error) {
            console.log("Error building data base")
          }


          this.dialog_wait = true;
          this.dialog_animation = false;

        }
        else {

          alert("Please input alphabet characters or numbers only, instead of spaces use _");

        }


      }

    },

    onVideo: function () {
      var opn = require('open');
      // opens the url in the default browser 
      opn('https://www.youtube.com/watch?v=shOHPhsx67A&list=RDshOHPhsx67A&start_radio=1');
    },

    onRunAction: function (action) {
      stopProgram()
      response = btManager.tick(action) // IMPORTANT: require the definition of bt for action execution
      console.log(action)
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
      this.close()
    },


    onRunAction: function (action) {

      response = btManager.tick(action) // IMPORTANT: require the definition of bt for action execution
      console.log(action)

    },

    // Wake up action function
    onWakeUp: function () {

      mode("wake_up");
      this.wake_up = true
    },

    // Sleep action function
    onSleep: function () {
      mode("rest");
      this.wake_up = false
    },

    onPlay(item) {

      this.editedIndex = this.desserts.indexOf(item)
      var value = this.desserts[this.editedIndex].name
    },



    onCloseDialog() {
      AppVue.dialog_posture = false
    },
  },
  template: `
 
  <div>
  <v-dialog fullscreen hide-overlay persistent persistent v-model="dialog_posture">
    <v-card>
      <v-toolbar flat dense dark color="indigo">
        <v-btn icon dark v-on:click="onCloseDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Robot animations and postures</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon>mdi-posture</v-icon>
        <v-toolbar-items></v-toolbar-items>
      </v-toolbar>


      <v-container fluid grid-list-lg>
        <v-layout wrap align-center justify-center>
          <v-flex xs12>

            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-card flat>

                    <v-card-title> Main robot modes
                    </v-card-title>

                    <div class="text-center">
                      <v-btn class="ma-2" @click="onWakeUp" color="primary" dark>
                        <v-icon left>mdi-arrow-up-bold</v-icon> Wake up
                      </v-btn>
                      <v-btn class="ma-2" @click="onSleep" color="primary" dark>
                        <v-icon left>mdi-arrow-down-bold</v-icon> Rest
                      </v-btn>
                    </div>
                  </v-card>


                  <v-card flat>


                    <v-card flat>
                      &nbsp;
                      <v-alert dense text type="info">
                        You need to <b> wake up </b> the robot before playing a posture or animation
                      </v-alert>
                    </v-card>


                    <v-card-title> Robot postures (only NAO)
                    </v-card-title>


                    <v-select :items="items" outlined v-model="posture"></v-select>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn class="ma-2" outlined @click="onPosture" color="primary" dark>Set posture</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>

                  </v-card>

                  <v-card flat>
                  &nbsp;
                  <v-alert dense text type="info">
                    Posture will not be peformed if a program is in execution
                  </v-alert>
                </v-card>

                  <v-card-title> Import animation
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="ma-2" outlined @click.native="dialog_animation= true" color="primary" dark> From
                      Chorepgraphe</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-col>
                <v-col cols="6">
                  <v-card flat>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn class="ma-2" @click="onUpdate" outlined color="primary">
                        <v-icon left>mdi-update</v-icon> Update list
                      </v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>


                  <v-data-table :headers="headers" :items="desserts" sort-by="calories" class="elevation-1">
                    <template v-slot:top>
                      <v-toolbar flat color="white">
                        <v-toolbar-title>Animations</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">

                          <v-card>
                            <v-card-title>
                              <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                              <v-container>
                                <v-row>
                                  <v-col cols="12" sm="8" md="8">
                                    <v-text-field v-model="editedItem.name" label="Animation"></v-text-field>
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

                      <v-icon small @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>

                    </template>
                    <template v-slot:no-data>
                      <v-btn color="primary" @click="initialize">Reset</v-btn>
                    </template>
                  </v-data-table>


                </v-col>
              </v-row>
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>

    </v-card>
  </v-dialog>

  <v-dialog v-model="dialog_wait" hide-overlay persistent width="300">
    <v-card color="primary" dark>
      <v-card-text>
        Importing animation
        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialog_error" max-width="290">
    <v-card>
      <v-card-title class="headline"> Error </v-card-title>

      <v-card-text>
        You need to <b> wake up </b> the robot and <b> stop all programs </b>  before playing a posture
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialog_error = false">
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialog_animation" max-width="700px">
    <v-card>
      <v-toolbar flat dense dark color="pink darken-4">

        <v-btn icon dark @click.native="dialog_animation = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title>Import animation from Choregraphe</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items></v-toolbar-items>
      </v-toolbar>
      <v-container fluid grid-list-xl>
        <v-layout wrap align-center>

          <v-flex xs12>
            <v-card flat>

              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-subtitle>Step 1.- Paste animation code bellow</v-list-item-subtitle>

                  <v-textarea v-model="text_value" clearable filled row-height=10 clear-icon="mdi-close"
                    label="Paste animation code here" value=""></v-textarea>

                  <v-list-item-subtitle>Step 2.- Define an unique name for this animation (use _ instead of spaces)
                  </v-list-item-subtitle>

                  <v-text-field v-model="animation_name" label="Name of the animation" outlined clearable>
                  </v-text-field>

                </v-list-item-content>
              </v-list-item>
            </v-card>

          </v-flex>
        </v-layout>



        <v-spacer></v-spacer>

        <v-layout wrap align-center>
          &nbsp;
          &nbsp;
          <v-spacer></v-spacer>
          <v-btn outlined color="pink darken-4" v-on:click="onImport" dark> Import animation
          </v-btn>
          &nbsp;
          &nbsp;
        </v-layout>



      </v-container>

    </v-card>
  </v-dialog>
</div>
 `

}
