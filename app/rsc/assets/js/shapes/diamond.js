import Shape from "./shape.js"

class Diamond extends Shape {
    constructor(x, y, minSize, selectable, context) {
        super(x, y, minSize/2, minSize/2, selectable, context);
        let size = minSize/2
        this.bottom = y + size/2;
        this.top = y - size/2;
        this.right = x + size/2;
        this.left = x - size/2;
        this.colorUnlit = "#6a3d9a" //TODO
        this.colorLit = "#7e5ea1"
        this.colorGrey = "#6a3d9a80" // TODO
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
        let y = this.y -this.height/2;
        if (this.selected || this.unlocked) {
            this.ctx.fillStyle = this.colorUnlit;
            this.ctx.beginPath();
            this.ctx.moveTo(x,y-this.marginFactor);
            this.ctx.lineTo(x - this.width/2 - this.marginFactor, y + this.height/2 );
            this.ctx.lineTo(x , y +this.height + this.marginFactor);
            this.ctx.lineTo(x + this.width/2 + this.marginFactor, y + this.height/2 );
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
        this.ctx.lineTo(x - this.width/2, y + this.height/2);
        this.ctx.lineTo(x, y +this.height);
        this.ctx.lineTo(x + this.width/2, y + this.height/2);
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
