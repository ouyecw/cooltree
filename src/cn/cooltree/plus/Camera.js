
class Camera extends Camera
{
	constructor()
	{
		super();
		this.id="camera";
		this.mediaStream = null,this.track = null,this.is_open=false;
	}
	
	Camera.prototype.setup=function(video)
	{
		navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
		if(navigator.getMedia==undefined) return;
		this.element= video ? video : document.createElement("video");
		navigator.getMedia(
	       {
	           video: true
	       },
	       
	       function (stream) {
	           this.element.src = Global.root.URL.createObjectURL(stream);
	           this.track = stream.getTracks()[0];
	           this.mediaStream = stream;
	           this.element.play();
	           this.is_open=true;
	       },
	     
	       function (err) {
	           trace("The following error occured:" + err);
	       }
	  	);
	}
	
	Camera.prototype.close=function()
	{
		if(!this.is_open) return;
		if(this.mediaStream && this.mediaStream.stop) this.mediaStream.stop();
		if(this.track && this.track.stop) this.track.stop();
		this.is_open=false;
	}
	
	Camera.prototype.capture=function()
	{
		if(!this.is_open) return;
		let canvas = document.createElement('canvas');
		canvas.width = MathUtil.int(this.element.style.width);
		canvas.height = MathUtil.int(this.element.style.height);
	
	    let ctx = canvas.getContext('2d');
	    ctx.drawImage(this.element, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL("image/jpeg");
	}
	
	Camera.prototype.dispose=function()
	{
		this.close();
		super.dispose();
	}
}
