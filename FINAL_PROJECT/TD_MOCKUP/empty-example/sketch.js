class Map{
  render(){
    rect(500, 200 , 1000, 200)

  }
}

// Class for tower object
class Defender{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.width = 100;
    this.place = false
    this.health = 1000;
    this.attack = Math.floor(Math.random()*10)
    this.dead = false
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

}
// Class for Attacker object
class Attacker{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.width = 100;
    this.dx = 100;
    this.dx = 0.5;
    this.health = 750;
    this.attack = Math.floor(Math.random()*10)
    this.dead = false
    this.mode  = "passive"
  }
  // method to move attacker
  move(){
      this.x -= this.dx
  }
  stop(){
    this.x = this.x
  }
  // method to draw attack on canvas
  show(){
    fill("red");
    circle(this.x, this.y, this.width);
    fill(0, 102, 153);
    text(`${this.health}`, this.x -10, this.y - 55)
  }
  // method to take damage
  damaged(amount){
    if(this.health <= 0){
      this.dead = true
    }
    else{
      this.health -= amount
      console.log(this.health)
    }
  }
  // collision check
  collided(defender){
    if(defender){
      if(Math.round(this.x - this.width/2)  == Math.round(defender.x + defender.width/2)){
        return true
    }
    else{
      return false
    }
    }
    return false
  }

}
function setup() {

  createCanvas(1000,600);
  // towersize = 100
  rectMode(CENTER);
  ellipseMode(CENTER)
  // tower = new Tower()
  // attacker = new Attacker(500,200)
  towers = []
  attackers = []
  // towers.push(new Defender(100,200))
  attackers.push(new Attacker(500,200))
  map = new Map()

}

function draw() {
  
  background(255,217,25);  
  fill("gray")
  map.render()
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
        if(attackers[i].collided(towers[j])){
          attackers[i].mode = "aggresive"
          attackers[i].damaged(towers[j].attack)
          towers[j].damaged(attackers[i].attack)
          console.log(attackers[i].mode)
          if(towers[j].dead == true){
            attackers[i].mode = "passive"
          }
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
  towers.push(new Defender(mouseX,mouseY))
  // for(i = 0; i < towers.length; i++){
  //   towers[i].x = mouseX
  //   towers[i].y = mouseY
  // }

}
