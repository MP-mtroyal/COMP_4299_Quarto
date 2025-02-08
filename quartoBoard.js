class QuartoBoard{
    constructor(pos, boardSize, squareSize){
        this.pos = createVector(pos.x, pos.y);
        this.boardSize = boardSize;
        this.squareSize = squareSize;
        this.squarePositions = [];
        this.remPieceRatio = 0.5;
        this.remPiecesPerRow = 2;

        this.boardColor     = color(25, 25, 25);
        this.highlightColor = color(230, 100, 75);
        this.squareColor = bgColor;

        this.init();
    }

    init(){
        for(let y=0; y<this.boardSize; y++){
            let row = [];
            for(let x=0; x<this.boardSize; x++){
                row.push(createVector(
                    this.pos.x + this.squareSize * x + this.squareSize * 0.5, 
                    this.pos.y + this.squareSize * y + this.squareSize * 0.5
                ));
            }
            this.squarePositions.push(row);
        }
    }

    moveHighlightedPiece(game){
        if(this.highlightedRemPiece == null || this.highlightedSquare == null) return;

        game.movePiece(this.highlightedRemPiece.val, this.highlightedSquare.x, this.highlightedSquare.y);

        this.highlightedRemPiece = null;
        this.highlightedSquare   = null;
    }

    posWithinDist(p1, p2, d){
        let dist = Math.pow(p1.x - p2.x, 2);
        dist    += Math.pow(p1.y - p2.y, 2);
        dist     = Math.sqrt(dist);
        return dist < d;
    }

    posInSquare(x, y, pos){
        return this.posWithinDist(pos, this.squarePositions[y][x], this.squareSize / 2);
    }

    render(pos, game){
        this.renderRemPieceHighlight(pos, game);
        //======= Render Board ===========
        let spacing = 50;
        fill(this.boardColor);
        rect(
            this.pos.x - spacing / 2,
            this.pos.y - spacing / 2,
            this.squareSize * this.squarePositions[0].length + spacing,
            this.squareSize * this.squarePositions.length    + spacing
        );
        //======== Render On Board Pieces ===========
        for(let y=0; y<this.squarePositions.length; y++){
            for(let x=0; x<this.squarePositions[0].length; x++){
                let currPiece = game.pieceAtIndex(x, y);
                fill(this.squareColor);
                if(this.highlightedSquare != null){
                    if(this.highlightedSquare.x == x && this.highlightedSquare.y == y){
                        fill(this.highlightColor);
                    }
                } else if(this.posInSquare(x, y, pos) && currPiece < 0){
                    fill(this.highlightColor);
                }
                ellipse(
                    this.squarePositions[y][x].x, 
                    this.squarePositions[y][x].y, 
                    this.squareSize * 0.85
                );
                
                if (currPiece >= 0){
                    this.renderPiece(this.squarePositions[y][x], currPiece);
                }
            }
        }
        //======== Render Off Board Pieces ============
        let remainingPieces = game.getRemainingPieces();
        //assumes pieces are unique
        remainingPieces.forEach(piece => {
            this.renderPiece(this.getRemPiecePos(piece), piece, this.remPieceRatio);
        });

        //======== Render Selected Piece ==============
        let selectedPiece = game.getSelectedPiece();
        if(selectedPiece){
            let selectedPiecePos = createVector(
                this.pos.x + (this.boardSize + 2) * this.squareSize,
                this.pos.y + this.squareSize * 2
            );
            this.renderPiece(selectedPiecePos, selectedPiece, 1.5);
        }
    }

    getHoveredPiece(pos, game){
        let result = null;
        let remainingPieces = game.getRemainingPieces();
        remainingPieces.forEach(piece => {
            let remPos = this.getRemPiecePos(piece);
            remPos.y += this.squareSize * this.remPieceRatio * 0.35;
            if (this.posWithinDist(pos, remPos, (this.squareSize * this.remPieceRatio) / 2)){
                result = new RemPiece(remPos, piece);
            }
        });
        return result;
    }

    getHoveredSquare(pos, game){
        let result = null;
        for(let y=0; y<this.squarePositions.length; y++){
            for(let x=0; x<this.squarePositions[0].length; x++){
                let currPiece = game.pieceAtIndex(x, y);
                if(this.posInSquare(x, y, pos) && currPiece < 0){
                    result = createVector(x, y);
                }
            }
        }
        return result;
    }

    //TODO: Make this less terrible.
    renderRemPieceHighlight(pos, game){
        let remPiece = this.getHoveredPiece(pos, game);
        if (remPiece != null){
            fill(this.highlightColor);
            ellipse(
                remPiece.pos.x, 
                remPiece.pos.y, 
                this.squareSize * this.remPieceRatio
            );
        }
    }

    renderPiece(squarePos, pieceVal, renderRatio=1.0){
        let pieceWidth = (this.squareSize * renderRatio) / 3;
        let piecePos = createVector(
            squarePos.x - pieceWidth / 2,
            squarePos.y + this.squareSize / 3
        );
        noStroke();
        //piece color
        if (pieceVal & 1){fill(0);}
        else {fill(255);}

        //piece height
        let pieceHeight = (this.squareSize * renderRatio) / 4;
        if (pieceVal & 2){pieceHeight *= 2;}

        //piece shape
        if (pieceVal & 4){
            rect(piecePos.x, piecePos.y - pieceHeight, pieceWidth, pieceHeight);
        } else {
            rect(piecePos.x, piecePos.y - pieceHeight, pieceWidth, pieceHeight);
            ellipse(piecePos.x + pieceWidth / 2, piecePos.y - pieceHeight, pieceWidth);
        }

        //hollow or solid
        if (pieceVal & 8){
            fill(this.squareColor);
            ellipse(piecePos.x + pieceWidth / 2, piecePos.y - pieceHeight, pieceWidth / 2);
        }

        //text color -- invert piece
        let textSpace = pieceWidth * 0.03;
        if (pieceVal & 1){fill(255);}
        else {fill(0);}
        textSize(pieceWidth * 1.75 / this.boardSize);
        text(
            this.toBinString(pieceVal, this.boardSize), 
            piecePos.x + textSpace, 
            piecePos.y - textSpace
        );
    }
    //==== Create unique position for a piece based on its value
    getRemPiecePos(pieceVal){
        let remPiecesPos = createVector(
            this.pos.x + this.squareSize * (this.boardSize + 0.5),
            this.pos.y
        );
        remPiecesPos.x  += this.squareSize * this.remPieceRatio * (pieceVal % this.remPiecesPerRow);
        remPiecesPos.y  += this.squareSize * this.remPieceRatio * Math.floor(pieceVal / this.remPiecesPerRow);
        return remPiecesPos;
    }

    toBinString(val, digits){
        let s = "";
        for(let i=0; i<digits; i++){
            s = (val % 2).toString() + s;
            val = Math.floor(val / 2);
        }
        return s;
    }
}

class RemPiece{
    constructor(pos, val){
        this.pos = createVector(pos.x, pos.y);
        this.val = val;
    }
}