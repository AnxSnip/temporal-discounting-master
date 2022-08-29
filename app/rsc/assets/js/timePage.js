var timer;
var timerStart;
var timeSpentOnSite = getTimeSpentOnSite();

function getTimeSpentOnSite(){
    timeSpentOnSite = parseInt(localStorage.getItem('timeSpentOnSite'));
    timeSpentOnSite = isNaN(timeSpentOnSite) ? 0 : timeSpentOnSite;
    return timeSpentOnSite;
}

function startCounting(){
    timerStart = Date.now();
    timer = setInterval(function(){
        timeSpentOnSite = getTimeSpentOnSite()+(Date.now()-timerStart);
        localStorage.setItem('timeSpentOnSite',timeSpentOnSite);
        timerStart = parseInt(Date.now());
        // Convert to seconds
    },1000);
}
var stopCountingWhenWindowIsInactive = true;

if( stopCountingWhenWindowIsInactive ){

    if( typeof document.hidden !== "undefined" ){
        var hidden = "hidden",
            visibilityChange = "visibilitychange",
            visibilityState = "visibilityState";
    }else if ( typeof document.msHidden !== "undefined" ){
        var hidden = "msHidden",
            visibilityChange = "msvisibilitychange",
            visibilityState = "msVisibilityState";
    }
    var documentIsHidden = document[hidden];

    document.addEventListener(visibilityChange, function() {
        if(documentIsHidden != document[hidden]) {
            if( document[hidden] ){
                // Window is inactive
                clearInterval(timer);
            }else{
                // Window is active
                startCounting();
            }
            documentIsHidden = document[hidden];
        }
    });
}

startCounting();