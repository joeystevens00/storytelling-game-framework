// Globals
var nextButton;
var pauseButton;
var playButton;
var defaultTextSpeed = 70;
var autoModeTimeOut;
var autoModeOff;
var interruptAutoMode = false;
var showTextTimeOut;
var showText = function (target, message, index, interval) {
  if (index < message.length)
  {
    $(target).append(message[index++]);
    showTextTimeOut = setTimeout(function () { showText(target, message, index, interval); }, interval);
  }
  else
  {
    finishedDisplayingText = true;
  }
}

var stopDisplayingText = function() {
    clearTimeout(showTextTimeOut);
};
// Creates a new scene
var newScene = function (text, image, sceneId) {
  setCurrentScene(sceneId);
  // Override the default mode if needed.
  checkMode(sceneId);

  // Prep the scene
  clearMsgBox();
  // Override prevents text from displaying in new scene if a selection is made before it finishes displaying
  //var override;
  //haltShowText ? override = true :  override = false;
  showText('#msg', text, 0, defaultTextSpeed);

  // Display the image
  document.querySelector("img.scene").src = 'img/' + image;

  // Display options if any
  displayOptions(sceneId);
}

// Displays options if there are any and deletes old options
var displayOptions = function(sceneId) {
  $("#listoptions").remove();
  $(".option").remove();
  if(lookup[sceneId].options)
  {
    $("#options").show();
    $("#options").append("<ul id='listoptions'>");
    lookup[sceneId].options.forEach(function(option) {
      $("#listoptions").append("<li><a href='#'  id=" + option.id + " class='option' target= " + option.scene + ">" + option.option + "</a></li>");
    });
    $(".option").on('click', function(e) {
      e.preventDefault();
      setCurrentScene(parseInt(this.target)-1);
      nextScene();
      return false;
    });
  }
}

// Goes to the next scene. Use to create a linear story with .next
var nextScene = function() {
  stopDisplayingText();
  var currentScene = getCurrentScene();
  var sceneText = lookup[currentScene+1].text;
  var sceneImage = lookup[currentScene+1].image;
  newScene(sceneText, sceneImage, currentScene+1);
}

// Fetches the current scene
var getCurrentScene = function() {
  return parseInt(document.querySelector("img.scene").id);
}
// Sets the current scene. Useful for non-linear stories
var setCurrentScene = function(id) {
  document.querySelector("img.scene").id = id;
}

// Clears the msg box text
var clearMsgBox = function() {
  document.querySelector("p#msg").innerHTML = "";
}

// Loads the scene. Inits the game
var loadScenes = function () {
  var startScene =  getCurrentScene();
  var sceneText = lookup[startScene].text;
  var sceneImage = lookup[startScene].image;
  newScene(sceneText, sceneImage, startScene);
}
var enableNextButton = function() {
  // When the user clicks on <span> (x), goto the next scene
  nextButton.style.display="";
  nextButton.onclick = function()
  {
    interruptAutoMode=true;
    nextScene();
  }
};
var checkMode = function(sceneId) {
  if(lookup[sceneId].mode)
  {
    setMode(lookup[sceneId].mode);
  }
};

var enablePlayButton = function() {
  // When the user clicks on <span> (x), goto the next scene
  playButton.style.display="";
  pauseButton.style.display="none";
  playButton.onclick = function()
  {
      nextScene();
      enablePauseButton();
  }
};

var enablePauseButton = function() {
  // When the user clicks on <span> (x), goto the next scene
  pauseButton.style.display="";
  playButton.style.display="none";
  pauseButton.onclick = function()
  {
      enablePlayButton();
      turnOffAutoMode();
  }
};
var checkMode = function(sceneId) {
  if(lookup[sceneId].mode)
  {
    setMode(lookup[sceneId].mode);
  }
};

var turnOnAutoMode = function() {
  Object.defineProperty(this, 'finishedDisplayingText', {
    configurable: true,
    get: function () { return myVar; },
    set: function (v) {
      myVar = v;
      if (autoModeOff == false)
      {
        autoModeTimeOut = setTimeout(function(){
            nextScene();
        }, config.wait);
      }
    }
  });
};
var turnOffAutoMode = function() {
    autoModeOff = true;
    clearTimeout(autoModeTimeOut);
};
// Set the mode
// Auto = Display text and go to the nextScene
// non-linear = Display text + Options and wait
// linear = Display text + show a nextScene arrow and wait
var setMode = function(mode) {
  config.mode = mode;
  if(mode == "linear")
  {
    playButton.style.display="none";
    pauseButton.style.display="none";
    turnOffAutoMode();

    enableNextButton();
  }
  else if (mode == "non-linear")
  {
    turnOffAutoMode();
    // Disable next button
    nextButton.style.display="none";
    pauseButton.style.display="none";
    playButton.style.display="none";
  }
  else if (mode == "auto")
  {
    autoModeOff = false;
    turnOnAutoMode();
    enableNextButton();
    enablePauseButton();
  }
  else
  {
      console.log("Invalid mode detected: " + mode);
  }
}

window.addEventListener("load", function load(event){
  nextButton = document.getElementsByClassName("next")[0];
  pauseButton = document.getElementsByClassName("pause")[0];
  playButton = document.getElementsByClassName("play")[0];
  config.mode = config.mode || "linear";
  config.wait = config.wait || 2000;
  if(document.readyState === 'complete') {
    $("#options").hide();
    playButton.style.display="none";
    loadScenes();

  }
});
