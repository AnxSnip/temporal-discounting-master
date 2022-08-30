import gameSettings from "./gameSettings.js";

import PlayField from "./components/playfield.js";
import Timeline from "./components/timeline.js";
import TargetCanvas from "./components/targetCanvas.js";
import LearningPanel from "./components/learningPanel.js";
import tuto3Logic from "./tuto3Logic.js";
import Slider from "./components/Slider.js";

class LearningPanelTuto3 extends LearningPanel{
    constructor(canvasElement, cellSize, maxLockCount, shapeNames, top, left, stroke,height) {
        super(canvasElement, cellSize, maxLockCount, shapeNames, top, left, stroke,height);
    }

    unlockClick(event) {
        this.gameInst.stime = Date.now()
        if (this.gameInst.step === 0 || this.gameInst.step === 3 || this.gameInst.step === 6){
            this.gameInst.step++;
        }
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

    processUnlock() {
        if (this.gameInst.step === 1 || this.gameInst.step === 4 || this.gameInst.step ===7) this.gameInst.step ++;
        super.processUnlock();
    }

}


GameTuto3();

async function GameTuto3() {
    let framerate = 30

    let stroke = 2

    let settings = new gameSettings(
        [], 5,
        5000, 1,
        [3], 4, 4,
        ["Quatrefoil","Ring","Star"],
        1,1, -1, 4200, 60000000, 0,
        true, true, true)
    let shapeWeights = 5
    // Initialize game logic component
    let tdGame = new tuto3Logic(settings)
    let timelineSize = 20
    // Initialize playfield (Grid of shapes)
    let playfieldTop = 20 + 18 + 20 + 1.5*timelineSize
    let playfieldLeft = 20
    let cellSize = 430 / (4 + 2)

    let playField = new PlayField(document.getElementById("formsBoardCanvas"),
        framerate, 330, 330, settings.gridWidth, settings.gridHeight,
        cellSize, playfieldTop, playfieldLeft, stroke)

    // Initialize target canvas (Target shape indicator)
    let targetCanvasLeft = playField.width + playfieldLeft + 6
    let targetCanvas = new TargetCanvas(document.getElementById("targetCanvas"),
        160, 160, playfieldTop+20, cellSize,
        60, targetCanvasLeft, stroke)

    // Initialize target canvas (Lock status panel)
    let learningPanelLeft = targetCanvas.width + targetCanvasLeft + 10
    let learningPanel = new LearningPanelTuto3(document.getElementById("learningCanvas"),
        cellSize, 3, settings.shapeNames, playfieldTop, learningPanelLeft, stroke,330)

    let timeline = new Timeline(document.getElementById("timelineCanvas"),
        25, playfieldLeft, 64, 20,learningPanelLeft + learningPanel.width -20, playfieldTop-5)

    // Initialize button that needs to be clicked by the user to proceed to next step
    let nextButton = document.getElementById("nextButton")
    nextButton.style.display = ''
    nextButton.style.marginLeft = String(targetCanvasLeft + 14) + "px"
    nextButton.style.marginTop = String(playfieldTop +250) + "px"
    nextButton.disabled = true


    // Bind visual elements to game logic
    tdGame.bindComponents(playField, timeline, learningPanel, targetCanvas, nextButton)

    // Initialize first step
    tdGame.initNewStep()

    // Process logic and draw visual elements every frame
    function tick() {
        if (tdGame.SLmode === "p" && tdGame.notUnlocked){
            alert("You cannot click on grid during this tutorial")
            window.location.reload()
            tdGame.SLmode = null
        }
        if(tdGame.step %3 === 0){
            document.getElementById("tuto3step2").style.color = "#000000";
            document.getElementById("tuto3step3").style.color = "#00000050";
            document.getElementById("tuto3step4").style.color = "#00000050";
        }
        if (tdGame.step === 1 || tdGame.step === 4 || tdGame.step === 7){
            document.getElementById("tuto3step2").style.color = "#00000050";
            document.getElementById("tuto3step3").style.color = "#000000";
            document.getElementById("tuto3step4").style.color = "#00000050";
        }
        if (tdGame.step === 2 || tdGame.step === 5 || tdGame.step === 8){
            document.getElementById("tuto3step2").style.color = "#00000050";
            document.getElementById("tuto3step3").style.color = "#00000050";
            document.getElementById("tuto3step4").style.color = "#000000";
        }
        if (tdGame.step === 3 ) {
            document.getElementById("tuto3step5").style.display = "";
            document.getElementById("title").textContent = "PRACTICE LOCKER PANEL (2/3)";
        }
        if(tdGame.step === 6){
            document.getElementById("title").textContent = "PRACTICE LOCKER PANEL (3/3)";
            document.getElementById("tuto3step3").innerHTML = "<b>STEP 2.</b>Drag the slider back and forth until <b>you unlock one locker</b>. This is your last locker.";
            document.getElementById("tuto3step4").innerHTML = "<b>STEP 3.</b> Congratulation you have unlocked <b>expert</b> mode\nClick on “Next” to use the EXPERT mode for your next target";
            document.getElementById("tuto3step5").style.display = "none";
        }
        if(tdGame.step === 8){
            document.getElementById("tuto3step4").innerHTML = "<b>STEP 3.</b> <a style='color: red'>Congratulation you have unlocked <b>expert</b> mode<a>\nClick on “Next” to use the EXPERT mode for your next target";
        }
        if(tdGame.step === 9){
            let step1 = document.getElementById("tuto3step0");
            step1.style.color = "#000000";
            let step2 = document.getElementById("tuto3step2");
            step2.style.color = "#000000";
            document.getElementById("tuto3step3").style.display = "none";
            document.getElementById("tuto3step4").style.display = "none";
            document.getElementById("title").innerText = "EXPERT MODE UNLOCKED";
            step1.innerText = "Congratulation you have unlocked EXPERT MODE!"
            step2.innerText = "You can now click on one clover to select them all !"
            tdGame.notUnlocked = false;
        }
        if (tdGame.step === 10){
            window.location = "tutorial4.html"+window.location.search
        }
        tdGame.tick()
        tdGame.playfield.draw()
        tdGame.timeline.draw()
        tdGame.targetCanvas.draw()
        tdGame.learningPanel.draw()
    }

    setInterval(tick, 1000 / framerate)
}
