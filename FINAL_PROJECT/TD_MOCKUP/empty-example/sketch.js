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
// Class for tower object
class Defender{
  constructor(x, y, place){
    this.x = x;
    this.y = y;
    this.width = 60;
    this.place = place;
    this.health = 200;
    this.attack = Math.floor(Math.random()*10)
    this.dead = false
    this.shape;
    this.children;
  }
  show(){
    fill("blue")
    rect(this.x, this.y, this.width, this.width)
    fill(0, 102, 153);
    text(`${this.health}`, this.x -10, this.y - 55)
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
    this.dx = 2;
    this.dy = 2;
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
    text(`${this.health}`, this.x -10, this.y - 55);
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

canvasWidth = 800;
canvasHeight = 450;

function preload() {
  mapOb = new Map("assets\\main_background.png")
  backgroundMap = loadImage(mapOb.imagePath)
}

function setup() {

  createCanvas(canvasWidth,canvasHeight);
  rectMode(CENTER);
  ellipseMode(CENTER);

  // map object with waypoints for attacker navigation
  mapOb.wayPoints.push([700, 0, "down"],[700, 290, "left"], [310, 280, "up"],[310, 90, "left"],[115, 95, "down"], [115, 400])
  mapOb.placements.push([760, 155, "free"], [568, 225, "free"], [370, 225, "free"], [203, 35, "free"], [205, 200, "free"], [40, 136, "free"], [40, 273, "free"])
  
  // arrays for towers and attackers
  towers = []
  attackers = []
  attackers.push(new Attacker(mapOb.wayPoints[0][0],mapOb.wayPoints[0][1]))

  setInterval(coolDown, 4000)

}

function draw() {

  image(backgroundMap, 0, 0 , canvasWidth, canvasHeight)

  text("1",700, 10)
  text("2", 700, 290)
  text("3", 310, 280)
  text("4", 300, 90)

  text("x1",760, 155)
  text("x2", 568, 225)
  text("x3", 370, 225)
  text("x4", 203, 35)
  text("x5", 205, 200)
  text("x6", 40, 136)
  text("x7", 40, 273)



  ellipse(115, 95, 10, 10)
  ellipse(100, 400, 10, 10)
  // ellipse(760, 275, 20, 20)
  // ellipse(555, 275, 20, 20)

  for(i = 0; i < attackers.length; i++){

    if(!attackers[i].dead){
      attackers[i].show()
      if(attackers[i].mode == "passive"){
        attackers[i].move()
      }
      else{
        attackers[i].stop()
      }
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
      for(k = 0; k< mapOb.wayPoints.length; k++){
        if(attackers[i].collided(mapOb.wayPoints[k][0], mapOb.wayPoints[k][1], 10)){
          attackers[i].dir = mapOb.wayPoints[k][2]
        }
      }
    }

    else{
      attackers.splice(i)
    }

  }

  for(i = 0; i < towers.length; i++){

    if(!towers[i].dead){
      towers[i].show()

    }
    else{
      towers.splice(i)
    }

  }
}


function mousePressed(){
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
    towers[i].spawnChildren()
    console.log("spawned")
  }
}