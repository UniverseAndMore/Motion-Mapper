class ProgressBar extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.scene.add.existing(this);

    this.perfectScaleY = 17.1;

    this.createGraphics();

    this.curBarPercent = 0;
    this.targetBarPercent = 0; //the % that the bar is currently "animating" to in the update function

    //for vibration
    this.xOffset;
    this.yOffset;

    this.barLit;
    this.barGlow;
  }

  createGraphics() {
    this.back = this.scene.add.sprite(0, 0, "bar-back").setAlpha(0.85);
    this.back.setOrigin(0.5, 0.5);

    this.bottom = this.scene.add.sprite(0, 0, "bar-bot");
    this.bottom.setOrigin(0.5, 1);
    this.bottom.y = 0.5 * this.back.height - 6; //bottom padding

    this.middle = this.scene.add.sprite(0, 0, "bar-mid");
    this.middle.setOrigin(0.5, 1);
    this.middle.y = this.bottom.y - this.bottom.height;
    this.middle.scaleY = 0;

    this.top = this.scene.add.sprite(0, 0, "bar-top");
    this.top.setOrigin(0.5, 1);
    this.top.y = this.middle.y - this.middle.height * this.middle.scaleY;

    this.add([this.back, this.bottom, this.middle, this.top]);

    this.barLit = this.scene.add.sprite(0, 0, "bar-lit");
    this.barLit.setOrigin(0.5, 0.5);

    this.barGlow = this.scene.add.sprite(0, 0, "bar-glow");
    this.barGlow.setOrigin(0.5, 0.5);

    this.add(this.barLit);
    this.add(this.barGlow);

    this.barLit.setVisible(false);
    this.barGlow.setVisible(false);
  }

  setPositionAndScale(posX, posY, scale) {
    this.baseScaleX = 0.95 * scale;
    this.baseScaleY = scale;

    this.scaleX = this.baseScaleX;
    this.scaleY = this.baseScaleY;

    this.posX = posX;
    this.posY = posY + 0.5 * this.back.height * this.scaleY;

    this.x = this.posX;
    this.y = this.posY;
  }

  showCompletionGraphics() {
    this.scaleX = 1.07 * this.baseScaleX;
    this.scaleY = 1.03 * this.baseScaleY;

    this.barLit.setVisible(true);
    this.barGlow.setVisible(true);

    this.barGlow.setScale(1);
    this.barGlow.setAlpha(1);

    this.scene.tweens.add({
      targets: this.barGlow,
      scaleX: 2.5,
      scaleY: 1.25,
      alpha: 0,
      duration: 300,
      ease: "Linear",
      paused: false,
    });

    this.scene.tweens.add({
      targets: this,
      scaleX: this.baseScaleX,
      scaleY: this.baseScaleY,
      duration: 200,
      ease: "Linear",
      paused: false,
    });
  }

  updateWithPercentInTarget(delta, percent, vibrate) {
    if (
      percent === this.targetBarPercent &&
      this.targetBarPercent === this.curBarPercent
    )
      return;

    const barScaleSpeed = this.targetBarPercent >= percent ? 0.004 : 0.01; //faster on rising, slower on falling

    this.targetBarPercent = percent;
    this.curBarPercent +=
      delta * barScaleSpeed * (this.targetBarPercent - this.curBarPercent);

    this.middle.scaleY = this.curBarPercent * this.perfectScaleY;
    this.top.y = this.middle.y - this.middle.height * this.middle.scaleY;

    if (vibrate) {
      this.xOffset = Phaser.Math.Between(0, 2);
      this.yOffset = Phaser.Math.Between(0, 2);
    } else {
      this.xOffset = 0;
      this.yOffset = 0;
    }

    this.x = this.posX + this.xOffset;
    this.y = this.posY + this.yOffset;
  }

  reset() {
    this.updateWithPercentInTarget(0, false);
    this.barLit.setVisible(false);
    this.barGlow.setVisible(false);
  }

  getWidth() {
    return this.back.width * this.scaleX;
  }

  getHeight() {
    return this.back.height * this.scaleY;
  }
}
