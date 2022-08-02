// noinspection DuplicatedCode

import Button from "../shapes/button.js";
import tdGame from "../tdGame.js";

class TargetCanvas {
    constructor(canvasElement, height, width, topMargin, cellSize,
                unlockHeight, unlockWidth, unlockRadius, unlockX, unlockY,
                top, left, stroke) {
        this.height = height
        this.width = width

        this.cellSize = cellSize
        this.topMargin = topMargin

        this.top = top
        this.left = left
        this.stroke = stroke

        this.colorBoard = "gainsboro"
        this.colorBorder = "grey"
        this.targetColorFont = "red"
        this.targetColorFontUnlocked = "#4CAF50"
        this.unlockButtonColorUnlit = "white";
        this.unlockButtonColorLit = "gray";
        this.unlockButtonColorStroke = "darkgrey";

        this.canvasElement = canvasElement
        this.canvasElement.height = this.height
        this.canvasElement.width = this.width

        this.canvasElement.style.top = String(this.topMargin + top) + "px"
        this.canvasElement.style.left = String(left + stroke) + "px"

        this.context = this.canvasElement.getContext("2d")
        this.context.lineWidth = stroke

        this.displayUnlockButton = true
        this.unlockButtonClickable = false
        this.unlockHeight = unlockHeight
        this.unlockWidth = unlockWidth
        this.unlockX = unlockX
        this.unlockY = unlockY
        this.unlockRadius = unlockRadius
        this.unlockButton = new Button(this.unlockX, this.unlockY,
            this.unlockWidth, this.unlockHeight, this.unlockRadius, this.context)

        this.canvasElement.addEventListener("mousemove", (event) => this.highlightButton(event))
        this.canvasElement.addEventListener("mousedown", (event) => this.unlockClick(event))

        this.targetShapeDisplay = null

        this.slider = null
        this.gameInst = null
        this.unlockUsed = false
    }

    newStepProcess(){
        this.sliderLifeTimeIfKilled = null
        if(this.gameInst.isShapeUnlocked(this.gameInst.currShape)) {
            this.displayUnlockButton = false
            this.unlockButton = null
        }
        else{
            this.displayUnlockButton = true
            this.unlockButtonClickable = false
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

    unlockClick(event){
        if(!this.unlockButtonClickable)
            return
        let x = event.offsetX
        let y = event.offsetY

        if(this.unlockButton.contains(x, y)){
            this.slider = new Slider(this, this.top + this.topMargin * 0.75 + this.unlockButton.top
                , this.left + this.unlockRadius, this.width * 0.9,
                this.targetShapeDisplay.colorUnlit, this.gameInst.sliderDuration)
            this.displayUnlockButton = false
            this.unlockButtonClickable = false
            document.body.style.cursor = "auto";
        }
    }

    processUnlock() {
        this.sliderLifeTimeIfKilled = this.slider.getLifeTime()
        this.slider.killSlider()
        this.slider = null
        this.gameInst.shapeUnlockOne()
        this.unlockUsed = true
    }

    draw(){
        this.context.fillStyle = this.colorBoard
        this.context.strokeStyle = this.colorBorder
        this.context.fillRect(0, 0, this.width, this.height)
        this.context.strokeRect(this.stroke / 2, this.stroke / 2,
            this.width - this.stroke, this.height - this.stroke)
        this.targetShapeDisplay.draw()

        if(this.displayUnlockButton) {
            this.unlockButton.draw()
        }


        this.context.fillStyle = this.targetColorFont
        this.context.font = "bold 18px arial"
        this.context.textAlign = "center"

        if(this.slider)
            return

        if(this.gameInst.isShapeUnlocked()) {
            this.context.fillStyle = this.targetColorFontUnlocked
            this.context.fillText("EXPERT", this.width / 2, this.unlockY + 5)
        }
        else if(this.unlockUsed){
            this.context.fillStyle = this.targetColorFontUnlocked
            this.context.fillText("UNLOCKED", this.width / 2, this.unlockY + 5)
        }
        else{
            this.context.fillText("UNLOCK", this.width / 2, this.unlockY + 5)
        }
    }

    getTargetShape(){
        return tdGame.shapeFromName(this.gameInst.currShape, this.width / 2, this.height / 2,
            this.cellSize, false, this.context)
    }

    gameEndHandle() {
        if(this.slider) {
            this.slider.killSlider()
            this.slider = null
        }
    }
}

class Slider {
    constructor(parent, top, left, width, color = "darkorange", sliderDuration = 1000, slideThreshold = 4) {
        this.parent = parent

        this.display = false
        this.startTime = null
        this.sliderDuration = sliderDuration

        this.done = false
        this.canvasElement = document.createElement('input')
        this.canvasElement.id = 'slider'
        this.canvasElement.type = 'range'
        this.canvasElement.style.top = String(top) + "px"
        this.canvasElement.style.left = String(left) + "px"
        this.canvasElement.style.position = 'absolute'
        this.canvasElement.style.width = String(width) + "px"


        this.canvasElement.addEventListener("mousemove", (event) => this.setCursorStyleGrab(event))
        this.canvasElement.addEventListener("mouseup", (event) => this.setCursorStyleGrab(event))
        this.canvasElement.addEventListener("mousedown", (event) => this.mouseDown(event))
        this.canvasElement.addEventListener("input", (event) => this.onInput(event))

        this.canvasElement.style.background = color

        this.sliderDirection = 'right'

        document.body.appendChild(this.canvasElement)

        this.oldValue = 0
        this.nbSlide = 0
        this.slideThreshold = slideThreshold
        this.sliderAccept = false
        this.sliderDateAppearance = Date.now()
    }

    onInput(event){
        if(Date.now() - this.startTime > this.sliderDuration - 250 && this.sliderAccept){
            this.done = true
            this.parent.processUnlock()
        }

        let newValue = parseInt(this.canvasElement.value)
        if(this.sliderDirection === 'right'){
            if(newValue >= this.oldValue){
                this.oldValue = newValue
            }
            else{
                this.oldValue = newValue
                this.sliderDirection = 'left'
                this.nbSlide++
            }
        }
        else{
            if (newValue <= this.oldValue) {
                this.oldValue = newValue;
            } else {
                this.oldValue = newValue;
                this.sliderDirection = 'right';
                this.nbSlide++;
            }
        }

        if(this.nbSlide === this.slideThreshold)
            this.sliderAccept = true
    }

    setColor(color){
        this.canvasElement.style.background = color
    }

    setCursorStyleGrab(){
        this.canvasElement.style.cursor = 'grab'
    }

    mouseDown(){
        this.canvasElement.style.cursor = 'grabbing';
        this.startTime = Date.now()
    }

    getLifeTime() {
        return Date.now() - this.sliderDateAppearance
    }

    killSlider(){
        try{
            document.getElementById('slider').remove()
        } catch {
            console.log('slider already killed')
        }
    }
}

export default TargetCanvas
