var http = require('http');

module.exports = function (query,rps,callback) {

	var timeout = 10000
		, ReqRunning = 0
		, GoodResponse = 0
		, BadResponse = 0
		, ErrorResponse = 0
		, curRPS = rps || 1000
		, ReqStarted = 0
		, ErrorList = {};

	function startOne(params,cb) {
		
		ReqStarted++;
		ReqRunning++;
					
		var req = http.request({
					host: params.host,
					port: params.port,
					agent: false,
					path: params.path,
					headers: {
						"connection": "close"
					}
		}, function(resp) {
							  
			if(resp.statusCode == 200) {
					
				GoodResponse++;
		
			 } else {
				 
				 BadResponse++;
				 
			 }
			 
			 ReqRunning--;
			 cb(ReqRunning);
				  
		});
		
		req.on('socket', function (socket) {
			
			socket.setTimeout(timeout);  
			socket.on('timeout', function() {
				req.abort();			
			});
			
		});
		
		req.end();
		
		req.on('error', function(e) {
			    
			    if(typeof(ErrorList[e.code]) == "undefined")
					ErrorList[e.code] = 0;
				
				ErrorList[e.code]++;
				
				ReqRunning--;
				ErrorResponse++;
				cb(ReqRunning);
		
		});	
				
	}

	startTime = new Date();

	for (var i = 0; i < curRPS ; i++) {
		
		startOne(query,function(){ 
			
			if(ReqRunning==0) {
				
				respend = ((new Date().getTime()-startTime.getTime())/1000);
				fact = "took "+respend+" seconds to execute "+curRPS+" requests with request timeout set at "+(timeout/1000)+" secs.";
				data = {ReqStarted:ReqStarted,response:{GoodResponse:GoodResponse,BadResponse:BadResponse,ErrorResponse:ErrorResponse,ErrorList:ErrorList},ReqRunning:ReqRunning,fact:fact}; 	
				callback(data);				 
			
			}
			
		});
		
		if(i == curRPS-1)
			reqend = ((new Date().getTime()-startTime.getTime())/1000); 

	}
	
};
