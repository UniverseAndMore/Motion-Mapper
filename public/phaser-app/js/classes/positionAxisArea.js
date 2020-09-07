class PositionAxisArea extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.scene.add.existing(this);

    this.axisOrient = config.axisOrient;

    this.isPortrait = config.isPortrait;

    this.x0 = config.x0;
    this.y0 = config.y0;

    this.bgColor = 0x122024;

    this.axisColor = 0xfcf3ca; //"#f3775b";
    this.axisColorCSS = "#fcf3ca";

    this.width = config.width;
    this.height = config.height;

    this.paddingTop = 0.08 * this.height;
    this.paddingBottom = 0.103 * this.height;

    this.paddingLeft =
      this.axisOrient === "vertical" ? 0.1 * this.width : 0.04 * this.width;
    this.paddingRight =
      this.axisOrient === "vertical" ? 0.1 * this.width : 0.04 * this.width;

    this.horizOrigin = config.horizOrigin;
    this.vertOrigin = config.vertOrigin;

    this.minPos = config.minPos;
    this.maxPos = config.maxPos;

    this.axisLength =
      this.axisOrient === "vertical"
        ? this.height - this.paddingTop - this.paddingBottom
        : this.width - this.paddingLeft - this.paddingRight;
    this.axisRemainderBeginning = 0.03 * this.axisLength; //space between beginning of line and first tick
    this.axisRemainderEnd =
      this.axisOrient === "vertical"
        ? 0.06 * this.axisLength
        : 0.12 * this.axisLength; //space between last tick and end of line
    this.axisSpacing =
      (this.axisLength - this.axisRemainderEnd) / (this.maxPos - this.minPos); //beginning remainder not included in length for spacing

    this.axisLabels = [];

    // this.createHorizontalRule();
    this.drawBackground();
    this.drawAxis();
    this.drawTicks();
    this.drawHeading();
    this.drawLabels();

    this.setupTouchListeners();
  }

  //to prevent page scroll
  setupTouchListeners() {
    // this.setInteractive({ draggable: false }).on("pointerdown", (pointer) => {
    //   console.log("touch");
    //   pointer.event.preventDefault();
    // });
  }

  drawBackground() {
    this.bg = this.scene.add.graphics({ fillStyle: { color: this.bgColor } });
    const rect = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
    this.bg.fillRectShape(rect);
    this.add(this.bg);
  }

  drawAxis() {
    this.axis = this.scene.add.graphics();
    this.axis.lineStyle(5, this.axisColor);

    if (this.axisOrient === "vertical") {
      this.axis.moveTo(this.horizOrigin, this.paddingTop);
      this.axis.lineTo(
        this.horizOrigin,
        this.height - this.paddingBottom + this.axisRemainderBeginning
      );
    } else {
      this.axis.moveTo(
        this.width - this.paddingRight,
        this.height - this.vertOrigin
      );
      this.axis.lineTo(
        this.paddingLeft - this.axisRemainderBeginning,
        this.height - this.vertOrigin
      );
    }
    this.axis.strokePath();

    //AXIS ARROWHEAD
    this.axis.fillStyle(this.axisColor);
    const arrowBase = 14;
    const arrowHeight = 25;

    const arrowHead =
      this.axisOrient === "vertical"
        ? new Phaser.Geom.Triangle(
            this.horizOrigin - 0.5 * arrowBase,
            this.paddingTop + 0.5 * arrowHeight,
            this.horizOrigin + 0.5 * arrowBase,
            this.paddingTop + 0.5 * arrowHeight,
            this.horizOrigin,
            this.paddingTop - 0.5 * arrowHeight
          )
        : new Phaser.Geom.Triangle(
            this.width - this.paddingRight - 0.5 * arrowHeight,
            this.height - this.vertOrigin - 0.5 * arrowBase,
            this.width - this.paddingRight + 0.5 * arrowHeight,
            this.height - this.vertOrigin,
            this.width - this.paddingRight - 0.5 * arrowHeight,
            this.height - this.vertOrigin + 0.5 * arrowBase
          );

    this.axis.fillTriangleShape(arrowHead);

    this.add(this.axis);
  }

  drawTicks() {
    this.axis.lineStyle(3, this.axisColor);
    const tickLength = 10;
    // this.axisOrient === "vertical" ? 0.02 * this.width : 0.015 * this.width;

    //////AXIS TICKS
    for (var i = this.minPos; i <= this.maxPos; i++) {
      if (this.axisOrient === "vertical") {
        const tickY =
          this.paddingTop +
          this.axisRemainderEnd +
          (this.maxPos - i) * this.axisSpacing;
        this.axis.moveTo(this.horizOrigin, tickY);
        this.axis.lineTo(this.horizOrigin - tickLength, tickY);
      } else {
        //if horizontal
        const tickX =
          this.paddingLeft +
          this.axisRemainderBeginning +
          (this.maxPos - i) * this.axisSpacing;
        this.axis.moveTo(tickX, this.height - this.vertOrigin);
        this.axis.lineTo(tickX, this.height - this.vertOrigin + tickLength);
      }
    }

    this.axis.strokePath();
  }

  drawHeading() {
    const headingX =
      this.axisOrient === "vertical"
        ? this.horizOrigin - 18
        : this.width - this.paddingRight - 10;
    const headingY =
      this.axisOrient === "vertical"
        ? this.paddingTop - 16
        : this.height - this.vertOrigin;

    const fontSize = this.isPortrait ? 30 : 20;

    this.heading = this.scene.add
      .text(headingX, headingY, "position", {
        fontFamily: "sans-serif",
        fontSize: fontSize,
        color: this.axisColorCSS,
      })
      .setResolution(1.5);

    if (this.axisOrient === "vertical") {
      this.heading.setOrigin(0.7, 1.2);
    } else {
      this.heading.setOrigin(0.75, 2);
    }
    this.add(this.heading);
  }

  drawLabels() {
    for (var i = this.minPos; i <= this.maxPos - this.minPos; i++) {
      const labelX =
        this.axisOrient === "vertical"
          ? this.horizOrigin - 17
          : this.paddingLeft +
            this.axisRemainderBeginning -
            (this.minPos - i) * this.axisSpacing;
      const labelY =
        this.axisOrient === "vertical"
          ? this.height -
            this.paddingBottom +
            (this.minPos - i) * this.axisSpacing
          : this.height - this.vertOrigin + 8;

      const fontSize = this.isPortrait ? 30 : 18;

      const labelString = this.isPortrait ? `${i}m` : `${i} m`;

      const label = this.scene.add.text(labelX, labelY, labelString, {
        fontFamily: "sans-serif",
        fontSize: fontSize,
        color: this.axisColorCSS,
      });
      //2-digit numbers
      if (this.axisOrient === "vertical" && i > 9) label.setOrigin(1.0, 0.5);
      else if (this.axisOrient === "vertical") label.setOrigin(1.0, 0.5);
      else label.setOrigin(0.5, 0);
      this.axisLabels.push(label);
      this.add(label);
      label.setResolution(2.5);
    }
  }
  // createHorizontalRule() {
  //   this.horizontalRule = this.scene.add.graphics();
  //   this.horizontalRule.lineStyle(1, 0xf3775b);
  //   this.horizontalRule.moveTo(0, 0);
  //   this.horizontalRule.lineTo(this.width, 0);
  //   this.horizontalRule.strokePath();
  //   this.add(this.horizontalRule);
  // }

  setAxisVisible(visible) {
    this.axis.setVisible(visible);
    this.heading.setVisible(visible);
    this.axisLabels.forEach(function (label) {
      label.setVisible(visible);
    });
  }

  updateReturnAxisPosition(newBoxPos) {
    const axisOrient = this.axisOrient;

    const boxPos =
      axisOrient === "vertical" ? newBoxPos - this.y : newBoxPos - this.x;

    const axisSpacing = this.axisSpacing;

    this.axisLabels.forEach(function (label) {
      if (axisOrient === "vertical") {
        const deltaY = Math.abs(label.y - boxPos);
        if (deltaY < 2.5 * axisSpacing) {
          const newScale =
            1 +
            (0.5 * Math.pow(2.5 * axisSpacing - deltaY, 2)) /
              Math.pow(2.5 * axisSpacing, 2);
          label.setScale(newScale);
        } else label.setScale(1);
      } else {
        //horizontal
        const deltaX = Math.abs(label.x - boxPos);
        if (deltaX < 2.5 * axisSpacing) {
          const newScale =
            1 +
            (0.5 * Math.pow(2.5 * axisSpacing - deltaX, 2)) /
              Math.pow(2.5 * axisSpacing, 2);
          label.setScale(newScale);
        } else label.setScale(1);
      }
    });

    return axisOrient === "vertical"
      ? (this.height - this.paddingBottom - boxPos) / this.axisSpacing
      : (boxPos - this.paddingLeft - this.axisRemainderBeginning) /
          this.axisSpacing;
  }
}
