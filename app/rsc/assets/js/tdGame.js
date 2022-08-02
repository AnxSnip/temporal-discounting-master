import Triangle from "./shapes/triangle.js"
import Circle from "./shapes/circle.js";
import Square from "./shapes/square.js";
import Cross from "./shapes/cross.js";
import GameLog from "./gameLog.js";
import Timeline from "./components/timeline.js";

class TDGame {
    constructor(settings, ipAddress = null) {
        this.settings = settings
        this.playfield = null
        this.timeline = null
        this.learningPanel = null
        this.targetCanvas = null
        this.nextButton = false

        this.sliderDuration = Math.max(0, this.settings.timeLearning / this.settings.nbLocks - this.settings.noviceTime)
        this.currStep = 0
        this.currSelected = 0

        this.currShape = ""
        this.currShapeGrid = []
        this.gridBacklog = []
        this.shapeBacklog = []
        this.lockStates = []
        for(let i = 0; i < this.settings.shapeNames.length; i++){
            this.lockStates.push(0)
        }
        this.userIp = ipAddress

        this.gameEnded = false
        this.startTime = Date.now()
        this.startStepTime = Date.now()
        this.endedStepTime = null
        this.allShapesSelectedTime = null

        this.breakStartTime = Date.now()
        this.lastBreakEndedTime = Date.now()
        this.timeInBreak = 0

        this.setToBreak = false
        this.inBreak = false

        this.stepClicks = 0
        this.stepMode = "novice"

        this.gameLog = new GameLog(this.startTime, this.sliderDuration, this.sumWeight(),
            this.settings.shapeNames, this.settings.nbLocks, this.settings.nbTargets,
            this.settings.triWeight, this.settings.cirWeight, this.settings.squWeight,
            this.settings.croWeight, this.settings.timeLearning, this.userIp)


        document.body.addEventListener("mousedown", () => this.addClick())

        let closeBreak = document.querySelector(".infoDivNextButton")
        closeBreak.addEventListener('click', () => this.endBreak())
    }

    // Called every frame
    tick() {
        // When the time runs out, set to end game on next step
        if(Date.now() - this.lastBreakEndedTime > this.settings.breakTimer && !this.setToBreak)
            this.setToBreak = true
    }

    // Handles the transition between steps
    nextStep() {
        // If the timer ran out
        if(this.getCurrTime() > this.settings.maxTimer && this.settings.maxTimer !== -1 && !this.gameEnded && !this.inBreak) {
            let timeTakenStep = Date.now() - this.startStepTime
            this.logData(timeTakenStep)
            this.endGame()
        }

        // If a break has been queued, interrupt next step setup and go to break screen instead
        if(this.setToBreak && (this.currStep < this.settings.maxStep - 1 || this.settings.maxStep === -1)) {
            this.endedStepTime = Date.now()
            this.targetCanvas.destroySlider()
            this.startBreak()
            return
        }
        // Process time taken for the just completed step
        let timeTakenStep = Date.now() - this.startStepTime
        if(this.endedStepTime){
            timeTakenStep = this.endedStepTime - this.startStepTime
            this.endedStepTime = null
        }
        this.logData(timeTakenStep)

        // If a maximum number of step is set and has been crossed, end the game
        if(this.currStep > this.settings.maxStep - 1 && this.settings.maxStep !== -1 && !this.gameEnded)
            this.endGame()

        // Reset metrics
        this.stepClicks = 0
        // Reset mode used to novice
        this.stepMode = "novice"
        this.startStepTime = Date.now()
        // Disable nextButton
        this.nextButton.disabled = true
        this.initNewStep()
    }

    // Called when the game has ended
    endGame() {
        this.gameEnded = true
        // Log endgame state
        this.gameLog.registerEnd(this.currStep, Date.now() - this.startTime)
        document.getElementById("endGame").style.display = "flex"
        // Kill dynamic elements in target canvas
        this.targetCanvas.gameEndHandle()

        // Save data to log file
        let data = this.gameLog.exportAsString()
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({value: data})
        }

        fetch('/logdata', options).then(r => function (r) {
            console.log('Log status: ' + r)
        })
    }

    // Starts a break, preventing user from starting a new step until the popup is closed.
    startBreak() {
        this.inBreak = true
        this.breakStartTime = Date.now()

        let stepString = this.getCurrStep()
        if(this.settings.maxStep === -1)
            stepString = "Uncapped"
        let timerString = ((Timeline.msToSeconds(this.getMaxTime() - this.getCurrTime())) / 60).toFixed(2) + " minutes"
        if(this.settings.maxTimer === -1)
            timerString = "Uncapped"

        let breakWindow = document.getElementById("breakTime")
        breakWindow.style.display = "flex"
        document.getElementById("timeLeft").innerHTML = timerString
        //document.getElementById("currentCompletion").innerHTML = stepString
    }

    // Ends a break, resuming the experiment
    endBreak() {
        let breakWindow = document.getElementById("breakTime")
        breakWindow.style.display = "none"
        this.lastBreakEndedTime = Date.now()
        this.timeInBreak += this.lastBreakEndedTime - this.breakStartTime
        this.inBreak = false
        this.setToBreak = false
        this.nextStep()
    }

    // Logs data to gameLog object
    logData(timeTakenStep) {
        let sliderApparition = this.targetCanvas.getSliderLifetime()

        this.gameLog.registerStep(this.getCurrStep(), this.currShape,
            this.getLockState(this.currShape), timeTakenStep, this.allShapesSelectedTime
            , this.stepClicks, this.stepMode, sliderApparition)
    }

    // Rollbacks progress for a given shape
    removeLock(shape){
        let index = this.settings.shapeNames.indexOf(shape)
        if(index === -1){
            console.log("Attempted to access unknown shape in shapeUnlocked: " + shape)
            return false
        }

        if(!this.isShapeUnlocked(shape)){
            this.lockStates[index]--
        }
    }

    // Adds progress for a given shape
    shapeUnlockOne(shape = this.currShape){
        let index = this.settings.shapeNames.indexOf(shape)
        if(index === -1){
            console.log("Attempted to access unknown shape in shapeUnlockOne: " + shape)
            return false
        }

        if(!this.isShapeUnlocked(shape)){
            this.stepMode = "learning"
            this.lockStates[index]++
        }
    }

    // Gets the current progress for a shape name
    getLockState(shape) {
        let index = this.settings.shapeNames.indexOf(shape)
        if(index === -1){
            console.log("Attempted to access unknown shape in shapeUnlocked: " + shape)
            return -1
        }
        return this.lockStates[index]
    }

    // Returns whether a certain shape is unlocked, uses current target shape if none provided
    isShapeUnlocked(shape = this.currShape){
        return this.getLockState(shape) === this.settings.nbLocks
    }

    bindPlayfield(playfield){
        this.playfield = playfield
        this.playfield.gameInst = this
    }

    bindTimeline(timeline){
        this.timeline = timeline
        this.timeline.gameInst = this
    }

    bindLearningPanel(learningPanel){
        this.learningPanel = learningPanel
        this.learningPanel.gameInst = this
    }

    bindTargetCanvas(targetCanvas){
        this.targetCanvas = targetCanvas
        this.targetCanvas.gameInst = this
    }

    bindComponents(playfield, timeline, learningPanel, targetCanvas, nextButton){
        this.bindPlayfield(playfield)
        this.bindTimeline(timeline)
        this.bindLearningPanel(learningPanel)
        this.bindTargetCanvas(targetCanvas)
        this.nextButton = nextButton
        this.nextButton.addEventListener('click', () => this.nextStep())
    }

    // Handles new step initialization
    initNewStep(){
        if(this.playfield === null){
            console.log("Playfield must be bound before initialising game step")
            return
        }
        // Fill backlog when it runs low
        if(this.gridBacklog.length < this.sumWeight()){
            for(let i = 0; i < 10; i++)
                this.generateBlock()
        }

        // Refresh timeline
        this.timeline.refreshTimeline()
        // Pops a grid from queue
        this.currShape = this.shapeBacklog.shift()
        this.currShapeGrid = this.gridBacklog.shift()

        this.targetCanvas.newStepProcess()

        this.currSelected = 0
        this.currStep++
    }

    // Generate a block from the shapes' weights
    generateBlock() {
        let newBlockShapes = []
        for(let i = 0; i < this.settings.weights.length; i++){
            for(let j = 0; j < this.settings.weights[i]; j++){
                let newShape = this.settings.shapeNames[i]
                newBlockShapes.push(newShape)
            }
        }

        newBlockShapes = TDGame.shuffle(newBlockShapes)
        this.shapeBacklog = this.shapeBacklog.concat(newBlockShapes)

        for(let shapeName in newBlockShapes){
            this.gridBacklog.push(this.generateGrid(newBlockShapes[shapeName]))
        }
    }

    // Generate a grid, made from a number of target shapes and randomly generated other ones
    generateGrid(targetShape){
        if(this.playfield === null){
            console.log("Playfield must be bound before generating a grid")
            return
        }

        // String list containing shape names to place on playfield
        let shapeList = []

        // Add nbTargets * targetShape to list
        for(let i = 0; i < this.settings.nbTargets; i++){
            shapeList.push(targetShape)
        }

        // Define filler shapes
        let fillerShapes = []
        for(let i in this.settings.shapeNames){
            if(this.settings.shapeNames[i] !== targetShape)
                fillerShapes.push(this.settings.shapeNames[i])
        }

        // Add filler shapes to shape list
        for(let i = 0; i < this.settings.gridWidth * this.settings.gridHeight - this.settings.nbTargets; i++){
            let choice = Math.floor(Math.random() * fillerShapes.length);
            shapeList.push(fillerShapes[choice])
        }

        // Shuffle list of shape names
        shapeList = TDGame.shuffle(shapeList)

        let newGrid = []
        for(let i = 0; i < this.settings.gridHeight; i++) {
            newGrid.push([])
            for(let j = 0; j < this.settings.gridWidth; j++){
                let newShapeName = shapeList.pop()
                let newShape = TDGame.shapeFromName(newShapeName, this.playfield.gridX(j), this.playfield.gridY(i),
                    this.playfield.cellSize, newShapeName === targetShape, this.playfield.context)
                newGrid[i].push(newShape)
            }
        }

        if(shapeList.length !== 0){
            console.log("generateGrid(): Shape list has an overflow of " + String(shapeList.length))
        }

        return newGrid
    }

    addClick(){
        this.stepClicks++
    }

    sumWeight(){
        return this.settings.triWeight + this.settings.cirWeight + this.settings.squWeight + this.settings.croWeight
    }

    pickNewShape(){
        let rand = Math.floor(Math.random() * this.sumWeight())
        let s = 0
        for(let i = 0; this.settings.shapeNames.length; i++) {
            s += this.settings.weights[i]
            if(rand < s)
                return this.settings.shapeNames[i]
        }
        return this.settings.shapeNames[this.settings.shapeNames.length - 1]
    }

    selectShape(row, col){
        if(this.currShapeGrid[row][col].getShapeName() === this.currShape){
            if(this.isShapeUnlocked(this.currShape)){
                for(let i = 0; i < this.settings.gridHeight; i++) {
                    for(let j = 0; j < this.settings.gridWidth; j++){
                        if(this.currShapeGrid[i][j].getShapeName() === this.currShape){
                            this.currShapeGrid[i][j].selected = true
                        }
                    }
                }
                this.stepMode = "expert"
                this.allSelected()
            }
            else{
                this.currShapeGrid[row][col].selected = true
                this.currSelected++
                if(this.currSelected === this.settings.nbTargets){
                    this.allSelected()
                }
            }
        }
        else{
            this.currShapeGrid[row][col].doVibrate = true
        }
    }

    allSelected(){
        this.allShapesSelectedTime = Date.now() - this.startStepTime
        this.targetCanvas.unlockButtonClickable = true
        this.nextButton.disabled = false
    }

    getCurrTime() {
        if(this.inBreak)
            return this.breakStartTime - this.startTime - this.timeInBreak
        if(this.gameEnded)
            return this.settings.maxTimer
        return Date.now() - this.startTime - this.timeInBreak
    }

    getCurrStep(){
        if(this.currStep > this.settings.maxStep && this.settings.maxStep !== -1)
            return this.settings.maxStep
        return this.currStep
    }

    getMaxTime() {
        return this.settings.maxTimer
    }

    static shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    static shapeFromName(shapeName, x, y, minSize, selectable, context){
        switch(shapeName){
            case "Triangle":
                return new Triangle(x, y, minSize, selectable, context)
            case "Circle":
                return new Circle(x, y, minSize, selectable, context)
            case "Square":
                return new Square(x, y, minSize, selectable, context)
            case "Cross":
                return new Cross(x, y, minSize, selectable, context)
            default:
                console.log('Unknown shape specified: ' + shapeName)
        }
    }
}

export default TDGame
