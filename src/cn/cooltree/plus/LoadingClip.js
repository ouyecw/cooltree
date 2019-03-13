
class LoadingClip extends DisplayObjectContainer
{
	constructor(url,cb)
	{
		super();
		this._loop=this._call_back=this._img=this._instance=null;
		
		if(url) {
			if(typeof url=="string") this.setup(url,cb);
			else this._set_instance(url);
		}
		
		this.speed=1;
	}
	
	get stage()
	{
		return this._stage;
	}
	
	set stage(value) 
	{
        if(this._stage==value) return;
		this._stage=value;
		
		if(this._instance && this._stage) this.play();
		else this.stop();
		
		if(this._children==undefined || this._children.length<1) return;
		let i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			c.stage=value;
		}
    }
	
	setup(url,cb)
	{
		if(StringUtil.isEmpty(url)) return;
		this._call_back=cb;
		
		this._img=new Image();
		this._img.style.display="none";
		this._img.onload=Global.delegate(this._load_handler,this);
		this._img.onerror=Global.delegate(this._error_handler,this);
		this._img.src=url;
	}
	
	_load_handler(e)
	{
		this._img.onload=this._img.onerror=null;
		this._set_instance(this._img);
		this._img=null;
	}
	
	_set_instance(target)
	{
		this._instance=Factory.c("do");
		this._instance.setInstance(target);
		target=(target instanceof Source) ? target : target;
		this._instance.origin={x:target.width*0.5,y:target.height*0.5};
		this._loop=Global.delegate(this.play,this);
		this.addChild(this._instance);
		
		if(this._stage) this.play();
		
		if(this._call_back){
			this._call_back();
			this._call_back=null;
		}
	}
	
	_error_handler(e)
	{
		trace("[ERROR]LoadingClip loading error by",this._img.src);
		this._img.onload=this._img.onerror=null;
		this._img=null;
	}
	
	play()
	{
		if(this._instance==null) return;
		
	//	this.stop();
		this._instance.rotation=this._instance.rotation>350 ? 0 : this._instance.rotation;
		TweenLite.to(this._instance,1/this.speed,{rotation:360,onComplete:this._loop});
	}
	
	stop()
	{
		if(this._instance) TweenLite.remove(this._instance);
	}
	
	dispose()
	{
		this.stop();
		super.dispose();
		delete this._loop,this._call_back,this._img,this._instance,this.speed;
	}
}
