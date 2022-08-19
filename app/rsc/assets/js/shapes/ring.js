import Shape from "./shape.js"

class Ring extends Shape {
    constructor(x, y, minSize, selectable, context) {
        super(x, y, minSize, minSize, selectable, context);
        this.radius = minSize/4
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
        let y = this.y;
        let r = this.height/8;
        if (this.selected || this.unlocked) {
            this.ctx.fillStyle = this.colorUnlit;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius + this.marginFactor,
                0, Math.PI * 2);
            this.ctx.fill()
            this.ctx.fillStyle = this.colorLit; //COLOR_SELECT;
        } else if (this.highlight) {
            this.ctx.fillStyle = this.colorLit;
        } else {
            this.ctx.fillStyle = this.colorUnlit;
        }

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius ,
            0, Math.PI * 2);
        this.ctx.fill()
        this.ctx.beginPath();
        this.ctx.fillStyle = "gainsboro";
        this.ctx.arc(this.x, this.y, this.radius/2 ,
            0, Math.PI * 2);
        this.ctx.fill();

        if (this.selected || this.unlocked) {
            this.ctx.strokeStyle = this.colorUnlit;
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius / 2 ,
                0, Math.PI * 2);
            this.ctx.stroke();
        }

        super.draw();
    }

    contains(x, y, easyMode=true) {
        if (easyMode){
            return this.left < x && x < this.right && this.top < y && y < this.bottom;
        }else{
            //not implemented
        }
    }

    getShapeName(){
        return "Ring"
    }
}

export default Ring
