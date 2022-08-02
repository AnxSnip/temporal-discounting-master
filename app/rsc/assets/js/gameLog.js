class GameLog {
    constructor(initDate, sliderDuration,
                nbShapesByBlock, shapeNames, nbLocks, nbTargets,
                triWeight, cirWeight, squWeight, croWeight, learningTime, ipAddress) {
        this.initDate = initDate
        this.ipAddress = ipAddress

        this.trialId = []
        this.blockId = []
        this.nbTrials = 0
        this.blocksDone = 0
        this.blockSize = triWeight + cirWeight + squWeight + croWeight
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
        this.weights["Triangle"] = triWeight
        this.weights["Circle"] = cirWeight
        this.weights["Square"] = squWeight
        this.weights["Cross"] = croWeight

        this.seenShape = {}
        this.seenShape["Triangle"] = 0
        this.seenShape["Circle"] = 0
        this.seenShape["Square"] = 0
        this.seenShape["Cross"] = 0


        this.firstUnlockOcc = {}
        this.firstUnlockOcc["Triangle"] = -1
        this.firstUnlockOcc["Circle"] = -1
        this.firstUnlockOcc["Square"] = -1
        this.firstUnlockOcc["Cross"] = -1


        this.firstUnlockTrialId = {}
        this.firstUnlockTrialId["Triangle"] = -1
        this.firstUnlockTrialId["Circle"] = -1
        this.firstUnlockTrialId["Square"] = -1
        this.firstUnlockTrialId["Cross"] = -1

        this.occurrences = []

        this.locksOpened = 0
        this.modeUsed = []

        this.learningTime = learningTime

        this.totalTime = null

    }

    registerStep(trialId, targetShape, lockState, timeTakenTotal, timeTakenShapeSelection
                 , clicksTotal, mode, sliderDisplayTime) {
        this.seenShape[targetShape]++

        let currBlock = Math.ceil(trialId / this.blockSize)
        this.trialId.push(trialId)
        this.blockId.push(currBlock)
        this.targetShapes.push(targetShape)
        this.targetShapesId.push(GameLog.getIdFromShapeName(targetShape))
        if(mode === "learning"){
            if(this.firstUnlockOcc[targetShape] === -1) {
                this.firstUnlockOcc[targetShape] = this.seenShape[targetShape]
                this.firstUnlockTrialId[targetShape] = trialId
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
    }


    registerEnd(nbTrials, totalTime) {
        this.nbTrials = nbTrials
        this.totalTime = totalTime
        this.blocksDone = Math.floor(nbTrials / this.blockSize)
    }

    exportAsString() {
        let lines = []
        for(let i = 0; i < this.trialId.length; i++) {
            let data = [new Date(this.initDate), this.ipAddress, this.trialId[i],
            this.blockId[i], this.nbTrials, this.blocksDone, this.blockSize,
            this.targetShapes[i], this.targetShapesId[i],
            this.weights[this.targetShapes[i]], this.nbTargets,
            this.learningTime, this.settingsUsed, this.nbLocks, this.sliderDuration.toFixed(2),
            this.didUnlock[i], this.targetLockState[i], this.occurrences[i],
            this.timeTakenStep[i], this.timeTakenAllSelection[i], this.timeTakenNextClick[i],
            this.sliderDisplayTime[i], this.locksOpenedAtStep[i], this.firstUnlockOcc[this.targetShapes[i]],
            this.firstUnlockTrialId[this.targetShapes[i]], this.nbCLicks[i], this.totalTime, this.modeUsed[i]]
            lines.push(data.join(','))
        }
        return lines.join('\n')
    }

    static getIdFromShapeName(shapeName) {
        switch(shapeName) {
            case "Square":
                return 0
            case "Circle":
                return 1
            case "Triangle":
                return 2
            case "Cross":
                return 3
            default:
                return -1
        }
    }
}

export default GameLog