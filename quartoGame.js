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

    getRemainingPieces(){
        let result = [];
        for(let i=0; i<this.remainingPieces.length; i++){result.push(this.remainingPieces[i]);}
        return result;
    }

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

    getHistory(){

    }

    logHistory(x, y, piece){
        this.history.push([x,y,piece])
    }

    pieceIsSelected(){return this.selectPiece != null;}

    pieceAtIndex(x, y){
        return this.boardPieces[y][x];
    }

    render(pos){
        if(this.shouldRender){
            this.display.render(pos, this);
        }
    }

    click(pos){
        if (this.shouldRender){
            this.display.click(pos, this);
        }
    }

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

    clearSelectedPiece(){
        //If selected piece is not null, add it back to remaining pieces before selecting new one
        if(this.selectedPiece != null){
            this.remainingPieces.push(this.selectedPiece);
        }
        this.selectedPiece = null;
    }
    getSelectedPiece(){return this.selectedPiece;}

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