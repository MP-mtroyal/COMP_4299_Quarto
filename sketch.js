
let game;
let bgColor;
let renderGame = true;

let gameManager;

//Init function, called once on initialization
function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(180, 210, 200);

  //let agent1 = new PlayerAgent();
  let agent1 = new RandomAI();
  let agent2 = new PlayerAgent();
  //let agent2 = new RandomAI();

  gameManager = new QuartoManager(agent1, agent2);
}

//Update function, called once per frame
function draw() {
  background(bgColor);
  gameManager.render(getMousePos());
}

function getMousePos(){
  return createVector(
    mouseX,
    mouseY
  );
}

//Called when any mouse button is clicked
function mouseClicked(){
  gameManager.click(getMousePos());
}
