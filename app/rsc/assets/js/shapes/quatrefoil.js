import Shape from "./shape.js"

class Quatrefoil extends Shape {
    constructor(x, y, minSize, selectable, context) {
        super(x, y, minSize, minSize, selectable, context);
        let size = minSize/2
        this.bottom = y + size/2;
        this.top = y - size/2;
        this.right = x + size/2;
        this.left = x - size/2;
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
            this.ctx.arc(x-r, y-r, r+this.marginFactor, -Math.PI * 3/2, 0)
            this.ctx.arc(x+r, y-r, r+this.marginFactor, Math.PI , -Math.PI * 3/2)
            this.ctx.arc(x+r, y+r, r+this.marginFactor, -Math.PI/2 , -Math.PI)
            this.ctx.arc(x-r, y+r, r+this.marginFactor, 0 , Math.PI*3/2)
            this.ctx.fill();
            this.ctx.fillStyle = this.colorLit; //COLOR_SELECT;
        } else if (this.highlight) {
            this.ctx.fillStyle = this.colorLit;
        } else {
            this.ctx.fillStyle = this.colorUnlit;
        }
        this.ctx.beginPath();
        this.ctx.arc(x-r, y-r, r, -Math.PI * 3/2, 0)
        this.ctx.arc(x+r, y-r, r, Math.PI , -Math.PI * 3/2)
        this.ctx.arc(x+r, y+r, r, -Math.PI/2 , -Math.PI)
        this.ctx.arc(x-r, y+r, r, 0 , Math.PI*3/2)
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
        return "Quatrefoil"
    }
}

export default Quatrefoil
