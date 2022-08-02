import TDGame from "./tdGame.js";
import LearningPanel from "./components/learningPanel.js"
import PlayField from "./components/playfield.js";
import Timeline from "./components/timeline.js";
import TargetCanvas from "./components/targetCanvas.js";
import gameSettings from "./gameSettings.js";


//-----------------------------------------------------------------------------------
//                            GAME PARAMETERS
//-----------------------------------------------------------------------------------


function updateIntroMsg(nTask, formsList) {
    document.getElementById("nTask").innerHTML = nTask + " tasks";
    document.getElementById("shapeList").innerHTML = "(" + formsList + ")";
}


//--------------------------------------------------------------------------------
//                  GAME variables to post in the database
//--------------------------------------------------------------------------------

let ipAddress = null;
$.getJSON("https://api.ipify.org?format=json", function(data) {
    ipAddress = data.ip;
});

let infoButton = document.querySelector(".infoButton")
infoButton.addEventListener('click', Game)

async function Game() {
    // Hide experiment prompt
    document.getElementById('explainGame').style.display='none'

    let path = "testSettings/testSettings.json"

    // Get game settingggs
    fetch(path).then(response => response.json()).then(json => {
        let framerate = 30
        let cellSize = 80
        let stroke = 2

        let options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Get number of locks to use
        fetch('/lockDecider', options).then(r => r.json()).then(lDecJson => {
            let lockDecider = lDecJson.value
            // Initialize setting object
            let settings = new gameSettings(
                [], json.triWeight, json.cirWeight, json.squWeight,
                json.croWeight, json.nbTargets,
                json.timeLearning, json.nbSliders,
                json.nbLocks, json.gridWidth, json.gridHeight,
                json.shapeNames, json.maxStep, json.maxTimer, json.noviceTime, json.breakTimer, lockDecider,
                json.showTimeline, json.easyMode, json.debug)
            let shapeWeights = json.triWeight + json.cirWeight + json.squWeight + json.croWeight

            // Initialize game logic component
            let tdGame = new TDGame(settings, ipAddress)

            // Initialize playfield (Grid of shapes)
            let playfieldTop = 60
            let playfieldLeft = 20
            // TODO: This should be determined depending on grid size
            let playfieldHeight = 510
            let playfieldWidth = 495
            let playField = new PlayField(document.getElementById("formsBoardCanvas"),
                framerate, playfieldHeight, playfieldWidth, settings.gridWidth, settings.gridHeight,
                cellSize, playfieldTop, playfieldLeft, stroke)

            // Initialize target canvas (Target shape indicator)
            let targetCanvasLeft = playField.width + playfieldLeft + 6
            let targetCanvas = new TargetCanvas(document.getElementById("targetCanvas"),
                160, 160, 50, cellSize, 33, 2/3 * 160,
                10, 160/2, 130, 60, targetCanvasLeft, stroke)

            // Initialize target canvas (Lock status panel)
            let learningPanelLeft = targetCanvas.width + targetCanvasLeft + 10
            let learningPanel = new LearningPanel(document.getElementById("learningCanvas"),
                cellSize, settings.nbLocks, settings.shapeNames, playfieldTop, learningPanelLeft, stroke)

            // Initialize timeline
            let timeline = new Timeline(document.getElementById("timelineCanvas"),
                20, playfieldLeft, 64, shapeWeights * 6)

            // Initialize button that needs to be clicked by the user to proceed to next step
            let nextButton = document.getElementById("nextButton")
            nextButton.style.display = ''
            nextButton.style.top = String(500) + "px;"
            nextButton.style.marginLeft = String(targetCanvasLeft + 4) + "px"
            nextButton.style.marginTop = String(280) + "px"
            nextButton.disabled = true

            // Bind visual elements to game logic
            tdGame.bindComponents(playField, timeline, learningPanel, targetCanvas, nextButton)

            // Initialize first step
            tdGame.initNewStep()

            // Process logic and draw visual elements every frame
            function tick() {
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
