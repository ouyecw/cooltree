/**
===================================================================
InputText Class
===================================================================
**/

class InputText extends DOMDisplay
{
	/**
	 * 
	 * @param {Boolean} isInput
	 * @param {Boolean} multiline
	 * @param {Number} tabindex
	 * @param {Boolean} password
	 */
	constructor(isInput=false,multiline=false,tabindex=-1,password=false)
	{
		super();
		this.isInput=Boolean(isInput);
		this.tabindex=tabindex;
		this.password=password;
		this.multiline=multiline;
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
	
	get enable()
	{
		return this._enable;
	}
	
	set enable(value) 
	{
    	if(value==null || this._enable==value) return;
    	this._enable=value;
    	if(this.isInput) this.element.disabled=this._enable ? "" : "disabled";
    }
	
	get selectable()
	{
		return this._selectable;
	}
	
	set selectable(value) 
	{
        if(value==null ) return;
        this._selectable=value;
        this._cursor=value ? "text" : "default";
        this.element.style["pointerEvents"]=value ? "auto" : "none";
        this.element.style[StringUtil.isEmpty(Global.cssPrefix) ? "userSelect" : Global.cssPrefix+"UserSelect"]=this._selectable ? "text" : "none" ;
		this.updateSize();
    }
	
	get text()
	{
		return this.element ? (this.isInput ? this.element.value : this.element.innerHTML) : "";
	}
	
	/**
	 * @param {String} s
	 */
	set text(value) 
	{
        if(this.element==undefined || (this.isInput && this.element.value==value) || (!this.isInput && this.element.innerHTML==value)) return;
		this.isInput ? this.element.value=value : this.element.innerHTML=value;
		this.updateSize();
    }
    
    get writingMode()
    {
    	return this._writingMode;
    }
	
	/**
	 * 是否竖排(默认 否)
	 * @param {Boolean} 
	 * lr-tb | rl-tb | tb-rl | bt-rl | tb-lr | bt-lr | lr-bt | rl-bt | lr | rl | tb
	 * lr-tb：从左向右，从上往下
	 * tb-rl：从上往下，从右向左
	 */
	set writingMode(value) 
	{
        if(this.element==undefined || this._writingMode==value) return;
		this._writingMode=value;
		this.element.style["writingMode"]=this._writingMode ? "tb-rl" : "lr-tb";
		this.element.style[Global.cssPrefix+"WritingMode"]=this._writingMode ? "tb-rl" : "lr-tb";
		this.updateSize();
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
        if(this.element==undefined || this._italic==value) return;
	
		this._italic=value;
		this.element.style.fontStyle=this._italic ? "italic" : "normal";
		this.updateSize();
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
        if(this.element==undefined || this._bold==value) return;
	
		this._bold=value;
		this.element.style.fontWeight=this._bold ? "bold" : "normal";
		this.updateSize();
    }
	
	get size()
	{
		return this._size;
	}
	
	/**
	 * 字体 例如 "14"
	 * @param {Number} z
	 */
	set size(value) 
	{
        if(this.element==undefined ) return;
	
		this._size=value;
		this.element.style.fontSize=this._size+ "px";
		this.updateSize();
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
        if(this.element==undefined || this._color==value) return;
	
		this._color=value;
		this.element.style.color=this._color;
    }
	
	get font()
	{
		return this._font;
	}
	
	/**
	 * 例如 "微软雅黑"
	 * @param {String} f
	 */
	set font (value) 
	{
        if(this.element==undefined || this.element.style.fontFamily==value) return;
	
		this._font=value;
		this.element.style.fontFamily=this._font;
		this.updateSize();
    }
    
    get align()
    {
    	return this._textAlign;
    }
	
	/**
	 * left、right、center
	 */
	set align(value) 
	{
        if(this.element==undefined || this._textAlign==value) return;
	
		this._textAlign=value;
		this.element.style.textAlign=this._textAlign;
		this.updateSize();
    }
	
	get underline()
	{
		return this._underline;
	}
	
	set underline(value) 
	{
        if(this.element==undefined || this._underline==value) return;
	
		this._underline=value;
		this.element.style.textDecoration=this._underline ? "underline" :"none";
		this.updateSize();
    }
	
	get verticalAlign()
	{
		return this._verticalAlign;
	}
	
	/**
	 * top、hanging、middle、alphabetic、ideographic、bottom
	 * 垂直对齐方式
	 */
	set verticalAlign(value) 
	{
        if(this.element==undefined || this._verticalAlign==value) return;
	
		this._verticalAlign=value;
		this.element.style.verticalAlign=this._verticalAlign;
		this.updateSize();
    }
	
	get maxChars()
	{
		return this._maxChars;
	}
	
	/**
	 * 最多可包含的字符数
	 */
	set maxChars(value) 
	{
        if(this.element==undefined || this._maxChars==value) return;
	
		this._maxChars=value;
		this.element.maxLength=this._maxChars;
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
        if(this.element==undefined) return;
	
		this._leading=value;
		this.element.style.letterSpacing=this._leading+"px";
		this.updateSize();
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
        if(this.element==undefined) return;
	
		this._lineHeight=value;
		this.element.style.lineHeight=this._lineHeight;
		this.updateSize();
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
		this.updateSize();
    }
	
	get bgColor()
	{
		return this.element ? this.element.style.backgroundColor : "";
	}
	
	/**
	 * 背景颜色
	 * @param {Object} a
	 */
	set bgColor(value) 
	{
        this.element.style.backgroundColor=value;
    }
	
	_init()
	{
		let inputElement;
		
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
	    inputElement.setAttribute("type",this.password ? "password" : "text");
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
	        target.dispatchEvent(Factory.c("ev",[InputText.CHANGE,inputElement.value]));
	    };
	    
	    inputElement.onfocus = function () {
	    	target.dispatchEvent(Factory.c("ev",[InputText.FOCUS_IN]));
	    }
	    
	    inputElement.onblur = function () {
	    	target.dispatchEvent(Factory.c("ev",[InputText.FOCUS_OUT]));
	    }
	    
	    return inputElement;
	}
	
	_display(bool)
	{
		super._display(bool);
		if(bool) this.updateSize();
	}
	
	updateSize()
	{
		this.__checkDisplayUpdate();
		if(!this.autoSize || this.isInput || this.element==undefined || this.element.offsetHeight==0 ) return;
		this.height=this.element.offsetHeight+this._size;
		this.width=this._lineWidth ? this._lineWidth : this.height*this.text.length;
		if(this._lineWidth>0) this.height=MathUtil.format(this.height*this.height*this.text.length/this._lineWidth);
	}
	
	dispose()
	{
		super.dispose();
		delete this._lineHeight,this.autoSize,this._selectable,this._enable,this._underline,this._writingMode,this.isInput,this.tabindex,this.password,this.multiline,this._lineWidth,this._size,this._leading,this._maxChars,this._font,this._color,this._textAlign,this._verticalAlign,this._bold,this._italic;
	}
}

/**
 * Event type
 */
InputText.CHANGE="updateText";
InputText.FOCUS_OUT="focusOut";
InputText.FOCUS_IN="focusIn";

