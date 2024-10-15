class Raster {
  constructor(r,k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }
  
  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }
  
  teken() {
    push();
    noFill();
    stroke('grey');
    for (var rij = 0;rij < this.aantalRijen;rij++) {
      for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
        rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
      }
    }
    pop();
  }
}

class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
  }
  
  beweeg() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }
    
    this.x = constrain(this.x,0,canvas.width);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }
  
  gehaald() {
    if (this.x == canvas.width) {
      background('green');
      fill('white');
      textSize(90);
      text("Je hebt gewonnen!",30,300);
      noLoop();
    }
    else if (this.levens == 0) {
      background('red');
      fill('white');
      textSize(65);
      text("Je hebt niet gewonnen ):",30,300);
      noLoop();
    }
  }
  
  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      this.levens -= 1;
      }
  }
  
  eetAppel(appel) {
    if (this.x == appel.x && this.y == appel.y && !appel.opgegeten) {
      appel.opgegeten = true;
      this.levens += 1;
    }
  }
  
  toon() {
    image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}  

class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;

    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }
  
  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}

class AppelStil {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.opgegeten = false;
  }
  
  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte)
  }
}

function preload() {
  brug = loadImage('images/backgrounds/dame_op_brug_1800.jpg');
}

function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont('Verdana');
  textSize(20);
  
  raster = new Raster(12,18);
  
  raster.berekenCelGrootte();
  
  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage('images/sprites/Eve100px/Eve_' + b + '.png');
    eve.animatie.push(frameEve);
  }
  eve.levens = 1;
  
  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage('images/sprites/Alice100px/Alice.png');

  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage('images/sprites/Bob100px/Bob.png');
  
  // 50 is celgrootte bij 18 kolommen, 12 is aantal rijen, 18 is aantal kolommen
  rodeAppel = new AppelStil(50 * Math.floor(Math.random() * 18),50 * Math.floor(Math.random() * 12));
  rodeAppel.sprite = loadImage('images/sprites/appel_2.png')
}

function draw() {
  background(brug);
  raster.teken();
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  
  eve.eetAppel(rodeAppel);
  if (!rodeAppel.opgegeten) {
    rodeAppel.toon(); 
  }
   
  color('black');
  textSize(20);
  text('Levens: ' + eve.levens, 0, 20);
  
  eve.wordtGeraakt(alice);
  eve.wordtGeraakt(bob);
  eve.gehaald();
}
