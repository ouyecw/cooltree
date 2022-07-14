
import {RouteUtil,Global,Stage,LoadingClip,Ajax,Loader,AssetManager,Timer} from 'cooltree'
import Box from "./Box.js"

let loadingClip,params,path,api,photos,box,args;

window.onload = function()
{
	params=RouteUtil.getQuery();
	
	if(!Global.useCanvas && params.path){
		warning("播放视频必须使用Canvas模式");
		return;
	}
	
	init();
	
	if(params.path){
		load(params.path);
		return;
	}
	
	requestData();
}

function init()
{
	/**
	 * 显示模式 true为canvas显示 false为DOM显示（默认为true）
	 */
	Global.useCanvas=(params.render!=0);
	Global.breakTouch=true;
	/**
	 * 初始化场景
	 */
	const stage=new Stage();
	
	/**
	 * 设置父级容器（默认自动添加到body里面新的节点）
	 */
	stage.div=document.getElementById("stage");
	
	/**
	 * 初始化场景的宽度和高度
	 */
	stage.initCanvas(window.innerWidth,window.innerHeight);
	
	
	/**
	 * 初始化工作已经完成
	 */
	
	//新建一个加载组件
	loadingClip=new LoadingClip("assets/img/buffer.png");
	
	//移动到舞台中间位置
	loadingClip.moveTo(stage.stageWidth*0.5,stage.stageHeight*0.5);
	
	//添加到舞台上
	stage.addChild(loadingClip);
}

function warning(text)
{
	if(loadingClip){
		loadingClip.removeFromParent(true);
		loadingClip=null;
	}
	
	const tf=document.getElementById("text");
	tf.style.display="block";
	tf.innerHTML=text;
}

async function requestData()
{
	// const data=await new Ajax().post(api+"api/ps/video/info",{photo3dId:params.id});
	// if(data.code!="0000") return warning(data.msg);
	
	// args=data.data;
	// photos=args.psPhotos.map(item=>{
	// 	return path+item.url;
	// })
	
	args={
		photoSwing:1,
		photoRollingSpeed:75
	}
	
	photos=[];
	
	for(let i=1;i<10;i++){
		photos.push("../imgs/"+i+".jpg");
	}
	
	load(photos.slice());
}

function load(data)
{
	//新建一个加载器
	const loader=new Loader();
	
	//添加事件侦听器
	loader.addEventListener(Loader.LOAD_COMPLETE,loadComplete);
	
	//加载文件路径
	loader.load(data);
}

function loadComplete(e)
{
	//清除事件侦听器
	e.target.removeEventListener(Loader.LOAD_COMPLETE);
	
	//清空舞台 （Stage.current为获取当前舞台的静态属性）
	if(loadingClip){
		loadingClip.removeFromParent(true);
		loadingClip=null;
	}
	
	box=new Box();
	
	if(params.path){
		box.init(e.params[Loader.getName(params.path)],true);
	}
	else{
		const dos=photos.map(str=>{
			const img=e.params[Loader.getName(str)];
			return AssetManager.fromImage(img);
		})
		
		box.init(dos,false,params.size,args.photoSwing==1,Math.ceil(args.photoRollingSpeed/Timer.fps));
	}
	
	Stage.current.addChild(box.container);
}

window.onresize=function()
{
	const h=Math.max(window.innerHeight,500);
	const w=Math.max(window.innerWidth,500);
	Global.reszie(w,h);
	
	if(box) box.resize(w,h);
	if(loadingClip && loadingClip.parent) loadingClip.moveTo(w*0.5,h*0.5);
}
