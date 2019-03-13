
class Scence extends DisplayObjectContainer
{
	
	constructor()
	{
		super();
		this._floors=this._skys=null;
		this._floor=this._sky=null;
		this._bg=this._tf=null;
		
		this._music=null;
		this._floor_speed=5;
		this._sky_speed=this._floor_speed*2;
	}
	
	init()
	{
		this._floors=[];
		this._skys=[];
		
		this._floor=Factory.c("dc");
		this.addChild(this._floor);
		
		this._sky=Factory.c("dc");
		this.addChild(this._sky);
		
		this._bg=Factory.c("bs",["#000000",Global.canvas.width,Global.canvas.height]);
		this.addChild(this._bg);
		
		this._tf=Factory.c("tf",{font:"Onky",text:"COOL-TREE GAME"});
		this._tf.moveTo(50,300);
		this._tf.alpha=0;
		this.addChild(this._tf);
		
		this._create_map(this._floors,this._floor,"shmupBG_top",{x:0,y:-790});
		this._create_map(this._floors,this._floor,"shmupBG_mid",{x:0,y:0});
		this._create_map(this._floors,this._floor,"shmupBG_bot",{x:0,y:790});
		
		this._create_map(this._skys,this._sky,"cloudsFORE_bot",{x:0,y:-1600});
		this._create_map(this._skys,this._sky,"cloudsFORE_top",{x:0,y:-800});
		this._create_map(this._skys,this._sky,"cloudsFORE_bot",{x:0,y:0});
		this._create_map(this._skys,this._sky,"cloudsFORE_top",{x:0,y:800});
		
		this._music=AssetManager.getSource("sound_Sound 9@mp3");
		this._music.addEventListener(Media.MEDIA_PLAY_COMPLETE,Global.delegate(this._play_over,this));
		
		Stage.current.addEventListener(StageEvent.RESIZE,Global.delegate(this.resizeHandler,this),this.name);
		Stage.current.addEventListener(StageEvent.ENTER_FRAME,Global.delegate(this.onEnterFrame,this),this.name);
	    this.resizeHandler();
	    
	    TweenLite.to(this._tf,0.5,{alpha:1,delay:1.5,onComplete:Global.delegate(this._tween_complete,this),onCompleteParams:[true]})
	}
	
	_tween_complete(bool)
	{
		if(bool){
			TweenLite.to(this._tf,0.5,{alpha:0,delay:1})
			TweenLite.to(this._bg,0.6,{alpha:0,delay:1,onComplete:Global.delegate(this._tween_complete,this),onCompleteParams:[false]});
			return;
		}
		
		this._tf.removeFromParent(true);
		this._bg.removeFromParent(true);
		
		this._tf=this._bg=null;
		this._music.play();
		
		Stage.current.dispatchEvent(new Event(Game.FADE_IN));
	}
	
	_play_over(e)
	{
		this._music.play();
	}
	
	_create_map(array,container,asset,pos)
	{
		var map=Factory.c("do");
		asset=AssetManager.getSource(asset);
		map.setInstance(asset);
		array.push(map);
		container.addChild(map);
		if(pos) map.moveTo(pos.x,pos.y);
	}
	
	resizeHandler(e)
	{
		var w=Global.canvas.width;
		var h=Global.canvas.height;
		
		this.scale=w/600;
		
		if(this._bg) {
			this._bg.width=w/this.scale;
			this._bg.height=h/this.scale;
		}
		
		if(this._bg && this._tf) this._tf.moveTo(50,this._bg.height*0.4);
	}
	
	onEnterFrame(e)
	{
		this._move_map(this._floors,this._floor_speed,790);
		this._move_map(this._skys,this._sky_speed,799.9);
	}
	
	_move_map(list,speed,mheight)
	{
		var i,l,item,minY=null,maxTarget=null;
		for(i=0,l=list.length;i<l;i++){
			item=list[i];
			item.y+=speed;
			
			if(maxTarget==null || maxTarget.y<item.y) maxTarget=item;
			minY=(minY==null) ? item.y : Math.min(minY,item.y);
		}
		
		if(minY>=0){
			maxTarget.y=minY-mheight;
		}
	}
	
	dispose()
	{
		if(this._music) this._music.dispose();
		Stage.current.removeEventListener(StageEvent.ENTER_FRAME,null,this.name);
		Stage.current.removeEventListener(StageEvent.RESIZE,null,this.name);
		super.dispose();
	}
}