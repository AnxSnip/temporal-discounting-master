import tdGame from "../tdGame.js";

class Timeline {
    constructor(timelineElement, size, left, step = 8, maxShapes = 8) {
        this.size = size
        this.margin = 20
        this.index_size = (size / 2) + 3
        this.height = size + 2 * this.margin
        this.width = size * step

        this.font = "bold 24px arial"
        this.fontColor = "darkgrey"
        this.indexColor = "darkgrey"
        this.timelineBoardColor = "white"

        this.timelineElement = timelineElement
        this.timelineElement.style.left = String(left) + "px"
        this.timelineElement.height = this.height
        this.timelineElement.width = this.width
        this.context = this.timelineElement.getContext("2d")
        this.shapeTimeline = []
        this.gameInst = null
        this.maxShapes = maxShapes

        this.indexer = new Indexer(this.getDrawX(0), this.getDrawY(),
            this.index_size, this.index_size, this.context, this.indexColor);
    }

    appendTimeline(shape){
        this.shapeTimeline.push(shape)
    }

    refreshTimeline(){
        this.shapeTimeline = []
        for(let i = 0; i < this.gameInst.shapeBacklog.length; i++){
            this.shapeTimeline.push(tdGame.shapeFromName(this.gameInst.shapeBacklog[i],
                this.getDrawX(i), this.getDrawY(),
                this.size, false, this.context))
        }
    }

    getDrawX(col) {
        return this.size * (col + 1 / 2);
    }

    getDrawY() {
        //only one line so no need for argument
        return this.margin + this.size / 2 + 18; // 18 is the size of the font
    }

    updateIndexer(step) {
        this.indexer.x = this.getDrawX(step)
    }

    drawStep(){
        // Magic numbers
        let textX = 10
        let textY = 30
        this.context.fillStyle = this.fontColor
        this.context.font = this.font
        let stepString = "Step " + this.gameInst.getCurrStep()
        if(this.gameInst.settings.maxStep !== -1)
            stepString += " / " + this.gameInst.settings.maxStep
        let timerString = ""
        if(this.gameInst.settings.debug)
            timerString = " Time left: " + Math.max(0,(Timeline.msToSeconds(this.gameInst.getMaxTime() -
                this.gameInst.getCurrTime()))) + "s"
        this.context.fillText(stepString + timerString , textX, textY)

        let i = 0
        for(let shape of this.shapeTimeline){
            if(i >= this.maxShapes)
                break
            shape.draw()
            i++
        }
        this.indexer.draw()
    }

    drawBoard(){
        this.context.fillStyle = this.timelineBoardColor
        this.context.fillRect(0, 0, this.width, this.height);
    }

    draw() {
        if(!this.gameInst.settings.showTimeline)
            return
        this.drawBoard()
        this.drawStep()
        this.indexer.draw()
    }

    static msToSeconds(time) {
        let s = time / 1000
        return (Math.round(s * 100) / 100).toFixed(2)
    }
}

class Indexer {
    //sqare in the timeline canvas showing the current form to select
    constructor(x, y, w, h, ctx, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.ctx = ctx;
        this.color = color
    }

    draw() {
        this.ctx.strokeStyle = this.color;
        this.ctx.strokeRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }
}

export default Timeline
