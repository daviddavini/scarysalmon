var MovePhase = {
  STILL: 0,
  SPEED_UP: 1,
  SLOW_DOWN: 2
}

class Fish {
  constructor(pos, dir, dragAcc, spdUpAcc, spdDownAcc, spdPeak, color, radius) {
    this.pos = pos;
    this.dragAcc = dragAcc;
    this.spdUpAcc = spdUpAcc;
    this.spdDownAcc = spdDownAcc;
    this.spdPeak = spdPeak;
    this.spd = 0;
    this.dir = dir;
    this.radius = radius;
    this.movePhase = MovePhase.STILL;
    this.color = color;
  }
  mid() {
    return createVector(this.pos.x+this.radius, this.pos.y+this.radius);
  }
  update() {
    this.doMovement();
  }
  doMovement() {
    if(this.movePhase === MovePhase.STILL){
      this.spd += this.dragAcc;
      if(this.spd < 0){
        this.spd = 0;
      }
      if(this.startMove()){
        this.updateDir();
        this.movePhase = MovePhase.SPEED_UP;
      }
    }
    else if(this.movePhase === MovePhase.SPEED_UP){
      this.spd += this.spdUpAcc;
      if(this.spdPeak <= this.spd){
        this.movePhase = MovePhase.SLOW_DOWN;
      }
    }
    else if(this.movePhase === MovePhase.SLOW_DOWN){
      this.spd += this.spdDownAcc;
      if(this.spd <= 2){
        this.movePhase = MovePhase.STILL;
      }
    }
    this.pos.add(createVector(this.spd*Math.cos(this.dir),this.spd*Math.sin(this.dir)));
  }
  startMove() {
    return Math.random() < 0.1;
  }
  updateDir() {}
  show() {
    fill(this.color);
    ellipse(this.mid().x, this.mid().y, this.radius, this.radius);
  }
}

class Player extends Fish {
  constructor(pos) {
    super(pos, 0, -0.03, 2, -0.35, 5, color(255, 255, 255, 170), 38)
    this.touchedMouse = true;
    this.health = 1;
  }
  updateDir() {
    this.dir = Math.atan2(mouseY - this.mid().y, mouseX - this.mid().x);
  }
  startMove() {
    if(isCollidingPP(this.mid().x, this.mid().y, mouseX, mouseY,this.radius+20)) { //r = radius assuming circle
      this.touchedMouse = true;
    }
    return !this.touchedMouse && Math.random() < 0.5;
  }
}

class Salmon extends Fish {
  constructor(pos, dir, radius, moveChance, dragAcc, spdUpAcc, spdDownAcc, spdPeak) {
    super(pos, dir, dragAcc, spdUpAcc, spdDownAcc, spdPeak, color(255, 100, 100, 170), radius);
    this.dirRange = 0.5;
    this.moveChance = moveChance;
    this.moveChanceStep = 0.1;
  }
  updateDir() {
    if (isCollidingPP(this.mid().x, this.mid().y, player.mid().x, player.mid().y, 200)) {
      var playerDir = Math.atan2(player.mid().y - this.mid().y, player.mid().x - this.mid().x);
      this.dir = playerDir + (2*Math.random()-1);
    } else {
      this.dir += this.dirRange*(2*Math.random()-1);
    }
  }
  startMove() {
    var doSo = Math.random() <= this.moveChance;
    if (doSo && (1-this.moveChance-this.moveChanceStep)>0.1){
      this.moveChance += this.moveChanceStep;
      return true;
    } else if(!doSo && (this.moveChance-this.moveChanceStep)>0.05) {
      this.moveChance -= this.moveChanceStep;
      return false;
    }
  }
}

class Tuna extends Fish {
  constructor(pos, dir, radius, moveChance, dragAcc, spdUpAcc, spdDownAcc, spdPeak) {
    super(pos, dir, dragAcc, spdUpAcc, spdDownAcc, spdPeak, color(140, 255, 170), radius);
    this.storedSpdPeak = this.spdPeak;
  }
  updateDir() {
    if (player.spd>0.1 && isCollidingPP(this.mid().x, this.mid().y, player.mid().x, player.mid().y, 100)) {
      var playerDir = Math.atan2(player.mid().y - this.mid().y, player.mid().x - this.mid().x);
      this.dir = playerDir + Math.PI + (2*Math.random()-1);
      this.spdPeak = 2.5;
    } else {
      this.dir += 1.4*(2*Math.random()-1);
      this.spdPeak = this.storedSpdPeak;
    }
  }
}
