class QuartoManager{
    constructor(agent1, agent2){
        this.agent1 = agent1;
        this.agent2 = agent2;
        this.firstInit = true;

        if(!this.agentIsAI(agent1) || !this.agentIsAI(agent2)){
            this.display = new QuartoBoard(
                createVector(100, 100),
                4, 
                140
            );
        } else {
            const padding = 50;
            this.display = new PromptDisplay(
                createVector(padding, padding),
                createVector(windowWidth - padding * 2, windowHeight - padding * 2),
                125,
                25,
                16
            );
        }

        this.init();
    }

    init(){
        this.agent1.registerManager(this);
        this.agent2.registerManager(this);
        // Registered values, for async passing of player agent values
        this.registeredPiece  = null;
        this.registeredSquare = null;
        
        this.gameState = QuartoGameStates.SelectPiece;

        this.activeAgent = this.agent2;

        this.game = new QuartoGame();
        //Pause required on first initialization to ensure DOM loading properly.
        if(this.firstInit){
            setTimeout(() => {
                this.firstInit = false;
                this.gamePhaseSelectPiece();
            }, 500);
        } else {
            this.gamePhaseSelectPiece();
        }
    }

    log(s){
        this.display.log(s);
    }

    swapTurn(){this.activeAgent = this.activeAgent == this.agent1 ? this.agent2 : this.agent1;}

    render(mousePos){
        this.display.render(mousePos, this.game);
    }

    agentIsAI(agent){return agent instanceof QuartoAI;}

    gameStart(){

    }

    gamePhaseSelectPiece(){
        let pieceSelectSuccess = false;
        if(this.agentIsAI(this.activeAgent)){
            const piece = this.activeAgent.choosePiece(this.game);
            pieceSelectSuccess = this.game.selectPiece(piece);
        } else if (this.registeredPiece != null) {
            pieceSelectSuccess = this.game.selectPiece(this.registeredPiece);
            this.registeredPiece = null;
        }

        if(pieceSelectSuccess){
            this.swapTurn();
            this.gameState = QuartoGameStates.PlacePiece;
            this.gamePhasePlacePiece();
        }
    }

    gamePhasePlacePiece(){
        let piecePlaceSuccess = false;
        if(this.agentIsAI(this.activeAgent)){
            const square = this.activeAgent.chooseSquare(this.game);
            if (square == null){console.log("AI Failed to place piece");}
            else{
                piecePlaceSuccess = this.game.placeSelectedPiece(square.x, square.y);
            }
        } else if (this.registeredSquare != null){
            piecePlaceSuccess = this.game.placeSelectedPiece(this.registeredSquare.x, this.registeredSquare.y);
            this.registeredSquare = null;
        }

        if(piecePlaceSuccess){
            if(this.game.checkWin()){this.gameEnd();}
            else {
                this.gameState = QuartoGameStates.SelectPiece;
                this.gamePhaseSelectPiece();
            }
        }
    }

    playerRegisterPiece(player, piece){
        if(this.gameState != QuartoGameStates.SelectPiece){return;}
        if(this.activeAgent != player){return;}
        this.registeredPiece = piece;
        this.gamePhaseSelectPiece();
    }

    playerRegisterSquare(player, square){
        if(this.gameState != QuartoGameStates.PlacePiece){return;}
        if(this.activeAgent != player){return;}
        this.registeredSquare = square;
        this.gamePhasePlacePiece();
    }

    gameEnd(){
        console.log("GAME END");
        let message = "Game over! Player ";
        if(this.activeAgent == this.agent1){message += "1";}
        else{message += "2";}
        message += " wins!";
        this.log(message);
        if(!this.agentIsAI(this.agent1) || !this.agentIsAI(this.agent2)){
            //Wait 2.5 seconds before starting new game
            setTimeout(() => {
                this.init();
            }, 2500);
        } else {
            this.init();
        }
    }

    click(mousePos){
        if(!this.agentIsAI(this.activeAgent)){
            let hoveredPiece  = this.display.getHoveredPiece(mousePos, this.game);
            let hoveredSquare = this.display.getHoveredSquare(mousePos, this.game);
            switch(this.gameState){
                case QuartoGameStates.SelectPiece:
                    if(hoveredPiece != null)
                        this.playerRegisterPiece(this.activeAgent, hoveredPiece.val);
                    break;
                case QuartoGameStates.PlacePiece:
                    if(hoveredSquare != null)
                        this.playerRegisterSquare(this.activeAgent, hoveredSquare);
                    break;
            }
        }
    }
}

const QuartoGameStates = {
    SelectPiece: "SelectPiece",
    PlacePiece: "PlacePiece"
};