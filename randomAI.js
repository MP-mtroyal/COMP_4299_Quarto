class RandomAI extends QuartoAI{
    constructor(){
        super();
    }

    //Randomly choose an avaliable piece
    choosePiece(game){
        this.log("Random AI choosing piece");
        let remPieces = game.getRemainingPieces();
        if(remPieces.length > 0)
            return remPieces[Math.floor(Math.random() * remPieces.length)];
        else 
            return null;
    }

    //Randomly choose an avaliable square.
    chooseSquare(game){
        this.log("Random AI choosing square");
        let emptySquares = game.getEmptySquares();
        if(emptySquares.length > 0)
            return emptySquares[Math.floor(Math.random() * emptySquares.length)];
        else
            return null;
    }
}