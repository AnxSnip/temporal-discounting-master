import tdGame from "../tdGame.js";

class Timeline {
    constructor(timelineElement, size, left, step = 8, maxShapes = 8,width,height) {
        this.size = size
        this.margin = 20
        this.index_size = (size / 2) + 3
        this.height = maxShapes*(size+1) + 2 * this.margin
        this.width = Math.max(size * maxShapes,500)
        this.font = "bold 24px arial"
        this.fontColor = "darkgrey"
        this.indexColor = "black"
        this.timelineBoardColor = "gainsboro"
        this.colorBorder = "grey"

        this.timelineElement = timelineElement
        this.timelineElement.style.left = String(left) + "px"
        this.timelineElement.height = height
        this.timelineElement.width = width
        this.context = this.timelineElement.getContext("2d")
        this.shapeTimeline = []
        this.gameInst = null
        this.maxShapes = maxShapes
        this.indexer = new Indexer(this.getDrawX(0), this.getDrawY(),
            this.index_size, this.index_size, this.context, this.indexColor,this.maxShapes,this.size);
        this.step = -1
        this.learning_list = []
    }

    appendTimeline(shape){
        this.shapeTimeline.push(shape)
    }

    refreshTimeline(){
        this.shapeTimeline = []
        for(let i = 0; i < this.gameInst.shapeBacklog.length; i++){
            this.shapeTimeline.push(tdGame.shapeFromName(this.gameInst.shapeBacklog[i],
                this.getDrawX(i%this.maxShapes), this.getDrawY() + Math.floor(i/this.maxShapes)*(this.size/2 +10),
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
        this.indexer.x = this.getDrawX(step%this.maxShapes)
        this.indexer.y = this.getDrawY() + Math.floor(step/this.maxShapes)*(this.size/2 +10)
        this.indexer.currentBlock = Math.floor(step/this.maxShapes)
    }

    drawStep(){
        // Magic numbers
        let textX = 10
        let textY = 30
        this.context.fillStyle = this.fontColor
        this.context.font = this.font
        let stepString = "Completed tasks " + String(this.gameInst.getCurrStep() -1)
        if(this.gameInst.settings.maxStep !== -1)
            stepString += " / " + this.gameInst.settings.maxStep
        let timerString = ""
        if(this.gameInst.settings.debug)
            timerString = " Time passed: " + Math.max(0,(Timeline.msToSeconds(this.gameInst.getCurrTime()))) + "s"
        this.context.fillText(stepString + timerString , textX, textY)

        let i = 0
        for(let shape of this.shapeTimeline){
            if(i<this.step){
                shape.grey = true
            }
            if(i in this.learning_list){
                shape.learning = true
            }
            shape.draw()
            i++
        }
        this.updateIndexer(this.step)
        this.indexer.draw()

        //TODO change this
        this.context.fillStyle = "black";
        this.context.font = "bold 18px arial";
        this.context.fillText("TIMELINE", this.timelineElement.width - 100, this.timelineElement.height -5);

    }

    drawBoard(){
        this.context.lineWidth = 2;
        this.context.fillStyle = this.timelineBoardColor
        this.context.strokeStyle = this.colorBorder
        this.context.fillRect(0, 5, this.timelineElement.width, this.timelineElement.height);
        this.context.strokeRect(1, 5,
            this.timelineElement.width - 2, this.timelineElement.height-6)
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
        return (Math.round(s * 100) / 100).toFixed(0)
    }
}

class Indexer {

    //square in the timeline canvas showing the current form to select
    constructor(x, y, w, h, ctx, color,maxShape,size) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.ctx = ctx;
        this.color = color
        this.currentBlock = 0
        this.maxShape = maxShape
        this.size = size
    }

    draw() {
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);

        let rect =new Path2D()
        rect.moveTo(0,38 + this.currentBlock*this.size)
        rect.lineTo(0,38 + (this.currentBlock+1)*this.size )
        rect.lineTo(this.size*this.maxShape,38+(this.currentBlock+1)*this.size)
        rect.lineTo(this.size*this.maxShape,38 + this.currentBlock*this.size)
        rect.lineTo(this.size,38 + this.currentBlock*this.size)
        rect.closePath()
        this.ctx.fillStyle = "#D3D3D320"
        this.ctx.fill(rect,"evenodd")

    }
}

export default Timeline
