
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

        this.top = top
        this.left = left
        this.width = width

        this.canvasElement.addEventListener("mousemove", (event) => this.setCursorStyleGrab(event))
        this.canvasElement.addEventListener("mouseup", (event) => this.mouseUp(event))
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
        this.bar = null
    }

    onInput(event){
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

        if(this.nbSlide === this.slideThreshold && !this.sliderAccept) {
            this.sliderAccept = true
            let child = document.createElement('div');
            child.id = "bar"
            child.style.width = String(40)+"px";
            child.style.height = String(40)+"px";
            child.style.position = "absolute";
            child.style.left = String(this.left + this.width + 5)+"px"
            child.style.top = String(this.top)+"px"
            document.getElementById("board").appendChild(child)
            this.bar = new ProgressBar.Circle(child, {
                strokeWidth: 14,
                easing: 'easeInOut',
                duration:this.sliderDuration,
                color: this.canvasElement.style.backgroundColor,
                trailColor: '#eee',
                trailWidth: 1,
                svgStyle: null
            });
            this.bar.animate(1);
        }

        if(Date.now() - this.startTime > this.sliderDuration - 250 && this.sliderAccept){
            this.parent.processUnlock()
        }
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
        if(this.bar){
            this.bar.set(0)
            this.bar.animate(1)
        }
    }

    mouseUp(){
        this.canvasElement.style.cursor = 'grab';
        if(this.bar) {
            this.bar.set(0)
        }
    }

    getLifeTime() {
        return Date.now() - this.sliderDateAppearance
    }

    killSlider(){
        try{
            document.getElementById('slider').remove()
            document.getElementById('bar').remove()
        } catch {
            console.log('slider already killed')
        }
    }
}

export default Slider