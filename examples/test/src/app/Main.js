
import {Button,Effect,Source,Global,Stage,LoadingClip,Loader,AssetManager,Factory,StageEvent,ObjectUtil,MovieManager,MathUtil} from 'cooltree'

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
	stage.initCanvas(500,600);
	
	
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
	loader.addEventListener(Loader.LOAD_COMPLETE,loadComplete);
	
	//加载文件路径
	loader.load(["assets/img/tu.png","assets/img/anim.png","assets/img/anim.json"]);
}

function loadComplete(e)
{
	//清除事件侦听器
	e.target.removeEventListener(Loader.LOAD_COMPLETE);
	
	//清空舞台 （Stage.current为获取当前舞台的静态属性）
	Stage.current.removeAllChildren(true);
	
	//将加载完成的文件数据导入资源管理器
	AssetManager.addFiles(e.params);
	
	/**
	 * 显示一张图片
	 */
	
	//新建一个显示对象
	const img=Factory.c("do");
	
	//设置显示内容（资源管理器中取出）,通过Loader.getName获取路径的资源id
	img.setInstance(AssetManager.getSource(Loader.getName("img/tu.png")));
	
	//添加到舞台
	Stage.current.addChild(img);
	
	/**
	 * 显示一个按钮
	 */
	//新建按钮
	const btn=new Button();
	
	//画一个矩形 参数颜色 宽度 高度 圆角半径
	const box=Factory.c("bs",["#ff88ff",120,40,3]);
	
	//设置按钮显示
	btn.instance=box;
	
	//按钮设置特效
	btn.setup([Factory.c("ef",[Effect.COLOR,"#ff88ff",0.5])],
			  [Factory.c("ef",[Effect.COLOR,"#ff8800",1])],
			  [Factory.c("ef",[Effect.COLOR,"#ff5555",1])]);
	
	//添加到舞台
	Stage.current.addChild(btn);
	
	//移动按钮位置
	btn.moveTo(180,Stage.current.stageHeight-65);
	
	//设置按钮文本
	btn.setLabel({text:"NEW",size:26,color:"#FFFFFF",x:25},"#000000");
	
	//添加事件侦听器
	btn.addEventListener(StageEvent.MOUSE_CLICK,click_handler);
}

function click_handler(e)
{
	//获取所有Zombie_ladder动画的动作标签
	const anims=ObjectUtil.getLabels(MovieManager._dic["Zombie_ladder"]);
	const len=anims.length;
	
	const action=anims[MathUtil.randomInt(len)];
	trace(">>",action);
	
	//新建动画实例
	const mc=MovieManager.getInstance(action,"Zombie_ladder");
	
	//添加到舞台
	Stage.current.addChildAt(mc,1);
	
	//移动动画位置
	mc.moveTo(MathUtil.randomInt(Stage.current.stageWidth-80),MathUtil.randomInt(Stage.current.stageHeight-80));
	
	//动画随机缩放
	mc.scale=MathUtil.clamp(Math.random(),0.4,1);
}

