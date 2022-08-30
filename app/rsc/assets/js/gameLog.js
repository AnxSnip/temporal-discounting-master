class GameLog {
    constructor(initDate, sliderDuration,
                nbShapesByBlock, shapeNames, nbLocks, nbTargets,weights,
                learningTime, ipAddress) {
        const order = ["Triangle","Circle","Square","Cross","Diamond","X","Star","Hexagon","Ring","Quatrefoil"]
        this.initDate = initDate
        this.ipAddress = ipAddress

        this.trialId = []
        this.blockId = []
        this.nbTrials = 0
        this.blocksDone = 0
        this.blockSize = nbShapesByBlock
        this.targetShapes = []
        this.targetShapesId = []
        this.nbTargets = nbTargets
        this.sliderDuration = sliderDuration
        this.didUnlock = []
        this.targetLockState = []

        this.timeTakenStep = []
        this.timeTakenAllSelection = []
        this.timeTakenNextClick = []
        this.locksOpenedAtStep = []
        this.sliderDisplayTime = []
        this.nbLocks = nbLocks

        this.nbCLicks = []

        this.settingsUsed = String(nbLocks) + "*" + sliderDuration / 1000 + "s"

        this.weights = {}
        this.seenShape = {}
        this.firstUnlockOcc = {}
        this.firstUnlockTrialId = {}
        let w = weights.length
        if (w >3){
            this.weights["Triangle"] = weights[0]
            this.weights["Circle"] = weights[1]
            this.weights["Square"] = weights[2]
            this.weights["Cross"] = weights[3]

            this.seenShape["Triangle"] = 0
            this.seenShape["Circle"] = 0
            this.seenShape["Square"] = 0
            this.seenShape["Cross"] = 0

            this.firstUnlockOcc["Triangle"] = -1
            this.firstUnlockOcc["Circle"] = -1
            this.firstUnlockOcc["Square"] = -1
            this.firstUnlockOcc["Cross"] = -1

            this.firstUnlockTrialId["Triangle"] = -1
            this.firstUnlockTrialId["Circle"] = -1
            this.firstUnlockTrialId["Square"] = -1
            this.firstUnlockTrialId["Cross"] = -1
        }
        if(w > 4){
            this.weights["Diamond"] = weights[4]
            this.seenShape["Diamond"] = 0
            this.firstUnlockOcc["Diamond"] = -1
            this.firstUnlockTrialId["Diamond"] = -1
        }
        if(w > 5){
            this.weights["X"] = weights[5]
            this.seenShape["X"] = 0
            this.firstUnlockOcc["X"] = -1
            this.firstUnlockTrialId["X"] = -1
        }
        if(w > 6){
            this.weights["Hexagon"] = weights[6]
            this.seenShape["Hexagon"] = 0
            this.firstUnlockOcc["Hexagon"] = -1
            this.firstUnlockTrialId["Hexagon"] = -1
        }
        if(w > 7){
            this.weights["Star"] = weights[7]
            this.seenShape["Star"] = 0
            this.firstUnlockOcc["Star"] = -1
            this.firstUnlockTrialId["Star"] = -1
        }
        if(w > 8){
            this.weights["Ring"] = weights[8]
            this.seenShape["Ring"] = 0
            this.firstUnlockOcc["Ring"] = -1
            this.firstUnlockTrialId["Ring"] = -1
        }
        if(w > 9){
            this.weights["Quatrefoil"] = weights[9]
            this.seenShape["Quatrefoil"] = 0
            this.firstUnlockOcc["Quatrefoil"] = -1
            this.firstUnlockTrialId["Quatrefoil"] = -1
        }

        this.occurrences = []

        this.locksOpened = 0
        this.modeUsed = []

        this.learningTime = learningTime

        this.totalTime = null
        this.trialIdN = 0
    }

    registerStep(targetShape, lockState, timeTakenTotal, timeTakenShapeSelection
                 , clicksTotal, mode, sliderDisplayTime) {
        console.log(targetShape)
        this.seenShape[targetShape]++

        let currBlock = Math.ceil(this.trialIdN / this.blockSize)
        this.trialId.push(this.trialIdN)
        this.blockId.push(currBlock)
        this.targetShapes.push(targetShape)
        this.targetShapesId.push(GameLog.getIdFromShapeName(targetShape))
        if(mode === "learning"){
            if(this.firstUnlockOcc[targetShape] === -1) {
                this.firstUnlockOcc[targetShape] = this.seenShape[targetShape]
                this.firstUnlockTrialId[targetShape] = this.trialIdN
            }
            this.didUnlock.push(1)
            this.locksOpened++
        }
        else{
            this.didUnlock.push(0)
        }
        this.targetLockState.push(lockState)

        this.occurrences.push(this.seenShape[targetShape])
        this.timeTakenStep.push(timeTakenTotal)
        this.timeTakenAllSelection.push(timeTakenShapeSelection)
        this.timeTakenNextClick.push(timeTakenTotal - timeTakenShapeSelection)
        this.sliderDisplayTime.push(sliderDisplayTime)
        this.locksOpenedAtStep.push(this.locksOpened)
        this.nbCLicks.push(clicksTotal)
        this.modeUsed.push(mode)
        this.trialIdN++
    }


    registerEnd(nbTrials, totalTime) {
        this.nbTrials = nbTrials
        this.totalTime = totalTime
        this.blocksDone = Math.floor(nbTrials / this.blockSize)
    }

    exportAsString(reload = 0) {
        let timeTuto = parseInt(localStorage.getItem('timeSpentOnSite'));
        timeTuto = isNaN(timeTuto) ? 0 : timeTuto;
        let lines = []
        for(let i = 0; i < this.trialId.length; i++) {
            let data = [new Date(this.initDate), this.ipAddress, this.trialId[i],
            this.blockId[i], this.nbTrials, this.blocksDone, this.blockSize,
            this.targetShapes[i], this.targetShapesId[i],
            this.weights[this.targetShapes[i]], this.nbTargets,
            this.learningTime, this.settingsUsed, this.nbLocks, Math.round(this.sliderDuration*100)/100000,
            this.didUnlock[i], this.targetLockState[i], this.occurrences[i],
            this.timeTakenStep[i], this.timeTakenAllSelection[i], this.timeTakenNextClick[i],
            this.sliderDisplayTime[i], this.locksOpenedAtStep[i], this.firstUnlockOcc[this.targetShapes[i]],
            this.firstUnlockTrialId[this.targetShapes[i]], this.nbCLicks[i], timeTuto,this.totalTime, this.modeUsed[i],reload]
            lines.push(data.join(','))
        }
        return lines.join('\n')+'\n'
    }

    static getIdFromShapeName(shapeName) {
        switch(shapeName) {
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

export default GameLog