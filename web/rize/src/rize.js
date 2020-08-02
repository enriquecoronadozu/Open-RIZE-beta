class Rize {

  constructor() {
    this.path = require('path');
    this.fs = require('fs');
    this.opsys = process.platform;
    this.pathRIZE = 'C:/Rize'
    this.version = 'Initial'

    if (this.opsys == "darwin") {
      this.opsys = "MacOS";
      this.pathRIZE = require("os").userInfo.homedir
    } else if (this.opsys === "win32" || this.opsys === "win64") {
      this.opsys = "Windows";
      this.pathRIZE = 'C:/Rize'
    } else if (this.opsys == "linux") {
      this.opsys = "Linux";
      this.pathRIZE = process.env.HOME + '/Documents/Rize'
    }

    this.pathDeveloper = this.pathRIZE + '/developer';
    this.directoryProjects = this.pathRIZE + '/projects';
    this.directoryAnimations = this.pathRIZE + '/animations';
    this.directoryRobots = this.pathRIZE + '/robots';

    this.onCreateFolder(this.pathRIZE)
    this.onCreateFolder(this.directoryProjects)
    this.onCreateFolder(this.directoryAnimations)
    this.onCreateFolder(this.directoryRobots)

    this.list_projects = [];
  }

  onCreateFolder(path) {
    if (!this.fs.existsSync(path)) {
      this.fs.mkdirSync(path);
    }
  }

  // Create folders of the project
  onSaveBlockProgram(project_name) {
    this.pathProject = this.directoryProjects + "/" + project_name
    this.onCreateFolder(this.pathProject)
  }


  onSaveBlockVersion(version) {
    this.pathVersion = this.directoryProjects + "/" + project_name + "/versions/" + version
    this.onCreateFolder(this.directoryProjects + "/" + project_name + "/versions")
    this.onCreateFolder(this.pathVersion)
    this.onCreateFolder(this.pathVersion + "/goal")
    this.onCreateFolder(this.pathVersion + "/goal/js")
    this.onCreateFolder(this.pathVersion + "/goal/json")
    this.onCreateFolder(this.pathVersion + "/goal/xml")
    this.onCreateFolder(this.pathVersion + "/reaction")
    this.onCreateFolder(this.pathVersion + "/reaction/js")
    this.onCreateFolder(this.pathVersion + "/reaction/json")
    this.onCreateFolder(this.pathVersion + "/reaction/xml")
    this.onCreateFolder(this.pathVersion + "/module")
    this.onCreateFolder(this.pathVersion + "/module/js")
    this.onCreateFolder(this.pathVersion + "/module/json")
    this.onCreateFolder(this.pathVersion + "/module/xml")
    this.onCreateFolder(this.pathVersion + "/behavior")
    this.onCreateFolder(this.pathVersion + "/behavior/js")
    this.onCreateFolder(this.pathVersion + "/behavior/json")
    this.onCreateFolder(this.pathVersion + "/behavior/xml")
  }


  // Create JS files with functions
  onBuildBlockCodeJS(project_name, version) {

    var path_project = this.directoryProjects + "/" + project_name + "/versions/" + version
    var reaction_files = this.onGetListFiles(path_project + "/reaction/js")
    var goals_files = this.onGetListFiles(path_project + "/goal/js")
    var behaviors_files = this.onGetListFiles(path_project + "/behavior/js")
    var modules_files = this.onGetListFiles(path_project + "/module/js")

    var initial = "var " + project_name + "= { \n"
    var final = "\n }"
    var middle = ""


    var all_files = [[reaction_files, "/reaction/js"], [goals_files, "/goal/js"], [behaviors_files, "/behavior/js"], [modules_files, "/module/js"]]
    for (let index = 0; index < all_files.length; index++) {
      var sfiles = all_files[index];
      for (let index2 = 0; index2 < sfiles[0].length; index2++) {
        var file = sfiles[0][index2]
        var path2read = path_project + sfiles[1] + "/" + file
        var text = this.onReadFile(path2read)
        middle = middle + "\n" + text
      }
    }
    var code = initial + middle + final
    this.onSaveFileSync(path_project + "/code.js", code)
  }

  getListProjects() {
    return this.list_projects
  }

  getPathProjects() {
    return this.directoryProjects
  }

  onUpdateProjects() {
    this.list_projects = this.onGetListFiles(this.directoryProjects)
  }

  onGetListFiles(path) {
    return this.fs.readdirSync(path)
  }

  onReadJSONFile(path) {
    let rawdata = this.fs.readFileSync(path);
    let json_value = JSON.parse(rawdata);
    return json_value
  }

  onReadFile(path) {
    //console.log(path)
    let rawdata = this.fs.readFileSync(path)
    return rawdata
  }

  onLoadPrimitives() {

    try {
      let full_path = this.pathDeveloper + "/databases/primitives.json"
      let primtives = this.onReadJSONFile(full_path);
      return primtives

    } catch (error) {

      let full_path = __dirname + "/developer/databases/primitives.json"
      let primtives = this.onReadJSONFile(full_path);
      return primtives
    }
  }

  onLoadProject(project_name) {
    let full_path = this.directoryProjects + "/" + project_name + "/config.json"
    let config = this.onReadJSONFile(full_path);
    return config
  }

  onLoadRobots() {
    // Read robots from folder
    var full_path = this.pathRIZE + "/robots"
    var list_robots = this.onGetListFiles(full_path)
    var list_dict_robots = []
    // Push list of robots (in a dictionary)
    for (let index = 0; index < list_robots.length; index++) {
      let robot = this.onReadJSONFile(full_path + "/" + list_robots[index])
      list_dict_robots.push(robot)
    }
    // return as a dictionary with a list
    return list_dict_robots
  }

  onDeleteFile(filePath) {
    this.fs.unlinkSync(filePath)
  }

  onDeleteRobot(name) {
    let filePath = this.pathRIZE + "/robots/" + name + ".json"
    this.onDeleteFile(filePath)
  }

  onSaveJSON(path, output) {
    var value = JSON.stringify(output)
    this.fs.writeFileSync(path, value)
  }


  onSaveFile(path, value) {
    this.fs.writeFile(path, value, (err) => {
      if (err) console.log(err);
      console.log(path);
    });
  }

  onSaveFileSync(path, value) {
    this.fs.writeFileSync(path, value)
  }

  codeToList(code) {
    let branchlist = code.split("#..#");
    let json_list = [];
    //console.log(branchlist)
    for (index = 0; index < branchlist.length - 1; ++index) {
      try {
        json_list.push(JSON.parse(branchlist[index]))
      }
      catch (e) {
        json_list.push(branchlist[index])
      }
    }

    return json_list
  }
}