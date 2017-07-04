/*
var fishImg;
function preload(){
  fishImg = loadImage('img/fish.png');
}
//image(fishImg, width/2, height/2);
*/

var cnv;
var bgColor;

var Scene = {
  START: 'start',
  GAME: 'game',
  END: 'end'
}
var scene;
var lastHit;

var score;
var highScore;
var player;
var salmons;
var tunas;
var goldfishies;

var tunaSound;
var salmonSound;
var goldSound;
var endSound;

class DeadMusic {
  constructor() {
  }
  play() {
    return null;
  }
}
function preload() {
  try {
    tunaSound = loadSound('assets/pop.mp3');
    salmonSound = loadSound('assets/snap.mp3');
    goldSound = loadSound('assets/ting.mp3');
    endSound = loadSound('assets/horn.mp3');
  } catch (err) {
    tunaSound = new DeadMusic();
    salmonSound = new DeadMusic();
    goldSound = new DeadMusic();
    endSound = new DeadMusic();
  }
}

function setup(){
  cnv = createCanvas(window.innerWidth,window.innerHeight); //1100,800
  highScore = int(localStorage.getItem("highscore"));

  gameStart();

  scene = Scene.START;
  bgColor = color(200,240,100);
  background(bgColor)

  textSize(30);
  textAlign(CENTER);
}
function gameStart() {
  score = 0;
  lastHit = -1000;

  player = new Player(createVector(width/2,height/2));
  salmons = [];
  tunas = [];
  goldfishies = [];
  for(var i = 0; i < 5; i++){
    addTuna();
  }
}

function gameUpdate() {
  //Salmon Despawn
  for(var i = salmons.length-1; 0<=i; i--) {
    salmon = salmons[i];
    if(salmon.pos.x>width || salmon.pos.x<-2*salmon.radius || salmon.pos.y>height || salmon.pos.y<-2*salmon.radius) {
      salmons.splice(i,1);
    }
  }
  //Tuna Despawn
  for(var i = tunas.length-1; 0<=i; i--) {
    tuna = tunas[i];
    if(tuna.pos.x>width || tuna.pos.x<-2*tuna.radius || tuna.pos.y>height || tuna.pos.y<-2*tuna.radius) {
      tunas.splice(i,1);
    }
  }
  //Goldfish Despawn
  for(var i = goldfishies.length-1; 0<=i; i--) {
    goldfish = goldfishies[i];
    if(goldfish.pos.x>width || goldfish.pos.x<-2*goldfish.radius || goldfish.pos.y>height || goldfish.pos.y<-2*goldfish.radius) {
      goldfishies.splice(i,1);
    }
  }
  //Player Bounce
  if(player.pos.x>width-player.radius){
    player.dir += Math.PI;
    player.spd = player.spdPeak;
  } else if (player.pos.x<-player.radius) {
    player.dir += Math.PI;
    player.spd = player.spdPeak;
  }
  if(player.pos.y>height-player.radius){
    player.dir += Math.PI;
    player.spd = player.spdPeak;
  }
  else if (player.pos.y<-player.radius){
    player.dir += Math.PI;
    player.spd = player.spdPeak;
  }
  //Fish Adding
  var x = 0.025+(0.005*frameCount/60)/frameRate()
  if(Math.random() < (0.5+0.5*Math.sin(2*Math.PI*0.1*frameCount/60))*x){
    addSalmon();
  }
  if(Math.random() < 1.7*x){
    addTuna();
  }
  if(Math.random() < 0.1*x){
    addGoldfish();
  }
  //Collision Detection
  for(var i = salmons.length-1; 0<=i; i--) {
    var salmon = salmons[i];
    if(isCollidingPP(player.mid().x, player.mid().y, salmon.mid().x, salmon.mid().y, (player.radius+salmon.radius)/2)) {
      player.dir += Math.PI;
      player.spd = player.spdPeak/2;
      /*player.movePhase = MovePhase.SLOW_DOWN;
      salmon.pos.add(createVector(20*Math.cos(salmon.dir+Math.PI), 20*Math.sin(salmon.dir+Math.PI)));
      salmon.spd = 0;
      */
      salmons.splice(i,1);
      player.health = Math.max(0, player.health-0.15);
      bgColor = color(255, 50, 50);
      lastHit = frameCount;
      salmonSound.play();
    }
  }
  for(var i = tunas.length-1; 0<=i; i--) {
    tuna = tunas[i];
    if(isCollidingPP(tuna.mid().x, tuna.mid().y, player.mid().x, player.mid().y, (player.radius+tuna.radius)/2)) {
      tunas.splice(i,1);
      score += 1;
      player.health = Math.min(1, player.health+0.05);
      bgColor = color(0, 255, 0);
      lastHit = frameCount;
      tunaSound.play();
    }
  }
  for(var i = goldfishies.length-1; 0<=i; i--) {
    goldfish = goldfishies[i];
    if(isCollidingPP(player.mid().x, player.mid().y, goldfish.mid().x, goldfish.mid().y, (player.radius+goldfish.radius)/2)) {
      goldfishies.splice(i,1);
      score += 12;
      player.health = 1;
      bgColor = color(255, 255, 0);
      lastHit = frameCount;
      goldSound.play();
    }
  }
  if(frameCount-lastHit > 15){
    bgColor = color(60,240,220);
  }
  if(player.health <= 0){
    bgColor = color(255, 150, 150);
    if (highScore == null || highScore<score) {
      highScore = score;
      localStorage.setItem("highscore", score);
    }
    scene = Scene.END;
    endSound.play();
  }

  player.update();
  for(var salmon of salmons) {
    salmon.update();
  }
  for(var tuna of tunas) {
    tuna.update();
  }
  for(var goldfish of goldfishies) {
    goldfish.update();
  }
}
function draw(){
  if(scene === Scene.GAME){
    gameUpdate();
  }

  background(bgColor);
  player.show();
  for(var salmon of salmons) {
    salmon.show();
  }
  for(var tuna of tunas) {
    tuna.show();
  }
  for(var goldfish of goldfishies) {
    goldfish.show();
  }


  if (scene !== Scene.END) {
    fill(255-100*player.health,55+200*player.health,100, 100);
    rect(10, 10, (width-21)*player.health, 50);
  }
  if (scene !== Scene.START) {
    fill(0, 130, 0, 80);
    textSize(400);
    text(score, width/2, height/2+157)
  }
  //textSize(30);
  //text("SCORE: ", 90, height-20);
  //textSize(60);
  //text(Math.floor(score), 250, height-13);
  fill(0, 130, 0, 160);
  textSize(30);
  text("HIGH SCORE: ", width-300, height-20);
  textSize(60);
  text(Math.floor(highScore), width-100, height-13);

  if (scene === Scene.START) {
    player.update();
    fill(250, 10, 10, 200);
    textSize(170);
    text("Scary Salmon", width/2, height/2+50);
    textSize(50);
    text("click to start", width/2, height/2+120);
  }else if (scene === Scene.END) {
    if(frameCount - lastHit > 100) {
      fill(10, 10, 10, 130);
      textSize(50);
      text("click to restart", 250, height-17.5);
    }
  }
}

function addSalmon() {
  var radius = 100 + 50*(2*Math.random()-1);
  var pos;
  var dir;
  var side = Math.floor(Math.random()*4);
  if (side === 0){
    pos = createVector(-2*radius, height*Math.random()-2*radius);
    dir = 0;
  } else if (side === 1){
    pos = createVector(width, height*Math.random()-2*radius);
    dir = Math.PI;
  } else if (side === 2){
    pos = createVector(width*Math.random()-2*radius, -2*radius);
    dir = 0.5 * Math.PI;
  } else{
    pos = createVector(width*Math.random()-2*radius, height);
    dir = -0.5 * Math.PI;
  }
  var moveChance = 0.6*Math.random()+0.3;
  var dragAcc = -0.02;
  var spdUpAcc = 0.8 + 1*Math.random();
  var spdDownAcc = -0.025 + -0.375*Math.random();
  var spdPeak = 2 + 4*Math.random();
  salmons.push(new Salmon(pos, dir, radius, moveChance, dragAcc, spdUpAcc, spdDownAcc, spdPeak));
}
function addTuna() {
  var radius = 20 + 10*Math.random();
  var pos;
  var dir;
  var side = Math.floor(Math.random()*4);
  if (side === 0){
    pos = createVector(-2*radius, height*Math.random()-2*radius);
    dir = 0;
  } else if (side === 1){
    pos = createVector(width, height*Math.random()-2*radius);
    dir = Math.PI;
  } else if (side === 2){
    pos = createVector(width*Math.random()-2*radius, -2*radius);
    dir = 0.5 * Math.PI;
  } else{
    pos = createVector(width*Math.random()-2*radius, height);
    dir = -0.5 * Math.PI;
  }
  var moveChance = 0.2*Math.random()+0.1;
  var dragAcc = -0.02;
  var spdUpAcc = 0.6+0.4*Math.random();
  var spdDownAcc = -0.3 + -0.2*Math.random();
  var spdPeak = 0.5 + 0.5*Math.random();
  tunas.push(new Tuna(pos, dir, radius, moveChance, dragAcc, spdUpAcc, spdDownAcc, spdPeak));
}
function addGoldfish() {
  var radius = 30 + 10*Math.random();
  var pos;
  var dir;
  var side = Math.floor(Math.random()*4);
  if (side === 0){
    pos = createVector(-2*radius, height*Math.random()-2*radius);
    dir = 0;
  } else if (side === 1){
    pos = createVector(width, height*Math.random()-2*radius);
    dir = Math.PI;
  } else if (side === 2){
    pos = createVector(width*Math.random()-2*radius, -2*radius);
    dir = 0.5 * Math.PI;
  } else{
    pos = createVector(width*Math.random()-2*radius, height);
    dir = -0.5 * Math.PI;
  }
  var moveChance = 0.025*Math.random()+0.075;
  var dragAcc = -0.02;
  var spdUpAcc = 4 + 1*Math.random();
  var spdDownAcc = -0.3 + -0.2*Math.random();
  var spdPeak = 2.5 + 1*Math.random();
  var goldfish = new Goldfish(pos, dir, radius, moveChance, dragAcc, spdUpAcc, spdDownAcc, spdPeak);
  goldfishies.push(goldfish);
}

function keyPressed() {
  if (keyCode === RETURN) {
    bgColor = color(200,240,100);
    scene = Scene.GAME;
    gameStart();
  }
}
function mouseClicked() {
  if (scene !== Scene.GAME) {
    bgColor = color(200,240,100);
    scene = Scene.GAME;
    gameStart();
  }
}
function mouseMoved() {
  player.touchedMouse = false;
}
function isCollidingPP(x1, y1, x2, y2, r){
  ans = (Math.pow(x2-x1,2) + Math.pow(y2-y1,2) <= Math.pow(r,2));
  return ans;
}
