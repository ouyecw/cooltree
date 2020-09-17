/**
===================================================================
TextField Class
===================================================================
**/

import DisplayObject from '../display/DisplayObject.js'
import StageEvent from '../events/StageEvent.js'
import StringUtil from '../utils/StringUtil.js'
import ObjectUtil from '../utils/ObjectUtil.js'
import ColorUtil from '../utils/ColorUtil.js'
import Global from '../core/Global.js'

export default class TextField extends DisplayObject
{

	/**
	 * s text,f font,c color,z size,t type
	 * @param {String} string_content
	 * @param {String} font_name
	 * @param {String} color 
	 * @param {Number} size 
	 * @param {String} fillType ( 'fill' 'both' 'stroke')
	 * @param {String} stroke_color
	 * @param {Number} leading
	 */
	constructor(s="",f="Microsoft YaHei,Arial",c="#000000",z=12,t="fill",c2="#000000",l=0)
	{
		super();
		this._text = s;
	    this._font = f;
	    this._size = z;
	    this._leading=l;
	    this._fill_type=t;
	    this._color2 = c2;
		this._color= ColorUtil.formatColor(c);
		
		this._lineHeight=1;
		this._has_update=true;
		this._textAlign = "left";
	    this._textBaseline = "middle";
		this._underline=this._italic=this._bold=false;
		
		this._lineWidth = null;
		this._fontMetrics = null;
		
		this.autoSize=true;
		this.scrollHeight=0;
		this.mouseEnabled=false;
		this._writingMode=false;
		
		/**
		 * 是否断开单词
		 */
		this.wordBreak=true;
		
		this.width=0;
		if(!StringUtil.isEmpty(this._text)) this._update();
	}
	
	get has_update()
	{
		return this._has_update;
	}
	
	set has_update(value) 
	{
        if(this._has_update==value) return;
		this._has_update=value;
		if(value) this.__checkDisplayUpdate();
    }
	
	get lineWidth()
	{
		return this._lineWidth;
	}
	
	/**
	 * 行宽
	 * @param {Number} l
	 */
	set lineWidth(value) 
	{
        if(this._lineWidth==value) return;
	
		this._lineWidth=value;
		this.has_update=true;
    }
	
	get italic()
	{
		return this._italic;
	}
	
	/**
	 * 斜体
	 * @param {Boolean} i
	 */
	set italic(value) 
	{
        if(this._italic==value) return;
	
		this._italic=value;
		this.has_update=true;
    }
	
	get writingMode()
	{
		return this._writingMode;
	}
	
	/**
	 * 是否竖排(默认 否)
	 * @param {Boolean} 
	 */
	set writingMode(value) 
	{
        if(this._writingMode==value) return;
	
		this._writingMode=value;
		this.has_update=true;
    }
	
	get underline()
	{
		return this._underline;
	}
	
	/**
	 * 下划线
	 */
	set underline(value) 
	{
        if(this._underline==value) return;
		this._underline=value;
    }
	
	get bold()
	{
		return this._bold;
	}
	
	/**
	 * 粗体
	 * @param {Boolean} b
	 */
	set bold(value) 
	{
        if(this._bold==value) return;
	
		this._bold=value;
		this.has_update=true;
    }
	
	get text()
	{
		return this._text;
	}
	
	/**
	 * 内容
	 * @param {String} s
	 */
	set text(value) 
	{
        if(this._text==value) return;
	
		this._text=value;
		this.has_update=true;
    }
	
	get size()
	{
		return this._size;
	}
	
	/**
	 * 字体 例如 "14px/30px"
	 * @param {Number} {String} z
	 */
	set size(value) 
	{
        if(this._size==value) return;
	
		this._size=value;
		this.has_update=true;
		this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
    }
	
	get color()
	{
		return this._color;
	}
	
	/**
	 * 字体颜色 0xFFFFFF "#FFFFFF"
	 * @param {Number} {String} c
	 */
	set color(value) 
	{
    	if(StringUtil.isEmpty(value)) return;
    	value=ColorUtil.formatColor(value);
        if(this._color==value) return;
	
		this._color=value;
		this.has_update=true;
    }
	
	get strokeColor()
	{
		return this._color2;
	}
	
	/**
	 * 文字描边颜色
	 * @param  {Number} {String} c
	 */
	set strokeColor(value) 
	{
    	value=ColorUtil.formatColor(value);
        if(this._color2==value) return;
	
		this._color2=value;
		this.has_update=true;
    }
	
	get font()
	{
		return this._font;
	}
	
	/**
	 * 例如 "微软雅黑,宋体"
	 * @param {String} f
	 */
	set font(value) 
	{
        if(this._font==value) return;
	
		this._font=value;
		this.has_update=true;
		this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
    }
	
	get fillType()
	{
		return this._fill_type;
	}
	
	/**
	 * fill both stroke
	 * @param {String} t
	 */
	set fillType(value) 
	{
        if(this._fill_type==value) return;
	
		this._fill_type=value;
		this.has_update=true;
    }
	
	get align()
	{
		return this._textAlign;
	}
	
	/**
	 * start、end、right、center
	 */
	set align(value) 
	{
        if(this._textAlign==value) return;
	
		this._textAlign=value;
		this.has_update=true;
    }
	
	get leading()
	{
		return this._leading;
	}
	
	/**
	 * 字间距
	 * @param {Number} a
	 */
	set leading(value) 
	{
        if(this._leading==value) return;
	
		this._leading=value;
		this.has_update=true;
    }
	
	get lineHeight()
	{
		return this._lineHeight;
	}
	
	/**
	 * 行间距
	 * @param {Number} a
	 */
	set lineHeight(value) 
	{
        if(value==null || value<=0 || this._lineHeight==value) return;
		this._lineHeight=value;
		this.has_update=true;
    }
	
	get baseLine()
	{
		return this._textBaseline;
	}
	
	/**
	 * top、hanging、middle、alphabetic、ideographic、bottom
	 */
	set baseLine(value) 
	{
        if(this._textBaseline==value) return;
	
		this._textBaseline=value;
		this.has_update=true;
    }
	
	
	/**
	 * 获得字体框宽度
	 */
	getTextWidth(str=null)
	{
		const global_context=(this.stage ? this.stage.context : Global.context);
		str=str==null ? this._text : str;
		
		if(!global_context || !this.context) return 0;
		if(global_context.font !=this.context.font) global_context.font=this.context.font;
		return global_context.measureText(str).width;
	}
	
	get stage()
	{
		return this._stage;
	}
	
	set stage(value) 
	{
        if(this._stage==value) return;
		if(this._stage) this._stage.removeEventListener(StageEvent.UPDATE,null,this.name);
		
		this._stage=value;
		if(this._stage) this._stage.addEventListener(StageEvent.UPDATE,Global.delegate(this.__update_size,this),this.name);
    }
	
	_update()
	{
		this.context.reset();
		this.context.font = (this._italic ? "italic " : "")+(this._bold ? "bold " : "")+(ObjectUtil.getType(this._size)=="number" ? this._size+"px " : this._size+" ")+this._font;
		
		if(this._writingMode) this._vertical_text();
		else   this._horizontal_text();
		this.has_update=false;
	}
	
	//竖排
	_vertical_text()
	{
		if(this._fontMetrics == null) this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
		
		const texts=this._text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);
		let isNormal,word,i,j,line,l=texts.length, width,oy=this._fontMetrics.height * this._lineHeight*0.5,dy =oy,my=(this.autoSize && this._lineWidth ? this._lineWidth : this.height), sy=this._fontMetrics.height*0.5, wordHeight = this._fontMetrics.height;
	    let mw=0,mx=this.autoSize ? 0 : this.width-this.size*0.5;
	    let wlen,align_left=(this._textAlign=="start" || this._textAlign=="left"),lines=(align_left && !this.autoSize ? null : []);
		
		for (i=0;i<l;i++){
			line=texts[i];
			width=0;
			
			if(!this.autoSize && mx<=this._leading) break;
			
			let cache=(align_left && !this.autoSize ? null : []);
			for(j = 0, wlen = line.length; j < wlen; j++)
			{
				word = line.charAt(j);
				if(!word || word.length == 0) continue;
				isNormal=!word.match(/[\u4e00-\u9fa5]/);//line.charCodeAt(j)<257;
				width=this.getTextWidth(word);
				mw=Math.max(mw,width);
				
				if(sy+dy>=my-this._leading){
					if(cache && cache.length) {
						lines.push({d:cache,r:{x:mx-mw,y:cache[0].y,w:mw,h:(cache[cache.length-1].y-cache[0].y+wordHeight+this._leading)}});
					    cache=[];
					}
					
					dy=oy;
					mx-=this._fontMetrics.height*this._lineHeight;
					if(!this.autoSize && mx<=this._leading) break;
				}
				
				if(cache) cache.push({w:word,x:mx-width,y:sy+dy,b:isNormal});
				else this._draw(word, sy+dy,mx-width,isNormal);
				
				dy=dy+(isNormal ? width : wordHeight)+this._leading;
			}
			
			if(cache && cache.length) {
				lines.push({d:cache,r:{x:mx-mw,y:cache[0].y,w:mw,h:(cache[cache.length-1].y-cache[0].y+wordHeight+this._leading)}});
				cache=[];
			}
			
			dy=oy;
			mx-=mw*this._lineHeight;
		}
		
		if(!lines) return;
		mx=Math.abs(lines[lines.length-1].d[0].x)+this._leading;
		oy=this._fontMetrics.height+this._leading;
		
		for (i=0,l=lines.length;i<l;i++){
			line=lines[i];
			this.context.clearRect(line.r.x, line.r.y, line.r.w, line.r.h);
			sy=oy+(this._textAlign=="center" ? (my-line.r.h)*0.5 : (align_left ? 0 : my-line.r.h));
			dy=line.d[0].y;
			
			for(j = 0, wlen = line.d.length; j < wlen; j++)
			{
				word=line.d[j];
				this._draw(word.w, word.y-dy+sy,mx+word.x,word.b);
			}
		}
	}
	
	//横排
	_horizontal_text()
	{
		if(this._fontMetrics == null) this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
		
		const texts=this._text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);
		let letter,i,cx,line,width,l=texts.length,lineHeight = this._fontMetrics.height * this._lineHeight, dy = this._fontMetrics.height * this._lineHeight*0.5;
		if(this.autoSize) this.width = this._lineWidth ;
		
		const maxWidth=(this.autoSize && this._lineWidth ? this._lineWidth : this.width);
		const align_left=(this._textAlign=="start" || this._textAlign=="left");
		
		for (i=0;i<l;i++){
			line=texts[i];
			cx=0;
			
			if(!this.autoSize && dy>=this.height-this._leading) break;
			let cache=align_left ? null : [];
			
			if(this.wordBreak)
			{
				for(let j = 0, len = line.length; j < len; j++)
				{
					const letter=line.charAt(j);
					const letterWidth=this.getTextWidth(letter)+this._leading;
					
					if(cx>0 && maxWidth>0 && maxWidth<=cx+letterWidth){
						if(!align_left && cache.length){
							const offsetX=Math.floor((maxWidth-cx-this._leading)*(this._textAlign=="center" ? 0.5 : 1));
							cache.forEach(item=>this._draw(item.l, item.y,item.x+offsetX));
							cache=[];
						}
						
						dy += lineHeight;
						cx=0;
						
						if(!this.autoSize && dy>=this.height-this._leading) break;
					}
					
					if(align_left) this._draw(letter, dy,cx);
					else cache.push({l:letter,x:cx,y:dy});
					cx+=letterWidth;
				}
			}
			else
			{
				const words = line.split(/([^\x00-\xff]|\b)/);
				for(let j = 0, wlen = words.length; j < wlen; j++)
				{
					const word = words[j];
					if(!word || word.length == 0) continue;
					
					const wordWidth=this.getTextWidth(word)+word.length*this._leading;
					if(cx>0 && maxWidth>0 && maxWidth<=cx+wordWidth){
						if(!align_left && cache.length){
							const offsetX=Math.floor((maxWidth-cx-this._leading)*(this._textAlign=="center" ? 0.5 : 1));
							cache.forEach(function(item){
								this._draw(item.l, item.y,item.x+offsetX)
							}.bind(this));
							cache=[];
						}
						
						dy += lineHeight;
						cx=0;
					}
					
					if(!this.autoSize && dy>=this.height-this._leading) break;
					for(let k=0,len=word.length;k<len;k++){
						const letter=word[k];
						if(align_left) this._draw(letter, dy,cx);
						else cache.push({l:letter,x:cx,y:dy});
						cx+=this.getTextWidth(letter)+this._leading;
					}
				}
			}
			
			if(!align_left && cache.length){
				const offsetX=Math.floor((maxWidth-cx-this._leading)*(this._textAlign=="center" ? 0.5 : 1));
				cache.forEach(function(item){
					this._draw(item.l, item.y,item.x+offsetX)
				}.bind(this));
			}
			
			dy += lineHeight;
		}
	
		this.scrollHeight = dy;
		if(this.autoSize) this.height = dy;
	}
	
	_draw(str,posY=0,posX=0,vertical=false)
	{
		this.context.save();
		this.context.textBaseline =this._textBaseline;
		
		if(this._writingMode && vertical){
			const special=TextField.specialCode.indexOf(str.charCodeAt(0))>=0;
			this.context.translate(special ? posX : posX-this.size*0.5+(str.match(/[),!,t,f,i,l,j,I,J,r,I,F,E,I,Y]/) ? -(this.size*0.25) : (str.match(/[O,@,%,&,q,w,m,W,M,Q,N,p]/) ? (this.size*0.3) : 0)), posY-this.size);
			this.context.rotate(Math.PI/180*90);
			this.context.textBaseline = 'bottom' ;
			posX=posY=0;
		}
		
		if(this._fill_type=="fill" || this._fill_type=="both"){
			this.context.fillStyle = this._color;	   
			this.context.fillText  (str,  posX, posY);
		}
		
		if(this._fill_type=="stroke" || this._fill_type=="both"){
			this.context.strokeStyle = this._color2;
			this.context.strokeText  (str, posX, posY);
		}
		
		this.context.restore();
	}
	
	__update_size(e)
	{
		if(this.canvas==null) return;
		if(this.stage.canvas.width>(this.canvas.width+1) ||  (this.stage ? this.stage : Global).canvas.height>(this.canvas.height+1)){
			this.has_update=true;
		}
	}
	
	_render()
	{
		if(StringUtil.isEmpty(this._text)) return;
		if(this._has_update) this._update();
		if(!this.context) return;
		super._render(...arguments);
	}
	
	dispose()
	{
		super.dispose();
		delete this.wordBreak,this.scrollHeight,this._lineHeight,this.autoSize,this._underline,this._writingMode,this._text,this._font,this._color,this._color2,this._size,this._textAlign,this._textBaseline,this._fill_type,this._has_update,this._leading,this._italic,this._bold,this._lineWidth,this._fontMetrics,this.mouseEnabled;
	}
	
	toString()
	{
		return TextField.name;
	}
	
	static getFontMetrics(font,size)
	{
		return {height:size};
	}
	
}

TextField.className="TextField";
TextField.specialCode=[183,215,8212,8216,8217,8220,8221,8230,12289,12290,12298,12299,12302,12303,12304,12305,65281,65288,65289,65292,65306,65307,65311]