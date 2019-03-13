
class Layout extends DisplayObjectContainer
{
	
	constructor()
	{
		super();
		
		this._score=this._menu=this._life_bar=this._warn_win=null;
		Stage.current.addEventListener(Game.FADE_IN,Global.delegate(this.init,this),this.name);
	}
	
	init(e)
	{
		this._menu=MovieManager.getInstance("circle");
		this._menu.gotoAndStop(1);
		this.addChild(this._menu);
		
		this._score=Factory.c("tf",{font:"Onky",text:"0"});
		this.addChild(this._score);
		
		this._life_bar=Factory.c("dc");
		this.addChild(this._life_bar);
		
		for(var i=0;i<Game.life;i++){
			var sub=Factory.c("do");
			sub.setInstance(AssetManager.getSource("Image 41"));
			this._life_bar.addChild(sub);
			sub.name="life"+i;
			sub.moveTo(0,i*40);
		}
		
		this._warn_win=Factory.c("do");
		this._warn_win.setInstance(AssetManager.getSource("Image5"));
		this.addChild(this._warn_win);
		this._warn_win.y=-250;
		
		Stage.current.removeEventListener(Game.FADE_IN,null,this.name);
		Stage.current.addEventListener(StageEvent.RESIZE,Global.delegate(this.resizeHandler,this),this.name);
	    this.resizeHandler();
	    
	    TweenLite.to(this._warn_win,0.5,{ease:TweenLite.getEaseName(TweenLite.BACK,TweenLite.OUT),y:(Global.canvas.height-240)*0.55,delay:1.5,onComplete:Global.delegate(this._tween_complete,this)})
	}
	
	_tween_complete(b)
	{
		if(b){
			this._warn_win.removeFromParent(false);
			return;
		}
		
		Stage.current.dispatchEvent(new Event(Game.GAME_READY));
	}
	
	resetLayout()
	{
		this.addChild(this._warn_win);
		this._warn_win.x=(Global.canvas.width-439)*0.5;
		this._warn_win.y=-250;
		
		TweenLite.to(this._warn_win,0.5,{ease:TweenLite.getEaseName(TweenLite.BACK,TweenLite.OUT),y:(Global.canvas.height-240)*0.55,delay:1.5,onComplete:Global.delegate(this._tween_complete,this)})
	}
	
	clearLayout()
	{
		var i,l,c;
		for(i=0,l=this._life_bar._children.length;i<l;i++){
			c=this._life_bar._children[i];
			c.visible=true;
		}
		
		this._score.text="0";
		this._menu.gotoAndStop(1);
	}
	
	remove_win()
	{
		if(this._warn_win) TweenLite.to(this._warn_win,0.5,{ease:TweenLite.getEaseName(TweenLite.BACK,TweenLite.IN),y:-250,onComplete:Global.delegate(this._tween_complete,this),onCompleteParams:[true]})
	}
	
	resizeHandler(e)
	{
		var w=Global.canvas.width;
		var h=Global.canvas.height;
		
		if(this._menu){
			this._menu.moveTo(w-120,5);
		}
		
		if(this._life_bar){
			this._life_bar.moveTo(w-40,120);
		}
		
		if(this._warn_win){
			this._warn_win.x=(w-439)*0.5;
		}
		
		if(this._score){
			this._score.moveTo(w-120-this._score.width,5);
		}
	}
}
