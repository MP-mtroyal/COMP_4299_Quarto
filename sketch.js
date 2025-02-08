
let game;
let bgColor;
let renderGame = true;
let promptDisplay;

let gameManager;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(180, 210, 200);

  let agent1 = new PlayerAgent();
  let agent2 = new PlayerAgent();

  gameManager = new QuartoManager(agent1, agent2);

  /*
  if (renderGame){
    game = new QuartoGame(
      new QuartoBoard(
        createVector(100, 100), 4, 230
      ),
      true
    );
  } else {
    promptDisplay = new PromptDisplay(
      createVector(50, 50),
      createVector(windowWidth - 100, windowHeight -100)
    );
  }
    */
}

function draw() {
  background(bgColor);
  gameManager.render(getMousePos());
  /*
  if(renderGame)
    game.render(getMousePos());
  else{
    promptDisplay.render();
  }
    */
}

function getMousePos(){
  return createVector(
    mouseX,
    mouseY
  );
}

function mouseClicked(){
  gameManager.click(getMousePos());
  /*
  if(renderGame)
    game.click(getMousePos());
  */
}
