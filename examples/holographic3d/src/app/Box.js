import {MathUtil,DisplayObjectContainer,ObjectPool,Global,UIBase,Factory,Point,ShapeUtil,StageEvent,Media,DisplayObject,Stage} from 'cooltree'

export default class Box
{
	constructor()
	{
		this.upright=true;
		this.video=this.conatiner=null;
		this.imgW=this.imgH=this.size=this.frame=0;
		this.up=this.left=this.right=this.down=null;
	}
	
	init(data,isVideo,size,swing,rate)
	{
		rate=rate || 2;
		swing=(swing!=false);
		this.size=size || 100;
		
		if(!isVideo){
			this.imgW=data[0].width;
			this.imgH=data[0].height;
		}
		
		this.up=ObjectPool.create(UIBase);
		this.up.instance=this.create(data,isVideo,swing,rate);

		this.left=ObjectPool.create(UIBase);
		this.left.instance=this.create(data,isVideo,swing,rate);

		this.down=ObjectPool.create(UIBase);
		this.down.instance=this.create(data,isVideo,swing,rate);

		this.right=ObjectPool.create(UIBase);
		this.right.instance=this.create(data,isVideo,swing,rate);

		this.container=new DisplayObjectContainer();
		this.container.addChild(this.right);
		this.container.addChild(this.left);
		this.container.addChild(this.down);
		this.container.addChild(this.up);
		this.onTap();
		
		Stage.current.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this.onTap,this));
	}
	
	enterFrame(e)
	{
		Stage.current.auto_fresh=true;
	}
	
	onTap(e=null)
	{
		if(this.video) {
			if(!this.video.playing) this.video.play();
			if(!Stage.current.hasEventListener(StageEvent.ENTER_FRAME)) 
				Stage.current.addEventListener(StageEvent.ENTER_FRAME,Global.delegate(this.enterFrame,this));
		}
		
		this.upright=!this.upright;
		
		if(this.upright){
			this.up.scaleX=-1;
			this.up.scaleY=1;
			
			this.left.rotation=90;
			this.left.scaleX=1;
			this.left.scaleY=-1;
			
			this.down.scaleX=1;
			this.down.scaleY=-1;
			
			this.right.rotation=90;
			this.right.scaleX=-1;
		}else{
			this.up.scaleX=1;
			this.up.scaleY=-1;
			
			this.down.scaleX=-1;
			this.down.scaleY=1;
			
			this.right.rotation=-90;
			this.right.scaleX=-1;
			
			this.left.rotation=90;
			this.left.scaleX=-1;
			this.left.scaleY=1;
		}
		
		this.resize(Global.width,Global.height);
	}
	
	create(data,isVideo,swing,rate)
	{
		if(!isVideo){
			const mc=Factory.c("mc");
			mc.rate=rate;
			mc.swing=swing;
			mc.setFrames(data);
			return mc;
		}
		
		if(!this.video){
			this.video=data;
			this.video.auto_play=true;
			this.imgW=this.video.getWidth();
			this.imgH=this.video.getHeight();
			this.video.addEventListener(Media.MEDIA_PLAY_COMPLETE,Global.delegate(this.playOver,this));
			return this.video;
		}
		
		const obj=ObjectPool.create(DisplayObject);
		obj.canvas=this.video.canvas;
		return obj;
	}
	
	playOver(e)
	{
		if(!this.video) return;
		this.video.play();
	}
	
	resize(w,h)
	{
		this.frame=Math.max(Math.min(w,h),this.size);
		this.container.moveTo((w-this.frame)*0.5,(h-this.frame)*0.5);
		
		const num=(this.frame-this.size)*0.5;
		let p0,p1,p2,p3,b0,b1,b2,b3;
		
		if(this.upright){
			p0=ObjectPool.create(Point).set(0,0);
			p1=ObjectPool.create(Point).set(this.frame,0);
			p2=ObjectPool.create(Point).set(this.frame,this.frame);
			p3=ObjectPool.create(Point).set(0,this.frame);
			
			b0=ObjectPool.create(Point).set(num,num);
			b1=ObjectPool.create(Point).set(num+this.size,num);
			b2=ObjectPool.create(Point).set(num+this.size,num+this.size);
			b3=ObjectPool.create(Point).set(num,num+this.size);
		}else{
			p0=ObjectPool.create(Point).set(0,num);
			p1=ObjectPool.create(Point).set(this.frame,num);
			p2=ObjectPool.create(Point).set(this.frame,this.frame-num);
			p3=ObjectPool.create(Point).set(0,this.frame-num);
			
			b0=ObjectPool.create(Point).set(num,0);
			b1=ObjectPool.create(Point).set(num+this.size,0);
			b2=ObjectPool.create(Point).set(num+this.size,this.frame);
			b3=ObjectPool.create(Point).set(num,this.frame);
		}
		
		
		let array;
		if(this.upright){
			this.up.moveTo(p1);
			this.left.moveTo(p0);
			this.down.moveTo(p3);
			this.right.moveTo(p2);
			array=[p0,p1,b1,b0];
		}
		else{
			this.up.moveTo(p0);
			this.left.moveTo(num,this.frame);
			this.down.moveTo(this.frame,this.frame-num);
			this.right.moveTo(this.frame-num,0);
			array=[b0,b1,p1,p0];
		}
		
		const vo=ShapeUtil.getPolygon(array);
		this.up.mask=vo.clone();
		this.down.mask=vo;
		
		const frameHeight=num;
		const frameWidth=this.frame;
		const scale=MathUtil.getSizeScale(this.imgW,this.imgH,frameWidth,frameHeight,true);
		const p=ObjectPool.create(Point).set((frameWidth-this.imgW*scale)*0.5,(frameHeight-this.imgH*scale)*0.5);
		
		this.up.instance.scale=this.left.instance.scale=this.down.instance.scale=this.right.instance.scale=scale;
		this.right.instance.moveTo(p);
		this.down.instance.moveTo(p);
		this.left.instance.moveTo(p);
		this.up.instance.moveTo(p);
		
		ObjectPool.remove(p0);
		ObjectPool.remove(p1);
		ObjectPool.remove(p2);
		ObjectPool.remove(p3);
		ObjectPool.remove(b0);
		ObjectPool.remove(b1);
		ObjectPool.remove(b2);
		ObjectPool.remove(b3);
		ObjectPool.remove(p);
	}
}