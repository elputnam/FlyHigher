// Failure to Load: another set of wings

//photos
let base;
let wings1
let wings2;
let EL1;
let EL2;
let Laurel1;
let Laurel2;
let sil = [];
let shadows = [];

let alp1 = 0;
let alp2 = 0;

// Tiles configuration
let tiles = [];
let cols = 20;
let rows = 20;
let w, h;

// Order of tiles
let board = [];

//CCapture
// var capture = false; // default is to not capture frames, can be changed with button in browser
var capturer = new CCapture({
  format:'webm', 
  workersPath: 'js/',
  framerate: 5
});

function preload(){
  base =loadImage('assets/FlyHigher_base.png');
  wings1 = loadImage('assets/FlyHigher_wings1.png');
  wings2 = loadImage('assets/FlyHigher_wings2.png');
  // EL1 = loadImage('assets/FlyHigher_EL1.png');
  // EL2 = loadImage('assets/FlyHigher_EL2.png');
  // Laurel1 = loadImage('assets/FlyHigher_Laurel1.png');
  // Laurel2 = loadImage('assets/FlyHigher_Laurel2.png');
  for (let i = 1; i < 5; i++){
    sil[i] = loadImage('assets/FlyHigher_sil' + i + '.png');
  }
}
function setup() {
  createCanvas(base.width, base.height);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  frameRate(5);
  rectMode(CENTER);
  // Array of shadows
  for (let k = 1; k < sil.length; k++){
    let images = new Shadow(random(width*.3), random(5,50), random(360), sil[k]);
    shadows.push(images);
  }

  // pixel dimensions of each tiles
  w = width / cols;
  h = height / rows;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      let img = createImage(w, h);
      img.copy(base, x, y, w, h, 0, 0, w, h);
      let index = i + j * cols;
      board.push(index);
      let tile = new Tile(index, img);
      tiles.push(tile);
    }
  }
}

function draw() {
  if (frameCount==1) capturer.start();
  background(random(360), 100, 100);

  //base
  push();
  tint(255, random(70, 100));
  image(base, 0, 0, width, height);
  pop();

  //wings
  push();
  tint(random(50,255), 100);
  wings1.filter(GRAY);
  image(wings1, 0, 0);
  pop()

   
  
  blend(wings2, 0, 0, wings2.width, wings2.height, 0, 0, width, height, DIFFERENCE);

 



  //feather Shuffle
 push();
 for (let i = 0; i < cols; i++) {
   for (let j = 0; j < rows; j++) {
     let index = int(random(16));
     let x = i * w;
     let y = j * h;
     let tileIndex = board[index];
     if (tileIndex > -1) {
       tint(random(255), alp1);
       let img = tiles
       [tileIndex].img;
       img.filter(INVERT);
       image(img, x, y, w, h);
     }
   }
 }
 pop();

//shadows
  
for (let j = 0; j < shadows.length; j++){
    
    
  shadows[j].edges();
  shadows[j].move();
  shadows[j].show();
  
}
  
 //sils
//  for (let i = 1; i < sil.length; i++){
  
  
  let p = int(random(1,5));
  //sil[p].filter(INVERT);
  for (let j = 0; j < 4; j++){
  push();
  tint(0, alp2);
  image(sil[p], random(100, width*.5), 0)
  pop();
  }

  
//  }




  if (frameCount%int(random(20))==0){    
    if (alp1 == 0){
      alp1 = 100;
      alp2 = 90
    } else {
        alp1 = 0;
        alp2 = 0;
      }
    }

    capturer.capture(document.getElementById('defaultCanvas0'));  
    if (frameCount==1500){
      save_record();
    }
    print(frameCount);
}

class Tile {
  constructor(i, img) {
    this.index = i;
    this.img = img;    
  }
}

class Shadow{
  constructor(x, inc, colour, silImg) {
    this.x = x;
    this.inc = inc;
    this.sil = silImg;
    this.colour = colour;
  }
  move(){
    this.x += this.inc;
  }

  edges(){
    if (this.x >= (width - this.sil.width) || this.x <= 0 ){
      this.inc *= -1;
    }
  }
  show(){
    tint(this.colour, 100, 100);
    //image(this.sil, this.x, 0);
    blend(this.sil, 0, 0, this.sil.width, this.sil.height, this.x, 0, this.sil.width, this.sil.height, EXCLUSION);
    if (frameCount%10==0){
      this.colour = random(360);
    }
  }
}

function save_record() {
  capturer.save();
}