// noinspection DuplicatedCode
import tdGame from "../tdGame.js";

class TargetCanvas {
    constructor(canvasElement, height, width, topMargin, cellSize,
                top, left, stroke) {
        this.height = height
        this.width = width

        this.cellSize = cellSize
        this.topMargin = topMargin

        this.top = top
        this.left = left
        this.stroke = stroke

        this.colorBoard = "black"
        this.colorBorder = "grey"

        this.canvasElement = canvasElement
        this.canvasElement.height = this.height
        this.canvasElement.width = this.width

        this.canvasElement.style.top = String(this.topMargin + top) + "px"
        this.canvasElement.style.left = String(left + stroke) + "px"

        this.context = this.canvasElement.getContext("2d")
        this.context.lineWidth = stroke

        this.targetShapeDisplay = null

        this.gameInst = null
    }

    newStepProcess(){
        this.targetShapeDisplay = this.getTargetShape()
    }


    draw(){
        this.context.fillStyle = this.colorBoard
        this.context.strokeStyle = this.colorBorder
        this.context.fillRect(0, 0, this.width, this.height)
        this.context.strokeRect(this.stroke / 2, this.stroke / 2,
            this.width - this.stroke, this.height - this.stroke)
        this.targetShapeDisplay.draw()

        this.context.fillStyle = "white"
        this.context.font = "bold 18px arial"
        this.context.textAlign = "center"
        this.context.fillText("TARGET", this.width / 2, this.height -25);

        let timerString = ""
        if(this.gameInst.settings.debug)
            timerString = TargetCanvas.msToSeconds(this.gameInst.getCurrTime())
        this.context.fillText(timerString,this.width/2,this.top-25)
    }

    getTargetShape(){
        return tdGame.shapeFromName(this.gameInst.currShape, this.width / 2, this.height / 2,
            this.cellSize, false, this.context)
    }
    getSliderLifetime() {
        //TODO placeholder
        return -1
    }
    static msToSeconds(time) {
        let ts = Math.floor(time / 1000 )
        let min = Math.floor(ts/60)
        let s = ts%60

        min = min.toString().padStart(2,'0')
        s = s.toString().padStart(2,'0')
        return String(min)+":"+String(s)
    }
}

export default TargetCanvas