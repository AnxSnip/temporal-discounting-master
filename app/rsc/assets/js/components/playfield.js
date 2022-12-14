
/*Class that implements the grid
* */
class PlayField {
    constructor(canvasElement, framerate, height, width, nbRow, nbCol, cellSize, top, left, stroke) {
        this.height = height
        this.width = width
        this.cellSize = cellSize
        this.stroke = stroke
        this.margin = 0.75 * cellSize

        this.colorBoard = "black"
        this.colorBorder = "grey"

        this.gameInst = null
        this.canvasElement = canvasElement
        this.canvasElement.height = this.height
        this.canvasElement.width = this.width

        this.grid = []
        this.canvasElement.style.top = String(top) + "px"
        this.canvasElement.style.left = String(left) + "px"
        this.context = this.canvasElement.getContext("2d")
        this.context.lineWidth = this.stroke

        this.canvasElement.addEventListener("mousemove", (event) => this.highlightShape(event))
        this.canvasElement.addEventListener("mousedown", (event) => this.selectShape(event))
    }

    gridX(col) {
        return this.cellSize * (col) + this.margin
    }

    gridY(row) {
        return this.margin + this.cellSize * row
    }

    highlightShape(event) {
        let x = event.offsetX;
        let y = event.offsetY;
        document.body.style.cursor = "auto";
        for (let row of this.gameInst.currShapeGrid) {
            for (let shape of row) {
                shape.highlight = false
            }
        }

        for (let row of this.gameInst.currShapeGrid) {
            for (let shape of row) {
                if (shape.contains(x, y, this.gameInst.settings.easyMode) && !shape.selected) {
                    shape.highlight = true
                    document.body.style.cursor = "pointer";
                    if(this.gameInst.SLmode === "l"){
                        document.body.style.cursor = "not-allowed";
                    }
                    return
                }
            }
        }
    }

    selectShape(event) {
        if (this.gameInst.SLmode ==null){
            this.gameInst.SLmode = "p"
            this.gameInst.learningPanel.unlockButtonClickable = false
        }
        if (this.gameInst.SLmode === "p"){
            let x = event.offsetX;
            let y = event.offsetY;
            for (let row = 0; row < this.gameInst.currShapeGrid.length; row++) {
                for (let col = 0; col < this.gameInst.currShapeGrid[row].length; col++) {
                    let shape = this.gameInst.currShapeGrid[row][col]
                    if(shape.contains(x, y, this.gameInst.settings.easyMode) && !shape.selected){
                        this.gameInst.selectShape(row, col)
                    }
                }
            }
        }else {
            //nothing
        }
    }

    draw() {
        this.drawBoard()
        this.drawShapes()
    }

    drawBoard(){
        //board
        this.context.fillStyle = this.colorBoard
        this.context.strokeStyle = this.colorBorder
        this.context.fillRect(0, 0, this.width, this.height)
        this.context.strokeRect(this.stroke / 2, this.stroke / 2,
            this.width - this.stroke, this.height - this.stroke)

        //text at the bottom
        this.context.fillStyle = "white";
        this.context.font = "bold 18px arial";
        this.context.textAlign = "center";
        this.context.fillText("GRID", this.width / 2, this.height -25);
        this.context.font = "14px arial";
        if(this.gameInst.isShapeUnlocked(this.gameInst.currShape)){
            this.context.fillText("Click on only one target symbol as fast as possible",this.width / 2, this.height -10)
        }else{
            this.context.fillText("Click on all target symbols above as fast as possible",this.width / 2, this.height -10)
        }
    }

    drawShapes(){
        for(let row of this.gameInst.currShapeGrid){
            for(let shape of row){
                shape.draw()
            }
        }
    }
}

export default PlayField