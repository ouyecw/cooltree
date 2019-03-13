
class Game extends DisplayObjectContainer
{
	constructor()
	{
		super();
		this._sound=this._enemys=this._rocket=this._firing=this._hero=this._scence=this._layout=null;
	}
	
	init()
	{
		Game.instance=this;
		
		this._scence=new Scence();
		this._scence.init();
		this.addChild(this._scence);
		
		this._enemys=new Enemy();
		this.addChild(this._enemys);
		
		this._firing=new Firing();
		this.addChild(this._firing);
		
		this._hero=new Hero();
		this._hero.init();
		this._hero.moveTo(Stage.current.stageWidth*0.5,Stage.current.stageHeight-150);
		
		this._shield=Factory.c("do");
		this._shield.shine=0;
		this._shield.setInstance(AssetManager.getSource("shield"));
		
		this._layout=new Layout();
		this.addChild(this._layout);
		
		this._rocket=Factory.c("do");
		this._rocket.setInstance(AssetManager.getSource("thrust"));
		
		this._sound=AssetManager.getSource("sound_Sound 3@mp3");
		Stage.current.addEventListener(Game.GAME_READY,Global.delegate(this.start,this),this.name);
	}
	
	start(e)
	{
		Stage.current.removeEventListener(Game.GAME_READY,null,this.name);
		Stage.current.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this.mouse_down,this),this.name);
	}
	
	mouse_down(e)
	{
		if(this._hero._dead) return;
		
		Stage.current.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);
		Stage.current.addEventListener(StageEvent.MOUSE_UP,Global.delegate(this.mouse_up,this),this.name);
		this._layout.remove_win();
		Game.control=2;
		
		if(this._hero && !this.contains(this._hero)){
			this.addChild(this._rocket);
			this.addChild(this._hero);
			this._layout.toTop();
			this._layout.clearLayout();
			this._enemys.create();
			Game.life=3;
			AssetManager.getSource("sound_Sound 5@mp3").play();
			Stage.current.addEventListener(StageEvent.MOUSE_MOVE,Global.delegate(this.mouse_move,this),this.name);
		}
		
		if(this._firing) this._firing.start();
	}
	
	mouse_up(e)
	{
		Game.control=1;
		Stage.current.removeEventListener(StageEvent.MOUSE_UP,null,this.name);
		Stage.current.addEventListener(Game.GAME_READY,Global.delegate(this.start,this),this.name);
	    Stage.current.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this.mouse_down,this),this.name);
	    
	    if(this._firing) this._firing.stop();
	}
	
	mouse_move(e)
	{
		this._hero.moveTo(MathUtil.clamp(e.mouseX-40,0,Global.canvas.width-80),MathUtil.clamp(e.mouseY-50,0,Global.canvas.height-100));
	}
	
	dead()
	{
		if(this._hero._dead) return;
		
		Game.life--;
		this._hero._dead=true;
		
		Stage.current.removeEventListener(StageEvent.MOUSE_MOVE,null,this.name);
		Stage.current.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);
		
		if(Game.life<1){
			this.removeChild(this._rocket);
			this.removeChild(this._hero);
		}else{
			this._rocket.visible=this._hero.visible=false;
		}
		
		var life=this._layout._life_bar.getChildByName("life"+Game.life);
		if(life) life.visible=false;
		
		if(this._firing) this._firing.stop();
		this._firing.clear();
		
		this._enemys._pause=true;
		this._enemys.killAll();
		this._sound.play(0);
		this._enemys._emp_num=8;
	}
	
	protect(bool)
	{
		if(bool && !this.contains(this._shield)){
			this.addChild(this._shield);
		}
		
		if(!bool){
			this._shield.removeFromParent(false);
			this._shield.shine=0;
		}else{
			this._shield.alpha=0.6;
			AssetManager.getSource("sound_Sound 2@mp3").play();
		}
	}
	
	restart()
	{
		if(Game.life>0){
			this._enemys.create();
			this._rocket.visible=this._hero.visible=true;
			Stage.current.addEventListener(StageEvent.MOUSE_MOVE,Global.delegate(this.mouse_move,this),this.name);
		    this._hero.moveTo(MathUtil.clamp(Stage.current.mouseX-40,0,Global.canvas.width-80),MathUtil.clamp(Stage.current.mouseY-50,0,Global.canvas.height-100));
		}
		
		Game.time=0;
		this._hero._dead=false;
		Game.instance.protect(false);
		this._hero.moveTo(Stage.current.stageWidth*0.5,Stage.current.stageHeight-150);
		Stage.current.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this.mouse_down,this),this.name);
		
		if(Game.life>0) {
			if(Game.control==2 && this._firing) this._firing.start(); 
			return;
		}
		
		this._layout.resetLayout();
	}
}

Game.time=0;
Game.life=3;
Game.level=9;
Game.instance;
Game.control=0;
Game.FADE_IN="fade_in";
Game.GAME_READY="game_ready";
