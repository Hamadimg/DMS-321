// Class for map object
class Map{
  constructor(path){
    this.path = path
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
  constructor(x, y, w, place){
    this.x = x;
    this.y = y;
    this.width = w;
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
    setTimeout(console.log("sleeping"), 100000)
    var yPos = this.y + 100
    this.children = new Defender(this.x, yPos, 50)
    this.children.health = 100
    this.children.show()
  }

}
// Class for Attacker object
class Attacker{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.width = 50;
    this.dx = 0.5;
    this.dy = 0.5;
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
      console.log(this.health)
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
  backgroundMap = loadImage(mapOb.path)
}

function setup() {

  createCanvas(canvasWidth,canvasHeight);
  rectMode(CENTER);
  ellipseMode(CENTER);

  // map object with waypoints for attacker navigation
  mapOb.wayPoints.push([900, 120, "down"],[900, 400, "left"], [430, 400, "up"],[430, 200, "left"],[180, 200, "down"], [180, 500])
  mapOb.placements.push([760, 275, "free"], [555, 275, "free"])
  
  // arrays for towers and attackers
  towers = []
  attackers = []
  attackers.push(new Attacker(mapOb.wayPoints[0][0],mapOb.wayPoints[0][1]))

}

function draw() {

  image(backgroundMap, 0, 0 , canvasWidth, canvasHeight)

  ellipse(900, 120, 20, 20)
  ellipse(900, 400, 20, 20)
  ellipse(430, 400, 20, 20)
  ellipse(430, 200, 20, 20)
  ellipse(180, 200, 20, 20)
  ellipse(180, 500, 20, 20)

  ellipse(760, 275, 20, 20)
  ellipse(555, 275, 20, 20)

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
          console.log(i, k)
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
      towers.push(new Defender(mapOb.placements[i][0], mapOb.placements[i][1], 100, i))
      console.log("ploted")
      
      mapOb.placements[i][2] = "full"
    }
    

  }

  // for(i = 0; i < towers.length; i++){
  //   towers[i].x = mouseX
  //   towers[i].y = mouseY
  // }

}
