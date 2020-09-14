var game;
var gameShowing;
var model;
var emitter;
var G;
var controller;
var isMobile;

window.onunhandledrejection = function (e) {
  console.log(e);
};

window.addEventListener("DOMContentLoaded", (event) => {
  try {
    Sentry.init({
      dsn:
        "https://c08842b9b59e4869b4ec8a599b5ece6c@o425938.ingest.sentry.io/5366875",
    });
  } catch (err) {
    console.log(err.message);
  }

  isMobile = navigator.userAgent.indexOf("Mobile");
  if (isMobile == -1) {
    isMobile = navigator.userAgent.indexOf("Tablet");
  }
  createNewGame(window.innerWidth, window.innerHeight, "control", -1, 1);

  var fsb = document.getElementById("fullscreen-btn");

  if (fsb) {
    if (isMobile !== -1) {
      fsb.style.display = "none";
    } else {
      fsb.addEventListener("click", startFullScreen);
    }
  }

  // document.getElementById("help-button").addEventListener("click", function () {
  //   alert("HELP");
  // });

  ///////PROGRESS REPORT LISTENERS

  var el = document.getElementById("progress-button");
  if (el) {
    el.addEventListener("click", showProgressReport);
  }
});

showProgressReport = function () {
  document
    .getElementsByClassName("progress-report")[0]
    .classList.add("progress-report-show");

  document
    .getElementById("exit-button")
    .addEventListener("click", hideProgressReport);

  const userName = model.getUserName() ? model.getUserName() : "";

  if (userName.length > 0) {
    document.getElementById("fname").value = userName;
    document.getElementById("name-submit-btn").style.display = "none";
    document.getElementById("fname").style.textAlign = "center";
    document.getElementById("fname").style.color = "#f9f9f9";
    document.getElementById("fname").style.backgroundColor = "#8ec099";
    var form = document.getElementById("name-form");
    var elements = form.elements;
    for (var i = 0, len = elements.length; i < len; ++i) {
      elements[i].readOnly = true;
    }
  }

  document.getElementById("name-form").addEventListener("submit", onNameSubmit);

  let totalTime = model.totalTimeSpentGraphing();
  let timeMin = 0;

  while (totalTime >= 60) {
    totalTime -= 60;
    timeMin++;
  }

  document.getElementById("time-minutes").innerHTML = Math.round(timeMin);
  document.getElementById("time-seconds").innerHTML = Math.round(totalTime);

  const world1_1 = model.numLevelsBeatenForControlWorld(1);
  const world1_2 = model.numLevelsBeatenForControlWorld(2);
  const world1_3 = model.numLevelsBeatenForControlWorld(3);
  const world1_4 = model.numLevelsBeatenForControlWorld(4);

  document.getElementById("control-x-h").innerHTML = world1_1 + " / 10";
  document.getElementById("control-x-v").innerHTML = world1_3 + " / 10";
  document.getElementById("control-v-h").innerHTML = world1_2 + " / 8";
  document.getElementById("control-v-v").innerHTML = world1_4 + " / 8";

  const world2_1 = model.numLevelsBeatenForInputWorld(1);
  const world2_2 = model.numLevelsBeatenForInputWorld(2);
  const world2_3 = model.numLevelsBeatenForInputWorld(3);
  const world2_4 = model.numLevelsBeatenForInputWorld(4);

  document.getElementById("input-x-v").innerHTML = world2_1 + " / 10";
  document.getElementById("input-x-a").innerHTML = world2_3 + " / 10";
  document.getElementById("input-v-v").innerHTML = world2_2 + " / 6";
  document.getElementById("input-v-a").innerHTML = world2_4 + " / 10";

  document.getElementById("total-beaten").innerHTML =
    world1_1 +
    world1_2 +
    world1_3 +
    world1_4 +
    world2_1 +
    world2_2 +
    world2_3 +
    world2_4 +
    " / 72";
};

hideProgressReport = function () {
  document
    .getElementsByClassName("progress-report")[0]
    .classList.remove("progress-report-show");

  document
    .getElementById("exit-button")
    .removeEventListener("click", hideProgressReport);

  document
    .getElementById("name-form")
    .removeEventListener("submit", onNameSubmit);
};

onNameSubmit = function (e) {
  e.preventDefault();
  const enteredName = document.getElementById("fname").value;
  model.setUserName(enteredName);
  document.getElementById("name-submit-btn").style.display = "none";
  document.getElementById("fname").style.textAlign = "center";
  document.getElementById("fname").style.color = "#f9f9f9";
  document.getElementById("fname").style.backgroundColor = "#8ec099";
  var form = document.getElementById("name-form");
  var elements = form.elements;
  for (var i = 0, len = elements.length; i < len; ++i) {
    elements[i].readOnly = true;
  }
};

createNewGame = function (
  innerWidth,
  innerHeight,
  activeMode,
  activeWorldNum,
  activeLevelNum
) {
  gameShowing = true;

  var sceneList =
    activeWorldNum === -1 ? [SceneMenu, SceneMain] : [SceneMain, SceneMenu];

  if (isMobile == -1 || innerWidth > innerHeight) {
    //DESKTOP
    var config = {
      type: Phaser.AUTO,
      width: 1000,
      height: 700,
      physics: {
        default: "matter",
        matter: {
          // debug: true,
          // debugBodyColor: 0xffffff,
        },
      },
      transparent: true,
      scale: {
        mode: Phaser.Scale.FIT,
        parent: "phaser-game",
        autoCenter: Phaser.Scale.CENTER_VERTICALLY,
      },

      scene: sceneList,
    };
  } else {
    //MOBILE
    let gameWidth, gameHeight;

    if (innerWidth > innerHeight * (1000 / 700)) {
      //aspect ratio too wide
      gameHeight = 0.95 * innerHeight;
      gameWidth = (gameHeight * 1000) / 700;
    } else {
      // aspect ratio OK, scretch game to fill screen 95%
      gameWidth = 0.95 * innerWidth;
      gameHeight = 0.95 * innerHeight;
    }

    var config = {
      type: Phaser.AUTO,
      width: gameWidth,
      height: gameHeight,
      parent: "phaser-game",
      physics: {
        default: "matter",
        matter: {
          // debug: true,
          // debugBodyColor: 0xffffff,
        },
      },
      transparent: true,
      scale: {
        // mode: Phaser.Scale.FIT,
        // parent: "game-container",
        // autoCenter: Phaser.Scale.CENTER_BOTH,
      },

      scene: sceneList,
    };
  }

  G = new Constants();
  model = new Model();
  model.mode = activeMode;
  model.activeWorld = activeWorldNum;
  model.activeLevel = activeLevelNum;
  model.isMobile = isMobile;
  game = new Phaser.Game(config);

  //if on mobile, allow scroll
  if (isMobile !== null && isMobile !== -1) {
    if (game.input.touch) {
      game.input.touch.capture = false;
    }
  } else if (isMobile === -1) {
    document.getElementById("phaser-game").style.height = "700px"; // to keep the game the same width as the container on window resizing (???phaser???)
  }
};

startFullScreen = function () {
  if (game.scene.game.scale.fullscreen.available) {
    document.getElementById("phaser-game").style.width = "100vw";
    document.getElementById("phaser-game").style.height = "100vh";
    game.scene.game.scale.startFullscreen();

    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("mozfullscreenchange", exitHandler);
    document.addEventListener("MSFullscreenChange", exitHandler);

    function exitHandler() {
      if (
        !document.fullscreenElement &&
        !document.webkitIsFullScreen &&
        !document.mozFullScreen &&
        !document.msFullscreenElement
      ) {
        document.getElementById("phaser-game").style.width = "100%";
        document.getElementById("phaser-game").style.height = "700px";
      }
    }
  }
};

destroyGame = function () {
  game.destroy(true);
  gameShowing = false;
};

reloadGame = function (width, height) {
  if (!gameShowing) {
    createNewGame(
      width,
      height,
      model.mode,
      model.activeWorld,
      model.activeLevel
    );
  }
};

window.addEventListener("orientationchange", function () {
  destroyGame();
  setTimeout(function () {
    reloadGame(window.innerWidth, window.innerHeight);
  }, 1000);
});

showTutorialModal = function () {};
