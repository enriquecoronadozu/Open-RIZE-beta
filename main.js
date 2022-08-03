
// Modules to control application life and create native browser window
const { app, Menu, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
var mainWindow

// ----------------- MODE: set as false before builing installers -----------------
var developer_mode = true;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1400,
    height: 1000,
    darkTheme: true,
    backgroundColor: '#2e2c29',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  if (developer_mode)
  {
    //  Open the DevTools.
    mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})



const template = [
  {
    role: 'help',
    submenu: [
      {
        label: 'Documentation',
        click() { require('electron').shell.openExternal('https://enriquecoronadozu.github.io/learn-nep/') }
      }
    ]
  }
]


const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)


function onStart() {

  const path_ = require('path');
  const { spawn } = require('child_process');
  console.log(__dirname);

  var python_master = ""
  console.log(__dirname);
  var os = require('os');
  opsys = os.platform()

  if (developer_mode === false) {
    if (opsys == "darwin") {
      python_master = path_.join(__dirname, '..', 'python_scripts/local_master.py')
    } else if (this.opsys == "win32" || this.opsys == "win64") {
      python_master = path_.join(__dirname, '..', 'python_scripts/local_master.py')
    } else if (this.opsys == "linux") {
      var python_master = path_.join(__dirname, '.', 'python_scripts/local_master.py')
    }
  }
  else{
    var python_master = path_.join(__dirname, '.', 'python_scripts/local_master.py')
  }

  console.log(python_master)
  var process = spawn('python', [python_master]);

}

// Use Nep App or Nep CLI instead
//onStart()


ipcMain.on('synchronous-message', (event, arg) => {
  if(developer_mode)
  {
    master_pid = arg
    console.log(arg)
    mainWindow.webContents.closeDevTools()
    // Synchronous event emmision
    event.returnValue = 'sync pong'
    developer_mode = false

  }
  else{

    master_pid = arg
    console.log(arg)
    mainWindow.webContents.openDevTools()
    // Synchronous event emmision
    event.returnValue = 'sync pong'
    developer_mode = true

  }

})
