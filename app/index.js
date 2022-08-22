/*
* This is the main JS file
* CAUTION : DO NOT EDIT THE EXPRESS SERVER INITIALIZATION !
*/

//BEGIN EXPRESS SERVER INITIALIZATION
let init = require('./myexpress-init/server.js');
app = init();
//END EXPRESS SERVER INITIALIZATION

let fs = require('fs')
let lockDecider = Math.floor(Math.random() * 100)

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/tutorial.html');
});

const express = require('./myexpress-init/node_modules/express')
app.use(express.static(__dirname + '/'));
app.use(express.json( /*{limit:'1mb'} */ ));

app.get('/lockDecider', (request, response) => {
    console.log('Served lock decider ' + lockDecider)
    response.json({value: lockDecider})
    lockDecider++
})

app.get('/lockDeciderTuto', (request, response) => {
    console.log('Served lock decider ' + lockDecider)
    response.json({value: lockDecider})
})

app.post('/logdata', (request, response) => {
    let path = 'rsc/data/gameData.csv'
    let data = request.body.value
    let success = false

    let header = 'date,user_ip,trial_id,block_id,n_trials,n_block,block_size,' +
        ' target_shape,target_id,target_freq,target_n,timeLearning,setting_used,n_locks,' +
        'lock_duration,unlock_action,lock_state,occurrence,time,time_selected,time_next,' +
        'slider_display_span,n_opened_locker,first_unlock_occurrence,first_unlock_trial,nb_total_click,' +
        'exp_total_time,mode_used\n'

    fs.writeFile(path, header, { flag: 'wx' }, function (err) {
        if (err){
            return
        }
        console.log("File created successfully");
    });

    fs.appendFile(path, data + '\n', function(err) {
        if(err) {
            console.log(path + ' : error while accessing: ' + err)
			return
        }
        console.log('Data saved successfully')
        success = true
    })
    let status = 'failure'
    if(success)
        status = 'success'
    response.json({
        status: status,
    })
})

app.post('/userInfo', (request, response) => {
    let path = 'rsc/data/userInfo.csv'
    let data = request.body.value
    let success = false

    let header = 'user_ip,genre,Age,Country,Education,Commentary\n'

    fs.writeFile(path, header, { flag: 'wx' }, function (err) {
        if (err){
            return
        }
        console.log("File created successfully");
    });

    fs.appendFile(path, data + '\n', function(err) {
        if(err) {
            console.log(path + ' : error while accessing: ' + err)
            return
        }
        console.log('User saved successfully')
        success = true
    })
    let status = 'failure'
    if(success)
        status = 'success'
    response.json({
        status: status,
    })
})

function getAllUrlParams(url) {
    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // we're dealing with a string
            if (!obj[paramName]) {
                // if it doesn't exist, create property
                obj[paramName] = paramValue;
            } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                // if property does exist and it's a string, convert it to an array
                obj[paramName] = [obj[paramName]];
                obj[paramName].push(paramValue);
            } else {
                // otherwise add the property
                obj[paramName].push(paramValue);

            }
        }
    }

    return obj;
}

//TODO window not loaded error
app.get('/prolificParam',(request,response) => {
    const params = getAllUrlParams();
    let p_id = params.PROLIFIC_PID;
    let stud_id = params.STUDY_ID;
    let session_id = params.SESSION_ID;
    if (!p_id) p_id = "none";
    if (!stud_id) stud_id = -1;
    if (!session_id) session_id = -1;
    response.body = JSON.stringify({"PROLIFIC_PID" : p_id,"STUDY_ID" : stud_id,"SESSION_ID":session_id})
})
