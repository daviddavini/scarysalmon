var fishImg;
function preload(){
  fishImg = loadImage('img/fish.png');
}

function setup(){
  var myCanvas = createCanvas(screen.width,screen.height);

  textSize(30);
  textAlign(CENTER);
}

function draw(){
  background(200);
  text(int(frameRate()), width/2, height/2);
  image(fishImg, width/2, height/2);
}
