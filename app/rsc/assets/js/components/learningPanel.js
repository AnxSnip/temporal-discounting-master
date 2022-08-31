import tdGame from "../tdGame.js";
import Button from "../shapes/button.js";
import Slider from "./Slider.js";

/*This class implements the functionality of the locker panel
* */
class LearningPanel{
    constructor(canvasElement, cellSize, maxLockCount, shapeNames, top, left, stroke,height = 510)  {
        this.cellSize = cellSize
        this.imgWidth = 4 * cellSize / 12
        this.imgHeight = 5 * cellSize / 12
        this.imgMargin = cellSize / 2
        //margin of the canvas
        this.canvMargin = cellSize*1.5
        this.height = height
        this.width = 400
        this.canvasElement = canvasElement
        //height and width of the canvas. Not dynamic !!
        this.canvasElement.height = this.height
        this.canvasElement.width = this.width
        this.canvasElement.style.top = String(top) + "px"
        this.canvasElement.style.left = String(left) + "px"

        this.top = top
        this.left = left
        this.stroke = stroke


        this.colorBoard = "black"
        this.colorBorder = "grey"
        //color of "unlock" button text
        this.targetColorFont = "black"
        //color of unlocked and expert text
        this.targetColorFontUnlocked = "white"

        this.context = this.canvasElement.getContext("2d")
        this.stroke = stroke
        this.context.lineWidth = stroke

        this.gameInst = null

        //Images of lockers
        this.imgLock = new Image()
        this.imgLock.src = 'rsc/img/lock.png'
        this.imgUnlock = new Image()
        this.imgUnlock.src = 'rsc/img/unlock.png'


        this.displayUnlockButton = true
        this.unlockButtonClickable = true
        //coords of the button element
        this.unlockHeight =33
        this.unlockWidth = 160
        this.unlockX = this.width/2
        this.unlockY = 30
        this.unlockRadius = 10
        this.unlockButton = new Button(this.unlockX, this.unlockY,
            this.unlockWidth, this.unlockHeight, this.unlockRadius, this.context)

        //shapes to display
        this.shapeDisplay = []
        for(let i = 0; i < shapeNames.length; i++){
            this.shapeDisplay.push(tdGame.shapeFromName(shapeNames[i],
                this.getDrawX(), this.getDrawY(i), this.cellSize, false, this.context))
        }

        this.canvasElement.addEventListener("mousemove", (event) => this.highlightButton(event))
        this.canvasElement.addEventListener("mousedown", (event) => this.unlockClick(event))
        this.slider = null
        this.unlockUsed = false

    }

    destroySlider() {
        if(this.slider) {
            this.sliderLifeTimeIfKilled = this.slider.getLifeTime()
            this.slider.killSlider()
            this.slider = null
        }
    }

    getSliderLifetime() {
        if(this.slider)
            return this.slider.getLifeTime()
        if(this.sliderLifeTimeIfKilled)
            return this.sliderLifeTimeIfKilled
        return -1
    }

    //highlight the button when hovering event
    highlightButton(event){
        if(!this.displayUnlockButton)
            return
        let x = event.offsetX
        let y = event.offsetY

        this.unlockButton.highlight = false

        if(this.unlockButton.contains(x, y)){
            if(this.unlockButtonClickable){
                this.unlockButton.highlight = true;
                document.body.style.cursor = "pointer"
            }
            else{
                document.body.style.cursor = "not-allowed"
            }
        }
        else{
            document.body.style.cursor = "auto"
        }
    }

    //register and reset the value before the new step
    newStepProcess(){
        this.sliderLifeTimeIfKilled = null
        if(this.gameInst.isShapeUnlocked(this.gameInst.currShape)) {
            this.displayUnlockButton = false
            this.unlockButton = null
        }
        else{
            this.displayUnlockButton = true
            this.unlockButtonClickable = true
            this.unlockButton = new Button(this.unlockX, this.unlockY,
                this.unlockWidth, this.unlockHeight, this.unlockRadius, this.context)
        }
        if(this.slider) {
            this.slider.killSlider()
            this.slider = null
        }
        this.targetShapeDisplay = this.getTargetShape()
        this.unlockUsed = false
    }

    //User clicked on "unlock" event
    unlockClick(event){
        if(!this.unlockButtonClickable)
            return
        this.gameInst.SLmode = "l"
        let x = event.offsetX
        let y = event.offsetY
        let targetShapeDisplay =  this.getTargetShape()
        if(this.unlockButton.contains(x, y)){
            this.slider = new Slider(this, this.top  + this.unlockButton.top,
                this.left + this.width* 0.15, this.width * 0.7,
                targetShapeDisplay.colorUnlit, this.gameInst.sliderDuration)
            this.displayUnlockButton = false
            this.unlockButtonClickable = false
            document.body.style.cursor = "auto";

            let shape = this.gameInst.currShape
            this.gameInst.timeline.learning_list.push(this.gameInst.timeline.step)
            console.log(this.gameInst.timeline.learning_list)
            this.gameInst.addLearningStep(shape)
            setTimeout(f => this.gameInst.timeline.refreshTimeline(),
                1000)
            this.gameInst.animate(this.gameInst.settings.shapeNames.indexOf(shape))
        }
    }

    getTargetShape(){
        return tdGame.shapeFromName(this.gameInst.currShape, this.width / 2, this.height / 2,
            this.cellSize, false, this.context)
    }

    //Unlock the shape
    processUnlock() {
        this.sliderLifeTimeIfKilled = this.slider.getLifeTime()
        this.slider.killSlider()
        this.slider = null
        this.gameInst.shapeUnlockOne()
        this.unlockUsed = true
        this.gameInst.nextButton.disabled = false
    }

    //return the X coords of a shape to be drawn
    getDrawX() {
        return 3 / 4 * this.cellSize
    }

    //return the Y coords of a shape to be drawn
    getDrawY(row){
        return this.canvMargin + this.cellSize * row
    }

    //return the X coords of an image to be drawn
    getImgX(col){
        return 3 / 2 * this.cellSize + col * this.imgMargin - this.imgWidth / 2
    }

    //return the Y coords of an image to be drawn
    getImgY(row){
        return this.canvMargin + this.cellSize * row - this.imgHeight / 2
    }

    //draw all element on the canvas
    draw(){
        //the board and border
        this.context.fillStyle = this.colorBoard
        this.context.strokeStyle = this.colorBorder
        this.context.fillRect(0, 0, this.width, this.height)
        this.context.strokeRect(this.stroke / 2, this.stroke / 2,
            this.width - this.stroke, this.height - this.stroke)

        //the shapes
        for(let shape in this.shapeDisplay){
            this.shapeDisplay[shape].draw()
        }
        //the unlock button
        if(this.displayUnlockButton) {
            this.unlockButton.draw()
        }

        //the lockers
        for(let i = 0; i < this.gameInst.settings.shapeNames.length; i++){
            let shapeLockState = this.gameInst.lockStates[i]
            for(let j = 0; j < this.gameInst.settings.nbLocks; j++){
                let lockImg = this.imgLock
                if(j < shapeLockState){
                    lockImg = this.imgUnlock
                }
                //the rectangle around the lock
                if(shapeLockState === j && i ===this.getShapeIndex()){
                    this.context.strokeStyle = "#5e5d5d";

                    this.context.strokeRect(this.getImgX(j)-5, this.getImgY(i)-5 ,
                        this.imgWidth +10, this.imgHeight +10);
                }
                this.context.drawImage(lockImg, this.getImgX(j), this.getImgY(i),
                    this.imgWidth, this.imgHeight)
            }
        }
        //the text at the bottom
        this.context.font = "bold 18px arial"
        this.context.fillStyle = "white"
        this.context.fillText("LOCKER PANEL", this.width/2 +3, this.height-30)
        this.context.font = "14px arial"
        this.context.fillText("Click on 'UNLOCK' to unlock one locker of this target", this.width/2 +3, this.height-10)
        if(this.slider)
            return
        this.context.fillStyle = this.targetColorFont
        this.context.font = "bold 18px arial"
        this.context.textAlign = "center"
        if(this.gameInst.isShapeUnlocked()) {
            this.context.fillStyle = this.targetColorFontUnlocked

            this.context.fillText("EXPERT", this.width/2, this.unlockY + 4)
        }
        else if(this.unlockUsed){
            this.context.fillStyle = this.targetColorFontUnlocked
            this.context.fillText("UNLOCKED", this.width/2, this.unlockY + 4)
        }
        else{
            this.context.fillText("UNLOCK", this.width/2, this.unlockY + 4)
        }
    }

    gameEndHandle() {
        if(this.slider) {
            this.slider.killSlider()
            this.slider = null
        }
    }

    getShapeIndex(){
        switch (this.gameInst.currShape){
            case "Triangle":
                return 0
            case "Circle":
                return 1
            case "Square":
                return 2
            case "Cross":
                return 3
            case "Diamond":
                return 4
            case "X":
                return 5
            case "Star":
                return 6
            case "Hexagon":
                return 7
            case "Ring":
                return 8
            case "Quatrefoil":
                return 9
            default:
                return -1
            }
    }

}



export default LearningPanel