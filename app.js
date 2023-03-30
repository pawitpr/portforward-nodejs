var socketServerUrl = 'https://sssa-unu4.onrender.com';
var hostToLive = 'http://localhost:8080';
var soket = require('socket.io-client')(socketServerUrl);
const axios = require('axios');

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
    axios.get(url, {params})
    .then(response => {
        soket.emit('page-response', response.status === 200 ? response.data : JSON.stringify({ error: '404 Not Found' }));
    })
    .catch(err => {
        console.log(err);
        soket.emit('page-response', JSON.stringify({ error: err.message }));
    });
}

function executePost(url,params) {
    axios.post(url, params)
    .then(response => {
        soket.emit('page-response', response.status === 200 ? response.data : JSON.stringify({ error: '404 Not Found' }));
    })
    .catch(err => {
        console.log(err);
        soket.emit('page-response', JSON.stringify({ error: err.message }));
    });
}
