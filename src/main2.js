'use strict';

const electron = require('electron');
const app = electron.app; 
const BrowserWindow = electron.BrowserWindow;
const ipcMain=require('electron').ipcMain;
const exec = require('child_process').exec;


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
  
  
  var mousePointer=electronScreen.getCursorScreenPoint();
  var display = electronScreen.getDisplayNearestPoint(mousePointer);
  wa=display.workArea;
  var size = display.workAreaSize;
  //var size = electronScreen.getPrimaryDisplay().workAreaSize;
  //console.log(electronScreen.getPrimaryDisplay());
  //console.log("*************");
  console.log(size);
  displaySize=size;
  
  // Create the browser window options and window
  var winOptions={
    x: wa.x,
    y: wa.y,
    width: 1,
    /*width: 1024,*/
    height: wa.height,
    alwaysOnTop: true,
    skipTaskbar: true,
    frame: false,
    resizable: false,
    transparent: true/*,
    /*type:"dock"*/
  };
  mainWindow = new BrowserWindow(winOptions);
  mainWindow.setVisibleOnAllWorkspaces(true);
  
    // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/app/main.html`);
  

  
  // Open the DevTools.
  //mainWindow.setSize(800, displaySize.height-64);
  //mainWindow.webContents.openDevTools();
  
  

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
    
    //mainWindow.setSize(wa.width, wa.height); // Full Screen
    //mainWindowShown=true;
    exec('wmctrl -a Electron', function(){
	    mainWindow.setSize(wa.width, wa.height); // Full Screen
	    mainWindowShown=true;

    });

    event.returnValue = 'shown';
  } else{
    event.returnValue = 'hidden';
    mainWindow.setSize(1, wa.height);
    mainWindow.focus();
    mainWindowShown=false;
  }
 
});



