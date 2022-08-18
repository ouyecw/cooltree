/**
===================================================================
InputText Class
===================================================================
**/

/**
 * 
 * @param {Boolean} isInput
 * @param {Boolean} multiline
 * @param {Number} tabindex
 * @param {Boolean} password
 */
function InputText(isInput,multiline,tabindex,password)
{
	DOMDisplay.call(this);
	this.isInput=(isInput==true);
	this.tabindex=tabindex || "-1";
	this.password=password || false;
	this.multiline=multiline || false;
	this.element=this._init();
	this._lineWidth=this.width=this.height=0;
	
	this._size=8;
	this._leading=0;
	this._lineHeight=0;
	this._maxChars=0;
	this._font="Microsoft YaHei,Arial";
	this._color="#000000";
	this._textAlign="left";
	this._verticalAlign="top";
	this._selectable=true;
	
	this._enable=true;
	this.autoSize=true;
	this._writingMode=false;
	this._underline=this._bold=this._italic=false;
	
	this.selectable=this.mouseEnabled=this.isInput;
}

Global.inherit(InputText, DOMDisplay);
InputText.prototype.__class__="InputText";

/**
 * Event type
 */
InputText.CHANGE="updateText";
InputText.FOCUS_OUT="focusOut";
InputText.FOCUS_IN="focusIn";

Object.defineProperty(InputText.prototype,"enable",{
	get: function () {
	    return this._enable;
    },

    set: function (value) {
    	if(value==null || this._enable==value) return;
    	this._enable=value;
    	if(this.isInput) this._element.disabled=this._enable ? "" : "disabled";
    },
    enumerable: true,
    configurable: true
});

InputText.prototype._init=function()
{
	var inputElement;
	
	if(!this.isInput){
		inputElement = document.createElement("span");
		inputElement.style.wordBreak = "break-all";
		inputElement.contenteditable=false;
		inputElement.draggable=false;
		inputElement.display="block";
		return inputElement;
	}
	else if (this.multiline) {
        inputElement = document.createElement("textarea");
        inputElement.style["resize"] = "none";
    }
    else {
        inputElement = document.createElement("input");
    }
    
    this._cursor="text";
    inputElement.type=this.password ? "password" : "text";
    inputElement.setAttribute("tabindex", this.tabindex);
    
    inputElement.style.border = "none";
    inputElement.style.outline = "thin";
    inputElement.style.overflow = "hidden";
    inputElement.style.autofocus = "autofocus";
    inputElement.style.wordBreak = "break-all";
    inputElement.style.background = "none";
    inputElement.style.color=this._color;
    
    inputElement.style["writingMode"]=this._writingMode ? "tb-rl" : "lr-tb";
    
    const target=this;
    inputElement.oninput = function () {
        target.dispatchEvent(new Event(InputText.CHANGE,inputElement.value));
    };
    
    inputElement.onfocus = function () {
    	target.dispatchEvent(new Event(InputText.FOCUS_IN));
    }
    
    inputElement.onblur = function () {
    	target.dispatchEvent(new Event(InputText.FOCUS_OUT));
    }
    
    return inputElement;
}

Object.defineProperty(InputText.prototype,"selectable",{
	get: function () {
        return this._selectable;
    },

    set: function (value) {
        if(value==null ) return;
        this._selectable=value;
        this._cursor=value ? "text" : "default";
        this.element.style["pointerEvents"]=value ? "auto" : "none";
        this.element.style[StringUtil.isEmpty(Global.cssPrefix) ? "userSelect" : Global.cssPrefix+"UserSelect"]=this._selectable ? "text" : "none" ;
		this.updateSize();
    },
    enumerable: true,
    configurable: true
}); 

InputText.prototype._display=function(bool)
{
	InputText.superClass._display.call(this,bool);
	if(bool) this.updateSize();
}

InputText.prototype.updateSize=function()
{
	this.__checkDisplayUpdate();
	if(!this.autoSize || this.isInput || this._element==undefined || this._element.offsetHeight==0 ) return;
	this.height=this._element.offsetHeight+this._size;
	this.width=this._lineWidth ? this._lineWidth : this.height*this.text.length;
	if(this._lineWidth>0) this.height=MathUtil.format(this.height*this.height*this.text.length/this._lineWidth);
}

/**
 * @param {String} s
 */
Object.defineProperty(InputText.prototype,"text",{
	get: function () {
        return this.element ? (this.isInput ? this.element.value : this.element.innerHTML) : "";
    },

    set: function (value) {
        if(this.element==undefined || (this.isInput && this.element.value==value) || (!this.isInput && this.element.innerHTML==value)) return;
		this.isInput ? this.element.value=value : this.element.innerHTML=value;
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * 是否竖排(默认 否)
 * @param {Boolean} 
 * lr-tb | rl-tb | tb-rl | bt-rl | tb-lr | bt-lr | lr-bt | rl-bt | lr | rl | tb
 * lr-tb：从左向右，从上往下
 * tb-rl：从上往下，从右向左
 */
Object.defineProperty(InputText.prototype,"writingMode",{
	get: function () {
        return this._writingMode;
    },

    set: function (value) {
        if(this.element==undefined || this._writingMode==value) return;
		this._writingMode=value;
		this.element.style["writingMode"]=this._writingMode ? "tb-rl" : "lr-tb";
		this.element.style[Global.cssPrefix+"WritingMode"]=this._writingMode ? "tb-rl" : "lr-tb";
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * 斜体
 * @param {Boolean} i
 */
Object.defineProperty(InputText.prototype,"italic",{
	get: function () {
        return this._italic;
    },

    set: function (value) {
        if(this.element==undefined || this._italic==value) return;
	
		this._italic=value;
		this.element.style.fontStyle=this._italic ? "italic" : "normal";
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});


/**
 * 粗体
 * @param {Boolean} b
 */
Object.defineProperty(InputText.prototype,"bold",{
	get: function () {
        return this._bold;
    },

    set: function (value) {
        if(this.element==undefined || this._bold==value) return;
	
		this._bold=value;
		this.element.style.fontWeight=this._bold ? "bold" : "normal";
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * 字体 例如 "14"
 * @param {Number} z
 */
Object.defineProperty(InputText.prototype,"size",{
	get: function () {
        return this._size;
    },

    set: function (value) {
        if(this.element==undefined ) return;
	
		this._size=value;
		this.element.style.fontSize=this._size+ "px";
		this.updateSize();
		
    },
    enumerable: true,
    configurable: true
});

/**
 * 字体颜色 0xFFFFFF "#FFFFFF"
 * @param {Number} {String} c
 */
Object.defineProperty(InputText.prototype,"color",{
	get: function () {
        return this._color;
    },

    set: function (value) {
    	value=ColorUtil.formatColor(value);
        if(this.element==undefined || this._color==value) return;
	
		this._color=value;
		this.element.style.color=this._color;
    },
    enumerable: true,
    configurable: true
});

/**
 * 例如 "微软雅黑"
 * @param {String} f
 */
Object.defineProperty(InputText.prototype,"font",{
	get: function () {
        return this._font;
    },

    set: function (value) {
        if(this.element==undefined || this.element.style.fontFamily==value) return;
	
		this._font=value;
		this.element.style.fontFamily=this._font;
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * left、right、center
 */
Object.defineProperty(InputText.prototype,"align",{
	get: function () {
        return this._textAlign;
    },

    set: function (value) {
        if(this.element==undefined || this._textAlign==value) return;
	
		this._textAlign=value;
		this.element.style.textAlign=this._textAlign;
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(InputText.prototype,"underline",{
	get: function () {
        return this._underline;
    },

    set: function (value) {
        if(this.element==undefined || this._underline==value) return;
	
		this._underline=value;
		this.element.style.textDecoration=this._underline ? "underline" :"none";
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * top、hanging、middle、alphabetic、ideographic、bottom
 * 垂直对齐方式
 */
Object.defineProperty(InputText.prototype,"verticalAlign",{
	get: function () {
        return this._verticalAlign;
    },

    set: function (value) {
        if(this.element==undefined || this._verticalAlign==value) return;
	
		this._verticalAlign=value;
		this.element.style.verticalAlign=this._verticalAlign;
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * 最多可包含的字符数
 */
Object.defineProperty(InputText.prototype,"maxChars",{
	get: function () {
        return this._maxChars;
    },

    set: function (value) {
        if(this.element==undefined || this._maxChars==value) return;
	
		this._maxChars=value;
		this.element.maxLength=this._maxChars;
		
    },
    enumerable: true,
    configurable: true
});

/**
 * 字间距
 * @param {Number} a
 */
Object.defineProperty(InputText.prototype,"leading",{
	get: function () {
        return this._leading;
    },

    set: function (value) {
        if(this.element==undefined) return;
	
		this._leading=value;
		this.element.style.letterSpacing=this._leading+"px";
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * 行间距
 * @param {Number} a
 */
Object.defineProperty(InputText.prototype,"lineHeight",{
	get: function () {
        return this._lineHeight;
    },

    set: function (value) {
        if(this.element==undefined) return;
	
		this._lineHeight=value;
		this.element.style.lineHeight=this._lineHeight;
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * 行宽
 * @param {Number} l
 */
Object.defineProperty(InputText.prototype,"lineWidth",{
	get: function () {
        return this._lineWidth;
    },

    set: function (value) {
        if(this._lineWidth==value) return;
	
		this._lineWidth=value;
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * 背景颜色
 * @param {Object} a
 */
Object.defineProperty(InputText.prototype,"bgColor",{
	get: function () {
        return this.element ? this.element.style.backgroundColor : "";
    },

    set: function (value) {
        this.element.style.backgroundColor=value;
    },
    enumerable: true,
    configurable: true
});

InputText.prototype.render=function()
{
	InputText.superClass.render.apply(this,arguments)
}

InputText.prototype.dispose=function()
{
	InputText.superClass.dispose.call(this);
	delete this._lineHeight,this.autoSize,this._selectable,this._enable,this._underline,this._writingMode,this.isInput,this.tabindex,this.password,this.multiline,this._lineWidth,this._size,this._leading,this._maxChars,this._font,this._color,this._textAlign,this._verticalAlign,this._bold,this._italic;
}

