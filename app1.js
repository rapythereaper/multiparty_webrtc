http=require("http");
f=require("fs");
WebSocket=require("ws");


DATABASE={}

http_server=http.createServer(function(req,res){
	console.log(req.method+" "+req.url);
	if(req.url=="/"){
		res.end("404! MF");

	}else if(req.url=="/simplepeer.min.js"){
		res.writeHead(200,{'Content-Type': 'text/javascript'})
		res.end(f.readFileSync("simplepeer.min.js"))
	
	}else{
		res.end(f.readFileSync("home1.html"))

	}
}).listen(8080,function(){console.log("server running at http://127.0.0.1")})


wss=new WebSocket.Server({server:http_server});


wss.on("connection",function(ws,req){
	console.log("[+]client joined at: "+req.url);
	ws.room=req.url
	if(DATABASE[req.url]==undefined){
		ws.id=0; //ws.room=req.url;
		DATABASE[req.url]={clients:[ws]};


	}else{
		ws.id=DATABASE[req.url].clients.length;
		ws.send(JSON.stringify({action:"add_user",num:ws.id}));
		DATABASE[req.url].clients.push(ws);

		
	};

	ws.on("message",function(data){
		msg=JSON.parse(data);
		console.log("[*]recived msg: "+msg)
		id=msg.id;
		//delete msg.id;
		DATABASE[ws.room].clients[id].send(JSON.stringify(msg))


	})

	ws.on("close",function(){
		console.log("[-]client left at: "+req.url)
	})



})