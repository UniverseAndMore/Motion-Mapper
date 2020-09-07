class Controller {
  constructor() {
    emitter.on(G.SET_GAME_DATA, this.setGameData);
    emitter.on(G.LEVEL_BEATEN, this.levelBeaten);
  }
  setGameData(gameData) {
    model.gameData = gameData;
  }
  levelBeaten(level) {
    // var score = model.score;
    // score += points;
    // model.score = score;
  }
}
