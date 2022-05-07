// Class for map object
class Map{
  constructor(){
    this.wayPoints = [[[700, 0, "down"],[700, 290, "left"], [305, 280, "up"],[320, 90, "left"],[115, 95, "down"]], 
    [[115, 380, "up"], [115, 95, "right"], [310, 95, "down"],[310 , 290, "right"],[700, 290, "up"],[700, 0, "up"]]]
    this.placements = [[765, 153, "free", "left"], [573, 222, "free", "down"], [378, 222, "free", "down"], [210, 34, "free", "down"], [210, 199, "free", "right"], [45, 136, "free", "right"], [45, 270, "free", "right"]]
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
    this.health = 1000;

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
    this.health = 1000;
    // this.attack = Math.floor(Math.random()*10)
    this.dead = false
    // this.childrenCooldown = false;
    // this.childrenCooldownTimer = 500;
  }
  show(){
    fill("blue")
    rect(this.x, this.y, this.width, this.width)
    fill(0, 102, 153);
    text(`${Math.floor(this.health)}`, (this.x - this.width /2 ), this.y - 30)
  }

  damaged(amount){
    if(this.health <= 0){
      this.dead = true
    }
    this.health -= amount
  }
  // spawnChildren(){
  //   // setTimeout(console.log("sleeping"), 200)
  //   var yPos = this.y + 65
  //   this.children = new Defender(this.x, yPos, 50)
  //   this.children.health = 100
  //   this.children.width = 20
  //   // this.children.show()
  // }

}
// Class for Attacker object
class Attacker{
  constructor(x,y, type){
    this.x = x;
    this.y = y;
    this.width = 20;
    this.type = type;
    this.dx = 2;
    this.dy = 2;
    this.health = 12;
    this.coolDown = 100;
    if(this.type == "alien"){
      this.attack = Math.random(0.15);
      this.dir ="down"
    }
    else{
      this.attack = Math.random(0.10);
      this.dir = "up"
    }


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
    if(this.type == "alien"){
      fill("red")
      ellipse(this.x, this.y, this.width)
      // image(this.image,this.x - this.width/2 , this.y -this.height/2, this.width, this.height )
      fill(0, 102, 153);
      text(`${Math.ceil(this.health)}`, this.x - 10, this.y - 15);
    }
    else{
      fill("green")
      ellipse(this.x, this.y,this.width)
      fill(0, 102, 153);
      text(`${Math.ceil(this.health)}`, this.x - 10, this.y - 15);
    }

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
    var distance = dist(this.x, this.y,entityX, entityY)
    if(distance <=  this.width/2 + entityW/2){
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
var attackerInterval;
var damageInterval;
var defenderInterval;
var timerInterval;
var soldierCoolDown = false
var soldierCoolDownTimer = 500;
var defenderCoolDown = false;
var defenderCoolDownTimer = 500;
var canPlace = false;
// var childrenCooldown = false;
// var childrenCooldownTimer = 500;




function preload() {
  // preload all images and sound for game
  backgroundMap = loadImage("assets/tdo_background.png")
  soundFormats("m4a", "wav", "mp3");
  music = loadSound("sounds/Menu Music.mp3");
  menu = loadImage("assets/TDO Menu Screen Moqup.jpg");
  htp1 = loadImage("assets/TDO HTP Screen 1.jpg");
  htp2 = loadImage("assets/TDO HTP Screen 2.jpg");
  htp3 = loadImage("assets/TDO HTP Screen 3.jpg");
  
  defenderTower = loadImage("assets/Tower_Sprite_Undamaged.png")
  // aliens = loadImage("assets/Alien_Tower_Attacker_Blinking_With_Mouth_Open.png")
  font = loadFont('assets/Nunito-Bold.ttf');
}

function setup() {
  // canvas setup
  createCanvas(canvasWidth,canvasHeight);
  rectMode(CENTER);
  ellipseMode(CENTER);
  textFont(font);
  textSize(fontSize);
  mapOb = new Map()

  // map object with waypoints for attacker navigation
  // mapOb.wayPoints.push([700, 0, ["down", "up"]],[700, 290, ["left", "up"]], [310, 280, ["up","right"]],[310, 90, ["left","down"]],[115, 95, ["down","right"]], [115, 400, ["down","up"]])
  // coordinates for tower placements and direction of spawning children
  // mapOb.placements.push([760, 155, "free", "left"], [568, 225, "free", "down"], [370, 225, "free", "down"], [203, 35, "free", "down"], [205, 200, "free", "right"], [40, 136, "free", "right"], [40, 273, "free", "right"])
  towerOb= new DefenderTower()
  towerOb.x = 115, towerOb.y = 380
  // arrays for towers and attackers
  towers = []
  attackers = []
  soldiers = []


  

}

function draw() {

  // menus
  if (!music.isPlaying()) {
    // music.play();
  }
  // Highlight buttons 
  if (scene == 0) {
    background(menu);
    if (mouseX > 290 && mouseX < 503 && mouseY > 151 && mouseY < 192 ) {
      cursor(HAND);
    }else{cursor(ARROW)}

    if (mouseX > 293 && mouseX < 507 && mouseY > 227 && mouseY < 268) {
      cursor(HAND);
    }else{cursor(ARROW)}

    if (mouseX > 291 && mouseX < 507 && mouseY > 306 && mouseY < 346) {
      cursor(HAND);
    }else{cursor(ARROW)}

  }

  else if (scene == 1) {
    background(htp1);
    if (mouseX > 1480 && mouseX < 1905 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else if (mouseX > 65 && mouseX < 490 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else cursor(ARROW);
  }

  else if (scene == 2) {
    background(htp2);
        if (mouseX > 740 && mouseX < 1165 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else if (mouseX > 65 && mouseX < 490 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else cursor(ARROW);
  }

  else if (scene == 3) {
    background(htp3);
    if (mouseX > 65 && mouseX < 490 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else cursor(ARROW);
  }

  // Game Scene
  else if (scene == 4) {


    if(gameState == "stop"){
      reSetup()
    }



    background(backgroundMap)

    currentTime = new Date(gameTime * 1000).toISOString().substr(14, 5)
    fill("white")
    rect(80, 30, 130, 30)
    fill("black")
    text("Timer:", 20, 35)
    text(currentTime, 85, 35);

    if(gameState == "wait")
    {
      fill("black")
      text("START", 450, 420)
    }
    // Tower health HUD
    for(i=0; i<mapOb.wayPoints[0].length; i++){
      ellipse(mapOb.wayPoints[1][i][0], mapOb.wayPoints[1][i][1], 1)
    }
    for(i=0; i<mapOb.placements.length; i++){
      ellipse(mapOb.placements[i][0], mapOb.placements[i][1], 1)
    }
    fill("white")
    rect(360, 385, 110, 20)
    fill("red")
    textSize(12)
    text("Tower Health Bar", 310, 390)
    fill("white")
    rect(370, 410, 130, 20)
    fill("red")
    barWidth = map(25, 0, 200, 0, towerOb.health)
    rectMode(CORNER)
    rect(308, 403, barWidth, 15)
    image(defenderTower, 10, 300, 220, 170)
    rectMode(CENTER)
    

    if (towerOb.health <= 0){
      console.log("tower dead")
      resetGame()
      
    }
    // selection menu
    strokeWeight(8);
    stroke("white");
    fill("white")
    rect(625, 400, 150, 60)

    // selection squares
    stroke("black")
    fill(180)
    strokeWeight(1);
    rect(575, 400, 40, 50)
    rect(625, 400, 40, 50)
    rect(675, 400, 40, 50)
    // rect(725, 400, 40, 50)

    // highlight selection
    if(mouseX > 555 && mouseX < 593 && mouseY > 376 && mouseY < 425 && !defenderCoolDown){
      fill("yellow")
      rect(575, 400, 40, 50)
      cursor(HAND)
    }
    else if(mouseX > 604 && mouseX < 644 && mouseY > 376 && mouseY < 425 && !soldierCoolDown){
      fill("yellow")
      rect(625, 400, 40, 50)
      cursor(HAND)
    }
    else if(mouseX > 655 && mouseX < 695 && mouseY > 376 && mouseY < 425){
      fill("yellow")
      rect(675, 400, 40, 50)
      cursor(HAND)
    }
    // else if(mouseX > 705 && mouseX < 744 && mouseY > 376 && mouseY < 425){
    //   fill("yellow")
    //   rect(725, 400, 40, 50)
    //   cursor(HAND)
    // }
    else
    {
      cursor(ARROW)
    }

    // utilities images
    fill("blue")
    rect(575, 400, 20, 20)
    fill("green")
    ellipse(625, 400, 20)
    fill("purple")
    triangle(663, 410, 690, 410, 675, 386)

    // TODO implement tower placment cool down
    if(defenderCoolDown == true){
      fill(25, 200)
      rect(575, 400, 40, 50)
      defenderCoolDownTimer--
      if(defenderCoolDownTimer == 0){
        defenderCoolDown = false
      }
    }
    if(canPlace){
      cursor("assets/square_32.png")
    }

    if(gameState == "play"){
      if(soldierCoolDown == true){
        fill(25, 200)
        rect(625, 400, 40, 50)
        soldierCoolDownTimer--
        if(soldierCoolDownTimer == 0){
          soldierCoolDown = false
        }
      }
      
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
          if(attackers[i].collided(towerOb.x, towerOb.y, 25, "tower")){
                attackers[i].mode = "aggresive"
                towerOb.damaged(attackers[i].attack)
          }

          for(j=0; j<soldiers.length; j++){
            if(attackers[i].collided(soldiers[j].x, soldiers[j].y, soldiers[j].width, 0)){
              console.log("collided")
              attackers[i].mode = "aggresive"
              soldiers[j].damaged(attackers[i].attack)

              // if(attackers[j].dead == true || !attackers[j]){
              //   soldiers[i].mode = "passive"
              // }
              if(soldiers[j].dead == true){
                attackers[i].mode = "passive"
              }
            }

          }
          
          // check collision with defending children
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
          for(k = 0; k < mapOb.wayPoints[0].length; k++){
            if(attackers[i].collided(mapOb.wayPoints[0][k][0], mapOb.wayPoints[0][k][1], 10)){
              // console.log("collided")
              attackers[i].dir = mapOb.wayPoints[0][k][2]
            }
          }
        }
        // remove dead attacks from array
        else{
          attackers.splice(i,1)
        }
    
      }
      // logical for soldiers
      for(i = 0; i < soldiers.length; i++){
        // call methods for living attackers
        if(!soldiers[i].dead){
          soldiers[i].show()
          if(soldiers[i].mode == "passive"){
            soldiers[i].move()
          }
          else{
            soldiers[i].stop()
          }
          for(j=0; j<attackers.length; j++){
            if(soldiers[i].collided(attackers[j].x, attackers[j].y, attackers[j].width, 0)){
              console.log("collided")
              soldiers[i].mode = "aggresive"
              // attackers[j].mode = "aggresive"
              // soldiers[i].damaged(attackers[j].attack)
              attackers[j].damaged(soldiers[i].attack)
              if(attackers[j].dead == true){
                soldiers[i].mode = "passive"
              }
              // if(soldiers[i].dead == true || !soldiers[i] ){
              //   attackers[j].mode = "passive"
              // }
            }

          }

          // navigate attacker utilizing map turn points
          for(k = 0; k< mapOb.wayPoints[1].length; k++){
            if(soldiers[i].collided(mapOb.wayPoints[1][k][0], mapOb.wayPoints[1][k][1], 0, "turn")){
              soldiers[i].dir = mapOb.wayPoints[1][k][2]
            }
          }
        }
        // remove dead soldiers from array
        else{
          soldiers.splice(i,1)
        }
    
      }
    
      for(i = 0; i < towers.length; i++){
        // call methods for living towers
        if(!towers[i].dead){
          towers[i].show()
          if (towers[i].childrenCooldown == true){
            towers[i].childrenCooldownTimer --
            if(towers[i].childrenCooldownTimer == 0){
              towers[i].childrenCooldown == false
            }
          }
    
        }
        // remove dead towers from array
        else{
          towers.splice(i)
        }
    
      }

    }
    }


  if (scene == 5) {
    // link to leaderboard page //
  }




}


function mousePressed(){

  // console.log(mouseX, mouseY)

  // scene navigation
  if (scene == 0) {
    if (mouseX > 290 && mouseX < 503 && mouseY > 151 && mouseY < 192) {
      scene = 4;
    }
    else if (mouseX > 293 && mouseX < 507 && mouseY > 227 && mouseY < 268) {
      console.log("leaderboard not implemented");
    }
    else if (mouseX > 291 && mouseX < 507 && mouseY > 306 && mouseY < 346) {
      scene = 1;
    }
  }

  if (scene == 1) {
    if (mouseX > 617 && mouseX < 793 && mouseY > 372 && mouseY < 426) {
      scene = 2;
    } 
    else if (mouseX > 27 && mouseX < 203 && mouseY > 372 && mouseY < 426) {
      scene = 0;
    }
  }

  if (scene == 2) {
    if (mouseX > 308 && mouseX < 483 && mouseY > 372 && mouseY < 426) {
      scene = 3;
    } 
    else if (mouseX > 27 && mouseX < 203 && mouseY > 372 && mouseY < 426) {
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
    // start game
    if(gameState == "wait"){
      if(mouseX > 450 && mouseX < 513 && mouseY > 405 && mouseY < 418){
        startGame()
      }
      
    }
     
    // defender tower utility click
    if(mouseX > 555 && mouseX < 593 && mouseY > 376 && mouseY < 425){
      // TODO
      if(defenderCoolDown == false){
        canPlace = true
        defenderCoolDown = true
        defenderCoolDownTimer = 500;
      }

    }

    if(canPlace){
      plotDefender()
      cursor(ARROW)
    }

    if(gameState == "play"){
      // Utilities clicks during game
      // soldier
      if(mouseX > 604 && mouseX < 644 && mouseY > 376 && mouseY < 425){
        if(soldierCoolDown == false){
          spawnDefender()
          soldierCoolDownTimer = 500;
          soldierCoolDown = true;
        }

      }
      // else if(mouseX > 604 && mouseX < 644 && mouseY > 376 && mouseY < 425){
      //   fill("yellow")
      //   rect(625, 400, 40, 50)
      //   cursor(HAND)
      // }
      // else if(mouseX > 655 && mouseX < 695 && mouseY > 376 && mouseY < 425){
      //   fill("yellow")
      //   rect(675, 400, 40, 50)
      //   cursor(HAND)
      // }
      // else if(mouseX > 705 && mouseX < 744 && mouseY > 376 && mouseY < 425){
      //   fill("yellow")
      //   rect(725, 400, 40, 50)
      //   cursor(HAND)
      // }
    }

    

  }



}

function startGame(){
    // interval functions for game
    gameState = "play"
    attackerInterval = setInterval(spawnAttacker, 7500);
    // defenderInterval = setInterval(coolDown, 4000);
    timerInterval = setInterval(updateTimer, 1000);

}

function plotDefender(){

  for(i = 0; i< mapOb.placements.length; i++){
    d = dist(mouseX, mouseY, mapOb.placements[i][0], mapOb.placements[i][1])
    if(d < 30 && mapOb.placements[i][2] == "free" ){
      defenderOb = new Defender(mapOb.placements[i][0], mapOb.placements[i][1], i)
      towers.push(defenderOb)
      console.log("ploted")
      mapOb.placements[i][2] = "full"
      canPlace = false
      // console.log("child spawned")
      // if defend
      // if(mapOb.placements[i][2] == "left"){
      //   child = new
      // }
      
    }
    

  }

}

// function coolDownHandler(time){

// }

function updateTimer(){

  gameTime++;
}

function spawnAttacker(){
  alien = new Attacker(mapOb.wayPoints[0][0][0],mapOb.wayPoints[0][0][1], "alien")

  if(gameTime >= 30){
    alien.width += 10
    alien.health = 20
    alien.attack += 0.05
  }
  
  attackers.push(alien)
}

// function doDamage(){

// }

function spawnDefender(){
  soldiers.push(new Attacker(mapOb.wayPoints[1][0][0],mapOb.wayPoints[1][0][1], "soldier"))
  print("solder Pushed")
}
// Game state handlers
function resetGame(){
  mapOb = new Map("assets/tdo_background.png")
  // map object with waypoints for attacker navigation
  // mapOb.wayPoints.push([700, 0, "down"],[700, 290, "left"], [310, 280, "up"],[310, 90, "left"],[115, 95, "down"])
  // coordinates for tower placements and direction of spawning children
  // mapOb.placements.push([760, 155, "free", "left"], [568, 225, "free", "down"], [370, 225, "free", "down"], [203, 35, "free", "down"], [205, 200, "free", "right"], [40, 136, "free", "right"], [40, 273, "free", "right"])
  towers = [];
  attackers = [];
  soldiers = [];
  towerOb= new DefenderTower();
  towerOb.x = 115, towerOb.y = 380;
  gameTime = 0;
  soldierCoolDown = false;
  soldierCoolDownTimer = 500;
  clearInterval(attackerInterval)
  clearInterval(defenderInterval)
  clearInterval(timerInterval)
  gameState ="wait"
  defenderCoolDown = false;
  defenderCoolDownTimer = 500;
  canPlace = false;

}

function reSetup(){
    attackerInterval = setInterval(spawnAttacker, 7500)
    // defenderInterval = setInterval(coolDown, 4000)
    timerInterval = setInterval(updateTimer, 1000)
}
