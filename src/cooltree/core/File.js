/**
===================================================================
File Class
===================================================================
**/
import EventDispatcher from '../events/EventDispatcher.js'
import UniqueUtil from '../utils/UniqueUtil.js'
import StringUtil from '../utils/StringUtil.js'
import DOMUtil from '../utils/DOMUtil.js'
import Event from '../events/Event.js'
import Global from './Global.js'

/**
 * @class
 * @module File
 * @extends EventDispatcher
 */
export default class File extends EventDispatcher
{
	/**
	 * @param {Boolean} multiple
	 * @param {String} accept image/gif,image/jpeg,image/png,text/html,text/txt,audio/mp3,video/mp4
	 */
	constructor(multiple=false,accept=null)
	{
		super();
		this.name=UniqueUtil.getName("File");
		this._reader=this._cancel_handler=this._file_select_handler=null;
		
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
	
	get supported()
	{
		return (Global.root.File && Global.root.FileReader && Global.root.FileList);
	}
	
	open(cache)
	{
		if(!cache) this._clearInputFile();
		if(this.element) this.element.click();
	}
	
	_clearInputFile()
	{
		if(!this.supported || this.element==null) return;
		this.element.removeEventListener('change', this._file_select_handler);
		let multiple=this.element.multiple;
		let accept=this.element.accept;
		
		this.element=null;
		this._browseForOpen("openFile",multiple,accept);
	}
	
	_browseForOpen(name,multiple,accept)
	{	
		multiple=multiple || false;
		
		if(this.element==undefined){
			this.element=DOMUtil.createDOM("input",{type:"file",multiple:multiple,id:this.name,name:name,style:{position: Global.position}});
		}else{	
			this.element.multiple=multiple;
			this.element.name=name;
		}
		
		if(!StringUtil.isEmpty(accept)){
			this.element.accept=accept;
		}
		
		if(this._file_select_handler==undefined){
	//		this._cancel_handler=Global.delegate(this._cancelHandle,this);
			this._file_select_handler=Global.delegate(this._fileSelectHandle,this);
		}
		
		this.element.addEventListener('change', this._file_select_handler, false);
	}
	
	_fileSelectHandle(e)
	{	
		let i,f,t,p,files = e.target.files,failed=[],list=[],target=this,URL = Global.root.URL || Global.root.webkitURL;
		
		if(files.length && this.max_size>0){
			let arr=[];
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
	
	abortRead()
	{
		if(this._reader) try{
			this._reader.abort();
		}catch(e){};
	}
	
	dispose()
	{
		if(this.element){
			this.element.removeEventListener('change', this._file_select_handler);
		}
		
		super.dispose();
		delete this.image_to_base64,this.auto_parse,this._cancel_handler,this._file_select_handler,this._file,this._reader,this.name;
	}
	
	static get COMPLETE()
	{
		return 'file_select_complete';
	}
	
	static get LIMIT()
	{
		return 'file_size_out';
	}
}
File.className="File";