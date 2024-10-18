// Waarom is dit niet gewoon een object? Geen idee! Vraag het aan fundament (:
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

// Maakt class bommen waarbij de sprite en bewegingssnelheid onbekend is
class Bommen {
  constructor() {
    this.x = 50*floor(random(10,18));
    this.y = 50*floor(random()*12);;
    this.sprite = null;
    this.geraakt = false;
    // beweegsnelheid
    this.beweegY = null;
  }

  //  Functie die de bommen op en neer beweegt binnen het raster
  beweeg() {
    if(this.y == canvas.height-raster.celGrootte || this.y ==0) {
      this.beweegY = -1*this.beweegY
    }

    this.y += this.beweegY*raster.celGrootte;

    // Zorgt ervoor dat de bommen niet buiten de randen gaan
    // Ook als de snelheid ervoor zou zorgen dat dit wel gebeurt
    this.y = constrain(this.y,0,canvas.height-raster.celGrootte)
  }

  // Functie om de bom te tekenen
  toon() {
    image(this.sprite,this.x,this.y,50, 50);
  }
}

// Waarom is dit een class en geen object? Geen idee! Vraag het aan fundament :)
class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
  }

  // Bepaalt de beweging van Jos voor de knop die wordt ingedrukt
  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x,0,canvas.width);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }

  // Deze functie kijkt of de win of verlies condities worden voldaan en laat de corresponderende eindschermen zien
  gehaald() {
    if (this.x == canvas.width) {
      background('green');
      fill('white');
      textSize(90);
      text("Je hebt gewonnen!",30,300);
      textSize(40);
      text('Score: ' + eve.score,375,375);
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

  // Kijkt of Jos wordt geraakt door een vijand en vermindert het aantal levensa als Jos geraakt wordt
  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      this.levens -= 1;
      }
  }

  // Kijkt of Jos wordt geraakt door een bom en vermindert het aantal levens en verwijdert de bom als Jos geraakt wordt
  bomGeraakt(bom) {
    if (this.x == bom.x && this.y == bom.y && !bom.geraakt) {
      bom.geraakt = true;
      this.levens -= 1;
      }
  }

  // Deze functie kijkt of Jos met een appel overlapt en of die appel al opgegeten is om te kijken of er wel of niet een extra leven toegevoegd moet worden
  eetAppel(appel) {
    if (this.x == appel.x && this.y == appel.y && !appel.opgegeten) {
      appel.opgegeten = true;
      this.levens += 1;
    }
  }

  // Deze functie kijkt of Jos de munt kan oppaken, als de munt wordt opgepakt gaat de score met 1 omhoog en wordt de munt op een willekeurige nieuwe positie geplaatst
  muntOppakken(munt) {
    if (this.x == munt.x && this.y == munt.y) {
      this.score += 1;
      munt.x = raster.celGrootte * floor(random() * raster.aantalKolommen);
      munt.y = raster.celGrootte * floor(random() * raster.aantalRijen);
    }
  }

  toon() {
    image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}  

// Deze class maakt vijanden
class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  // Beweegt de vijanden met een random afstand en richting
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

// Dit object is een appel die bij opeten een extra leven geeft
var rodeAppel = {
  x : null,
  y : null,
  sprite : null,
  opgegeten : false,

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte)
  }
};

// Dit object is een appel die rondstuitert en  bij het opeten een extra leven geeft
var groeneAppel = {
    x : null,
    y : null,
    sprite : null,
    opgegeten : false,
    richtingX : 1,
    richtingY : 1,

  // Deze functie beweegt de appel en houdt hem binnen het canvas
  beweeg() {
    // Deze if statements kijken of de appel de rand van het scherm aanraakt om de richting te veranderen als dat zo is
    if (this.x == 0) {
      this.richtingX = 1;
    }
    else if (this.x == canvas.width - raster.celGrootte) {
      this.richtingX = -1;
    }

    if (this.y == 0) {
      this.richtingY = 1;
    }
    else if (this.y == canvas.height - raster.celGrootte) {
      this.richtingY = -1;
    }
    
    this.x += this.richtingX * raster.celGrootte;
    this.y += this.richtingY * raster.celGrootte;
  },

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
};

// Creëert een munt in het spel
var munt = {
  x : null,
  y : null,
  sprite : null,

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte)
  }
};

// Deze class maakt de oranje rechthoeken op het scherm
class RechtHoek {
  constructor(x,y,hoogte,breedte) {
    this.x = x;
    this.y = y;
    this.hoogte = hoogte;
    this.breedte = breedte;
  }

  toon() {
    rect(this.x,this.y,this.breedte,this.hoogte);
  }
}

// Laad de achtergronden in
function preload() {
  landschap = loadImage('images/backgrounds/landschap.jpg');
  gans = loadImage('images/backgrounds/goose.jpg')
}

function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont('Verdana');
  textSize(20);

  // Maakt een raster en berekent de celgrootte
  raster = new Raster(12,18);
  raster.berekenCelGrootte();

  // Kiest een willekeurige positie voor de oranje rij en kolom
  oranjeRij = new RechtHoek(0,raster.celGrootte * floor(random() * raster.aantalRijen),raster.celGrootte,canvas.width);
  oranjeKolom = new RechtHoek(raster.celGrootte * floor(random() * raster.aantalKolommen),0,canvas.height,raster.celGrootte);

  // Maakt een instantie van de class Jos genaamt eve en geeft eve een berekent een paar belangrijke atributen
  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage('images/sprites/Eve100px/Eve_' + b + '.png');
    eve.animatie.push(frameEve);
  }
  eve.levens = 1;
  eve.score = 0;

  // Creëert 5 bommen en zet deze in een lijst genaamd 'bommen'
  bommen = [];
  bom1  = append(bommen, new Bommen())
  bom2  = append(bommen, new Bommen())
  bom3  = append(bommen, new Bommen())
  bom4  = append(bommen, new Bommen())
  bom5  = append(bommen, new Bommen())
  // Geeft elke bom in de lijst bommen een sprite en allemaal een verschillende snelheid
  for(var bom = 0;bom < bommen.length;bom++) {
    bommen[bom].sprite = loadImage('images/sprites/bom_100px.png');
    bommen[bom].beweegY = bom+1;
  }

  // Maakt een instantie van de class vijand genaamd alice en berekent de shelnheid
  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage('images/sprites/Alice100px/Alice.png');

  // Maakt een instantie van de class vijand genaamd bob en berekent de snelheid
  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage('images/sprites/Bob100px/Bob.png');

  // Maakt een instantie van de class vijand genaamd bob en berekent een willekeurige snelheid
  greg = new Vijand(100,300);
  greg.stapGrootte = floor(random(1,4)) * eve.stapGrootte;
  greg.sprite = loadImage('images/sprites/ninja2.png');

  // Berekent de start coördinaten en bepaalt de sprite voor de rode appel
  rodeAppel.x = raster.celGrootte * floor(random() * raster.aantalKolommen);
  rodeAppel.y = raster.celGrootte * floor(random() * raster.aantalRijen);
  rodeAppel.sprite = loadImage('images/sprites/appel_2.png');

  // Bepaalt de start coördinaten van de groene appel en geeft een sprite eraan
  groeneAppel.x = raster.celGrootte * floor(random() * raster.aantalKolommen);
  groeneAppel.y = raster.celGrootte * floor(random() * raster.aantalRijen);
  groeneAppel.sprite = loadImage('images/sprites/appel_1.png');

  // Bepaalt welke coördinaten de munt heeft en geeft de munt een sprite
  munt.x = raster.celGrootte * floor(random() * raster.aantalKolommen);
  munt.y = raster.celGrootte * floor(random() * raster.aantalRijen);
  munt.sprite = loadImage('images/sprites/coin.gif');
}

function draw() {
  background(landschap);

  // Maakt de oranje lijnen in het raster
  noStroke();
  fill('orange');
  oranjeRij.toon();  
  oranjeKolom.toon();
  if (oranjeRij.y <= mouseY && mouseY <= (oranjeRij.y + raster.celGrootte)) {
    background(gans);
  }
  if (oranjeKolom.x <= mouseX && mouseX <= (oranjeKolom.x + raster.celGrootte)) {
    background(gans);
  }

  // Toont en beweegt alle benodigdheden voor het spel
  raster.teken();
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  for(var i = 0;i < bommen.length;i++) {
    bommen[i].beweeg();
    if(bommen[i].geraakt == false) {
      bommen[i].toon();
    }
  }

  // Toont de rode appel alleen als hij niet is opgegeten
  eve.eetAppel(rodeAppel);
  if (!rodeAppel.opgegeten) {
    rodeAppel.toon(); 
  }

  // Toont de groene appel alleen als hij niet is opgegeten
  eve.eetAppel(groeneAppel);
  if (!groeneAppel.opgegeten) {
    groeneAppel.beweeg();
    groeneAppel.toon(); 
  }

  // Kijkt of de munt wordt opgepakt en toont de munt
  eve.muntOppakken(munt);
  munt.toon();

  // Toont greg als de speler 10 of meer punten heeft
  if (eve.score >= 10) {
    greg.beweeg();
    greg.toon();
    eve.wordtGeraakt(greg);
  }

  // Toont de score en de levens
  fill('black');
  textSize(20);
  text('Levens: ' + eve.levens, 0, 20);
  text('Score: ' + eve.score, 0,40);

  // Checkt of de speler een leven verliest door een bom of een vijand te raken
  eve.wordtGeraakt(alice);
  eve.wordtGeraakt(bob);
  for(var i = 0;i < bommen.length;i++) {
    eve.bomGeraakt(bommen[i]);
  }

  // Checkt of eve het einde heeft gehaald
  eve.gehaald();
}
