
var DialogSend = {

  props: [],
  data: function () {
    return {
    
      dialog_robot_ready = false,
      dialog_robot_error = false,
      dialog_connect = false,
      dialog_pepper_start = false
    }
  },
  methods: {

    onOpenReady()
    {
      this.dialog_robot_ready = false
    },
    onClodeReady()
    {
      this.dialog_robot_ready = true
    },

   
  },
  template: `

  <v-dialog v-model="dialog_robot_ready" hide-overlay width="300">
  <v-card color="success" dark>
    <v-card-text> Robot connected
    </v-card-text>
  </v-card>
</v-dialog>

<v-dialog v-model="dialog_robot_error" hide-overlay width="300">
  <v-card color="pink" dark>
    <v-card-text> ERROR connecting robot
    </v-card-text>
  </v-card>
</v-dialog>

<v-dialog v-model="dialog_connect" hide-overlay persistent width="300">
  <v-card color="primary" dark>
    <v-card-text> Connecting robot ... <v-progress-linear indeterminate color="white" class="mb-0">
      </v-progress-linear>
    </v-card-text>
  </v-card>
</v-dialog>

<v-dialog v-model="dialog_pepper_start" hide-overlay persistent width="300">
  <v-card color="info" dark>
    <v-card-text> Getting started NAO robot ... Wait until NAO rest <v-progress-linear indeterminate color="white"
        class="mb-0">
      </v-progress-linear>
    </v-card-text>
  </v-card>
</v-dialog>

`
}
