
class StringUtil
{
	static countLeftSpace(string)
	{
		for(let c,i = 0; i < string.length; i++)
		{
			c=string.charCodeAt(i);
			if(c > 32 && c!=160 && c!=12288)
			{
				return i;
			}
		}
		
		return i;
	}
	
	static ltrim(string)
	{
		if(string==null) return "";
		for(let c,i = 0; i < string.length; i++)
		{
			c=string.charCodeAt(i);
			
			if(c > 32 && c!=160 && c!=12288)
			{
				return string.substring(i);
			}
		}
		return "";
	}
	
	static rtrim(string)
	{
		if(string==null) return "";
		for(let c,i = string.length; i >0; i--)
		{
			c=string.charCodeAt(i - 1);
			
			if(c > 32 && c!=160 && c!=12288)
			{
				return string.substring(0, i);
			}
		}
		return "";
	}
	
	static trim(string)
	{
		return string==null ? "" : StringUtil.ltrim(StringUtil.rtrim(string));
	}
	
	static isEmpty(string)
	{
		if(string==undefined || string==null || string=="undefined" || string=="null") return true;
	    string=StringUtil.trim(""+string);
	    return (string.length==0);
	}
	
	static substitute(string,array)
	{
		if(StringUtil.isEmpty(string) || array==undefined || !(array instanceof Array) ||array.length==0) return string;
		for(let i = 0; i < array.length; i++)
		{
			string=string.replace(new RegExp("\\{"+i+"\\}", "g"),array[i]);
		}
		return string;
	}
	
	/**
	 * 数值转换成对应长度字符串
	 * @param {Object} total 最大数
	 * @param {Object} count 当期值
	 */
	static countToString(total,count)
	{
		let num=String(total).length-String(count).length;	
		return (''+count).padStart(num, '0');
	}
	
	/**
	 * 将字符串切割成相同长度，存入数组，并返回
	 * @param {Object} string 字符串
	 * @param {Object} length 长度
	 */
	static toArray(string,length)
	{
		if(StringUtil.isEmpty(string)) return [];
		if(string.length<=length) return [string];
		let d=[];
		
		while(string.length>length){	
			d.push(string.slice(0,length));
			string=string.slice(length);
		}
		
		if(!StringUtil.isEmpty(string)) d.push(string);
		return d;
	}
	
	static validateEmail(Email)
	{
		let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		return reg.test(Email);
	}
	
	static replace(targetString,oldString,newString)
	{
		if(StringUtil.isEmpty(targetString)) return ""; 
		return (""+targetString).split(oldString).join(newString);
	}
	
	static remove(targetString,removeString)
	{
		return StringUtil.replace(targetString, removeString, "");
	}
	
	static replaceAll(targetString,oldArray,newArray)
	{
		if(oldArray==null || newArray==null) return targetString;
		
		let i;
		let len=Math.min(oldArray.length,newArray.length);
		
		for(i=0;i<len;i++)  targetString=StringUtil.replace(targetString,oldArray[i],newArray[i]);
		return targetString;
	}
	
	static exist(string)
	{
		if(arguments.length<=1 || StringUtil.isEmpty(string)) return false;
		
		let i;
		let sub;
		let len=arguments.length;
		
		for(i=1;i<len;i++){
			sub=arguments[i];
			if(!StringUtil.isEmpty(sub) && string.indexOf(sub)!=-1) return true;
		}
		
		return false;
	}
	
	/**
	 * 分离字符串中的字符和数字
	 * @param {String} string+number
	 */
	static getNumber(string)
	{
		if(StringUtil.isEmpty(string)) return [""];
		
		let total="",len=string.length;
		let num=string.substr(--len,1);
		
		while(!isNaN(parseInt(num)) && len>=1){
			total=num+total;
			num=string.substr(--len,1);
		}
		
		return StringUtil.isEmpty(total) ? [string] : [StringUtil.rtrim(string.slice(0,++len)),Number(total)];
	}
	
	static getPathExt(path)
	{
		let tempArr = path.split(".");
		let tempStr = tempArr[tempArr.length-1];
		tempStr=tempStr.split("?")[0];
		return tempStr.toLowerCase();
	}
	
	static getBase64Type(data)
	{
		if(StringUtil.isEmpty(data)) return "";
		let s=data.indexOf("/")+1;
		let e=data.indexOf(";");
		
		if(s<0 || e<0 || s>=e) return "";
		return data.substring(s,e).toLowerCase();
	}
	
	static getFileName(path,index)
	{
		index=index || 2;
		let name = path.replace(/%20/g, " "); 
		name = name.split("?")[0]; 
		let matches = /(.*[\\\/])?(.+)(\.[\w]{1,4})/.exec(name);
		if (matches && matches.length == 4) return matches[index];
		return "";
	}
	
	static escapeXML(input)
	{
		let str=input;
		str= str.replace(/&/ig, "&amp;");
		
		while (str.indexOf("<") != -1) {
			str = str.replace("<", "&lt;");
		};
		
		while (str.indexOf(">") != -1) {
			str = str.replace(">", "&gt;");
		};
		
		return str;
	}
	
	static htmlEncode(input)
	{
		input = StringUtil.replace(input,"&","&amp;");
		input = StringUtil.replace(input,"\"","&quot;");
		input = StringUtil.replace(input,"'","&apos;");
		input = StringUtil.replace(input,"<","&lt;");
		input = StringUtil.replace(input,">","&gt;");
		return input;
	}
	
	static htmlDecode(input)
	{
		input = StringUtil.replace(input,"&amp;","&");
		input = StringUtil.replace(input,"&quot;","\"");
		input = StringUtil.replace(input,"&apos;","'");
		input = StringUtil.replace(input,"&lt;","<");
		input = StringUtil.replace(input,"&gt;",">");
		return input;
	}
	
	static formatTime(time,style,separator)
	{
		style=style || 0;
		separator=separator || ":";
		time=Math.max(0,MathUtil.int(time));
		
		let second=String(time%60);
		let minute=String(MathUtil.int(time/60)%60);
		let hour=String(MathUtil.int(time/(60*60))%60);
		
		if(second.length<2) second="0"+second;
		if(minute.length<2) minute="0"+minute;
		if(hour.length<2)   hour="0"+hour;
		
		if(style==3)      return (second);
		else if(style==2) return (minute+separator+second);
		else if(style==1) return (hour+separator+minute);
		else              return (hour+separator+minute+separator+second);
		
		return "";
	}
	
	static parseParams(str,type)
	{
		if(StringUtil.isEmpty(str)) return {};
		let i,l,name,datas,params=str.split(/&|;/),data={},decode=(type ? decodeURIComponent : unescape);
		
		for(i=0,l=params.length;i<l;i++)
		{
			datas=params[i];
			if(StringUtil.isEmpty(datas) || (datas.indexOf("=")<0 && datas.indexOf(":")<0)) continue;
			datas=datas.split(/=|:/);
			name=StringUtil.trim(datas[0]);
			if(name && name.indexOf("-")>0) name=StringUtil.decodeName(name);
			data[name]=(datas.length<2 || StringUtil.isEmpty(datas[1])) ? null : decode(StringUtil.trim(datas[1]));
		}
		
		return data;
	}
	
	static decodeName(str)
	{
		if(StringUtil.isEmpty(str)) return "";
		let i,l,name,arr=str.toLowerCase().split(/-/);
		for(i=1,l=arr.length;i<l;i++)
		{
			name=arr[i];
			if(StringUtil.isEmpty(name)) continue;
			arr[i]=name.substring(0,1).toUpperCase()+name.substring(1);
		}
		return arr.join('');
	}
	
	static encodeName(str)
	{
		if(StringUtil.isEmpty(str)) return "";
		let arr=str.split(/(?=[A-Z])/);
		return arr.join("-").toLowerCase();
	}
	
	static buildParams(obj,is_style,type)
	{
		if(obj==null) return "";
	    let i,b=false,str="",encode=(type ? encodeURIComponent : escape);
	    for (i in obj){
	        if(b) str+=(is_style ? ";" : "&");
	        if(!StringUtil.isEmpty(i) && obj[i]) {
	            str+=(is_style ? StringUtil.encodeName(i)+":"+obj[i] : i+"="+(type==0 ? obj[i] : encode(obj[i])));
	            b=true;
	        }
	    }
	    return b?str:"";
	}
	
	static html2object(str)
	{
		let node;
		
		if(typeof str=="string"){
			if(  StringUtil.isEmpty(str)) return null;
			node = document.createElement("div");
		    node.innerHTML = str;
		    node = node.getElementsByTagName("*")[0];
		}
		else node=str;
		
	    if (!node || node.nodeType != 1)  return null;
	    
	    let obj = {};
	    obj.tagName = node.nodeName.toLowerCase();
	    let nodeValue = (node.textContent || "").replace(/(\r|\n)/g, "").replace(/^\s+|\s+$/g, "");
	
	    if (nodeValue && node.childNodes.length == 1) {
	        obj.text = nodeValue;
	    }
	    
	    if (node.attributes.length > 0) {
	        for (let j = 0; j < node.attributes.length; j++) {
	            let attribute = node.attributes.item(j);
	            let nodeName  = attribute.nodeName;
	            let nodeValue = attribute.nodeValue;
	            obj[nodeName] = isNaN(nodeValue) ? nodeValue : Number(nodeValue);
	            if(nodeName.toLowerCase()=="style"){
	            	obj[nodeName] = StringUtil.parseParams(obj[nodeName]);
	            }
	        }
	    }
	    
	    if (node.childNodes.length > 0) {
	        let items = [];
	        for (let i = 0; i < node.childNodes.length; i++) {
	            let node = node.childNodes.item(i);
	            let item = StringUtil.html2object(node);
	            if (item) {
	                items.push(item);
	            }
	        }
	        if (items.length > 0) {
	            obj.children = items;
	        }
	    }
	    
	    return obj;
	}
	
	static toUniqueChar(str)
	{
		if(StringUtil.isEmpty(str)) return "";
		let new_string="";
		for(let c,i=0,l=str.length;i<l;i++){
			c=str.charAt(i);
			if(new_string.indexOf(c)<0) new_string+=c;
		}
		return new_string;
	}
	
	static html2text(str)
	{
		if(StringUtil.isEmpty(str)) return;
		let node=str;
		
		if(typeof str=="string"){
			node=document.createElement("div");
		 	node.innerHTML=str;
		}
		
		return StringUtil._get_string_by_node(node,"");
	}
	
	static _get_string_by_node(node,str)
	{
		if(node==null) return str;
		
		let child=node.firstElementChild;
		let temp=String(node.textContent || node.innerText || "");
		str=str+temp;
		
		if(child==null || !StringUtil.isEmpty(temp)) return str;
	
		while(child){
		    if(child.childElementCount && child.childElementCount>0){
		    	str=StringUtil._get_string_by_node(child,str);
		    }else{
		    	str=str+String(child.textContent || child.data || child.value || child.innerText || "");
		    }
		    
			child=child.nextSibling;
		}
		
		return str;
	}
	
	static utf16to8(str)
	{
		let out="", i, len= str.length, c;
		for(i = 0; i < len; i++) 
		{
			c = str.charCodeAt(i);
			if ((c >= 0x0001) && (c <= 0x007F)) {
			    out += str.charAt(i);
			} else if (c > 0x07FF) {
			    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			    out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
			    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
			} else {
			    out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
			    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		    }
		}
		return out;
	}
	
	static utf8to16(str)
	{
		let out= "", i=0, len= str.length, c,char2, char3;
		
		while(i < len) {
			c = str.charCodeAt(i++);
			switch(c >> 4) {
			    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
			        out += str.charAt(i-1);
			        break;
			    case 12: case 13:
			        char2 = str.charCodeAt(i++);
			        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
			        break;
			    case 14:
			        char2 = str.charCodeAt(i++);
			        char3 = str.charCodeAt(i++);
			        out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
			        break;
			}
		}
		return out;
	}
}