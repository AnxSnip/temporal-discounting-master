import Quatrefoil from "./shapes/quatrefoil.js"
import Ring from "./shapes/ring.js";
import Star from "./shapes/star.js";



//-----------------------------------------------------------------------------------
//                            GAME PARAMETERS
//-----------------------------------------------------------------------------------
var STEP = 3;
var NB_LOCKS2 = 0;
var formsList = ["Star", "Ring", "Quatrefoil"];
var NB_TARGET_TO_SELECT = 6;
var startTime = null
var stopTime = null
var displayTimeline = true;
const learningState = { 'Star': 0, 'Ring': 0, 'Quatrefoil': 0};


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}
//launch Game
GameTuto2();

function GameTuto2() {

    class Indexer {
        //sqare in the timeline canvas showing the current form to select
        constructor(x, y, w, h, ctx = ctxTimeline) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.ctx = ctx;
        }

        draw() {
            this.ctx.strokeStyle = COLOR_INDEX;
            this.ctx.strokeRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
        }
    }

    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    //                        set up the timeline canvas

    const MIN_SIZE = 20;
    const TL_MARGIN = 20; //Timeline margin to write step
    const INDEX_SIZE = MIN_SIZE / 2 + 3;
    const TL_HEIGHT = MIN_SIZE + 2 * TL_MARGIN; //timeline height
    const TL_WIDTH = 550; //timeline width

    const COLOR_FONT = "darkgrey";
    const COLOR_INDEX = "darkgrey";
    const COLOR_TIMELINEBOARD = "whitesmoke";

    var canvTimeline = document.getElementById("timelineCanvasTuto2");
    canvTimeline.height = TL_HEIGHT;
    canvTimeline.width = TL_WIDTH;
    document.getElementById("ExplainText").innerHTML = "Click on <b>only one</b> <a style='color: #2ed22a'>Clover</a> below as fast as possible."
    document.getElementById("infoTitle").innerText = "Practice expert mode 1/3"
    var currentStep = 0;

    //set up context
    var ctxTimeline = canvTimeline.getContext("2d");
    //index
    var indexStep = new Indexer(getTimelineGridX(0), getTimelineGridY(), INDEX_SIZE, INDEX_SIZE);

    var formTimeline = [new Quatrefoil(getTimelineGridX(0), getTimelineGridY(), MIN_SIZE, false, ctxTimeline),
        new Star(getTimelineGridX(1), getTimelineGridY(), MIN_SIZE, false, ctxTimeline),
        new Ring(getTimelineGridX(2), getTimelineGridY(), MIN_SIZE, false, ctxTimeline)];

    var nameCurrentForm = formTimeline[0].constructor.name;


    //-------------------------------- functions ---------------------------------

    function getTimelineGridX(col) {
        //to think about clarify this lines
        return MIN_SIZE * (col + 1 / 2);
    }

    function getTimelineGridY() {
        //only one line so no need for argument
        return TL_MARGIN + MIN_SIZE / 2 + 18; //18 is the size of the font
    }

    function drawStep() {
        let timerString =""
        if(startTime!==null){
            if (stopTime === null){
                timerString = " Time passed: " + Math.max(0,(msToSeconds(Date.now() - startTime))) + "s"
            }else{
                timerString = " Time passed: " + Math.max(0,(msToSeconds(stopTime - startTime))) + "s"
            }
        }
        ctxTimeline.fillStyle = COLOR_FONT;
        ctxTimeline.font = "bold 18px arial";
        let stepString = "Step " + (currentStep + 1) + "/" + STEP
        ctxTimeline.fillText(stepString+timerString, 2, 23);
        if (displayTimeline) {
            for (let form of formTimeline) {
                form.draw();
            }
            indexStep.draw();
        }
    }

    function drawTimelineBoard() {
        ctxTimeline.fillStyle = COLOR_TIMELINEBOARD;
        ctxTimeline.fillRect(0, 0, TL_WIDTH, TL_HEIGHT);
    }
    //-----------------------------------------------------------------------------------
    //                              set up formBoardCanvas
    //-------------------------------------------------------------------------------------
    //game parameters
    const FPS = 30; //frames per second
    const HEIGHT = 382;
    const WIDTH = 371;
    const GRID_SIZE = 5; //number of rows(and columns)

    const CELL = WIDTH / (GRID_SIZE + 2); //size of cells
    const STROKE = CELL / 12; //stroke width
    const MARGIN = 3 / 2 * CELL; //HEIGHT - (GRID_SIZE + 1) * CELL; //top margin for scores

    //colours
    const COLOR_BOARD = "gainsboro";
    const COLOR_BOARDER = "grey";


    //set up game canvas 
    var canv = document.getElementById("formsBoardCanvasTuto2");
    canv.height = HEIGHT;
    canv.width = WIDTH;
    canv.style.marginTop = String(TL_HEIGHT) + "px";

    //set up context
    var ctxFormsBoard = canv.getContext("2d");
    ctxFormsBoard.lineWidth = STROKE;


    //start a new game with tab of differents forms
    var boardInfos = newGame(formTimeline[0].constructor.name);
    var formsBoard = boardInfos.formsBoard;
    var nbFormToSelect = boardInfos.nbFormToSelect;
    var nbCurrentFormSelected = 0;

    //event handlers
    canv.addEventListener("mousemove", highlightForm); //add highlights just with mousemouve
    canv.addEventListener("mousedown", selectForm); //add highlights with mouse click

    //-----------------functions----------------
    function loop() {
        drawBoard();
        drawForms(formsBoard);
        drawTimelineBoard();
        drawStep();
        drawTarget();
    }

    function drawBoard() {
        ctxFormsBoard.fillStyle = COLOR_BOARD;
        ctxFormsBoard.strokeStyle = COLOR_BOARDER;
        ctxFormsBoard.fillRect(0, 0, WIDTH, HEIGHT);
        ctxFormsBoard.strokeRect(STROKE / 2, STROKE / 2, WIDTH - STROKE, HEIGHT - STROKE);

        ctxFormsBoard.fillStyle = "black";
        ctxFormsBoard.font = "bold 18px arial";
        ctxFormsBoard.textAlign = "center";
        ctxFormsBoard.fillText("GRID", WIDTH / 2, HEIGHT -25);
    }

    function drawForms(formsBoard) {
        for (let row of formsBoard) {
            for (let form of row) {
                form.draw();
            }
        }
    }

    function getGridX(col) {
        //to think about clarify this lines
        return CELL * (col + 1) + CELL / 3; //the last part (cell/3 is a total magic number)
    }

    function getGridY(row) {
        return MARGIN + CELL * row;
    }

    function newGame(selectableForm) { //add number of each form or the proportion in the futur
        var prepareFormsBoard = [];
        var prepareFormsList = formsList.slice(0, formsList.indexOf(selectableForm)).concat(formsList.slice(formsList.indexOf(selectableForm) + 1));

        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (i * GRID_SIZE + j < NB_TARGET_TO_SELECT) {
                    prepareFormsBoard[i * GRID_SIZE + j] = selectableForm;
                } else {
                    prepareFormsBoard[i * GRID_SIZE + j] = prepareFormsList[Math.floor(Math.random() * prepareFormsList.length)];
                }
            }
        }
        shuffle(prepareFormsBoard);
        formsBoard = [];
        nbFormToSelect = 0;
        for (var i = 0; i < GRID_SIZE; i++) {
            formsBoard[i] = [];
            for (var j = 0; j < GRID_SIZE; j++) {
                switch (prepareFormsBoard[i * GRID_SIZE + j]) {
                    case "Star":
                        formsBoard[i][j] = new Star(getGridX(j), getGridY(i), CELL, selectableForm === "Star", ctxFormsBoard)
                        nbFormToSelect += selectableForm === "Star" ? 1 : 0;
                        break;
                    case "Ring":
                        formsBoard[i][j] = new Ring(getGridX(j), getGridY(i), CELL, selectableForm === "Ring", ctxFormsBoard)
                        nbFormToSelect += selectableForm === "Ring" ? 1 : 0;
                        break;
                    case "Quatrefoil":
                        formsBoard[i][j] = new Quatrefoil(getGridX(j), getGridY(i), CELL, selectableForm === "Quatrefoil", ctxFormsBoard)
                        nbFormToSelect += selectableForm === "Quatrefoil" ? 1 : 0;
                        break;
                    default:
                        console.log("Error while selecting forms for the timeline");
                        break;
                }
            }
        }
        return { formsBoard: formsBoard, nbFormToSelect: nbFormToSelect };
    }

    function highlightForm( /* type MouseEvent*/ event) {
        //highlights forms inside the forms board canvas
        //get mouse position relative to the canvas
        let x = event.offsetX;
        let y = event.offsetY;
        //reset cursor
        document.body.style.cursor = "auto";
        //clear previous highlight
        for (let row of formsBoard) {
            for (let form of row) {
                form.highlight = false; //create this attribute
            }
        }
        //look for forms to highlight
        OUTER: for (let row of formsBoard) {
            for (let form of row) {
                if (form.contains(x, y,true) && !form.selected) {
                    form.highlight = true; //create this attribute !
                    document.body.style.cursor = "pointer";
                    break OUTER; //if one form is to highlight no need to look further
                }
            }
        }
    }

    function selectForm( /* type MouseEvent*/ event) {
        //get mouse position relative to the canvas
        if(startTime===null){
            startTime = Date.now()
        }
        let x = event.offsetX;
        let y = event.offsetY;

        //look for forms to select
        var selectAllUnlockForm = 'none';
        OUTER: for (let row of formsBoard) {
            for (let form of row) {
                if (form.contains(x, y,true) && !form.selected) {
                    if (!form.selectable) {
                        form.vibrate = true;
                    } else {
                        form.selected = true;
                        nbCurrentFormSelected++;
                        if (learningState[form.constructor.name] === NB_LOCKS2) {
                            selectAllUnlockForm = form.constructor.name;
                        } else if (nbCurrentFormSelected >= nbFormToSelect) {
                            stopTime = Date.now()
                            document.getElementById("nextButtonTuto1").disabled = false;
                        }
                        break OUTER; //if one form is to highlight no need to look further
                    }
                }
            }
        }

        if (selectAllUnlockForm !== 'none') {
            for (let row of formsBoard) {
                for (let form of row) {
                    if (form.constructor.name === selectAllUnlockForm && form.selectable && !form.selected) {
                        form.selected = true; //create this attribute !
                        nbCurrentFormSelected++;
                    }
                }

            }
            stopTime = Date.now()
            document.getElementById("nextButtonTuto2").disabled = false;
        }
    }

    function gameUpdate() {
        startTime = null
        stopTime = null
        formTimeline[currentStep].highlight = true;
        currentStep++;
        let TextElement = document.getElementById("ExplainText")
        let TextTitle = document.getElementById("infoTitle")

        if (currentStep >= STEP) {
            console.log("END OF THE GAME");
            window.location = "tuto2_1.html"+window.location.search
            return;
        }
        if(currentStep === 1 ){
            TextElement.innerHTML = "Click on <b>only one</b> <a style='color: #eaea11'>Star</a> below as fast as possible."
            TextTitle.innerText = "Practice: Expert Mode (2/3)"
        }
        if(currentStep === 2 ){
            TextElement.innerHTML = "Click on <b>only one</b> <a style='color: #169de1'>Ring</a> below as fast as possible."
            TextTitle.innerText = "Practice: Expert Mode (3/3)"
        }
        //set current parameters
        nameCurrentForm = formTimeline[currentStep].constructor.name;
        indexStep.x = getTimelineGridX(currentStep);
        currentTarget = createTarget(nameCurrentForm)
        boardInfos = newGame(nameCurrentForm); //learningState[nameCurrentForm] == NB_LOCKS2 ? 'nothing to select' : nameCurrentForm);
        formsBoard = boardInfos.formsBoard;
        nbFormToSelect = boardInfos.nbFormToSelect;
        nbCurrentFormSelected = 0;
        nextButton.disabled = true;

    }

    //------------------------------------------------------------------------------
    //                             targetCanvas
    //------------------------------------------------------------------------------

    const TC_HEIGHT = 160; //target canvas height
    const TC_WIDTH = 160; //target canvas width
    const TC_TOP_MARGIN = 50;
    const TC_CELL = 100;
    const TARGET_COLOR_FONT = "red";

    var targetCanvas = document.getElementById("targetCanvasTuto2");
    targetCanvas.height = TC_HEIGHT;
    targetCanvas.width = TC_WIDTH;
    targetCanvas.style.marginTop = String(TL_HEIGHT + TC_TOP_MARGIN) + "px";
    targetCanvas.style.left = String(WIDTH + STROKE) + "px";

    //set up context
    var ctxTarget = targetCanvas.getContext("2d");
    ctxTarget.lineWidth = STROKE;

    var currentTarget = createTarget(formTimeline[0].constructor.name);

    //--------------------------------  function ---------------------------------

    function drawTarget() {
        //draw Target Board
        ctxTarget.fillStyle = COLOR_BOARD;
        ctxTarget.strokeStyle = COLOR_BOARDER;
        ctxTarget.fillRect(0, 0, TC_WIDTH, TC_HEIGHT);
        ctxTarget.strokeRect(STROKE / 2, STROKE / 2, TC_WIDTH - STROKE, TC_HEIGHT - STROKE);
        //draw the target
        currentTarget.draw();
        ctxTarget.fillStyle = currentTarget.getColor();
        ctxTarget.font = "bold 18px arial";
        ctxTarget.textAlign = "center";
        ctxTarget.fillText("TARGET", TC_WIDTH / 2, TC_HEIGHT -25);
    }

    function createTarget(currentTargetName) {
        //creation of the target form
        switch (currentTargetName) {
            case "Star":
                currentTarget = new Star(TC_WIDTH / 2, TC_HEIGHT / 2, TC_CELL, false, ctxTarget);
                break;
            case "Ring":
                currentTarget = new Ring(TC_WIDTH / 2, TC_HEIGHT / 2, TC_CELL, false, ctxTarget);
                break;
            case "Quatrefoil":
                currentTarget = new Quatrefoil(TC_WIDTH / 2, TC_HEIGHT / 2, TC_CELL, false, ctxTarget);
                break;
            default:
                console.log("Error while selecting forms for the target");
                break;
        }
        return currentTarget;
    }

    function msToSeconds(time) {
        let s = time / 1000
        return (Math.round(s * 100) / 100).toFixed(2)
    }

    //------------------------------------------------------------------------------
    //                              Button
    //------------------------------------------------------------------------------

    var nextButton = document.getElementById("nextButtonTuto2");
    nextButton.style.display = '';
    nextButton.style.marginLeft = String(WIDTH + STROKE) + "px";
    nextButton.style.marginTop = String(WIDTH + STROKE) + "px";;
    nextButton.disabled = true;

    //--------------------    function   ------------------------------------------
    nextButton.onclick = function() {

        if (nbCurrentFormSelected >= nbFormToSelect) {
            gameUpdate();
        }
    }

    //------------------------------------------------------------------------------
    //                              game update
    //------------------------------------------------------------------------------
    //set up the game loop
    //method repeats a given function at every given time-interval
    setInterval(loop, 1000 / FPS);

}