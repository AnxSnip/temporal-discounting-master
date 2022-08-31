import tdGame from "./tdGame.js";

/*Overload of td game to match the logic in the all-test tutorial*/
class tuto4Logic extends tdGame{
    constructor(settings) {
        super(settings,null);
        this.step = 0;
        this.notUnlocked = true;
        this.stime=-1;
        this.lockStates=[this.settings.nbLocks-1,0,this.settings.nbLocks-1]
    }

    tick() {}
    logData(timeTakenStep) {}
    startBreak() {}
    endBreak() {}

    nextStep() {
        //TODO change to fit the requirement
        // If the timer ran out
        this.step ++
        this.stime=-1
        if(this.getCurrTime() > this.settings.maxTimer && this.settings.maxTimer !== -1 && !this.gameEnded && !this.inBreak) {
            let timeTakenStep = Date.now() - this.startStepTime
            this.logData(timeTakenStep)
            this.endGame()
        }

        // If a break has been queued, interrupt next step setup and go to break screen instead
        if(this.setToBreak && (this.currStep < this.internMaxStep - 1 || this.internMaxStep === -1)) {
            this.endedStepTime = Date.now()
            this.learningPanel.destroySlider()
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
        if(this.currStep > this.internMaxStep - 1 && this.internMaxStep !== -1 && !this.gameEnded) {
            this.learningDone--
            this.timeline.refreshTimeline()
            this.timeline.draw()
            this.endGame()
        }
        // Reset metrics
        this.stepClicks = 0
        // Reset mode used to novice
        if(this.stepMode === "learning"){
            this.learningDone++
        }
        this.stepMode = "novice"
        this.startStepTime = Date.now()
        // Disable nextButton
        this.nextButton.disabled = true
        this.initNewStep()
    }

    selectShape(row, col) {
        if (this.stime === -1) this.stime =Date.now();
        super.selectShape(row, col);
    }

    initNewStep(){

        if(this.playfield === null){
            console.log("Playfield must be bound before initialising game step")
            return
        }
        // Fill backlog when it runs low
        //
        if(this.gridBacklog.length === 0){
            this.generateBlock()
        }

        // Refresh timeline
        this.timeline.refreshTimeline()
        // Pops a grid from queue
        this.currShape = this.shapeBacklog[this.currStep]
        this.currShapeGrid = this.gridBacklog[this.currStep]

        this.targetCanvas.newStepProcess()
        this.learningPanel.newStepProcess()
        this.SLmode = null

        this.currSelected = 0
        this.currStep++
        this.timeline.step++
    }

    generateBlock() {
        let newBlockShapes = ["Ring","Star","Quatrefoil","Star","Quatrefoil","Ring","Ring"]
        this.shapeBacklog = this.shapeBacklog.concat(newBlockShapes)

        for(let shapeName in newBlockShapes){
            this.gridBacklog.push(this.generateGrid(newBlockShapes[shapeName]))
        }
    }

    getCurrTime() {
        if (this.stime === -1){
            return 0
        }else{
            return Date.now()- this.stime
        }
    }

    endGame() {
        this.gameEnded = true
        // Kill dynamic elements in target canvas
        this.learningPanel.gameEndHandle()
        // Save data to log file
        //TODO something to end the tuto
        document.getElementById("board").style.display = "none";
    }
}

export default tuto4Logic