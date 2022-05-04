// Class for map object
class Map{
  constructor(imagePath){
    this.imagePath = imagePath
    this.wayPoints = []
    this.placements = []
  }
}

class Selector{
  constructor(){

  }
}

class DefenderTower{
  constructor(){
    this.x
    this.y
    this.health = 100;
      // method to take damage

  }

  damaged(amount){
    if(this.health <= 0){
      this.dead = true;
    }
    else{
      this.health -= amount
    }
  }
}
// Class for tower object
class Defender{
  constructor(x, y, place){
    this.x = x;
    this.y = y;
    this.width = 60;
    this.place = place;
    this.health = 200;
    // this.attack = Math.floor(Math.random()*10)
    this.dead = false
    // this.shape;
    this.children;
  }
  show(){
    fill("blue")
    rect(this.x, this.y, this.width, this.width)
    fill(0, 102, 153);
    text(`${this.health}`, (this.x - this.width /2 ), this.y - 30)
  }

  damaged(amount){
    if(this.health <= 0){
      this.dead = true
    }
    this.health -= amount
  }
  spawnChildren(){
    // setTimeout(console.log("sleeping"), 200)
    var yPos = this.y + 65
    this.children = new Defender(this.x, yPos, 50)
    this.children.health = 100
    this.children.width = 20
    this.children.show()
  }

}
// Class for Attacker object
class Attacker{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.width = 20;
    this.dx = 5;
    this.dy = 5;
    this.dir = "down"
    this.health = 750;
    this.attack = Math.floor(Math.random()*10);
    this.dead = false;
    this.mode  = "passive";
  }
  // method to move attacker based on map waypoints
  move(){
    if(this.dir == "down"){
      this.y += this.dy
    }
    if(this.dir == "up"){
      this.y -= this.dy
    }
    if(this.dir == "left"){
      this.x -= this.dx;
    }
    if(this.dir == "right"){
      this.x += this.dy
    }
      
  }
  stop(){
    this.x = this.x;
    this.y = this.y;
  }
  // method to draw attack on canvas
  show(){
    fill("red");
    circle(this.x, this.y, this.width);
    fill(0, 102, 153);
    text(`${this.health}`, this.x - 10, this.y - 15);
  }
  // method to take damage
  damaged(amount){
    if(this.health <= 0){
      this.dead = true;
    }
    else{
      this.health -= amount
    }
  }
  // collision check
  collided(entityX, entityY, entityW){
    var distance = dist(this.x, this.y, entityX, entityY)
      if(distance > 0 && distance < entityW){
        return true
    }
    return false
  }

}

var canvasWidth = 800;
var canvasHeight = 450;
//images
var menu;
var queue;
var htp1;
var htp2;
var htp3;
var defenderTower;

//audio
var bkgmusic;

// scene handler
var scene = 4
var gameTime = 0
var font, fontSize = 20;
gameState = "wait"

function preload() {
  // preload all images and sound for game
  mapOb = new Map("assets/tdo_background.png")
  backgroundMap = loadImage(mapOb.imagePath)
  soundFormats("m4a", "wav", "mp3");
  music = loadSound("sounds/Menu Music.mp3");
  menu = loadImage("assets/TDO Menu Screen Moqup.jpg");
  htp1 = loadImage("assets/TDO HTP Screen 1.jpg");
  htp2 = loadImage("assets/TDO HTP Screen 2.jpg");
  htp3 = loadImage("assets/TDO HTP Screen 3.jpg");
  
  defenderTower = loadImage("assets/Tower_Sprite_Undamaged.png")
  font = loadFont('assets/Nunito-Bold.ttf');
}

function setup() {
  // canvas setup
  createCanvas(canvasWidth,canvasHeight);
  rectMode(CENTER);
  ellipseMode(CENTER);
  textFont(font);
  textSize(fontSize);
  console.log(canvasWidth, canvasHeight)

  // map object with waypoints for attacker navigation
  mapOb.wayPoints.push([700, 0, "down"],[700, 290, "left"], [310, 280, "up"],[310, 90, "left"],[115, 95, "down"])
  // coordinates for tower placements and direction of spawning children
  mapOb.placements.push([760, 155, "free", "left"], [568, 225, "free", "down"], [370, 225, "free", "down"], [203, 35, "free", "down"], [205, 200, "free", "right"], [40, 136, "free", "right"], [40, 273, "free", "right"])
  towerOb= new DefenderTower()
  towerOb.x = 115, towerOb.y = 380
  // arrays for towers and attackers
  towers = []
  attackers = []
  
  if(scene == 4){
  // interval functions for game
  attackerInterval = setInterval(spawnAttacker, 10000)
  defenderInterval = setInterval(coolDown, 4000)
  timerInterval = setInterval(updateTimer, 1000)
  }


}

function draw() {

  // menus
  if (!music.isPlaying()) {
    // music.play();
  }
  // Highlight buttons 
  if (scene == 0) {
    background(menu);
    if (mouseX > 290 && mouseX < 503 && mouseY > 151 && mouseY < 192) {
      cursor(HAND);
    } else cursor(ARROW);

    if (mouseX > 293 && mouseX < 507 && mouseY > 227 && mouseY < 268) {
      cursor(HAND);
    } else cursor(ARROW);

    if (mouseX > 291 && mouseX < 507 && mouseY > 306 && mouseY < 346) {
      cursor(HAND);
    } else cursor(ARROW);
  }

  if (scene == 1) {
    background(htp1);
    if (mouseX > 1480 && mouseX < 1905 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else if (mouseX > 65 && mouseX < 490 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else cursor(ARROW);
  }

  if (scene == 2) {
    background(htp2);
        if (mouseX > 740 && mouseX < 1165 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else if (mouseX > 65 && mouseX < 490 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else cursor(ARROW);
  }

  if (scene == 3) {
    background(htp3);
    if (mouseX > 65 && mouseX < 490 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else cursor(ARROW);
  }

  // Game Scene
  if (scene == 4) {

    if(gameState == "stop"){
      reSetup()
      gameState ="play"
    }
    background(backgroundMap)
    currentTime = new Date(gameTime * 1000).toISOString().substr(14, 5)
    rect(80, 30, 130, 30)
    text("Timer:", 20, 35)
    text(currentTime, 85, 35);

    // Tower health HUD
    image(defenderTower, 10, 300, 220, 170)
    if (towerOb.health <= 0){
      console.log("tower dead")
      scene = 0
      resetGame()
      
    }
    // selection menu
    strokeWeight(8);
    stroke("white");
    fill("white")
    rect(650, 400, 200, 60)
    // selection squares
    stroke("black")
    fill(180)
    strokeWeight(1);
    rect(575, 400, 40, 50)
    rect(625, 400, 40, 50)
    rect(675, 400, 40, 50)
    rect(725, 400, 40, 50)
    // highlight selection
    if(mouseX > 555 && mouseX < 593 && mouseY > 376 && mouseY < 425){
      fill("yellow")
      rect(575, 400, 40, 50)
      cursor(HAND)
    }
    else if(mouseX > 604 && mouseX < 644 && mouseY > 376 && mouseY < 425){
      fill("yellow")
      rect(625, 400, 40, 50)
      cursor(HAND)
    }
    else if(mouseX > 655 && mouseX < 695 && mouseY > 376 && mouseY < 425){
      fill("yellow")
      rect(675, 400, 40, 50)
      cursor(HAND)
    }
    else if(mouseX > 705 && mouseX < 744 && mouseY > 376 && mouseY < 425){
      fill("yellow")
      rect(725, 400, 40, 50)
      cursor(HAND)
    }
    else
    {
      cursor(ARROW)
    }


    fill("blue")
    rect(575, 400, 20, 20)
    fill("green")
    ellipse(625, 400, 20)
    fill("purple")
    triangle(663, 410, 690, 410, 675, 386)


    // 

    // // turn points
    // text("1",700, 10)
    // text("2", 700, 290)
    // text("3", 310, 280)
    // text("4", 300, 90)
    // ellipse(115, 95, 10, 10)
    // ellipse(100, 400, 10, 10)
    // // place areas
    // text("x1",760, 155)
    // text("x2", 568, 225)
    // text("x3", 370, 225)
    // text("x4", 203, 35)
    // text("x5", 205, 200)
    // text("x6", 40, 136)
    // text("x7", 40, 273)
    // defnder tower location


    for(i = 0; i < attackers.length; i++){
      // call methods for living attackers
      if(!attackers[i].dead){
        attackers[i].show()
        if(attackers[i].mode == "passive"){
          attackers[i].move()
        }
        else{
          attackers[i].stop()
        }
        if(attackers[i].collided(towerOb.x, towerOb.y, 10)){
          console.log("collided")
          console.log(towerOb.health)
              attackers[i].mode = "aggresive"
              towerOb.damaged(attackers[i].attack)
        }
        // check collision with defending towers
        for(j = 0; j < towers.length; j++){
          if(towers[j].children){
            towers[j].children.show()
            console.log(towers[j].children.x, towers[j].children.y)
            if(attackers[i].collided(towers[j].children.x, towers[j].children.y, 50)){
              console.log("collided")
              attackers[i].mode = "aggresive"
              attackers[i].damaged(towers[j].children.attack)
              towers[j].children.damaged(attackers[i].attack)
              if(towers[j].dead == true){
                attackers[i].mode = "passive"
              }
            }
          }
  
        }
        // navigate attacker utilizing map turn points
        for(k = 0; k< mapOb.wayPoints.length; k++){
          if(attackers[i].collided(mapOb.wayPoints[k][0], mapOb.wayPoints[k][1], 10)){
            attackers[i].dir = mapOb.wayPoints[k][2]
          }
        }
      }
      // remove dead attacks from array
      else{
        attackers.splice(i)
      }
  
    }
  
    for(i = 0; i < towers.length; i++){
      // call methods for living towers
      if(!towers[i].dead){
        towers[i].show()
  
      }
      // remove dead towers from array
      else{
        towers.splice(i)
      }
  
    }
  }

  if (scene == 5) {
    // link to leaderboard page //
  }




}


function mousePressed(){
  console.log(mouseX , mouseY)

  // scene navigation
  if (scene == 0) {
    if (mouseX > 290 && mouseX < 503 && mouseY > 151 && mouseY < 192) {
      scene = 4;
    }
  }

  if (scene == 0) {
    if (mouseX > 293 && mouseX < 507 && mouseY > 227 && mouseY < 268) {
      scene = 5;
    }
  }

  if (scene == 0) {
    if (mouseX > 291 && mouseX < 507 && mouseY > 306 && mouseY < 346) {
      scene = 1;
    }
  }

  if (scene == 1) {
    if (mouseX > 617 && mouseX < 793 && mouseY > 372 && mouseY < 426) {
      scene = 2;
    } else if (mouseX > 27 && mouseX < 203 && mouseY > 372 && mouseY < 426) {
      scene = 0;
    }
  }

  if (scene == 2) {
    if (mouseX > 308 && mouseX < 483 && mouseY > 372 && mouseY < 426) {
      scene = 3;
    } else if (mouseX > 27 && mouseX < 203 && mouseY > 372 && mouseY < 426) {
      scene = 1;
    }
  }

  if (scene == 3) {
    if (mouseX > 27 && mouseX < 203 && mouseY > 372 && mouseY < 426) {
      scene = 2;
    }
  }

  if(scene == 4){
    // Handlers for in-game clicks
    plotDefender()


  }



}

function plotDefender(){
  for(i = 0; i< mapOb.placements.length; i++){
    d = dist(mouseX, mouseY, mapOb.placements[i][0], mapOb.placements[i][1])
    if(d < 20 && mapOb.placements[i][2] == "free" ){
      towers.push(new Defender(mapOb.placements[i][0], mapOb.placements[i][1], i))
      console.log("ploted")
      
      mapOb.placements[i][2] = "full"
    }
    

  }
}
function coolDown(){
  for(i = 0; i < towers.length; i++){
    // towers[i].spawnChildren()
    // console.log("spawned")
  }
}

function updateTimer(){

  gameTime++;
}

function spawnAttacker(){

  attackers.push(new Attacker(mapOb.wayPoints[0][0],mapOb.wayPoints[0][1]))

}

function resetGame(){
  mapOb = new Map("assets/tdo_background.png")
  // map object with waypoints for attacker navigation
  mapOb.wayPoints.push([700, 0, "down"],[700, 290, "left"], [310, 280, "up"],[310, 90, "left"],[115, 95, "down"])
  // coordinates for tower placements and direction of spawning children
  mapOb.placements.push([760, 155, "free", "left"], [568, 225, "free", "down"], [370, 225, "free", "down"], [203, 35, "free", "down"], [205, 200, "free", "right"], [40, 136, "free", "right"], [40, 273, "free", "right"])
  towers = [];
  attackers = [];
  towerOb= new DefenderTower();
  towerOb.x = 115, towerOb.y = 380;
  gameTime = 0;
  clearInterval(attackerInterval)
  clearInterval(defenderInterval)
  clearInterval(timerInterval)
  gameState ="stop"
}

function reSetup(){
    attackerInterval = setInterval(spawnAttacker, 10000)
    defenderInterval = setInterval(coolDown, 4000)
    timerInterval = setInterval(updateTimer, 1000)
}