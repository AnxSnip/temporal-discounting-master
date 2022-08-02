class Shape{
    constructor(x, y, width, height, selectable, context){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.selectable = selectable
        this.ctx = context
        this.highlight = false
        this.selected = false
        this.unlocked = false
        this.doVibrate = false
        this.vibrateX = 0
        this.vibrateMagnitude = 8
        this.vibrateAnimationStep = 8
        this.colorUnlit = "black"
        this.colorLit = "gray"
        this.marginFactor = 0.3
    }

    vibrate(){
        if (this.vibrateAnimationStep <= 0) {
            this.vibrateAnimationStep = this.vibrateMagnitude + 1;
            this.doVibrate = false;
            this.vibrateX = 0;
        } else if (this.vibrateAnimationStep <= this.vibrateMagnitude / 4) {
            this.vibrateX -= 2;
        } else if (this.vibrateAnimationStep <= 3 * this.vibrateMagnitude / 4) {
            this.vibrateX += 2;
        } else {
            this.vibrateX -= 2
        }
        this.vibrateAnimationStep--;
    }

    getShapeName(){
        return "Shape"
    }
}

export default Shape
