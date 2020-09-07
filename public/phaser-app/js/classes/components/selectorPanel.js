class SelectorPanel extends Phaser.GameObjects.Container {
  constructor(config) {
    if (!config.scene) {
      console.log("Selector panel missing scene");
      return;
    }
    if (!config.key) {
      console.log("Selector panel missing key");
      return;
    }

    super(config.scene);

    this.scene = config.scene;

    this.emitter = config.emitter;

    this.scene.input.setTopOnly(false);

    this.key = config.key;
    this.event = config.event;

    this.minVal = config.minVal;
    this.maxVal = config.maxVal;
    this.units = config.units;
    this.selectionOffsetX = config.selectionOffsetX;

    this.heading = config.heading;

    this.startingY = null;

    this.isActive = false;

    this.mouseOverPanel = false;
    this.mouseOverSelections = false;

    this.centerOnZero = config.centerOnZero;

    this.currentVal = this.centerOnZero ? 0 : -1;

    this.selectionBGOffsetX = config.selectionBGOffsetX;
    this.selectionBGWidth = config.selectionBGWidth;
    this.selectionBGHeight = config.centerOnZero
      ? 90 * (config.maxVal - config.minVal + 1) + 10
      : 90 * (config.maxVal - config.minVal + 1) + 10;

    this.selectionBGTween = null;
    this.selectionTweens = [];

    this.bgScalingIn = false;
    this.bgScalingOut = false;

    this.scene.add.existing(this);

    this.panel = this.scene.add.image(0, 0, this.key + "-panel");
    this.panel.setOrigin(0.5, 0.5);
    this.add(this.panel);

    if (this.key === "initial-velocity") {
      this.panel.alpha = 0.1;
    }

    const bgColor = this.key === "initial-velocity" ? 0x414646 : 0xfefaea;

    this.selectionBgGraphics = this.scene.make.graphics({
      fillStyle: { color: bgColor },
    });

    this.selectionBGStartingY = this.centerOnZero
      ? -0.5 * this.selectionBGHeight
      : -this.selectionBGHeight + 48;

    this.selectionBGy =
      this.selectionBGStartingY + 0.5 * this.selectionBGHeight;

    const borderRadius = 30;

    const rect1 = new Phaser.Geom.Rectangle(
      borderRadius,
      0,
      this.selectionBGWidth - 2 * borderRadius,
      this.selectionBGHeight
    );

    const rect2 = new Phaser.Geom.Rectangle(
      0,
      borderRadius,
      this.selectionBGWidth,
      this.selectionBGHeight - 2 * borderRadius
    );

    const cornerTopLeft = new Phaser.Geom.Circle(
      borderRadius,
      borderRadius,
      borderRadius
    );

    const cornerTopRight = new Phaser.Geom.Circle(
      this.selectionBGWidth - borderRadius,
      borderRadius,
      borderRadius
    );

    const cornerBottomLeft = new Phaser.Geom.Circle(
      borderRadius,
      this.selectionBGHeight - borderRadius,
      borderRadius
    );

    const cornerBottomRight = new Phaser.Geom.Circle(
      this.selectionBGWidth - borderRadius,
      this.selectionBGHeight - borderRadius,
      borderRadius
    );

    this.selectionBgGraphics.fillRectShape(rect1);
    this.selectionBgGraphics.fillRectShape(rect2);
    this.selectionBgGraphics.fillCircleShape(cornerTopLeft);
    this.selectionBgGraphics.fillCircleShape(cornerTopRight);
    this.selectionBgGraphics.fillCircleShape(cornerBottomLeft);
    this.selectionBgGraphics.fillCircleShape(cornerBottomRight);

    this.selectionBgGraphics.generateTexture(
      "selection-bg-" + this.heading,
      this.selectionBGWidth,
      this.selectionBGHeight
    );

    //  And destroy the original graphics object
    this.selectionBgGraphics.clear();
    this.selectionBgGraphics.destroy();

    this.selectionBG = this.scene.add
      .image(
        this.selectionBGOffsetX + 0.5 * this.selectionBGWidth,
        this.selectionBGStartingY + 0.5 * this.selectionBGHeight,
        "selection-bg-" + this.heading
      )
      .setAlpha(0)
      .setVisible(false);

    this.selectionBG.scaleY = 0;

    this.add(this.selectionBG);

    this.panelBorder = this.scene.add.image(0, 0, this.key + "-panel-border");

    const borderAlpha = this.key === "initial-velocity" ? 1 : 0.75;

    this.panelBorder.setOrigin(0.5, 0.5).setAlpha(borderAlpha);
    this.add(this.panelBorder);

    this.clickDownOnPanel = false;

    const headingColor =
      this.key === "initial-velocity" ? "#fcf3ca" : "#2c3234";

    this.panelText = this.scene.add
      .text(-0.5 * this.panel.width + 18, 0, this.heading, {
        fontFamily: "Montserrat",
        fontSize: 60,
        color: headingColor,
      })
      .setResolution(1.1);

    this.panelText.setOrigin(0, 0.5);
    this.add(this.panelText);

    // this.panel.on("pointerdown", this.down, this);
    // this.panel.on("pointerup", this.pressed, this);

    if (model.isMobile == -1) {
      this.panel.on(
        "pointerover",
        function (pointer, localX, localY, event) {
          if (!pointer.isDown) {
            this.panelOver();
          }
        },
        this
      );
      this.panel.on("pointerout", this.panelOut, this);

      this.selectionBG.on("pointerover", this.selectionsOver, this);
      this.selectionBG.on("pointerout", this.selectionsOut, this);
    } else {
      /// mobile
      this.panel.on("pointerdown", this.panelDownMobile, this);
      // this.panel.on("pointerover", this.panelOverMobile, this);
      // this.panel.on("pointerout", this.panelOutMobile, this);
    }

    this.panel
      .setInteractive({ draggable: true, useHandCursor: true })
      .on("dragstart", function (pointer, dragX, dragY) {
        pointer.event.preventDefault();
        this.parentContainer.setStartingY();
        this.parentContainer.setStartDragging();
        this.parentContainer.highlightSelection(
          this.parentContainer.valueForY(this.parentContainer.selectionBG.y)
        );
      })
      .on("drag", function (pointer, dragX, dragY) {
        let newBGY;
        if (this.parentContainer.centerOnZero) {
          newBGY = Math.min(
            0.5 * this.parentContainer.selectionBGHeight - 48,
            Math.max(
              1.8 * dragY + this.parentContainer.getStartingY(),
              -0.5 * this.parentContainer.selectionBGHeight + 48
            )
          );
        } else {
          newBGY = Math.min(
            0.5 * this.parentContainer.selectionBGHeight - 48,
            Math.max(
              1.8 * dragY + this.parentContainer.getStartingY(),
              -0.5 * this.parentContainer.selectionBGHeight + 48
            )
          );
        }

        this.parentContainer.selectionBG.y = newBGY;
        this.parentContainer.selectionBGy = newBGY;

        this.parentContainer.selections.forEach((selection, index) => {
          if (this.parentContainer.centerOnZero) {
            selection.y = newBGY + 90 * (this.parentContainer.maxVal - index);
          } else {
            selection.y =
              newBGY +
              90 *
                (this.parentContainer.maxVal -
                  this.parentContainer.minVal -
                  2 -
                  index);
          }
        });

        this.parentContainer.setCurrentVal(
          this.parentContainer.valueForY(this.parentContainer.selectionBG.y)
        );
      })
      .on("dragend", function (pointer, dragX, dragY, dropped) {
        this.parentContainer.release();
        this.parentContainer.highlightSelection(
          this.parentContainer.valueForY(this.parentContainer.selectionBG.y)
        );
        //on mobile
        if (model.isMobile !== -1) {
          this.parentContainer.close();
        }
      });

    /////////REPEEEAAAATTTTTT KILL ME

    this.selectionBG.setInteractive({ useHandCursor: true });

    this.createSelections();

    this.isOpen = false;
  }

  setCurrentVal(val) {
    if (val != this.currentVal) {
      this.highlightSelection(val);

      this.emitter.emit(G.RESET_PRESSED);

      this.emitter.emit(this.event, val);

      this.currentVal = val;
    }
  }

  highlightSelection(val) {
    if (this.selectionTweens.length > 0) {
      this.selectionTweens.forEach((tween) => {
        if (tween) tween.stop();
        tween = null;
      });
      this.selectionTweens = [];
    }

    if (this.centerOnZero) {
      this.selections.forEach((selection, index) => {
        if (val === index - this.maxVal) {
          selection.alpha = 1;
        } else {
          selection.alpha = 0.3;
        }
      });
    } else {
      this.selections.forEach((selection, index) => {
        if (val === index - 1) {
          selection.alpha = 1;
        } else {
          selection.alpha = 0.3;
        }
      });
    }
  }

  setStartDragging() {
    this.open();
  }

  reset() {
    if (this.centerOnZero) {
      this.setCurrentVal(0);
      this.snapToValue(0);
    } else {
      this.setCurrentVal(-1);
      this.snapToValue(-1);
    }

    this.selectionBG.visible = false;

    this.selections.forEach((selection, index) => {
      if (this.centerOnZero) {
        if (this.currentVal !== index - this.maxVal) {
          selection.visible = false;
        } else selection.visible = true;
      } else {
        if (this.currentVal !== index - 1) {
          selection.visible = false;
        } else selection.visible = true;
      }
    });

    this.close();
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.startBGScaleIn();

    if (model.isMobile !== -1) {
      this.parentContainer.bringToTop(this);
    }
  }

  release() {
    const offsetY = this.selectionBG.y;

    let releaseVal = this.valueForY(offsetY);

    this.snapToValue(releaseVal);
  }

  valueForY(y) {
    if (this.centerOnZero) {
      return Math.round(y / 90);
    } else {
      return Math.round((y + 90) / 90);
    }
  }

  snapToValue(value) {
    let targetY;
    if (this.centerOnZero) {
      targetY = 90 * value;
      this.selectionBG.y = targetY;
      this.selectionBGy = this.selectionBG.y;
      this.selections.forEach((selection, index) => {
        selection.y = targetY + 90 * (this.maxVal - index);
      });
    } else {
      targetY = 90 * value;
      this.selectionBG.y = targetY - 90;
      this.selectionBGy = this.selectionBG.y;
      this.selections.forEach((selection, index) => {
        selection.y = targetY + 90 * (1 - index);
      });
    }
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.startBGScaleOut();
  }

  setStartingY() {
    this.startingY = this.selectionBG.y;
  }

  getStartingY() {
    return this.startingY;
  }

  createSelections() {
    this.selections = [];

    for (var i = this.minVal; i <= this.maxVal; i++) {
      let offsetIndex = i - this.minVal;
      // this.blankOption ? i - this.minVal + 1 :
      if (this.centerOnZero) {
        offsetIndex -= this.maxVal;
        offsetIndex *= -1;
      } else offsetIndex *= -1;
      this.selections.push(
        this.createSelection(i, offsetIndex, this.selections.length)
      );
    }
  }

  createSelection(num, offsetIndex, index) {
    const string =
      num === -1 && !this.centerOnZero ? "_ s" : `${num} ${this.units}`;

    const textColor = this.key === "initial-velocity" ? "#fcf3ca" : "#2c3234";

    var selectionText = this.scene.add
      .text(0, 90 * offsetIndex, string, {
        fontFamily: "Montserrat",
        fontSize: 60,
        color: textColor,
      })
      .setResolution(1.1);

    if (this.centerOnZero) {
      if (this.currentVal === index - this.maxVal) {
        selectionText.alpha = 1;
        selectionText.visible = true;
      } else {
        selectionText.alpha = 0;
        selectionText.visible = false;
      }
    } else {
      if (this.currentVal === index - 1) {
        selectionText.alpha = 1;
        selectionText.visible = true;
      } else {
        selectionText.alpha = 0;
        selectionText.visible = false;
      }
    }

    selectionText.x = 0.5 * this.panel.width - this.selectionOffsetX;

    selectionText.setOrigin(0.5, 0.5);
    this.minVal;
    this.add(selectionText);

    selectionText.setInteractive({ useHandCursor: true });

    selectionText.on(
      "pointerdown",
      () => {
        this.selectionDown(index);
      },
      this
    );

    if (model.isMobile == -1) {
      selectionText.on(
        "pointerover",
        () => {
          this.selectionOver(index);
        },
        this
      );
      selectionText.on(
        "pointerout",
        () => {
          this.selectionOut(index);
        },
        this
      );
    }

    return selectionText;
  }

  selectionOver(index) {
    // if (this.bgScalingIn || this.bgScalingOut) return;
    this.selections[index].alpha = 1;
  }

  selectionOut(index) {
    // if (this.bgScalingIn || this.bgScalingOut) return;
    if (this.centerOnZero) {
      if (this.currentVal === index - this.maxVal) {
        return;
      }
    } else {
      if (this.currentVal === index - 1) {
        return;
      }
    }

    this.selections[index].alpha = 0.2;
  }

  selectionDown(index) {
    if (this.centerOnZero) {
      if (this.currentVal === index - this.maxVal) {
        return;
      } else {
        this.setCurrentVal(index - this.maxVal);
        this.snapToValue(index - this.maxVal);
      }
    } else {
      if (this.currentVal === index - 1) {
        return;
      } else {
        this.setCurrentVal(index - 1);
        this.snapToValue(index - 1);
      }
    }

    this.selectionBG.visible = false;

    this.selections.forEach((selection, index) => {
      if (this.centerOnZero) {
        if (this.currentVal !== index - this.maxVal) {
          selection.visible = false;
        }
      } else {
        if (this.currentVal !== index - 1) {
          selection.visible = false;
        }
      }
    });

    this.close();
  }

  setOrigin(x, y) {
    this.panel.x = (0.5 - x) * this.panel.width;
    this.panel.y = (0.5 - y) * this.panel.height;
  }

  setDisplayWidth(width) {
    this.scale = width / this.panel.width;
  }

  setDisplayHeight(height) {
    this.scale = height / this.panel.height;
  }

  setBtnTexture(texture) {
    // this.back.setTexture(texture);
  }

  getWidth() {
    // return this.back.width * this.scaleX;
  }

  getHeight() {
    // return this.back.height * this.scaleY;
  }

  panelOver() {
    this.mouseOverPanel = true;
    this.open();
    // this.back.scale = 1.04 * this.defaultScale;
    // this.back.setAlpha(1);
  }

  panelOut() {
    this.mouseOverPanel = false;

    if (!this.mouseOverSelections) {
      this.close();
    }
  }

  panelOverMobile() {
    this.mouseOverPanel = true;
  }

  panelOutMobile() {
    // this.mouseOverPanel = false;
  }

  selectionsOver(e) {
    this.mouseOverSelections = true;
    this.open();
    // this.back.scale = 1.04 * this.defaultScale;
    // this.back.setAlpha(1);
  }

  selectionsOut() {
    this.mouseOverSelections = false;

    if (!this.mouseOverPanel) {
      this.close();
    }
  }

  down() {
    // emitter.emit(G.PLAY_SOUND, "button-down", 0.2);
    // this.back.scale = this.defaultScale / 1.04;
    // this.clickDownOnButton = true;
  }

  panelDownMobile() {
    // if (this.isOpen) {
    //   this.close();
    // } else this.open();
  }

  pressed() {
    // if (!this.clickDownOnButton) return;
    // this.clickDownOnButton = false;
    // this.back.scale = 1.04 * this.defaultScale;
    // if (this.config.params) {
    //   emitter.emit(this.config.event, this.config.params);
    // } else {
    //   emitter.emit(this.config.event);
    // }
    // emitter.emit(G.PLAY_SOUND, "button-up", 0.2);
    // if (this.toggle) {
    //   if (this.toggleState) {
    //     this.back.setTexture(this.key + "-off");
    //   } else {
    //     this.back.setTexture(this.key + "-on");
    //   }
    // }
    // this.toggleState = !this.toggleState;
  }

  startBGScaleIn() {
    // console.log(this.selectionBG.y - this.selectionBGStartingY);

    this.bgScalingIn = true;

    if (this.selectionBGTween) {
      this.selectionBGTween.stop();

      this.selectionTweens.forEach((tween) => {
        if (tween) tween.stop();
        tween = null;
      });
      this.selectionTweens = [];
    }
    this.selectionBG.setVisible(true);

    this.selectionBGTween = this.scene.tweens.add({
      targets: this.selectionBG,
      paused: false,
      duration: 400,
      ease: "Expo.Out",
      onComplete: this.bgScaledIn.bind(this),
      scaleY: 1,
      alpha: 1,
    });

    this.selections.forEach((selection, index) => {
      selection.visible = true;

      let targetAlpha = 0.45;
      if (this.centerOnZero) {
        if (this.currentVal === index - this.maxVal) {
          targetAlpha = 1;
        }
      } else {
        if (this.currentVal === index - 1) {
          targetAlpha = 1;
        }
      }

      this.selectionTweens.push(
        this.scene.tweens.add({
          targets: selection,
          paused: false,
          duration: 240,
          ease: "Linear",
          alpha: targetAlpha,
        })
      );
    });
  }

  bgScaledIn() {
    this.bgScalingIn = false;

    this.selectionBGTween = null;
    this.selectionTweens.forEach((tween) => {
      if (tween) tween.stop();
      tween = null;
    });
    this.selectionTweens = [];
  }

  startBGScaleOut() {
    this.bgScalingOut = true;

    if (this.selectionBGTween) {
      this.selectionBGTween.stop();

      this.selectionTweens.forEach((tween) => {
        if (tween) tween.stop();
        tween = null;
      });
      this.selectionTweens = [];
    }

    this.selectionBGTween = this.scene.tweens.add({
      targets: this.selectionBG,
      paused: false,
      duration: 400,
      ease: "Expo.Out",
      onComplete: this.bgScaledOut.bind(this),
      scaleY: 0,
      alpha: 0.2,
    });

    this.selections.forEach((selection, index) => {
      let fadeOut;
      if (this.centerOnZero) {
        if (this.currentVal !== index - this.maxVal) {
          fadeOut = true;
        }
      } else {
        if (this.currentVal !== index - 1) {
          fadeOut = true;
        }
      }

      if (fadeOut) {
        this.selectionTweens.push(
          this.scene.tweens.add({
            targets: selection,
            paused: false,
            duration: 150,
            ease: "Linear",
            alpha: 0,
          })
        );
      }
    });
  }

  bgScaledOut() {
    this.bgScalingOut = false;

    this.selectionBGTween = null;
    this.selectionBG.setVisible(false);

    this.selectionTweens.forEach((tween) => {
      if (tween) tween.stop();
      tween = null;
    });
    this.selectionTweens = [];
  }
}
