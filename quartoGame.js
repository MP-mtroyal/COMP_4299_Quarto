/*  QuartoGame
The skelton of a quarto game. Contains information about the game state
As well as methods for retrieving game data safely. 
Logs history as a series of moves at indices, so game can be repeated.
*/
class QuartoGame{
    constructor(size=4){
        this.size = createVector(size, size);
        this.selectedPiece = null;

        this.init();
    }

    init(){
        this.boardPieces = [];
        this.remainingPieces = [];
        this.history = [];

        for (let y=0; y<this.size.y; y++){
            let row = [];
            for (let x=0; x<this.size.x; x++){
                row.push(-1);
            }
            this.boardPieces.push(row)
        }
        for (let y=0; y<this.size.y; y++){
            for (let x=0; x<this.size.x; x++){
                this.remainingPieces.push(x + y * this.size.x);
            }
        }
    }
    //Returns an integer array of pieces avaliable to be picked from.
    getRemainingPieces(){
        let result = [];
        for(let i=0; i<this.remainingPieces.length; i++){result.push(this.remainingPieces[i]);}
        return result;
    }

    //Returns an array of p5.vector2d corrisponding to empty squares on the board.
    getEmptySquares(){
        let emptySquares = [];
        for(let y=0; y<this.boardPieces.length; y++){
            for(let x=0; x<this.boardPieces[0].length; x++){
                if(this.boardPieces[y][x] < 0){
                    emptySquares.push(createVector(x, y));
                }
            }
        }
        return emptySquares;
    }

    //Retrieves game history as a string.
    // format is as follows
    // pieceValue,xIndex,yIndex \n
    //TODO: Implement this.
    getHistory(){

    }
    //Stores a piece placement in history.
    logHistory(x, y, piece){
        this.history.push([x,y,piece])
    }

    pieceIsSelected()  {return this.selectPiece != null;}
    pieceAtIndex(x, y) {return this.boardPieces[y][x];}
    render(pos)        {this.display.render(pos, this);}
    click(pos)         {this.display.click(pos, this);}

    //Checks if the current board contains a winning state
    //checks rows, columns and diagonals for a 2D board, regardless of how many features
    checkWin(){
        for (let i=0; i<this.size.y; i++){
            if(this.checkFeatureList(this.boardPieces[i])){
                return true;
            }
        }
        for (let x=0; x<this.size.x; x++){
            let col = [];
            for(let y=0; y<this.size.y; y++){
                col.push(this.boardPieces[y][x]);
            }
            if(this.checkFeatureList(col)){
                return true;
            }
        }
        let d1 = [];
        let d2 = [];
        for(let i=0; i<this.size.x; i++){
            d1.push(this.boardPieces[i][i]);
            d2.push(this.boardPieces[i][this.size.x - (i+1)]);
        }
        if(this.checkFeatureList(d1) || this.checkFeatureList(d2)){
            return true;
        }
        return false;
    }

    //Checks a list of features for any win condition.
    checkFeatureList(feats){
        //list has empty element
        if (feats.indexOf(-1) >= 0){return false;}
        let andCmp = Math.pow(2, 16) - 1; //max of 16 features
        let orCmp  = 0;
        for(let i=0; i<feats.length; i++){
            andCmp = andCmp & feats[i];
            orCmp  = orCmp  | feats[i];
        }
        return andCmp > 0 || orCmp - (Math.pow(2, this.size.x) - 1) != 0;
    }

    //If a piece is avaliable to be selected, selects this piece and removes it 
    //from remaining pieces.
    //Returns boolean true if successful, false if not
    selectPiece(piece){
        let index = this.remainingPieces.indexOf(piece);
        if(index < 0){
            console.log("ERROR: Tried to move piece to invalid piece.");
            return false;
        }
        this.selectedPiece = this.remainingPieces[index];
        this.remainingPieces.splice(index, 1);
        return true;
    }

    //Clears the selected piece, adding it back into the remaining pieces if required.
    clearSelectedPiece(){
        //If selected piece is not null, add it back to remaining pieces before selecting new one
        if(this.selectedPiece != null){
            this.remainingPieces.push(this.selectedPiece);
        }
        this.selectedPiece = null;
    }
    getSelectedPiece(){return this.selectedPiece;}

    //Places currently selected piece at given index, if possible.
    //logs event in history.
    //Returns boolean true if successful, false if not
    placeSelectedPiece(x, y){
        if(this.selectedPiece == null){return false;}
        if(x < 0 || x >= this.size.x){
            console.log("ERROR: Tried to move piece to illegal x value.");
            return false;
        } else if (y < 0 || y >= this.size.y){
            console.log("ERROR: Tried to move piece to illegal y value.");
            return false;
        } 
        this.boardPieces[y][x] = this.selectedPiece;
        this.selectedPiece = null;

        this.logHistory(x, y, this.boardPieces[y][x]);

        return true;
    }
}