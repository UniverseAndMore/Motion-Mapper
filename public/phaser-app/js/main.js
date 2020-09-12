var game;
var gameShowing;
var model;
var emitter;
var G;
var controller;
var isMobile;

window.onload = function () {
  Sentry.init({
    dsn:
      "https://c08842b9b59e4869b4ec8a599b5ece6c@o425938.ingest.sentry.io/5366875",
  });

  isMobile = navigator.userAgent.indexOf("Mobile");
  if (isMobile == -1) {
    isMobile = navigator.userAgent.indexOf("Tablet");
  }
  createNewGame(window.innerWidth, window.innerHeight, "control", -1, 1);

  if (isMobile !== -1) {
    document.getElementById("fullscreen-btn").style.display = "none";
  } else {
    document
      .getElementById("fullscreen-btn")
      .addEventListener("click", startFullScreen);
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
