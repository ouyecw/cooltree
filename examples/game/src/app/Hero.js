
export default class Hero extends DisplayObjectContainer
{
	constructor()
	{
		super();
		
		this._dead=this._move_complete=this._play_complete=false;
		this._instance=this.__move_handler=this._plane_label=this._right_plane=this._left_plane=this._normal_plane=null;
	}
	
	init()
	{
		this.__move_handler=Global.delegate(this._move_handler,this);
		this._right_plane=MovieManager.getData("fighter_bankRight_");
		this._left_plane=MovieManager.getData("fighter_bankLeft_");
		this._normal_plane=MovieManager.getData("fighter_static");
		this._instance=Factory.c("mc");
		this.addChild(this._instance);
		this.setState(0);
		this._rate=2;
	}
	
	_move_handler()
	{
		this._move_complete=true;
		if(this._play_complete || !this._instance.reverse) this._play_over();
	}
	
	setState(i)
	{
		var bool=true;
		
		if(this._plane_label==i) {
			if(!this._instance.reverse) return;
			bool=false;
		}
		
		this._plane_label=i;
		
		if(bool){
			this._instance.clearAllFrames();
			this._instance.setFrames(i==0 ? this._normal_plane : (i==1 ? this._left_plane : this._right_plane)); 
		}
		
		this._instance.reverse=false;
		this._play_complete=false;
		this._instance.play();
		
		this._instance.removeEventListener(Event.PLAY_OVER,this._play_over);
		if(i>0) this._instance.addEventListener(Event.PLAY_OVER,this._play_over);
	}
	
	_play_over(e)
	{
		if(this._instance.reverse){
			this.setState(0);
			this._instance.removeEventListener(Event.PLAY_OVER,this._play_over);
			return;
		}
		
		this._play_complete=true;
		if(!this._move_complete) return;
		
		this._instance.reverse=true;
		this._instance.play();
	}
	
	moveTo(posX,posY)
	{
		var distance=Math.sqrt((posX-this.x)*(posX-this.x)+(posY-this.y)*(posY-this.y));
		this.setState(distance<2 ? 0 : (posX>this.x) ? 2 : ((posX<this.x) ? 1 :0));
		if(distance==0) return;
		
		var time=distance*0.0012;
		TweenLite.remove(this);
		this._move_complete=false;
		TweenLite.to(this,time,{x:posX,y:posY,onComplete:this.__move_handler});
	}
}
