class TutorialManager {
  constructor(config) {
    this.scene = config.scene;
    emitter.on(G.START_TUTORIAL, this.startTutorial, this);
    emitter.on(G.TUTORIAL_COMPLETE, this.tutorialComplete, this);
  }

  startTutorial(index) {}

  tutorialComplete(index) {}
}
