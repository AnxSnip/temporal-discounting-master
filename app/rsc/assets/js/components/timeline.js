import tdGame from "../tdGame.js";

/*Class that implements the timeline canvas
* */
class Timeline {
    constructor(timelineElement, size, left, step = 8, maxShapes = 8,width,height) {
        //size of the shapes
        this.size = size

        this.margin = 30
        this.height = maxShapes*(size+2) + 2 * this.margin
        this.width = Math.max(size * maxShapes,500)

        this.font = "bold 18px arial"
        this.fontColor = "darkgrey"
        this.indexColor = "white"

        this.timelineBoardColor = "black"
        this.colorBorder = "grey"

        this.timelineElement = timelineElement
        this.timelineElement.style.left = String(left) + "px"
        this.timelineElement.height = height
        this.timelineElement.width = width
        this.context = this.timelineElement.getContext("2d")

        this.gameInst = null
        this.maxShapes = maxShapes

        //indexer
        this.index_size = (size / 2) + 3
        this.indexer = new Indexer(this.getDrawX(0), this.getDrawY(),
            this.index_size, this.index_size, this.context, this.indexColor,this.maxShapes,this.size);

        this.step = -1
        this.learning_list = []
        this.shapeTimeline = []
    }

    appendTimeline(shape){
        this.shapeTimeline.push(shape)
    }

    //refresh the timeline after unlock or after animation
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

    //move the index rectangle
    updateIndexer(step) {
        this.indexer.x = this.getDrawX(step%this.maxShapes)
        this.indexer.y = this.getDrawY() + Math.floor(step/this.maxShapes)*(this.size/2 +10)
        this.indexer.currentBlock = Math.floor(step/this.maxShapes)
    }

    drawStep(){
        // Magic numbers
        let textX = 10
        let textY = 30

        //text
        this.context.fillStyle = this.fontColor
        this.context.font = this.font
        let stepString = this.gameInst.getOccText()
        this.context.fillText(stepString , textX, textY)

        //shapes
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

        //indexer
        this.updateIndexer(this.step)
        this.indexer.draw()

        //text
        this.context.fillStyle = "white";
        this.context.font = "bold 18px arial";
        this.context.fillText("TIMELINE OF FUTURE TARGETS", this.timelineElement.width - 300, 30);

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
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);

        let rect =new Path2D()
        rect.moveTo(0,48 + this.currentBlock*this.size)
        rect.lineTo(0,48 + (this.currentBlock+1)*this.size )
        rect.lineTo(this.size*this.maxShape,48+(this.currentBlock+1)*this.size)
        rect.lineTo(this.size*this.maxShape,48 + this.currentBlock*this.size)
        rect.lineTo(this.size,48 + this.currentBlock*this.size)
        rect.closePath()
        this.ctx.fillStyle = "#D3D3D320"
        this.ctx.fill(rect,"evenodd")
    }
}

export default Timeline
