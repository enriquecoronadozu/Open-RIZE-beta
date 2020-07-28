var WelcomeSocial = {

  props: ["", "status_robot", "robot_ip_"],
  data: function () {
    return {
    }
  },

  methods: {

  },

  template: `
  <v-card flat>
  <v-container grid-list-md text-center>
    <v-layout wrap align-center justify-center>

      <v-flex xs12 md2>
        <v-card color="white" flat>
          &emsp;
        </v-card>
      </v-flex>

      <v-flex xs12>
        <v-card color="white" flat>
          <v-container>
            <v-avatar size="106">
              <img src="images/rize.png" alt="avatar">
            </v-avatar>
          </v-container>
        </v-card>
      </v-flex>
      <v-flex xs6 md5>



        <v-card color="white" flat>
          <div>
            <p style=" color:#424242; font-size: 36px"> <b>R</b>obot <b>I</b>nterfaces from
              <b>Z</b>ero
              <b>E</b>xperience</p>
          </div>
          <div>&nbsp;</div>



        </v-card>

      </v-flex>
    </v-layout>

    <v-container grid-list-md text-center>
      <v-layout justify-center>

 

    <v-flex xs10>
    <div v-if="status_robot === 'noconnected'">
    <v-card color="white" flat>
      <v-alert
      prominent
      text
      :type=colorM
    >
      <v-row align="center">
        <v-col class="grow">  {{robot_name}} not  </v-col>
        <v-col class="shrink">
        <v-btn outlined :color=colorM v-on:click="onConnectPepper()">Connect {{robot_name}}</v-btn>
        </v-col>
      </v-row>
    </v-alert>

    </v-card>
    </div>

    <div v-if="status_robot === 'success'">
    <v-card color="white" flat>
      <v-alert
      prominent
      text
      type="success"
    >
      <v-row align="center">
        <v-col class="grow"> {{robot_name}} connected in: {{robot_ip_}}</v-col>
        <v-col class="shrink">
        <v-btn outlined color="success" v-on:click="onConnectPepper()">Restart</v-btn>
        </v-col>
      </v-row>
    </v-alert>

    </v-card>
    </div>


    <div v-if="status_robot === 'error'">
    <v-card color="white" flat>
      <v-alert
      prominent
      text
      type="error"
    >
      <v-row align="center">
        <v-col class="grow"> {{robot_name}} disconnected</v-col>
        <v-col class="shrink">
        <v-btn outlined color="error" v-on:click="onConnectPepper()">Restart</v-btn>
        </v-col>
      </v-row>
    </v-alert>

    </v-card>
    </div>

    <div v-if="status_robot === 'warning'">
    <v-card color="white" flat>
      <v-alert
      prominent
      text
      type="warning"
    >
      <v-row align="center">
        <v-col class="grow"> Robot was not connected. Is the robot IP ({{robot_ip_}}) correct?.  Check if the robot and this computer are in the same Wifi network </v-col>
        <v-col class="shrink">
        <v-btn outlined color="warning" v-on:click="onConnectPepper()">Try again</v-btn>
        </v-col>
      </v-row>
    </v-alert>
    </v-card>

    </div>



  </v-flex>



    </v-container>


  </v-container>






</v-card>
`
}
