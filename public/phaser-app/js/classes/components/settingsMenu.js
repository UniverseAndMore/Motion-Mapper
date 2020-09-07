class SettingsMenu extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.scene.add.existing(this);

    this.emitter = config.emitter;

    this.width = config.width;
    this.height = config.height;

    this.bgColor = 0xfcf3ca; //0x2c3234; //space gray

    this.portraitMode = this.width < this.height;

    this.mode = config.mode;

    //   this.level = config.levNum;

    console.log(this.mode);

    this.drawBackground();
    this.createTimeSlider();
    //   this.createLevelHeading();
    //   this.createButtons();

    //   emitter.on(G.LEVEL_BEATEN, this.levelBeaten);
  }

  drawBackground() {
    this.bg = this.scene.add.graphics({ fillStyle: { color: this.bgColor } });
    const rect = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
    this.bg.fillRectShape(rect);
    this.add(this.bg);
  }

  createTimeSlider() {
    const initialVal = model.timeFactor ? model.timeFactor : 1;
    const width = this.portraitMode ? 0.7 * this.width : 0.4 * this.width;

    this.timeSlider = new SliderBar({
      scene: this.scene,
      emitter: this.emitter,
      width: width,
      height: 0.2 * width, // 0.2 aspect ratio
      color: 0xf3775b,
      textColor: "#f3775b",
      text: "Game speed",
      unit: "x",
      min: 0.5,
      max: 1.5,
      increment: 0.1,
      initialVal: initialVal,
      event: G.SET_TIME_FACTOR,
    });
    this.add(this.timeSlider);

    const enabled = this.mode === "control";

    if (enabled) {
      this.timeSlider.setVisible(true);
    } else {
      this.timeSlider.setVisible(false);
    }

    this.timeSlider.x = 0.5 * this.width;
    this.timeSlider.y = 0.6 * this.height;
  }

  createButtons() {
    // this.backBtn = new UIButton({
    //   scene: this.scene,
    //   key: "icon-back",
    //   event: "back_to_menu",
    //   defaultAlpha: 0.85,
    // });
    // this.backBtn.setScale(0.9);
    // // this.backBtn.setDepth(13);
    // this.infoBtn = new UIButton({
    //   scene: this.scene,
    //   key: "icon-info",
    //   event: "button_pressed",
    //   params: "show_info",
    //   defaultAlpha: 0.85,
    // });
    // const percentHeight = 0.7; //how much of the height do the buttons take up?
    // this.infoBtn.setScale(percentHeight);
    // // this.infoBtn.setDepth(13);
    // this.settingsBtn = new UIButton({
    //   scene: this.scene,
    //   key: "icon-gear",
    //   event: "button_pressed",
    //   params: "show_settings",
    //   defaultAlpha: 0.85,
    // });
    // this.settingsBtn.setScale(0.8);
    // // this.settingsBtn.setDepth(13);
    // this.add(this.backBtn);
    // this.add(this.infoBtn);
    // this.add(this.settingsBtn);
    // this.scaleToFit(this.backBtn);
    // this.scaleToFit(this.infoBtn);
    // this.scaleToFit(this.settingsBtn);
    // this.backBtn.x =
    //   0.5 * this.backBtn.getWidth() + 0.5 * (1 - percentHeight) * this.height; //for even padding
    // this.backBtn.y = 0.5 * this.height;
    // this.settingsBtn.x =
    //   this.width -
    //   0.5 * this.settingsBtn.getWidth() -
    //   0.5 * (1 - percentHeight) * this.height; //for even padding
    // this.settingsBtn.y = 0.5 * this.height;
    // this.infoBtn.x =
    //   this.settingsBtn.x -
    //   0.5 * this.settingsBtn.getWidth() -
    //   0.5 * this.infoBtn.getWidth() -
    //   (1 - percentHeight) * this.height; //for even padding
    // this.infoBtn.y = 0.5 * this.height;
    // this.emitter.on("button_pressed", this.buttonPressed, this);
    // this.emitter.on("back_to_menu", this.startGoBackToMenu, this);
  }

  buttonPressed(params) {}

  closeMenu() {}

  scaleToFit(button) {}
}
