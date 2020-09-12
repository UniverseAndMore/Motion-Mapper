class UIButton extends Phaser.GameObjects.Container {
  constructor(config) {
    if (!config.scene) {
      console.log("UIButton missing scene");
      return;
    }
    if (!config.key) {
      console.log("UIButton missing key");
      return;
    }

    super(config.scene);

    this.config = config;
    this.scene = config.scene;
    this.key = config.key;
    this.toggle = config.toggle ? true : false;
    const imgPath = this.toggle ? config.key + "-on" : config.key;
    this.back = this.scene.add.image(0, 0, "menuSprites", imgPath);
    this.back.setOrigin(0.5, 0.5);
    this.add(this.back);

    this.toggleState = true; // is active?

    this.defaultScale = config.defaultScale ? config.defaultScale : 1;
    this.defaultAlpha = config.defaultAlpha ? config.defaultAlpha : 1;

    this.back.setScale(this.defaultScale);
    this.back.setAlpha(this.defaultAlpha);

    this.clickDownOnButton = false;

    if (config.levelNum) {
      //if it is a level select button
      this.levelNumText = this.scene.add.text(0, 0, config.levelNum);
      this.levelNumText.setOrigin(0.5, 0.5);
      this.add(this.levelNumText);
    }

    if (config.x) {
      this.x = config.x;
    }

    if (config.y) {
      this.y = config.y;
    }

    this.scene.add.existing(this);

    // this.setInteractive({ useHandCursor: true });
    this.back.setInteractive({ useHandCursor: true });

    if (model.isMobile === -1) {
      this.back.on("pointerover", this.over, this);
      this.back.on("pointerout", this.out, this);
      this.back.on("pointerdown", this.down, this);
      this.back.on("pointerup", this.pressed, this);
    } else {
      this.back.on("pointerup", (e) => this.pressedMobile(e), this);
    }
  }

  setVisibility(visibility) {
    this.back.setVisible(visibility);

    if (visibility) {
      this.back.setInteractive({ useHandCursor: true });
    } else {
      this.back.disableInteractive();
    }
  }

  disable() {
    this.back.disableInteractive();
  }

  enable() {
    this.back.setInteractive({ useHandCursor: true });
  }

  setOrigin(x, y) {
    this.back.x = (0.5 - x) * this.back.width;
    this.back.y = (0.5 - y) * this.back.height;
  }

  setDisplayWidth(width) {
    this.scale = width / this.back.width;
  }

  setDisplayHeight(height) {
    this.scale = height / this.back.height;
  }

  setBtnTexture(texture) {
    this.back.setTexture("menuSprites", texture);
  }

  getWidth() {
    return this.back.width * this.scaleX;
  }

  getHeight() {
    return this.back.height * this.scaleY;
  }

  over() {
    this.back.scale = 1.04 * this.defaultScale;
    this.back.setAlpha(1);
  }

  out() {
    this.back.scale = this.defaultScale;
    this.back.setAlpha(this.defaultAlpha);
    this.clickDownOnButton = false;
  }

  down() {
    emitter.emit(G.PLAY_SOUND, "button-down", 0.2);
    this.back.scale = this.defaultScale / 1.04;
    this.clickDownOnButton = true;
  }

  pressed() {
    if (!this.clickDownOnButton) return;

    this.clickDownOnButton = false;

    this.back.scale = 1.04 * this.defaultScale;

    if (this.config.params) {
      emitter.emit(this.config.event, this.config.params);
    } else {
      emitter.emit(this.config.event);
    }

    emitter.emit(G.PLAY_SOUND, "button-up", 0.2);

    if (this.toggle) {
      if (this.toggleState) {
        this.back.setTexture("menuSprites", this.key + "-off");
      } else {
        this.back.setTexture("menuSprites", this.key + "-on");
      }
      this.toggleState = !this.toggleState;
    }
  }

  pressedMobile(e) {
    if (e.id === 1) return;
    if (this.config.params) {
      emitter.emit(this.config.event, this.config.params);
    } else {
      emitter.emit(this.config.event);
    }

    if (this.toggle) {
      if (this.toggleState) {
        this.back.setTexture("menuSprites", this.key + "-off");
      } else {
        this.back.setTexture("menuSprites", this.key + "-on");
      }
      this.toggleState = !this.toggleState;
    }

    emitter.emit(G.PLAY_SOUND, "button-up", 0.2);
  }
}

UIButton.prototype.toggleBtn = function () {
  if (this.toggle) {
    if (this.toggleState) {
      this.back.setTexture("menuSprites", this.key + "-off");
    } else {
      this.back.setTexture("menuSprites", this.key + "-on");
    }
  }
  this.toggleState = !this.toggleState;
};
