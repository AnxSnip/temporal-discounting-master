import gameSettings from "./gameSettings.js";

import PlayField from "./components/playfield.js";
import Timeline from "./components/timeline.js";
import TargetCanvas from "./components/targetCanvas.js";
import LearningPanel from "./components/learningPanel.js";
import tuto4Logic from "./tuto4Logic.js";
import Slider from "./components/Slider.js";

class LearningPanelTuto4 extends LearningPanel{
    constructor(canvasElement, cellSize, maxLockCount, shapeNames, top, left, stroke,height) {
        super(canvasElement, cellSize, maxLockCount, shapeNames, top, left, stroke,height);
    }

    unlockClick(event) {
        this.gameInst.stime = Date.now()
        if(!this.unlockButtonClickable)
            return
        this.gameInst.SLmode = "l"
        let x = event.offsetX
        let y = event.offsetY
        let targetShapeDisplay = this.getTargetShape()
        if(this.unlockButton.contains(x, y)){
            this.slider = new Slider(this, this.top + this.unlockButton.top,
                this.left + this.width* 0.15, this.width * 0.7,
                targetShapeDisplay.colorUnlit, this.gameInst.sliderDuration)
            this.displayUnlockButton = false
            this.unlockButtonClickable = false
            document.body.style.cursor = "auto";

            let shape = this.gameInst.currShape
            this.gameInst.addLearningStep(shape)
            setTimeout(f => this.gameInst.timeline.refreshTimeline(),
                1000)
            this.gameInst.animate(this.gameInst.settings.shapeNames.indexOf(shape))
        }
    }

    getShapeIndex(){
        switch (this.gameInst.currShape){
            case "Quatrefoil":
                return 0;
            case "Ring":
                return 1;
            case "Star":
                return 2;
            default:
                console.log('error at getting learning shape')
        }
    }
}

document.getElementById("nextPagebutton").addEventListener('click',function (){
    let a =document.getElementById("part1")
    a.style.display = "none"
    let b = document.getElementById("part2")
    b.style.display = 'block'
    let c = document.getElementById("explainGameBox")
    c.className = "infoBoxTuto3"
    document.getElementById("nextPagebutton").style.display="none";
    document.getElementById("board").style.display="";
    GameTuto4();
})

async function GameTuto4() {

    let path = "testSettings/testSettings.json"

    // Get game settings
    fetch(path).then(response => response.json()).then(json => {
        let framerate = 30
        let stroke = 2
        let options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Get number of locks to use
        fetch('/lockDeciderTuto', options).then(r => r.json()).then(lDecJson => {
            let lockDecider = lDecJson.value
            let settings = new gameSettings(
                [],  json.nbTargets,
                json.timeLearning, json.nbSliders,
                json.nbLocks, json.gridWidth, json.gridHeight,
                ["Quatrefoil","Ring","Star"], 5,1, -1, json.noviceTime, json.breakTimer, lockDecider,
                json.showTimeline, json.easyMode, json.debug)
            // Initialize game logic component
            let tdGame = new tuto4Logic(settings)
            let timelineSize = 20
            // Initialize playfield (Grid of shapes)
            let playfieldTop = 20 + 18 + 20 + 1.5 * timelineSize
            let playfieldLeft = 20
            let cellSize = 430 / (json.gridWidth + 2)

            let playField = new PlayField(document.getElementById("formsBoardCanvas"),
                framerate, 330, 330, json.gridWidth, json.gridWidth,
                cellSize, playfieldTop, playfieldLeft, stroke)

            // Initialize target canvas (Target shape indicator)
            let targetCanvasLeft = playField.width + playfieldLeft + 6
            let targetCanvas = new TargetCanvas(document.getElementById("targetCanvas"),
                160, 160, playfieldTop + 50, cellSize,
                60, targetCanvasLeft, stroke)

            // Initialize target canvas (Lock status panel)
            let learningPanelLeft = targetCanvas.width + targetCanvasLeft + 10
            let learningPanel = new LearningPanelTuto4(document.getElementById("learningCanvas"),
                50, settings.nbLocks, settings.shapeNames, playfieldTop, learningPanelLeft, stroke,330)
            let board = document.getElementById("board")
            if (board.getBoundingClientRect().width < learningPanelLeft + learningPanel.width + 10) board.style.width = String(learningPanelLeft + learningPanel.width + 10) + "px";
            let timeline = new Timeline(document.getElementById("timelineCanvas"),
                timelineSize, playfieldLeft, 64, 64, learningPanelLeft + learningPanel.width -20, playfieldTop - 5)

            // Initialize button that needs to be clicked by the user to proceed to next step
            let nextButton = document.getElementById("nextButton")
            nextButton.style.display = ''
            nextButton.style.marginLeft = String(targetCanvasLeft + 14) + "px"
            nextButton.style.marginTop = String(playfieldTop + 280) + "px"
            nextButton.disabled = true


            // Bind visual elements to game logic
            tdGame.bindComponents(playField, timeline, learningPanel, targetCanvas, nextButton)
            // Initialize first step
            tdGame.initNewStep()

            // Process logic and draw visual elements every frame
            function tick() {
                let title = document.querySelector(".infoTitle")
                let text2 = document.getElementById("textPart2")
                if(tdGame.step===1 || tdGame.step===2){
                    tdGame.SLmode= "l"
                    title.textContent = "PRACTICE THE LOCKER PANEL"
                    text2.style.display="none"
                    document.getElementById("step2").style.display = "";
                }
                if(tdGame.step===3|| tdGame.step===4){
                    document.getElementById("step2").style.display = "none";
                    text2.style.display="";
                    title.innerHTML="PRACTICE THE EXPERT MODE"
                    text2.innerHTML = "Click on <b>only one</b> target symbol below as fast as possible."
                }
                if(tdGame.step===0|| tdGame.step===5||tdGame.step ===6){
                    tdGame.SLmode = "p"
                    tdGame.learningPanel.unlockButtonClickable = false
                    title.textContent = "PRACTICE THE NOVICE MODE";
                    text2.innerText='Click on all target symbols below as fast as possible.'
                }
                if(tdGame.step===7){
                    window.location = "tutorial5.html"+window.location.search
                }
                tdGame.tick()
                tdGame.playfield.draw()
                tdGame.timeline.draw()
                tdGame.targetCanvas.draw()
                tdGame.learningPanel.draw()
            }

            setInterval(tick, 1000 / framerate)
        })
    })
}
