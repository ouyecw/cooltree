
class BitmapText extends DisplayObjectContainer
{	
	constructor()
	{
		super();
		this.mouseEnabled=this.mouseChildren=false;
		
		this._is_init=false;
		this.autoSize=true;
		this._has_update=true;
		
		this._lineHeight = 1;
		this._lineWidth = 0;
		this._leading = 0;
		this._size = 0;
		
		this._color = "";
		this._text = "";
	    this._font = "";
	    this._textAlign = "start";
	    
	    this.name = "bitmap_text_"+this.name;
	    this._ct=this._fonts=this._instance=null;
	}
	
	get text()
	{
		return this._text;
	}
	
	/**
	 * 内容
	 * @param {String} text
	 */
	set text(value) 
	{
        if(!this._is_init || this._text==value) return;
	
		this._text=value;
		this._has_update=true;
    }
	
	get font()
	{
		return this._font;
	}
	
	/**
	 * 例如 "微软雅黑,宋体"
	 * @param {String} font
	 */
	set font(value) 
	{
        if(!this._is_init || this._font==value) return;
	
		this._font=value;
		this._fonts=FontManager.get(this._font);
		this._has_update=true;
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
    	value=ColorUtil.formatColor(value);
        if(this._color==value) return;
	
		this._color=value;
		this._has_update=true;
    }
	
	get leading()
	{
		return this._leading;
	}
	
	/**
	 * 字间距
	 * @param {Number} leading
	 */
	set leading(value) 
	{
        if(!this._is_init || this._leading==value) return;
	
		this._leading=value;
		this._has_update=true;
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
		this._has_update=true;
    }
	
	get size()
	{
		return this._size;
	}
	
	/**
	 * 字体大小 （不建议使用）
	 * @param {Number} 
	 */
	set size(value) 
	{
        if(this._size==Number(value) || isNaN(value)) return;
	
	    value=Number(value);
		this.scale=this.scale*MathUtil.format(value/this._size);
		this._size=value;
    }
	
	get lineWidth()
	{
		return this._lineWidth;
	}
	
	/**
	 * 行宽
	 * @param {Number} lineWidth
	 */
	set lineWidth(value) 
	{
        if(!this._is_init || this._lineWidth==value) return;
	
		this.width=this._lineWidth=Math.min(100,value);
		this._has_update=true;
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
        if(!this._is_init || this._textAlign==value) return;
	
		this._textAlign=value;
		this._has_update=true;
    }
	
	/**
	 * 设置
	 * @param {String} t text
	 * @param {String} f font
	 * @param {Number} w lineWidth
	 * @param {String} c color
	 * @param {String} a align
	 */
	setup(t,f,w,c,a)
	{
		this._text=t || this._text;
		this._font=f || this._font;
		this._color=c || this._color;
		
		this.width=this._lineWidth=w || this._lineWidth;
		this._textAlign=a || this._textAlign;
		this._fonts=FontManager.get(this._font);
		if(this._fonts==undefined) return;
		
		this._size=Math.abs(Number(this._fonts.info.size));
		
		if(this._instance==undefined && Global.useCanvas){
			this._instance=ObjectPool.create(DisplayObject);
			this.addChild(this._instance);
		}
		
		this._is_init=this._has_update=true;
		if(this._fonts) this._update();
	}
	
	_update()
	{
		this.__checkDisplayUpdate();
		
	//	let array=this._fonts.info.padding.split(",");
		let spacing=this._fonts.info.spacing.split(",");
		
		let space_left=Number(spacing[0]);
		let space_up=Number(spacing[1]);
		
		let i,countX=space_left,countY=space_up;
		let item,char,pos,len = this._text.length, charCode = -1,h=0,w=0;
		let old=ObjectPool.create(Point);
		let miss="";
		
		if(!Global.useCanvas) this.removeAllChildren(true);
		else this._instance.context.reset();
		
		for (i = 0; i < len; i++) {
			charCode = this._text.charCodeAt(i);
			char = this._fonts.chars[charCode];
			
			if(char==undefined) {
				miss+='"'+this._text.charAt(i)+'" ';
				continue;
			}
			
			if(Global.useCanvas){
				pos=ObjectPool.create(Point).set(char.regX,char.regY);
				this._instance.context.translate(countX-pos.x-old.x, countY-pos.y-old.y);
				this._instance.context.drawImage(char.image,Global.useCache ? 0 : char.x,Global.useCache ? 0 : char.y,char.width,char.height,0,0,char.width,char.height);
				old.set(countX-pos.x,countY-pos.y);
				ObjectPool.remove(pos);
			}else{
				item=ObjectPool.create(DOMDisplay);
				item.setInstance(char);
				item.moveTo(countX,countY);
				this.addChild(item);
			}
			
		    if(h==0) h=char.height;
		    else     h=Math.max(h,char.height);
		    
		    countX+=char.width+this._leading+space_left;
		    
		    if(countX>=(this._lineWidth<=0 ? (this.stage ? this.stage.stageWidth : Global.width) : this._lineWidth)-char.width){
		    	if(i+1 < len){
		    		charCode = this._text.charCodeAt(i+1);
		    		if(charCode>=65 && charCode<123) continue;
		    	}
		    	
		    	w=Math.max(w,countX);
		    	countX=space_left;
		    	countY+=(h ? Math.ceil(h*this._lineHeight) : 0)+space_up;
		    	h=0;
		    }
		}
		
		w=Math.ceil(Math.max(w,countX));
		countY=Math.ceil(countY+h+space_up);
		
		if(this.autoSize){
			this.width=w;
			this.height=countY;
		}
		
		this._has_update=false;
		ObjectPool.remove(old);
		
		if(Global.useCanvas) {
			this._instance.width=w;
			this._instance.height=countY;
		}
		
		if(!StringUtil.isEmpty(miss)) 
		      trace("[WARN] _update miss fonts ["+miss+"]");
		
	//	if(StringUtil.isEmpty(this._color)) return;
	//	
	//	if(Global.useCanvas) {
	//      if(this._ct==undefined) this._ct=new ColorTransform();
	//      this._ct.setColor(this._color);
	//      CanvasUtil.colorTransform(this._instance.context,{x:0,y:0,width:w,height:countY},this._ct);
	//      return;
	//	}
	//	
	}
	
	render()
	{
		if(StringUtil.isEmpty(this._text)) return;
		if(this._has_update) this._update();
		super.render(...arguments);
	}
	
	dispose()
	{
		if(this._instance) this._instance.removeFromParent(true);
		super.dispose();
		
		delete  this.autoSize,this._lineHeight,this._size,this._ct,this._color,this._is_init,this._has_update,this._lineWidth,this._leading,this._text,this._font,this._textAlign,this._instance;
	}
}
