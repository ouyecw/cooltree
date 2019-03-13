
class Enemy extends DisplayObjectContainer
{
	constructor()
	{
		super();
		this._debris_list=[];
		this._enemy_list=[];
		this._boob_list=[];
		this._emp_list=[];
		this._pause=true;
		
		this._emp_num=0;
		this._interval=0;
		this._speed_y=3;
		this._speed_x=2;
		this._range=0.2;
		
		this._old_width=Global.canvas.width;
		this._old_height=Global.canvas.height;
		
		this._sound=AssetManager.getSource("sound_Sound 4@mp3");
		Stage.current.addEventListener(StageEvent.RESIZE,Global.delegate(this.resizeHandler,this),this.name);
		Stage.current.addEventListener(StageEvent.ENTER_FRAME,Global.delegate(this.onEnterFrame,this),this.name);
	}

	create()
	{
		this._pause=false;
	}
	
	killAll()
	{
		while(this._enemy_list.length>0) this.kill(this._enemy_list[0],true,true);
	}
	
	kill(enemy,dead,miss)
	{
		if(enemy==undefined) return;
		
		if(dead){
			var boob=MathUtil.randomInt(10)>5 ? MovieManager.getInstance("Explosion_Sequence_A",null,Global.useCanvas,20) : MovieManager.getInstance("Explosion_Sequence_A",null,Global.useCanvas,null,21);
			boob.name="boob";
			this._boob_list.push(boob);
			this.addChild(boob);
			boob.moveTo(enemy.x-90,enemy.y-60);
			boob.addEventListener(Event.PLAY_OVER,Global.delegate(this.onPlayOver,this));
			boob.gotoAndStop(2);
			
			this._sound.play(1);
			boob.play(1);
			
			for (var i = 0; i < 6; i++) 
			{
				var partical=Factory.c("do");
				partical.setInstance(MovieManager.getData("shipDebris_")[MathUtil.randomInt(6)]);
			    partical.life = 100;
			    partical.rotationSpeed = Math.random() * 0.4;
			    partical.speedX=Math.random() * 30 - 15;
			    partical.speedY=5+Math.random() * 5;
			    partical.moveTo(enemy.x+40,enemy.y+20);
			    this._debris_list.push(partical);
			    this.addChild(partical);
			}
			
			if(!miss){
				var score=Number(Game.instance._layout._score.text);
				Game.instance._layout._score.text=String(score+1);
				Game.instance._layout._score.moveTo(this._old_width-120-Game.instance._layout._score.width,5);
			    var random=MathUtil.randomInt(500);
			    
			    if(random>10 && random<15){
			    	var food=Factory.c("do");
			    	food.setInstance(AssetManager.getSource("pickup_shield"));
			    	food.moveTo(enemy.x+30,enemy.y+50);
			    	Game.instance._firing.addChild(food);
					Game.instance._firing._foods.push(food);
			    }
			}
		}
		
		var index=this._enemy_list.indexOf(enemy);
		delete enemy.axis;
		delete enemy.valu;
		delete enemy.dire;
		delete enemy.bloo;
		delete enemy.boob;
		enemy.removeFromParent(true);
		if(index<0) return;
		this._enemy_list.splice(index,1);
	}
	
	onPlayOver(e)
	{
		var boob=(e instanceof Event) ? e.target : e;
		boob.removeEventListener(Event.PLAY_OVER);
		this._boob_list.splice(this._boob_list.indexOf(boob),1);
		boob.removeFromParent(true);
	}
	
	onEnterFrame(e)
	{
		var i,enemy,dead,boob,partical,food,emp,shell,angle,m=Global.canvas.height,w=Global.getScreenWidth(),h=Global.getScreenHeight();
		for(i=0;i<this._enemy_list.length;i++)
		{
			enemy=this._enemy_list[i];
			enemy.y+=this._speed_y;
			
			if(enemy.y>h){
				this.kill(enemy,false);
				i--;
				continue;
			}
			
			this._hitTarget(enemy);
			if(enemy.dire==0) continue;
			enemy.x+=enemy.dire>0 ? this._speed_x : -this._speed_x;
			
			if(enemy.dire>0){
				if(enemy.x>(enemy.valu+this._range*this._old_width)) 
					enemy.dire=-1;
			}else{
				if(enemy.x<(enemy.valu-this._range*this._old_width)) 
					enemy.dire=1;
			}
			
			if(enemy.boob>0 && enemy.y<m*0.5 && MathUtil.randomInt(500)<1){
				shell=Factory.c("do");
				AssetManager.getSource("sound_Sound 12@mp3").play();
				shell.setInstance(AssetManager.getSource("bad_bullet"));
				shell.moveTo(enemy.x+30,enemy.y+110);
				Game.instance._firing.addChild(shell);
				Game.instance._firing._shells.push(shell);
				angle=MathUtil.getAngle(enemy.x,enemy.y,Game.instance._hero.x,Game.instance._hero.y)+(0.1-MathUtil.randomInt(20)*0.01);
				shell.speedX=Math.cos(angle)*4;
				shell.speedY=Math.sin(angle)*4;
				enemy.boob--;
			}
		}
		
		for(i=0;i<Game.instance._firing._foods.length;i++)
		{
			food=Game.instance._firing._foods[i];
			food.y+=this._speed_y;
			dead=false;
			
			if(!Game.instance._hero._dead  && food.hitTestObject(Game.instance._hero._instance)){
				dead=true;
				if(!Game.instance._firing.protect) Game.instance.protect(true);
				Game.instance._firing.protect=true;
				Game.instance._shield.shine=0;
				Game.time+=500;
				AssetManager.getSource("sound_Sound 8@mp3").play();
			}
			
			if(dead || food.y>h){
				Game.instance._firing._foods.splice(i,1);
				food.removeFromParent(true);
				i--;
			}
		}
		
		for(i=0;i<Game.instance._firing._shells.length;i++)
		{
			shell=Game.instance._firing._shells[i];
			shell.x+=shell.speedX;
			shell.y+=shell.speedY;
			dead=false;
			
			if(!Game.instance._hero._dead  && shell.hitTestObject(Game.instance._hero._instance)){
				if(Game.instance._firing.protect){
				     dead=true;
				}else{
					Game.instance.dead();
				}
			}
		
			if(dead || shell.x<0 || shell.x>w || shell.y>h || shell.y<0){
				Game.instance._firing._shells.splice(i,1);
				shell.removeFromParent(true);
				i--;
			}
		}
		
		for(i=0;i<this._boob_list.length;i++)
		{
			boob=this._boob_list[i];
			if(boob._paused || boob._current_frame==1){
				this.onPlayOver(boob);
				i--;
			}
		}
		
		for(i=0;i<this._debris_list.length;i++)
		{
			partical=this._debris_list[i];
			partical.life--;
			partical.speedX *= 0.96;
			partical.x += partical.speedX;
			partical.y += partical.speedY;
			partical.rotation += partical.rotationSpeed;
			partical.scale *= 0.96;
			
			if(partical.life <= 0)
			{
				delete partical.life;
				delete partical.speedX;
				delete partical.speedY;
				delete partical.rotationSpeed;
				partical.removeFromParent(true);
				this._debris_list.splice(i, 1);
				i--;
			}
		}
		
		for(i=0;i<this._emp_list.length;i++)
		{
			emp=this._emp_list[i];
			if(emp.phase){
				emp.rotation++;
				emp.scale += (2 - emp.scale) * 0.1;
					
				if(emp.scale > 1.99)
				{
					emp.phase = false;
				}
			}else{
				emp.scale += (4 - emp.scale) * 0.3;
				emp.alpha *= 0.8;
				
				if(emp.alpha < 0.1)
				{
					emp.alpha = 0;
					delete emp.phase;
					emp.removeFromParent(true);
					this._emp_list.splice(i,1);
					i--;
					
					if(this._emp_num<=0 && this._emp_list.length==0){
						Game.instance.restart();
					}
				}
			}
		}
		
		if(this._emp_num>0 ){
			emp=Factory.c("do");
			emp.setInstance(AssetManager.getSource("EMP"));
			emp.moveTo(Game.instance._hero.x,Game.instance._hero.y);
			this._emp_list.push(emp);
			this.addChild(emp);
			this._emp_num--;
			emp.phase=true;
		}
		
		this._interval++;
		if(this._pause || this._interval%Game.level!=0 ) return;
		var team,prec;
		
		team=MathUtil.randomInt(10);
		enemy=MovieManager.getInstance("alienAnim_");
		this._enemy_list.push(enemy);
		this.addChild(enemy);
		
		if(team>=3 || this._enemy_list.length==0){
			enemy.valu=MathUtil.randomInt(this._old_width-40);
			enemy.dire=MathUtil.randomInt(10)>5 ? 1 : -1;
		}else{
			prec=this._enemy_list[this._enemy_list.length-1];
			enemy.dire=prec.dire;
			enemy.valu=(enemy.dire>0) ? (prec.x<40 ? prec.x+40 :prec.x-40) : (prec.x>(this._old_width-40) ? prec.x-40 : prec.x+40);
		}
		
		enemy.bloo=1;
		enemy.boob=2;
		enemy.axis=enemy.valu/this._old_width;
		enemy.moveTo(enemy.valu,-120);
	}
	
	_hitTarget(enemy)
	{
		var i,bullet,arr=Game.instance._firing._bullets;
		for(i=0;i<arr.length;i++){
			bullet=arr[i];
			
			if(bullet.hitTestObject(enemy)) {
				enemy.bloo--;
				bullet.removeFromParent(true);
				arr.splice(i,1);
				i--;
			}
			
			if(enemy.bloo<=0){
				this.kill(enemy,true);
				return;
			}
		}
		
		var hero=Game.instance._hero;
		if(!enemy.hitTestObject(hero._instance) || hero._dead) return;
		
		if(Game.instance._firing.protect){
			this.kill(enemy,true);
		}else{
			Game.instance.dead();
		}
	}
	
	resizeHandler(e)
	{
		var w=Global.canvas.width;
		var h=Global.canvas.height;
		
		var i,enemy,boob,partical,emp,shell;
		for(i=0;i<this._enemy_list.length;i++)
		{
			enemy=this._enemy_list[i];
			enemy.valu=MathUtil.int(enemy.axis*w);
			enemy.x=(enemy.x/this._old_width)*w;
		}
		
		for(i=0;i<this._boob_list.length;i++)
		{
			boob=this._boob_list[i];
			boob.x=(boob.x/this._old_width)*w;
		}
		
		for(i=0;i<this._debris_list.length;i++)
		{
			partical=this._debris_list[i];
			partical.x=(partical.x/this._old_width)*w;
		}
		
		for(i=0;i<this._emp_list.length;i++)
		{
			emp=this._emp_list[i];
			emp.x=(emp.x/this._old_width)*w;
		}
		
		for(i=0;i<Game.instance._firing._shells.length;i++)
		{
			shell=Game.instance._firing._shells[i];
			shell.x=(shell.x/this._old_width)*w;
		}
		
		this._old_width=w;
		this._old_height=h;
	}
	
	dispose()
	{
		Stage.current.removeEventListener(StageEvent.ENTER_FRAME,null,this.name);
		Stage.current.removeEventListener(StageEvent.RESIZE,null,this.name);
		super.dispose();
	}
}
