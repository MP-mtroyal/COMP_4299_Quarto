class PromptDisplay{
    constructor(pos, size, lineSize=80, maxLines=20, fontSize=32){
        this.pos   = createVector(pos.x, pos.y);
        this.size  = createVector(size.x, size.y);
        this.lines = [];
        this.maxLines = maxLines;
        this.lineSize = lineSize;
        this.fontSize = fontSize;
        this.lineSpacing = this.fontSize * 1.5;
        this.bgColor = color(0, 0, 0);
        this.textColor = color(75, 255, 100);
    }

    render(){
        fill(this.bgColor);
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        textSize(this.fontSize);
        fill(this.textColor);

        let linesToRender = this.maxLines < this.lines.length ? this.maxLines : this.lines.length;
        
        for (let i=0; i<linesToRender; i++){
            let vert = this.pos.y + (linesToRender - i) * this.lineSpacing;
            text(this.lines[this.lines.length - i - 1], this.pos.x + this.lineSpacing, vert);
        }
    }

    log(s){
        if (s.length <= this.lineSize){
            this.lines.push(s);
        } else {
            this.lines.push(s.substring(0, this.maxLines));
            this.log(s.substring(this.maxLines));
        }
    }
}