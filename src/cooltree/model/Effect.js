
import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import DropShadowFilter from '../filters/DropShadowFilter.js'
import TweenLite from '../transitions/TweenLite.js'
import ObjectPool from '../utils/ObjectPool.js'
import ColorUtil from '../utils/ColorUtil.js'
import ClassUtil from '../utils/ClassUtil.js'
import MathUtil from '../utils/MathUtil.js'
import Point from '../geom/Point.js'

/**
 * @class
 * @module Effect
 */
export default class Effect
{
	constructor(type,value,time,align,tween)
	{
		this.type=this.value=this.time=this.align=this.tween=null;
		this.setup(type,value,time,align,tween);
	}
	
	/**
	 * 设置特效
	 * @param {String} type
	 * @param {Number|String} value
	 * @param {Number} time
	 * @param {Number} align
	 * @param {String} tween
	 */
	setup(type,value,time,align,tween)
	{
		this.type=type;
		this.time=time || 0;
		
		this.value=value;
		this.align=align || 0;
		this.tween=tween;
	}
	
	clone()
	{
		let copy=ObjectPool.create(Effect);
		
		copy.value=this.value;
		copy.align=this.align;
		copy.tween=this.tween;
		
		copy.type=this.type;
		copy.time=this.time;
		
		return copy;
	}
	
	reset(type=null,value=null,time=0,align=0,tween=null)
	{
		this.setup(type,value,time,align,tween);
	}
	
	dispose()
	{
		delete this.type,this.value,this.time,this.align,this.tween;
	}
	
	static run(instance,effect)
	{
		if(instance==undefined || effect==undefined) return;
		TweenLite.remove(instance);
		
		if(effect instanceof Effect){
			Effect._execute(instance,effect);
			return;
		}
		
		if(effect instanceof Array){
			let i,l;
			for(i=0,l=effect.length;i<l;i++){
				Effect._execute(instance,effect[i]);
			}
		}
	}
	
	static _execute(instance,effect)
	{
		if(instance==undefined || effect==undefined) return;
		
		if(effect.align==Effect.CENTER){
			instance.origin={x:instance.width*0.5,y:instance.height*0.5};
		}
		
		let obj,num,pos,bool=(effect.type==Effect.SHADOW);
		
		if(effect.type==Effect.MOVE || effect.type==Effect.OFFSET){
			pos=Point.toPoint(effect.value);
			if(effect.type==Effect.OFFSET) pos.offset(instance.x,instance.y);
			bool=true;
		}
		
		if(instance[effect.type]==undefined && !bool) return;
	    
	    if(effect.time<=0) {
	    	if(bool) instance.moveTo(pos.x,pos.y);
	    	else instance[effect.type]=effect.value;
	    }
	    
	    if(instance.parent && instance.parent.autoSize) instance._parent._updateSize();
	    if(effect.time<=0) return;
	    
	    if(effect.type==Effect.COLOR){
	    	num=instance.color;
	    	instance.__temp_num=0;
	    	TweenLite.to(instance,effect.time,{ease:effect.tween,__temp_num:1,onUpdate:function(){
	    		instance.__checkDisplayUpdate();
	    		instance.color=ColorUtil.formatColor(ColorUtil.interpolateColor(num,effect.value,instance.__temp_num));
	    	},onComplete:function(){
	    		instance.__checkDisplayUpdate();
	    		instance.color=effect.value;
	    	}});
	    	return;
	    }
	    
	    if(effect.type==Effect.SHADOW){
	    	if(instance.filters == undefined) {
	    		if((instance instanceof DisplayObjectContainer) && instance.numChildren==1 && (instance.getChildAt(0).filters)){
	    			instance=instance.getChildAt(0);
	    		}
	    		else return;
	    	}
	    	
	    	if((typeof effect.value)=="string"){
	    		pos=JSON.parse(effect.value);
	    	}
	    	else pos=effect.value;
	    	
	    	if(instance.filters.length==0){
	    		obj=new DropShadowFilter(0,0,0);
	    		instance.filters.push(obj);
	    	}else{
	    		for(let filter,i=0,l=instance.filters.length;i<l;i++){
	    			filter=instance.filters[i];
	    			if(filter && ClassUtil.getQualifiedClassName(filter)=="DropShadowFilter"){
	    				obj=filter;
	    				continue;
	    			}
	    		}
	    	}
	    	
	    	if(obj == undefined || pos==undefined || pos.length==undefined || pos.length<1) return;
	    	
	    	if((pos.length==1 && pos[0]==obj.distance) ||
	    	   (pos.length==2 && pos[0]==obj.distance && pos[1]==obj.angle) ||
	    	   (pos.length==3 && pos[0]==obj.distance && pos[1]==obj.angle && pos[2]==obj.shadowBlur) ||
	    	   (pos.length==4 && pos[0]==obj.distance && pos[1]==obj.angle && pos[2]==obj.shadowBlur && pos[3]==obj.shadowColor) ||
	    	   (pos.length==5 && pos[0]==obj.distance && pos[1]==obj.angle && pos[2]==obj.shadowBlur && pos[3]==obj.shadowColor && pos[4]==obj.alpha) ||
	    	   (pos.length==6 && pos[0]==obj.distance && pos[1]==obj.angle && pos[2]==obj.shadowBlur && pos[3]==obj.shadowColor && pos[4]==obj.alpha && pos[5]==obj.radius)) return;
	    	
	    	instance.__temp_num=0;
	    	TweenLite.to(instance,effect.time,{ease:effect.tween,__temp_num:1,onUpdateParams:[obj,pos,obj.distance,obj.angle,obj.shadowColor,obj.shadowBlur,obj.alpha,obj.radius],onUpdate:function(o,t,d,a,c,b,p,r){
	    		o.distance=MathUtil.format(d+(t[0]-d)*instance.__temp_num);
	    		if(t.length>1) o.angle=MathUtil.format(a+(t[1]-a)*instance.__temp_num);
	    		if(t.length>2) o.shadowBlur=MathUtil.format(b+(t[2]-b)*instance.__temp_num);
	    		if(t.length>3) o.shadowColor=ColorUtil.formatColor(ColorUtil.interpolateColor(c,t[3],instance.__temp_num));
	    		if(t.length>4) o.alpha=MathUtil.format(p+(t[4]-p)*instance.__temp_num);
	    		if(t.length>5) o.radius=MathUtil.format(r+(t[5]-r)*instance.__temp_num);
	    		if(t.length>1) o.setShadowOffset();
	    		instance.__checkDisplayUpdate();
	    	},onCompleteParams:[obj,pos],onComplete:function(o,t){
	    		o.distance=t[0];
	    		if(t.length>1) o.angle=t[1];
	    		if(t.length>2) o.shadowBlur=t[2];
	    		if(t.length>3) o.shadowColor=t[3];
	    		if(t.length>4) o.alpha=t[4];
	    		if(t.length>5) o.radius=t[5];
	    		if(t.length>1) o.setShadowOffset();
	    		instance.__checkDisplayUpdate();
	    	}});
	    	return;
	    }
	    
	    obj={ease:effect.tween};
	    
	    if(bool || effect.type==Effect.SCALE) 
	    	obj.onUpdate=function(){if(instance.parent && instance.parent.autoSize) instance._parent._updateSize()};
	    
	    if(bool) {
	    	obj.x=pos.x;
	    	obj.y=pos.y;
	    }
	    else obj[effect.type]=effect.value;
	    TweenLite.to(instance,effect.time,obj);
	}
}

Effect.className="Effect";

/**
 * type
 */
Effect.MOVE="move";
Effect.COLOR="color";
Effect.SCALE="scale";
Effect.ALPHA="alpha";
Effect.OFFSET="offset";
Effect.SHADOW="shadow";

/**
 * align
 */
Effect.CENTER=1;