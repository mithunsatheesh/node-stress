# node-stress

Light weight Node.js module to apply specified load on a REST API and retrieve the response statistics. I gives the counts of good,bad and errored responses along with the time  taken to process them all.


## Installation

    npm install node-stress


## Usage

``` js
var stress = require("./node-stress");

stress({
			
		host: url, //strip off the starting http:// same as in case of node http request
		port: port,
		path: path
		
		
	},RequestCount,callback);
```

## Example

``` js
var stress = require("./node-stress");

stress({
			
		host: 'rest.api.url',
		port: 80,
		path: '/getData.php?command=1'
		
		
	},RequestCount,function(data){
		
		console.log("Requests Sent : "+data.ReqStarted);
		
		if(data.response.GoodResponse)
			console.log("Good Response (200 OK) : ", data.response.GoodResponse);
			
		if(data.response.BadResponse)
			console.log("Bad Response : ", data.response.BadResponse);
			
		if(data.response.ErrorResponse) {
			console.log("Error Response : ", data.response.ErrorResponse);
			console.log(JSON.stringify(data.response.ErrorList,undefined,4));
		}
		console.log("Test Stats : "+data.fact);

});
```

## Parameters

`host` - the url of the REST API after stripping down the starting http://. For more info check the input parameter for the node sample [http request](http://nodejs.org/api/http.html#http_http_request_options_callback).

`port` - port at which the REST API runs

`path` - path to the page we are sending request

`RequestCount` - the load to be applied in number (eg:1000)


## Credits

The code used is inspired and based on [this article](https://hacks.mozilla.org/2013/01/building-a-node-js-server-that-wont-melt-a-node-js-holiday-season-part-5/) on [hacks.mozilla.org](https://hacks.mozilla.org/).



