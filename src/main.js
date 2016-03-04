'use strict';

const electron = require('electron');
const app = electron.app; 
const BrowserWindow = electron.BrowserWindow;
const ipcMain=require('electron').ipcMain;


var mainWindow;
var winOptions;
var mainWindowShown=false;
var displaySize;
var wa;


/* Managing App Events */

app.on('window-all-closed', function() {
  app.quit();  
});

app.on('ready', function() {  
  // Getting display clicked
  var electronScreen = electron.screen;
  
   // OPT 1 win near mouse 
  var mousePointer=electronScreen.getCursorScreenPoint();
  var display = electronScreen.getDisplayNearestPoint(mousePointer);
  
  console.log(electronScreen.getAllDisplays());
  
  // OPT 2: Find primary display
  //var display=electronScreen.getPrimaryDisplay();
  
  // OPT 3: Find primary display
  var display=(electronScreen.getAllDisplays())[1];
  
  // Getting Workarea and displat size
  wa=display.workArea;
  var size = display.workAreaSize;
  
  
  //console.log(electronScreen.getPrimaryDisplay());
  //console.log("*************");
  console.log(wa);
  
  console.log(size);
  displaySize=size;
  
  // Create the browser window options and window
  var winOptions={
    x: wa.x,
    y: wa.y,
    
    width: 1,
    /*width: 1024,*/
    height: wa.height-24,
    alwaysOnTop: true,
    skipTaskbar: true,
    frame: false,
    resizable: false,
    transparent: true//,
    //type:"dock"
  };
  mainWindow = new BrowserWindow(winOptions);
  
    // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/app/main.html`);
  

  
  // Open the DevTools.
  mainWindow.setSize(1400, displaySize.height-64);
  mainWindow.webContents.openDevTools();
  
  

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object
    mainWindow = null;
  }); 
  
});
  
  
/* Managing comunication with App Window  */

ipcMain.on('synchronous-message', function(event, arg) {
  //console.log(event);
  console.log(arg);  // prints "ping"
  //var h=mainWindow.getSize()[1];
  
  if (arg=="show" && !mainWindowShown) {
    //mainWindow.setSize(displaySize.width/2, displaySize.height-64);
    //mainWindow.setSize(wa.width/2, wa.height); // Half screen
    mainWindow.setSize(wa.width, wa.height-24); // Full Screen
    mainWindow.setAlwaysOnTop(true);
    mainWindowShown=true;
    event.returnValue = 'shown';
  } else{
    event.returnValue = 'hidden';
    mainWindow.setSize(1, wa.height-24);
    mainWindow.focus();
    mainWindowShown=false;
  }
 
});



