class SceneMenu extends Phaser.Scene {
  constructor() {
    super("SceneMenu");

    this.isPortrait = false;
    this.isLandscape = true;
    this.svgScale = 2;
  }
  preload() {
    this.cameras.main.setBackgroundColor("#2c3234");

    if (!model.initialLoadComplete) {
      var width = this.cameras.main.width;
      var height = this.cameras.main.height;

      const boxWidth = 0.6 * game.config.width;
      const boxHeight = 0.16 * boxWidth;

      const barHeightRatio = 0.9; //what portion of the height of the box does the bar take up?

      var loadingBox = this.add.graphics();
      var loadingBar = this.add.graphics();
      loadingBox.fillStyle(0xffffff, 1);
      loadingBox.fillRect(
        0.5 * (width - boxWidth),
        0.5 * (height - boxHeight),
        boxWidth,
        boxHeight
      );

      var loadingText = this.make
        .text({
          x: width / 2,
          y: height / 2 - 1 * boxHeight,
          text: "Loading...",
          style: {
            font: "36px Montserrat",
            fill: "#f9f9f9",
          },
        })
        .setResolution(2.4);
      loadingText.setOrigin(0.5, 0.5);

      this.load.on("progress", function (value) {
        loadingBar.clear();
        loadingBar.fillStyle(0xfbec87, 1);
        loadingBar.fillRect(
          0.5 * width - 0.5 * boxWidth + 0.5 * boxHeight * (1 - barHeightRatio),
          0.5 * height - 0.5 * boxHeight * barHeightRatio,
          (boxWidth - boxHeight * (1 - barHeightRatio)) * value,
          boxHeight * barHeightRatio
        );
      });

      this.load.on("fileprogress", function (file) {});

      this.load.on("complete", function () {
        loadingBar.destroy();
        loadingBox.destroy();
        loadingText.destroy();
      });
    }

    this.load.svg(
      "horizontal",
      "phaser-app/assets/images/menuScene-images/horizontal.svg",
      { scale: this.svgScale }
    );
    this.load.svg(
      "about",
      "phaser-app/assets/images/menuScene-images/about.svg",
      { scale: this.svgScale }
    );
    this.load.image(
      "position-vs-time",
      "phaser-app/assets/images/menuScene-images/position-vs-time.png"
    );
    this.load.image(
      "velocity-vs-time",
      "phaser-app/assets/images/menuScene-images/velocity-vs-time.png"
    );
    // this.load.image(
    //   "sandbox",
    //   "phaser-app/assets/images/menuScene-images/sandbox.png"
    // );
    this.load.svg(
      "target-icon",
      "phaser-app/assets/images/menuScene-images/target-icon.svg"
    );
    this.load.svg(
      "target-icon-highlighted",
      "phaser-app/assets/images/menuScene-images/target-icon-highlighted.svg"
    );
    this.load.svg(
      "vertical",
      "phaser-app/assets/images/menuScene-images/vertical.svg",
      { scale: this.svgScale }
    );
    this.load.image("icon-sfx-on", "phaser-app/assets/images/icon-sfx-on.png");
    this.load.image(
      "icon-sfx-off",
      "phaser-app/assets/images/icon-sfx-off.png"
    );

    this.load.svg(
      "control-mode-on",
      "phaser-app/assets/images/menuScene-images/control-mode-on.svg",
      { scale: this.svgScale }
    );
    this.load.svg(
      "control-mode-off",
      "phaser-app/assets/images/menuScene-images/control-mode-off.svg",
      { scale: this.svgScale }
    );
    this.load.svg(
      "input-mode-on",
      "phaser-app/assets/images/menuScene-images/input-mode-on.svg",
      { scale: this.svgScale }
    );

    this.load.svg(
      "input-mode-off",
      "phaser-app/assets/images/menuScene-images/input-mode-off.svg",
      { scale: this.svgScale }
    );

    this.load.svg(
      "set-velocity",
      "phaser-app/assets/images/menuScene-images/set-velocity.svg",
      { scale: this.svgScale }
    );

    this.load.svg(
      "set-acceleration",
      "phaser-app/assets/images/menuScene-images/set-acceleration.svg",
      { scale: this.svgScale }
    );

    //////AUDIO
    // this.load.audio("bg-music", "phaser-app/assets/sounds/bg-music.mp3");
    this.load.audio("button-down", "phaser-app/assets/sounds/button-down.mp3");
    this.load.audio("button-up", "phaser-app/assets/sounds/button-up.mp3");

    this.load.json("level-data", "phaser-app/data/gameData.json");
  }

  create() {
    model.activeWorld = -1;
    model.numLevelsInWorld = 0;

    this.cameras.main.setBackgroundColor("#2c3234");

    emitter = new Phaser.Events.EventEmitter();
    emitter.on("start_world", this.startLevel, this);
    emitter.on("show_about", this.showAbout, this);
    // emitter.on("toggle_music", this.toggleMusic, this);
    emitter.on("toggle_sfx", this.toggleSFX, this);
    emitter.on("set_mode", this.setMode, this);

    controller = new Controller();

    var mediaManager = new MediaManager({
      scene: this,
    });

    if (!model.initialLoadComplete) {
      // mediaManager.setBackgroundMusic("bg-music");
      model.initialLoadComplete = true;
    }

    if (game.config.width <= game.config.height) {
      this.isPortrait = true;
      this.isLandscape = false;
    } else {
      this.isPortrait = false;
      this.isLandscape = true;
    }

    this.startingWorld = false;

    this.setLayoutConstants();
    this.createElements();
    this.positionAndScaleElements();
  }

  createElements() {
    const modeHeadingPath =
      model.mode === "control" ? "control-mode-off" : "input-mode-off";
    this.modeHeading = this.add.image(0, 0, modeHeadingPath);

    const heading1Path =
      model.mode === "control" ? "horizontal" : "set-velocity";
    const heading2Path =
      model.mode === "control" ? "vertical" : "set-acceleration";

    this.heading1 = this.add.image(0, 0, heading1Path);
    this.heading2 = this.add.image(0, 0, heading2Path);

    this.posBtn1 = new UIButton({
      scene: this,
      key: "position-vs-time",
      event: "start_world",
      params: { world: 1 },
    });
    this.velBtn1 = new UIButton({
      scene: this,
      key: "velocity-vs-time",
      event: "start_world",
      params: { world: 2 },
    });

    this.posBtn2 = new UIButton({
      scene: this,
      key: "position-vs-time",
      event: "start_world",
      params: { world: 3 },
    });
    this.velBtn2 = new UIButton({
      scene: this,
      key: "velocity-vs-time",
      event: "start_world",
      params: { world: 4 },
    });

    this.levelData = this.cache.json.get("level-data");

    this.progressInfo = [];
    this.targetIcons = [];
    for (var i = 0; i < 4; i++) {
      let numLevelsInWorld;
      if (model.mode === "control") {
        numLevelsInWorld = this.levelData.modes.control.worlds[i].levelData
          .length;
      } else {
        numLevelsInWorld = this.levelData.modes.input.worlds[i].levelData
          .length;
      }

      const textLabel = this.add.text(
        0,
        0,
        model.numLevelsBeatenForWorld(i + 1) + "/" + numLevelsInWorld,
        {
          fontSize: "42px",
          fontFamily: "Arial",
        }
      );
      textLabel.setOrigin(0, 0.5);
      this.progressInfo.push(textLabel);
      textLabel.scale = this.cameras.main.width / 1000;
      this.targetIcons.push(
        this.add.image(0, 0, "target-icon").setScale(0.7 / this.svgScale)
      );
      if (numLevelsInWorld === model.numLevelsBeatenForWorld(i + 1)) {
        this.targetIcons[i].setTexture("target-icon-highlighted");
      }
    }

    this.dividerLine = this.add.graphics();
    this.dividerLine.lineStyle(1, 0xfcf3ca);

    const controlKey =
      model.mode === "control" ? "control-mode-on" : "control-mode-off";
    const inputKey =
      model.mode === "input" ? "input-mode-on" : "input-mode-off";

    this.controlModeBtn = new UIButton({
      scene: this,
      key: controlKey,
      event: "set_mode",
      params: "control",
    });

    this.inputModeBtn = new UIButton({
      scene: this,
      key: inputKey,
      event: "set_mode",
      params: "input",
    });

    this.about = new UIButton({
      scene: this,
      key: "about",
      event: "show_about",
    });
    this.about.setOrigin(1, 1);

    this.about.setVisible(false);

    this.sfx = new UIButton({
      scene: this,
      key: "icon-sfx",
      event: "toggle_music",
      toggle: true,
    });
    this.sfx.setOrigin(0, 1);
  }

  setLayoutConstants() {
    if (this.isLandscape) {
      //landscape layout rules (side by side sections)
      this.modeHeadingWidth = 0.4 * game.config.width;
      this.headingCenterOffsetX = 0.25 * game.config.width;
      this.heading1y = 0.3 * game.config.height;
      this.heading2y = this.heading1y;
      this.headingWidth = 0.3 * game.config.width;
      this.posBtnWidth = 0.18 * game.config.width;
      this.levelBtnOffset = 0.1 * game.config.width;
      this.headingMarginBot = 0.15 * game.config.height;
      this.dividerX1 = 0.5 * game.config.width;
      this.dividerY1 = 0.25 * game.config.height;
      this.dividerX2 = this.dividerX1;
      this.dividerY2 = 0.7 * game.config.height;
      this.dividerX3 = 0.06 * game.config.width;
      this.dividerY3 = 0.7 * game.config.height;
      this.dividerX4 = 0.94 * game.config.width;
      this.dividerY4 = this.dividerY3;
      this.modeBtnOffsetX = 0.16;
      this.modeBtnY = 0.84 * game.config.height;
      this.modeBtnWidth = 0.24 * game.config.width;
      this.bottomBtnScale = 0.65;
    } else if (this.isPortrait) {
      //portrait layout rules
      this.modeHeadingWidth = 0.6 * game.config.width;
      this.headingCenterOffsetX = 0;
      this.heading1y = 0.22 * game.config.height;
      this.heading2y = 0.53 * game.config.height;
      this.headingWidth = 0.5 * game.config.width;
      this.posBtnWidth = 0.25 * game.config.width;
      this.levelBtnOffset = 0.17 * game.config.width;
      this.headingMarginBot = 0.1 * game.config.height;
      this.dividerX1 = 0.32 * game.config.width;
      this.dividerY1 = this.heading2y - 0.065 * game.config.height;
      this.dividerX2 = 0.68 * game.config.width;
      this.dividerY2 = this.dividerY1;
      this.modeBtnOffsetX = 0.22;
      this.modeBtnY = 0.83 * game.config.height;
      this.modeBtnWidth = 0.34 * game.config.width;
      this.bottomBtnScale = 1;
    } else {
      console.log("error determining screen orientation");
    }
  }

  positionAndScaleElements() {
    this.modeHeading.x = 0.5 * game.config.width;
    this.modeHeading.displayWidth = this.modeHeadingWidth;
    this.modeHeading.scaleY = this.modeHeading.scaleX;
    this.modeHeading.y =
      0.67 * this.modeHeading.height * this.modeHeading.scale;

    this.heading1.x = 0.5 * game.config.width - this.headingCenterOffsetX;
    this.heading1.y = this.heading1y;
    this.heading1.scaleX = this.headingWidth / this.heading1.width;
    this.heading1.scaleY = this.heading1.scaleX;

    this.heading2.x = 0.5 * game.config.width + this.headingCenterOffsetX;
    this.heading2.y = this.heading2y;
    this.heading2.displayWidth = this.headingWidth;
    this.heading2.scaleY = this.heading2.scaleX;

    this.posBtn1.x = this.heading1.x - this.levelBtnOffset;
    this.posBtn1.y = this.heading1.y + this.headingMarginBot;

    this.velBtn1.x = this.heading1.x + this.levelBtnOffset;
    this.velBtn1.y = this.posBtn1.y;

    this.posBtn2.x = this.heading2.x - this.levelBtnOffset;
    this.posBtn2.y = this.heading2.y + this.headingMarginBot;

    this.velBtn2.x = this.heading2.x + this.levelBtnOffset;
    this.velBtn2.y = this.posBtn2.y;

    this.posBtn1.setDisplayWidth(this.posBtnWidth);
    this.velBtn1.setDisplayWidth(this.posBtnWidth);
    this.posBtn2.setDisplayWidth(this.posBtnWidth);
    this.velBtn2.setDisplayWidth(this.posBtnWidth);

    // this.posBtn1.scaleY = this.posBtn1.scaleX;
    // this.velBtn1.scaleY = this.velBtn1.scaleX;
    // this.posBtn2.scaleY = this.posBtn2.scaleX;
    // this.velBtn2.scaleY = this.velBtn2.scaleX;

    this.positionAndScaleLevelInfo();

    this.dividerLine.moveTo(this.dividerX1, this.dividerY1);
    this.dividerLine.lineTo(this.dividerX2, this.dividerY2);
    this.dividerLine.strokePath();

    if (this.isLandscape) {
      this.dividerLine.moveTo(this.dividerX3, this.dividerY3);
      this.dividerLine.lineTo(this.dividerX4, this.dividerY4);
      this.dividerLine.strokePath();
    }

    this.controlModeBtn.x = (0.5 - this.modeBtnOffsetX) * game.config.width;
    this.controlModeBtn.setDisplayWidth(1.06 * this.modeBtnWidth);
    this.controlModeBtn.y = this.modeBtnY;
    this.controlModeBtn.scaleY = this.controlModeBtn.scaleX;

    this.inputModeBtn.x = (0.5 + this.modeBtnOffsetX) * game.config.width;
    this.inputModeBtn.setDisplayWidth(this.modeBtnWidth);
    this.inputModeBtn.y = this.modeBtnY;
    this.inputModeBtn.scaleY = this.inputModeBtn.scaleX;

    this.sfx.x = 0.04 * game.config.width;
    this.sfx.y = 0.965 * game.config.height;
    this.sfx.scale = this.bottomBtnScale;
    this.about.x = 0.965 * game.config.width;
    this.about.y = 0.96 * game.config.height;
    this.about.scale = this.bottomBtnScale / 1.2;
  }

  positionAndScaleLevelInfo() {
    const btnArray = [this.posBtn1, this.velBtn1, this.posBtn2, this.velBtn2];

    for (var i = 0; i < this.targetIcons.length; i++) {
      const totalLabelWidth =
        1.6 * this.targetIcons[i].width * this.targetIcons[i].scale +
        this.progressInfo[i].width * this.progressInfo[i].scale;

      this.targetIcons[i].x =
        btnArray[i].x -
        0.5 * totalLabelWidth +
        0.5 * this.targetIcons[i].width * this.targetIcons[i].scale;
      this.targetIcons[i].y =
        btnArray[i].y +
        0.7 * btnArray[i].getHeight() +
        0.5 * this.targetIcons[i].height * this.targetIcons[i].scale;

      this.progressInfo[i].x =
        this.targetIcons[i].x +
        0.5 * totalLabelWidth -
        0.5 * this.progressInfo[i].width * this.progressInfo[i].scale;
      this.progressInfo[i].y = this.targetIcons[i].y;
    }
  }

  setMode(newMode) {
    if (model.mode === newMode) return;

    model.mode = newMode;

    if (newMode === "control") {
      this.modeHeading.setTexture("control-mode-off");
      this.heading1.setTexture("horizontal");
      this.heading2.setTexture("vertical");
      this.controlModeBtn.setBtnTexture("control-mode-on");
      this.inputModeBtn.setBtnTexture("input-mode-off");
    } else {
      this.modeHeading.setTexture("input-mode-off");
      this.heading1.setTexture("set-velocity");
      this.heading2.setTexture("set-acceleration");
      this.controlModeBtn.setBtnTexture("control-mode-off");
      this.inputModeBtn.setBtnTexture("input-mode-on");
    }

    for (var i = 0; i < this.progressInfo.length; i++) {
      let numLevelsInWorld;
      if (newMode === "control") {
        numLevelsInWorld = this.levelData.modes.control.worlds[i].levelData
          .length;
      } else {
        numLevelsInWorld = this.levelData.modes.input.worlds[i].levelData
          .length;
      }

      this.progressInfo[i].setText(
        model.numLevelsBeatenForWorld(i + 1) + "/" + numLevelsInWorld
      );
      if (numLevelsInWorld === model.numLevelsBeatenForWorld(i + 1)) {
        this.targetIcons[i].setTexture("target-icon-highlighted");
      } else this.targetIcons[i].setTexture("target-icon");
    }

    this.positionAndScaleLevelInfo();
  }

  ///// BUTTON LISTENERS
  startLevel(levelInfo) {
    if (this.startingWorld) {
      return;
    }
    this.startingWorld = true;
    model.numLevelsInActiveWorld =
      model.mode === "control"
        ? this.levelData.modes.control.worlds[levelInfo.world - 1].levelData
            .length
        : this.levelData.modes.input.worlds[levelInfo.world - 1].levelData
            .length;
    model.activeWorld = levelInfo.world;

    this.scene.start("SceneMain");
  }

  showAbout() {
    console.log("Show about section");
  }

  toggleSFX() {
    console.log("Toggle SFX");
  }

  toggleMusic() {
    model.musicOn = !model.musicOn;
  }
}
