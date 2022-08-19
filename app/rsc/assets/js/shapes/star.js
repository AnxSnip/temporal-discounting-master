import Shape from "./shape.js"

class Star extends Shape {
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
        let y = this.y;
        let ro = this.height/4;
        let a =  Math.PI / 2 * 3;
        let ri = this.height/8

        if (this.selected || this.unlocked) {
            this.ctx.strokeStyle = this.colorUnlit;
            this.ctx.beginPath();
            this.ctx.moveTo(x,y-ro)
            for (let i = 0; i < 5; i++) {
                this.ctx.lineTo(x+ Math.cos(a) * ro, y + Math.sin(a) * ro)
                a += Math.PI / 5;
                this.ctx.lineTo(x+ Math.cos(a) * ri, y + Math.sin(a) * ri)
                a += Math.PI / 5;
            }
            this.ctx.lineTo(x,y-ro)
            this.ctx.closePath();
            this.ctx.lineWidth = 8;
            this.ctx.stroke();
            this.ctx.fillStyle = this.colorLit; //COLOR_SELECT;
        } else if (this.highlight) {
            this.ctx.fillStyle = this.colorLit;
        } else {
            this.ctx.fillStyle = this.colorUnlit;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(x,y,ro)
        for (let i = 0; i < 5; i++) {
            this.ctx.lineTo(x+ Math.cos(a) * ro, y + Math.sin(a) * ro)
            a += Math.PI / 5;
            this.ctx.lineTo(x+ Math.cos(a) * ri, y + Math.sin(a) * ri)
            a += Math.PI / 5;
        }
        this.ctx.lineTo(x,y-ro)
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
        return "Star"
    }
}

export default Star
