class HeaderBar extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.scene.add.existing(this);

    this.emitter = config.emitter;

    this.width = config.width;
    this.height = config.height;

    this.mode = config.mode;

    this.menuWidth = config.menuWidth;
	this.menuHeight = config.menuHeight;
	
	this.bgColor = 0x2c3234; //space gray

    this.level = config.levNum;
    this.totalLevels = config.totalLevels;

    this.portraitMode = config.portraitMode;

    this.settingsMenuShowing = false;
    this.settingsMenuAnimating = false;

    this.canSelectLevel = true;

    this.settingsMenuAnimating = false;

    this.createSettingsMenu();
    this.drawBackground();
    this.createButtons();
    this.createCompletionIcons();
    this.createLevelHeading();

    this.scene.input.keyboard.on("keydown_ESC", this.closeSettingsMenu, this);

    this.emitter.on(G.LEVEL_BEATEN, this.levelBeaten);
  }

  closeSettingsMenu() {
    if (this.settingsMenuShowing && !this.settingsMenuAnimating) {
      this.hideSettingsMenu();
    }
  }

  drawBackground() {
	TextureHelpers.createRectTexture(this.scene, "header-bar-bg", this.bgColor);

	this.bg = this.scene.add.image(0, 0, "header-bar-bg").setOrigin(0);
	this.bg.setDisplaySize(this.width, this.height);
    this.add(this.bg);
  }

  createLevelHeading() {
    this.levelNum = this.scene.add.sprite(
      0.5 * this.width,
      0.5 * this.height,
      "level-nums"
    );
    this.add(this.levelNum);
    this.levelNum.displayHeight = 0.8 * this.height;
    this.levelNum.scaleX = this.levelNum.scaleY;

    this.updateWithLevelNum(this.level);
  }

  createCompletionIcons() {
    this.completionIconBG = this.scene.add
      .sprite(0.73 * this.width, 0.5 * this.height, "completion-outline")
      .setOrigin(0.5, 0.5);

    this.completionIcon = this.scene.add
      .sprite(0.73 * this.width, 0.5 * this.height, "completion-target")
      .setOrigin(0.5, 0.5);

    this.add(this.completionIconBG);
    this.add(this.completionIcon);

    this.completionIconBG.setScale(0.4);
    this.completionIcon.setScale(0.4);

    this.completionIcon.setVisible(false);
  }

  updateWithLevelNum(levNum) {
    this.level = levNum;

    this.levelNum.setFrame(levNum - 1);

    this.setLevelButtonVisibility(levNum);

    if (model.wasLevelAlreadyBeaten(levNum)) {
      this.completionIcon.setVisible(true);
    } else {
      this.completionIcon.setVisible(false);
    }
  }

  createButtons() {
    this.backBtn = new UIButton({
      scene: this.scene,
      key: "icon-back",
      event: "back_to_menu",
      defaultAlpha: 0.85,
    });
    this.backBtn.setScale(0.9);
    // this.backBtn.setDepth(13);

    this.sfx = new UIButton({
      scene: this.scene,
      key: "icon-sfx",
      event: "toggle_sfx",
      toggle: true,
    });
    // this.sfx.setOrigin(0, 1);
    if (!model.soundOn) {
      this.sfx.toggleBtn();
    }

    emitter.on("toggle_sfx", this.toggleSFX, this);

    this.prevLevelBtn = new UIButton({
      scene: this.scene,
      key: "level-select-btn",
      event: "prev_level",
      defaultAlpha: 1,
    });
    // this.prevLevelBtn.setScale(0.9);

    this.nextLevelBtn = new UIButton({
      scene: this.scene,
      key: "level-select-btn",
      event: "next_level",
      defaultAlpha: 1,
    });
    // this.nextLevelBtn.setScale(0.9);

    // this.infoBtn = new UIButton({
    //   scene: this.scene,
    //   key: "icon-info",
    //   event: "button_pressed",
    //   params: "show_info",
    //   defaultAlpha: 0.85,
    // });

    const percentHeight = 0.7; //how much of the height do the buttons take up?

    // this.infoBtn.setScale(percentHeight);
    // this.infoBtn.setDepth(13);

    this.prevLevelBtn.setScale(1);
    this.nextLevelBtn.setScale(1);

    this.settingsBtn = new UIButton({
      scene: this.scene,
      key: "icon-gear",
      event: "button_pressed",
      params: "show_settings",
      defaultAlpha: 0.85,
    });

    this.settingsBtn.setScale(0.8);
    // this.settingsBtn.setDepth(13);

    this.add(this.backBtn);
    this.add(this.sfx);
    // this.add(this.infoBtn);
    this.add(this.settingsBtn);

    this.add(this.prevLevelBtn);
    this.add(this.nextLevelBtn);

    this.scaleToFit(this.backBtn, 0.7);
    this.scaleToFit(this.sfx, 0.64);
    // this.scaleToFit(this.infoBtn, 0.7);
    this.scaleToFit(this.settingsBtn, 0.7);

    this.scaleToFit(this.prevLevelBtn, 1);
    this.scaleToFit(this.nextLevelBtn, 1);

    this.prevLevelBtn.scaleX *= -1;

    this.backBtn.x =
      0.5 * this.backBtn.getWidth() + 0.5 * (1 - percentHeight) * this.height; //for even padding
    this.backBtn.y = 0.5 * this.height;

    this.sfx.x =
      this.backBtn.x +
      this.backBtn.getWidth() +
      0.5 * (1 - percentHeight) * this.height; //for even padding
    this.sfx.y = 0.5 * this.height;

    this.prevLevelBtn.x = 0.42 * this.width;
    this.prevLevelBtn.y = 0.5 * this.height;

    this.nextLevelBtn.x = 0.58 * this.width;
    this.nextLevelBtn.y = 0.5 * this.height;

    if (this.portraitMode) {
      this.prevLevelBtn.x = 0.36 * this.width;
      this.nextLevelBtn.x = 0.64 * this.width;
    }

    this.settingsBtn.x =
      this.width -
      0.5 * this.settingsBtn.getWidth() -
      0.5 * (1 - percentHeight) * this.height; //for even padding
    this.settingsBtn.y = 0.5 * this.height;

    // this.infoBtn.x =
    //   this.settingsBtn.x -
    //   0.5 * this.settingsBtn.getWidth() -
    //   0.5 * this.infoBtn.getWidth() -
    //   (1 - percentHeight) * this.height; //for even padding
    // this.infoBtn.y = 0.5 * this.height;

    if (this.mode === "input") {
      this.settingsBtn.setVisible(false);
      this.settingsBtn.disable();
    } else {
      this.settingsBtn.setVisible(true);
      this.settingsBtn.enable();
    }

    this.emitter.on("button_pressed", this.buttonPressed, this);
    this.emitter.on("back_to_menu", this.startGoBackToMenu, this);
    this.emitter.on("prev_level", this.prevLevelPressed, this);
    this.emitter.on("next_level", this.nextLevelPressed, this);
  }

  buttonPressed(params) {
    if (params === "show_settings") {
      this.toggleSettingsMenu();
    }
  }

  toggleSFX() {
    model.soundOn = !model.soundOn;
  }

  prevLevelPressed() {
    if (!this.canSelectLevel) return;
    this.level--;
    this.updateWithLevelNum(this.level);
    this.emitter.emit(G.PREV_LEVEL_PRESSED);
  }

  nextLevelPressed() {
    if (!this.canSelectLevel) return;
    this.level++;
    this.updateWithLevelNum(this.level);
    this.emitter.emit(G.NEXT_LEVEL_PRESSED);
  }

  startGoBackToMenu() {
    if (this.settingsMenuAnimating) return;

    if (this.settingsMenuShowing) {
      this.toggleSettingsMenu();
    } else {
      this.emitter.emit(G.STOP_GRAPH_ZAP);
      this.scene.scene.start("SceneMenu");
    }
  }

  scaleToFit(button, factor) {
    button.setDisplayHeight(factor * this.height);
  }

  levelBeaten() {
    //model.levelsBeaten....
  }

  disableLevelSelect() {
    this.canSelectLevel = false;

    this.prevLevelBtn.disable();
    this.nextLevelBtn.disable();
  }

  enableLevelSelect() {
    this.canSelectLevel = true;

    this.prevLevelBtn.enable();
    this.nextLevelBtn.enable();
  }

  setLevelBeaten() {
    if (!this.completionIcon.visible) {
      this.completionIcon.setVisible(true);
      this.completionIcon.scale = 0;

      this.scene.tweens.add({
        targets: this.completionIcon,
        scale: 0.41,
        duration: 150,
        ease: "Back.Out",
        paused: false,
      });
    }
  }

  ////////// SETTINGS MENU /////////
  createSettingsMenu() {
    this.settingsMenu = new SettingsMenu({
      scene: this.scene,
      emitter: this.emitter,
      width: this.menuWidth,
      height: this.menuHeight,
      portraitMode: this.portraitMode,
      mode: this.mode,
    });
    this.add(this.settingsMenu);

    this.settingsMenu.y = -(this.menuHeight - this.height);

    this.settingsMenu.setVisible(false);
  }

  toggleSettingsMenu() {
    if (this.settingsMenuAnimating) return;
    this.settingsMenuAnimating = true;
    if (!this.settingsMenuShowing) {
      this.showSettingsMenu();
    } else this.hideSettingsMenu();
  }

  showSettingsMenu() {
    this.emitter.emit(G.PAUSE_GAME);
    this.settingsMenu.setVisible(true);
    this.scene.tweens.add({
      targets: this.settingsMenu,
      paused: false,
      duration: 200,
      ease: "Quad.easeOut",
      onComplete: this.settingsMenuEntered.bind(this),
      y: 0,
    });

    this.settingsMenuAnimating = true;

    this.prevLevelBtn.setVisible(false);
    this.nextLevelBtn.setVisible(false);
  }

  hideSettingsMenu() {
    this.scene.tweens.add({
      targets: this.settingsMenu,
      paused: false,
      duration: 300,
      ease: "Quad.easeOut",
      onComplete: this.settingsMenuExited.bind(this),
      x: 0,
      y: -(this.menuHeight - this.height),
    });

    this.settingsMenuAnimating = true;
  }

  settingsMenuEntered() {
    this.settingsMenuAnimating = false;
    this.settingsMenuShowing = true; //enable click listeners
    this.settingsMenuAnimating = false;
  }

  settingsMenuExited() {
    this.emitter.emit(G.UNPAUSE_GAME);
    this.settingsMenu.setVisible(false);
    this.settingsMenuAnimating = false;
    this.settingsMenuShowing = false;
    this.settingsMenuAnimating = false;

    this.setLevelButtonVisibility(this.level);
  }

  setLevelButtonVisibility(levNum) {
    this.prevLevelBtn.setVisible(levNum !== 1);
    this.nextLevelBtn.setVisible(levNum !== this.totalLevels);
  }
}
