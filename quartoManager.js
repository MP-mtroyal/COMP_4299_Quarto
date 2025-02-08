class QuartoManager{
    constructor(agent1, agent2){
        this.agent1 = agent1;
        this.agent2 = agent2;
        this.activeAgent = agent1;


        this.gameState = QuartoGameStates.SelectPiece;

        // Registered values, for async passing of player agent values
        this.registeredPiece  = null;
        this.registeredSquare = null;

        if(!this.agent1isAI || this.agent2isAI){
            this.display = new QuartoBoard(
                createVector(100, 100),
                4, 
                230
            );
        } else {
            const padding = 50;
            this.display = new PromptDisplay(
                createVector(padding, padding),
                createVector(windowWidth - padding * 2, windowHeight - padding * 2)
            );
        }

        this.init();
    }

    init(){
        this.agent1.registerManager(this);
        this.agent2.registerManager(this);
        this.game = new QuartoGame();
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
            piece = this.activeAgent.choosePiece(this.game);
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
        console.log("GAME FINSIHED");
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