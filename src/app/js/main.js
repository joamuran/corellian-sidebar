var $ = jquery = require('jquery');
require('jquery-ui');
const ipcRenderer = require('electron').ipcRenderer;

function WindowManager(){
    this.config=null;
    this.appManager=null;
    this.placesManager=null;
    
        
}

WindowManager.prototype.handleEvents=function handleEvents(){
    var self=this;
    // Timeout is used to provide a pause before show window
    // to allow undesired "show"
    var timeout; 
    
    // Hide and show bar when mouse in and out
    /*
     * COMMENT FOR DEBUG DEV TOOLS*/
    
    //return -1; // comentar en produccio per poder amagar finestra
     $(document).on({
        mouseenter: function() {
          if (timeout != null) { clearTimeout(timeout); }

            timeout = setTimeout(function () {
            
            color='rgba('+0+','+0+','+0+','+0.7+')';
            $("body").css({"background-color":color});
            console.log(ipcRenderer.sendSync('synchronous-message', 'show')); // prints "pong"
           console.log('in');
           
          }, 300);
           
           
        },
        mouseleave: function() {
          if (timeout != null) { 
           clearTimeout(timeout); 

           timeout = null;
           }  
            
           color='rgba('+0+','+0+','+0+','+0+')';
           $("body").css({"background-color":color});
           console.log(ipcRenderer.sendSync('synchronous-message', 'hide')); // prints "pong"
           console.log('out');
           
          }
        }, 'body');
    
    
    // Mouse over section buttons
    $(".mainEntry").bind("mouseover", function(){
        $(".SectionContainer").hide();
        var target=$(this).attr("target");
        console.log("Show: "+target);
        $("#"+target+"Container").trigger("cleanContainer");
        $("#"+target+"Container").show();
        console.log($("#"+target+"Container"));
    });
    
}
    
$(document)
  .keydown( // When hits esc, we'll hide window
    function(e) {
      if (e.keyCode=='27')
      {
         color='rgba('+0+','+0+','+0+','+0+')';
         $("body").css({"background-color":color});
           console.log(ipcRenderer.sendSync('synchronous-message', 'hide')); // prints "pong"
           console.log('out');
      }
    }
);

$(document).ready(function() {
        wm=new WindowManager();
        wm.handleEvents();
        
        wm.config=new Config();
        wm.appManager=new AppManager();
        wm.placesManager=new PlacesManager();
        wm.disksManager=new DisksManager();
        
        // Creating Apps Menu
        var categories=wm.config.getApplicationsMenu();
        wm.appManager.drawCategories(categories);
        wm.appManager.buildSearchArea();
        wm.appManager.bindEvents();
        
        // Creating Places Menu
        var places=wm.config.getPlaces();
        wm.config.getRecentFiles(function(response){
            console.log(response);
            wm.placesManager.drawRecent(response);
            });
        
        wm.placesManager.drawPlaces(places);
        
        
        
        // Adding Disks and partitions
        wm.disksManager.getDevices(function(disklist){
            wm.placesManager.drawDevices(disklist);
        });
        
        
        


   //$("#leftpanel").resizable({ handles: 'e' });
   
        
})





