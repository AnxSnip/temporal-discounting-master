class gameSettings{
    constructor(weights, nbTargets,
                timeLearning, nbSliders, nbLocks, gridWidth, gridHeight,
                shapeNames = ["Triangle", "Circle", "Square", "Cross"],
                maxStep,nbBlock, maxTimer, noviceTime, breakTimer, lockDecider = 0,
                showTimeline = true, easyMode = false, debug= false) {

        // Shape generation
        // TODO: Generify weights
        this.weights = weights
        // Overloading this argument is not recommended
        this.shapeNames = shapeNames

        // Number of targets to show on the grid
        this.nbTargets = nbTargets

        this.gridWidth = gridWidth
        this.gridHeight = gridHeight

        this.nbSliders = nbSliders
        this.nbLocks = nbLocks[lockDecider % nbLocks.length]

        this.showTimeline = showTimeline
        this.timeLearning = timeLearning
        this.easyMode = easyMode

        this.maxStep = maxStep
        this.nbBlock = nbBlock
        this.maxTimer = maxTimer
        this.noviceTime = noviceTime
        this.breakTimer = breakTimer
        this.debug = debug

        function add(acc,a){
            return acc + a
        }
        this.sumWeight = weights.reduce(add,0);
    }
}

export default gameSettings