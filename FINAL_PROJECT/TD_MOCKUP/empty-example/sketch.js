// Class for map object
class Map{
  constructor(){
    this.wayPoints = [[[700, 0, "down"],[700, 340, "left"], [305, 340, "up"],[305, 35, "left"],[115, 35, "down"]], 
    [[115, 380, "up"], [115, 40, "right"], [310, 40, "down"],[310 , 340, "right"],[700, 340, "up"],[700, 0]]]
    this.placements = [[765, 153, "free", 693, 153], [573, 222, "free", 573, 300], [378, 222, "free", 378, 300], [210, 34, "free", 210, 90 ], [210, 199, "free", 300, 199], [45, 136, "free", 110, 136], [45, 270, "free", 110, 270]]
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
    this.width = 10
    this.height = 10
    this.health = 1000;
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
}

// Class for tower object
class Defender{
  constructor(x, y, place){
    this.x = x;
    this.y = y;
    this.width = 176;
    this.height = 99;
    this.place = place;
    this.health = 300;
    this.spawnInterval = false;
    this.dead = false
  }
  show(){
    fill(255);
    text(`${Math.floor(this.health)}`, (this.x), this.y - this.height)
  }

  damaged(amount){
    if(this.health <= 0){
      this.dead = true
    }
    this.health -= amount
  }
}
// Class for Attacker object
class Attacker{
  constructor(x,y, type){
    this.x = x;
    this.y = y;
    this.width = 112;
    this.height = 63;
    this.type = type;
    // this.dx = 2;
    // this.dy = 2;
    this.coolDown = 100;

    if(this.type == "alien"){
      this.dx = 0.5
      this.dy = 0.5
      this.health = 12
      this.attack = Math.random(0.015);
      this.dir ="down"
    }
    if(this.type == "towerAttacker"){
      this.dx = 0.25
      this.dy = 0.25
      this.health = 25
      this.attack = Math.random(0.025);
      this.dir = "down"
    }
    if(this.type == "soldier"){
      this.dx = 1 
      this.dy = 1
      this.health = 15
      this.attack = Math.random(0.020);
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
    fill(255);
    text(`${Math.ceil(this.health)}`, this.x, this.y - this.height/2);

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
  collided(entityX, entityY, entityW, entityH, type){
    var distance = dist(this.x, this.y,entityX, entityY)
    if(type == "defender"){
      if(distance <=  this.width/2  + entityW || distance <= this.height/2 + entityH){
        return true
    }
    return false
    }
    else{
      if(distance <=  this.width/2){
        return true
    }
    return false
    }

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
var scene = 0
var leaderboard = "Leader Board\n"
var gameTime = 0
var font, fontSize = 20;
gameState = "wait"
// Intervals, timers and switches
var attackerInterval;
var timerInterval;
var towerAttackerInterval;
var soldierCoolDown = false
var soldierCoolDownTimer = 500;
var defenderCoolDown = false;
var defenderCoolDownTimer = 500;
var canPlace = false;
var canStrike = false;
var mortarCoolDown = false;
var mortarCoolDownTimer = 500;



function preload() {
  // preload all images and sound for game
  backgroundMap = loadImage("assets/tdo_background.png")
  soundFormats("m4a", "wav", "mp3");
  music = loadSound("sounds/Menu Music.mp3");
  menu = loadImage("assets/TDO Menu Screen Moqup.jpg");
  htp1 = loadImage("assets/TDO HTP Screen 1.jpg");
  htp2 = loadImage("assets/TDO HTP Screen 2.jpg");
  htp3 = loadImage("assets/TDO HTP Screen 3.jpg");
  alienImage1 = loadImage("assets/alien_army_almost_dead.png")
  towerAttackerImage1 = loadImage("assets/Alien_Tower_Attacker_Blinking_With_Mouth_Open.png")
  soldierImage1 = loadImage("assets/Soldier Army Almost Dead.png")
  soldierSpawner = loadImage("assets/soldier_spawner.png")
  defenderTower = loadImage("assets/Tower_Sprite_Undamaged.png")
  mortarImage = loadImage("assets/mortar_strike.png")
  explosionImage = loadImage("assets/explosion_32.png")
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

  towerOb= new DefenderTower()
  towerOb.x = 115, towerOb.y = 380
  // arrays for towers and attackers
  towers = []
  attackers = []
  soldiers = []
  children = []
  // spawnIntervals =  []
  towerAttackers = []

}

function draw() {

  // menus
  if (!music.isPlaying()) {
    music.play();
  }
  // Highlight buttons 
  if (scene == 0) {
    background(menu);

    if (mouseX > 290 && mouseX < 503 && mouseY > 151 && mouseY < 192 ) {
      cursor(HAND);
    }
    else if (mouseX > 293 && mouseX < 507 && mouseY > 227 && mouseY < 268) {
      cursor(HAND);
    }

    else if (mouseX > 291 && mouseX < 507 && mouseY > 306 && mouseY < 346) {
      cursor(HAND);
    }
    else{
      cursor(ARROW)
    }

  }

  else if (scene == 1) {
    background(htp1);

    if (mouseX > 1480 && mouseX < 1905 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    }
    else if (mouseX > 65 && mouseX < 490 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    }
    else {
      cursor(ARROW);
    }
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
    // for(i=0; i<mapOb.wayPoints[0].length; i++){
    //   ellipse(mapOb.wayPoints[1][i][0], mapOb.wayPoints[1][i][1], 1)
    // }
    // for(i=0; i<mapOb.placements.length; i++){
    //   ellipse(mapOb.placements[i][0], mapOb.placements[i][1], 1)
    // }
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
    else if(mouseX > 655 && mouseX < 695 && mouseY > 376 && mouseY < 425 && !mortarCoolDown){
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
    // fill("blue")
    image(soldierSpawner, 540, 380, 64, 36)
    // rect(575, 400, 20, 20)
    // fill("green")
    // ellipse(625, 400, 20)
    image(soldierImage1, 592, 380, 64, 36)
    image(mortarImage, 643, 380, 64, 36)
    // fill("purple")
    // triangle(663, 410, 690, 410, 675, 386)
    
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
      cursor("assets/soldier_spawner_32.png")
    }

    if(gameState == "stop"){
      noLoop()
      background(0)
      fill(255)
      rect(400, 200, 400, 300)
      fill(0)
      textSize(20)
      text("Enter you name", 335, 100)
      // fill(0)
      userName = createInput()
      userName.position(325, 130)
      scoreButton = createButton("Submit Score")
      scoreButton.position(360, 175)
      scoreButton.mousePressed(function(){postScore(userName.value(), gameTime); userName.remove(); scoreButton.remove(); noStroke(); rect(400, 100, 400, 50); text("Score Submited!", 340, 180)})
      playButton = createButton("Play Again")
      playButton.position(250, 300)
      playButton.mousePressed(function(){resetGame();loop();  } )
      homeButton = createButton("Go Home")
      homeButton.position(485, 300)
      homeButton.mousePressed(function (){resetGame();  scene = 0; loop();  })
  
    }

    for(i=0; i < towers.length; i++){
      if(!towers[i].dead){
        image(soldierSpawner, towers[i].x - towers[i].width/2, towers[i].y - towers[i].width/2)
        towers[i].show()
      }
    }

    for(i=0; i < children.length; i++){
      if(!children[i].dead){
        children[i].show()
        image(soldierImage1, children[i].x - children[i].width/2, children[i].y - children[i].height/2)
      }

    }

    if(gameState == "play"){
      if(mortarCoolDown == true){
        fill(25, 200)
        rect(675, 400, 40, 50)
        mortarCoolDownTimer -= 0.5
        if(mortarCoolDownTimer <= 0){
          mortarCoolDown = false
        }
      }

      

      if(canStrike){
        cursor("assets/explosion_32.png")
      }

      if(soldierCoolDown == true){
        fill(25, 200)
        rect(625, 400, 40, 50)
        soldierCoolDownTimer -=2
        if(soldierCoolDownTimer == 0){
          soldierCoolDown = false
        }
      }
      
      for(i = 0; i < attackers.length; i++){
        // call methods for living attackers
        if(!attackers[i].dead){
          image(alienImage1, attackers[i].x - attackers[i].width/2, attackers[i].y - attackers[i].height/2)
          attackers[i].show()
          if(attackers[i].mode == "passive"){
            attackers[i].move()
          }
          else{
            attackers[i].stop()
          }
          if(attackers[i].collided(towerOb.x, towerOb.y, towerOb.width, towerOb.height)){
                attackers[i].mode = "aggresive"
                towerOb.damaged(attackers[i].attack)
          }

          for(j=0; j<soldiers.length; j++){
            if(attackers[i].collided(soldiers[j].x, soldiers[j].y, soldiers[j].width, soldiers[j].height)){
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

          // navigate attacker utilizing map turn points
          for(k = 0; k < mapOb.wayPoints[0].length; k++){
            if(attackers[i].collided(mapOb.wayPoints[0][k][0], mapOb.wayPoints[0][k][1], 10)){
              // console.log("collided")
              attackers[i].dir = mapOb.wayPoints[0][k][2]
            }
          }

          for(l=0; l<children.length; l++){
            if(attackers[i].collided(children[l].x, children[l].y, children[l].width, children[l].height)){
              console.log("collided")
              attackers[i].mode = "aggresive"
              children[l].damaged(attackers[i].attack)

              // if(attackers[j].dead == true || !attackers[j]){
              //   soldiers[i].mode = "passive"
              // }
              if(children[l].dead == true){
                attackers[i].mode = "passive"
              }
            }
          }

        }
        // remove dead attacks from array
        else{
          attackers.splice(i,1)
        }
    
      }

      for(i=0; i< towerAttackers.length; i++){
        if(!towerAttackers[i].dead){
          image(towerAttackerImage1, towerAttackers[i].x - towerAttackers[i].width /2, towerAttackers[i].y - towerAttackers[i].height/2)
          towerAttackers[i].show()
          if(towerAttackers[i].mode == "passive"){
            towerAttackers[i].move()
          }
          if(towerAttackers[i].mode == "aggressive"){
            towerAttackers[i].stop()
          }
          for(j=0; j<towers.length; j++){
            if(towerAttackers[i].collided(towers[j].x, towers[j].y, 10, 10, "defender")){
              console.log("collided tower")
              towerAttackers[i].mode = "aggresive"
              towers[j].damaged(towerAttackers[i].attack)

              // if(attackers[j].dead == true || !attackers[j]){
              //   soldiers[i].mode = "passive"
              // }
              if(towers[j].dead == true){
                towerAttackers[i].mode = "passive"
              }
            }


          }

          if(towerAttackers[i].collided(towerOb.x, towerOb.y, 10, 10)){
            towerAttackers[i].mode = "aggresive"
            towerOb.damaged(towerAttackers[i].attack)
          }
                                // navigate attacker utilizing map turn points
          for(k = 0; k < mapOb.wayPoints[0].length; k++){
            if(towerAttackers[i].collided(mapOb.wayPoints[0][k][0], mapOb.wayPoints[0][k][1], 10, 10)){
              // console.log("collided")
              towerAttackers[i].dir = mapOb.wayPoints[0][k][2]
            }
          }

        }
      }
      // logical for soldiers
      for(i = 0; i < soldiers.length; i++){
        // call methods for living attackers
        if(!soldiers[i].dead){
          image(soldierImage1, soldiers[i].x - soldiers[i].width/2, soldiers[i].y - soldiers[i].height/2)
          soldiers[i].show()

          if(soldiers[i].mode == "passive"){
            soldiers[i].move()
          }
          else{
            soldiers[i].stop()
          }
          for(j=0; j<attackers.length; j++){
            if(soldiers[i].collided(attackers[j].x, attackers[j].y, attackers[j].width)){
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
          for(k=0; k<towerAttackers.length; k++){
            if(soldiers[i].collided(towerAttackers[k].x, towerAttackers[k].y, towerAttackers[k].width)){
              console.log("collided tower attacker")
              soldiers[i].mode = "aggresive"
              // attackers[j].mode = "aggresive"
              // soldiers[i].damaged(attackers[j].attack)
              towerAttackers[k].damaged(soldiers[i].attack)
              if(towerAttackers[k].dead == true){
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
          // image(soldierSpawner, mouseX, mouseY)
          // if (towers[i].childrenCooldown == true){
          //   towers[i].childrenCooldownTimer --
          //   if(towers[i].childrenCooldownTimer == 0){
          //     towers[i].childrenCooldown == false
          //   }
          // }
    
        }
        // remove dead towers from array
        else{
          clearInterval(towers[i].spawnInterval)
          mapOb.placements[towers[i].place][2] = "free"
          towers.splice(i, 1)
        }
    
      }

      for(i=0; i < children.length; i++){
        if(!children[i].dead){
          image(soldierImage1, children[i].x - children[i].width/2, children[i].y - children[i].height/2)
          for(j=0; j<attackers.length; j++){
            if(children[i].collided(attackers[j].x, attackers[j].y, attackers[j].width, 0)){
              console.log("collided")
              children[i].mode = "aggresive"
              attackers[j].damaged(children[i].attack)
              if(attackers[j].dead == true){
                children[i].mode = "passive"
              }
            }
          }

          for(k=0; k<towerAttackers.length; k++){
            if(children[i].collided(towerAttackers[k].x, towerAttackers[k].y, towerAttackers[k].width)){
              console.log("collided")
              children[i].mode = "aggresive"
              towerAttackers[k].damaged(children[i].attack)
              if(towerAttackers[k].dead == true){
                children[i].mode = "passive"
              }
            }
          }
        }
        else{
          children.splice(i, 1)
        }
      }

    }
    }


  if (scene == 5) {
    background(255)
    text(leaderboard, 300, 20)
    homeButton = createButton("Go Back")
    homeButton.position(300, 500)
    homeButton.mousePressed(function(){ removeElements(); scene = 0; leaderboard = "Leader Board\n"})
  }




}


function mousePressed(){

  console.log(mouseX, mouseY)

  // scene navigation
  if (scene == 0) {
    if (mouseX > 290 && mouseX < 503 && mouseY > 151 && mouseY < 192) {
      scene = 4;
    }
    else if (mouseX > 293 && mouseX < 507 && mouseY > 227 && mouseY < 268) {
      scene = 5
      getLeaderBoard()
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

    if(canPlace && !(mouseX > 555 && mouseX < 593 && mouseY > 376 && mouseY < 425)){
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
      else if(mouseX > 655 && mouseX < 695 && mouseY > 376 && mouseY < 425){
        if(mortarCoolDown == false){
          canStrike = true
          console.log("can strike")
          mortarCoolDown = true
          mortarCoolDownTimer = 500
        }
      }

      if(canStrike && !(mouseX > 655 && mouseX < 695 && mouseY > 376 && mouseY < 425)){
        mortorStrike()
        cursor(ARROW)
      }
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
    attackerInterval = setInterval(spawnAttacker, 7000);
    towerAttackerInterval = setInterval(spawnTowerAttacker, 9000)
    timerInterval = setInterval(updateTimer, 1000);
}

function plotDefender(){
  for(i = 0; i< mapOb.placements.length; i++){
    d = dist(mouseX, mouseY, mapOb.placements[i][0], mapOb.placements[i][1])
    if(d < 50 && mapOb.placements[i][2] == "free" ){
      defenderOb = new Defender(mapOb.placements[i][0], mapOb.placements[i][1], i)
      spawnChildren(defenderOb.place)
      towers.push(defenderOb)
      console.log("ploted")
      mapOb.placements[i][2] = "full"
      canPlace = false
      
    }
    

  }

}

function mortorStrike(){
      for(i=0; i< attackers.length; i++){
        d = dist(mouseX, mouseY, attackers[i].x, attackers[i].y)
        if(d < 100){
          attackers.splice(i, 1)
        }
      }
      for(i=0; i< towerAttackers.length; i++){
        d = dist(mouseX, mouseY, towerAttackers[i].x, towerAttackers[i].y)
        if(d < 100){
          towerAttackers.splice(i, 1)
        }
      }
      canStrike = false
}

// function coolDownHandler(time){

// }

function updateTimer(){

  gameTime++;
}

function spawnAttacker(){
  alien = new Attacker(mapOb.wayPoints[0][0][0],mapOb.wayPoints[0][0][1], "alien")

  if(gameTime >= 30 && gameTime < 60){
    alien.health += 5
    alien.attack += 0.05
  }
  else if(gameTime >= 60 && gameTime < 120){
    alien.health += 10
    alien.attack += 0.07
  }
  else if(gameTime >= 120 && gameTime < 300){
    alien.health += 11
    alien.attack += 0.09
  }
  else if(gameTime >= 300 && gameTime < 500){
    alien.health += 15
    alien.attack += 0.15
  }
  else if(gameTime >= 500){
    alien.health += 25
    alien.attack += 0.25
  }
  

  
  attackers.push(alien)
}
function spawnTowerAttacker(){
  towerAttack = new Attacker(mapOb.wayPoints[0][0][0],mapOb.wayPoints[0][0][1], "towerAttacker")

  if(gameTime >= 30 && gameTime < 60){
    towerAttack.health += 10
    towerAttack.attack += 0.12
  }
  else if(gameTime >= 60 && gameTime < 120){
    towerAttack.health += 20
    towerAttack.attack += 0.15
  }
  else if(gameTime >= 120 && gameTime < 300){
    towerAttack.health += 30
    towerAttack.attack += 0.25
  }
  else if(gameTime >= 300 && gameTime < 500){
    towerAttack.health += 40
    towerAttack.attack += 0.30
  }
  else if(gameTime >= 500){
    towerAttack.health += 50
    towerAttack.attack += 0.40
  }
  else if(gameTime > 800){
    towerAttack.health += 100
    towerAttack.attack += 0.50
  }
  
  
  towerAttackers.push(towerAttack)
}

// function doDamage(){

// }

function spawnDefender(){
  soldiers.push(new Attacker(mapOb.wayPoints[1][0][0],mapOb.wayPoints[1][0][1], "soldier"))
}

function spawnChildren(index){
  children.push(new Attacker(mapOb.placements[index][3] + Math.random()*4, mapOb.placements[index][4] + Math.random()*4, "soldier"))
  console.log("child spawned")
}

// function updateDifficulty(){
//   for(i=0; i < attackers.length; i++){
//     attackers[i].health +=10
//     attackers[i].attack += 0.05
//   }
//   for(i=0; i < towerAttackers.length; i++){
//     towerAttackers[i].health +=10
//     towerAttackers[i].attack += 0.05
//   }

// }
// Game state handlers
function resetGame(){
  mapOb = new Map("assets/tdo_background.png")
  for(i= 0; i < towers.length; i++){
    clearInterval(towers[i].spawnInterval)
  }
  towers = [];
  attackers = [];
  soldiers = [];
  children = [];
  towerAttackers = []
  towerOb= new DefenderTower();
  towerOb.x = 115, towerOb.y = 380;
  
  soldierCoolDown = false;
  soldierCoolDownTimer = 500;

  if(attackerInterval){
    clearInterval(attackerInterval)
  }
  if(timerInterval){
    clearInterval(timerInterval)
  }

  if(towerAttackerInterval){
    clearInterval(towerAttackerInterval)
  }


  
  defenderCoolDown = false;
  defenderCoolDownTimer = 500;
  mortarCoolDown = false;
  defenderCoolDownTimer = 500
  canPlace = false;
  canStrike = false;

  if(gameState == "stop"){
    removeElements();
    gameState ="wait"
    gameTime = 0;
  }
  if(gameState == "play"){
    gameState = "stop"
  }

}

function reSetup(){
    if(attackerInterval){
      attackerInterval = setInterval(spawnAttacker, 7000)
    }
    if(towerAttackerInterval){
      towerAttackerInterval = setInterval(spawnTowerAttacker, 9000)
    }
    
    clearInterval(timerInterval)
    timerInterval = setInterval(updateTimer, 1000)
    gameTime = 0

}

function getLeaderBoard(){
  $.ajax({url:"/tdo/leader"}).done(function(data){
    if(data){
      for(i=0; i< data.length; i++){
        leaderboard = leaderboard + `\n${i+1}. ${data[i].user} | ${new Date(data[i].time * 1000).toISOString().substr(14, 5)}`
      }
      // leaderboard = `${data}`
    }
    else{console.log("no data")}
  })
  // console.log(leaderboard)
}

function postScore(user, time){
  console.log(user, time)
  $.ajax({url:`/tdo/post?user=${user}&time=${time}`})
}
