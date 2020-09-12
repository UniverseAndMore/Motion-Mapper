class SceneMain extends Phaser.Scene {
  constructor() {
    super("SceneMain");
  }

  preload() {
    this.cameras.main.setBackgroundColor("#2c3234");

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    const boxWidth = 0.6 * game.config.width;
    const boxHeight = 0.16 * boxWidth;

    const barHeightRatio = 0.9; //what portion of the height of the box does the loading bar take up?

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

    // this.anims.create({
    //   key: "loading-ring-spin",
    //   frames: this.anims.generateFrameNumbers("loading-ring"),
    //   frameRate: 12,
    //   repeat: -1,
    // });

    // var loadingRing = this.add.sprite(0, 0, "loading-ring");
    // loadingRing.setPosition(0.5 * width, 0.7 * height);
    // loadingRing.play("loading-ring-spin");

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
      // loadingRing.destroy();
    });

    this.load.image("block", "phaser-app/assets/images/block.png");
    this.load.image("block-smile", "phaser-app/assets/images/block-smile.png");
    this.load.image(
      "velocity-vector-body",
      "phaser-app/assets/images/velocity-vector-body.png"
    );
    this.load.image(
      "velocity-vector-head",
      "phaser-app/assets/images/velocity-vector-head.png"
    );
    this.load.image("vx-label", "phaser-app/assets/images/vx-label.png");
    this.load.image("vy-label", "phaser-app/assets/images/vy-label.png");
    this.load.image(
      "acceleration-vector-body",
      "phaser-app/assets/images/acceleration-vector-body.png"
    );
    this.load.image(
      "acceleration-vector-head",
      "phaser-app/assets/images/acceleration-vector-head.png"
    );
    this.load.image("ax-label", "phaser-app/assets/images/ax-label.png");
    this.load.image("ay-label", "phaser-app/assets/images/ay-label.png");
    this.load.image(
      "bar-back",
      "phaser-app/assets/images/progress-bar-back.png"
    );
    this.load.image(
      "bar-bot",
      "phaser-app/assets/images/progress-bar-bottom.png"
    );
    this.load.image(
      "bar-mid",
      "phaser-app/assets/images/progress-bar-middle.png"
    );
    this.load.image("bar-top", "phaser-app/assets/images/progress-bar-top.png");
    this.load.image("bar-lit", "phaser-app/assets/images/progress-bar-lit.png");
    this.load.image(
      "bar-glow",
      "phaser-app/assets/images/progress-bar-glow.png"
    );
    this.load.image("graph-spark", "phaser-app/assets/images/graph-spark.png");
    this.load.image("spark", "phaser-app/assets/particles/spark.png"); //spark trail for particles

    ////UI
    // this.load.image("icon-back", "phaser-app/assets/images/icon-back.png");
    // this.load.image("icon-info", "phaser-app/assets/images/icon-info.png");
    // this.load.image("icon-gear", "phaser-app/assets/images/icon-gear.png");

    // this.load.svg("play-btn", "phaser-app/assets/images/play-btn.svg", {
    //   scale: 2,
    // });
    // this.load.svg("reset-btn", "phaser-app/assets/images/reset-btn.svg", {
    //   scale: 2,
    // });

    // this.load.svg(
    //   "level-select-btn",
    //   "phaser-app/assets/images/level-select-btn.svg",
    //   {
    //     scale: 2,
    //   }
    // );

    this.load.svg("time-panel", "phaser-app/assets/images/time-panel.svg", {
      scale: 2,
    });
    this.load.svg(
      "time-panel-border",
      "phaser-app/assets/images/time-panel-border.svg",
      {
        scale: 2,
      }
    );

    this.load.svg(
      "velocity-panel",
      "phaser-app/assets/images/velocity-panel.svg",
      {
        scale: 2,
      }
    );
    this.load.svg(
      "velocity-panel-border",
      "phaser-app/assets/images/velocity-panel-border.svg",
      {
        scale: 2,
      }
    );

    this.load.svg(
      "initial-velocity-panel",
      "phaser-app/assets/images/initial-velocity-panel.svg",
      {
        scale: 2,
      }
    );
    this.load.svg(
      "initial-velocity-panel-border",
      "phaser-app/assets/images/initial-velocity-panel-border.svg",
      {
        scale: 2,
      }
    );

    this.load.svg(
      "acceleration-panel",
      "phaser-app/assets/images/acceleration-panel.svg",
      {
        scale: 2,
      }
    );
    this.load.svg(
      "acceleration-panel-border",
      "phaser-app/assets/images/acceleration-panel-border.svg",
      {
        scale: 2,
      }
    );

    this.load.spritesheet(
      "block-blink",
      "phaser-app/assets/images/block-blink-spritesheet.png",
      { frameWidth: 130, frameHeight: 130 }
    );

    this.load.spritesheet(
      "level-nums",
      "phaser-app/assets/images/level-nums-spritesheet.png",
      { frameWidth: 192, frameHeight: 100 }
    );

    this.load.svg(
      "completion-outline",
      "phaser-app/assets/images/completion-outline.svg",
      {
        scale: 2,
      }
    );

    this.load.svg(
      "completion-target",
      "phaser-app/assets/images/completion-target.svg",
      {
        scale: 2,
      }
    );

    //////AUDIO
    this.load.audio("level-win", "phaser-app/assets/sounds/level-win.mp3");
    this.load.audio("bump1", "phaser-app/assets/sounds/bump1.mp3");
    this.load.audio("bump2", "phaser-app/assets/sounds/bump2.mp3");
    this.load.audio("bump3", "phaser-app/assets/sounds/bump3.mp3");
    this.load.audio("graph-zap", "phaser-app/assets/sounds/graph-zap.mp3");
    this.load.audio("button-down", "phaser-app/assets/sounds/button-down.mp3");
    this.load.audio("button-up", "phaser-app/assets/sounds/button-up.mp3");

    this.load.json("level-data", "phaser-app/data/gameData.json");
  }

  create() {
    this.mode = model.mode;
    this.activeWorld = model.activeWorld;

    this.graphType =
      this.activeWorld === 1 || this.activeWorld === 3
        ? "position"
        : "velocity";

    if (this.mode === "input") {
      this.axisOrient = "horizontal";
    } else {
      this.axisOrient =
        this.activeWorld === 1 || this.activeWorld === 2
          ? "horizontal"
          : "vertical";
    }

    this.matterPhysicsOn = true;

    this.time1 = -1;
    this.time2 = -1;
    this.velocity1 = 0;
    this.velocity2 = 0;
    this.acceleration1 = 0;
    this.acceleration2 = 0;
    this.initialVelocity = 0;

    this.scorePercent = 0;
    this.levelBeaten = false;

    this.graphPlaying = this.mode === "control";
    this.gamePaused = false;

    this.headerHeightRatio = 0.1; //what portion of the screen does the header take up?\
    if (this.cameras.main.height > 1000) {
      //so the header isn't too tall
      this.headerHeightRatio /= this.cameras.main.height / 1000;
    }

    this.controlHeightRatio = 0.13; //what portion of the screen does the control bar take up in input mode?\

    if (this.cameras.main.height > 1000) {
      //so the control bar isn't too tall
      this.controlHeightRatio /= this.cameras.main.height / 1000;
    }

    this.portraitMode = this.cameras.main.height > this.cameras.main.width;

    this.isLevelLoaded = true;
    this.levelLoadTimer = null;

    this.graphWidthRatio = this.axisOrient === "vertical" ? 0.77 : 1; //what portion of the screen does the graph take up in vert mode?\
    this.graphHeightRatio = this.axisOrient === "horizontal" ? 0.65 : 1; //what portion of the remaining does the graph take up in vert mode?\

    if (this.mode === "input") this.graphHeightRatio = 0.54;

    emitter = new Phaser.Events.EventEmitter();

    emitter.on(G.PLAY_PRESSED, () => {
      this.playPressed();
    });

    emitter.on(G.RESET_PRESSED, () => {
      this.resetPressed();
    });

    emitter.on(G.PAUSE_GAME, () => {
      this.pauseGame();
    });
    emitter.on(G.UNPAUSE_GAME, () => {
      this.unpauseGame();
    });

    emitter.on(G.PREV_LEVEL_PRESSED, () => {
      this.prevLevelPressed();
    });

    emitter.on(G.NEXT_LEVEL_PRESSED, () => {
      this.nextLevelPressed();
    });

    emitter.on(G.SET_TIME_FACTOR, (e) => {
      this.setTimeFactor(e);
    });

    emitter.on(G.TURN_ON_MATTER_PHYSICS, () => {
      this.turnOnMatterPhysics();
    });

    emitter.on(G.TURN_OFF_MATTER_PHYSICS, () => {
      this.turnOffMatterPhysics();
    });

    emitter.on(G.TIME_1_UPDATED, this.time1Updated, this);
    emitter.on(G.TIME_2_UPDATED, this.time2Updated, this);
    emitter.on(G.VELOCITY_1_UPDATED, this.velocity1Updated, this);
    emitter.on(G.VELOCITY_2_UPDATED, this.velocity2Updated, this);
    emitter.on(G.ACCELERATION_1_UPDATED, this.acceleration1Updated, this);
    emitter.on(G.ACCELERATION_2_UPDATED, this.acceleration2Updated, this);
    emitter.on(G.INITIAL_VELOCITY_UPDATED, this.initialVelocityUpdated, this);

    controller = new Controller();
    var mediaManager = new MediaManager({ scene: this });

    this.activeLevel = model.activeLevel;
    this.loadLevelData();

    const numLevelsInWorld = this.levelData.modes[this.mode].worlds[
      this.activeWorld - 1
    ].levelData.length;

    //just beat last level
    if (this.activeLevel > numLevelsInWorld) {
      this.activeLevel = 1;
      model.activeLevel = 1;
    }

    this.maxTime = this.levelData.modes[this.mode].worlds[
      this.activeWorld - 1
    ].time;

    this.createGraph();
    this.createAxis();
    this.createMatterWorld();
    this.drawGraphTarget();
    this.createProgressBar();
    this.setupWinGraphics();
    this.createUI();
    this.setupKeyboard();

    this.isWithinTarget = false;

    var particles = this.add.particles("spark");

    this.graphSparkTrail = particles.createEmitter({
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.3, end: 0 },
      lifespan: 300,
      blendMode: "ADD",
      frequency: 30,
      maxParticles: 20,
    });

    this.graphSparkTrail.stop();
    particles.setDepth(10);

    this.graphSpark = this.add.sprite(0, 0, "graph-spark").setAlpha(0.7);
    this.graphSpark.visible = false;
    this.graphSpark.setDepth(20);

    this.velocityVectorShowing =
      this.graphType === "velocity" || this.mode === "input";

    this.accelerationVectorShowing =
      this.mode === "input" && this.activeWorld >= 3;

    this.createBoxGuy();

    if (this.mode === "input") {
      emitter.emit(G.SET_TIME_FACTOR, 1);
      this.matter.world.engine.world.gravity.y = 3;
    } else this.startGraphTimingBar();

    if (model.timeFactor) {
      this.setTimeFactor(model.timeFactor);
    } else this.timeFactor = 1;
  }

  playPressed() {
    if (this.graphPlaying) return;

    this.graphPlaying = true;
    this.startGraphTimingBar();
  }

  resetPressed() {
    if (!this.matterPhysicsOn) {
      emitter.emit(G.TURN_ON_MATTER_PHYSICS);
    }

    if (!this.graphPlaying) return;

    this.graphPlaying = false;
    this.graph.clearGraphLine();

    this.matter.world.engine.world.gravity.x = 0;
    this.boxGuy.updateAccelerationValue(0);
  }

  pauseGame() {
    this.gamePaused = true;
    this.isWithinTarget = false;
    this.matter.world.pause();
    emitter.emit(G.STOP_GRAPH_ZAP);
  }

  unpauseGame() {
    this.gamePaused = false;
    this.matter.world.resume();
  }

  loadLevelData() {
    this.levelData = this.cache.json.get("level-data");
  }

  createGraph() {
    const graphX =
      this.axisOrient === "vertical"
        ? this.cameras.main.width * (1 - this.graphWidthRatio)
        : (this.cameras.main.width * (1 - this.graphWidthRatio)) / 2;
    const graphY = this.cameras.main.height * this.headerHeightRatio;

    const graphWidth = this.cameras.main.width * this.graphWidthRatio;

    if (this.axisOrient === "vertical" && this.portraitMode) {
      //portrait mode on mobile
      this.graphHeight =
        0.8 *
        this.cameras.main.height *
        (1 - this.headerHeightRatio) *
        this.graphHeightRatio;

      this.graphCoverBottom = this.add
        .graphics({
          fillStyle: { color: 0x2c3234 },
        })
        .setDepth(50);
      const rect = new Phaser.Geom.Rectangle(
        graphX,
        graphY + this.graphHeight,
        graphWidth,
        this.cameras.main.height - this.graphHeight
      );
      this.graphCoverBottom.fillRectShape(rect);
    } else
      this.graphHeight =
        this.cameras.main.height *
        (1 - this.headerHeightRatio) *
        this.graphHeightRatio;

    let minY,
      maxY,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      gridLinesPerTickX,
      gridLinesPerTickY;

    if (this.graphType === "position") {
      if (this.axisOrient == "vertical") {
        //vertical x-t
        paddingLeft = 0.14 * graphWidth;
        paddingRight = 0.08 * graphWidth;
        paddingTop = 0.08 * this.graphHeight;
        paddingBottom = 0.103 * this.graphHeight;
        gridLinesPerTickX = 10;
        gridLinesPerTickY = 2;
        minY = 0;
        maxY = 10;
      } else {
        //horizontal x-t
        paddingLeft = 0.12 * graphWidth;
        paddingRight = 0.08 * graphWidth;
        paddingTop = 0.08 * this.graphHeight;
        paddingBottom = 0.16 * this.graphHeight;
        gridLinesPerTickX = 10;
        gridLinesPerTickY = 1;
        minY = 0;
        maxY = 10;
      }
    } else {
      if (this.axisOrient == "vertical") {
        //vertical v-t
        paddingLeft = 0.16 * graphWidth;
        paddingRight = 0.12 * graphWidth;
        paddingTop = 0.08 * this.graphHeight;
        paddingBottom = 0.103 * this.graphHeight;
        gridLinesPerTickX = 12;
        gridLinesPerTickY = 2;
        minY = -8;
        maxY = 8;
      } else {
        //horizontal v-t
        paddingLeft = 0.2 * graphWidth;
        paddingRight = 0.2 * graphWidth;
        paddingTop = 0.08 * this.graphHeight;
        paddingBottom = 0.103 * this.graphHeight;
        gridLinesPerTickX = 11;
        gridLinesPerTickY = 1;
        minY = -6;
        maxY = 6;
      }
    }

    this.graph = new Graph({
      scene: this,
      graphType: this.graphType,
      mode: this.mode,
      width: graphWidth,
      height: this.graphHeight,
      maxTime: this.maxTime,
      minY: minY,
      maxY: maxY,
      x0: graphX,
      y0: graphY,
      paddingLeft: paddingLeft,
      paddingRight: paddingRight,
      paddingTop: paddingTop,
      paddingBottom: paddingBottom,
      gridLinesPerTickX: gridLinesPerTickX,
      gridLinesPerTickY: gridLinesPerTickY,
      isPortrait: this.portraitMode,
    });
    this.graph.x = graphX;
    this.graph.y = graphY;
  }

  drawGraphTarget() {
    // if (this.mode === "input" && this.activeWorld === 3) {
    //   this.graph.drawGraphTargetWithPolygonPoints(
    //     this.levelData.modes[this.mode].worlds[this.activeWorld - 1].levelData[
    //       this.activeLevel - 1
    //     ].targetGraphCoords
    //   );
    // } else {
    this.graph.drawGraphTargetWithPointsAndWidth(
      this.levelData.modes[this.mode].worlds[this.activeWorld - 1].levelData[
        this.activeLevel - 1
      ].targetGraphCoords,
      this.levelData.modes[this.mode].worlds[this.activeWorld - 1].levelData[
        this.activeLevel - 1
      ].targetWidth
    );
    // }
  }

  createAxis() {
    const axisX = 0;
    const axisY =
      this.axisOrient === "vertical"
        ? this.cameras.main.height * this.headerHeightRatio
        : this.cameras.main.height *
          (this.headerHeightRatio +
            (1 - this.headerHeightRatio) * this.graphHeightRatio);

    const axisWidth =
      this.axisOrient === "vertical"
        ? this.cameras.main.width * (1 - this.graphWidthRatio)
        : this.cameras.main.width;
    const axisHeight =
      this.axisOrient === "vertical"
        ? this.cameras.main.height * (1 - this.headerHeightRatio)
        : this.cameras.main.height *
          (1 - this.headerHeightRatio) *
          (1 - this.graphHeightRatio);

    const horizOrigin =
      this.axisOrient === "vertical"
        ? 0.11 * this.cameras.main.width
        : 0.08 * this.cameras.main.width;
    this.vertOrigin = 0;
    if (this.mode === "input") {
      if (this.portraitMode) {
        this.vertOrigin = 70;
      } else this.vertOrigin = 40;
    } else {
      //control
      if (this.portraitMode) {
        this.vertOrigin = 70;
      } else {
        this.vertOrigin = 40;
      }
    }

    this.axis = new PositionAxisArea({
      scene: this,
      axisOrient: this.axisOrient,
      width: axisWidth,
      height: axisHeight,
      isPortrait: this.portraitMode,
      x0: axisX,
      y0: axisY,
      horizOrigin: horizOrigin, //where is the axis itself?
      vertOrigin: this.vertOrigin,
      minPos: 0,
      maxPos: 10,
    });

    if (this.mode === "input") {
      //for box guy arcade physics update
      const paddingLeft = 0.04 * axisWidth;
      const paddingRight = 0.04 * axisWidth;
      const axisLength = axisWidth - paddingLeft - paddingRight;
      // const axisRemainderBeginning = 0.03 * axisLength;
      const axisRemainderEnd = 0.12 * axisLength;
      this.axisSpacing = (axisLength - axisRemainderEnd) / (10 - 0); //beginning not included on purpose
    } else this.axisSpacing = -1;

    this.axis.setPosition(axisX, axisY);

    this.axis.setDepth(12);

    if (this.graphType === "velocity") {
      // this.axis.setAxisVisible(false);
    }
  }

  createMatterWorld() {
    if (this.axisOrient === "vertical") {
      this.matter.world.setBounds(
        0,
        0,
        this.cameras.main.width * (1 - this.graphWidthRatio),
        this.cameras.main.height,
        600
      );
    } else {
      //if axis is horizontal
      this.matter.world.setBounds(
        0,
        this.cameras.main.height * this.graphHeightRatio,
        this.cameras.main.width,
        this.cameras.main.height * (1 - this.graphHeightRatio) -
          this.vertOrigin,
        600
      );
    }

    this.matter.add.pointerConstraint({
      length: 0,
      stiffness: 0.25,
      angularStiffness: 0.95,
      damping: 1,
    });
  }

  createBoxGuy() {
    let minX, minY, maxX, maxY, startingX, startingY;
    if (this.axisOrient === "vertical") {
      minX = 0;
      maxX = this.cameras.main.width * (1 - this.graphWidthRatio);
      minY = this.graphType === "position" ? 0 : -1 * this.cameras.main.height;
      maxY = this.cameras.main.height;
      startingX = maxX / 2;
      startingY = 0.3 * this.cameras.main.height;
    } else {
      //horizontal
      minX = 0;
      maxX = this.cameras.main.width;
      minY = this.cameras.main.height * this.graphHeightRatio;
      maxY = this.cameras.main.height - this.vertOrigin;
      startingX = maxX / 2;
      startingY =
        this.mode === "control"
          ? 0.5 * this.cameras.main.height * (this.graphHeightRatio + 1)
          : 0.5 * this.cameras.main.height * (this.graphHeightRatio + 1.06);
    }

    this.boxGuy = new BoxGuy({
      scene: this,
      matter: this.matter,
      emitter: emitter,
      graphType: this.graphType,
      isPortrait: this.portraitMode,
      x: startingX,
      y: startingY,
      minX: minX,
      maxX: maxX,
      minY: minY,
      maxY: maxY,
      axisOrient: this.axisOrient,
      mode: this.mode,
      axisSpacing: this.axisSpacing,
      velocityVectorShowing: this.velocityVectorShowing,
      accelerationVectorShowing: this.accelerationVectorShowing,
    });

    this.boxGuy.setDepth(15);
  }

  setTimeFactor(timeFactor) {
    model.timeFactor = timeFactor;
    this.timeFactor = timeFactor;
    this.boxGuy.setTimeFactor(timeFactor);
    this.graph.setTimeFactor(timeFactor);
  }

  createProgressBar() {
    this.progressBar = new ProgressBar({
      scene: this,
    });

    const barScale = (0.4 * this.graphHeight) / this.progressBar.getHeight();

    const posX =
      this.cameras.main.width - 0.5 * this.progressBar.getWidth() - 16;

    const posY = this.cameras.main.height * this.headerHeightRatio * 1.2; //based on top edge

    this.progressBar.setPositionAndScale(posX, posY, barScale);
  }

  update(time, delta) {
    if (this.gamePaused) return;

    const slowGameFactor = game.loop.actualFps / 60;

    this.lastDelta = delta * slowGameFactor;

    /////// CONTROL MODE ONLY
    if (this.mode === "control") {
      if (this.cursors.left.isDown) {
        this.matter.world.engine.world.gravity.x = -2 / this.timeFactor;
      } else if (this.cursors.right.isDown) {
        this.matter.world.engine.world.gravity.x = 2 / this.timeFactor;
      } else {
        this.matter.world.engine.world.gravity.x = 0;
      }
      if (this.cursors.up.isDown) {
        this.matter.world.engine.world.gravity.y = -2 / this.timeFactor;
      } else if (this.cursors.down.isDown) {
        this.matter.world.engine.world.gravity.y = 2 / this.timeFactor;
      } else {
        this.matter.world.engine.world.gravity.y = slowGameFactor;
      }

      if (this.axisOrient === "horizontal") {
        this.boxGuy.updateAccelerationValue(
          this.matter.world.engine.world.gravity.x
        );
      } else
        this.boxGuy.updateAccelerationValue(
          this.matter.world.engine.world.gravity.y
        );
    }

    ////// PERFORM IN EITHER MODE WHEN UNPAUSED

    this.boxGuy.update(this.lastDelta); //arcade physics and eyes
    const boxPos =
      this.axisOrient === "vertical" ? this.boxGuy.getY() : this.boxGuy.getX();

    const charPos = this.axis.updateReturnAxisPosition(boxPos);

    if (this.levelBeaten || !this.isLevelLoaded) {
      this.progressBar.updateWithPercentInTarget(
        this.lastDelta,
        this.percentInTarget,

        false //should vibrate?
      );

      if (this.graphType === "velocity") {
        //update graph vector anyway
        if (this.axisOrient === "horizontal") {
          this.graph.updateGraphVector(this.boxGuy.getVx());
        } else this.graph.updateGraphVector(-this.boxGuy.getVy());
      }

      return; /////BREAKPOINT IF LEVEL BEATEN
    }

    let graphYVal;

    if (this.graphType === "position") {
      graphYVal = charPos;
    } else {
      if (this.axisOrient === "horizontal") {
        graphYVal = this.boxGuy.getVx();
      } else graphYVal = -this.boxGuy.getVy();

      // const speed = Math.abs(graphYVal);
      // if (speed < 0.08) graphYVal = 0; else
      // graphYVal = Math.min(Math.max(graphYVal, -6), 6.5);
    }

    let retVal = { percentInTarget: 0, canCheckForCompletion: false };

    ////// INPUT MODE ONLY
    if (this.mode === "input") {
      if (this.graphPlaying) {
        retVal = this.graph.updateReturnPercentInTargetCanCheck(
          this.lastDelta,
          graphYVal
        );
      } else {
        if (this.graphType === "velocity") {
          this.graph.updateGraphVector(this.boxGuy.getVx());
        }
      }
    }

    ////// CONTROL MODE ONLY
    else if (this.mode === "control") {
      retVal = this.graph.updateReturnPercentInTargetCanCheck(
        this.lastDelta,
        graphYVal
      );
    }

    this.percentInTarget = retVal.percentInTarget;
    const canCheckForCompletion = retVal.canCheckForCompletion;

    const prevWithinTarget = this.isWithinTarget;
    this.isWithinTarget = this.graph.getIsWithinTarget();
    if (this.isWithinTarget && !prevWithinTarget) {
      this.graphSpark.setVisible(true);
      this.graphSparkTrail.start();
      emitter.emit(G.START_GRAPH_ZAP);
    } else if (!this.isWithinTarget && prevWithinTarget) {
      this.graphSpark.setVisible(false);
      this.graphSparkTrail.stop();
      emitter.emit(G.STOP_GRAPH_ZAP);
    }

    if (this.isWithinTarget) {
      const graphPos = this.graph.getCurPoint();
      this.graphSpark.setPosition(graphPos.x, graphPos.y);
      this.graphSparkTrail.setPosition(graphPos.x, graphPos.y);
      this.graphSpark.rotation = 180 * Math.random();
      this.graphSpark.scale = 0.2 + 0.2 * Math.random();
    }

    this.progressBar.updateWithPercentInTarget(
      this.lastDelta,
      this.percentInTarget,
      this.isWithinTarget
    );

    ////CHECK FOR VELOCITY CHANGE IN INPUT MODE

    if (this.mode === "input") {
      const timeElapsed = retVal.timeElapsed;

      if (timeElapsed - this.lastDelta / 1000 === 0) {
        //initial velocity trigger
        if (this.activeWorld > 2)
          emitter.emit(G.SET_BOX_VELOCITY, this.initialVelocity);
      }

      if (this.time1 >= 0) {
        if (
          timeElapsed - this.lastDelta / 1000 <= this.time1 &&
          timeElapsed >= this.time1
        ) {
          if (this.activeWorld <= 2) {
            emitter.emit(G.SET_BOX_VELOCITY, this.velocity1);
          } else {
            this.setBoxAcceleration(this.acceleration1);
          }
        }
      }

      if (this.time2 >= 0) {
        if (
          timeElapsed - this.lastDelta / 1000 <= this.time2 &&
          timeElapsed >= this.time2
        ) {
          if (this.activeWorld <= 2) {
            emitter.emit(G.SET_BOX_VELOCITY, this.velocity2);
          } else {
            this.setBoxAcceleration(this.acceleration2);
          }
        }
      }

      if (timeElapsed >= this.maxTime) {
        this.matter.world.engine.world.gravity.x = 0;
        this.boxGuy.resetPressed();
        this.boxGuy.updateAccelerationValue(0);
      }
    }

    const percentToBeat = this.mode === "control" ? 0.95 : 0.98;

    if (canCheckForCompletion && this.percentInTarget > percentToBeat) {
      this.levelBeaten = true;
      this.headerBar.setLevelBeaten();
      this.graphSpark.setVisible(false);
      this.graphSparkTrail.stop();
      this.progressBar.showCompletionGraphics();
      this.showWinGraphics();
      this.graph.clearGraphTargetIn(500);

      model.levelBeaten(this.activeLevel);

      this.headerBar.disableLevelSelect();

      if (this.mode === "input") {
        this.graphPlaying = false;
        this.boxGuy.resetPressed();
      }

      this.time.delayedCall(900, this.startNextLevel, [], this);

      emitter.emit(G.PLAY_SOUND, "level-win", 0.2);
      emitter.emit(G.LEVEL_BEATEN, this.activeLevel);
      emitter.emit(G.STOP_GRAPH_ZAP);
    }
  }

  setupWinGraphics() {
    this.winSparkle = this.add.sprite(0, 0, "graph-spark");
    this.winSparkle.setVisible(false);
    this.winSparkle.setDepth(20);
  }

  showWinGraphics() {
    const graphPos = this.graph.getCurPoint();
    this.winSparkle.setPosition(graphPos.x, graphPos.y);
    this.winSparkle.setVisible(true);
    this.winSparkle.setAlpha(1);
    this.winSparkle.setScale(0.3);

    this.boxGuy.startSmiling();

    this.tweens.add({
      targets: this.winSparkle,
      scale: 0.6,
      alpha: 0,
      rotation: 2 * Math.random() - 1,
      duration: 250,
      ease: "Quadratic.Out",
      paused: false,
    });
  }

  startGraphTimingBar() {
    this.graph.startTimingBarIn();
  }

  startNextLevel() {
    const numLevelsInWorld = this.levelData.modes[this.mode].worlds[
      this.activeWorld - 1
    ].levelData.length;

    //just beat last level
    if (this.activeLevel == numLevelsInWorld) {
      ///Go back to main menu
      this.time.delayedCall(900, this.goBackToMenu, [], this);
      return;
    }

    this.activeLevel++;
    model.activeLevel++;
    this.isWithinTarget = false;
    this.drawGraphTarget();
    this.graph.clearGraphLine();
    this.graph.fadeInGraphTargetIn(500);
    this.percentInTarget = 0;
    this.progressBar.reset();
    this.headerBar.updateWithLevelNum(this.activeLevel);

    if (this.mode === "input") {
      emitter.emit(G.RESET_PRESSED);
      this.controlBar.setForLevelNum(this.activeLevel);
    }

    this.time.delayedCall(1000, this.activateLevel, [], this);
  }

  activateLevel() {
    this.levelBeaten = false; //allows update function to update the graph
    if (this.mode === "control") {
      this.startGraphTimingBar(); //starts the timing bar, which pauses the graph update
    }
    this.boxGuy.stopSmiling();

    this.headerBar.enableLevelSelect();
  }

  goBackToMenu() {
    this.scene.start("SceneMenu");
  }

  ///////USER INTERFACE
  createUI() {
    this.headerBar = new HeaderBar({
      scene: this,
      emitter: emitter,
      portraitMode: this.portraitMode,
      levNum: this.activeLevel,
      totalLevels: this.levelData.modes[this.mode].worlds[this.activeWorld - 1]
        .levelData.length,
      width: this.cameras.main.width,
      height: this.cameras.main.height * this.headerHeightRatio,
      menuWidth: this.cameras.main.width,
      menuHeight: this.cameras.main.height,
      mode: this.mode,
    });

    this.headerBar.setDepth(50);

    if (this.mode === "input") {
      const totalLevelsInWorld = this.levelData.modes[this.mode].worlds[
        this.activeWorld - 1
      ].levelData.length;
      const numSelectorInfo = [];
      for (var i = 0; i < totalLevelsInWorld; i++) {
        numSelectorInfo.push(
          this.levelData.modes[this.mode].worlds[this.activeWorld - 1]
            .levelData[i].numSelectors
        );
      }

      this.controlBar = new ControlBar({
        scene: this,
        emitter: emitter,
        posX: 0,
        posY:
          this.cameras.main.height * this.headerHeightRatio +
          this.cameras.main.height *
            (1 - this.headerHeightRatio) *
            this.graphHeightRatio,
        width: this.cameras.main.width,
        height: this.cameras.main.height * this.controlHeightRatio,
        portraitMode: this.portraitMode,
        maxTime: this.maxTime,
        worldNum: this.activeWorld,
        numSelectorInfo: numSelectorInfo,
      });

      this.controlBar.setDepth(14);

      this.controlBar.setForLevelNum(this.activeLevel);
    }
  }

  ///////////LEVEL SELECT/////////////
  prevLevelPressed() {
    this.activeLevel--;
    model.activeLevel--;
    this.updateForNewLevel();
  }

  nextLevelPressed() {
    this.activeLevel++;
    model.activeLevel++;
    this.updateForNewLevel();
  }

  updateForNewLevel() {
    this.isLevelLoaded = false;
    this.isWithinTarget = false;
    this.levelBeaten = false;
    this.graphSpark.setVisible(false);
    this.graphSparkTrail.stop();
    this.graph.clearGraphTargetIn(0);
    this.graph.clearGraphLine();
    this.percentInTarget = 0;
    this.progressBar.reset();

    this.drawGraphTarget();
    this.graph.fadeInGraphTargetIn(0);

    if (this.mode === "input") {
      this.graphPlaying = false;
      this.boxGuy.resetPressed();
      this.controlBar.setForLevelNum(this.activeLevel);
    }

    emitter.emit(G.STOP_GRAPH_ZAP);

    if (this.levelLoadTimer) {
      this.levelLoadTimer.remove();
      this.levelLoadTimer = null;
    }

    if (this.mode === "input") {
      emitter.emit(G.RESET_PRESSED);
    }

    this.matter.world.engine.world.gravity.x = 0;
    this.boxGuy.updateAccelerationValue(0);

    this.levelLoadTimer = this.time.delayedCall(500, this.loadLevel, [], this);
  }

  loadLevel() {
    this.levelLoadTimer = null;
    this.isLevelLoaded = true;

    if (this.mode === "control") {
      this.startGraphTimingBar(); //starts the timing bar, which pauses the graph update
    }
    this.boxGuy.stopSmiling();
  }

  ////////KEYBOARD//////////
  setupKeyboard() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  setBoxAcceleration(accel) {
    emitter.emit(G.SET_BOX_ACCELERATION, accel);

    let newAcc =
      this.graphType === "position"
        ? accel * 0.193
        : (accel * 0.193 * 16.5) / this.lastDelta;

    this.matter.world.engine.world.gravity.x = newAcc;

    this.boxGuy.updateAccelerationValue(accel);
  }

  ///////////MATTER PHYSICS MANIPULATION//////////
  turnOnMatterPhysics() {
    if (!this.matterPhysicsOn) {
      this.boxGuy.switchToMatterPhysics();
      // this.matter.world.resume();
      this.matterPhysicsOn = true;
    }
  }

  turnOffMatterPhysics() {
    if (this.matterPhysicsOn) {
      this.boxGuy.switchToArcadePhysics();
      // this.matter.world.pause();
      this.matterPhysicsOn = false;
    }
  }

  /////////// INPUT CONTROLS

  time1Updated(newTime) {
    this.time1 = newTime;
  }

  time2Updated(newTime) {
    this.time2 = newTime;
  }

  velocity1Updated(newVelocity) {
    this.velocity1 = newVelocity;
  }

  velocity2Updated(newVelocity) {
    this.velocity2 = newVelocity;
  }

  acceleration1Updated(newAcceleration) {
    this.acceleration1 = newAcceleration;
  }

  acceleration2Updated(newAcceleration) {
    this.acceleration2 = newAcceleration;
  }

  initialVelocityUpdated(newVelocity) {
    this.initialVelocity = newVelocity;
  }
}
