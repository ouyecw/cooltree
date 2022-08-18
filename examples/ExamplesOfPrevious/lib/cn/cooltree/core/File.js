/**
===================================================================
File Class
===================================================================
**/

/**
 * @param {Boolean} multiple
 * @param {String} accept image/gif,image/jpeg,image/png,text/html,text/txt,audio/mp3,video/mp4
 */
function File(multiple,accept)
{
	DOMDisplay.call(this);
	this.name="file"+(File.__count++);
	this._btn=this._reader=this._cancel_handler=this._file_select_handler=null;
	
	this.alpha=0;
	this.layer=995;
	
	/**
	 * max file size (M)
	 */
	this.max_size=0;
	this.auto_parse=true;
	this.image_to_base64=false;
	this.buttonMode=this.mouseEnabled=true;
	if(this.supported) this._browseForOpen("openFile",multiple,accept);
}

File.__count=0;
Global.inherit(File,DOMDisplay);

File.LIMIT="file_size_out";
File.COMPLETE="file_select_complete";

Object.defineProperty(File.prototype,"target",{
    set: function (value) {
        if(value==undefined || value==null || !(value instanceof DisplayBase)) return;
		this.width=value.width;
		this.height=value.height;
		this.matrix=value.matrix;
		if(value instanceof Button) this._btn=value;
    },
    enumerable: true,
    configurable: true
});

File.prototype.open=function(cache)
{
	if(!cache) this._clearInputFile();
	if(this.element) this.element.click();
}

File.prototype.onMouseEvent = function(b) 
{
	if (this._btn==null || !this._btn.enable)  return;
	
	switch (b.type) {
		case "mousemove":
			this._btn.setState(Button.state.OVER);
			break;
		case "mouseout":
			this._btn.setState(Button.state.UP);
			break;
		case "mousedown":
			this._btn.setState(Button.state.OVER);
			break;
		case "mouseup":
			(this._btn.state ==Button.state.OVER) ? this._btn.setState(Button.state.OVER) : this._btn.setState(Button.state.UP);
	}
};

File.prototype._clearInputFile=function()
{
	if(!this.supported || this.element==null) return;
	this._element.removeEventListener('change', this._file_select_handler);
	var multiple=this._element.multiple;
	var accept=this._element.accept;
	
	this._display(false);
	this._element=null;
	this._browseForOpen("openFile",multiple,accept);
}

File.prototype._browseForOpen=function(name,multiple,accept)
{	
	multiple=multiple || false;
	
	if(this._element==undefined){
		this.element=DOMUtil.createDOM("input",{type:"file",multiple:multiple,id:this.name,name:name,style:{position: Global.position}});
	}else{	
		this._element.multiple=multiple;
		this._element.name=name;
	}
	
	if(!StringUtil.isEmpty(accept)){
		this._element.accept=accept;
	}
	
	if(this._file_select_handler==undefined){
//		this._cancel_handler=Global.delegate(this._cancelHandle,this);
		this._file_select_handler=Global.delegate(this._fileSelectHandle,this);
	}
	
	this._element.addEventListener('change', this._file_select_handler, false);
}

File.prototype._fileSelectHandle=function(e)
{	
	var i,f,t,p,files = e.target.files,failed=[],list=[],target=this,URL = window.URL || window.webkitURL;
	
	if(files.length && this.max_size>0){
		var arr=[];
		for (i = 0; f = files[i]; i++) {
			if(f && f.size<1000000*this.max_size) {
				arr.push(f);
				continue;
			}
			
			failed.push(f ? f.name : "null");
		}
		files =arr;
	}
	
	if(failed.length>0){
		target.dispatchEvent(new Event(File.LIMIT,failed));
	}
	
	if(!this.auto_parse || files.length==0){
		if(files.length) target.dispatchEvent(new Event(File.COMPLETE,files));
		return;
	}
	
	for (i = 0; i<files.length; i++) {
		f = files[i];
		if (f.type.indexOf("image") == 0) {
			
			p=URL.createObjectURL(f);
			
			if(!StringUtil.isEmpty(p) && !this.image_to_base64){
				t=new Image();
				t.name= f.name;
				t.src = p;
				t.onload = function(e) {
				   URL.revokeObjectURL(t.src);
				   list.push(t);
				   if(i>=files.length-1) target.dispatchEvent(new Event(File.COMPLETE,list));
				}
				continue;
			}
			
			target._reader = new FileReader();
			target._reader.onload = function(evt) {
				if(target.image_to_base64){
					list.push(evt.target.result);
				}else{
					t=new Image();
					t.name=evt.target.name;
					t.src=evt.target.result;
					list.push(t);
				}
				if(i>=files.length-1) target.dispatchEvent(new Event(File.COMPLETE,list));
			}
			target._reader.readAsDataURL(f);
		}
		else if (f.type.indexOf("text") == 0) {
			target._reader = new FileReader();
			target._reader.onload = function(evt) {
				t=DOMUtil.createDOM("p",{id:evt.target.name,innerHTML:"<pre>"+evt.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</pre>"});
				list.push(t);
				if(i>=files.length-1) target.dispatchEvent(new Event(File.COMPLETE,list));
			}
			target._reader.readAsText(f);
		}else {
			target._reader = new FileReader();
			target._reader.onload = function(evt) {
				list.push(evt.target.result);
				if(i>=files.length-1) target.dispatchEvent(new Event(File.COMPLETE,list));
			}
			target._reader.readAsBinaryString(f);
		}
	}
}

File.prototype.render  = function()
{
	File.superClass.render.apply(this,arguments)
}

Object.defineProperty(File.prototype,"updateMatrix",{
	get: function (){
		return this._updateMatrix;
	},
    set: function (value) {
        if(this._updateMatrix==value) return;
		this._updateMatrix=value;
    },
    enumerable: true,
    configurable: true
});

File.prototype.abortRead=function()
{
	if(this._reader) try{
		this._reader.abort();
	}catch(e){};
}

Object.defineProperty(File.prototype,"supported",{
	get: function (){
		return (window.File && window.FileReader && window.FileList);
	},
    enumerable: true,
    configurable: true
});	

File.prototype.dispose=function()
{
	if(this._element){
		this._element.removeEventListener('change', this._file_select_handler);
	}
	
	File.superClass.dispose.call(this);
	delete this.image_to_base64,this.auto_parse,this._btn,this._cancel_handler,this._file_select_handler,this._file,this._reader,this.name;
}
