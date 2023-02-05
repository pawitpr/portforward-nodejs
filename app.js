var socketServerUrl = 'https://sssa-unu4.onrender.com';
var hostToLive = 'http://localhost:3000';
var soket = require('socket.io-client')(socketServerUrl);
const superagent = require('superagent');
const { SSL_OP_NO_TICKET } = require('constants');
soket.on('connect', function(){
    console.log('Client is connected ')
});
soket.on('disconnect', function(){
    console.log('Client is disconnected ')
});
soket.on('page-request', function(data){
    var path = data.pathname;
    var method = data.method;
    var params = data.params;
    // this is new var
    var localhostUrl = hostToLive + path;
    if(method == "get")executeGet(localhostUrl,params);
    else if(method == "post")executePost(localhostUrl,params);

});

function executeGet(url,params) {
    superagent.get(url)
    .query(params)
    .end((err,response) => {
        if (err) { return console.log(err); }
        soket.emit('page-response', response.text);
    })
}
function executePost(url,params) {
    superagent.post(url)
    .query(params)
    .end((err,response) => {
        if (err) { return console.log(err); }
        soket.emit('page-response', response.text);
    })
}