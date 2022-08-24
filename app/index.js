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
app.use(express.urlencoded({extended:true}  ));

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

app.get('/p',(request,response) => {
    let p_id = request.query.PROLIFIC_PID;
    let stud_id = request.query.STUDY_ID;
    let session_id = request.query.SESSION_ID;
    if (!p_id) p_id = "none";
    if (!stud_id) stud_id = -1;
    if (!session_id) session_id = -1;
    let r = JSON.stringify({"PROLIFIC_PID" : p_id,"STUDY_ID" : stud_id,"SESSION_ID":session_id})
    console.log(r)
    response.send(r)
})

app.get('/r',(request,response) => {
    let p_id = request.query.PROLIFIC_PID;
    let stud_id = request.query.STUDY_ID;
    let session_id = request.query.SESSION_ID;
    if (!p_id) p_id = "none";
    if (!stud_id) stud_id = -1;
    if (!session_id) session_id = -1;
    let r = JSON.stringify({"PROLIFIC_PID" : p_id,"STUDY_ID" : stud_id,"SESSION_ID":session_id})
    console.log("Page refresh log " + r +" "+ request.get("Referer") + " user refreshed page")
})
