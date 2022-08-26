import Shape from "./shape.js"

class X extends Shape {
    constructor(x, y, minSize, selectable, context) {
        super(x, y, minSize/2, minSize/2, selectable, context);
        let size = minSize/2
        this.bottom = y + size/2;
        this.top = y - size/2;
        this.right = x + size/2;
        this.left = x - size/2;
        this.colorUnlit = "#d6604d" //TODO
        this.colorLit = "#c07064"
        this.colorGrey = "#d6604d80" // TODO
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
        let a = this.width/4;

        if (this.selected || this.unlocked) {
            this.ctx.strokeStyle = this.colorUnlit;
            this.ctx.lineWidth = 8;
            this.ctx.beginPath()
            this.ctx.moveTo(x,y-a);
            this.ctx.lineTo(x-a,y-2*a);
            this.ctx.lineTo(x-2*a,y-a);
            this.ctx.lineTo(x-a,y);

            this.ctx.lineTo(x-2*a,y+a)
            this.ctx.lineTo(x-a,y+2*a)
            this.ctx.lineTo(x,y+a)

            this.ctx.lineTo(x+a,y+2*a)
            this.ctx.lineTo(x+2*a,y+a)
            this.ctx.lineTo(x+a,y)

            this.ctx.lineTo(x+2*a,y-a)
            this.ctx.lineTo(x+a,y-2*a)
            this.ctx.lineTo(x,y-a)
            this.ctx.stroke();
            this.ctx.fillStyle = this.colorLit; //COLOR_SELECT;
        } else if (this.highlight) {
            this.ctx.fillStyle = this.colorLit;
        } else {
            this.ctx.fillStyle = this.colorUnlit;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(x,y-a);
        this.ctx.lineTo(x-a,y-2*a);
        this.ctx.lineTo(x-2*a,y-a);
        this.ctx.lineTo(x-a,y);

        this.ctx.lineTo(x-2*a,y+a)
        this.ctx.lineTo(x-a,y+2*a)
        this.ctx.lineTo(x,y+a)

        this.ctx.lineTo(x+a,y+2*a)
        this.ctx.lineTo(x+2*a,y+a)
        this.ctx.lineTo(x+a,y)

        this.ctx.lineTo(x+2*a,y-a)
        this.ctx.lineTo(x+a,y-2*a)
        this.ctx.lineTo(x,y-a)
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
        return "X"
    }
}

export default X