import Shape from "./shape.js"

class Hexagon extends Shape {
    constructor(x, y, minSize, selectable, context) {
        super(x, y, minSize/2, minSize/2, selectable, context);
        let size = minSize/2
        this.bottom = y + size/2;
        this.top = y - size/2;
        this.right = x + size/2;
        this.left = x - size/2;
        this.colorUnlit = "#ff7f00" //TODO
        this.colorLit = "#bb8960"
        this.colorGrey = "#ff7f0080" // TODO
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
        let r = this.height/2;
        const a = 2* Math.PI /6

        if (this.selected || this.unlocked) {
            this.ctx.strokeStyle = this.colorUnlit;
            this.ctx.lineWidth = 8;
            this.ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                this.ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
            }
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.fillStyle = this.colorLit; //COLOR_SELECT;
        } else if (this.highlight) {
            this.ctx.fillStyle = this.colorLit;
        } else {
            this.ctx.fillStyle = this.colorUnlit;
        }
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            this.ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
        }
        this.ctx.closePath();
        this.ctx.fill();
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
        return "Hexagon"
    }
}

export default Hexagon
