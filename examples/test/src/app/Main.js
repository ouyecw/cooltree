
import {Button,Effect,Source,Global,Stage,LoadingClip,Loader,AssetManager,Factory,StageEvent,ObjectUtil,MovieManager,MathUtil,ContentList,ContentItem} from 'cooltree'
import Spine from './Spine.js'
import EItem from './EItem.js'
// import * as CT from 'cooltree'

window.onload = function()
{
	/**
	 * 显示模式 true为canvas显示 false为DOM显示（默认为true）
	 */
	Global.useCanvas=true;
	
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
	const clip=new LoadingClip("assets/img/buffer.png");
	
	//移动到舞台中间位置
	clip.moveTo(stage.stageWidth*0.5,stage.stageHeight*0.5);
	
	//添加到舞台上
	stage.addChild(clip);
	
	//新建一个加载器
	const loader=new Loader();
	
	//添加事件侦听器
	loader.on(Loader.LOAD_COMPLETE,loadComplete);
	
	//加载文件路径
	loader.load(["assets/img/spineboy.atlas","assets/img/spineboy.png","assets/img/spineboy-pro.skel","assets/img/tu.png","assets/img/mix.png","assets/img/mix.plist","assets/img/lijue2.png","assets/img/lijue2.json"]);
}

function loadComplete(e)
{
	//清除事件侦听器
	e.target.off(Loader.LOAD_COMPLETE);
	
	//清空舞台 （Stage.current为获取当前舞台的静态属性）
	Stage.current.removeAllChildren(true);
	
	//将加载完成的文件数据导入资源管理器
	AssetManager.addFiles(e.params);
	
	console.log(AssetManager._cache);
	
	//新建一个显示对象
	// const img=Factory.c("do");
	
	// const asset=AssetManager.getSource("fb_2");
	// //设置显示内容（资源管理器中取出）,通过Loader.getName获取路径的资源id
	// img.setInstance(asset);
	// console.log(img.width,img.height)
	// //添加到舞台
	// Stage.current.addChild(img);
	
	const list=new ContentList({
		height:90,
		width:550,
		isY:false,
		space:10,
		line:{
			width:2,
			height:88
		},
		className:EItem
	});
	
	let i=10,data=[];
	while(i>0){
		data.push({
			img:"img_tu@png",
			size:96
		})
		i--;
	}
	
	list.addData(data,960)
	Stage.current.addChild(list);
	list.moveTo(80,30);
	
	//新建一个显示对象
	const lijue=MovieManager.getInstance("lijue");
	
	lijue.moveTo(200,180);
	//添加到舞台
	Stage.current.addChild(lijue);
	
	const role=new Spine();
	role.setInstance(
		AssetManager.getSource("img_spineboy-pro@skel"),
		AssetManager.getSource("img_spineboy@atlas"),
		[AssetManager.getSource("img_spineboy@png")],true);
	
	Stage.current.addChild(role);
	role.moveTo(80,300);
	role.scale=0.3;
	role.play(2);
	
	const mc=MovieManager.getInstance("composition");
	Stage.current.addChild(mc);
	mc.moveTo(320,120);
	mc.scale=0.4;
	mc.rate=2;
}

window.onresize=function()
{
	const h=Math.max(window.innerHeight,100);
	const w=Math.max(window.innerWidth,100);
	Global.reszie(w,h);
}