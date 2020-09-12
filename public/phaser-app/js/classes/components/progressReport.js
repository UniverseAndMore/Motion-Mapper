class ProgressReport extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.scene.add.existing(this);

    this.emitter = config.emitter;

    this.width = config.width;
    this.height = config.height;

    this.bgColor = 0xfcf3ca; //0x2c3234; //space gray

    this.portraitMode = config.portraitMode;

    //   this.level = config.levNum;

    this.drawBackground();
    this.createSummary();

    //   emitter.on(G.LEVEL_BEATEN, this.levelBeaten);
  }

  drawBackground() {
    this.bg = this.scene.add.graphics({ fillStyle: { color: this.bgColor } });
    const rect = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
    this.bg.fillRectShape(rect);
    this.add(this.bg);
  }

  createSummary() {}

  buttonPressed(params) {}

  closeMenu() {}

  scaleToFit(button) {}
}
