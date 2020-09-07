class SliderBar extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene);
    this.scene = config.scene;
    this.scene.add.existing(this);

    this.emitter = config.emitter;

    this.width = config.width;
    this.height = config.height;

    this.color = config.color;
    this.textColor = config.textColor;

    this.text = config.text;
    this.unit = config.unit;
    this.min = config.min;
    this.max = config.max;
    this.increment = config.increment;
    this.initialVal = config.initialVal;
    this.value = this.initialVal;

    this.createGraphics();
    this.createText();

    if (config.event) {
      this.event = config.event;
    }

    this.handle.on("pointerdown", this.down, this);
    this.handle.on("pointerup", this.up, this);

    if (model.isMobile == -1) {
      this.handle.on("pointerover", this.over, this);
      this.handle.on("pointerout", this.out, this);
    }

    this.handle
      .on("dragstart", function (pointer, dragX, dragY) {
        // ...
      })
      .on("drag", function (pointer, dragX, dragY) {
        this.x = Math.min(
          Math.max(dragX, -0.5 * config.width),
          0.5 * config.width
        );
        this.parentContainer.updateSliderValWithPos(this.x);
      })
      .on("dragend", function (pointer, dragX, dragY, dropped) {
        this.parentContainer.snapSliderHandle();
      });

    // emitter.on(G.LEVEL_BEATEN, this.levelBeaten);
  }

  createGraphics() {
    const lineWidth = 0.25 * this.height;

    this.line = this.scene.add.graphics();
    this.line.fillStyle(this.color);
    const pointL = new Phaser.Geom.Circle(-0.5 * this.width, 0, lineWidth / 2);
    const pointR = new Phaser.Geom.Circle(0.5 * this.width, 0, lineWidth / 2);
    this.line.fillCircleShape(pointL);
    this.line.fillCircleShape(pointR);
    this.line.lineStyle(lineWidth + 1, this.color);
    this.line.moveTo(-0.5 * this.width, 0);
    this.line.lineTo(0.5 * this.width, 0);
    this.line.strokePath();
    this.add(this.line);

    this.handle = this.scene.add.graphics();
    this.handle.fillStyle(this.color);
    const circle = new Phaser.Geom.Circle(0, 0, 0.5 * this.height);
    this.handle.fillCircleShape(circle);
    this.add(this.handle);

    this.handle.x =
      this.width * ((this.initialVal - this.min) / (this.max - this.min) - 0.5);

    this.handle.setInteractive({
      hitArea: circle,
      hitAreaCallback: Phaser.Geom.Circle.Contains,
      draggable: true,
      dropZone: false,
      useHandCursor: true,
    });
  }

  createText() {
    this.textLabel = this.scene.add
      .text(
        0,
        -0.8 * this.height,
        `${this.text}: ${this.initialVal}${this.unit}`,
        {
          fontFamily: "sans-serif",
          fontSize: 40,
          color: this.textColor,
        }
      )
      .setOrigin(0.5, 1)
      .setResolution(2);

    this.add(this.textLabel);
  }

  updateSliderValWithPos(posX) {
    let val =
      this.min +
      (this.max - this.min) * ((posX - -0.5 * this.width) / this.width);

    val = Math.round(val * (1 / this.increment)) / (1 / this.increment);
    val = val.toFixed(1);

    this.value = val;

    this.updateTextWithVal(val);
  }

  updateTextWithVal(val) {
    this.textLabel.text = `${this.text}: ${val}${this.unit}`;
  }

  snapSliderHandle() {
    emitter.emit(G.PLAY_SOUND, "button-up", 0.2);
    this.handle.x =
      this.width * ((this.value - this.min) / (this.max - this.min) - 0.5);
    if (this.event) {
      emitter.emit(this.event, this.value);
    }
  }

  //////////EVENT LISTENERS//////////
  over() {
    this.handle.scale = 1.04;
  }

  out() {
    this.handle.scale = 1;
  }

  down() {
    emitter.emit(G.PLAY_SOUND, "button-down", 0.2);
    this.handle.scale = 0.95;
  }

  up() {
    this.handle.scale = 1;

    // emitter.emit(this.config.event, this.config.params);

    emitter.emit(G.PLAY_SOUND, "button-up", 0.2);
  }
}
