var _is_init=false;

Main={};
Main.studio;
Main.locale="";
Main.min_width=200;
Main.min_height=80;
Main.mode_data=null;

Main.catch_pic_width=0;
Main.catch_pic_height=0;

Main.user="";
Main.status=0;
Main.power=false;

Main.root="";
Main.preview_path=Main.root+"/shared/all/poster.html?preview=";
Main.get_mode_data=Main.root+"/api/common/edit_poster_data/";
Main.post_data_path=Main.root+"/api/common/upload_post_data/";
Main.upload_asset_path=Main.root+"/api/common/upload_poster_asset/";
Main.upload_video_path=Main.root+"/demo/upload_file/";

window.onload = function()
{
	if(_is_init) return;
	_is_init=true;
	
	var stage=new Stage();
	stage.div=document.getElementById("stage");
	
    var mode=Global.GetQueryString("render");
    if(!StringUtil.isEmpty(mode)) Global.useCanvas=(Number(mode)==1);
    
    var power=Global.GetQueryString("power");
    if(!StringUtil.isEmpty(power))  Main.power=(Number(power)==1);
    
    var status=Global.GetQueryString("status");
    if(!StringUtil.isEmpty(status))  Main.status=Number(status);
    
     var user=Global.GetQueryString("user");
    if(!StringUtil.isEmpty(user))  Main.user=user;
    
    var manager=Global.GetQueryString("manager");
    if(!StringUtil.isEmpty(manager))  Main.manager=manager;

//  Global.useCanvas=false;
	stage.initCanvas(window.innerWidth,window.innerHeight);
	
	var loading=Global.GetQueryString("loading");
	var loader=new Loader((StringUtil.isEmpty(loading) ? "img/resource.json" : loading)+"?"+MathUtil.randomInt(1000),Main.locale,"preload");
	loader.addEventListener(Loader.LOAD_COMPLETE,onComPlete);
}

function onComPlete(e)
{
	e.target.removeEventListener(Loader.LOAD_COMPLETE);
	Main.mode_id=Global.GetQueryString("id");
	AssetManager.addFiles(e.params);
	
	if(!StringUtil.isEmpty(Main.mode_id)){
		var ajax=new Ajax();
		ajax.get(Main.get_mode_data,{id:Main.mode_id},function(data){
			data=(typeof(data)=="string") ? JSON.parse(data) : data;
			if(data.result==1 || data.result=="1"){
				Main.mode_data=JSON.parse(data.data);
				parse_mode();
			}
			else trace("[ERROR] Main",data.err_msg);
		});
		return;
	}
	
	start_editor();
}

function parse_mode()
{
	if(Main.mode_data.hasOwnProperty("backdround")){
		Main.mode_data.background=Main.mode_data.backdround;
	}
	
	var i,d,l=Main.mode_data.data.length,loads=[];
	
	if(!StringUtil.isEmpty(Main.mode_data.background)){
		loads.push(Main.root+Main.mode_data.background);
	}
	
	for(i=0;i<l;i++){
		d=Main.mode_data.data[i];
		if(d.type==0) loads.push(Main.root+d.data);
		else if(d.type<=0) loads.push(Main.root+d.data);
		else if(d.type>1 && d.data && !StringUtil.isEmpty(d.data.pattern)) {
			loads.push(Main.root+d.data.pattern);
		}
	}
	
	var loader=new Loader(loads);
	loader.addEventListener(Loader.LOAD_COMPLETE,loadAssetComplete);
	loader.load();
}

function loadAssetComplete(e)
{
	e.target.removeEventListener(Loader.LOAD_COMPLETE);
	AssetManager.addFiles(e.params);
	start_editor(true);
}

function start_editor(bool)
{
	var data=AssetManager.getSource("img_config@json");
    Main.min_width=Number(data.config.display_min_width);
    Main.min_height=Number(data.config.display_min_height);
	
	Main.studio=new Studio();
	Main.studio.init(data,bool)
	Stage.current.addChild(Main.studio);
}

window.onresize=function()
{
	if(!_is_init) return;
	var w=MathUtil.format(window.innerWidth-1);
	var h=MathUtil.format(window.innerHeight-1);
	if(w<Main.min_width || h<Main.min_height) return;
	
	Global.reszie(w,h);
	Stage.current.dispatchEvent(new Event(StageEvent.RESIZE,{w:w,h:h}));
}