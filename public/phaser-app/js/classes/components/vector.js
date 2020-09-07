class Vector extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.scene.add.existing(this);

    this.axisOrient = config.axisOrient;

    this.isVelocity = config.isVelocity;
    this.isAcceleration = config.isAcceleration;

    this.createGraphics();
  }

  createGraphics() {
    const bodyPath = this.isVelocity
      ? "velocity-vector-body"
      : "acceleration-vector-body";
    const headPath = this.isVelocity
      ? "velocity-vector-head"
      : "acceleration-vector-head";

    this.vectorBody = this.scene.add.sprite(0, 0, bodyPath).setOrigin(0, 0.5);
    this.add(this.vectorBody);

    this.vectorHead = this.scene.add.sprite(0, 0, headPath).setOrigin(0.2, 0.5);
    this.add(this.vectorHead);

    const labelPath =
      this.axisOrient === "horizontal"
        ? this.isVelocity
          ? "vx-label"
          : "ax-label"
        : this.isVelocity
        ? "vy-label"
        : "ay-label";
    this.vectorLabel = this.scene.add.sprite(0, 0, labelPath).setOrigin(0.5, 1);
    this.add(this.vectorLabel);

    if (this.axisOrient === "vertical") {
      this.setRotation(Math.PI / 2);
      this.vectorLabel.setOrigin(0, 0.5);
    }
  }

  updateWithValue(value, minMagnitudeToShow, minMagnitudeToStretch) {
    const magnitude = Math.abs(value);

    if (magnitude < minMagnitudeToShow) {
      this.setVisible(false);
      return;
    } else if (!this.visible) {
      this.setVisible(true);
    }

    if (magnitude < minMagnitudeToStretch) {
      this.vectorBody.scale = 1;
      this.vectorHead.x = this.vectorBody.width;
      this.vectorLabel.x = 0.5 * this.vectorBody.width;
      this.scale =
        0.4 +
        (0.6 * (magnitude - minMagnitudeToShow)) /
          (minMagnitudeToStretch - minMagnitudeToShow);
    } else if (magnitude >= minMagnitudeToStretch) {
      this.scale = 1;
      this.vectorBody.scaleX = 1 + 0.5 * (magnitude - minMagnitudeToStretch);
      this.vectorHead.x = this.vectorBody.width * this.vectorBody.scaleX;
      this.vectorLabel.x = 0.5 * this.vectorBody.width * this.vectorBody.scaleX;
    }

    this.vectorLabel.y = -0.6 * this.vectorHead.height;

    if (value < 0) {
      this.scaleX = -1 * Math.abs(this.scaleX);
      this.vectorLabel.scaleX = -1;

      if (this.axisOrient === "vertical") {
        this.vectorLabel.setRotation(Math.PI / 2);
      }
    } else {
      this.vectorLabel.scaleX = 1;
      if (this.axisOrient === "vertical") {
        this.vectorLabel.setRotation(-Math.PI / 2);
      }
    }
  }
}
