var _is_init=false;
var _show_fps=true;
var _fps=0;

var _preloader;
var _fps_tf;
var _loader;
var _stage;
var _game;

const Main={};
Main.locale="assets/";
Main.label=Main.canvas=null;
Main.minWidth=360;

import * as cooltree from 'cooltree'

/**
 * init framework to window
 */
for(let i in cooltree){
	if(i=="default") continue;
	window[i]=cooltree[i];
}

const Game= require('./Game.js').default;

window.onload = function()
{
	if(_is_init) return;
	_is_init=true;
	
	/**
	 * change display mode
	 * true canvas mode
	 * false dom mode
	 */
	Global.useCanvas=true;
	
	_stage=new Stage();
	_stage.div=document.getElementById("stage");
	
	var canvas=StringUtil.isEmpty(Main.label) ? Main.canvas : document.getElementById(Main.label);
    _stage.initCanvas(window.innerWidth,window.innerHeight,canvas);
    
    _loader=new Loader("img/source.json",Main.locale,"preload");
    _loader.addEventListener(Loader.LOAD_COMPLETE,onComPlete);
}

function onEnterFrame(e)
{
	_fps++;
}

function onComPlete(e)
{
    AssetManager.addFiles(e.params);
    
	if(e.label=="preload") {
		_preloader=MovieManager.getInstance("Image");
		_stage.addChild(_preloader);
		window.onresize();
		_loader.load("game");
	}
	else if(e.label=="game"){
		_game=new Game();
		_stage.addChild(_game);
		
		_game.init();
		_preloader.removeFromParent(true);
		
		if(!_show_fps) return;
		_fps_tf=Factory.c("tf",{text:"FPS",size:16,color:"#FFFFFF",width:90,height:20});
		_stage.addEventListener(StageEvent.ENTER_FRAME,onEnterFrame);
		_stage.addChild(_fps_tf);
		
		setInterval(function(){
			_fps_tf.text=" FPS:"+_fps+"/"+Timer.fps;
			_fps=0;
		},1000);
	}
}

window.onresize=function()
{
	if(!_is_init || window.innerWidth<Main.minWidth) return;
	Global.reszie(window.innerWidth,window.innerHeight);
	
	if(_preloader && _preloader.parent){
		_preloader.moveTo((Global.canvas.width-_preloader.width)*0.5,(Global.canvas.height-_preloader.height)*0.5);
	}
	
    Stage.current.dispatchEvent(new Event(StageEvent.RESIZE,null));
}