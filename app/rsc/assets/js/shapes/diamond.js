import Shape from "./shape.js"

class Diamond extends Shape {
    constructor(x, y, minSize, selectable, context) {
        super(x, y, minSize, minSize, selectable, context);
        this.bottom = y + minSize/2;
        this.top = y - minSize/2;
        this.right = x + minSize/2;
        this.left = x - minSize/2;
        this.colorUnlit = "#4cd2a9" //TODO
        this.colorLit = "#96d2bc"
        this.colorGrey = "#4cd2a980" // TODO
        this.marginFactor = minSize / 16 *1.5
    }

    draw() {
        if (this.doVibrate) {
            this.vibrate()
        }
        if(this.grey){
            this.colorUnlit = this.colorGrey
        }
        let x = this.x;
        let y = this.y -this.height/4;
        if (this.selected || this.unlocked) {
            this.ctx.fillStyle = this.colorUnlit;
            this.ctx.beginPath();
            this.ctx.moveTo(x,y-this.marginFactor);
            this.ctx.lineTo(x - this.width/4 - this.marginFactor, y + this.height/4 );
            this.ctx.lineTo(x , y +this.height/2 + this.marginFactor);
            this.ctx.lineTo(x + this.width/4 + this.marginFactor, y + this.height/4 );
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.fillStyle = this.colorLit; //COLOR_SELECT;
        } else if (this.highlight) {
            this.ctx.fillStyle = this.colorLit;
        } else {
            this.ctx.fillStyle = this.colorUnlit;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(x,y);
        this.ctx.lineTo(x - this.width/4, y + this.height/4);
        this.ctx.lineTo(x, y +this.height/2);
        this.ctx.lineTo(x + this.width/4, y + this.height/4);
        this.ctx.closePath();
        this.ctx.fill();
        super.draw()
    }

    contains(x, y, easyMode=true) {
        if (easyMode){
            return this.left < x && x < this.right && this.top < y && y < this.bottom;
        }else{
            return x + y - this.x -this.y < this.width && this.left < x && x < this.right && this.top < y && y < this.bottom;
        }
    }

    getShapeName(){
        return "Diamond"
    }
}

export default Diamond
