class ControlBar extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.scene.add.existing(this);

    this.emitter = config.emitter;

    this.worldNum = config.worldNum;

    this.setVelocity = this.worldNum === 1 || this.worldNum === 2;
    this.setAcceleration = !this.setVelocity;

    this.x0 = config.posX;
    this.y0 = config.posY;

    this.portraitMode = config.portraitMode;

    this.width = config.width;
	this.height = this.portraitMode ? 1.5 * config.height : config.height;
	
	this.bgColor = 0xfcf3ca; //light yellow
	this.strokeColor = 0x2c3234; //space gray

    this.graphPlaying = false;

    this.numSelectorInfo = config.numSelectorInfo;

    this.maxTime = config.maxTime;

    this.drawBackground();
    this.createPlayButton();

    if (this.setVelocity) {
      this.createVelocitySelectors();
    } else if (this.setAcceleration) {
      this.createAccelerationSelectors();
      this.createInitialVelocitySelector();
    }

    this.createTimeSelectors();

    this.time1 = -1;
    this.time2 = -1;

    this.velocity1 = 0;
    this.velocity2 = 0;

    this.acceleration1 = 0;
    this.acceleration2 = 0;

    this.initialVelocity = 0;

    this.emitter.on(G.LEVEL_BEATEN, this.levelBeaten);
  }

  drawBackground() {
	TextureHelpers.createRectTexture(this.scene, "control-bar-bg", this.bgColor);
	this.bg = this.scene.add.image(this.x0, this.y0, "control-bar-bg").setOrigin(0);
	this.bg.setDisplaySize(this.width, this.height);

	TextureHelpers.createRectTexture(this.scene, "control-bar-outline", this.strokeColor);
	this.bgOutline = this.scene.add.image(this.x0, this.y0, "control-bar-outline").setOrigin(0);
	this.bgOutline.setDisplaySize(this.width, 3);

    this.add([this.bg, this.bgOutline]);
  }

  createPlayButton() {
    this.playBtn = new UIButton({
      scene: this.scene,
      key: "play-btn",
      event: G.PLAY_PRESSED,
      defaultAlpha: 1,
    });

    this.add(this.playBtn);

    const playScale = this.portraitMode ? 0.65 : 0.85;

    this.scaleToFit(this.playBtn, playScale);

    this.playBtn.x = 0.5 * this.width;
    this.playBtn.y = this.y0 + 0.5 * this.height;

    this.emitter.on(G.PLAY_PRESSED, this.playPressed, this);
    this.emitter.on(G.RESET_PRESSED, this.resetPressed, this);
  }

  createTimeSelectors() {
    this.timeSelector1 = new SelectorPanel({
      scene: this.scene,
      emitter: this.emitter,
      key: "time",
      heading: "at time: ",
      event: G.TIME_1_UPDATED,
      centerOnZero: false,
      minVal: -1,
      maxVal: this.maxTime - 1,
      units: "s",
      selectionOffsetX: 92,
      selectionBGOffsetX: 42,
      selectionBGWidth: 150,
    });

    this.timeSelector2 = new SelectorPanel({
      scene: this.scene,
      emitter: this.emitter,
      key: "time",
      heading: "at time: ",
      event: G.TIME_2_UPDATED,
      centerOnZero: false,
      minVal: -1,
      maxVal: this.maxTime - 1,
      units: "s",
      selectionOffsetX: 92,
      selectionBGOffsetX: 42,
      selectionBGWidth: 150,
    });

    let scaleY;

    if (this.setAcceleration) {
      if (this.portraitMode) {
        scaleY = 0.28;
      } else {
        scaleY = 0.43;
      }
    } else {
      if (this.portraitMode) {
        scaleY = 0.32;
      } else {
        scaleY = 0.48;
      }
    }

    this.add(this.timeSelector1);
    this.add(this.timeSelector2);

    this.scaleToFit(this.timeSelector1, scaleY);
    this.scaleToFit(this.timeSelector2, scaleY);

    const posOffsetX = this.setAcceleration ? -11 : 0;

    let ts1x, ts1y, ts2x, ts2y;

    if (this.portraitMode) {
      ts1x = 0.2 * this.width + posOffsetX;
      ts1y = this.y0 + 0.28 * this.height;

      ts2x = 0.8 * this.width + posOffsetX;
      ts2y = this.y0 + 0.28 * this.height;
    } else {
      ts1x = 0.1 * this.width + posOffsetX;
      ts1y = this.y0 + 0.5 * this.height;

      ts2x = 0.64 * this.width + posOffsetX;
      ts2y = this.y0 + 0.5 * this.height;
    }

    this.timeSelector1.x = ts1x;
    this.timeSelector1.y = ts1y;

    this.timeSelector2.x = ts2x;
    this.timeSelector2.y = ts2y;

    this.emitter.on(G.TIME_1_UPDATED, this.time1Updated, this);
    this.emitter.on(G.TIME_2_UPDATED, this.time2Updated, this);
  }

  createVelocitySelectors() {
    this.velocitySelector1 = new SelectorPanel({
      scene: this.scene,
      emitter: this.emitter,
      key: "velocity",
      heading: "set velocity: ",
      event: G.VELOCITY_1_UPDATED,
      centerOnZero: true,
      minVal: -5,
      maxVal: 5,
      units: "m/s",
      selectionOffsetX: 117,
      selectionBGOffsetX: 68,
      selectionBGWidth: 215,
    });

    this.velocitySelector2 = new SelectorPanel({
      scene: this.scene,
      emitter: this.emitter,
      key: "velocity",
      heading: "set velocity: ",
      event: G.VELOCITY_2_UPDATED,
      centerOnZero: true,
      minVal: -5,
      maxVal: 5,
      units: "m/s",
      selectionOffsetX: 117,
      selectionBGOffsetX: 68,
      selectionBGWidth: 215,
    });

    this.add(this.velocitySelector1);
    this.add(this.velocitySelector2);

    const scaleY = this.portraitMode ? 0.32 : 0.48;

    this.scaleToFit(this.velocitySelector1, scaleY);
    this.scaleToFit(this.velocitySelector2, scaleY);

    let vs1x, vs1y, vs2x, vs2y;

    if (this.portraitMode) {
      vs1x = 0.2 * this.width;
      vs1y = this.y0 + 0.72 * this.height;

      vs2x = 0.8 * this.width;
      vs2y = this.y0 + 0.72 * this.height;
    } else {
      vs1x = 0.326 * this.width;
      vs1y = this.y0 + 0.5 * this.height;

      vs2x = 0.866 * this.width;
      vs2y = this.y0 + 0.5 * this.height;
    }

    this.velocitySelector1.x = vs1x;
    this.velocitySelector1.y = vs1y;

    this.velocitySelector2.x = vs2x;
    this.velocitySelector2.y = vs2y;

    this.emitter.on(G.VELOCITY_1_UPDATED, this.velocity1Updated, this);
    this.emitter.on(G.VELOCITY_2_UPDATED, this.velocity2Updated, this);
  }

  createAccelerationSelectors() {
    this.accelerationSelector1 = new SelectorPanel({
      scene: this.scene,
      emitter: this.emitter,
      key: "acceleration",
      heading: "set acceleration: ",
      event: G.ACCELERATION_1_UPDATED,
      centerOnZero: true,
      minVal: -5,
      maxVal: 5,
      units: `m/s²`,
      selectionOffsetX: 115,
      selectionBGOffsetX: 138,
      selectionBGWidth: 215,
    });

    this.accelerationSelector2 = new SelectorPanel({
      scene: this.scene,
      emitter: this.emitter,
      key: "acceleration",
      heading: "set acceleration: ",
      event: G.ACCELERATION_2_UPDATED,
      centerOnZero: true,
      minVal: -5,
      maxVal: 5,
      units: `m/s²`,
      selectionOffsetX: 115,
      selectionBGOffsetX: 138,
      selectionBGWidth: 215,
    });

    this.add(this.accelerationSelector1);
    this.add(this.accelerationSelector2);

    const scaleY = this.portraitMode ? 0.28 : 0.43;

    this.scaleToFit(this.accelerationSelector1, scaleY);
    this.scaleToFit(this.accelerationSelector2, scaleY);

    let as1x, as1y, as2x, as2y;

    if (this.portraitMode) {
      as1x = 0.21 * this.width;
      as1y = this.y0 + 0.72 * this.height;

      as2x = 0.79 * this.width;
      as2y = this.y0 + 0.72 * this.height;
    } else {
      as1x = 0.326 * this.width - 11;
      as1y = this.y0 + 0.5 * this.height;

      as2x = 0.866 * this.width - 11;
      as2y = this.y0 + 0.5 * this.height;
    }

    this.accelerationSelector1.x = as1x;
    this.accelerationSelector1.y = as1y;

    this.accelerationSelector2.x = as2x;
    this.accelerationSelector2.y = as2y;

    this.emitter.on(G.ACCELERATION_1_UPDATED, this.acceleration1Updated, this);
    this.emitter.on(G.ACCELERATION_2_UPDATED, this.acceleration2Updated, this);
  }

  createInitialVelocitySelector() {
    this.initialVelocitySelector = new SelectorPanel({
      scene: this.scene,
      emitter: this.emitter,
      key: "initial-velocity",
      heading: "initial velocity: ",
      event: G.INITIAL_VELOCITY_UPDATED,
      centerOnZero: true,
      minVal: -6,
      maxVal: 6,
      units: "m/s",
      selectionOffsetX: 113,
      selectionBGOffsetX: 105,
      selectionBGWidth: 215,
    });

    this.add(this.initialVelocitySelector);

    const scaleY = this.portraitMode ? 0.3 : 0.44;

    this.scaleToFit(this.initialVelocitySelector, scaleY);

    let ivsx, ivsy;

    if (this.portraitMode) {
      ivsx = 0.215 * this.width;
      ivsy = this.y0 + 1.3 * this.height;
    } else {
      ivsx = 0.137 * this.width;
      ivsy = this.y0 + 1.4 * this.height;
    }

    this.initialVelocitySelector.x = ivsx;
    this.initialVelocitySelector.y = ivsy;

    this.emitter.on(
      G.INITIAL_VELOCITY_UPDATED,
      this.initialVelocityUpdated,
      this
    );
  }

  time1Updated(newTime) {
    if (newTime >= 0 && newTime === this.time2) {
      if (this.setVelocity) {
        this.velocitySelector1.alpha = 0.5;
      } else this.accelerationSelector1.alpha = 0.5;
      this.timeSelector1.alpha = 0.5;
    } else {
      if (this.setVelocity) {
        this.velocitySelector1.alpha = 1;
      } else this.accelerationSelector1.alpha = 1;
      this.timeSelector1.alpha = 1;
    }
    this.time1 = newTime;
  }

  time2Updated(newTime) {
    if (newTime >= 0 && newTime === this.time1) {
      if (this.setVelocity) {
        this.velocitySelector1.alpha = 0.5;
      } else this.accelerationSelector1.alpha = 0.5;
      this.timeSelector1.alpha = 0.5;
    } else {
      if (this.setVelocity) {
        this.velocitySelector1.alpha = 1;
      } else this.accelerationSelector1.alpha = 1;
      this.timeSelector1.alpha = 1;
    }
    this.time2 = newTime;
  }

  velocity1Updated(newVelocity) {}

  velocity2Updated(newVelocity) {}

  acceleration1Updated(newAcceleration) {
    this.accelerationSelector1.setDepth(1);
  }

  acceleration2Updated(newAcceleration) {}

  initialVelocityUpdated(newVelocity) {}

  playPressed() {
    if (this.graphPlaying) {
      //reset
      this.emitter.emit(G.RESET_PRESSED);
    } else {
      //play
      this.graphPlaying = true;
      this.playBtn.setBtnTexture("reset-btn");
    }
  }

  resetPressed() {
    this.graphPlaying = false;
    this.playBtn.setBtnTexture("play-btn");
  }

  scaleToFit(component, scale) {
    component.setDisplayHeight(scale * this.height);
  }

  levelBeaten() {
    //model.levelsBeaten....
  }

  resetAllSelectors() {
    this.timeSelector1.reset();
    this.timeSelector2.reset();

    if (this.setVelocity) {
      this.velocitySelector1.reset();
      this.velocitySelector2.reset();
    } else {
      this.accelerationSelector1.reset();
      this.accelerationSelector2.reset();
      this.initialVelocitySelector.reset();
    }
  }

  setForLevelNum(num) {
    this.resetAllSelectors();

    const numSelectors = this.numSelectorInfo[num - 1];

    if (numSelectors === 0) {
      this.timeSelector1.visible = false;
      this.timeSelector2.visible = false;

      if (this.setVelocity) {
        this.velocitySelector1.visible = false;
        this.velocitySelector2.visible = false;
      } else {
        this.accelerationSelector1.visible = false;
        this.accelerationSelector2.visible = false;
        this.initialVelocitySelector.visible = false;
      }
    } else if (numSelectors === 1) {
      this.timeSelector1.visible = true;
      this.timeSelector2.visible = false;

      if (this.setVelocity) {
        this.velocitySelector1.visible = true;
        this.velocitySelector2.visible = false;
      } else {
        this.accelerationSelector1.visible = true;
        this.accelerationSelector2.visible = false;
        this.initialVelocitySelector.visible = false;
      }
    } else if (numSelectors === 2) {
      if (this.setVelocity) {
        this.velocitySelector1.visible = true;
        this.velocitySelector2.visible = true;
        this.timeSelector1.visible = true;
        this.timeSelector2.visible = true;
      } else {
        this.accelerationSelector1.visible = true;
        this.timeSelector1.visible = true;

        this.accelerationSelector2.visible = false;
        this.timeSelector2.visible = false;

        this.initialVelocitySelector.visible = true;
      }
    } else {
      //3
      this.timeSelector1.visible = true;
      this.timeSelector2.visible = true;
      this.accelerationSelector1.visible = true;
      this.accelerationSelector2.visible = true;
      this.initialVelocitySelector.visible = true;
    }
  }
}
