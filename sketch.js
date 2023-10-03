var game = "play";

var trex, trex_running, trex_collided, dark_jumpingIMG, dark_jumping;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound,music

function preload(){
  trex_running = loadAnimation("dark1.png","dark3.png","dark2.png","dark4.png");
  trex_collided = loadAnimation("die.png");
  dark_jumpingIMG = loadAnimation("jump.png")
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloudy.png");
  
  tentacle = loadAnimation("tentacle1.png","tentacle2.png","tentacle3.png","tentacle4.png","tentacle5.png","tentacle6.png","tentacle7.png","tentacle8.png","tentacle9.png","tentacle10.png","tentacle11.png");
  //tentacle = loadAnimation("tentacle.gif")

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  music=loadSound("music.wav")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  trex.addAnimation("jump",dark_jumpingIMG);

  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false
  
  score = 0;
  music.play();
}

function draw() {
  
  background(180);
  //exibindo pontuação
  text("Score: "+ score, 500,50);
  

  
  if(game == "play"){
    

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //pontuação
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if(trex.y<100){
      trex.changeAnimation("walk",trex_running);
    }
    
    if(trex.isTouching(ground)){
      trex.changeAnimation("walk", trex_running);
    }

    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
        trex.changeAnimation("jump", dark_jumping);
    }



    trex.velocityY = trex.velocityY + 0.8
  
    spawnClouds();
  
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        game = "end";
        dieSound.play()
      
    }
  }
   else if (game == "end") {
      gameOver.visible = true;
      restart.visible = true;
     
     //mudar a animação do trex
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
   trex.collide(invisibleGround);

  if(  trex.isTouching(invisibleGround)){
    trex.changeAnimation("running",trex_running)
  }
  
  if(mousePressedOver(restart)) {
      reset();
    }

  drawSprites();
}

//           (@^@)
function reset(){
  game="play";
  gameOver.visible=false;
  restart.visible=false;
  score=0;   // (T_T)
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("walk",trex_running)
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   obstacle.addAnimation("tentacle",tentacle)   
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribua tempo de vida à variável
    cloud.lifetime = 200;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicione cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }
}

