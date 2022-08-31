
/*Class that implements the slider */
class Slider {
    constructor(parent, top, left, width, color = "darkorange", sliderDuration = 1000, slideThreshold = 4) {
        this.parent = parent

        this.display = false
        this.startTime = null
        this.sliderDuration = sliderDuration

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

        document.getElementById("board").appendChild(this.canvasElement)

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

export default Slider