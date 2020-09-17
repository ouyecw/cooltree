
export default class MySocket
{
	constructor()
	{
		this.ws=null;
		this.lock_reconnect=false;
		this.server_timeout_id=0;
		this.heart_timeout_id=0;
		this.timeout_id=0;
		this.delay=8000;
		this.time=4000;
		this.heart="0000";
		this.isQuit=false;
		this.uri=null;
		this.callback=null;
		this.currentList=null;
	}
	
	close()
	{
		this.server_timeout_id && clearTimeout(this.server_timeout_id);
		this.heart_timeout_id && clearTimeout(this.heart_timeout_id);
		this.timeout_id && clearTimeout(this.timeout_id);
		
		this.timeout_id=this.server_timeout_id=this.heart_timeout_id=0;
		this.lock_reconnect=false;
		this.isQuit=true;
		
		this.ws && this.ws.close();	
		this.currentList=null;
	}
	
	initWebpack(url=null)
	{
		this.uri=url || this.uri;
		if(!this.uri) return;
		
		this.ws = new WebSocket(this.uri);
		this.ws.onopen=this.wsOpenHandler.bind(this);
		this.ws.onerror=this.wsErrorHandler.bind(this);
		this.ws.onclose = this.wsCloseHandler.bind(this);
		this.ws.onmessage=this.wsMessageHandler.bind(this);
		
		this.timeout_id && clearTimeout(this.timeout_id);
		this.timeout_id=0;
		
		console.log("WebSocket init:"+this.uri);
	}
	
	reconnect(){
		if(this.lock_reconnect || this.isQuit) return;
		this.lock_reconnect=true;
		
		this.timeout_id && clearTimeout(this.timeout_id);
		this.timeout_id = setTimeout(()=>
		{
		  this.initWebpack();
		  this.lock_reconnect = false;
		  console.log('重连中...');
		},this.time);
	}
	
	reset()
	{
		this.server_timeout_id && clearTimeout(this.server_timeout_id);
		this.heart_timeout_id && clearTimeout(this.heart_timeout_id);
		this.heart_timeout_id=this.server_timeout_id=0;
		this.start();
	}
	
	start(){
		this.heart_timeout_id && clearTimeout(this.heart_timeout_id);
		this.heart_timeout_id=0;
		
		if(this.isQuit) return;
		this.heart_timeout_id=setTimeout(this.heartHandler.bind(this),this.delay);
	}
	
	heartHandler(){
		if (this.ws.readyState == 1)  this.ws.send(this.heart);
		else {
			if(this.lock_reconnect) return;
			this.reconnect();
		}
		
		this.server_timeout_id && clearTimeout(this.server_timeout_id);
		this.server_timeout_id= setTimeout(()=>
		{
			this.ws.close();
		},
		this.delay);
	}
	
	wsOpenHandler(e){
		this.start();
		if(!this.currentList || !this.currentList.length) return;
		while(this.currentList.length) this.ws.send(this.currentList.shift());
	}
	
	wsMessageHandler(e){
		var data=e.data;

		try{
			data=JSON.parse(data);
		}
		catch(error) {
			console.log(data);
			data=null;
		}
		
		data && this.callback && this.callback(data);
		this.reset();
	}
	
	wsErrorHandler(e){
		console.log("WebSocket Error!>");
		console.log(e);
		
		this.reconnect();
	}
	
	wsCloseHandler(e){
		// console.log('websocket close: ' + e.code + ' ' + e.reason + ' ' + e.wasClean);
		this.reconnect();
	}
	
	send(obj)
	{
		if(!obj || !this.ws) return false;
		if (this.ws.readyState == 1) this.ws.send(JSON.stringify(obj));
		else{
			if(!this.currentList) this.currentList=[];
			if(this.currentList.length>5) return false;
			this.currentList.push(JSON.stringify(obj));
			this.heartHandler();
		}
		return true;
	}
	
}

MySocket.className="MySocket";