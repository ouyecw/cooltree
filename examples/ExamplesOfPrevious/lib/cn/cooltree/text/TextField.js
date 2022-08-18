/**
===================================================================
TextField Class
===================================================================
**/

/**
 * s text,f font,c color,z size,t type
 * @param {String} string_content
 * @param {String} font_name
 * @param {String} color 
 * @param {Number} size 
 * @param {String} type ( 'fill' 'both' 'stroke')
 * @param {String} stroke_color
 * @param {Number} leading
 */
function TextField(s,f,c,z,t,c2,l)
{
	DisplayObject.call(this);
	this._text = s || "";
    this._font = f || "Microsoft YaHei,Arial";
    this._color= (c==undefined ? "#000000" : ColorUtil.formatColor(c));
    this._color2 = c2 || this._color;
    this._size = z || 12;
	this._textAlign = "left";
    this._textBaseline = "top";
	this._type=t || "fill";
	this._has_update=true;
	this._leading=l || 1;
	this._lineHeight=1;
	this._underline=this._italic=this._bold=false;
	
	this._maxWidth = 0;
	this._lineWidth = null;
	this._fontMetrics = null;
	
	this.autoSize=true;
	this.scrollHeight=0;
	this.mouseEnabled=false;
	this._writingMode=false;
	
	this.width=0;
	if(!StringUtil.isEmpty(this._text)) this._update();
}

Global.inherit(TextField,DisplayObject);
TextField.prototype.__class__="TextField";

Object.defineProperty(TextField.prototype,"has_update",{
	get: function () {
        return this._has_update;
    },

    set: function (value) {
        if(this._has_update==value) return;
		this._has_update=value;
		if(value) this.__checkDisplayUpdate();
    },
    enumerable: true,
    configurable: true
});

/**
 * 行宽
 * @param {Number} l
 */
Object.defineProperty(TextField.prototype,"lineWidth",{
	get: function () {
        return this._lineWidth;
    },

    set: function (value) {
        if(this._lineWidth==value) return;
	
		this._lineWidth=value;
		this.has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 斜体
 * @param {Boolean} i
 */
Object.defineProperty(TextField.prototype,"italic",{
	get: function () {
        return this._italic;
    },

    set: function (value) {
        if(this._italic==value) return;
	
		this._italic=value;
		this.has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 是否竖排(默认 否)
 * @param {Boolean} 
 */
Object.defineProperty(TextField.prototype,"writingMode",{
	get: function () {
        return this._writingMode;
    },

    set: function (value) {
        if(this._writingMode==value) return;
	
		this._writingMode=value;
		this.has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 下划线
 */
Object.defineProperty(TextField.prototype,"underline",{
	get: function () {
        return this._underline;
    },

    set: function (value) {
        if(this._underline==value) return;
		this._underline=value;
    },
    enumerable: true,
    configurable: true
});

/**
 * 粗体
 * @param {Boolean} b
 */
Object.defineProperty(TextField.prototype,"bold",{
	get: function () {
        return this._bold;
    },

    set: function (value) {
        if(this._bold==value) return;
	
		this._bold=value;
		this.has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 内容
 * @param {String} s
 */
Object.defineProperty(TextField.prototype,"text",{
	get: function () {
        return this._text;
    },

    set: function (value) {
        if(this._text==value) return;
	
		this._text=value;
		this.has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 字体 例如 "14px/30px"
 * @param {Number} {String} z
 */
Object.defineProperty(TextField.prototype,"size",{
	get: function () {
        return this._size;
    },

    set: function (value) {
        if(this._size==value) return;
	
		this._size=value;
		this.has_update=true;
		this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
    },
    enumerable: true,
    configurable: true
});

/**
 * 字体颜色 0xFFFFFF "#FFFFFF"
 * @param {Number} {String} c
 */
Object.defineProperty(TextField.prototype,"color",{
	get: function () {
        return this._color;
    },

    set: function (value) {
    	if(StringUtil.isEmpty(value)) return;
    	value=ColorUtil.formatColor(value);
        if(this._color==value) return;
	
		this._color=value;
		this.has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 文字描边颜色
 * @param  {Number} {String} c
 */
Object.defineProperty(TextField.prototype,"strokeColor",{
	get: function () {
        return this._color2;
    },

    set: function (value) {
    	value=ColorUtil.formatColor(value);
        if(this._color2==value) return;
	
		this._color2=value;
		this.has_update=true;
    },
    enumerable: true,
    configurable: true
});


/**
 * 例如 "微软雅黑,宋体"
 * @param {String} f
 */
Object.defineProperty(TextField.prototype,"font",{
	get: function () {
        return this._font;
    },

    set: function (value) {
        if(this._font==value) return;
	
		this._font=value;
		this.has_update=true;
		this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
    },
    enumerable: true,
    configurable: true
});

/**
 * fill both stroke
 * @param {String} t
 */
Object.defineProperty(TextField.prototype,"type",{
	get: function () {
        return this._type;
    },

    set: function (value) {
        if(this._type==value) return;
	
		this._type=value;
		this.has_update=true;
    },
    enumerable: true,
    configurable: true
});


/**
 * start、end、right、center
 */
Object.defineProperty(TextField.prototype,"align",{
	get: function () {
        return this._textAlign;
    },

    set: function (value) {
        if(this._textAlign==value) return;
	
		this._textAlign=value;
		this.has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 字间距
 * @param {Number} a
 */
Object.defineProperty(TextField.prototype,"leading",{
	get: function () {
        return this._leading;
    },

    set: function (value) {
        if(this._leading==value) return;
	
		this._leading=value;
		this.has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 行间距
 * @param {Number} a
 */
Object.defineProperty(TextField.prototype,"lineHeight",{
	get: function () {
        return this._lineHeight;
    },

    set: function (value) {
        if(value==null || this._lineHeight==value) return;
		this._lineHeight=value;
		this.has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * top、hanging、middle、alphabetic、ideographic、bottom
 */
Object.defineProperty(TextField.prototype,"baseLine",{
	get: function () {
        return this._textBaseline;
    },

    set: function (value) {
        if(this._textBaseline==value) return;
	
		this._textBaseline=value;
		this.has_update=true;
    },
    enumerable: true,
    configurable: true
});


/**
 * 获得字体框宽度
 */
TextField.prototype.getTextWidth=function(str)
{
    str=StringUtil.isEmpty(str) ? this._text : str;
	return StringUtil.isEmpty(str) ? 0 : (this.stage ? this.stage.context : Global.context).measureText(str).width;
}

TextField.prototype._update=function()
{
	if(!this.context) this.context=ObjectPool.create(ContextVO);
	else this.context.reset();

	this.context.font = (this._italic ? "italic " : "")+(this._bold ? "bold " : "")+(ObjectUtil.getType(this._size)=="number" ? this._size+"px " : this._size+" ")+this._font;
	this.context.textAlign = (!this._writingMode && this._textAlign) ? this._textAlign : "left";
    this.context.textBaseline = this._textBaseline!=null ? this._textBaseline: "top";
	
	if(this._writingMode) this._vertical_text();
	else   this._horizontal_text();
	
	this.has_update=false;
}

TextField.prototype._vertical_text=function()
{
	if(this._fontMetrics == null) this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
	
	const texts=this._text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);
	var word,i,j,line,l=texts.length, width,dy = 0,my=(this.autoSize ? Math.max(this._lineWidth,this.height) : this.height), sy=0, wordHeight = this._fontMetrics.height;
    var by=0,mw=0,mx=Math.max(this._lineWidth,this.width);
    var align_left=(this._textAlign=="left"),lines=(align_left ? null : []);
	
	for (i=0;i<l;i++){
		line=texts[i];
		width=0;
		by=sy;
		
		var cache=(align_left ? null : []);
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

TextField.prototype._horizontal_text=function()
{
	if(this._fontMetrics == null) this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
	
	const texts=this._text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);
	var i,line,width,l=texts.length, dy = 0,lineHeight = this._fontMetrics.height * this._lineHeight;
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

		var words = line.split(/([^\x00-\xff]|\b)/), str = words[0];
		for(var j = 1, wlen = words.length; j < wlen; j++)
		{
			var word = words[j];
			if(!word || word.length == 0) continue;

			var newWidth = this.getTextWidth(str + word);
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

TextField.prototype._draw=function(str,posY,posX)
{
	posX =(posX==undefined) ? 0 : posX;
	posY =(posY==undefined) ? 0 : posY;
	
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
	
	switch(this._type) 
	{
		case "fill":
	   
		   this.context.fillStyle = this._color;
	   
		   this.context.fillText  (str,  posX, posY,this._maxWidth || 0xFFFF);
	   
		   break;
	   
		case "stroke":
	   
		   this.context.strokeStyle = this._color2;
	   
		   this.context.strokeText  (str, posX, posY,this._maxWidth || 0xFFFF);
	   
		   break;
	   
		case "both":
	   
		   this.context.fillStyle = this._color;
	   
		   this.context.fillText  (str, posX, posY,this._maxWidth || 0xFFFF);
	   
		   this.context.strokeStyle = this._color2;
	   
		   this.context.strokeText (str, posX, posY,this._maxWidth || 0xFFFF);
	   
		   break;
        
	}
}

Object.defineProperty(TextField.prototype,"stage",{
	get: function (){
		return this._stage;
	},
    set: function (value) {
        if(this._stage==value) return;
		if(this._stage) this._stage.removeEventListener(StageEvent.UPDATE,null,this.name);
		
		this._stage=value;
		if(this._stage) this._stage.addEventListener(StageEvent.UPDATE,Global.delegate(this.__update_size,this),this.name);
    },
    enumerable: true,
    configurable: true
});

TextField.prototype.__update_size=function(e)
{
	if(this.canvas==null) return;
	if(this.stage.canvas.width>(this.canvas.width+1) ||  (this.stage ? this.stage : Global).canvas.height>(this.canvas.height+1)){
		this.has_update=true;
	}
}

TextField.prototype._render=function(target,initial,package)
{
	if(StringUtil.isEmpty(this._text)) return;
	if(this._has_update) this._update();
	if(!this.context) return;
	TextField.superClass._render.call(this,target,initial,package);
}

TextField.prototype.dispose=function()
{
	TextField.superClass.dispose.call(this);
	delete this.scrollHeight,this._lineHeight,this.autoSize,this._underline,this._writingMode,this._text,this._font,this._color,this._color2,this._size,this._textAlign,this._textBaseline,this._type,this._has_update,this._leading,this._italic,this._bold,this._maxWidth,this._lineWidth,this._fontMetrics,this.mouseEnabled;
}

TextField.prototype.toString=function()
{
	return "TextField";
}

TextField.getFontMetrics = function(font,size)
{
	var metrics = { };
	var elem = DOMUtil.createDOM("div", {style:{fontFamily:font,fontSize:size+"px", position:"absolute"}, innerHTML:"M"});
	document.body.appendChild(elem);
	
	metrics.height = elem.offsetHeight;
	elem.innerHTML = '<div style="display:inline-block; width:1px; height:1px;"></div>';
	var baseline = elem.childNodes[0];
	metrics.ascent = baseline.offsetTop + baseline.offsetHeight;
	metrics.descent = metrics.height - metrics.ascent;
	
	document.body.removeChild(elem);
	return metrics;
};