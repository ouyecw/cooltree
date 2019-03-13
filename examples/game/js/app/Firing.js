
class Firing extends DisplayObjectContainer
{
	constructor()
	{
		super();
		
		this._index=0;
		this.pause=true;
		this.protect=false;
		this._bool=true;
		this._foods=[];
		this._shells=[];
		this._bullets=[];
		this._sound=AssetManager.getSource("sound_Sound 11@mp3");
		Stage.current.addEventListener(StageEvent.ENTER_FRAME,Global.delegate(this.onEnterFrame,this),this.name);
	}
	
	start()
	{
		this.pause=false;
	}
	
	stop()
	{
		this.pause=true;
		this._sound.stop();
	}
	
	clear()
	{
		while(this._shells.length>0){
			var shell=this._shells[0];
			shell.removeFromParent(true);
			this._shells.splice(0,1);
		}
		
		while(this._foods.length>0){
			var food=this._foods[0];
			food.removeFromParent(true);
			this._foods.splice(0,1);
		}
	}
	
	onEnterFrame(e)
	{
		if(this.protect){
			Game.instance._shield.moveTo(Game.instance._hero.x+235,Game.instance._hero.y+50);
			Game.time--;
			
			if(Game.time<100){
				if(Game.time<=0){
					Game.instance._shield.shine=0;
					Game.instance.protect(false);
					this.protect=false;
				}
				else Game.instance._shield.shine=-1;
			}
			
			if(Game.instance._shield.shine<0){
				Game.instance._shield.alpha*=0.9;
				if(Game.instance._shield.alpha<0.3) Game.instance._shield.shine=1;
			}
			else if(Game.instance._shield.shine!=0){
				Game.instance._shield.alpha*=1.1;
				if(Game.instance._shield.alpha>=0.9) Game.instance._shield.shine=-1;
			}
		}
		
		if(Game.instance._rocket && Game.instance._rocket.parent){
			Game.instance._rocket.moveTo(Game.instance._hero.x+32,Game.instance._hero.y+95);
			Game.instance._rocket.alpha+=this._bool ? -0.1 : 0.1;
			Game.instance._rocket.y-=(1-Game.instance._rocket.alpha)*10;
		}
		
		if(Game.instance._rocket.alpha<0.2 || Game.instance._rocket.alpha>=1) this._bool=!this._bool;
		
		var i,bullet;
		for(i=0;i<this._bullets.length;i++){
			bullet=this._bullets[i];
			bullet.y-=36;
			
			if(bullet.y<-50){
				bullet.removeFromParent(true);
				this._bullets.splice(i,1);
				i--;
			}
		}
	
		if(this.pause || Game.instance._hero==null) return;
		
		if(this._index%1==0){
			var frame=MathUtil.randomInt(16);
			bullet=Factory.c("do");
			var source=MovieManager.getData("PewPew")[frame];
			bullet.setInstance(source);
			bullet.moveTo(Game.instance._hero.x+12,Game.instance._hero.y-20);
			this._bullets.push(bullet);
			this.addChild(bullet);
			this._sound.play(0);
		}
		
		this._index++;
	}
	
	dispose()
	{
		Stage.current.removeEventListener(StageEvent.ENTER_FRAME,null,this.name);
		super.dispose();
	}
}
