class QuartoAI{
    constructor(){
        this.mngr = null;
    }

    registerManager(mngr){this.mngr = mngr;}
    log(s){this.mngr.log(s);}

    //========= Must be implemted for all QuartoAI subclasses
    // Input:
    //      game (QuartoGame): An instance of the QuartoGame object from which
    //                      to choose a piece from
    // Returns piece (int) must return an integer corrisponding to a valid 
    //              remaining piece in the given game
    choosePiece(game){

    }

    //======= Must be implemted for all QuartoAI subclasses
    // Input:
    //      game (QuartoGame): An instance of the QuartoGame object from which
    //                      to choose a piece from
    // Returns square (p5.vector2d) must return a vector corrisponding to a valid 
    //              empty square index from the current game
    //              Use createVector(x,y) to create a p5.vector2d.
    chooseSquare(game){
        
    }
}