import Shape from "./shape.js"

class Ring extends Shape {
    constructor(x, y, minSize, selectable, context) {
        super(x, y, minSize/2, minSize/2, selectable, context);
        let size = minSize/2
        this.radius = minSize/4
        this.bottom = y + size/2;
        this.top = y - size/2;
        this.right = x + size/2;
        this.left = x - size/2;
        this.colorUnlit = "#169de1" //TODO
        this.colorLit = "#4eafd9"
        this.colorGrey = "#169de180" // TODO
        this.marginFactor = minSize / 16 *1.5
    }

    draw() {
        if (this.doVibrate) {
            this.vibrate()
        }
        if(this.grey){
            this.colorUnlit = this.colorGrey
        }
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
