/**
===================================================================
Video Class
===================================================================
**/


function Video()
{
	Media.call(this);
	this._type="video";
}

Global.inherit(Video,Media);

Video.prototype.getWidth = function()
{
	return MathUtil.format(Math.abs(this.element.videoWidth * this.scaleX));
}
		
Video.prototype.getHeight = function()
{
	return MathUtil.format(Math.abs(this.element.videoHeight * this.scaleY));
}

Video.prototype.init = function () 
{
	if(this.is_init) return;
	Video.superClass.init.call(this);
	
	this.element.style.width='100%';
	this.element.style.height='100%';
	this.element.style.objectFit='fill';
	this.element.removeAttribute("controls");
		
	if(Global.os!=SystemType.OS_PC){
		this.element.setAttribute('playsinline', true);
		this.element.setAttribute('x-webkit-airplay', 'allow');
		this.element.setAttribute('webkit-playsinline', true);
	}
	
	if(Global.isWeixin){
		this.element.setAttribute('x5-video-player-type', 'h5');
		this.element.setAttribute('x5-video-player-fullscreen', true);
	}
}

Video.prototype._start_load=function()
{
	if(Video.superClass._start_load.call(this) && "poster" in this.list[this.current]){
		this.element.poster=this.list[this.current].poster;
	}
}

Video.prototype.dispose = function()
{
	if(this.element && this.element.parentNode){
		this.element.parentNode.removeChild(this.element);
		delete this.element;
	}
	
	Video.superClass.dispose.call(this);
}
