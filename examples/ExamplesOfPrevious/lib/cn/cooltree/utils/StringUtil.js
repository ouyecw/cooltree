StringUtil={}

StringUtil.countLeftSpace=function(string)
{
	for(var i = 0; i < string.length; i++)
	{
		c=string.charCodeAt(i);
		if(c > 32 && c!=160 && c!=12288)
		{
			return i;
		}
	}
	
	return i;
}

StringUtil.ltrim=function(string)
{
	if(string==null) return "";
	for(var c,i = 0; i < string.length; i++)
	{
		c=string.charCodeAt(i);
		
		if(c > 32 && c!=160 && c!=12288)
		{
			return string.substring(i);
		}
	}
	return "";
}

StringUtil.rtrim=function(string)
{
	if(string==null) return "";
	for(var c,i = string.length; i >0; i--)
	{
		c=string.charCodeAt(i - 1);
		
		if(c > 32 && c!=160 && c!=12288)
		{
			return string.substring(0, i);
		}
	}
	return "";
}

StringUtil.trim=function(string)
{
	return string==null ? "" : StringUtil.ltrim(StringUtil.rtrim(string))
}

StringUtil.isEmpty=function(string)
{
	if(string==undefined || string==null || string=="undefined" || string=="null") return true;
    string=StringUtil.trim(""+string);
    return (string.length==0);
}

StringUtil.substitute=function(string,array)
{
	if(StringUtil.isEmpty(string) || array==undefined || !(array instanceof Array) ||array.length==0) return string;
	for(var i = 0; i < array.length; i++)
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
StringUtil.countToString=function(total,count)
{
	var num=String(total).length-String(count).length;
	var str="";
			
	while(num>0) {
		str+="0";
		num--;
	}
			
	return (str+count);
}

/**
 * 将字符串切割成相同长度，存入数组，并返回
 * @param {Object} string 字符串
 * @param {Object} length 长度
 */
StringUtil.toArray=function(string,length)
{
	if(StringUtil.isEmpty(string)) return [];
	if(string.length<=length) return [string];
	var d=[];
	
	while(string.length>length){	
		d.push(string.slice(0,length));
		string=string.slice(length);
	}
	
	if(!StringUtil.isEmpty(string)) d.push(string);
	return d;
}

StringUtil.validateEmail=function(Email)
{
	var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	return reg.test(Email);
}

StringUtil.replace=function(targetString,oldString,newString)
{
	if(StringUtil.isEmpty(targetString)) return ""; 
	return (""+targetString).split(oldString).join(newString);
}

StringUtil.remove=function(targetString,removeString)
{
	return StringUtil.replace(targetString, removeString, "");
}

StringUtil.replaceAll=function(targetString,oldArray,newArray)
{
	if(oldArray==null || newArray==null) return targetString;
	
	var i;
	var len=Math.min(oldArray.length,newArray.length);
	
	for(i=0;i<len;i++)  targetString=StringUtil.replace(targetString,oldArray[i],newArray[i]);
	return targetString;
}

StringUtil.exist=function(string)
{
	if(arguments.length<=1 || StringUtil.isEmpty(string)) return false;
	
	var i;
	var sub;
	var len=arguments.length;
	
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
StringUtil.getNumber=function(string)
{
	if(StringUtil.isEmpty(string)) return [""];
	
	var total="",len=string.length;
	var num=string.substr(--len,1);
	
	while(!isNaN(num) && len>=1){
		total=num+total;
		num=string.substr(--len,1);
	}
	
	return StringUtil.isEmpty(total) ? [string] : [StringUtil.rtrim(string.slice(0,++len)),Number(total)];
}

StringUtil.getPathExt=function(path)
{
	var tempArr = path.split(".");
	var tempStr = tempArr[tempArr.length-1];
	tempStr=tempStr.split("?")[0];
	return tempStr.toLowerCase();
}

StringUtil.getBase64Type=function(data)
{
	if(StringUtil.isEmpty(data)) return "";
	let s=data.indexOf("/")+1;
	let e=data.indexOf(";");
	
	if(s<0 || e<0 || s>=e) return "";
	return data.substring(s,e).toLowerCase();
}

StringUtil.getFileName=function(path,index)
{
	index=index || 2;
	var name = path.replace(/%20/g, " "); 
	name = name.split("?")[0]; 
	var matches = /(.*[\\\/])?(.+)(\.[\w]{1,4})/.exec(name);
	if (matches && matches.length == 4) return matches[index];
	return "";
}

StringUtil.escapeXML=function(input)
{
	var str=input;
	str= str.replace(/&/ig, "&amp;");
	
	while (str.indexOf("<") != -1) {
		str = str.replace("<", "&lt;");
	};
	
	while (str.indexOf(">") != -1) {
		str = str.replace(">", "&gt;");
	};
	
	return str;
}

StringUtil.htmlEncode=function(input)
{
	input = StringUtil.replace(input,"&","&amp;");
	input = StringUtil.replace(input,"\"","&quot;");
	input = StringUtil.replace(input,"'","&apos;");
	input = StringUtil.replace(input,"<","&lt;");
	input = StringUtil.replace(input,">","&gt;");
	return input;
}

StringUtil.htmlDecode=function(input)
{
	input = StringUtil.replace(input,"&amp;","&");
	input = StringUtil.replace(input,"&quot;","\"");
	input = StringUtil.replace(input,"&apos;","'");
	input = StringUtil.replace(input,"&lt;","<");
	input = StringUtil.replace(input,"&gt;",">");
	return input;
}

StringUtil.formatTime=function(time,style,separator)
{
	style=style || 0;
	separator=separator || ":";
	time=Math.max(0,MathUtil.int(time));
	
	var second=String(time%60);
	var minute=String(MathUtil.int(time/60)%60);
	var hour=String(MathUtil.int(time/(60*60))%60);
	
	if(second.length<2) second="0"+second;
	if(minute.length<2) minute="0"+minute;
	if(hour.length<2)   hour="0"+hour;
	
	if(style==3)      return (second);
	else if(style==2) return (minute+separator+second);
	else if(style==1) return (hour+separator+minute);
	else              return (hour+separator+minute+separator+second);
	
	return "";
}

StringUtil.parseParams=function(str,type)
{
	if(StringUtil.isEmpty(str)) return {};
	var i,l,name,datas,params=str.split(/&|;/),data={},decode=(type ? decodeURIComponent : unescape);
	
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

StringUtil.decodeName=function(str)
{
	if(StringUtil.isEmpty(str)) return "";
	var i,l,name,arr=str.toLowerCase().split(/-/);
	for(i=1,l=arr.length;i<l;i++)
	{
		name=arr[i];
		if(StringUtil.isEmpty(name)) continue;
		arr[i]=name.substring(0,1).toUpperCase()+name.substring(1);
	}
	return arr.join('');
}

StringUtil.encodeName=function(str)
{
	if(StringUtil.isEmpty(str)) return "";
	var arr=str.split(/(?=[A-Z])/);
	return arr.join("-").toLowerCase();
}

StringUtil.buildParams=function(obj,is_style,type)
{
	if(obj==null) return "";
    var i,b=false,str="",encode=(type ? encodeURIComponent : escape);
    for (i in obj){
        if(b) str+=(is_style ? ";" : "&");
        if(!StringUtil.isEmpty(i) && obj[i]) {
            str+=(is_style ? StringUtil.encodeName(i)+":"+obj[i] : i+"="+(type==0 ? obj[i] : encode(obj[i])));
            b=true;
        }
    }
    return b?str:"";
}

StringUtil.html2object=function(str)
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

StringUtil.toUniqueChar=function(str)
{
	if(StringUtil.isEmpty(str)) return "";
	var new_string="";
	for(var c,i=0,l=str.length;i<l;i++){
		c=str.charAt(i);
		if(new_string.indexOf(c)<0) new_string+=c;
	}
	return new_string;
}

StringUtil.html2text=function(str)
{
	if(StringUtil.isEmpty(str)) return;
	var node=str;
	
	if(typeof str=="string"){
		node=document.createElement("div");
	 	node.innerHTML=str;
	}
	
	return StringUtil._get_string_by_node(node,"");
}

StringUtil._get_string_by_node=function(node,str)
{
	if(node==null) return str;
	
	var child=node.firstElementChild;
	var temp=String(node.textContent || node.innerText || "");
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

StringUtil.utf16to8=function(str) 
{
	var out="", i, len= str.length, c;
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


StringUtil.utf8to16=function(str) 
{
	var out= "", i=0, len= str.length, c,char2, char3;
	
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
