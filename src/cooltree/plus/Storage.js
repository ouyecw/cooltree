import Compile from "./Compile.js"

export default class Storage
{
	constructor() 
	{
		this.store=window.localStorage || window.sessionStorage || new Cookie();
	}
	
	/**
	 * @param {String} key
	 * @param {Object} val
	 * @param {Number} exp 默认有效时间为3小时，0为始终有效
	 */
	setItem(key, val, exp=3) 
	{
		exp=exp*3600000;
		val=exp ? {data:val,time:new Date().getTime(),exp: exp} : val;
		val=Compile.encode((typeof val=="object") ? JSON.stringify(val) : val);
		
		this.removeItem(key);
		this.store.setItem(key, val);
	}
	
	
	/**
	 * @param {String} key
	 */
	getItem(key) 
	{
	    let value,temp=this.store.getItem(key);
		if(temp==null) return null;
		temp=Compile.decode(temp);
		
	    try{
	    	temp=JSON.parse(temp);
	    }
	    catch(e){};
		
	    if(typeof temp=="string" || !temp.hasOwnProperty("time")) value=temp;
	    else if(temp.exp >0 && (new Date().getTime() - temp.time) > temp.exp) this.removeItem(key);
	    else value=temp.data;
	    return value;
	}
	
	/**
	 * @param {String} key
	 */
	removeItem(key) 
	{
	    this.store.removeItem(key);
	}
	
	/**
	 * @param {String} label
	 * @param {Number} index 
	 * @param {exception} Array 
	 */
	clear(label=null,index=-1,exception=null)
	{
		if(!label && !exception) return this.store.clear();
		if (!window.localStorage && !window.sessionStorage) return this.store.clear(label,index,exception);
	
		for(let str in this.store){
			if((exception && exception.indexOf(str)>=0) || (label && (index<0 ? str.indexOf(label)<0 : str.indexOf(label)!=index))) 				continue;
			
			this.removeItem(str);
		}
	}
}

class Cookie
{
	constructor(){}
	
	setItem(c_name, value)
	{
	    let exdate = new Date(),expiredays = 30;
	    exdate.setDate(exdate.getDate() + expiredays);
	    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
	}
	
	getItem(c_name) 
	{
	    if (document.cookie.length <=0) return "";
		let c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1) {
		    c_start = c_start + c_name.length + 1; 
		    let c_end = document.cookie.indexOf(";", c_start); 
		    if (c_end == -1) c_end = document.cookie.length;
		    return unescape(document.cookie.substring(c_start, c_end));
		}
	    return "";
	}
	
	removeItem(name) 
	{
	    let exp = new Date();
	    exp.setTime(exp.getTime() - 1);
	    let cval = this.getItem(name);
	    if (cval==null || cval=="") return;
	    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
	
	clear(label=null,index=-1,exception=null) 
	{
		let i,str,keys = document.cookie.match(/[^ =;]+(?=\=)/g);
		if(!keys) return;
		
		for(i = keys.length; i > 0; i--) {
			str=keys[i];
			
			if((exception && exception.indexOf(str)>=0) || (label && (index<0 ? str.indexOf(label)<0 : str.indexOf(label)!=index))) 				continue;
			
			document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
		}
	}
}

Storage.className="Storage";