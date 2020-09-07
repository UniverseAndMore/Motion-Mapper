class BoxGuy extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.scene.add.existing(this);

    this.isPortrait = config.isPortrait;

    this.matter = config.matter;

    this.emitter = config.emitter;

    this.axisOrient = config.axisOrient;

    this.graphType = config.graphType;

    this.mode = config.mode;

    this.axisSpacing = config.axisSpacing;

    this.startingPos = { x: config.x, y: config.y };

    let boxWidth;

    if (this.axisOrient === "horizontal") {
      boxWidth = this.isPortrait
        ? 0.14 * Math.abs(config.maxX - config.minX)
        : 0.38 * Math.abs(config.maxY - config.minY);
    } else boxWidth = 0.45 * Math.abs(config.maxX - config.minX);

    if (this.mode === "input") {
      boxWidth *= 0.8;
    }

    this.createGraphics(boxWidth);
    this.startEyeBlinkTimer();

    this.setupTouchListeners();
    this.pointerDown = false;

    this.accelerationVectorShowing = config.accelerationVectorShowing;
    this.createAccelerationVector();

    this.velocityVectorShowing = config.velocityVectorShowing;
    this.createVelocityVector();

    this.accelValue = 0;

    this.minX = config.minX + 0.5 * this.box.width * this.boxScale;
    this.maxX = config.maxX - 0.5 * this.box.width * this.boxScale;
    this.minY = config.minY + 0.5 * this.box.height * this.boxScale;
    this.maxY = config.maxY - 0.5 * this.box.height * this.boxScale;

    this.arcadePhysics = false;
    this.arcadeVx = 0;
    this.arcadeAx = 0;

    const minSpeedForSound = 2;
    const maxSpeedForSound = 14;
    const minVolume = 0;
    const maxVolume = 1;
    const slope =
      (maxVolume - minVolume) / (maxSpeedForSound - minSpeedForSound);

    this.matter.world.on("collisionstart", function (event, bodyA, bodyB) {
      const boxSpeed = bodyB.speed;
      if (boxSpeed > minSpeedForSound) {
        //play bounce sound, volume proportional to bodyA.speed
        const volume = Math.min(
          slope * (boxSpeed - minSpeedForSound),
          maxVolume
        );
        const soundPath = "bump" + String(1 + Math.floor(Math.random() * 3));
        emitter.emit(G.PLAY_SOUND, soundPath, volume);
      }
    });

    this.emitter.on(G.SET_BOX_VELOCITY, this.setArcadeVx, this);
    this.emitter.on(G.SET_BOX_ACCELERATION, this.setArcadeAx, this);
    this.emitter.on(G.RESET_PRESSED, this.resetPressed, this);
  }

  createGraphics(boxWidth) {
    this.friction = 0;
    this.frictionStatic = 0;
    this.frictionAir = 0;

    if (this.mode === "input") {
      this.friction = 0.05;
      this.frictionStatic = 0.001;
      this.frictionAir = 0.01;
    }

    this.box = this.matter.add
      .image(this.startingPos.x, this.startingPos.y, "block", null, {
        chamfer: { radius: 24 },
      })
      .setBounce(0.8)
      .setFrictionStatic(this.frictionStatic)
      .setFriction(this.friction)
      .setFrictionAir(this.frictionAir);

    this.boxScale = boxWidth / this.box.width;

    this.box.setScale(this.boxScale, this.boxScale);

    this.baseGravScale = 0.42;

    this.box.body.gravityScale = {
      x: this.baseGravScale,
      y: this.baseGravScale,
    };

    this.eyeL = this.scene.add.graphics();
    this.eyeL.fillStyle(0x222222);
    let point = new Phaser.Geom.Circle(0, 0, 5 * this.boxScale);
    this.eyeL.fillCircleShape(point);
    this.eyeL.setDepth(2);

    this.eyeR = this.scene.add.graphics();
    this.eyeR.fillStyle(0x222222);
    point = new Phaser.Geom.Circle(0, 0, 4 * this.boxScale);
    this.eyeR.fillCircleShape(point);
    this.eyeR.setDepth(2);

    this.blinkAnimation = this.scene.anims.create({
      key: "blink",
      frames: this.scene.anims.generateFrameNumbers("block-blink"),
      frameRate: 30,
      repeat: 0,
      yoyo: true,
    });

    this.blinkEyes = this.scene.add.sprite(0, 0, "block-blink");
    this.blinkEyes.scale = this.boxScale;

    this.box.setDepth(15);
    this.eyeL.setDepth(16);
    this.eyeR.setDepth(17);
    this.blinkEyes.setDepth(18);
  }

  setTimeFactor(timeFactor) {
    this.baseGravScale = 0.42 * timeFactor;

    this.box.body.gravityScale = {
      x: this.baseGravScale,
      y: this.baseGravScale,
    };
  }

  createVelocityVector() {
    this.velocityVector = new Vector({
      scene: this.scene,
      axisOrient: this.axisOrient,
      scale: this.boxScale,
      isVelocity: true,
      isAcceleration: false,
    });

    if (!this.velocityVectorShowing) this.velocityVector.setVisible(false);

    this.velocityVector.setDepth(20);
  }

  createAccelerationVector() {
    this.accelerationVector = new Vector({
      scene: this.scene,
      axisOrient: this.axisOrient,
      scale: this.boxScale,
      isVelocity: false,
      isAcceleration: true,
    });

    if (!this.accelerationVectorShowing)
      this.accelerationVector.setVisible(false);

    this.accelerationVector.setDepth(20);
  }

  /////TOUCH LISTENERS
  setupTouchListeners() {
    this.box
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", (pointer) => {
        this.pointerDown = true;
        this.box.setAngularVelocity(0);

        if (this.mode === "input") {
          this.emitter.emit(G.RESET_PRESSED);
        }

        pointer.event.preventDefault();
      });

    this.scene.input.on("pointerdown", (pointer) => {
      this.pointerDown = true;
    });

    this.scene.input.on("pointerup", (pointer) => {
      this.pointerDown = false;
    });

    this.scene.input.on("pointerout", (pointer) => {
      this.pointerDown = false;
    });

    if (this.mode === "input") {
      this.box.on("pointerover", () => {
        if (this.pointerDown) {
          this.emitter.emit(G.RESET_PRESSED);
        }
      });
    }
  }

  getX() {
    return this.box.x;
  }

  getY() {
    return this.box.y;
  }

  getVx() {
    if (this.arcadePhysics) {
      return this.arcadeVx / this.axisSpacing;
    } else return this.box.body.velocity.x / 1.36;
  }

  getVy() {
    return this.box.body.velocity.y / 1.36;
  }

  setVx(v) {
    this.box.setFrictionStatic(0).setFriction(0).setFrictionAir(0);

    if (this.graphType === "position") {
      this.box.setVelocityX((v * 1.36 * this.lastDelta) / 16.5);
    } else this.box.setVelocityX(v * 1.36);
  }

  setAx(a) {
    this.box.setFrictionStatic(0).setFriction(0).setFrictionAir(0);
  }

  resetPressed() {
    this.box
      .setFrictionStatic(this.frictionStatic)
      .setFriction(this.friction)
      .setFrictionAir(this.frictionAir);

    this.setArcadeAx(0);
  }

  update(deltaTime) {
    this.lastDelta = deltaTime;

    if (this.pointerDown) {
      this.box.setAngularVelocity(0.01 * this.box.body.angularVelocity);
    }

    if (!this.arcadePhysics) {
      if (this.box.x < this.minX) this.box.x = this.minX;
      if (this.box.y < this.minY) this.box.y = this.minY;
      if (this.box.x > this.maxX) this.box.x = this.maxX;
      if (this.box.y > this.maxY) this.box.y = this.maxY;
    }

    if (this.arcadePhysics) {
      this.updateArcadePhysics(this.lastDelta);
    }

    this.updateEyes();

    if (this.velocityVectorShowing) {
      this.updateVelocityVector();
    }

    if (this.accelerationVectorShowing) {
      this.updateAccelerationVector();
    }
  }

  updateArcadePhysics(deltaTime) {
    this.arcadeVx += (deltaTime * this.arcadeAx) / 1000;
    this.box.x += (deltaTime * this.arcadeVx) / 1000;

    if (this.box.x < this.minX) {
      const deltaX = this.minX - this.box.x;
      this.box.x = this.minX + deltaX;
      this.arcadeVx *= -0.5;
    }

    if (this.box.x > this.maxX) {
      const deltaX = this.box.x - this.maxX;
      this.box.x = this.maxX - deltaX;
      this.arcadeVx *= -0.5;
    }
  }

  updateVelocityVector() {
    if (this.axisOrient === "horizontal") {
      const minSpeedToShow = this.mode === "control" ? 0.24 : 0.12;
      const minSpeedToStretch = 3.5;

      const boxVel = this.arcadePhysics
        ? this.arcadeVx / this.axisSpacing
        : this.box.body.velocity.x / 2.4;

      if (boxVel > 0) {
        this.velocityVector.x =
          this.box.x + 0.7 * this.box.width * this.boxScale;
      } else {
        this.velocityVector.x =
          this.box.x - 0.7 * this.box.width * this.boxScale;
      }
      this.velocityVector.y = this.box.y;
      this.velocityVector.updateWithValue(
        boxVel,
        minSpeedToShow,
        minSpeedToStretch
      );
    } else {
      // if(this.axisOrient === "vertical") {
      const minSpeedToShow = 0.3;
      const minSpeedToStretch = 1.8;

      const boxVel = this.box.body.velocity.y / 2.4;

      if (boxVel > 0) {
        this.velocityVector.y =
          this.box.y + 0.7 * this.box.height * this.boxScale;
      } else {
        this.velocityVector.y =
          this.box.y - 0.7 * this.box.height * this.boxScale;
      }
      this.velocityVector.x = this.box.x;
      this.velocityVector.updateWithValue(
        boxVel,
        minSpeedToShow,
        minSpeedToStretch
      );
    }
  }

  updateAccelerationValue(a) {
    if (this.accelValue === a) return;
    this.accelValue = a;
  }

  updateAccelerationVector() {
    if (this.axisOrient === "horizontal") {
      const minAccToShow = 0.5;
      const minAccToStretch = 3.5;

      const accelVal = this.arcadePhysics
        ? this.arcadeAx / this.axisSpacing
        : this.accelValue;

      if (accelVal > 0) {
        this.accelerationVector.x =
          this.box.x - 0.25 * this.box.width * this.boxScale;
      } else {
        this.accelerationVector.x =
          this.box.x + 0.25 * this.box.width * this.boxScale;
      }
      this.accelerationVector.y =
        this.box.y - 0.7 * this.box.height * this.boxScale;

      this.accelerationVector.updateWithValue(
        accelVal,
        minAccToShow,
        minAccToStretch
      );
    } else {
      // if(this.axisOrient === "vertical") {
      const minAccToShow = 0.9;
      const minAccToStretch = 2.5;

      if (this.accelValue > 0) {
        this.accelerationVector.y =
          this.box.y - 0.1 * this.box.height * this.boxScale;
      } else {
        this.accelerationVector.y =
          this.box.y + 0.1 * this.box.height * this.boxScale;
      }
      this.accelerationVector.x =
        this.box.x + 0.8 * this.box.width * this.boxScale;
      this.accelerationVector.updateWithValue(
        this.accelValue,
        minAccToShow,
        minAccToStretch
      );
    }
  }

  startSmiling() {
    this.box.setTexture("block-smile");
  }

  stopSmiling() {
    this.box.setTexture("block");
  }

  blinkEyesCallback() {
    this.blinkEyes.play("blink");
    this.startEyeBlinkTimer();
  }

  startEyeBlinkTimer() {
    this.scene.time.delayedCall(
      Phaser.Math.Between(800, 6000),
      this.blinkEyesCallback,
      [],
      this
    );
  }

  updateEyes() {
    const boxRot = this.box.rotation;
    const boxScale = this.box.scale;

    this.eyeL.x = this.box.x - 17 * Math.cos(boxRot) * boxScale;
    this.eyeL.y = this.box.y - 21 * Math.sin(boxRot) * boxScale;
    this.eyeR.x = this.box.x + 16 * Math.cos(boxRot) * boxScale;
    this.eyeR.y = this.box.y - 20 * Math.sin(-boxRot) * boxScale;

    this.blinkEyes.x = this.box.x;
    this.blinkEyes.y = this.box.y;
    this.blinkEyes.rotation = this.box.rotation;
  }

  ////////////ARCADE PHYSICS///////////
  setArcadeVx(vx) {
    this.arcadeVx = vx * this.axisSpacing;
  }

  setArcadeAx(ax) {
    this.arcadeAx = ax * this.axisSpacing;
  }

  switchToArcadePhysics() {
    this.arcadePhysics = true;
    this.setVx(0);
    this.setArcadeVx(0);
    this.setArcadeAx(0);
    this.box.setFriction(1);
    this.updateVelocityVector();
    this.updateAccelerationVector();
  }

  switchToMatterPhysics() {
    this.arcadePhysics = false;
  }
}
