class MediaManager {
  constructor(config) {
    this.scene = config.scene;
    emitter.on(G.PLAY_SOUND, this.playSound, this);
    emitter.on(G.MUSIC_CHANGED, this.musicChanged, this);
    emitter.on(G.SOUND_CHANGED, this.soundChanged, this);
    emitter.on(G.START_GRAPH_ZAP, this.startGraphZap, this);
    emitter.on(G.STOP_GRAPH_ZAP, this.stopGraphZap, this);
  }

  playSound(key, volume) {
    var sound = this.scene.sound.add(key, { volume: volume });
    sound.play();
  }

  setBackgroundMusic(key) {
    if (model.musicOn) {
      game.background = this.scene.sound.add(key, { volume: 0.5, loop: true });
      game.background.play();
    }
  }

  musicChanged() {
    if (game.background) {
      if (model.musicOn) {
        game.background.play();
      } else {
        game.background.stop();
      }
    }
  }

  soundChanged(playSound) {}

  startGraphZap() {
    if (!this.graphZap) {
      this.graphZap = this.scene.sound.add("graph-zap", { volume: 0.05 });
    }
    this.graphZap.play();
  }

  stopGraphZap() {
    if (this.graphZap) {
      this.graphZap.stop();
    }
  }
}
