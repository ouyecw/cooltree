/**
===================================================================
TextField Class
===================================================================
**/

class TextField extends DisplayObject
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
	constructor(s="",f="Microsoft YaHei,Arial",c="#000000",z=12,t="fill",c2="#000000",l=1)
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
	    this._textBaseline = "top";
		this._underline=this._italic=this._bold=false;
		
		this._lineWidth = null;
		this._fontMetrics = null;
		
		this.autoSize=true;
		this.scrollHeight=0;
		this.mouseEnabled=false;
		this._writingMode=false;
		
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
        if(value==null || this._lineHeight==value) return;
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
		str=StringUtil.isEmpty(str) ? this._text : str;
		
		if(!global_context || !this.context || StringUtil.isEmpty(str)) return 0;
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
		this.context.textAlign = (!this._writingMode && this._textAlign) ? this._textAlign : "left";
	    this.context.textBaseline = this._textBaseline!=null ? this._textBaseline: "top";
		
		if(this._writingMode) this._vertical_text();
		else   this._horizontal_text();
		this.has_update=false;
	}
	
	_vertical_text()
	{
		if(this._fontMetrics == null) this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
		
		const texts=this._text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);
		let word,i,j,line,l=texts.length, width,dy = 0,my=(this.autoSize ? Math.max(this._lineWidth,this.height) : this.height), sy=0, wordHeight = this._fontMetrics.height;
	    let by=0,mw=0,mx=(Math.max(this._lineWidth,this.width)-this.size*0.5);
	    let align_left=(this._textAlign=="left"),lines=(align_left ? null : []);
		
		for (i=0;i<l;i++){
			line=texts[i];
			width=0;
			by=sy;
			
			let wlen,cache=(align_left ? null : []);
			for(j = 0, wlen = line.length; j < wlen; j++)
			{
				word = line.charAt(j);
				if(!word || word.length == 0) continue;
				width=this.getTextWidth(word);
				mw=Math.max(mw,width);
				
				if(sy+dy>=(my-wordHeight)){
					dy=0;
					mx-=mw*this._lineHeight;
					if(cache) cache=[];
				}
				
				if(cache) cache.push({w:word,x:mx-width,y:by+dy});
				this._draw(word, by+dy,mx-width);
				dy=dy+(wordHeight+this._leading);
				
				by=0;
			}
			
			dy=0;
			mx-=mw*this._lineHeight;
			
			if(cache) {
				lines.push({d:cache,r:{x:cache[0].x,y:cache[0].y,w:width,h:(cache[cache.length-1].y-cache[0].y+wordHeight+this._leading)}});
			}
		}
		
		if(!lines) return;
		
		for (i=0,l=lines.length;i<l;i++){
			line=lines[i];
			this.context.clearRect(line.r.x, line.r.y, line.r.w, line.r.h);
			sy=(this._textAlign=="center" ? (my-line.r.h)*0.5 : my-line.r.h);
			dy=line.d[0].y;
			
			for(j = 0, wlen = line.d.length; j < wlen; j++)
			{
				word=line.d[j];
				this._draw(word.w, word.y-dy+sy,word.x);
			}
		}
	}
	
	_horizontal_text()
	{
		if(this._fontMetrics == null) this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
		
		const texts=this._text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);
		let i,line,width,l=texts.length, dy = 0,lineHeight = this._fontMetrics.height * this._lineHeight;
		if(this.autoSize) this.width = this._lineWidth ;
		
		for (i=0;i<l;i++){
			line=texts[i];
			width = this.getTextWidth(line);
			
			if(this._lineWidth == null || width <= this._lineWidth)
			{
				if(width > this.width && this.autoSize) this.width = width;
				this._draw(line, dy);
				dy += lineHeight;
				continue;
			}
	
			let words = line.split(/([^\x00-\xff]|\b)/), str = words[0];
			for(let j = 1, wlen = words.length; j < wlen; j++)
			{
				let word = words[j];
				if(!word || word.length == 0) continue;
	
				let newWidth = this.getTextWidth(str + word);
				if(newWidth > this._lineWidth)
				{
					this._draw(str, dy);
					dy += lineHeight;
					str = word;
				}else
				{
					str += word;
				}
			}
			
			this._draw(str, dy);
			dy += lineHeight;
		}
	
		this.scrollHeight = dy;
		if(this.autoSize) this.height = dy;
	}
	
	_draw(str,posY,posX)
	{
		posX =(posX==undefined) ? 0 : posX;
		posY =(posY==undefined) ? 0 : posY;
		
//		const maxWidth=(this.stage ? this.stage.stageWidth : Global.width);
		
		if(!this._writingMode) {
			switch(this._textAlign)
			{
				case "center":
					posX = this.width*0.5;
					break;
				case "right":
				case "end":
					posX = this.width;
					break;
			};
		}
		
		switch(this._fill_type) 
		{
			case "fill":
		   
			   this.context.fillStyle = this._color;
		   
			   this.context.fillText  (str,  posX, posY);
		   
			   break;
		   
			case "stroke":
		   
			   this.context.strokeStyle = this._color2;
		   
			   this.context.strokeText  (str, posX, posY);
		   
			   break;
		   
			case "both":
		   
			   this.context.fillStyle = this._color;
		   
			   this.context.fillText  (str, posX, posY);
		   
			   this.context.strokeStyle = this._color2;
		   
			   this.context.strokeText (str, posX, posY);
		   
			   break;
	        
		}
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
		delete this.scrollHeight,this._lineHeight,this.autoSize,this._underline,this._writingMode,this._text,this._font,this._color,this._color2,this._size,this._textAlign,this._textBaseline,this._fill_type,this._has_update,this._leading,this._italic,this._bold,this._lineWidth,this._fontMetrics,this.mouseEnabled;
	}
	
	toString()
	{
		return TextField.name;
	}
	
	static getFontMetrics(font,size)
	{
		return {height:size};
//		let metrics = { };
//		let elem = DOMUtil.createDOM("div", {style:{fontFamily:font,fontSize:size+"px", position:"absolute"}, innerHTML:"M"});
//		document.body.appendChild(elem);
//		
//		metrics.height = elem.offsetHeight;
//		elem.innerHTML = '<div style="display:inline-block; width:1px; height:1px;"></div>';
//		let baseline = elem.childNodes[0];
//		metrics.ascent = baseline.offsetTop + baseline.offsetHeight;
//		metrics.descent = metrics.height - metrics.ascent;
//		
//		document.body.removeChild(elem);
//		return metrics;
	}
}