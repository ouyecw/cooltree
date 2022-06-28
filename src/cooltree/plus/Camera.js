import Global from "../core/Global.js"
import DOMDisplay from '../display/DOMDisplay.js'

/**
 * @class
 * @module Camera
 * @extends DOMDisplay
 */
export default class Camera extends DOMDisplay
{
	constructor()
	{
		super();
		this.id="camera";
		this.mediaStream = null,this.track = null,this.is_open=false;
	}
	
	setup(video)
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
	
	close()
	{
		if(!this.is_open) return;
		if(this.mediaStream && this.mediaStream.stop) this.mediaStream.stop();
		if(this.track && this.track.stop) this.track.stop();
		this.is_open=false;
	}
	
	capture()
	{
		if(!this.is_open) return;
		let canvas = document.createElement('canvas');
		canvas.width = MathUtil.int(this.element.style.width);
		canvas.height = MathUtil.int(this.element.style.height);
	
	    let ctx = canvas.getContext('2d');
	    ctx.drawImage(this.element, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL("image/jpeg");
	}
	
	dispose()
	{
		this.close();
		super.dispose();
	}
}
