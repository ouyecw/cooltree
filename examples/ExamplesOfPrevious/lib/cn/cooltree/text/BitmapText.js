
function BitmapText()
{
	Sprite.call(this);
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

Global.inherit(BitmapText, Sprite);
BitmapText.prototype.__class__="BitmapText";

/**
 * 内容
 * @param {String} text
 */
Object.defineProperty(BitmapText.prototype,"text",{
	get: function () {
        return this._text;
    },

    set: function (value) {
        if(!this._is_init || this._text==value) return;
	
		this._text=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 例如 "微软雅黑,宋体"
 * @param {String} font
 */
Object.defineProperty(BitmapText.prototype,"font",{
	get: function () {
        return this._font;
    },

    set: function (value) {
        if(!this._is_init || this._font==value) return;
	
		this._font=value;
		this._fonts=FontManager.get(this._font);
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 字体颜色 0xFFFFFF "#FFFFFF"
 * @param {Number} {String} c
 */
Object.defineProperty(BitmapText.prototype,"color",{
	get: function () {
        return this._color;
    },

    set: function (value) {
    	value=ColorUtil.formatColor(value);
        if(this._color==value) return;
	
		this._color=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 字间距
 * @param {Number} leading
 */
Object.defineProperty(BitmapText.prototype,"leading",{
	get: function () {
        return this._leading;
    },

    set: function (value) {
        if(!this._is_init || this._leading==value) return;
	
		this._leading=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 行间距
 * @param {Number} a
 */
Object.defineProperty(BitmapText.prototype,"lineHeight",{
	get: function () {
        return this._lineHeight;
    },

    set: function (value) {
        if(value==null || this._lineHeight==value) return;
		this._lineHeight=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 字体大小 （不建议使用）
 * @param {Number} 
 */
Object.defineProperty(BitmapText.prototype,"size",{
	get: function () {
        return this._size;
    },

    set: function (value) {
        if(this._size==Number(value) || isNaN(value)) return;
	
	    value=Number(value);
		this.scale=this.scale*MathUtil.format(value/this._size);
		this._size=value;
    },
    enumerable: true,
    configurable: true
});


/**
 * 行宽
 * @param {Number} lineWidth
 */
Object.defineProperty(BitmapText.prototype,"lineWidth",{
	get: function () {
        return this._lineWidth;
    },

    set: function (value) {
        if(!this._is_init || this._lineWidth==value) return;
	
		this.width=this._lineWidth=Math.min(100,value);
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * start、end、right、center
 */
Object.defineProperty(BitmapText.prototype,"align",{
	get: function () {
        return this._textAlign;
    },

    set: function (value) {
        if(!this._is_init || this._textAlign==value) return;
	
		this._textAlign=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 设置
 * @param {String} t text
 * @param {String} f font
 * @param {Number} w lineWidth
 * @param {String} c color
 * @param {String} a align
 */
BitmapText.prototype.setup=function(t,f,w,c,a)
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

BitmapText.prototype._update=function()
{
	this.__checkDisplayUpdate();
	
//	var array=this._fonts.info.padding.split(",");
	var spacing=this._fonts.info.spacing.split(",");
	
	var space_left=Number(spacing[0]);
	var space_up=Number(spacing[1]);
	
	var i,countX=space_left,countY=space_up;
	var item,char,pos,len = this._text.length, charCode = -1,h=0,w=0;
	var old=new Point();
	var miss="";
	
	if(Global.useCanvas){
		this._instance._catchToContext();
		this._instance.canvas.width  = (this.stage ? this.stage : Stage.current).canvas.width;
		this._instance.canvas.heigth = (this.stage ? this.stage : Stage.current).canvas.height;
	}else{
		this.removeAllChildren(true);
	}
	
	for (i = 0; i < len; i++) {
		charCode = this._text.charCodeAt(i);
		char = this._fonts.chars[charCode];
		
		if(char==undefined) {
			miss+='"'+this._text.charAt(i)+'" ';
			continue;
		}
		
		if(Global.useCanvas){
			pos=char.reg;
			this._instance.context.translate(countX-pos.x-old.x, countY-pos.y-old.y);
			this._instance.context.drawImage(char.image,char.rect.x,char.rect.y,char.rect.width,char.rect.height,0,0,char.rect.width,char.rect.height);
			old.set(countX-pos.x,countY-pos.y);
		}else{
			item=ObjectPool.create(DOMDisplay);
			item.setInstance(char);
			item.moveTo(countX,countY);
			this.addChild(item);
			pos=item.origin;
		}
		
	    if(h==0) h=char.rect.height;
	    else     h=Math.max(h,char.rect.height);
	    
	    countX+=char.rect.width+this._leading+space_left;
	    
	    if(countX>=(this._lineWidth<=0 ? this.stage.canvas.width : this._lineWidth)-char.rect.width){
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
	
	if(Global.useCanvas) {
		this._instance.width=w;
		this._instance.height=countY;
	}
	
	if(!StringUtil.isEmpty(miss)) 
	      trace("[WARN] BitmapText.prototype._update miss fonts ["+miss+"]");
	
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

BitmapText.prototype.render=function()
{
	if(StringUtil.isEmpty(this._text)) return;
	if(this._has_update) this._update();
	BitmapText.superClass.render.apply(this,arguments);
}

BitmapText.prototype.dispose=function()
{
	if(this._instance) this._instance.removeFromParent(true);
	BitmapText.superClass.dispose.call(this);
	
	delete  this.autoSize,this._lineHeight,this._size,this._ct,this._color,this._is_init,this._has_update,this._lineWidth,this._leading,this._text,this._font,this._textAlign,this._instance;
}
