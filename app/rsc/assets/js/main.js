import TDGame from "./tdGame.js";
import LearningPanel from "./components/learningPanel.js"
import PlayField from "./components/playfield.js";
import Timeline from "./components/timeline.js";
import TargetCanvas from "./components/targetCanvas.js";
import gameSettings from "./gameSettings.js";


//-----------------------------------------------------------------------------------
//                            MAIN FILE OF THE EXPERIENCE
//-----------------------------------------------------------------------------------


function updateIntroMsg(nTask, formsList) {
    document.getElementById("nTask").innerHTML = nTask + " tasks";
    document.getElementById("shapeList").innerHTML = "(" + formsList + ")";
}

function add(acc,a){
    return acc + a
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

//--------------------------------------------------------------------------------
//                  GAME variables to post in the database
//--------------------------------------------------------------------------------

//get the ip
let ipAddress = null;
$.getJSON("https://api.ipify.org?format=json", function(data) {
    ipAddress = data.ip;
});



let infoButton = document.querySelector(".infoButton")
infoButton.addEventListener('click', Game)

async function Game() {
    //mobile tablet check
    if (window.mobileAndTabletCheck()){
        document.getElementById("mobileRestriction").style.display = '';
        document.getElementById("explainGame").style.display = 'none';
        return;
    }

    //refresh check
    let reload = sessionStorage.getItem("Reloaded")
    if (!reload) {reload = 0} else {reload = parseInt(reload)}

    // Hide experiment prompt
    document.getElementById('explainGame').style.display='none'

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
        fetch('/lockDecider', options).then(r => r.json()).then(lDecJson => {
            let lockDecider = lDecJson.value
            // Initialize setting object
            let weights = shuffle(json.weights)
            let settings = new gameSettings(
                weights, json.nbTargets,
                json.timeLearning, json.nbSliders,
                json.nbLocks, json.gridWidth, json.gridHeight,
                json.shapeNames, json.maxStep,json.nbBlock, json.maxTimer, json.noviceTime, json.breakTimer, lockDecider,
                json.showTimeline, json.easyMode, json.debug)

            let shapeWeights = json.weights.reduce(add,0);
            // Initialize game logic component
            let tdGame = new TDGame(settings, ipAddress)

            let timelineSize = 25
            // Initialize playfield (Grid of shapes)
            let playfieldTop = 20 + 18 + 20 + (1.5*timelineSize) * json.nbBlock
            let playfieldLeft = 20
            let playfieldHeight = 400
            let playfieldWidth = 400
            let cellSize = 500 /(4 + 2)
            let playField = new PlayField(document.getElementById("formsBoardCanvas"),
                framerate, playfieldHeight, playfieldWidth, settings.gridWidth, settings.gridHeight,
                cellSize, playfieldTop, playfieldLeft, stroke)

            // Initialize target canvas (Target shape indicator)
            let targetCanvasLeft = playField.width + playfieldLeft + 6
            let targetCanvas = new TargetCanvas(document.getElementById("targetCanvas"),
                160, 160, playfieldTop+50, cellSize,
                 60, targetCanvasLeft, stroke)

            // Initialize target canvas (Lock status panel)
            let learningPanelLeft = targetCanvas.width + targetCanvasLeft + 10
            let learningPanel = new LearningPanel(document.getElementById("learningCanvas"),
                50, settings.nbLocks, settings.shapeNames, playfieldTop, learningPanelLeft, stroke,435)

            // Initialize timeline
            let timeline = new Timeline(document.getElementById("timelineCanvas"),
                timelineSize, playfieldLeft, 64, shapeWeights,learningPanelLeft + learningPanel.width -20, playfieldTop-5)

            // Initialize button that needs to be clicked by the user to proceed to next step
            let nextButton = document.getElementById("nextButton")
            nextButton.style.display = ''
            nextButton.style.top = String(500) + "px;"
            nextButton.style.marginLeft = String(targetCanvasLeft + 4) + "px"
            nextButton.style.marginTop = String(playfieldTop +280) + "px"
            nextButton.disabled = true

            // Bind visual elements to game logic
            tdGame.bindComponents(playField, timeline, learningPanel, targetCanvas, nextButton)

            //register data before refresh or close
            window.addEventListener("beforeunload", function(event) {
                fetch('/r'+window.location.search)
                sessionStorage.setItem("Reloaded",String(reload + 1))
                if(!tdGame.gameEnded){
                    tdGame.endGame(reload + 1,0)
                    let params = new URLSearchParams(window.location.search);
                    let p_id = params.get("PROLIFIC_PID");
                    let stud_id = params.get("STUDY_ID");
                    let session_id = params.get("SESSION_ID");
                    if (!p_id) p_id = "none";
                    if (!stud_id) stud_id = -1;
                    if (!session_id) session_id = -1;

                    let str = String(ipAddress)+","+ p_id +","+ stud_id + "," + session_id + ","+"reloaded" + String(reload)+"\n"
                    let options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({value: str})
                    }
                    fetch('/userInfo', options).then(r => function (r) {
                        console.log('Log status: ' + r)
                    })
                }
            });


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
