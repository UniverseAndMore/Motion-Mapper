class Model {
  constructor() {
    this._progressData = this.loadLocalData() || {
      totalTime: 0,
      userName: "",
      modes: {
        control: {
          worldData: [
            {
              worldNum: 1,
              levelsBeaten: [],
            },
            {
              worldNum: 2,
              levelsBeaten: [],
            },
            {
              worldNum: 3,
              levelsBeaten: [],
            },
            {
              worldNum: 4,
              levelsBeaten: [],
            },
          ],
        },
        input: {
          worldData: [
            {
              worldNum: 1,
              levelsBeaten: [],
            },
            {
              worldNum: 2,
              levelsBeaten: [],
            },
            {
              worldNum: 3,
              levelsBeaten: [],
            },
            {
              worldNum: 4,
              levelsBeaten: [],
            },
          ],
        },
      },
    };

    this._numLevelsInActiveWorld = -1;
    this._initialLoadComplete = false;
    this._mode = "control";
    this._soundOn = true;
    this._musicOn = true;
    this._totalTime = this._progressData.totalTime;
    this._userName = this._progressData.userName;
  }

  loadLocalData() {
    return JSON.parse(localStorage.getItem("progressData"));
  }

  saveLocalData() {
    localStorage.setItem("progressData", JSON.stringify(this._progressData));
  }

  levelBeaten(levelNum) {
    const alreadyBeaten = this.wasLevelAlreadyBeaten(levelNum);
    if (alreadyBeaten) return;
    this._progressData.modes[this._mode].worldData[
      this.activeWorld - 1
    ].levelsBeaten.push(levelNum);
    this.saveLocalData();
  }

  numLevelsBeatenForWorld(worldNum) {
    return this._progressData.modes[this._mode].worldData[worldNum - 1]
      .levelsBeaten.length;
  }

  levelsBeatenForWorld(worldNum) {
    return this._progressData.modes[this._mode].worldData[worldNum - 1]
      .levelsBeaten;
  }

  numLevelsBeatenForControlWorld(worldNum) {
    return this._progressData.modes["control"].worldData[worldNum - 1]
      .levelsBeaten.length;
  }

  numLevelsBeatenForInputWorld(worldNum) {
    return this._progressData.modes["input"].worldData[worldNum - 1]
      .levelsBeaten.length;
  }

  addToTotalTimeSpentGraphing(additional) {
    this._totalTime += additional;
    this._progressData.totalTime = this._totalTime;
    this.saveLocalData();
  }

  totalTimeSpentGraphing() {
    return this._totalTime ? this._totalTime : 0;
  }

  setUserName(name) {
    this._userName = name;
    this._progressData.userName = this._userName;
    this.saveLocalData();
  }

  getUserName() {
    return this._userName;
  }

  wasLevelAlreadyBeaten(levelNum) {
    let levelsBeaten;
    let alreadyBeaten = false;

    levelsBeaten = this._progressData.modes[this._mode].worldData[
      this.activeWorld - 1
    ].levelsBeaten;

    levelsBeaten.forEach((levNum) => {
      if (levelNum == levNum) {
        alreadyBeaten = true;
        return true;
      }
    });
    return alreadyBeaten;
  }

  set mode(modeChoice) {
    this._mode = modeChoice;
  }

  get mode() {
    return this._mode;
  }

  set soundOn(val) {
    this._soundOn = val;
    emitter.emit(G.SOUND_CHANGED, val);
  }

  get soundOn() {
    return this._soundOn;
  }

  set initialLoadComplete(val) {
    this._initialLoadComplete = val;
  }

  get initialLoadComplete() {
    return this._initialLoadComplete;
  }

  set activeWorld(worldNum) {
    this._activeWorld = worldNum;
    if (worldNum === -1) return; //menu
    this._activeLevel = this.lowestUnfinishedLevel();

    console.log(this.lowestUnfinishedLevel());
  }

  set numLevelsInActiveWorld(num) {
    this._numLevelsInActiveWorld = num;
  }

  get numLevelsInActiveWorld() {
    return this._numLevelsInActiveWorld;
  }

  lowestUnfinishedLevel() {
    const levelsBeaten = this._progressData.modes[this._mode].worldData[
      this._activeWorld - 1
    ].levelsBeaten;

    for (var i = 1; i <= this._numLevelsInActiveWorld; i++) {
      if (!levelsBeaten.includes(i)) {
        return i;
      }
    }

    return 1;
  }

  get activeWorld() {
    return this._activeWorld;
  }

  set activeLevel(levelNum) {
    this._activeLevel = levelNum;
  }

  get activeLevel() {
    return this._activeLevel;
  }

  set timeFactor(timeFactor) {
    this._timeFactor = timeFactor;
  }

  get timeFactor() {
    return this._timeFactor;
  }
}
