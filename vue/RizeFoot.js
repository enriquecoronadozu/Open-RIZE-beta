var RizeFoot = {
  props: ["robot_status_"],
  data: function () {
    return {
      someChildProperty: true,
      action_number: 1,
      dialog_settings: false,
      items_robots: [rize_robot], // global variable on index.html
      chips_robots: rize_robot, // global variable on index.html
      dialog_connect_wifi: false,
      playcolor: "white",
      stopcolor: "lime lighten-1"
    }
  },
  methods: {
    onPlay: function () {

      program_running = true
      this.stopcolor = "white"
      this.playcolor = "lime lighten-1"
      console.log("onPlay")
      runProgram()

      try {

        // rosbridge
        if (using_ros === true) {
          var str = new ROSLIB.Message({
            data: JSON.stringify({ "action": "play_all" })
          });
          publisher_rize.publish(str)
        }
      } catch (error) {

      }
    },

    onPause: function () {
      console.log("onPause")
    },
    onStop: function () {

      this.stopcolor = "lime lighten-1"
      this.playcolor = "white"

      stopProgram()
      console.log("onStop")
      program_running = false

      // rosbridge
      if (using_ros === true) {
        var str = new ROSLIB.Message({
          data: JSON.stringify({ "action": "stop_all" })
        });
        publisher_rize.publish(str)
      }
    },

    onRunAction: function (action) {

      response = btManager.tick(action) // IMPORTANT: require the definition of bt for action execution
      console.log(action)

    },

    onStopTracking: function () {

      this.action_number++;
      let action = {
        "node": "action",
        "primitives": [{
          primitive: "walk_toward", input: "None", "options": {
            "LeftArm": false,
            "RightArm": false
          }
        }],
        "robots": rize_robot, "state": "idle",
        "times": 0, "id": "action010" + String(this.action_number)
      }

      this.onRunAction(action)

    },

    onStartTracking: function () {

      this.action_number++;
      let action = {
        "node": "action",
        "primitives": [{
          primitive: "track_people_with", input: "Head", options: {
            "LeftArm": false,
            "RightArm": false
          }
        }],
        "robots": rize_robot, "state": "idle",
        "times": 0, "id": "action010" + String(this.action_number)
      }

      this.onRunAction(action)

    },

    onStopPepperBehaviors: function () {

      console.log("Stop speech")
      stopSpeech();
      this.onStopTracking();


      this.chips_robots = rize_robot // global variable on index.html
      var type_robot = ""
      var json_robot = {}
      list_robots.forEach(element => {
        let temp_name = element["name"]
        if (this.chips_robots === temp_name) {
          type_robot = element["type"]
          json_robot = element
        }
      });

      //this.dialog_pepper_start = true
      AppVue.robot_status = "Stopping robot's behaviors ..."
      this.robot_connected = this.chips_robots
      var robot_script = script_path.join(__dirname, '.', 'python_scripts/stop_initial_behaviors.py')

      console.log(__dirname);
      var opsys = process.platform;

      if (developer_mode === false) {
        if (opsys == "darwin") {
          robot_script = script_path.join(__dirname, '..', 'python_scripts/stop_initial_behaviors.py')
        } else if (opsys == "win32" || opsys == "win64") {
          robot_script = script_path.join(__dirname, '..', 'python_scripts/stop_initial_behaviors.py')
        } else if (opsys == "linux") {
          robot_script = script_path.join(__dirname, '.', 'python_scripts/stop_initial_behaviors.py')
        }
      }

      var args = [JSON.stringify(json_robot)];
      args.unshift(robot_script);
      console.log(args)

      
      
      var init_robot = spawn('python', args);

      if (rizeObject.opsys === "Windows") {
        init_robot = spawn('C:/Python27/python', args);
      }

      init_robot.stdout.on('data', (data) => {
        console.log("----- INIT ROBOT -----")
        console.log(`stdout: ${data}`);
      });

      init_robot.stderr.on('data', (data) => {
        console.log("----- INIT ROBOT -----")
        console.error(`stderr: ${data}`);
      });

      init_robot.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });


    },

    onConnectRobots: function () {
      list_robots = rizeObject.onLoadRobots()
      //Clear global variable list_robots
      input_robots["options"] = []
      items_robots = []
      // Update global variable list_robots
      list_robots.forEach(element => {
        input_robots["options"].push([element["name"], element["name"]])
        items_robots.push(element["name"])
      });
      this.items_robots = items_robots
      this.dialog_connect_wifi = true;
      if (this.chips_robots.length == 0) {
      }
      else {

        var type_robot = ""
        var json_robot = {}
        list_robots.forEach(element => {
          let temp_name = element["name"]
          if (this.chips_robots === temp_name) {
            type_robot = element["type"]
            json_robot = element
          }
        });

        this.dialog_connect = true
        AppVue.robot_status = "Connecting " + this.chips_robots + "..."
        this.robot_connected = this.chips_robots

        var robot_script = rizeObject.directoryRobots + "/" + type_robot + "/" + this.robot_connected + ".py"
        var args = [JSON.stringify(json_robot)];
        args.unshift(robot_script);
        console.log(args)
        robot_process = spawn('python', args);
        this.dialog_settings = false;

      }
    },
  },
  template: `

  
  <v-footer dark padless absolute height="auto" fixed>
  <v-card class="flex" flat tile>
  <v-app-bar color="teal" dense dark promminent flat>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn :color="playcolor" text class="mx-4" v-on:click="onPlay" v-on="on">
            <v-icon>mdi-play</v-icon>
          </v-btn>
        </template>
        <span>Play project</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn text  :color="stopcolor" class="mx-4" v-on:click="onStop" v-on="on">
            <v-icon>mdi-stop</v-icon>
          </v-btn>
        </template>
        <span>Stop project</span>
      </v-tooltip>

      <v-spacer></v-spacer>

      <h4>{{robot_status_}} </h4> 

      <v-spacer></v-spacer>
  
        <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn text  class="mx-4" v-on:click="onStopTracking" v-on="on">
            <v-icon>mdi-target</v-icon>
          </v-btn>
        </template>
        <span>Stop tracking people/redball</span>
      </v-tooltip>
  

      <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn text  class="mx-4" v-on:click="onStopPepperBehaviors" v-on="on">
          <v-icon>mdi-stop-circle</v-icon>
        </v-btn>
      </template>
      <span>Stop Pepper initial behaviors</span>
    </v-tooltip>
  

    </v-app-bar>
  </v-card>
</v-footer>
`
}







