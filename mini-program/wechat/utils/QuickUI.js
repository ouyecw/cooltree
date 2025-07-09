import Button from '../ui/Button.js'
import ClassUtil from './ClassUtil.js'
import ColorUtil from './ColorUtil.js'
import Effect from '../model/Effect.js'
import GColor from '../model/GColor.js'
import Factory from '../core/Factory.js'
import TweenLite from '../transitions/TweenLite.js'

/**
 * @class
 * @module QuickUI
 */
export default class QuickUI
{
	/**
	 * 快速创建默认样式按钮
	 * @param {Number} r 圆半径
	 * @param {Number} w 宽度
	 * @param {Number} h 高度
	 * @param {String} c1 颜色（渐变1/初始）
	 * @param {String} c2 颜色（渐变2/结束）
	 * @param {Number} t  边线粗细
	 * @param {Number} c3 边线颜色
	 */
	static getButton(r,w,h,c1,c2,t,c3)
	{
		r=(r==undefined) ? 0 : r;
		w=(w==undefined) ? 0 : w;
		h=(h==undefined) ? 0 : h;
		
		c1=(c1==undefined) ? "#FF9E26" : ColorUtil.formatColor(c1);
		c2=(c2==undefined) ? "#FF7C0D" : ColorUtil.formatColor(c2);
		
		let btn=new Button();
	    let shape=Factory.c("bs");
	    let bool=(w==0 && h==0);
	    
	    w=Math.max(r*2 , w);
		h=Math.max(r*2 , h);
		
		let color=bool ? new GColor(1,r,r,r,r,[0.1,1],[c1,c2],r*0.25,r) : new GColor(0,0,0,0,h,[0.1,0.9],[c1,c2],w,h);
	    shape.setup(color,w,h,r,t,c3);
	    shape.origin={x:w*0.5,y:h*0.5};
	    btn.instance=shape;
	    
	    btn.setup([Factory.c("ef",[Effect.SCALE,1,0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)])],null,[Factory.c("ef",[Effect.SCALE,0.89,0.11,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.OUT)])]);
	    return btn;
	}
	
	/**
	 * 获取一个简单的矩形显示对象
	 * @param {Number} w 宽度
	 * @param {Number} h 高度
	 * @param {String} c 颜色或者图片
	 * @param {Number} a 透明度
	 * @param {Number} r 圆角
	 */
	static rectDisplay(w,h,c,a=1,r=0)
	{
		if(!w || !h ) return;
		c=c||"#000000";
		let obj=Factory.c("do");
		
		if(ClassUtil.isImage(c)){
			obj.setInstance(c);
			obj.repeat(w,h);
		}else{
			obj.graphics.clear();
			obj.graphics.lineStyle(0);
			obj.graphics.beginFill(c,a);
			if(r<=0) obj.graphics.drawRect(0,0,w,h);
			else obj.graphics.drawRoundRect(0,0,w,h,r,r);
			obj.graphics.endFill();
		}
		
		obj.setSize(w,h);
		return obj;
	}
}

module.exports = QuickUI;