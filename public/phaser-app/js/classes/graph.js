class Graph extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.scene.add.existing(this);

    this.mode = config.mode;

    this.x0 = config.x0;
    this.y0 = config.y0;

    this.graphType = config.graphType;

    this.width = config.width;
    this.height = config.height;

    this.minX = 0;
    this.maxX = config.maxTime;

    this.minY = config.minY;
    this.maxY = config.maxY;

    this.timingBarTween = null;

    this.timeFactor = 1;

    this.paddingLeft = config.paddingLeft;
    this.paddingRight = config.paddingRight;
    this.paddingTop = config.paddingTop;
    this.paddingBottom = config.paddingBottom;

    this.gridLinesPerTickX = config.gridLinesPerTickX;
    this.gridLinesPerTickY = config.gridLinesPerTickY;

    this.isPortrait = config.isPortrait;

    this.xAxisLength = this.width - this.paddingLeft - this.paddingRight;
    this.yAxisLength = this.height - this.paddingTop - this.paddingBottom;
    this.xAxisRemainder = 0.06 * this.xAxisLength;
    this.yAxisRemainderStart = 0.03 * this.yAxisLength; //only for velocity-time
    this.yAxisRemainderEnd = 0.07 * this.yAxisLength;

    this.axisColor = 0x2c3234; //space gray

    this.xAxisSpacing =
      (this.xAxisLength - this.xAxisRemainder) /
      ((this.maxX - this.minX) * config.gridLinesPerTickX);
    this.yAxisSpacing =
      (this.yAxisLength - this.yAxisRemainderEnd) /
      ((this.maxY - this.minY) * config.gridLinesPerTickY);

    if (this.yAxisSpacing >= 2 * this.xAxisSpacing) {
      //fill in empty space if graph is stretched on mobile portrait mode
      this.gridLinesPerTickY *= 2;
      this.yAxisSpacing =
        (this.yAxisLength - this.yAxisRemainderEnd) /
        ((this.maxY - this.minY) * this.gridLinesPerTickY);
    }

    this.xAxisLabels = [];
    this.yAxisLabels = [];

    this.timeElapsed = 0;

    this.percentInTarget = 0;

    this.curX;
    this.curY;

    this.drawBackground();
    this.drawGridLines();
    this.setupGraphTarget();
    this.createTimingBar();
    this.drawAxes();
    this.drawTicks();
    this.drawAxisHeadings();
    this.drawAxisLabels();
    this.setupLineGraphics();
    if (this.graphType === "velocity") {
      this.setupGraphVector();
    }
  }

  drawBackground() {
	TextureHelpers.createRectTexture(this.scene, "graph-bg", 0xf4f4f4);
	this.bg = this.scene.add.image(0, 0, "graph-bg").setOrigin(0);
	this.bg.setDisplaySize(this.width, this.height);
    this.add(this.bg);
  }

  drawGridLines() {
	//////VERTICAL GRID LINES
    this.gridLinesVert = this.scene.add.graphics();
    this.gridLinesVert.lineStyle(2, 0xe8e8e8);

    for (
      var i = this.paddingLeft % this.xAxisSpacing;
      i < this.width;
      i += this.xAxisSpacing
    ) {
      this.gridLinesVert.moveTo(i, 0);
      this.gridLinesVert.lineTo(i, this.height);
    }
    this.gridLinesVert.strokePath();
    this.add(this.gridLinesVert);

    //////HORIZONTAL GRID LINES
    this.gridLinesHoriz = this.scene.add.graphics();
    this.gridLinesHoriz.lineStyle(2, 0xe8e8e8);

    for (
      var j = this.height - (this.paddingBottom % this.yAxisSpacing);
      j > 0;
      j -= this.yAxisSpacing
    ) {
      this.gridLinesHoriz.moveTo(0, j);
      this.gridLinesHoriz.lineTo(this.width, j);
    }
    this.gridLinesHoriz.strokePath();
    this.add(this.gridLinesHoriz);
  }

  setupLineGraphics() {
    this.line = this.scene.make.graphics();
    this.line.fillStyle(0xf3775b);

    const point = new Phaser.Geom.Circle(4, 4, 4);
    this.line.fillCircleShape(point);
    this.line.generateTexture("point", 8, 8);

    this.line.clear();
    this.line.fillStyle(0xfaeb86);
    this.line.fillCircleShape(point);
    this.line.generateTexture("point-lit", 8, 8);

    this.line.clear();
    const lineseg = new Phaser.Geom.Rectangle(0, 0, 8, 8);
    this.line.fillStyle(0xf3775b);
    this.line.fillRectShape(lineseg);
    this.line.generateTexture("segment", 8, 8);

    this.line.clear();
    this.line.fillStyle(0xfaeb86);
    this.line.fillRectShape(lineseg);
	this.line.generateTexture("segment-lit", 8, 8);
	this.line.destroy();

    this.lineGraphicsGroup = this.scene.add.group();
    this.lineGraphicsGroup.setDepth(10);
  }

  clearGraphLine() {
    model.addToTotalTimeSpentGraphing(this.timeElapsed);

    if (this.lineGraphicsGroup) {
      this.lineGraphicsGroup.clear(true, true);
    }
    this.timeElapsed = 0;
    this.withinTarget = false;
    this.percentInTarget = 0;

    if (this.timingBarShowing) {
      this.cancelTimingBar();
    }
  }

  drawAxes() {
    this.axes = this.scene.add.graphics();
    this.axes.lineStyle(5, this.axisColor);
    this.axes.moveTo(this.paddingLeft, this.paddingTop);

    if (this.graphType === "position") {
      this.axes.lineTo(this.paddingLeft, this.height - this.paddingBottom);
      this.axes.lineTo(
        this.width - this.paddingRight,
        this.height - this.paddingBottom
      );
      this.axes.lineTo(this.paddingLeft, this.height - this.paddingBottom);
    } else {
      //velocity time
      this.axes.lineTo(
        this.paddingLeft,
        this.height - this.paddingBottom + this.yAxisRemainderStart
      );

      const yOrigin =
        this.height -
        this.paddingBottom -
        (this.yAxisSpacing * this.gridLinesPerTickY * (this.maxY - this.minY)) /
          2;

      this.axes.lineTo(this.paddingLeft, yOrigin);
      this.axes.lineTo(this.width - this.paddingRight, yOrigin);
      this.axes.lineTo(this.paddingLeft, yOrigin);
	}
	
	this.axes.strokePath();

    this.add(this.axes);

    this.axes.fillStyle(this.axisColor);

    //AXIS ARROWHEADS
    const arrowBase = 14;
    const arrowHeight = 30;

    const yOffset =
      this.graphType === "velocity"
        ? (this.yAxisSpacing *
            this.gridLinesPerTickY *
            (this.maxY - this.minY)) /
          2
        : 0;

    const arrowHeadX = new Phaser.Geom.Triangle(
      this.width - this.paddingRight - 0.5 * arrowHeight,
      this.height - this.paddingBottom + 0.5 * arrowBase - yOffset,
      this.width - this.paddingRight - 0.5 * arrowHeight,
      this.height - this.paddingBottom - 0.5 * arrowBase - yOffset,
      this.width - this.paddingRight + 0.5 * arrowHeight,
      this.height - this.paddingBottom - yOffset
    );

    const arrowHeadY = new Phaser.Geom.Triangle(
      this.paddingLeft - 0.5 * arrowBase,
      this.paddingTop + 0.5 * arrowHeight,
      this.paddingLeft + 0.5 * arrowBase,
      this.paddingTop + 0.5 * arrowHeight,
      this.paddingLeft,
      this.paddingTop - 0.5 * arrowHeight
    );

    this.axes.fillTriangleShape(arrowHeadX);
    this.axes.fillTriangleShape(arrowHeadY);

    this.axes.setDepth(10);
  }

  drawTicks() {
    this.axes.lineStyle(3, this.axisColor);
    const tickLengthX = 0.5 * this.yAxisSpacing;
    const tickLengthY = 0.5 * this.xAxisSpacing;

    //////X AXIS TICKS
    const xAxisYPosition =
      this.graphType === "position"
        ? this.height - this.paddingBottom
        : this.height -
          this.paddingBottom -
          (this.yAxisSpacing *
            this.gridLinesPerTickY *
            (this.maxY - this.minY)) /
            2;

    for (var i = this.minX; i <= this.maxX; i++) {
      const tickX =
        this.paddingLeft + i * this.gridLinesPerTickX * this.xAxisSpacing;
      this.axes.moveTo(tickX, xAxisYPosition);
      this.axes.lineTo(tickX, xAxisYPosition + tickLengthX);
    }

    //////Y AXIS TICKS
    const yAxisXPosition = this.paddingLeft;
    for (var j = 0; j <= this.maxY - this.minY; j++) {
      const tickY =
        this.height -
        this.paddingBottom -
        j * this.gridLinesPerTickY * this.yAxisSpacing;
      this.axes.moveTo(yAxisXPosition, tickY);
      this.axes.lineTo(yAxisXPosition - tickLengthY, tickY);
    }

    this.axes.strokePath();
  }

  drawAxisHeadings() {
    const yOffset =
      this.graphType === "velocity"
        ? (this.yAxisSpacing *
            this.gridLinesPerTickY *
            (this.maxY - this.minY)) /
          2
        : 0;

    const fontSize = this.isPortrait ? 30 : 20;

    const xHeading = this.scene.add.text(
      this.paddingLeft + this.xAxisLength,
      this.height - this.paddingBottom - 30 - yOffset,
      "time",
      {
        fontFamily: "sans-serif",
        fontSize: fontSize,
        color: this.axisColor,
      }
    );

    const yHeading = this.scene.add.text(
      this.paddingLeft - 25,
      0.8 * this.paddingTop,
      `${this.graphType}`,
      {
        fontFamily: "sans-serif",
        fontSize: fontSize,
        color: this.axisColor,
      }
    );

    xHeading.setOrigin(0, 0.5);
    yHeading.setOrigin(-0.5, 0.5);

    this.add(xHeading);
    this.add(yHeading);
  }

  drawAxisLabels() {
    const yOffset =
      this.graphType === "velocity"
        ? (this.yAxisSpacing *
            this.gridLinesPerTickY *
            (this.maxY - this.minY)) /
          2
        : 0;

    const fontSize = this.isPortrait ? 30 : 20;

    for (var i = 0; i <= this.maxX; i++) {
      const xLabel = this.scene.add.text(
        this.paddingLeft + i * (this.gridLinesPerTickX * this.xAxisSpacing),
        this.height - this.paddingBottom - yOffset + this.yAxisSpacing,
        `${i} s`,
        {
          fontFamily: "sans-serif",
          fontSize: fontSize,
          color: this.axisColor,
        }
      );
      xLabel.setOrigin(0.5, 0);

      if (i === 0 && this.graphType === "velocity") xLabel.setOrigin(-0.5, 0);

      this.xAxisLabels.push(xLabel);
      this.add(xLabel);
    }

    const yUnits = this.graphType === "position" ? "m" : "m/s";

    for (var j = this.minY; j <= this.maxY; j++) {
      const yLabel = this.scene.add.text(
        this.paddingLeft - this.xAxisSpacing,
        this.height -
          this.paddingBottom +
          (this.minY - j) * (this.gridLinesPerTickY * this.yAxisSpacing),
        `${j} ${yUnits}`,
        {
          fontFamily: "sans-serif",
          fontSize: fontSize,
          color: this.axisColor,
        }
      );
      yLabel.setDepth(1);
      if (j > 9) yLabel.setOrigin(0.9, 0.6);
      //2-digit numbers
      else yLabel.setOrigin(1, 0.6);
      this.yAxisLabels.push(yLabel);
      this.add(yLabel);
    }
  }

  createTimingBar() {
	  //TODO: performance issue - no sense to use Graphics. Much better to use simple texture and create sprite with needed size.
    this.timingBar = this.scene.add
      .graphics()
      .lineStyle(8, 0xf3775b)
      .moveTo(0, 0)
      .lineTo(0, this.height)
      .setAlpha(0)
      .strokePath();
    this.add(this.timingBar);
  }

  startTimingBarIn() {
    const durationFactor = this.mode === "input" ? 0.6 : 2;

    this.timingBar.x = 0;
    this.timingBarShowing = true;
    this.timingBar.setAlpha(0);
    this.timingBar.setVisible(true);
    this.timingBarTween = this.scene.tweens.add({
      targets: this.timingBar,
      paused: false,
      duration:
        ((durationFactor / this.timeFactor) * (1000 * this.paddingLeft)) /
        (this.xAxisSpacing * this.gridLinesPerTickX), // animation consistent with the time axis
      ease: "Linear",
      onComplete: this.timingBarEntered.bind(this),
      x: this.paddingLeft,
      alpha: 0.6,
    });
  }

  timingBarEntered() {
    this.timingBarTween = null;
    this.timingBar.setVisible(false);
    this.timingBarShowing = false;

    if (this.mode === "input") {
      emitter.emit(G.TURN_OFF_MATTER_PHYSICS);
    }
  }

  startTimingBarOut() {
    this.timingBar.x = this.width - this.paddingRight - this.xAxisRemainder;
    this.timingBarShowing = true;
    this.timingBar.setAlpha(0.1);
    this.timingBar.setVisible(true);
    this.timingBarTween = this.scene.tweens.add({
      targets: this.timingBar,
      paused: false,
      duration:
        ((1.4 / this.timeFactor) *
          (1000 * (this.paddingRight + this.xAxisRemainder))) /
        (this.xAxisSpacing * this.gridLinesPerTickX),
      ease: "Linear",
      onComplete: this.timingBarExited.bind(this),
      x: this.width,
      alpha: 0.4,
    });
  }

  timingBarExited() {
    this.timingBarTween = null;
    this.startTimingBarIn();
  }

  cancelTimingBar() {
    this.timingBar.setAlpha(0);
    this.timingBar.setVisible(false);
    this.timingBarTween.stop();
    this.timingBarTween = null;

    this.timingBarShowing = false;
  }

  isWithinTarget(x, y) {
    if (this.polygon) {
      return Phaser.Geom.Polygon.ContainsPoint(this.polygon, { x: x, y: y });
    } else return false;
  }

  getIsWithinTarget() {
    if (this.mode === "input" && this.timeElapsed > this.maxX) {
      return false;
    } else return this.withinTarget;
  }

  getCurPoint() {
    return { x: this.curX, y: this.curY };
  }

  setTimeFactor(timeFactor) {
    this.timeFactor = timeFactor;
  }

  updateReturnPercentInTargetCanCheck(delta, newY) {
    if (
      this.mode === "control" &&
      this.timeElapsed > this.maxX &&
      !this.timingBarShowing
    ) {
      this.clearGraphLine();
      this.startTimingBarOut();
    }

    if (this.graphType === "velocity") {
      this.updateGraphVector(newY);
    }

    if (this.timingBarShowing) {
      return {
        percentInTarget: this.percentInTarget,
        canCheckForCompletion: false,
      };
    }

    if (this.mode === "input" && this.timeElapsed > this.maxX) {
      return {
        percentInTarget: this.percentInTarget,
        canCheckForCompletion: false,
      };
    }

    this.curX =
      this.x +
      this.paddingLeft +
      this.timeElapsed * this.gridLinesPerTickX * this.xAxisSpacing;
    this.curY =
      this.y +
      this.height -
      this.paddingBottom -
      newY * this.gridLinesPerTickY * this.yAxisSpacing;

    if (this.graphType === "velocity") {
      this.curY -=
        0.5 *
        this.yAxisSpacing *
        this.gridLinesPerTickY *
        (this.maxY - this.minY);
    }

    let prevWithinTarget = this.withinTarget;
    this.withinTarget = this.isWithinTarget(
      this.curX - this.x,
      this.curY - this.y
    );

    const pointPath =
      this.withinTarget || prevWithinTarget ? "point-lit" : "point";
    const point = this.scene.add.sprite(this.curX, this.curY, pointPath);
    this.lineGraphicsGroup.add(point);

    //not the first point
    if (this.timeElapsed > 0) {
      //distance equation
      const distFromLastPoint = Math.sqrt(
        Math.pow(Math.abs(this.curX - this.lastX), 2) +
          Math.pow(Math.abs(this.curY - this.lastY), 2)
      );

      const segmentPath =
        this.withinTarget || prevWithinTarget ? "segment-lit" : "segment";
      const segment = this.scene.add.sprite(this.curX, this.curY, segmentPath);
      this.lineGraphicsGroup.add(segment);

      // line segment base length = 4 + 8 + 4 = 16, height = 8
      segment.setOrigin(0, 0.5); //in the center of endpoint1
      segment.setAngle(
        (180 / Math.PI) *
          Phaser.Math.Angle.Between(
            this.curX,
            this.curY,
            this.lastX,
            this.lastY
          )
      );
      segment.setScale(distFromLastPoint / 8, 1);
    }

    this.lastX = this.curX;
    this.lastY = this.curY;

    this.timeElapsed += (delta * this.timeFactor) / 1000;

    if (this.withinTarget)
      this.percentInTarget += (delta * this.timeFactor) / 1000 / this.maxX;

    return {
      timeElapsed: this.timeElapsed,
      percentInTarget: this.percentInTarget,
      canCheckForCompletion: this.timeElapsed >= this.maxX,
    };
  }

  convertDataPointToLocalSpaceCoords({ x, y }) {
    const localX =
      this.paddingLeft + x * this.gridLinesPerTickX * this.xAxisSpacing;
    const localY =
      this.height -
      this.paddingBottom -
      (y - this.minY) * this.gridLinesPerTickY * this.yAxisSpacing;
    return { x: localX, y: localY };
  }

  //////////GRAPH TARGET SHAPE
  setupGraphTarget() {
    this.graphTargetGraphics = this.scene.add.graphics();
    this.add(this.graphTargetGraphics);
  }

  drawGraphTargetWithPointsAndWidth(points, width) {
    const targetWidth = 2 * width * this.gridLinesPerTickY * this.yAxisSpacing;

    const polygonPoints = [];

    const firstPoint = this.convertDataPointToLocalSpaceCoords(points[0]);
    const secondPoint = this.convertDataPointToLocalSpaceCoords(points[1]);

    firstPoint.x -= 2; //to fix t=0 graph target bug

    const firstAngle = Phaser.Math.Angle.Between(
      firstPoint.x,
      firstPoint.y,
      secondPoint.x,
      secondPoint.y
    );

    polygonPoints.push(firstPoint.x);
    polygonPoints.push(
      firstPoint.y - (0.5 * targetWidth) / Math.cos(firstAngle)
    );

    const firstSlope =
      (secondPoint.y - firstPoint.y) / (secondPoint.x - firstPoint.x);

    //WORKING FORWARD AFTER FIRST POINT, BEFORE LAST POINT

    let prevPointOffsetLine = {
      x: firstPoint.x,
      y: firstPoint.y - (0.5 * targetWidth) / Math.cos(firstAngle),
    };
    let curPointOffsetLine, curAngle;

    let prevSlope = firstSlope;
    let curSlope;

    for (var i = 1; i < points.length - 1; i++) {
      const curPointOnLine = this.convertDataPointToLocalSpaceCoords(points[i]);
      const nextPointOnLine = this.convertDataPointToLocalSpaceCoords(
        points[i + 1]
      );

      curAngle = Phaser.Math.Angle.Between(
        curPointOnLine.x,
        curPointOnLine.y,
        nextPointOnLine.x,
        nextPointOnLine.y
      );

      curPointOffsetLine = {
        x: curPointOnLine.x,
        y: curPointOnLine.y - (0.5 * targetWidth) / Math.cos(curAngle),
      };

      curSlope =
        (nextPointOnLine.y - curPointOnLine.y) /
        (nextPointOnLine.x - curPointOnLine.x);

      const newX =
        (curPointOffsetLine.y -
          prevPointOffsetLine.y +
          (prevSlope * prevPointOffsetLine.x -
            curSlope * curPointOffsetLine.x)) /
        (prevSlope - curSlope);

      const newY =
        prevSlope * (newX - prevPointOffsetLine.x) + prevPointOffsetLine.y;

      polygonPoints.push(newX);
      polygonPoints.push(newY);

      prevPointOffsetLine = curPointOffsetLine;
      prevSlope = curSlope;
    }

    ///// LAST POINT

    let lastPoint = this.convertDataPointToLocalSpaceCoords(
      points[points.length - 1]
    );

    let nextToLastPoint = this.convertDataPointToLocalSpaceCoords(
      points[points.length - 2]
    );

    lastPoint.x += 2; //to fix t=0 graph target bug
    nextToLastPoint.x += 2; //to fix t=0 graph target bug

    const lastAngle = Phaser.Math.Angle.Between(
      nextToLastPoint.x,
      nextToLastPoint.y,
      lastPoint.x,
      lastPoint.y
    );

    polygonPoints.push(lastPoint.x);
    polygonPoints.push(lastPoint.y - (0.5 * targetWidth) / Math.cos(lastAngle));

    polygonPoints.push(lastPoint.x);
    polygonPoints.push(lastPoint.y + (0.5 * targetWidth) / Math.cos(lastAngle));

    const lastSlope =
      (lastPoint.y - nextToLastPoint.y) / (lastPoint.x - nextToLastPoint.x);

    ////WORKING BACKWARDS

    prevPointOffsetLine = {
      x: lastPoint.x,
      y: lastPoint.y + (0.5 * targetWidth) / Math.cos(lastAngle),
    };

    prevSlope = lastSlope;

    for (var i = points.length - 2; i > 0; i--) {
      const curPointOnLine = this.convertDataPointToLocalSpaceCoords(points[i]);
      const nextPointOnLine = this.convertDataPointToLocalSpaceCoords(
        points[i - 1]
      );

      curAngle = Phaser.Math.Angle.Between(
        curPointOnLine.x,
        curPointOnLine.y,
        nextPointOnLine.x,
        nextPointOnLine.y
      );

      curPointOffsetLine = {
        x: curPointOnLine.x,
        y: curPointOnLine.y - (0.5 * targetWidth) / Math.cos(curAngle),
      };

      curSlope =
        (nextPointOnLine.y - curPointOnLine.y) /
        (nextPointOnLine.x - curPointOnLine.x);

      const newX =
        (curPointOffsetLine.y -
          prevPointOffsetLine.y +
          (prevSlope * prevPointOffsetLine.x -
            curSlope * curPointOffsetLine.x)) /
        (prevSlope - curSlope);

      const newY =
        prevSlope * (newX - prevPointOffsetLine.x) + prevPointOffsetLine.y;

      polygonPoints.push(newX);
      polygonPoints.push(newY);

      prevPointOffsetLine = curPointOffsetLine;
      prevSlope = curSlope;
    }

    //CLOSING PATH

    polygonPoints.push(firstPoint.x);
    polygonPoints.push(
      firstPoint.y + (0.5 * targetWidth) / Math.cos(firstAngle)
    );

    this.polygon = new Phaser.Geom.Polygon(polygonPoints);

    this.graphTargetGraphics.clear();
    this.graphTargetGraphics.fillStyle(0x8ec099, 0.6);
    this.graphTargetGraphics.fillPoints(this.polygon.points, true);
  }

  drawGraphTargetWithPolygonPoints(points) {
    const polygonPoints = points.map((p, i) => {
      const retVal = this.convertDataPointToLocalSpaceCoords(p);
      if (p.x === 0) retVal.x -= 2;
      else if (p.x === this.maxX) {
        retVal.x += 2;
      }
      return retVal;
    });

    // polygonPoints[0].x -= 2; //to fix t=0 graph target bug
    // polygonPoints[polygonPoints.length - 1].x -= 2;

    this.polygon = new Phaser.Geom.Polygon(polygonPoints);

    this.graphTargetGraphics.clear();
    this.graphTargetGraphics.fillStyle(0x8ec099, 0.6);
    this.graphTargetGraphics.fillPoints(this.polygon.points, true);
  }

  ////FADE IN GRAPH TARGET
  fadeInGraphTargetIn(time) {
    if (time === 0) {
      this.graphTargetGraphics.alpha = 1;
      return;
    }

    this.scene.tweens.add({
      targets: this.graphTargetGraphics,
      alpha: 1,
      duration: time,
      ease: "Linear",
      paused: false,
    });
  }

  clearGraphTargetIn(time) {
    this.polygon = null;

    if (time === 0) {
      this.graphTargetGraphics.alpha = 0;
      return;
    }

    this.scene.tweens.add({
      targets: this.graphTargetGraphics,
      alpha: 0,
      duration: time,
      ease: "Linear",
      paused: false,
    });
  }

  /////GRAPH VECTOR
  setupGraphVector() {
    this.vectorBaseScale = 0.5;
    this.vectorBody = this.scene.add
      .sprite(
        this.paddingLeft,
        this.height -
          this.paddingBottom -
          (this.yAxisSpacing *
            this.gridLinesPerTickY *
            (this.maxY - this.minY)) /
            2,
        "velocity-vector-body"
      )
      .setOrigin(0, 0.5)
      .setRotation(-Math.PI / 2)
      .setScale(this.vectorBaseScale);
    this.add(this.vectorBody);
    this.vectorBody.x -= 0.8 * this.vectorBody.height;
    this.vectorHead = this.scene.add
      .sprite(this.vectorBody.x, 0, "velocity-vector-head")
      .setOrigin(1, 0.5)
      .setRotation(-Math.PI / 2)
      .setScale(this.vectorBaseScale);
    this.add(this.vectorHead);
  }

  updateGraphVector(y) {
    const newY = Math.min(8.8, Math.max(-8.4, y));
    const minSpeedToShow = 0.4;
    const minSpeedToStretch = 2.2;
    const minScale = 0.2;
    const speed = Math.abs(newY);
    if (speed < minSpeedToShow) {
      this.vectorBody.setVisible(false);
      this.vectorHead.setVisible(false);
      return;
    } else if (!this.vectorBody.visible) {
      this.vectorBody.setVisible(true);
      this.vectorHead.setVisible(true);
    }
    const dy = newY * this.gridLinesPerTickY * this.yAxisSpacing;
    this.vectorHead.y =
      this.height -
      this.paddingBottom -
      dy -
      0.5 *
        this.yAxisSpacing *
        this.gridLinesPerTickY *
        (this.maxY - this.minY);
    if (speed < minSpeedToStretch) {
      this.vectorHead.scale =
        minScale +
        ((this.vectorBaseScale - minScale) * (speed - minSpeedToShow)) /
          (minSpeedToStretch - minSpeedToShow);
    } else {
      this.vectorHead.scale = this.vectorBaseScale;
    }
    this.vectorBody.scaleY = this.vectorHead.scaleY;
    this.vectorBody.displayWidth =
      Math.abs(dy) - 0.5 * this.vectorHead.width * this.vectorHead.scaleY;
    if (newY < 0) {
      this.vectorHead.scaleX = -1 * Math.abs(this.vectorHead.scaleX);
      this.vectorBody.scaleX = -1 * Math.abs(this.vectorBody.scaleX);
    }
  }
}
