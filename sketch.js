//guarda en la memoria
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, Game_Over, restart;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, gameOver, restart1, JumpSound, dieSound, chekSound;

var score;

//precarga las cosas
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  Game_Over = loadImage("gameOver.png");
  restart = loadImage("restart.png");
  
  JumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  chekSound = loadSound("checkPoint.mp3");
}

//es la configuracion
function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50, height-100);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("stop" , trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-18,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width,height-150, 20,20);
  gameOver.addImage(Game_Over)
  
   restart1 = createSprite(width,height-90, 20,20);
  restart1.addImage(restart)
  restart1.scale = 0.5
  
  
  invisibleGround = createSprite(width/2,height-8,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
 // console.log("Hello" + 5);
  
  trex.setCollider("circle",5,0,40);
  trex.debug = false;
  
  score = 0
  
  var mensaje = "este es un mensaje";
 console.log(mensaje);
}

//muestra lo que pasa
function draw() {
  background("white");
  
  if (mousePressedOver(restart1) && gameState === END){
  Reset();
  }
  
  //displaying score
  text("Score: "+ score, 500,50);
  
  //console.log("this is ",gameState)
 
  
  
  if(gameState === PLAY){
    gameOver.visible = false;
  restart1.visible = false;
    
    //move the ground
    ground.velocityX = -(4 + score / 100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score > 0 && score % 100 === 0){
      chekSound.play();
    }
      
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(touches.length > 0 || keyDown("space")&& trex.y >=height-50) {
        trex.velocityY = -13;
      JumpSound.play();
      touches=[];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      dieSound.play();   
      gameState = END;
      //trex.velocityY = -10;
      //JumpSound.play();
    }
  }
   else if (gameState === END) {
     ground.velocityX = 0;
     trex.changeAnimation("stop", trex_collided)
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     cloudsGroup.setLifetimeEach(-9);
     obstaclesGroup.setLifetimeEach(-9);
     trex.velocityY = 0;
     gameOver.visible = true;
     restart1.visible = true
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

//crea los obstaculos
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-36,10,40);
   obstacle.velocityX = -(4 + score / 100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}
//crea las nubes

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(width,height,40,10);
    cloud.y = Math.round(random(width,height-150));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 220;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function Reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart1.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running)
  score = 0;
}