
var DialogSend = {

  props: ["dialog_send", "items_robots_list", "items_language", "chips_language"],
  data: function () {
    return {
      action_number: 1,
      volume:30,
      contextual:true,
      text2say:"",
      chips_robots: rize_robot, // global variable on index.html
      dialog: false,
      sentences:[],
      headers: [
        {
          text: 'Words',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
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
    dialog_send(val) {
      this.sentences = AppVue.project.sentences
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
    },

    editItem(item) {
      this.editedIndex = this.sentences.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const index = this.sentences.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.sentences.splice(index, 1)
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
        Object.assign(this.sentences[this.editedIndex], this.editedItem)
      } else {
        this.sentences.push(this.editedItem)
      }
      AppVue.project.sentences = this.sentences
      this.close()
    },


    onRunAction: function (action) {
      stopProgram()
      response = btManager.tick(action) // IMPORTANT: require the definition of bt for action execution
      console.log(action)
    },

    // Wake up action function
    onWakeUp: function () {

      this.action_number++;
      let action = {
        "node": "action",
        "primitives": [{ primitive: "mode", input: "wake_up", options: {} }],
        "robots": this.chips_robots, "state": "idle",
        "times": 0, "id": "action0" + String(this.action_number)
      }
      this.onRunAction(action)
    },

    // Sleep action function
    onSleep: function () {
      this.action_number++;
      this.action_number++;
      let action = {
        "node": "action",
        "primitives": [{ primitive: "mode", input: "rest", options: {} }],
        "robots": this.chips_robots, "state": "idle",
        "times": 0, "id": "action0" + String(this.action_number)
      }
      this.onRunAction(action)
    },

    // Set volume action function
    onVolume: function () {

      volume(this.volume)

    },


    onSayPlay: function (item) {

      this.editedIndex = this.sentences.indexOf(item)
      var value = this.sentences[this.editedIndex].name


      animated_say(value)
    },

    // Say action function
    onSay: function (value) {
      say(this.text2say)
    },

    onSetLanguage: function () {

      language(this.chips_language)
  
    },

    onCloseDialog()
    {
      AppVue.dialog_send = false
    },
  },
  template: `

  <v-dialog fullscreen hide-overlay persistent persistent v-model="dialog_send">
  <v-card>
    <v-toolbar flat dense dark color="indigo">
      <v-btn icon dark v-on:click="onCloseDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Send speech</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon>mdi-send</v-icon>
      <v-toolbar-items></v-toolbar-items>
    </v-toolbar>


    <v-container fluid grid-list-lg>
      <v-layout wrap align-center justify-center>
        <v-flex xs12>

          <v-container>
            <v-row>
              <v-col cols="6">
                <v-card flat>

                  <p>
                    Voice's volume
                  </p>
                  <v-flex xs12>
                    <v-slider :min="0" :max="100" v-model="volume"></v-slider>
                  </v-flex>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn outlined color="light-blue darken-3" text v-on:click="onVolume">Set volume</v-btn>
                  </v-card-actions>
                </v-card>

                <v-card flat>
                  <p>
                    Robot Language
                  </p>
                  <v-combobox v-model="chips_language" :items="items_language" label="select language" chips
                    outlined flat clearable solo>
                    <template slot="selection" slot-scope="data">
                      <v-chip> <strong>{{ data.item}}</strong>&nbsp;</v-chip>
                    </template>
                  </v-combobox>


                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn outlined color="pink darken-3" text v-on:click="onSetLanguage">Set language</v-btn>
                  </v-card-actions>
                </v-card>


                <v-card flat>
                  <p>
                    Send speech
                  </p>
                  <v-flex xs12>
                    <v-text-field placeholder="Hello" filled v-model="text2say"></v-text-field>
                  </v-flex>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn outlined color="light-blue darken-3" text v-on:click="onSay">Send text</v-btn>
                  </v-card-actions>
                </v-card>


              </v-col>
              <v-col cols="6">

              <v-data-table :headers="headers" :items="sentences" sort-by="calories" class="elevation-1">
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
                            <v-icon small class="mr-2" @click="onSayPlay(item)">
                            mdi-play
                            </v-icon>
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
            </v-row>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
    </v-list>
    <v-list three-line subheader></v-list>
  </v-card>
</v-dialog>

</v-app>
</div>


 `

}
