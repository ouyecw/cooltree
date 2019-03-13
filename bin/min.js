class SystemType{};SystemType.OS_PC="pc";SystemType.OS_IPHONE="iphone";SystemType.OS_IPOD="ipod";SystemType.OS_IPAD="ipad";SystemType.OS_ANDROID="android";SystemType.OS_BLACK_BERRY="blackberry";SystemType.OS_WINDOWS_PHONE="windows phone";SystemType.LANDSCAPE="landscape";SystemType.PORTRAIT="portrait";SystemType.NONE="none";class MathUtil
{static countTreeMax(array,attribute,num)
{let i,c,l=array.length;let length=(l>0)?1:0;num=(num==null)?length:num;for(i=0;i<l;i++){c=(attribute==null)?array[i]:array[i][attribute];if(c&&(c instanceof Array)&&c.length>0){length=Math.max(length,num+MathUtil.countTreeMax(c,attribute,num));}}
return length;}
static sort(arr,func)
{if(arr==null||arr.length<2)return;let flag,value1,value2,temp;for(let i=0;i<arr.length-1;i++){flag=false;for(let j=0;j<arr.length-1;j++){value1=arr[j];value2=arr[j+1];if(func?func(value1,value2):value2<value1){temp=arr[j+1];arr[j+1]=arr[j];arr[j]=temp;flag=true;}}
if(!flag){return arr;}}
return arr;}
static int(num)
{if(typeof num==="string")return parseInt(num);let rounded=(0.5+num)|0;rounded=~~(0.5+num);rounded=(0.5+num)<<0;return rounded;}
static format(number,digit=3)
{return Number(Number(number).toFixed(digit));}
static randomInt(max)
{max=max||100;return MathUtil.int(max*Math.random());}
static clamp(number,min,max)
{if(number<min)
return min;if(number>Math.max(max,min))
return max;return number;}
static getDegreesFromRadians(radians)
{return radians*180/Math.PI;}
static getRadiansFromDegrees(degrees)
{return degrees%360/180*Math.PI;}
static getAngle(x1,y1,x2,y2)
{let radians=Math.atan2((y2-y1),(x2-x1));return radians<0?(radians+2*Math.PI):radians;}
static normalizeRadian(value)
{value=(value+Math.PI)%(Math.PI*2.0);value+=value>0?-Math.PI:Math.PI;return value;};static isEquivalent(a,b)
{let epsilon=0.0001;return(a-epsilon<b)&&(a+epsilon>b);}
static getSizeScale(img_width,img_height,frame_width,frame_height,fit)
{fit=(fit==undefined)?true:fit;let scale1=img_width/img_height;let scale2=frame_width/frame_height;if(fit?scale1>scale2:scale1<scale2)return MathUtil.format(frame_width/img_width,3);return MathUtil.format(frame_height/img_height,3);}
static isNumber(value){return typeof(value)==="number"&&!isNaN(value);};static sin(value){let valueFloor=Math.floor(value);let valueCeil=valueFloor+1;let resultFloor=MathUtil.sinInt(valueFloor);let resultCeil=MathUtil.sinInt(valueCeil);return(value-valueFloor)*resultCeil+(valueCeil-value)*resultFloor;};static sinInt(value){value=value%360;if(value<0){value+=360;}
if(value<90){return MathUtil._sin_map[value];}
if(value<180){return MathUtil._cos_map[value-90];}
if(value<270){return-MathUtil._sin_map[value-180];}
return-MathUtil._cos_map[value-270];};static cos(value){let valueFloor=Math.floor(value);let valueCeil=valueFloor+1;let resultFloor=MathUtil.cosInt(valueFloor);let resultCeil=MathUtil.cosInt(valueCeil);return(value-valueFloor)*resultCeil+(valueCeil-value)*resultFloor;};static cosInt(value){value=value%360;if(value<0){value+=360;}
if(value<90){return MathUtil._cos_map[value];}
if(value<180){return-MathUtil._sin_map[value-90];}
if(value<270){return-MathUtil._cos_map[value-180];}
return MathUtil._sin_map[value-270];}}
MathUtil._sin_map={};MathUtil._cos_map={};for(let NumberUtils_i=0;NumberUtils_i<=90;NumberUtils_i++){MathUtil._sin_map[NumberUtils_i]=Math.sin(MathUtil.getRadiansFromDegrees(NumberUtils_i));MathUtil._cos_map[NumberUtils_i]=Math.cos(MathUtil.getRadiansFromDegrees(NumberUtils_i));}
class DoubleClick
{static check()
{let now=(new Date()).getTime();let delay=now-DoubleClick._time;DoubleClick._time=now;if(delay<DoubleClick._interval){DoubleClick._time=0;return true;}
return false;}}
DoubleClick._time=0;DoubleClick._interval=300;class ClassUtil
{static getQualifiedClassName(value)
{if(!value)return null;if(value.constructor&&value.constructor.name){if(value.constructor.name=="Function")return value.name;return value.constructor.name;}
let prototype;try{prototype=value.prototype?value.prototype:Object.getPrototypeOf(value);}
catch(e){trace("[ERROR] ClassUtil.getQualifiedClassName",e);return;}
if(prototype.hasOwnProperty("__class__")){return prototype["__class__"];}
let constructorString=prototype.constructor.toString();let index=constructorString.indexOf("(");let className=constructorString.substring(9,index);Object.defineProperty(prototype,"__class__",{value:className,enumerable:false,writable:true});return className;}
static getQualifiedSuperclassName(value)
{let prototype=value.prototype?value.prototype:Object.getPrototypeOf(value);if(prototype.hasOwnProperty("__superclass__")){return prototype["__superclass__"];}
let superProto=Object.getPrototypeOf(prototype);if(superProto==null)
return null;let superClass=ClassUtil.getQualifiedClassName(superProto.constructor);if(!superClass)
return null;Object.defineProperty(prototype,"__superclass__",{value:superClass,enumerable:false,writable:true});return superClass;}
static getDefinitionByName(name)
{if(StringUtil.isEmpty(name))return null;let definition=ClassUtil.__getDefinitionByName__cache[name];if(definition){return definition;}
let paths=name.split(".");let length=paths.length;definition=Global.root;for(let i=0;i<length;i++){let path=paths[i];definition=definition[path];if(!definition){return null;}}
ClassUtil.__getDefinitionByName__cache[name]=definition;return definition;}}
ClassUtil.__getDefinitionByName__cache={};class ObjectUtil
{static getType(o)
{if(o==null||o==undefined)return"null";let _t;return((_t=typeof(o))=="object"?o==null&&"null"||Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();}
static toString(obj)
{return obj?JSON.stringify(obj):(ObjectUtil.getType(obj)=="boolean"?"false":"null");}
static getAttribute(obj,attrs)
{if(obj==null||StringUtil.isEmpty(attrs))return null;let labels=attrs.split(".");for(let i=0,label,l=labels.length;i<l;i++){label=labels[i];if(StringUtil.isEmpty(label))continue;if(!obj||!obj[label])return null;obj=obj[label];}
return obj;}
static toArray(obj)
{if(!obj)return null;var arr=[];for(let i in obj)
{arr.push({name:i,value:obj[i]});}
return arr;}
static getLabels(obj)
{if(obj==null)return null;return Object.getOwnPropertyNames(obj);}
static clearAttribute(target,attributes,functions)
{if(target==null||attributes==null||attributes.length<1)return;let i,b;for(i in target){b=(typeof(target[i])=="function");if((b&&(functions==null||functions.indexOf(i)>=0))||(!b&&(attributes==null||attributes.indexOf(i)>=0)))continue;delete target[i];}}
static copyAttribute(target,data,must,miss,clone)
{if(target==null||data==null)return;let i;let item;let type;let bool;for(i in data){item=data[i];if((must&&!(i in target))||(miss&&miss.indexOf(i)>=0))continue;try{type=typeof(target[i]);}
catch(err){continue};type=(type=="null"||type=="undefined")?typeof(item):type;switch(type){case"number":target[i]=isNaN(item)?item:Number(item);break;case"boolean":target[i]=(item!=undefined&&(typeof(item)=="string"?(item=="true"):item));break;case"string":target[i]=item;break;default:target[i]=(item==null||typeof(item)=="string"||!clone)?item:ObjectUtil.cloneObj(item);break;}}
return target;}
static cloneObj(origin)
{if(origin==undefined||origin==null)return null;let originProto=Object.getPrototypeOf(origin);return Object.assign(Object.create(originProto),origin);}
static equal(objA,objB)
{if(objA==null||objB==null)return(objA==objB);if(typeof objA!=typeof objB)return false;if(typeof objA!="object")return(objA==objB);let aProps,bProps,i,propName;if(objA instanceof Array&&objB instanceof Array){if(objA.length!=objB.length)return false;for(i=0,l=objA.length;i<l;i++){if(!ObjectUtil.equal(objA[i],objB[i]))return false;}}else{if(objA instanceof Array||objB instanceof Array)return false;aProps=Object.getOwnPropertyNames(objA);bProps=Object.getOwnPropertyNames(objB);if(aProps.length!=bProps.length)return;for(i=0;i<aProps.length;i++){propName=aProps[i];if(!ObjectUtil.equal(objA[propName],objB[propName]))return false;}}
return true;}
static remove_attribute(obj,att)
{if(obj==undefined||obj==null||!att||att==""||typeof obj!="object")return;if(obj instanceof Array){for(let i=0,l=obj.length;i<l;i++)ObjectUtil.remove_attribute(obj[i],att);return;}
if(obj.hasOwnProperty(att))delete obj[att];for(let i in obj)ObjectUtil.remove_attribute(obj[i],att);}
static copy(a,b,d,f)
{if(!a||typeof a!="object")return a;let c,e;if(a instanceof a.constructor&&a.constructor!==Object){if(b){c=ObjectPool.create(b);for(e in a){if(!f&&typeof(a[e])=="function")continue;if(c.hasOwnProperty(e))c[e]=a[e];}}
else c=ObjectUtil.cloneObj(a);}
else for(e in c={},a)c[e]=a[e];if(d)for(e in d)c[e]=d[e];return c}}
class StringUtil
{static countLeftSpace(string)
{for(let c,i=0;i<string.length;i++)
{c=string.charCodeAt(i);if(c>32&&c!=160&&c!=12288)
{return i;}}
return i;}
static ltrim(string)
{if(string==null)return"";for(let c,i=0;i<string.length;i++)
{c=string.charCodeAt(i);if(c>32&&c!=160&&c!=12288)
{return string.substring(i);}}
return"";}
static rtrim(string)
{if(string==null)return"";for(let c,i=string.length;i>0;i--)
{c=string.charCodeAt(i-1);if(c>32&&c!=160&&c!=12288)
{return string.substring(0,i);}}
return"";}
static trim(string)
{return string==null?"":StringUtil.ltrim(StringUtil.rtrim(string));}
static isEmpty(string)
{if(string==undefined||string==null||string=="undefined"||string=="null")return true;string=StringUtil.trim(""+string);return(string.length==0);}
static substitute(string,array)
{if(StringUtil.isEmpty(string)||array==undefined||!(array instanceof Array)||array.length==0)return string;for(let i=0;i<array.length;i++)
{string=string.replace(new RegExp("\\{"+i+"\\}","g"),array[i]);}
return string;}
static countToString(total,count)
{let num=String(total).length-String(count).length;return(''+count).padStart(num,'0');}
static toArray(string,length)
{if(StringUtil.isEmpty(string))return[];if(string.length<=length)return[string];let d=[];while(string.length>length){d.push(string.slice(0,length));string=string.slice(length);}
if(!StringUtil.isEmpty(string))d.push(string);return d;}
static validateEmail(Email)
{let reg=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;return reg.test(Email);}
static replace(targetString,oldString,newString)
{if(StringUtil.isEmpty(targetString))return"";return(""+targetString).split(oldString).join(newString);}
static remove(targetString,removeString)
{return StringUtil.replace(targetString,removeString,"");}
static replaceAll(targetString,oldArray,newArray)
{if(oldArray==null||newArray==null)return targetString;let i;let len=Math.min(oldArray.length,newArray.length);for(i=0;i<len;i++)targetString=StringUtil.replace(targetString,oldArray[i],newArray[i]);return targetString;}
static exist(string)
{if(arguments.length<=1||StringUtil.isEmpty(string))return false;let i;let sub;let len=arguments.length;for(i=1;i<len;i++){sub=arguments[i];if(!StringUtil.isEmpty(sub)&&string.indexOf(sub)!=-1)return true;}
return false;}
static getNumber(string)
{if(StringUtil.isEmpty(string))return[""];let total="",len=string.length;let num=string.substr(--len,1);while(!isNaN(parseInt(num))&&len>=1){total=num+total;num=string.substr(--len,1);}
return StringUtil.isEmpty(total)?[string]:[StringUtil.rtrim(string.slice(0,++len)),Number(total)];}
static getPathExt(path)
{let tempArr=path.split(".");let tempStr=tempArr[tempArr.length-1];tempStr=tempStr.split("?")[0];return tempStr.toLowerCase();}
static getBase64Type(data)
{if(StringUtil.isEmpty(data))return"";let s=data.indexOf("/")+1;let e=data.indexOf(";");if(s<0||e<0||s>=e)return"";return data.substring(s,e).toLowerCase();}
static getFileName(path,index)
{index=index||2;let name=path.replace(/%20/g," ");name=name.split("?")[0];let matches=/(.*[\\\/])?(.+)(\.[\w]{1,4})/.exec(name);if(matches&&matches.length==4)return matches[index];return"";}
static escapeXML(input)
{let str=input;str=str.replace(/&/ig,"&amp;");while(str.indexOf("<")!=-1){str=str.replace("<","&lt;");};while(str.indexOf(">")!=-1){str=str.replace(">","&gt;");};return str;}
static htmlEncode(input)
{input=StringUtil.replace(input,"&","&amp;");input=StringUtil.replace(input,"\"","&quot;");input=StringUtil.replace(input,"'","&apos;");input=StringUtil.replace(input,"<","&lt;");input=StringUtil.replace(input,">","&gt;");return input;}
static htmlDecode(input)
{input=StringUtil.replace(input,"&amp;","&");input=StringUtil.replace(input,"&quot;","\"");input=StringUtil.replace(input,"&apos;","'");input=StringUtil.replace(input,"&lt;","<");input=StringUtil.replace(input,"&gt;",">");return input;}
static formatTime(time,style,separator)
{style=style||0;separator=separator||":";time=Math.max(0,MathUtil.int(time));let second=String(time%60);let minute=String(MathUtil.int(time/60)%60);let hour=String(MathUtil.int(time/(60*60))%60);if(second.length<2)second="0"+second;if(minute.length<2)minute="0"+minute;if(hour.length<2)hour="0"+hour;if(style==3)return(second);else if(style==2)return(minute+separator+second);else if(style==1)return(hour+separator+minute);else return(hour+separator+minute+separator+second);return"";}
static parseParams(str,type)
{if(StringUtil.isEmpty(str))return{};let i,l,name,datas,params=str.split(/&|;/),data={},decode=(type?decodeURIComponent:unescape);for(i=0,l=params.length;i<l;i++)
{datas=params[i];if(StringUtil.isEmpty(datas)||(datas.indexOf("=")<0&&datas.indexOf(":")<0))continue;datas=datas.split(/=|:/);name=StringUtil.trim(datas[0]);if(name&&name.indexOf("-")>0)name=StringUtil.decodeName(name);data[name]=(datas.length<2||StringUtil.isEmpty(datas[1]))?null:decode(StringUtil.trim(datas[1]));}
return data;}
static decodeName(str)
{if(StringUtil.isEmpty(str))return"";let i,l,name,arr=str.toLowerCase().split(/-/);for(i=1,l=arr.length;i<l;i++)
{name=arr[i];if(StringUtil.isEmpty(name))continue;arr[i]=name.substring(0,1).toUpperCase()+name.substring(1);}
return arr.join('');}
static encodeName(str)
{if(StringUtil.isEmpty(str))return"";let arr=str.split(/(?=[A-Z])/);return arr.join("-").toLowerCase();}
static buildParams(obj,is_style,type)
{if(obj==null)return"";let i,b=false,str="",encode=(type?encodeURIComponent:escape);for(i in obj){if(b)str+=(is_style?";":"&");if(!StringUtil.isEmpty(i)&&obj[i]){str+=(is_style?StringUtil.encodeName(i)+":"+obj[i]:i+"="+(type==0?obj[i]:encode(obj[i])));b=true;}}
return b?str:"";}
static html2object(str)
{let node;if(typeof str=="string"){if(StringUtil.isEmpty(str))return null;node=document.createElement("div");node.innerHTML=str;node=node.getElementsByTagName("*")[0];}
else node=str;if(!node||node.nodeType!=1)return null;let obj={};obj.tagName=node.nodeName.toLowerCase();let nodeValue=(node.textContent||"").replace(/(\r|\n)/g,"").replace(/^\s+|\s+$/g,"");if(nodeValue&&node.childNodes.length==1){obj.text=nodeValue;}
if(node.attributes.length>0){for(let j=0;j<node.attributes.length;j++){let attribute=node.attributes.item(j);let nodeName=attribute.nodeName;let nodeValue=attribute.nodeValue;obj[nodeName]=isNaN(nodeValue)?nodeValue:Number(nodeValue);if(nodeName.toLowerCase()=="style"){obj[nodeName]=StringUtil.parseParams(obj[nodeName]);}}}
if(node.childNodes.length>0){let items=[];for(let i=0;i<node.childNodes.length;i++){let node=node.childNodes.item(i);let item=StringUtil.html2object(node);if(item){items.push(item);}}
if(items.length>0){obj.children=items;}}
return obj;}
static toUniqueChar(str)
{if(StringUtil.isEmpty(str))return"";let new_string="";for(let c,i=0,l=str.length;i<l;i++){c=str.charAt(i);if(new_string.indexOf(c)<0)new_string+=c;}
return new_string;}
static html2text(str)
{if(StringUtil.isEmpty(str))return;let node=str;if(typeof str=="string"){node=document.createElement("div");node.innerHTML=str;}
return StringUtil._get_string_by_node(node,"");}
static _get_string_by_node(node,str)
{if(node==null)return str;let child=node.firstElementChild;let temp=String(node.textContent||node.innerText||"");str=str+temp;if(child==null||!StringUtil.isEmpty(temp))return str;while(child){if(child.childElementCount&&child.childElementCount>0){str=StringUtil._get_string_by_node(child,str);}else{str=str+String(child.textContent||child.data||child.value||child.innerText||"");}
child=child.nextSibling;}
return str;}
static utf16to8(str)
{let out="",i,len=str.length,c;for(i=0;i<len;i++)
{c=str.charCodeAt(i);if((c>=0x0001)&&(c<=0x007F)){out+=str.charAt(i);}else if(c>0x07FF){out+=String.fromCharCode(0xE0|((c>>12)&0x0F));out+=String.fromCharCode(0x80|((c>>6)&0x3F));out+=String.fromCharCode(0x80|((c>>0)&0x3F));}else{out+=String.fromCharCode(0xC0|((c>>6)&0x1F));out+=String.fromCharCode(0x80|((c>>0)&0x3F));}}
return out;}
static utf8to16(str)
{let out="",i=0,len=str.length,c,char2,char3;while(i<len){c=str.charCodeAt(i++);switch(c>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:out+=str.charAt(i-1);break;case 12:case 13:char2=str.charCodeAt(i++);out+=String.fromCharCode(((c&0x1F)<<6)|(char2&0x3F));break;case 14:char2=str.charCodeAt(i++);char3=str.charCodeAt(i++);out+=String.fromCharCode(((c&0x0F)<<12)|((char2&0x3F)<<6)|((char3&0x3F)<<0));break;}}
return out;}}
class ColorUtil
{static getRed(color)
{return(color>>16)&0xFF;}
static getGreen(color)
{return(color>>8)&0xFF;}
static getBlue(color)
{return color&0xFF;}
static getAlpha(color)
{return(color>>24)&0xFF;}
static darkenColor(color,factor)
{var red=Math.min(255,ColorUtil.getRed(color)*factor);var green=Math.min(255,ColorUtil.getGreen(color)*factor);var blue=Math.min(255,ColorUtil.getBlue(color)*factor);return ColorUtil.toInt(red,green,blue);}
static colorToRGBA(color,alpha)
{let c=ColorUtil.toColor(color);let g=ColorUtil.getGreen(c);let b=ColorUtil.getBlue(c);let r=ColorUtil.getRed(c);return alpha==undefined?"rgb("+r+","+g+","+b+")":"rgba("+r+","+g+","+b+","+MathUtil.clamp(alpha,0,1)+")";}
static toInt(red,green,blue)
{return((red<<16)|(green<<8)|(blue));}
static toInt32(red,green,blue,alpha)
{return((alpha<<24)|(red<<16)|(green<<8)|(blue));}
static toHex(value)
{let g=ColorUtil.getGreen(value);let b=ColorUtil.getBlue(value);let r=ColorUtil.getRed(value);let hexs=[r.toString(16),g.toString(16),b.toString(16)];for(let i=0;i<3;i++)if(hexs[i].length==1)hexs[i]="0"+hexs[i];return"#"+hexs.join("");}
static toColor(color)
{color=String(color);if(StringUtil.isEmpty(color))return;color=StringUtil.replaceAll(color,["0x","0X","#"],["","",""]);return Number("0x"+color);}
static formatColor(color)
{if(isNaN(Number(color)))return color;return ColorUtil.toHex(Number(color));}
static getLinearGradient(context,args,colors)
{var gradient=context.createLinearGradient.apply(context,args);let i,color,len=colors.length;for(i=0;i<len;i++){color=colors[i];if(color==null||color.length<2)continue;gradient.addColorStop(color[0],ColorUtil.formatColor(color[1]));}
return gradient;}
static getRadialGradient(context,args,colors)
{var gradient=context.createRadialGradient.apply(context,args);let i,color,len=colors.length;for(i=0;i<len;i++){color=colors[i];if(color==null||color.length<2)continue;gradient.addColorStop(color[0],ColorUtil.formatColor(color[1]));}
return gradient;}
static getGradientColor(g_color)
{if(g_color==null||Global.context==null)return g_color;let str=(g_color.type==0)?"getLinearGradient":"getRadialGradient";let args=(g_color.type==0)?[g_color.xStart,g_color.yStart,g_color.xEnd,g_color.yEnd]:[g_color.xStart,g_color.yStart,g_color.radiusStart,g_color.xEnd,g_color.yEnd,g_color.radiusEnd];let colors=[];let i,len=g_color.offsetlist.length;for(i=0;i<len;i++){colors.push([g_color.offsetlist[i],g_color.colorList[i]]);}
return ColorUtil[str](Global.context,args,colors);}
static interpolateColor(fromColor,toColor,progress)
{if(fromColor==undefined||toColor==undefined||progress==undefined)return 0;progress=(progress>1)?0.01*progress:progress;fromColor=ColorUtil.toColor(fromColor);toColor=ColorUtil.toColor(toColor);let q=1-progress;let fromA=(fromColor>>24)&0xFF;let fromR=(fromColor>>16)&0xFF;let fromG=(fromColor>>8)&0xFF;let fromB=fromColor&0xFF;let toA=(toColor>>24)&0xFF;let toR=(toColor>>16)&0xFF;let toG=(toColor>>8)&0xFF;let toB=toColor&0xFF;let resultA=fromA*q+toA*progress;let resultR=fromR*q+toR*progress;let resultG=fromG*q+toG*progress;let resultB=fromB*q+toB*progress;let resultColor=resultA<<24|resultR<<16|resultG<<8|resultB;return resultColor;}}
class CanvasUtil
{static create(t)
{let s=t||{};if(!s.canvas){s.canvas=document.createElement("canvas");s.context=s.canvas.getContext("2d");}
return s;}
static getCache(image,type)
{let target=CanvasUtil.create();target.canvas.width=image.width;target.canvas.height=image.height;target.context.drawImage(image,0,0,image.width,image.height);return target.canvas.toDataURL(type||"image/png");}
static splitFrames(image,x,y,w,h)
{if(!image||!w||!h)return null;let canvas=document.createElement("canvas");let context=canvas.getContext("2d");canvas.height=h;canvas.width=w;context.drawImage(image,x,y,w,h,0,0,w,h);return canvas;}
static toImage(canvas,type)
{if(canvas==null)return;let image=new Image();image.src=canvas.toDataURL(type||"image/png");image.height=MathUtil.int(canvas.height);image.width=MathUtil.int(canvas.width);return image;}
static cutImage(img,w,h,fit)
{if(img==null||(img.width==w&&img.height==h))return img;let scale=MathUtil.getSizeScale(img.width,img.height,w,h,fit);let obj=CanvasUtil.create();obj.canvas.width=w;obj.canvas.height=h;obj.context.scale(scale,scale);obj.context.translate((w-img.width*scale)*0.5,(h-img.height*scale)*0.5);obj.context.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);return CanvasUtil.toImage(obj.canvas);}
static toCanvas(img,target,clear)
{if(img==null)return;clear=(clear==undefined||clear==true);target=target||CanvasUtil.create();if(clear)target.context.clearRect(0,0,target.canvas.width,target.canvas.height);target.canvas.height=img.height;target.canvas.width=img.width;target.context.drawImage(img,0,0);return target.canvas;}
static getPixelAphla(context,x,y)
{if(context==null||x>context.width||y>context.height)return 255;return context.getImageData(x,y,1,1).data[3];}
static clearContext(context)
{if(context)context.clear(0,0,context.width,context.height);}
static containerToImage(container,type,w,h,fill_color)
{if(container==undefined)return;let target=ObjectPool.create(Graphics);target.canvas.width=Math.ceil(w||container.width);target.canvas.height=Math.ceil(h||container.height);if(!StringUtil.isEmpty(fill_color)){target.beginFill(fill_color);target.drawRect(0,0,target.canvas.width,target.canvas.height);target.endFill();}
CanvasUtil._renderContainer(target,container,container);var data=type?target.canvas.toDataURL(type||"image/png"):CanvasUtil.toImage(target.canvas,!StringUtil.isEmpty(fill_color)?"image/jpg":null);ObjectPool.remove(target);return data;}
static _renderContainer(target,self,container)
{let i,c,l;for(i=0,l=self._children.length;i<l;i++){c=self._children[i];if(c instanceof DisplayObjectContainer){try{if(c instanceof Sprite)c.render(target,container);else CanvasUtil._renderContainer(target,c,container)}catch(err){trace(err);}
continue;}
target.context.save();c._render(target,false,container);target.context.restore();}}
static colorTransform(context,rect,colorTransform,display,rect2)
{var x=rect.x>>0,y=rect.y>>0,w=rect.width>>0,h=rect.height>>0;var temp=(display&&rect2)?display.getImageData(rect2.x,rect2.y,rect2.width,rect2.height).data:null;var img=context.getImageData(x,y,w,h);var data=img.data;for(let i=0,l=data.length;i<l;i+=4){let r=i,g=i+1,b=i+2,a=i+3;if((temp&&temp[a]<1)||data[a]<1)continue;data[r]=data[r]*colorTransform.redMultiplier+colorTransform.redOffset;data[g]=data[g]*colorTransform.greenMultiplier+colorTransform.greenOffset;data[b]=data[b]*colorTransform.blueMultiplier+colorTransform.blueOffset;data[a]=data[a]*colorTransform.alphaMultiplier+colorTransform.alphaOffset;}
context.putImageData(img,x,y,0,0,w,h);}}
class Language{}
Language.CN="zh";Language.JA="ja";Language.EN="en";Language.TW="zh-tw";Language.HK="zh-hk";Language.FR="fr";Language.DE="de";Language.KO="ko";Language.ES="es";Language.SV="sv";Language.IT="it";class WordUtil
{static set(label,word,language)
{if(StringUtil.isEmpty(label)||StringUtil.isEmpty(word))return;language=(language==undefined)?WordUtil.language:language;if(!WordUtil.dic.hasOwnProperty(language))WordUtil.dic[language]={};WordUtil.dic[language][label]=word;}
static get(label,language)
{language=(language==undefined)?WordUtil.language:language;if(!WordUtil.dic.hasOwnProperty(language)||WordUtil.dic[language]==null||!(WordUtil.dic[language]).hasOwnProperty(label))return"";return WordUtil.dic[language][label];}
static format(language)
{language=language.toLowerCase();if(language==Language.TW||language==Language.HK)return language;return language.split("-")[0];}
static clear()
{WordUtil.dic={};}}
WordUtil.dic={};WordUtil.language=Language.CN;class DOMUtil
{static getDOM(id)
{return document.getElementById(id);};static createDOM(type,props)
{var dom=document.createElement(type);if(props==undefined)return dom;return DOMUtil.setAttributes(dom,props);};static setAttributes(dom,props)
{if(dom==null||props==null)return;for(let p in props)
{let val=props[p];if(p=="style")
{if(!dom.style)dom.style={};for(let s in val)dom.style[s]=val[s];}else if(val)
{dom[p]=val;}}
return dom;}
static createDOMDrawable(disObj,imageObj)
{let tag=disObj.tagName||"div";let img=imageObj.image;let w=disObj.width||(img&&img.width);let h=disObj.height||(img&&img.height);let elem=DOMUtil.createDOM(tag);if(disObj.id)elem.id=disObj.id;elem.style.position="absolute";elem.style.left=(disObj.left||0)+"px";elem.style.top=(disObj.top||0)+"px";elem.style.width=w+"px";elem.style.height=h+"px";if(tag=="canvas")
{elem.width=w;elem.height=h;if(img)
{let ctx=elem.getContext("2d");let rect=imageObj.rect||[0,0,w,h];ctx.drawImage(img,rect[0],rect[1],rect[2],rect[3],(disObj.x||0),(disObj.y||0),(disObj.width||rect[2]),(disObj.height||rect[3]));}}else
{elem.style.opacity=disObj.alpha!=undefined?disObj.alpha:1;elem.style.overflow="hidden";if(img&&img.src)
{elem.style.backgroundImage="url("+img.src+")";let bgX=disObj.rectX||0,bgY=disObj.rectY||0;elem.style.backgroundPosition=(-bgX)+"px "+(-bgY)+"px";}}
return elem;}
static getElementOffset(elem)
{let left=elem.offsetLeft,top=elem.offsetTop;while((elem=elem.offsetParent)&&elem!=document)
{left+=elem.offsetLeft;top+=elem.offsetTop;}
return{left:left,top:top};};static contains(container,target)
{if(!container||!target)return false;if(container===target)return true;if(!("compareDocumentPosition"in document||"contains"in document))return DOMUtil._contains_manual(container,target);let adown=container.nodeType===9?container.documentElement:container,bup=target&&target.parentNode;return container===bup||!!(bup&&bup.nodeType===1&&(adown.contains?adown.contains(bup):container.compareDocumentPosition&&container.compareDocumentPosition(bup)&16));}
static _contains_manual(a,b)
{if(!b)return false;while((b=b.parentNode)){if(b===a){return true;}}
return false;}
static each(str,func)
{if(StringUtil.isEmpty(str)||!func||typeof func!="function")return;let node=document.createElement("div");node.innerHTML=str;DOMUtil._each_do(node,func);return node.innerHTML;}
static _each_do(node,func)
{let child,count=node.childElementCount;for(let i=0;i<count;i++){if(node==undefined||node.children[i]==undefined){continue;}
child=node.children[i];if(child.childElementCount>0){DOMUtil._each_do(child,func);}
if(func)func(child);}}
static dispatchEvent(eventClass,eventType,node)
{let evObj=document.createEvent(eventClass);evObj.initEvent(eventType,true,false);(node||document).dispatchEvent(evObj);}}
class UniqueUtil
{static getName(label)
{if(!UniqueUtil.dic.hasOwnProperty(label)||!Number.isFinite(UniqueUtil.dic[label])){UniqueUtil.dic[label]=0;}else{UniqueUtil.dic[label]++;}
return label+UniqueUtil.dic[label];}}
UniqueUtil.dic={};class StorageObject
{constructor(target=null)
{this.target=null;if(target)this.init(target);}
init(target)
{if(!target)return;this.target=target;}
setItem(label,value)
{if(!this.target||StringUtil.isEmpty(label))return false;if(typeof value=="object")value=JSON.stringify(value);this.target[label]=value;}
getItem(label)
{if(!this.target||StringUtil.isEmpty(label))return false;return this.target[label];}
clearItem(label)
{if(!this.target)return false;delete this.target[label];}
clear()
{if(!this.target)return false;for(let label in this.target)
delete this.target[label];}}
class ObjectPool
{static create(value,args)
{let type=ClassUtil.getQualifiedClassName(value);let item,list=ObjectPool._dic[type];if(list&&list.length)
{item=list.pop();if(list.length==0)delete ObjectPool._dic[type];if(item&&args&&(args instanceof Array)&&item.reset&&typeof item.reset=="function"){item.reset(...args);}}
else if(args&&(args instanceof Array)){item=new value(...args);}
else{item=new value();}
return item;}
static length(value)
{var type=(typeof value==="string"?value:ClassUtil.getQualifiedClassName(value));var list=ObjectPool._dic[type];return!list?0:list.length;}
static remove(obj)
{if(obj==null)return;let str,type=ClassUtil.getQualifiedClassName(obj);if(!ObjectPool._dic[type])
ObjectPool._dic[type]=[];if(obj.hasOwnProperty("name")&&!StringUtil.isEmpty(obj.name)){str=obj.name;str=str.split("_");str.pop();if(ObjectPool.COUNT>900000)ObjectPool.COUNT=0;else ObjectPool.COUNT++;str.push("pool"+ObjectPool.COUNT);str=str.join("_");}
try{obj.reset();}
catch(e){try{obj.dispose();}
catch(e){trace("[WARN] ObjectPool.remove dispose class by",type,"detail:"+e.toString());}
return false;}
if(ObjectPool.max>0&&(ObjectPool._dic[type]).length>=ObjectPool.max){try{obj.dispose();}
catch(e){};obj=null;return false;}
if((ObjectPool._dic[type]).indexOf(obj)==-1){if(!StringUtil.isEmpty(str))obj.name=str;(ObjectPool._dic[type]).push(obj);}
return true;}
static clear(value)
{if(value==undefined){ObjectPool._dic={};}else{var type=ClassUtil.getQualifiedClassName(value);delete ObjectPool._dic[type];}}
static getInfo()
{let name,str="[";for(name in ObjectPool._dic)str+=name+":"+ObjectPool._dic[name].length+"; ";return str+"]";}}
ObjectPool.max=50;ObjectPool._dic={};ObjectPool.COUNT=0;class CollisionUtil
{static hitTestPoint(obj,x,y,usePolyCollision)
{let b=(obj instanceof DisplayBase)?obj.getBounds(obj.stage):obj,len=b.length;let hit=x>=b.x&&x<=b.x+b.width&&y>=b.y&&y<=b.y+b.height;if(hit&&usePolyCollision&&len)
{let cross=0,onBorder=false,minX,maxX,minY,maxY;for(let i=0;i<len;i++)
{let p1=b[i],p2=b[(i+1)%len];if(p1.y==p2.y&&y==p1.y)
{p1.x>p2.x?(minX=p2.x,maxX=p1.x):(minX=p1.x,maxX=p2.x);if(x>=minX&&x<=maxX)
{onBorder=true;continue;}}
p1.y>p2.y?(minY=p2.y,maxY=p1.y):(minY=p1.y,maxY=p2.y);if(y<minY||y>maxY)continue;let nx=(y-p1.y)*(p2.x-p1.x)/(p2.y-p1.y)+p1.x;if(nx>x)cross++;else if(nx==x)onBorder=true;}
if(onBorder)return 0;else if(cross%2==1)return 1;return-1;}
return hit?1:-1;};static hitTestObject(obj1,obj2,usePolyCollision)
{let b1=obj1.getBounds(obj1.stage),b2=obj2.getBounds(obj2.stage);let hit=b1.x<=b2.x+b2.width&&b2.x<=b1.x+b1.width&&b1.y<=b2.y+b2.height&&b2.y<=b1.y+b1.height;if(hit&&usePolyCollision)
{hit=CollisionUtil.polygonCollision(b1,b2);return hit!==false;}
return hit;};static polygonCollision(poly1,poly2)
{let result=CollisionUtil._doSATCheck(poly1,poly2,{overlap:-Infinity,normal:{x:0,y:0}});if(result)return CollisionUtil._doSATCheck(poly2,poly1,result);return false;};static _doSATCheck(poly1,poly2,result)
{let len1=poly1.length,len2=poly2.length,currentPoint,nextPoint,distance,min1,max1,min2,max2,dot,overlap,normal={x:0,y:0};for(let i=0;i<len1;i++)
{currentPoint=poly1[i];nextPoint=poly1[(i<len1-1?i+1:0)];normal.x=currentPoint.y-nextPoint.y;normal.y=nextPoint.x-currentPoint.x;distance=Math.sqrt(normal.x*normal.x+normal.y*normal.y);normal.x/=distance;normal.y/=distance;min1=max1=poly1[0].x*normal.x+poly1[0].y*normal.y;for(let j=1;j<len1;j++)
{dot=poly1[j].x*normal.x+poly1[j].y*normal.y;if(dot>max1)max1=dot;else if(dot<min1)min1=dot;}
min2=max2=poly2[0].x*normal.x+poly2[0].y*normal.y;for(j=1;j<len2;j++)
{dot=poly2[j].x*normal.x+poly2[j].y*normal.y;if(dot>max2)max2=dot;else if(dot<min2)min2=dot;}
if(min1<min2)
{overlap=min2-max1;normal.x=-normal.x;normal.y=-normal.y;}else
{overlap=min1-max2;}
if(overlap>=0)
{return false;}else if(overlap>result.overlap)
{result.overlap=overlap;result.normal.x=normal.x;result.normal.y=normal.y;}}
return result;}}
class PropUtil
{static parseProperties(data)
{var currentMap={};var newData=data.replace(/[\r\n]/g,"\n");var dateArray=newData.split("\n");let i,str,index,key,val;for(i=0;i<dateArray.length;i++)
{str=dateArray[i];if(str==null||str.length<3)
{continue;}
if(str.charAt(0)=="#")
{continue;}
index=dateArray[i].indexOf("=");if(index<0)
{continue;}
key=StringUtil.trim(str.substring(0,index));val=StringUtil.trim(str.substring(index+1,str.length));currentMap[key]=val;}
return currentMap;}}
class SVGUtil
{static getRect(xml)
{if(xml==undefined)return null;var xml_doc=xml.documentElement?xml.documentElement:xml;var w=xml_doc.width;var h=xml_doc.height;var w_bool=(w instanceof SVGAnimatedLength);var h_bool=(h instanceof SVGAnimatedLength);return new Rectangle(w_bool?w.baseVal.value:0,h_bool?h.baseVal.value:0,w_bool?w.animVal.value:MathUtil.int(w),h_bool?h.animVal.value:MathUtil.int(h));}
static getElement(xml)
{if(xml==undefined)return null;var map=ObjectPool.create(DOMDisplay);var rect=SVGUtil.getRect(xml);var svg=DOMUtil.createDOM("div",{style:{width:rect.width+"px",height:rect.height+"px"}});try{svg.innerHTML=new XMLSerializer().serializeToString(xml);}
catch(err){svg.innerHTML=xml;}
map.element=svg;return map;}
static create(type,props)
{if(type==undefined)return;let dom=document.createElementNS(SVGUtil.ns,type);if(props==undefined)props={};if(type.toLowerCase()=="svg"&&!props.hasOwnProperty("xmlns"))props.xmlns=SVGUtil.ns;SVGUtil.setAttributes(dom,props);return dom;};static setAttributes(dom,props)
{if(dom==null||props==null)return;for(let p in props)
{let val=props[p];if(val==null)continue;if(p=="style")
{for(let s in val)dom.style[s]=val[s];}else if(p=="innerHTML"||p=="outerHTML"){dom.innerHTML=val;}else{dom.setAttribute(p,val);}}}
static getElementsById(node,tagName,id)
{let elems=node.getElementsByTagName(tagName);if(!elems.length)return null;for(let i=0,s,l=elems.length;i<l;i++){s=elems[i];if(s.id==id)return s;}}
static get supported()
{return(document.createElementNS!=undefined&&document.createElementNS(SVGUtil.ns,'svg').createSVGRect!=undefined);}}
SVGUtil.ns='http://www.w3.org/2000/svg';SVGUtil.xlink='http://www.w3.org/1999/xlink';SVGUtil.xmlns='http://www.w3.org/2000/xmlns/';class LayoutUtil
{static tile(array,num,isX,rect,space,focus,isForward)
{if(array==undefined||array.length<1||num==undefined||num<1)return;if(isX==true)LayoutUtil._row(array,num,rect,space,focus,isForward);else LayoutUtil._tier(array,num,rect,space,focus,isForward);}
static _row(array,tier,rect,space,focus,isForward)
{focus=(focus==undefined)?{x:0,y:0}:focus;let i,item,_width,_height,length=array.length;let _x=(rect==undefined?0:rect.x);let _y=(rect==undefined?0:rect.y);let Xspace=(space==undefined?0:space.x);let Yspace=(space==undefined?0:space.y);let reverseHeight=(isForward==undefined||!isForward)?0:LayoutUtil._countSize(array,rect,(tier-1),Yspace);for(i=0;i<length;i++)
{item=array[i];_width=(rect==undefined||rect.width==0)?(item?item.getWidth():0):rect.width;_height=(rect==undefined||rect.height==0)?(item?item.getHeight():0):rect.height;if(_width==0&&_height==0)continue;if(!(item==null||!(("x"in item)&&("y"in item)))){item.x=Math.round(_x+_width*focus.x);item.y=Math.round(reverseHeight==0?_y:(_y+reverseHeight));}
_y+=(reverseHeight==0)?Math.round(_height+Yspace):Math.round((_height+Yspace)*-1);if((i+1)%tier==0){_y=(rect==undefined?0:rect.y);_x+=Math.round(_width+Xspace);}}}
static _tier(array,row,rect,space,focus,isForward)
{focus=(focus==undefined)?{x:0,y:0}:focus;let i,item,_width,_height,length=array.length;let _x=(rect==undefined?0:rect.x);let _y=(rect==undefined?0:rect.y);let Xspace=(space==undefined?0:space.x);let Yspace=(space==undefined?0:space.y);let reverseWidth=(isForward==undefined||!isForward)?0:LayoutUtil._countSize(array,rect,(row-1),Xspace,true);for(i=0;i<length;i++)
{item=array[i];_width=(rect==undefined||rect.width==0)?(item?item.getWidth():0):rect.width;_height=(rect==undefined||rect.height==0)?(item?item.getHeight():0):rect.height;if(_width==0&&_height==0)continue;if(!(item==null||!(("x"in item)&&("y"in item)))){item.x=Math.round(reverseWidth==0?_x:(_x+reverseWidth));item.y=Math.round(_y+_height*focus.y);}
_x+=(reverseWidth==0)?Math.round(_width+Xspace):Math.round((_width+Xspace)*-1);if((i+1)%row==0){_x=(rect==undefined?0:rect.x);_y+=Math.round(_height+Yspace);}}}
static _countSize(array,rect,n,space,isWidth)
{if(n<1)return 0;if(isWidth&&rect&&rect.width!=0)return Math.round(Math.abs(rect.width*n+(n-1)*space));if(!isWidth&&rect&&rect.height!=0)return Math.round(Math.abs(rect.height*n+(n-1)*space));let i,size=0;for(i=0;i<n;i++)
{size+=isWidth?Math.round(array[i].width):Math.round(array[i].height);size+=space;}
return size;}}
class GColor
{constructor(type,xStart,yStart,xEnd,yEnd,offsetlist,colorList,radiusStart,radiusEnd)
{this.setup(type,xStart,yStart,xEnd,yEnd,offsetlist,colorList,radiusStart,radiusEnd);}
setup(type,xStart,yStart,xEnd,yEnd,offsetlist,colorList,radiusStart,radiusEnd)
{this.type=type;this.xStart=xStart;this.yStart=yStart;this.xEnd=xEnd;this.yEnd=yEnd;this.offsetlist=offsetlist;this.colorList=colorList;this.radiusStart=radiusStart;this.radiusEnd=radiusEnd;}
dispose()
{delete this.type,this.xStart,this.yStart,this.xEnd,this.yEnd,this.offsetlist,this.colorList,this.radiusStart,this.radiusEnd;}}
class UIOrientation{};UIOrientation.isX=1;UIOrientation.isY=2;UIOrientation.isXY=3;UIOrientation.isNone=0;class ContextVO
{constructor()
{this.actions=[];this.type_id=0;this.value=null;}
getValue()
{if(this.value)return this.value;this.value={};let name;for(name in this)
{if(ContextVO.LIST.indexOf(name)>=0||typeof this[name]==="function"||name=="actions"||name=="type_id"||name=="value")continue;this.value[name]=this[name];delete this[name];}
return this.value;}
reset()
{if(!this.value){let name;for(name in this)
{if(ContextVO.LIST.indexOf(name)>=0||typeof this[name]==="function"||name=="actions"||name=="type_id"||name=="value")continue;delete this[name];}}
this.type_id=0;this.actions=[];this.value=null;}
static INIT_CLASS()
{if(ContextVO.IS_INIT)return;ContextVO.IS_INIT=true;let name;for(name of ContextVO.LIST)
{ContextVO.prototype[name]=ContextVO.create_func(name);}}
static create_func(name)
{return function(){this.actions.push({method:name,data:arguments});}}}
ContextVO.LIST=['save','restore','scale','rotate','translate','transform','setTransform','getTransform','resetTransform','createLinearGradient','createRadialGradient','createPattern','clearRect','fillRect','strokeRect','beginPath','fill','stroke','drawFocusIfNeeded','clip','isPointInPath','isPointInStroke','fillText','strokeText','measureText','drawImage','getImageData','putImageData','createImageData','setLineDash','getLineDash','closePath','moveTo','lineTo','quadraticCurveTo','bezierCurveTo','arcTo','rect','arc','ellipse','drawSvg'];ContextVO.IS_INIT=false;class GraphicsVO
{constructor()
{this.actions=[];this.type_id=1;this.value=null;}
getValue()
{if(this.value)return this.value;this.value={};let name;for(name in this)
{if(GraphicsVO.LIST.indexOf(name)>=0||typeof this[name]==="function"||name=="actions"||name=="type_id"||name=="value")continue;this.value[name]=this[name];delete this[name];}
return this.value;}
reset()
{if(!this.value){let name;for(name in this)
{if(GraphicsVO.LIST.indexOf(name)>=0||typeof this[name]==="function"||name=="actions"||name=="type_id"||name=="value")continue;delete this[name];}}
this.type_id=1;this.actions=[];this.value=null;}
static INIT_CLASS()
{if(GraphicsVO.IS_INIT)return;GraphicsVO.IS_INIT=true;let name;for(name of GraphicsVO.LIST)
{GraphicsVO.prototype[name]=ContextVO.create_func(name);}}}
GraphicsVO.LIST=["beginPath","closePath","stroke","fill","moveTo","lineTo","arcTo","arc","rect","clip","curveTo","createPattern","bezierCurveTo","createLinearGradient","createRadialGradient",'lineStyle','clear','beginFill','endFill','beginBitmapFill','linearGradientFill','radialGradientFill','drawRect','drawRoundRect','drawPath','drawCircle','drawEllipse','createPolygon','drawSVGPath','drawShape','dispose'];GraphicsVO.IS_INIT=false;class BaseObject
{constructor()
{}
set data(value)
{if(value==undefined||value==null)return;ObjectUtil.copyAttribute(this,value,true);}
toString()
{return BaseObject.name;}}
class Point
{constructor(x_=0,y_=0,z_=0)
{this.y=this.x=this.z=0;this.set(x_,y_,z_);}
set data(value)
{if(value==undefined||value==null)return;ObjectUtil.copyAttribute(this,value,true);}
get data()
{var str=this.toString();return JSON.parse(str);}
get radians()
{return Math.atan2(this.y,this.x);}
rotation(radians)
{if(radians==0)return;radians+=this.radians;let value=this.length();this.x=MathUtil.format(Math.cos(radians)*value);this.y=MathUtil.format(Math.sin(radians)*value);}
clone()
{return ObjectPool.create(Point).set(this.x,this.y,this.z);}
add(v)
{this.x+=v.x;this.y+=v.y;this.z+=(v.z||0);}
subtract(v)
{this.x-=v.x;this.y-=v.y;this.z-=v.z;return this;}
multiply(a)
{this.x*=a;this.y*=a;this.z*=a;}
offset(dx,dy,dz)
{this.x+=dx;this.y+=dy;this.z+=dz;}
abs()
{this.x=Math.abs(this.x);this.y=Math.abs(this.y);this.z=Math.abs(this.z);}
length()
{return MathUtil.format(Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z));}
normalize()
{let length=this.length();if(length<Number.MIN_VALUE){return 0.0;}
let invLength=1.0/length;this.x*=invLength;this.y*=invLength;this.z*=invLength;return MathUtil.format(length);}
min(b)
{this.x=this.x<b.x?this.x:b.x;this.y=this.y<b.y?this.y:b.y;this.z=this.z<b.z?this.z:b.z;}
max(b)
{this.x=this.x>b.x?this.x:b.x;this.y=this.y>b.y?this.y:b.y;this.z=this.z>b.z?this.z:b.z;}
set(x,y,z)
{this.x=MathUtil.format(x||0);this.y=MathUtil.format(y||0);this.z=MathUtil.format(z||0);return this;}
equals(pt)
{return(this.x==pt.x&&this.y==pt.y&&this.z==pt.z);}
toString()
{return String('{"x":'+this.x+',"y":'+this.y+',"z":'+this.z+'}');}
reset(x_=0,y_=0,z_=0)
{this.set(x_,y_,z_);}
static distance(pointA,pointB=new Point())
{return Math.hypot(pointA.x-pointB.x,pointA.y-pointB.y,(pointA.hasOwnProperty("z")&&pointB.hasOwnProperty("z")?pointA.z-pointB.z:0));}
static toPoint(str)
{if(str&&str instanceof Array&&str.length){return ObjectPool.create(Point).set(str[0],str.length>1?str[1]:0,str.length>2?str[2]:0);}
if(StringUtil.isEmpty(str))return null;str=str.toLocaleLowerCase();if(str.indexOf("x")==-1){str=StringUtil.replaceAll(str,['(',')','{','}'],['','','','']);str=str.split(",");str='{"x":'+str[0]+',"y":'+str[1]+(str.length>2?',"z":'+str[2]:'')+'}';}
else str=StringUtil.replaceAll(str,['(',')','x','y','z','='],['{','}','"x"','"y"','"z"',':']);let obj;try{obj=JSON.parse(str);}catch(e){}
return obj?ObjectPool.create(Point).set(obj.x,obj.y,obj.z):null;}
static getMiddlePoint(point1,point2)
{return new Point((point1.x+point2.x)*0.5,(point1.y+point2.y)*0.5,(point1.z+point2.z)*0.5);}
static clamp(point,min,max)
{if(min>0&&(Math.abs(point.x)<min||Math.abs(point.y)<min)){if(Math.abs(point.x)<Math.abs(point.y)){point.y=point.y*min/Math.abs(point.x);point.x=(point.x>=0?1:-1)*min;}else{point.x=point.x*min/Math.abs(point.y);point.y=(point.y>=0?1:-1)*min;}}
if(max>0&&(Math.abs(point.x)>max||Math.abs(point.y)>max)){if(Math.abs(point.x)>Math.abs(point.y)){point.y=point.y*max/Math.abs(point.x);point.x=(point.x>=0?1:-1)*max;}else{point.x=point.x*max/Math.abs(point.y);point.y=(point.y>=0?1:-1)*max;}}
return point;}
static rotate(point,center,radians,is_subtract,is_new)
{if(!point||!center||!radians)return point;let length=Point.distance(point,center);if(length==0)return point;let old=ObjectPool.create(Point).set(point.x-center.x,point.y-center.y);let posX=center.x+length*Math.cos(old.radians+radians*(is_subtract?-1:1));let posY=center.y+length*Math.sin(old.radians+radians*(is_subtract?-1:1));if(!is_new){ObjectPool.remove(old);point.x=posX;point.y=posY;}
else old.set(posX,posY);return is_new?old:point;}
static rotateLine(length,center,radians,is_subtract)
{return Point.rotate(ObjectPool.create(Point).set(center.x+length,center.y),center,radians,is_subtract);}
static scale(points,scaleX,scaleY)
{if(!points||(scaleX==1&&scaleY==1))return points;points=(points instanceof Array?points:[points]);for(let i=0,p,l=points.length;i<l;i++){p=points[i];if(!p)continue;p.x*=scaleX;p.y*=scaleY;}}
static offset(points,x,y)
{if(!points||(x==0&&y==0))return points;points=(points instanceof Array?points:[points]);for(let i=0,p,l=points.length;i<l;i++){p=points[i];if(!p)continue;p.x+=x;p.y+=y;}}
static matrix(points,data)
{if(!points||!data)return;points=(points instanceof Array?points:[points]);Point.scale(points,data.scaleX,data.scaleY);for(let i=0,p,l=points.length;i<l;i++){p=points[i];if(!p)continue;Point.rotate(p,data.center,MathUtil.getRadiansFromDegrees(data.rotation));p.x=MathUtil.format(p.x+data.x);p.y=MathUtil.format(p.y+data.y);}}
static verticalPoint(a,b,c)
{let a1=b.y-a.y;let b1=a.x-b.x;let c1=b.x*a.y-a.x*b.y;if((a1*c.x+b1*c.y)==-c1)return c;if(b.y==a.y)return ObjectPool.create(Point).set(c.x,a.y);let k=(a.x-b.x)/(b.y-a.y);let a2=k;let b2=-1;let c2=(c.y-k*c.x);let z=a1*b2-a2*b1;let x=(b1*c2-b2*c1)/z;let y=(a2*c1-a1*c2)/z;return ObjectPool.create(Point).set(x,y);}
static interval(a,b,d,on_line)
{if(!on_line){return(d.x>=Math.min(a.x,b.x)&&d.x<=Math.max(a.x,b.x)&&d.y>=Math.min(a.y,b.y)&&d.y<=Math.max(a.y,b.y));}
let a1=b.y-a.y;let b1=a.x-b.x;let c1=a.x*b.y-b.x*a.y;return(a1*d.x+b1*d.y)==c1;}}
class Rectangle
{constructor(x_=0,y_=0,width_=0,height_=0)
{this.x=this.y=this.width=this.height=0;this.set(x_,y_,width_,height_);}
get data()
{var str=this.toString();return JSON.parse(str);}
set data(value)
{if(value==undefined||value==null)return;this.set(value.x,value.y,value.width,value.height);}
get topLeft()
{return new Point(this.x,this.y);}
get bottomRight()
{return new Point(this.x+this.width,this.y+this.height);}
get right()
{return this.x+this.width;}
get bottom()
{return this.y+this.height;}
set(x,y,width,height)
{this.x=MathUtil.format(x||0);this.y=MathUtil.format(y||0);this.width=Math.abs(MathUtil.format(width||0));this.height=Math.abs(MathUtil.format(height||0));return this;}
move(offset,y)
{this.x=MathUtil.format(y==undefined?offset.x:offset+this.x);this.y=MathUtil.format(y==undefined?offset.y:y+this.y);return this;}
add(rect)
{this.x=MathUtil.format(rect.x+this.x);this.y=MathUtil.format(rect.y+this.y);this.width=MathUtil.format(rect.width+this.width);this.height=MathUtil.format(rect.height+this.height);}
multiply(ratioX,ratioY)
{ratioX=Math.abs(ratioX);ratioY=Math.abs(ratioY||ratioX);this.x=MathUtil.format(this.x*ratioX);this.y=MathUtil.format(this.y*ratioY);this.width=MathUtil.format(this.width*ratioX);this.height=MathUtil.format(this.height*ratioY);}
contains(p,y)
{if(p==null)return false;if(p instanceof Point)
return this.x<=p.x&&this.y<=p.y&&p.x<=this.right&&p.y<=this.bottom;else if(p instanceof Rectangle)
return this.x<=p.x&&this.y<=p.y&&p.right<=this.right&&p.bottom<=this.bottom;else if(y!=undefined)
return this.x<=p&&this.y<=y&&p<=this.right&&y<=this.bottom;return false;}
intersects(r)
{return this.x<=r.x+r.width&&this.y<=r.y+r.height&&r.x<=this.x+this.width&&r.y<=this.y+this.height;}
intersection(r)
{if(!this.intersects(r))return new Rectangle();let max_x=Math.max(this.x,r.x);let max_y=Math.max(this.y,r.y);let min_w=Math.min(this.x+this.width,r.x+r.width)-max_x;let min_h=Math.min(this.y+this.height,r.y+r.height)-max_y;return new Rectangle(max_x,max_y,min_w,min_h);}
getPoints(reflectionX,reflectionY)
{let offsetX=(reflectionX?-1:1),offsetY=(reflectionY?-1:1);return[new Point(this.x,this.y),new Point(this.x+this.width*offsetX,this.y),new Point(this.x+this.width*offsetX,this.y+this.height*offsetY),new Point(this.x,this.y+this.height*offsetY)];}
rotation(radians,point,offset,reflectionX,reflectionY)
{point=(point?point:new Point());let array=this.getPoints(reflectionX,reflectionY);let sin,cos,i,r,l;for(i=0;i<array.length;i++){array[i].subtract(point);l=array[i].length();r=array[i].radians;sin=Math.sin(r+radians);cos=Math.cos(r+radians);array[i].x=point.x+l*cos+(offset?offset.x:0);array[i].y=point.y+l*sin+(offset?offset.y:0);}
return array;}
union(r,n=true)
{var min_x=Math.min(this.x,r.x);var min_y=Math.min(this.y,r.y);var max_w=Math.max(this.x+this.width,r.x+r.width)-min_x;var max_h=Math.max(this.y+this.height,r.y+r.height)-min_y;if(n)return new Rectangle(min_x,min_y,max_w,max_h);this.x=min_x;this.y=min_y;this.width=max_w;this.height=max_h;return this;}
clone()
{return new Rectangle(this.x,this.y,this.width,this.height);}
reset(x_=0,y_=0,width_=0,height_=0)
{this.set(x_,y_,width_,height_);}
toArray(b)
{return[this.x,this.y,b?this.right:this.width,b?this.bottom:this.height];}
toString()
{return'{"x":'+this.x+',"y":'+this.y+',"width":'+this.width+',"height":'+this.height+'}';}
static toRectangle(str)
{if(StringUtil.isEmpty(str))return null;str=str.toLowerCase();if(!StringUtil.exist(str,"x","y","w","h",":","=")){str=StringUtil.replaceAll(str,['(',')','{','}'],["","","",""]);let array=str.split(",");return(array.length<4)?null:new Rectangle(Number(array[0]),Number(array[1]),Number(array[2]),Number(array[3]));}
str=StringUtil.replaceAll(str,['(',')'],['{','}']);str=(str.indexOf('height')==-1)?StringUtil.replace(str,'h','height'):str;str=(str.indexOf('width')==-1)?StringUtil.replace(str,'w','width'):str;str=(!StringUtil.exist(str,'"',"'",":"))?StringUtil.replaceAll(str,['=','x','y','width','height'],[':','"x"','"y"','"width"','"height"']):str;let obj;try{obj=JSON.parse(str);}catch(e){}
return obj?ObjectUtil.copyAttribute(new Rectangle(),obj,true):null;};static getRectanglePoint(rect,percentX,percentY)
{percentX=percentX||0.5;percentY=percentY||0.5;return rect?new Point(MathUtil.format(rect.x+rect.width*percentX),MathUtil.format(rect.y+rect.height*percentY)):null;};static setRectangleCenter(rect,center,percentX,percentY)
{if(rect==null||center==null)return;percentX=percentX||0.5;percentY=percentY||0.5;rect.x=MathUtil.format(center.x-rect.width*percentX);rect.y=MathUtil.format(center.y-rect.height*percentY);};static innerPoint(rect,point)
{if(rect==null||point==null)return;point.x=MathUtil.clamp(point.x,rect.x,rect.right);point.y=MathUtil.clamp(point.y,rect.y,rect.bottom);return point;}
static createRectangle(posA,posB,posC,posD)
{posC=posC||posA;posD=posD||posB;var minX=Math.min(posA.x,posB.x,posC.x,posD.x);var maxX=Math.max(posA.x,posB.x,posC.x,posD.x);var minY=Math.min(posA.y,posB.y,posC.y,posD.y);var maxY=Math.max(posA.y,posB.y,posC.y,posD.y);return{x:minX,y:minY,width:maxX-minX,height:maxY-minY};}
static rectangleByRadians(rect,radians,point,offset,reflectionX,reflectionY)
{let points=rect.rotation(radians,point,offset,reflectionX,reflectionY);ObjectUtil.copyAttribute(points,Rectangle.createRectangle(points[0],points[1],points[2],points[3]));return points;}
static getPointsBounds(points)
{if(!points||!points.length)return null;let[minX,minY,maxX,maxY]=[0,0,0,0];let isArray=(points[0]instanceof Array);for(let i=0,p,l=points.length;i<l;i++){p=points[i];if(StringUtil.isEmpty(p)||(isArray?!p.length:!p.hasOwnProperty("x")))continue;if(i==0){minX=maxX=(minX,isArray?parseFloat(p[0]):p.x);minY=maxY=(maxY,isArray?parseFloat(p[1]):p.y);continue;}
minX=Math.min(minX,isArray?parseFloat(p[0]):p.x);minY=Math.min(minY,isArray?parseFloat(p[1]):p.y);maxX=Math.max(maxX,isArray?parseFloat(p[0]):p.x);maxY=Math.max(maxY,isArray?parseFloat(p[1]):p.y);}
return{x:minX,y:minY,width:maxX-minX,height:maxY-minY};}}
class Matrix
{constructor(a=1,b=0,c=0,d=1,tx=0,ty=0)
{this.a=this.d=1;this.b=this.c=this.tx=this.ty=0;this.setup(a,b,c,d,tx,ty);}
get data()
{return JSON.parse(this.toString());}
set data(value)
{if(value==undefined||value==null)return;ObjectUtil.copyAttribute(this,value,true);}
setup(a,b,c,d,tx,ty)
{this.a=a!=undefined?a:1;this.b=b!=undefined?b:0;this.c=c!=undefined?c:0;this.d=d!=undefined?d:1;this.tx=tx!=undefined?tx:0;this.ty=ty!=undefined?ty:0;return this;}
concatTransform(posX,posY,scaleX,scaleY,rotation,regX,regY,skewX,skewY)
{let cos=1,sin=0;if(rotation%360!=0)
{cos=MathUtil.cos(rotation);sin=MathUtil.sin(rotation);}
if(regX!=0)this.tx-=regX;if(regY!=0)this.ty-=regY;if(skewX||skewY){this.prepend(cos*scaleX,sin*scaleX,-sin*scaleY,cos*scaleY,0,0);this.prepend(MathUtil.cos(skewY),MathUtil.sin(skewY),-MathUtil.sin(skewX),MathUtil.cos(skewX),posX,posY);}
else this.prepend(cos*scaleX,sin*scaleX,-sin*scaleY,cos*scaleY,posX,posY);}
prepend(a,b,c,d,tx,ty)
{let tx1=this.tx;if(a!=1||b!=0||c!=0||d!=1){let a1=this.a;let c1=this.c;this.a=a1*a+this.b*c;this.b=a1*b+this.b*d;this.c=c1*a+this.d*c;this.d=c1*b+this.d*d;}
this.tx=tx1*a+this.ty*c+tx;this.ty=tx1*b+this.ty*d+ty;return this;}
append(a,b,c,d,tx,ty)
{let a1=this.a;let b1=this.b;let c1=this.c;let d1=this.d;if(a!=1||b!=0||c!=0||d!=1){this.a=a*a1+b*c1;this.b=a*b1+b*d1;this.c=c*a1+d*c1;this.d=c*b1+d*d1;}
this.tx=tx*a1+ty*c1+this.tx;this.ty=tx*b1+ty*d1+this.ty;return this;}
concat(m)
{let ma=m.a;let mb=m.b;let mc=m.c;let md=m.d;let tx1=this.tx;let ty1=this.ty;if(ma!=1||mb!=0||mc!=0||md!=1){let a1=this.a;let b1=this.b;let c1=this.c;let d1=this.d;this.a=a1*ma+b1*mc;this.b=a1*mb+b1*md;this.c=c1*ma+d1*mc;this.d=c1*mb+d1*md;}
this.tx=tx1*ma+ty1*mc+m.tx;this.ty=tx1*mb+ty1*md+m.ty;return this;}
rotate(angle)
{let cos=Math.cos(angle);let sin=Math.sin(angle);let a=this.a;let c=this.c;let tx=this.tx;this.a=a*cos-this.b*sin;this.b=a*sin+this.b*cos;this.c=c*cos-this.d*sin;this.d=c*sin+this.d*cos;this.tx=tx*cos-this.ty*sin;this.ty=tx*sin+this.ty*cos;return this;}
scale(sx,sy)
{this.a*=sx;this.d*=sy;this.tx*=sx;this.ty*=sy;return this;}
translate(dx,dy)
{this.tx+=dx;this.ty+=dy;return this;}
invert()
{let a=this.a;let b=this.b;let c=this.c;let d=this.d;let tx=this.tx;let i=a*d-b*c;this.a=d/i;this.b=-b/i;this.c=-c/i;this.d=a/i;this.tx=(c*this.ty-d*tx)/i;this.ty=-(a*this.ty-b*tx)/i;return this;}
transformPoint(point,round,returnNew)
{let x=point.x*this.a+point.y*this.c+this.tx;let y=point.x*this.b+point.y*this.d+this.ty;if(round)
{x=x+0.5>>0;y=y+0.5>>0;}
if(returnNew)return new Point(x,y);point.x=x;point.y=y;return point;}
applyDisplay(target)
{if(target==undefined)target={};let mSkewX=Math.atan(-this.c/this.d);let mSkewY=Math.atan(this.b/this.a);target.x=this.tx;target.y=this.ty;target.scaleX=(mSkewY>-Matrix.PI_Q&&mSkewY<Matrix.PI_Q)?this.a/Math.cos(mSkewY):this.b/Math.sin(mSkewY);target.scaleY=(mSkewX>-Matrix.PI_Q&&mSkewX<Matrix.PI_Q)?this.d/Math.cos(mSkewX):-this.c/Math.sin(mSkewX);target.rotation=MathUtil.isEquivalent(mSkewX,mSkewY)?MathUtil.getDegreesFromRadians(mSkewX):0;return target;}
clone()
{return ObjectPool.create(Matrix).setup(this.a,this.b,this.c,this.d,this.tx,this.ty);}
toString()
{return'{"a":'+this.a+',"b":'+this.b+',"c":'+this.c+',"d":'+this.d+',"tx":'+this.tx+',"ty":'+this.ty+"}";}
toCSS()
{return"matrix("+this.a+","+this.b+","+this.c+","+this.d+","+this.tx+","+this.ty+")";}
reset(a=1,b=0,c=0,d=1,tx=0,ty=0)
{return this.setup(a,b,c,d,tx,ty);}
dispose()
{delete this.a,this.b,this.c,this.d,this.tx,this.ty;}}
Matrix.PI_Q=Math.PI/4.0;class Global
{static setup(n)
{if(StringUtil.isEmpty(n))return;n=n.toLowerCase();if(n.indexOf(SystemType.OS_IPHONE)>0){Global.os=SystemType.OS_IPHONE;Global.ios=true;}else if(n.indexOf(SystemType.OS_IPOD)>0){Global.os=SystemType.OS_IPOD;Global.ios=true;}else if(n.indexOf(SystemType.OS_IPAD)>0){Global.os=SystemType.OS_IPAD;Global.ios=true;}else if(n.indexOf(SystemType.OS_ANDROID)>0){Global.os=SystemType.OS_ANDROID;Global.android=true;Global.isBrokenAndroid=(n.match(/android 2\.[12]/)!==null);}else if(n.indexOf(SystemType.OS_WINDOWS_PHONE)>0){Global.os=SystemType.OS_WINDOWS_PHONE;}else if(n.indexOf(SystemType.OS_BLACK_BERRY)>0){Global.os=SystemType.OS_BLACK_BERRY;}
Global.isPC=(Global.os==SystemType.OS_PC);Global.isQQBrowser=(/qqbrowser/i).test(n);Global.isWebKit=(/webkit/i).test(n);Global.isOpera=(/opera/i).test(n);Global.isIE=(/msie/i).test(n);Global.isFirefox=(/firefox/i).test(n);Global.isChrome=(/chrome/i).test(n);Global.isSafari=(/safari/i).test(n)&&!Global.isChrome;Global.isWeixin=(n.match(/MicroMessenger/i)=="micromessenger");Global.cssPrefix=Global.isWebKit?"webkit":Global.isFirefox?"Moz":Global.isOpera?"o":Global.isIE?"ms":"";Global.supportStorage="localStorage"in Global.root;Global.supportOrientation="orientation"in Global.root;Global.supportDeviceMotion="ondevicemotion"in Global.root;Global.supportTouch="ontouchstart"in Global.root;Global.canUseWebAudio=(Global.root["AudioContext"]||Global.root[Global.cssPrefix+"AudioContext"]);Global.animationFrame=(Global.root["requestAnimationFrame"]||Global.root[Global.cssPrefix+"RequestAnimationFrame"]);if(Global.animationFrame)Global.animationFrame=Global.root[Global.animationFrame.name].bind(Global.root);Global.supportCanvas=document.createElement("canvas").getContext!=null;Global.useCanvas=Global.supportCanvas;var testElem=document.createElement("div");Global.supportTransform=(testElem.style[Global.cssPrefix+"Transform"]!=undefined);Global.supportSVG=(!!document.createElementNS&&!!document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect);Global.language=navigator.language||navigator.browserLanguage||navigator.systemLanguage||navigator.userLanguage||"";if(!StringUtil.isEmpty(Global.language))WordUtil.language=WordUtil.format(Global.language);ContextVO.INIT_CLASS();GraphicsVO.INIT_CLASS();}
static reszie(w,h)
{Global.width=Math.floor(w);Global.height=Math.floor(h);if(Stage.current){Stage.current.size(w,h);Stage.current.auto_fresh=true;}}
static getScreenWidth()
{return Global.root.screen.width;}
static getScreenHeight()
{return Global.root.screen.height;}
static GetQueryString(name)
{let reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");let r=Global.root.location.search.substr(1).match(reg);if(r!=null)return unescape(r[2]);return null;}
static trace()
{if(!Global.debug)return;let str="";let i;for(i=0;i<arguments.length;i++){str+=arguments[i]+" ";}
if(console!=undefined&&typeof console.log=="function"&&!Global.htmlDebug){console.log(str);}else{if(Global.output==undefined){Global.output=document.createElement("div");Global.output.id="global_output";Global.output.style.position="absolute";Global.output.style.zIndex=Global.layer+10;Global.output.style.height=Math.ceil((Global.canvas?Global.canvas.height:Global.root.innerHeight)*0.5)+"px";Global.output.style.width=Math.ceil((Global.canvas?Global.canvas.width:Global.root.innerWidth)*0.5)+"px";Global.output.style.fontSize=Global.fontSize+"px";Global.output.style.color="#880000";Global.output.style.left="3px";}
if(Global.output_list==undefined)Global.output_list=[];Global.output_list.push("<br>"+str+"</br>");if(Global.output_list.length>12)Global.output_list.shift();Global.output.innerHTML=Global.output_list.join(" ");if(Global.output.parentNode==undefined){if(Global.div){Global.div.appendChild(Global.output);}else{document.body.appendChild(Global.output);}}}}
static proxy(o,t,p,d)
{o[p]=function()
{return t[p].apply(t,arguments)||o;}
d&&(o[d]=o[p]);}
static delegate(func,self)
{let context=self||Global.root;if(arguments.length>2)
{let args=Array.prototype.slice.call(arguments,2);return function()
{let newArgs=Array.prototype.concat.apply(args,arguments);return func.apply(context,newArgs);};}else
{return function(){return func.apply(context,arguments);};}};static delegate2(func,self)
{let context=self||Global.root;let args=arguments.length>2?Array.prototype.slice.call(arguments,2):[];return function()
{let newArgs=args.slice();for(let i=arguments.length-1;i>=0;i--)
newArgs.unshift(arguments[i]);newArgs.push(this);return func.apply(context,newArgs);};};static gc(obj)
{let type=ClassUtil.getQualifiedClassName(obj);if(Global._gc_list.indexOf(type)<0)return false;return ObjectPool.remove(obj);}
static get local()
{if(Global.__local)return Global.__local;let local=Global.root.localStorage;local=(local==undefined||local==null)?Global.root.sessionStorage:local;if(local==undefined||local==null){if(Global.__local_cache==undefined)Global.__local_cache=Object.create(null);local=Global.__local_cache;}
Global.__local=new StorageObject(local);return Global.__local;}
static get root()
{if(Global.__root)return Global.__root;if(typeof self!=='undefined'){Global.__root=self;return self;}
if(typeof window!=='undefined'){Global.__root=window;return window;}
if(typeof global!=='undefined'){Global.__root=global;return global;}
throw new Error('unable to locate global object');}}
Global._gc_list=["Event","StageEvent","Shape","DisplayObjectContainer","Graphics","DisplayObject","DOMDisplay","MovieClip","DOMMovie","BoxShape"];Global.__local=Global.__local_cache=Global.__root=Global.canvas=Global.context=null;Global.layer=5;Global.debug=true;Global.os=SystemType.OS_PC;Global.ios=false;Global.android=false;Global.isBrokenAndroid=false;Global.isIE=false;Global.isFirefox=false;Global.isOpera=false;Global.isWebKit=false;Global.isChrome=false;Global.isSafari=false;Global.isQQBrowser=false;Global.aspectRatio=SystemType.NONE;Global.font="Helvetica,Arial";Global.supportSVG=false;Global.supportTouch=false;Global.supportCanvas=false;Global.supportStorage=false;Global.supportOrientation=false;Global.supportDeviceMotion=false;Global.supportTransform=false;Global.cssPrefix="";Global.htmlDebug=false;Global.breakTouch=false;Global.language;Global.div;Global.fontSize=8;Global.useCanvas=true;Global.width=0;Global.height=0;Global.position="absolute";Global.autoShapeSize=true;Global.canUseWebAudio=false;Global.isWeixin=false;Global.useCache=true;Global.isPC=true;Global.animationFrame=null;Global.setup(navigator.userAgent);if(Global.root&&Global.root.trace==undefined)Global.root.trace=Global.trace;class BitmapFont extends BaseObject
{constructor()
{super();this.name;this.info={};this.common={};this.chars,this.pages,this.images;}
dispose()
{if(this.chars&&this.chars.length>0){let i,l;for(i=0,l=this.chars.length;i<l;i++){ObjectPool.remove(this.chars[i]);}}
delete this.name,this.info,this.common,this.chars,this.pages,this.images;}}
class Event
{constructor(type,params=null,label=null,target=null)
{this.type=type;this.label=label;this.params=params;this.target=target;}
clone()
{return new Event(this.type,this.params,this.label,this.target);}
reset(type=null,params=null,label=null,target=null)
{this.type=type;this.label=label;this.params=params;this.target=target;}
dispose()
{delete this.type,this.target,this.params,this.label;}
toString()
{return'{"type":'+this.type+',label":'+this.label?this.label.toString():''+',"target":'+this.target?this.target.toString():''+',"params":'+this.params?this.params.toString():''+'}';}}
Event.PLAY_OVER="play_over";Event.COMPLETE="complete";Event.RESIZE="resize";Event.ERROR="error";Event.CLOSE="close";Event.INIT="init";class EventDispatcher
{constructor()
{this.caches=null;this.listeners={};}
reset()
{this.caches=null;this.listeners={};}
hasEventListener(eventType,id)
{if(!StringUtil.isEmpty(id)&&this.caches){return(this.caches[eventType+"#"+id]!=undefined);}
return(this.listeners&&this.listeners[eventType]!=undefined);}
addEventListener(eventType,func,id)
{if(!(typeof eventType==="string"&&typeof func==="function"))return;if(!StringUtil.isEmpty(id)&&this.hasEventListener(eventType,id))return;if(this.listeners[eventType]==undefined)this.listeners[eventType]=[];if(this.listeners[eventType].indexOf(func)==-1)this.listeners[eventType].push(func);if(id){this.caches=this.caches||{};this.caches[eventType+"#"+id]=func;}}
removeEventListener(eventType,func,id=null)
{if(this.listeners==undefined||this.listeners[eventType]==undefined)return;if(func==undefined){if(StringUtil.isEmpty(id)||this.caches==undefined){this._remove_listeners(eventType);return;}
func=this.caches[eventType+"#"+id];delete this.caches[eventType+"#"+id];}
if(typeof func!=="function")return;let len=this.listeners[eventType].length;for(let i=0;i<len;i++)
{let sub_func=this.listeners[eventType][i];if(sub_func==func){this.listeners[eventType].splice(i,1);len--;i--;break;}}
if(this.listeners[eventType].length==0)this._remove_listeners(eventType);}
_remove_listeners(type)
{delete this.listeners[type];if(this.caches==undefined)return;for(let i in this.caches){if(i.indexOf(type)==0)delete this.caches[i];}}
dispatchEvent(eventObj)
{var list=this.listeners;if(eventObj==undefined||!eventObj.hasOwnProperty("type")||list==undefined||list[eventObj.type]==undefined){if(eventObj&&!Global.gc(eventObj))eventObj.dispose();return false;}
let listener;var map=list[eventObj.type].slice();if(eventObj.target==null)eventObj.target=this;for(listener of map)listener.call(this,eventObj);if(!Global.gc(eventObj))eventObj.dispose();return true;}
dispose()
{this.caches=null;if(this.listeners==undefined)return;for(let type in this.listeners)delete this.listeners[type];delete this.listeners,this.caches;}
toString()
{return'{"listeners":'+ObjectUtil.toString(this.listeners)+'}';}
static instance()
{EventDispatcher._current_instance=EventDispatcher._current_instance||new EventDispatcher();return EventDispatcher._current_instance;}}
EventDispatcher._current_instance=null;class MovieManager
{static addSources(sources)
{if(sources==null||sources.length<1)return;let i,len,source;var asset=[];for(i=0,len=sources.length;i<len;i++){source=sources[i];if(source.width==0){asset.push(source);continue;}
if(!MovieManager._dic.hasOwnProperty(source.animation)){MovieManager._dic[source.animation]=StringUtil.isEmpty(source.label)?[]:{};MovieManager._cache[source.animation]=[];}
if(!StringUtil.isEmpty(source.label)&&!(MovieManager._dic[source.animation]).hasOwnProperty(source.label)){(MovieManager._dic[source.animation])[source.label]=[];MovieManager._cache[source.animation].push(source.label);}
(!StringUtil.isEmpty(source.label)?(MovieManager._dic[source.animation])[source.label]:MovieManager._dic[source.animation]).push(source);}
if(asset.length>0)AssetManager.addSources(asset);}
static getInstance(label,animation,dom,length,begin)
{let mc=Factory.c("mc",null,dom);let frames=MovieManager.getData(label,animation);if(length!=undefined||begin!=undefined){length=(length==null)?frames.length:Math.min(frames.length,Math.abs(length));begin=(begin==null)?0:MathUtil.clamp(begin,0,length);frames=frames.slice(begin,length);}
mc.setFrames(frames);return mc;}
static getData(label,animation)
{animation=animation||"";if(!StringUtil.isEmpty(label)&&!StringUtil.isEmpty(animation)&&MovieManager._dic.hasOwnProperty(animation))
return(MovieManager._dic[animation])[label];animation=StringUtil.isEmpty(animation)?"":animation;let temp=MovieManager._dic[animation];if(temp==null||temp instanceof Array)return temp;label=StringUtil.isEmpty(label)?ObjectUtil.getLabels(temp)[0]:label;var datas=MovieManager._dic[animation][label];if(datas==undefined||datas==null)return null;return datas;}
static findData(label,animation)
{if(StringUtil.isEmpty(label)&&StringUtil.isEmpty(animation))return null;let source=MovieManager.getData(label,animation);if(source)return source;var labels=StringUtil.getNumber(label);if(!labels||labels.length<1)return null;source=MovieManager.getData(labels[0],animation);if(!source)return null;for(let asset of source){if(asset.name==label)return asset;}
return null;}
static removeData(label,animation)
{animation=animation||"";if(!StringUtil.isEmpty(label)&&!StringUtil.isEmpty(animation)){delete(MovieManager._dic[animation])[label];return;}
animation=StringUtil.isEmpty(animation)?ObjectUtil.getLabels(MovieManager._cache)[0]:animation;var temp=MovieManager._dic[animation];if(temp==undefined)return;if(StringUtil.isEmpty(label)){delete MovieManager._dic[animation];delete MovieManager._cache[animation];return;}
delete(MovieManager._dic[animation])[label];}
static clear()
{MovieManager._dic={};MovieManager._cache={};}}
MovieManager._dic={}
MovieManager._cache={}
class DropShadowFilter
{constructor(distance=0,angle=0,blur=0,color="#000000",alpha=1,radius=0)
{this.shadowColor=ColorUtil.formatColor(color);this.distance=distance;this.shadowBlur=blur;this.radius=radius;this.angle=angle;this.alpha=alpha;this.setShadowOffset();}
setDistance(distance)
{this.distance=distance;this.setShadowOffset();}
setShadowOffset()
{var r=MathUtil.getRadiansFromDegrees(this.angle);this.shadowOffsetX=MathUtil.format(this.distance*Math.cos(r));this.shadowOffsetY=MathUtil.format(this.distance*Math.sin(r));}
show(context)
{let text_type;if(context==undefined||this.alpha==0||(this.distance==0&&this.shadowBlur==0)){if(context&&!(context instanceof CanvasRenderingContext2D)){text_type=ClassUtil.getQualifiedClassName(context);context.style[(text_type=="HTMLSpanElement"||text_type=="HTMLParagraphElement"||text_type=="HTMLInputElement"||text_type=="HTMLTextAreaElement")?'textShadow':Global.cssPrefix+'BoxShadow']="";}
return;}
let color=(this.alpha<1)?ColorUtil.colorToRGBA(this.shadowColor,this.alpha):this.shadowColor;text_type=ClassUtil.getQualifiedClassName(context);if(context instanceof CanvasRenderingContext2D){if(this.distance==0&&this.shadowBlur==0)return;context.shadowOffsetX=this.shadowOffsetX;context.shadowOffsetY=this.shadowOffsetY;context.shadowBlur=this.shadowBlur;context.shadowColor=color;}
else{let text_bool=(text_type=="HTMLSpanElement"||text_type=="HTMLParagraphElement"||text_type=="HTMLInputElement"||text_type=="HTMLTextAreaElement");if(text_type=="SVGSVGElement"){let text=context.getElementsByTagName("text");if(text&&text.length>0)text_bool=true;}
let shadow_property=(text_bool?'textShadow':Global.cssPrefix+'BoxShadow');if(!text_bool)context.style[Global.cssPrefix+"BorderRadius"]=this.radius+'px';context.style[shadow_property]=this.shadowOffsetX+'px '+this.shadowOffsetY+'px '+this.shadowBlur+'px '+color;}}
clone()
{return new DropShadowFilter(this.distance,this.angle,this.shadowBlur,this.shadowColor,this.alpha,this.radius);}
toString()
{return'{"shadowColor":"'+this.shadowColor+'","distance":'+this.distance+',"shadowBlur":'+this.shadowBlur+',"radius":'+this.radius+',"angle":'+this.angle+',"alpha":'+this.alpha+'}';}}
class AssetManager
{static addFiles(files)
{if(files==null)return;let i,f,x,s,j,b;for(i in files){f=files[i];j=i.split("@")[0];if(f==undefined)continue;if(f instanceof Image){if(files.hasOwnProperty(j+"@xml")||files.hasOwnProperty(j+"@json")){b=files.hasOwnProperty(j+"@xml");x=files[j+(b?"@xml":"@json")];if(x==undefined){AssetManager._cache[i]=f;continue;}
s=AssetUtil.parseSheet(f,x,b);if(s==undefined||s.length<=0){AssetManager._cache[i]=f;continue;}
if(b){if(AssetManager._cache.hasOwnProperty(j+"@xml")){delete AssetManager._cache[j+"@xml"];}}
else{if(AssetManager._cache.hasOwnProperty(j+"@json")){delete AssetManager._cache[j+"@json"];}}
if(s[0].width>0)MovieManager.addSources(s);else AssetManager.addSources(s);}
else AssetManager._cache[i]=f;}
else if(String(i.split("@")[1]).toLowerCase()=="fnt"){s=AssetUtil.parseFont(f);if(s==undefined)continue;FontManager.add(s);}
else if(f instanceof URLLoader){AssetManager._cache[i]=f.content;}
else AssetManager._cache[i]=f;}}
static addSources(sources)
{if(sources==null||sources.length<1)return;let i,len,source;var movie=[];for(i=0,len=sources.length;i<len;i++){source=sources[i];if(source==undefined||!(source instanceof Source))continue;if(source.width>0){movie.push(source);continue;}
AssetManager._cache[source.name]=source;}
if(movie.length>0)MovieManager.addSources(movie);}
static getSource(label,clone)
{let source=AssetManager._cache[label];if(!source){source=MovieManager.findData(label);source=(source&&source.length==1)?source[0]:source;return source;}
if((clone||!Global.useCanvas)&&source){if(source instanceof Image)source=AssetManager.__clone_image(source);else if(source instanceof Source){source=source.clone();source.image=AssetManager.__clone_image(source.image);}}
return source;}
static __clone_image(img)
{let temp=ObjectPool.create(Image);temp.src=img.src;temp.width=img.width;temp.height=img.height;return temp;}
static removeSource(label)
{if(!AssetManager._cache.hasOwnProperty(label))return;if(typeof AssetManager._cache[label].dispose=="function")AssetManager._cache[label].dispose();delete AssetManager._cache[label];}
static clear()
{AssetManager._cache={};}}
AssetManager._cache={};class Address extends EventDispatcher
{constructor()
{super();this.name="address_handler";this._target=this._onHashChange=this._value=null;}
get target()
{return this._target;}
set target(value)
{if(value&&value==this._target)return;if(this._onHashChange==undefined){this._onHashChange=Global.delegate(this._hashChangeHandler,this);}
if(this._target){this._target.removeEventListener("hashchange",this._onHashChange);}
this._target=value;if(value==undefined)return;this._target.addEventListener("hashchange",this._onHashChange);}
_hashChangeHandler()
{let str=Global.root.location.hash.replace("#","");if(str==this._value)return;this._value=str;this.dispatchEvent(Factory.c("ev",[Address.CHANGE,this._value]));}
dispose()
{super.dispose();this.target=null;this._onHashChange=this._value=null;delete this._target,this._onHashChange,this._value,this.name;}
static getInstance()
{if(Address._instance)return Address._instance;Address._instance=new Address();Address._instance.target=Global.root;return Address._instance;}}
Address.CHANGE="addressValueChange";Address._instance=null;class BlendMode{}
BlendMode.SOURCE_OVER="source-over";BlendMode.SOURCE_ATOP="source-atop";BlendMode.SOURCE_IN="source-in";BlendMode.SOURCE_OUT="source-out";BlendMode.DESTINATION_OVER="destination-over";BlendMode.DESTINATION_ATOP="destination-atop";BlendMode.DESTINATION_IN="destination-in";BlendMode.DESTINATION_OUT="destination-out";BlendMode.LIGHTER="lighter";BlendMode.DARKER="darker";BlendMode.COPY="copy";BlendMode.XOR="xor";BlendMode.NONE=null;class ColorTransform
{constructor(redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier,redOffset,greenOffset,blueOffset,alphaOffset)
{this.redMultiplier=redMultiplier;this.greenMultiplier=greenMultiplier;this.blueMultiplier=blueMultiplier;this.alphaMultiplier=alphaMultiplier;this.redOffset=redOffset;this.greenOffset=greenOffset;this.blueOffset=blueOffset;this.alphaOffset=alphaOffset;this._update=true;}
get update()
{let bool=this._update;if(this._update)this._update=false;return bool;}
set update(value)
{if(this._update==value)return;this._update=value;}
setColor(color,add=0)
{color=ColorUtil.toColor(color);this.redMultiplier=this.greenMultiplier=this.blueMultiplier=this.alphaMultiplier=add;this.redOffset=ColorUtil.getRed(color);this.greenOffset=ColorUtil.getGreen(color);this.blueOffset=ColorUtil.getBlue(color);this.alphaOffset=ColorUtil.getAlpha(color);this._update=true;}
toString()
{return'{"redOffset":'+this.redOffset+',"greenOffset":'+this.greenOffset+',"blueOffset":'+this.blueOffset+',"alphaOffset":'+this.alphaOffset+',"redMultiplier":'+this.redMultiplier+',"greenMultiplier":'+this.greenMultiplier+',"blueMultiplier":'+this.blueMultiplier+',"alphaMultiplier":'+this.alphaMultiplier+'}';}}
class FontManager
{static add(font)
{if(font==undefined||font==null)return;FontManager.remove(font.name);FontManager._cache[font.name]=font;}
static remove(name)
{if(!FontManager._cache.hasOwnProperty(name))return;FontManager._cache[name].dispose();delete FontManager._cache[name];}
static has(name)
{return(!StringUtil.isEmpty(name)&&FontManager._cache[name]!=undefined);}
static get(name,charCode)
{if(StringUtil.isEmpty(name)){for(name in FontManager._cache)break;}
if(StringUtil.isEmpty(name))return null;if(charCode==undefined||charCode<0)return FontManager._cache[name];return FontManager._cache[name].chars[charCode];}
static clear()
{let i;for(i in FontManager._cache){FontManager._cache[i].dispose();delete FontManager._cache[i];}}}
FontManager._cache={};class RenderObject
{constructor()
{this.canvas=this.context=null;CanvasUtil.create(this);RenderObject.COUNT++;}
setSize(w,h)
{if(w==0||h==0)return;this.canvas.width=MathUtil.int(Math.abs(w));this.canvas.height=MathUtil.int(Math.abs(h));}
clear()
{this.context.clearRect(0,0,this.canvas.width,this.canvas.height);this.context.restore();}
reset()
{if(this.canvas.parentNode){this.canvas.parentNode.removeChild(this.canvas);}
this.clear();}
dispose()
{reset();RenderObject.COUNT--;this.canvas=this.context=null;}
static get instance()
{if(RenderObject.COUNT>=RenderObject.MAX&&ObjectPool.length('RenderObject')<1)return null;return ObjectPool.create(RenderObject);}}
RenderObject.COUNT=0;RenderObject.MAX=50;class Timer extends EventDispatcher
{constructor(r)
{super();this._start_time=0;this._is_start=false;this._interval_id=null;this._frame_rate=(r?r:Math.ceil(1000/Timer.fps));this.__handler=Global.delegate(this._onTimeHandler,this);}
setFrameRate(rate)
{this._frame_rate=rate;if(this._is_start)this.start();}
getFrameRate()
{return this._frame_rate;}
isStart()
{return this._is_start;}
_onTimeHandler()
{this.dispatchEvent(Factory.c("ev",[Timer.TIME]));}
start()
{if(this._frame_rate<=0)return;if(this._interval_id!=null)clearInterval(this._interval_id);this._interval_id=setInterval(this.__handler,this._frame_rate);this._start_time=(new Date()).getTime();this._is_start=true;}
stop()
{if(this._interval_id!=null)clearInterval(this._interval_id);this._interval_id=null;this._is_start=false;this._start_time=0;}
dispose()
{super.dispose();this.stop();delete this._start_time,this._interval_id,this._frame_rate,this._is_start;}
toString()
{return Timer.name;}
static delayCall(second,callback,params=[],target=null,id=null)
{if(second<=0||callback==undefined)return;if(id)clearTimeout(id);return setTimeout(()=>callback.apply(target,params),1000*second);}}
Timer.TIME="timer_count";Timer.fps=60;class Source
{constructor(img=null,obj=null)
{this.x=this.y=this.regX=this.regY=this.index=this.width=this.height=this.frame_width=this.frame_height=0;this.image=this.name=this.animation=this.label=this.url=null;this.isClone=false;this.scale=1;if(img&&obj)this.setup(img,obj);}
setup(img,obj,isJson)
{if(!img)return;isJson=(isJson==true);let bool=isJson?!(obj.sourceSize.w==obj.spriteSourceSize.w&&obj.sourceSize.h==obj.spriteSourceSize.h):false;let labels=String(isJson&&obj.name.indexOf(".")>=0?StringUtil.replaceAll(obj.name,[".png",".jpg",".gif"],["","",""]):obj.name).split("|");this.animation=labels.length>1?labels[0]:"";this.name=labels.length>1?labels[1]:labels[0];labels=StringUtil.getNumber(this.name);this.label=labels.length>0?labels[0]:"";this.index=labels.length>1?MathUtil.int(labels[1]):0;this.x=MathUtil.format(isJson?obj.frame.x:obj.x);this.y=MathUtil.format(isJson?obj.frame.y:obj.y);this.width=MathUtil.format(isJson?obj.frame.w:obj.width);this.height=MathUtil.format(isJson?obj.frame.h:obj.height);this.frame_width=isJson?(bool?obj.sourceSize.w:0):(obj.hasOwnProperty("frameWidth")?MathUtil.format(obj.frameWidth):0);this.frame_height=isJson?(bool?obj.sourceSize.h:0):(obj.hasOwnProperty("frameHeight")?MathUtil.format(obj.frameHeight):0);this.regX=MathUtil.format(isJson?(obj.hasOwnProperty("pivot")?Number(obj.pivot)*(this.frame_width>0?this.frame_width:this.width):-obj.spriteSourceSize.x):obj.frameX);this.regY=MathUtil.format(isJson?(obj.hasOwnProperty("pivot")?Number(obj.pivot)*(this.frame_height>0?this.frame_height:this.height):-obj.spriteSourceSize.y):obj.frameY);this.url=img.src;if(Global.useCanvas&&Global.useCache&&(this.width!=img.width||this.height!=img.height)){let canvas=CanvasUtil.splitFrames(img,this.x,this.y,this.width,this.height);if(canvas){this.image=canvas;this.x=this.y=0;}
else this.image=img;}
else this.image=img;this.isClone=false;}
clone()
{let copy=ObjectPool.create(Source);copy.animation=this.animation;copy.name=this.name;copy.label=this.label;copy.index=this.index;copy.regX=this.regX;copy.regY=this.regY;copy.x=this.x;copy.y=this.y;copy.scale=this.scale;copy.image=this.image;copy.width=this.width;copy.height=this.height;copy.frame_width=this.frame_width;copy.frame_height=this.frame_height;copy.url=this.url;copy.isClone=true;return copy;}
reset(img=null,obj=null)
{this.x=this.y=this.regX=this.regY=this.index=this.width=this.height=this.frame_width=this.frame_height=0;this.image=this.name=this.animation=this.label=this.url=null;this.isClone=false;this.scale=1;if(img&&obj)this.setup(img,obj);}
dispose()
{this.reset();delete this.x,this.y,this.scale,this.name,this.animation,this.label,this.url,this.regX,this.regY,this.frame_width,this.frame_height,this.image,this.index,this.width,this.height,this.isClone;}
toString()
{let str="{";str+='"name":'+this.name+',';str+='"regX":'+this.regX+',';str+='"regY":'+this.regY+',';str+='"label":'+this.label+',';str+='"index":'+this.index+',';str+='"width":'+this.width+',';str+='"height":'+this.height+',';str+='"animation":'+this.animation+',';str+='"frame_width":'+this.frame_width+',';str+='"frame_height":'+this.frame_height+',';str+='"x":'+this.x+',';str+='"y":'+this.y+',';str+='"url":'+this.url+',';str+='"scale":'+this.scale;return str+"}";}}
class AssetUtil
{static parseSheet(image,data,isXML)
{return isXML?AssetUtil._xml2sheet(image,data):AssetUtil._json2sheet(image,data.content);}
static _xml2sheet(image,xml)
{if(image==null||xml==null)return;let array=[];let xmlDoc=xml.documentElement.childNodes;let source;let datas;let temp;let item;let len;let i;let j;for(i=0,len=xmlDoc.length;i<len;i++){datas=xmlDoc[i].attributes;if(datas==undefined||datas.length<=0)continue;temp={};for(j=0;j<datas.length;j++){item=datas[j];temp[item.nodeName]=item.value;}
source=ObjectPool.create(Source);source.setup(image,temp);array.push(source);}
return array;}
static _json2sheet(image,json)
{if(image==null||json==null)return;let i,str,temp,source,datas,old,array=[];for(str in json){if(str=="meta")continue;datas=json[str];for(i in datas){temp=datas[i];temp.name=i;source=ObjectPool.create(Source);source.setup(image,temp,true);if(source.width==0&&source.height==0&&!StringUtil.isEmpty(source.label)&&old&&source.label==old.label){source.height=source.rect.height;source.width=source.rect.width;if(old.width==0&&old.height==0){old.height=old.rect.height;old.width=old.rect.width;}}
array.push(source);old=source;}}
return array;}
static parseFont(fnt)
{if(fnt==null)return null;let font=new BitmapFont();let xmlDoc=URLLoader.parseXML(fnt,"text/xml");let info=xmlDoc.getElementsByTagName("info")[0];let common=xmlDoc.getElementsByTagName("common")[0];let pnode=xmlDoc.getElementsByTagName("pages");if(pnode.length<=0){if(xmlDoc.body)trace("[ERROR] AssetUtil.parseFont() "+xmlDoc.body.innerText);return null;}
let pages=pnode[0].childNodes;let chars=xmlDoc.getElementsByTagName("chars")[0].childNodes;AssetUtil.copyAttributes(font.info,info);AssetUtil.copyAttributes(font.common,common);let source,data,i,str,index,obj,img,len=pages.length;font.info.size=Math.abs(font.info.size);font.name=font.info.face;font.chars={};font.pages=[];font.images=[];for(i=0;i<len;i++){data=pages[i];if(data.nodeName!="page")continue;index=Number(data.getAttribute("id"));str=data.getAttribute("file");if(StringUtil.isEmpty(str))continue;font.pages[index]=str;str=Loader.getName(str);if(!StringUtil.isEmpty(str)&&AssetManager._cache.hasOwnProperty(str)){font.images[index]=AssetManager._cache[str];delete AssetManager._cache[str];}else{trace("[ERROR] AssetUtil.parseFont can't find asset of "+str);}}
for(i=0,len=chars.length;i<len;i++){data=chars[i];if(data.nodeName!="char")continue;obj=AssetUtil.copyAttributes({},data);obj.name=font.name+"|"+obj.xadvance+" "+obj.id;obj.frameX=-obj.xoffset;obj.frameY=-obj.yoffset;img=font.images[obj.page];if(img==undefined)continue;source=ObjectPool.create(Source);source.setup(img,obj);source.label=Number(source.label);font.chars[source.index]=source;}
return font;}
static copyAttributes(obj,node)
{let i,l,d,t,datas=node.attributes;for(i=0,l=datas.length;i<l;i++){d=datas[i];t=d.value;obj[d.name]=isNaN(t)?t:Number(t);}
return obj;}
static asset2diplay(array)
{let i,l,a,d,list=[];for(i=0,l=array.length;i<l;i++){a=array[i];d=Factory.c("do");d.setInstance(a);list.push(d);}
return list;}}
class Ajax
{constructor()
{this.responseType=null;this._responseType=null;}
get(url,data,oncomplete,onerror,use_form_data,async)
{this.getRequest("GET",url,data,oncomplete,onerror,use_form_data,async);}
post(url,data,oncomplete,onerror,use_form_data,async)
{this.getRequest("POST",url,data,oncomplete,onerror,use_form_data,async);}
getHttp()
{let XmlHttp;if(Global.root.ActiveXObject){let arr=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.5.0","MSXML2.XMLHttp.4.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp","Microsoft.XMLHttp"];for(let i=0;i<arr.length;i++){try{XmlHttp=new ActiveXObject(arr[i]);return XmlHttp;}
catch(error){}}}
else{try{XmlHttp=new XMLHttpRequest();return XmlHttp;}
catch(otherError){}}
return false;}
getRequest(t,url,d,oncomplete,err,use_form_data,async)
{let s=this,k,data="",a="",block=(use_form_data==true),sub,st;async=(async==true?false:true);s.err=err;let ajax=s.getHttp();if(!ajax){return;}
if(d&&typeof d!="string"&&!block){for(k in d){sub=d[k];st=(typeof sub)
if(st!="number"&&(st!="string"||(sub.indexOf("data:")==0&&sub.indexOf(";base64,")>0))){block=true;break;}
data+=(a+k+"="+sub);a="&";}}
if(d&&typeof d!="string"&&block){data=new FormData();for(k in d){sub=d[k];st=(typeof sub);if(st=="string"&&(sub.indexOf("data:")==0&&sub.indexOf(";base64,")>0)){sub=sub.split(",");sub.shift();sub=sub.join(",");}
data.append(k,sub);}}
if(d&&typeof d=="string"){data=d;}
if(t.toLowerCase()=="get"&&data.length>0){url+=((url.indexOf('?')>=0?'&':'?')+data);data=null;}
ajax.open(t,url,async);if(!block)ajax.setRequestHeader("Content-Type",(s.responseType==Ajax.JSON)?"application/json":"application/x-www-form-urlencoded");ajax._responseType=StringUtil.getPathExt(url);if(s.responseType){try{ajax.responseType=s.responseType;}catch(e){if(s.responseType==Ajax.JSON)ajax._responseType="json";}
s.responseType=Ajax.TEXT;}
ajax.onreadystatechange=function(){if(ajax.readyState==4){if(ajax.status>=200&&ajax.status<300||ajax.status===304){if(oncomplete){if(ajax._responseType==Ajax.JSON){oncomplete(JSON.parse(ajax.responseText));}
else if(ajax._responseType==Ajax.PROP){oncomplete(PropUtil.parseProperties(ajax.responseText));}
else if(ajax.responseType==Ajax.ARRAY_BUFFER||ajax.responseType==Ajax.BLOB||ajax.responseType==Ajax.JSON){oncomplete(ajax.response);}
else if(ajax.responseText.length>0){oncomplete(ajax.responseText);}
else{oncomplete(null);}}}else{if(err){err(ajax);}}}};ajax.send(data);}}
Ajax.TEXT="text";Ajax.JSON="json";Ajax.BLOB="blob";Ajax.PROP="prop";Ajax.ARRAY_BUFFER="arraybuffer";class SVGLabel{};SVGLabel.LINE="line";SVGLabel.POLYLINE="polyline";SVGLabel.RECT="rect";SVGLabel.CIRCLE="circle";SVGLabel.ELLIPSE="ellipse";SVGLabel.POLYGON="polygon";SVGLabel.PATH="path";class ShapeVO
{constructor(type=null,properties=null)
{this.id=UniqueUtil.getName("shape_vo");this.type=this.rect=this.properties=null;if(type&&properties)this.setup(type,properties);}
setup(type,properties)
{this.type=type.toLowerCase();this.properties=properties;this.rect=ObjectPool.create(Rectangle);this.rect.data=ShapeUtil.getShapeBounds(this);return this;}
reset(type=null,properties=null)
{this.id=UniqueUtil.getName("shape_vo");if(this.rect&&this.rect instanceof Rectangle)ObjectPool.remove(this.rect);this.rect=this.type=this.properties=null;if(type&&properties)this.setup(type,properties);}
clone()
{let clone=ObjectPool.create(ShapeVO);clone.type=this.type;if(this.rect)clone.rect=this.rect.clone();clone.properties=ObjectUtil.copyAttribute({},this.properties,false);return clone;}
dispose()
{if(this.rect)ObjectPool.remove(this.rect);delete this.id,this.rect,this.type,this.properties;}
toString()
{return'{"id":"'+this.id+'","type":"'+this.type+'","rect":'+(this.rect?this.rect.toString():'')+'","properties":'+JSON.stringify(this.properties)+'}';}
static create(node_string,pos)
{if(StringUtil.isEmpty(node_string))return null;pos=(pos?(pos==true?{x:0,y:0}:pos):null);let vo=ObjectPool.create(ShapeVO);let node=StringUtil.html2object(node_string);if(!node)return null;if(node.children)delete node.children;if(node.transform)delete node.transform;vo.type=node.tagName;delete node.tagName;vo.properties=node;vo.rect=ObjectPool.create(Rectangle);vo.rect.data=ShapeUtil.getShapeBounds(vo);return pos?ShapeUtil.replace(vo,pos):vo;}
static string(vo)
{if(!vo)return"";let str='<'+vo.type+' ';for(let i in vo.properties){str+=(i+'="'+(i=="style"?StringUtil.buildParams(vo.properties[i],true):vo.properties[i])+'" ');}
str+="/>";return str;}}
ShapeVO.CILP="_clip";class Graphics
{constructor(context=null)
{if(!context){CanvasUtil.create(this);this.canvas.width=Global.width;this.canvas.height=Global.height;}else{this.context=context;this.canvas=context.canvas;}
this.name=UniqueUtil.getName("Graphics");Global.proxy(this,this.context,"arc");Global.proxy(this,this.context,"rect");Global.proxy(this,this.context,"clip");Global.proxy(this,this.context,"fill");Global.proxy(this,this.context,"arcTo");Global.proxy(this,this.context,"stroke");Global.proxy(this,this.context,"moveTo");Global.proxy(this,this.context,"lineTo");Global.proxy(this,this.context,"beginPath");Global.proxy(this,this.context,"closePath");Global.proxy(this,this.context,"createPattern");Global.proxy(this,this.context,"bezierCurveTo");Global.proxy(this,this.context,"createLinearGradient");Global.proxy(this,this.context,"createRadialGradient");Global.proxy(this,this.context,"quadraticCurveTo","curveTo");}
lineStyle(thickness=1,style="#000000",alpha=1,cap="butt",joint="miter",miterLimit=10)
{this.line_cap=cap;this.stroke_style=style;this.line_join=joint;this.line_alpha=alpha;this.line_width=thickness;this.miter_limit=miterLimit;this.line_width=this.line_width<=0?0.1:this.line_width;this.stroke_style=this.stroke_style+"";this.context.lineCap=this.line_cap;this.context.lineJoin=this.line_join;this.context.lineWidth=this.line_width;this.context.miterLimit=this.miter_limit;this.context.strokeStyle=this.stroke_style;}
clear()
{if(!this.context)return;this.rectangle=this.rectangle||ObjectPool.create(Rectangle).set(0,0,this.context.canvas.width,this.context.canvas.height);this.context.clearRect(this.rectangle.x,this.rectangle.y,this.rectangle.width,this.rectangle.height);this.context.restore();}
beginFill(style,alpha)
{this.fill_alpha=(alpha==undefined)?1:alpha;this.fill_style=style||"#FFFFFF";this.context.fillStyle=this.fill_style;return this;}
endFill()
{var old_alpha=this.context.globalAlpha;if(this.fill_style)
{this.context.fillStyle=this.fill_style;this.context.globalAlpha=old_alpha*this.fill_alpha;this.context.fill();}
if(this.stroke_style)
{this.context.strokeStyle=this.stroke_style;this.context.globalAlpha=old_alpha*this.line_alpha;this.context.stroke();}
this.context.globalAlpha=old_alpha;}
beginBitmapFill(image,repetitionStyle,alpha)
{this.fill_style=this.createPattern(image,repetitionStyle||"no-repeat");this.fill_alpha=(alpha==undefined)?1:alpha;this.context.fillStyle=this.fill_style;}
linearGradientFill(xStart,yStart,xEnd,yEnd,offsetlist,colorList)
{let fillStyle=this.createLinearGradient(xStart,yStart,xEnd,yEnd);let len=Math.min(offsetlist.length,colorList.length);for(let i=0;i<len;i++)fillStyle.addColorStop(offsetlist[i],colorList[i]+"");this.fill_style=fillStyle;return fillStyle;}
radialGradientFill(xStart,yStart,radiusStart,xEnd,yEnd,radiusEnd,offsetlist,colorList)
{let fillStyle=this.createRadialGradient(xStart,yStart,radiusStart,xEnd,yEnd,radiusEnd);let len=Math.min(offsetlist.length,colorList.length);for(let i=0;i<len;i++)fillStyle.addColorStop(offsetlist[i],colorList[i]+"");this.fill_style=fillStyle;return fillStyle;}
drawRect(x,y,width,height)
{this.beginPath();this.rect(x,y,width,height);this.closePath();}
drawRoundRect(x,y,width,height,rx,ry)
{ry=ry?ry:rx;this.beginPath();this.moveTo(x+width,y+height-ry);this.curveTo(x+width,y+height,x+width-rx,y+height);this.lineTo(x+rx,y+height);this.curveTo(x,y+height,x,y+height-ry);this.lineTo(x,y+ry);this.curveTo(x,y,x+rx,y);this.lineTo(x+width-rx,y);this.curveTo(x+width,y,x+width,y+ry);this.lineTo(x+width,y+height-ry);this.closePath();}
drawPath(array,isClose)
{if(array==undefined||array.length<2)return;this.beginPath();let isArray=(array[0]instanceof Array);this.moveTo((isArray?array[0][0]:array[0].x),(isArray?array[0][1]:array[0].y));for(let i=1;i<array.length;i++){this.lineTo(isArray?array[i][0]:array[i].x,isArray?array[i][1]:array[i].y);}
if(isClose)this.closePath();}
drawCircle(x,y,radius)
{this.beginPath();this.arc(x,y,radius,0,Math.PI*2,0);this.closePath();}
drawEllipse(x,y,width,height)
{if(width==height)return this.drawCircle(x,y,width/2);width=width/2;height=height/2;let dw=0.5522847498307933*width;let dh=0.5522847498307933*height;x+=width;y+=height;this.beginPath();this.moveTo(x+width,y);this.bezierCurveTo(x+width,y-dh,x+dw,y-height,x,y-height);this.bezierCurveTo(x-dw,y-height,x-width,y-dh,x-width,y);this.bezierCurveTo(x-width,y+dh,x-dw,y+height,x,y+height);this.bezierCurveTo(x+dw,y+height,x+width,y+dh,x+width,y);this.closePath();}
createPolygon(x,y,radius,n)
{if(n<3)return;let dx,dy,i;this.beginPath();dx=Math.sin(0);dy=Math.cos(0);var dig=Math.PI/n*((n%2==0)?2:(n-1));for(i=0;i<n;i++){dx=Math.sin(i*dig);dy=Math.cos(i*dig);this.lineTo(x+dx*radius,y+dy*radius);}
this.closePath();}
drawSVGPath(pathData,pts)
{let cmd,old,point=ObjectPool.create(Point),j=0,path=pathData.split(/(?=[a-zA-Z])/);this.beginPath();for(let str,k,p,i=0,len=path.length;i<len;i++)
{str=StringUtil.trim(path[i]),cmd=str[0].toUpperCase(),p=ArrayUtil.format(str.substring(1).split(/,| |-/));if(StringUtil.isEmpty(cmd))cmd=old;else old=cmd;switch(cmd)
{case"M":point.set(pts?pts[j].x:p[0],pts?pts[j].y:p[1]);this.moveTo(point.x,point.y);j++;break;case"L":k=0;for(let n=Math.floor(p.length*0.5);k<n;k++){if(pts){this.lineTo(pts[j].x,pts[j].y);j++;}
else this.lineTo(p[k*2],p[k*2+1]);}
k--;point.set(pts?pts[j-1].x:p[k*2],pts?pts[j-1].y:p[k*2+1]);break;case"Q":k=0;for(let n=Math.floor(p.length/4);k<n;k++){if(pts){this.curveTo(pts[j].x,pts[j].y,pts[j+1].x,pts[j+1].y);j+=2;}
else this.curveTo(p[k*4],p[k*4+1],p[k*4+2],p[k*4+3]);}
k--;point.set(pts?pts[j-1].x:p[k*4+2],pts?pts[j-1].y:p[k*4+3]);break;case"C":k=0;for(let n=Math.floor(p.length/6);k<n;k++){if(pts){this.bezierCurveTo(pts[j].x,pts[j].y,pts[j+1].x,pts[j+1].y,pts[j+2].x,pts[j+2].y);j+=3;}
else this.bezierCurveTo(p[k*6],p[k*6+1],p[k*6+2],p[k*6+3],p[k*6+4],p[k*6+5]);}
k--;point.set(pts?pts[j-1].x:p[k*6+4],pts?pts[j-1].y:p[k*6+5]);break;case"H":case"V":point.set(cmd=="H"?parseFloat(p[0]):point.x,cmd=="H"?point.y:parseFloat(p[0]));this.lineTo(point.x,point.y);break;case"Z":this.closePath();break;default:trace("[Graphics]drawSVGPath() miss",str);break;}}
ObjectPool.remove(point);return this;};drawShape(vo,offset=null,fill=false)
{if(!vo||!(vo instanceof ShapeVO))return;if(fill&&vo.properties.style){let style=vo.properties.style;if(style.fill){if(style.fill.indexOf("#")==0)this.beginFill(style.fill,style.fillOpacity||style.opacity);else if(AssetManager.getSource(style.fill))this.beginBitmapFill(AssetManager.getSource(style.fill).image);}
if(style.stroke&&style.stroke.indexOf("#")==0)this.lineStyle(style.strokeWidth,style.stroke,style.strokeOpacity||style.opacity);}
let path,points,pts;switch(vo.type)
{case SVGLabel.LINE:points=[[vo.properties.x1,vo.properties.y1],[vo.properties.x2,vo.properties.y2]];if(offset)path=ShapeUtil.pointsToPath(points);else this.drawPath(points,false);break;case SVGLabel.POLYLINE:case SVGLabel.POLYGON:points=ArrayUtil.each(vo.properties.points.split(/ /),function(d,i,a){a[i]=d.split(/,/);});if(offset)path=ShapeUtil.pointsToPath(points,vo.type==SVGLabel.POLYGON);else this.drawPath(points,vo.type==SVGLabel.POLYGON);break;case SVGLabel.RECT:if(offset)path=ShapeUtil.rectToPath(vo.properties);else this.drawRoundRect(vo.properties.x||0,vo.properties.y||0,vo.properties.width,vo.properties.height,vo.properties.rx||0,vo.properties.ry||0);break;case SVGLabel.CIRCLE:if(offset)path=ShapeUtil.ellipseToPath(vo.properties);else this.drawCircle(vo.properties.cx||0,vo.properties.cy||0,vo.properties.r);break;case SVGLabel.ELLIPSE:if(offset)path=ShapeUtil.ellipseToPath(vo.properties);else this.drawEllipse((vo.properties.cx||0)-vo.properties.rx,(vo.properties.cy||0)-vo.properties.ry,vo.properties.rx*2,vo.properties.ry*2);break;case SVGLabel.PATH:if(offset)path=vo.properties.d;else this.drawSVGPath(vo.properties.d);break;default:return;}
if(!StringUtil.isEmpty(path)){let clo=ObjectPool.create(ShapeVO).setup(SVGLabel.PATH,{d:path});pts=ShapeUtil.getShapeBounds(clo,true);Point.matrix(pts,offset);this.drawSVGPath(path,pts);ObjectPool.remove(clo);}
if(fill&&vo.properties.style)this.endFill();}
reset(context=null)
{if(this.canvas&&this.canvas.parentNode){this.canvas.parentNode.removeChild(this.canvas);}
if(this.rectangle)ObjectPool.remove(this.rectangle);this.fill_style=this.rectangle=null;this.fill_alpha=1;if(context){this.context=context;this.canvas=context.canvas;if(this.canvas.width!=Global.width)this.canvas.width=Global.width;if(this.canvas.height!=Global.height)this.canvas.height=Global.height;}
this.clear();this.line_alpha=1;this.line_width=1;this.miter_limit=10;this.line_cap="butt";this.line_join="miter";this.stroke_style="#000000";}
dispose()
{this.reset();delete this.name,this.rectangle,this.line_cap,this.line_join,this.line_alpha,this.stroke_style,this.line_width,this.miter_limit,this.fill_alpha,this.fill_style,this.context,this.canvas;}
toString()
{return'Graphics';}}
class StageEvent extends Event
{constructor(type,params,label,target)
{super(type,params,label,target);this.length=this.delta=this.mouseY=this.mouseX=0;this.touchs=null;}
setup(type,params,label,target,mouseX,mouseY,delta,length,touchs)
{this.type=type;this.label=label;this.params=params;this.target=target;this.length=length;this.touchs=touchs;this.delta=(delta==null?0:delta);this.mouseY=(mouseY==null?0:mouseY);this.mouseX=(mouseX==null?0:mouseX);return this;}
reset(...args)
{super.reset(...args);this.length=this.delta=this.mouseY=this.mouseX=0;this.touchs=null;}
clone()
{return Factory.c("se").setup(this.type,this.params,this.label,this.target,mouseX,mouseY,delta,length,touchs);}
dispose()
{super.dispose();delete this.delta,this.mouseY,this.mouseX,this.length,this.touchs;}
toString()
{return"[StageEvent length="+this.length+", type="+this.type+", mouseX="+this.mouseX+", mouseY="+this.mouseY+", delta="+this.delta+"]";}}
StageEvent.MESSAGE="win_message";StageEvent.ENTER_FRAME="enterframe";StageEvent.MOUSE_WHEEL="mousewheel";StageEvent.MOUSE_CLICK="mouseclick";StageEvent.MOUSE_DOWN="mousedown";StageEvent.MOUSE_MOVE="mousemove";StageEvent.MOUSE_OVER="mouseover";StageEvent.MOUSE_TAP="mousetap";StageEvent.MOUSE_OUT="mouseout";StageEvent.MOUSE_UP="mouseup";StageEvent.RESIZE="resize";StageEvent.DRAG_MOVE="drag_move";StageEvent.KEY_DOWN="keydown";StageEvent.KEY_UP="keyup";StageEvent.UPDATE="update";class Factory
{constructor(generator,properties=null,params=null)
{this.generator=(typeof(generator)=="string")?ClassUtil.getDefinitionByName(generator):generator;this.properties=properties;this.params=params;}
newInstance()
{if(this.generator==null)return null;let p,instance=ObjectPool.create(this.generator,this.params);if(this.properties!=null)
{for(p in this.properties)
{instance[p]=this.properties[p];}}
return instance;}
static c(type,properties,useCanvas=null)
{if(StringUtil.isEmpty(type))return null;useCanvas=(useCanvas==null)?Global.useCanvas:useCanvas;let instance;switch(type){case"ev":case"se":var bool=(!properties||!(properties instanceof Array)||properties.length<1);instance=ObjectPool.create(type==="ev"?Event:StageEvent,bool?null:properties);if(!bool)return instance;break;case"dc":instance=ObjectPool.create(DisplayObjectContainer);break;case"do":instance=ObjectPool.create(useCanvas?DisplayObject:DOMDisplay);break;case"mc":instance=ObjectPool.create(useCanvas?MovieClip:DOMMovie);break;case"bs":instance=ObjectPool.create(BoxShape);instance.use_canvas=useCanvas;if(properties&&ObjectUtil.getType(properties)=="array"){instance.setup.apply(instance,properties);return instance;}
break;case"tf":if(properties==undefined)return null;if(properties.font&&FontManager.has(properties.font)){instance=new BitmapText();instance.setup(properties.text,properties.font,properties.lineWidth,properties.align);}else{instance=useCanvas?new TextField(properties.text,properties.font,properties.color,properties.size):new InputText(properties.isInput,properties.multiline,properties.tabindex,properties.password);}
break;case"ef":instance=ObjectPool.create(Effect);if(properties==undefined||properties.length==undefined||properties.length==0)return instance;instance.setup.apply(instance,properties);return instance;}
if(instance&&properties)ObjectUtil.copyAttribute(instance,properties,true);return instance;}}
var _draggable=Symbol("draggable");var _x=Symbol("x");var _y=Symbol("y");var _skewX=Symbol("skewX");var _skewY=Symbol("skewY");var _width=Symbol("width");var _height=Symbol("height");var _scaleX=Symbol("scaleX");var _scaleY=Symbol("scaleY");var _rotation=Symbol("rotation");class DisplayBase extends EventDispatcher
{constructor()
{super();this._cursor=this.name=this.register_point=this._parent=this._temp_matrix=this._matrix=this.polyArea=this._stage=this._bounds=null;this[_height]=this[_width]=this[_y]=this[_x]=this[_rotation]=this[_skewX]=this[_skewY]=this._minX=this._minY=0;this[_scaleY]=this[_scaleX]=this._alpha=this._parent_alpha=1;this._refresh=this._resize=this.mouseEnabled=false;this.usePolyCollision=false;this._updateMatrix=true;this.breakTouch=false;this[_draggable]=false;this._visible=true;}
set buttonMode(value)
{this._cursor=value?"pointer":"";}
get buttonMode()
{return(this._cursor=="pointer");}
set resize(value)
{this._resize=value;if(this._resize){this.dispatchEvent(Factory.c("ev",[DisplayBase.RESIZE]));this.__checkDisplayUpdate();}}
get resize()
{return this._resize;}
get stage()
{return this._stage;}
set stage(value)
{if(this._stage==value)return;this._stage=value;}
set visible(value)
{value=Boolean(value);if(this._visible==value)return;this._visible=value;this.__checkDisplayUpdate();}
get visible()
{return this._visible;}
set parent(value)
{if(this._parent==value)return;this._parent=value;}
get parent()
{return this._parent;}
set alpha(value)
{if(this._alpha==value||Number.isNaN(value))return;this._alpha=MathUtil.clamp(value,0,1);this.__checkDisplayUpdate();this.updateMatrix=true;}
get alpha()
{return this._alpha;}
get updateMatrix()
{return this._updateMatrix;}
set updateMatrix(value)
{if(value)this.__checkDisplayUpdate();if(this._updateMatrix==value)return;this._updateMatrix=value;if(value&&this._bounds)this._bounds.width=this._bounds.heigth=0;}
get skewX()
{return this[_skewX];}
set skewX(value)
{if(this[_skewX]==value||Number.isNaN(value))return;this[_skewX]=MathUtil.format(value);this.updateMatrix=true;}
get skewY()
{return this[_skewY];}
set skewY(value)
{if(this[_skewY]==value||Number.isNaN(value))return;this[_skewY]=MathUtil.format(value);this.updateMatrix=true;}
get x()
{return this[_x];}
set x(value)
{if(this[_x]==value||Number.isNaN(value))return;this[_x]=MathUtil.format(value);this.updateMatrix=true;}
get y()
{return this[_y];}
set y(value)
{if(this[_y]==value||Number.isNaN(value))return;this[_y]=MathUtil.format(value);this.updateMatrix=true;}
get width()
{return this[_width];}
set width(value)
{if(this[_width]==value||Number.isNaN(value))return;this[_width]=MathUtil.format(Math.max(0,value));this.updateMatrix=true;this.resize=true;}
get height()
{return this[_height];}
set height(value)
{if(this[_height]==value||Number.isNaN(value))return;this[_height]=MathUtil.format(Math.max(0,value));this.updateMatrix=true;this.resize=true;}
get scaleX()
{return this[_scaleX];}
set scaleX(value)
{if(this[_scaleX]==value||Number.isNaN(value))return;this[_scaleX]=MathUtil.format(value);this.updateMatrix=true;}
get scaleY()
{return this[_scaleY];}
set scaleY(value)
{if(this[_scaleY]==value||Number.isNaN(value))return;this[_scaleY]=MathUtil.format(value);this.updateMatrix=true;}
get rotation()
{return this[_rotation];}
set rotation(value)
{if(this[_rotation]==value||Number.isNaN(value))return;this[_rotation]=MathUtil.format(value);this.updateMatrix=true;}
get param()
{var str=DisplayBase.toString(this);return JSON.parse(str);}
set param(value)
{if(value==undefined||value==null)return;if(value.hasOwnProperty("matrix"))delete value.matrix;if(value.hasOwnProperty("name"))delete value.name;ObjectUtil.copyAttribute(this,value,true);this.updateMatrix=true;this.resize=true;}
get origin()
{return this.register_point;}
set origin(value)
{if(value==undefined||value==null)return;if(this.register_point==undefined){if(value instanceof Point){this.register_point=value;this.updateMatrix=true;}
else this.register_point=ObjectPool.create(Point);}
if(this.register_point.x==value.x&&this.register_point.y==value.y)return;this.register_point.x=value.x;this.register_point.y=value.y;if(value instanceof Point)ObjectPool.remove(value);this.updateMatrix=true;}
get matrix()
{if(this.updateMatrix){this.getMatrix(null,true);this._refresh=true;}
return this._matrix?this._matrix:this.getMatrix();}
set matrix(value)
{if(value==undefined||value==null||!(value instanceof Matrix))return;let mtx1=this.getMatrix().clone();let mtx2=this.getMatrix(this);mtx1.invert();mtx1.concat(mtx2);value.concat(mtx1);ObjectPool.remove(mtx1);value.applyDisplay(this);}
get scale()
{return(this[_scaleX]==this[_scaleY])?this[_scaleX]:NaN;}
set scale(value)
{if(value==undefined||value==null||Number.isNaN(value))return;this[_scaleX]=this[_scaleY]=MathUtil.format(value);this.updateMatrix=true;}
get cursor()
{return this._cursor;}
set cursor(value)
{if(value==this._cursor)return;this._cursor=value;}
get draggable()
{return this[_draggable];}
set draggable(value)
{if(value==undefined||value==null||this[_draggable]==value)return;this[_draggable]=value;this.breakTouch=this.mouseEnabled=value;}
__checkDisplayUpdate()
{if(this._stage&&!this._stage.auto_fresh)this._stage.auto_fresh=true;}
setSize(w,h)
{if(w==undefined||Number.isNaN(w)||h==undefined||Number.isNaN(h)||(this[_width]==w&&this[_height]==h))return;this.height=h;this.width=w;}
getMatrix(target,isDraw)
{if(this._matrix&&!this.updateMatrix&&!target&&isDraw)return this._matrix;if(this._temp_matrix==undefined)this._temp_matrix=ObjectPool.create(Matrix);else this._temp_matrix.reset();if(this._matrix&&!this.updateMatrix&&!target&&!isDraw){this._temp_matrix.setup(this._matrix.a,this._matrix.b,this._matrix.c,this._matrix.d,this._matrix.tx,this._matrix.ty);return this._temp_matrix;}
if(target==this)return this._temp_matrix;this._temp_matrix.concatTransform(this.x,this.y,this.scaleX,this.scaleY,this.rotation,this.origin?this.origin.x:0,this.origin?this.origin.y:0,this.skewX,this.skewY);if(this.parent&&target!=this.parent){this._temp_matrix.concat(this.parent.matrix);if(target){var mtx=target.matrix.clone().invert();this._temp_matrix.concat(mtx);ObjectPool.remove(mtx);}}
if(this.updateMatrix&&!target&&isDraw){if(!this._matrix)this._matrix=this._temp_matrix.clone();else this._matrix.setup(this._temp_matrix.a,this._temp_matrix.b,this._temp_matrix.c,this._temp_matrix.d,this._temp_matrix.tx,this._temp_matrix.ty);this.updateMatrix=false;}
return this._temp_matrix;}
localToGlobal(posX,posY)
{if(posY==undefined&&(posX instanceof Point)){var pos=posX;posY=pos.y;posX=pos.x;ObjectPool.remove(pos);}
var matrix=this.getMatrix();var mtx=ObjectPool.create(Matrix);mtx.setup(1,0,0,1,posX,posY);mtx.concat(matrix);var point=ObjectPool.create(Point).set(mtx.tx,mtx.ty);ObjectPool.remove(mtx);return point;}
globalToLocal(posX,posY)
{if(posY==undefined&&(posX instanceof Point)){var pos=posX;posY=pos.y;posX=pos.x;ObjectPool.remove(pos);}
var matrix=this.getMatrix();matrix.invert();var mtx=ObjectPool.create(Matrix);mtx.setup(1,0,0,1,posX,posY);mtx.concat(matrix);var point=ObjectPool.create(Point).set(mtx.tx,mtx.ty);ObjectPool.remove(mtx);return point;}
localToTarget(posX,posY,target)
{if(target==undefined||target==null)return this.localToGlobal(posX,posY);return target.globalToLocal(this.localToGlobal(posX,posY));}
getWidth()
{return Math.ceil(Math.abs(this.width*this.scaleX));}
getHeight()
{return Math.ceil(Math.abs(this.height*this.scaleY));}
getBounds(target)
{let w=(this.getWidth()/Math.abs(this.scaleX));let h=(this.getHeight()/Math.abs(this.scaleY));let posX=this._minX;let posY=this._minY;let i,poly,bool=(target==undefined&&this._bounds);if(this.polyArea){if(this._bounds==undefined)this._bounds=ObjectUtil.cloneObj(this.polyArea);else{for(i=0;i<this.polyArea.length;i++){this._bounds[i].x=this.polyArea[i].x;this._bounds[i].y=this.polyArea[i].y;}}
poly=this._bounds;}
else if(bool){if(this._bounds.width>0&&this._bounds.height>0)return this._bounds;this._bounds[0].x=posX;this._bounds[0].y=posY;this._bounds[1].x=posX+w;this._bounds[1].y=posY;this._bounds[2].x=posX+w;this._bounds[2].y=posY+h;this._bounds[3].x=posX;this._bounds[3].y=posY+h;}
let mtx=this.getMatrix(target);poly=poly||(bool?this._bounds:[{x:posX,y:posY},{x:posX+w,y:posY},{x:posX+w,y:posY+h},{x:posX,y:posY+h}]);let vertexs=bool?this._bounds:[],len=poly.length,v,minX,maxX,minY,maxY;v=mtx.transformPoint(poly[0],true,false);minX=maxX=v.x;minY=maxY=v.y;vertexs[0]=v;for(let i=1;i<len;i++)
{v=mtx.transformPoint(poly[i],true,false);if(minX>v.x)minX=v.x;else if(maxX<v.x)maxX=v.x;if(minY>v.y)minY=v.y;else if(maxY<v.y)maxY=v.y;vertexs[i]=v;}
vertexs.x=minX;vertexs.y=minY;vertexs.width=maxX-minX;vertexs.height=maxY-minY;if(target==undefined&&this._bounds==undefined)this._bounds=vertexs;return vertexs;}
getIndex()
{if(this.parent==null||!this.parent.contains(this))return-1;return this.parent._children.indexOf(this);}
toTop()
{if(this.parent==null||!this.parent.contains(this))return;this.parent.setChildIndex(this,this.parent.numChildren-1);}
toBottom()
{if(this.parent==null||!this.parent.contains(this))return;this.parent.setChildIndex(this,0);}
moveTo(x,y)
{if(y==undefined&&(x instanceof Point)){y=x.y;x=x.x;}
if((this[_x]==x&&this[_y]==y)||Number.isNaN(x)||Number.isNaN(y))return;this[_x]=x;this[_y]=y;this.updateMatrix=true;}
removeFromParent(bool)
{if(this.parent==null||!this.parent.contains(this)){if(bool&&!Global.gc(this))this.dispose();return;}
this.parent.removeChild(this);if(bool&&!Global.gc(this))this.dispose();}
reset()
{if(this._parent)this.removeFromParent(false);if(this._matrix)ObjectPool.remove(this._matrix);if(this._temp_matrix)ObjectPool.remove(this._temp_matrix);if(this.register_point)ObjectPool.remove(this.register_point);super.reset();this.stage=null;this._visible=this._updateMatrix=true;this[_scaleY]=this[_scaleX]=this._alpha=this._parent_alpha=1;this._minX=this._minY=this[_skewX]=this[_skewY]=this[_height]=this[_width]=this[_y]=this[_x]=this[_rotation]=0;this._refresh=this._resize=this.mouseEnabled=this.usePolyCollision=this.breakTouch=this[_draggable]=false;this._cursor=this._bounds=this._matrix=this._temp_matrix=this.register_point=this.parent=this.polyArea=this.name=null;}
dispose()
{this.reset();super.dispose();delete this._refresh,this._cursor,this._bounds,this._minX,this._minY,this._temp_matrix,this.breakTouch,this._resize,this[_skewX],this[_skewY],this._stage,this._updateMatrix,this.polyArea,this[_draggable],this.usePolyCollision,this._matrix,this.register_point,this[_height],this[_width],this[_y],this[_x],this[_rotation],this[_scaleY],this[_scaleX],this._alpha,this.mouseEnabled,this._visible,this.name,this._parent,this._parent_alpha;}
render(){}
static toString(obj)
{let str="{";str+='"x":'+obj.x+',';str+='"y":'+obj.y+',';str+='"width":'+obj.width+',';str+='"height":'+obj.height+',';str+='"rotation":'+obj.rotation+',';str+='"scaleX":'+obj.scaleX+',';str+='"scaleY":'+obj.scaleY+',';str+='"skewX":'+obj.skewX+',';str+='"skewY":'+obj.skewY+',';str+='"_minX":'+obj._minX+',';str+='"_minY":'+obj._minY+',';str+='"origin":'+(!obj.origin?'null':obj.origin.toString())+',';str+='"mouseEnabled":'+obj.mouseEnabled+',';str+='"visible":'+obj.visible+',';str+='"name":"'+obj.name+'",';str+='"breakTouch":"'+obj.breakTouch+'",';str+='"alpha":'+obj.alpha+',';str+='"draggable":'+obj.draggable+',';str+='"_cursor":"'+(!obj._cursor?'':obj._cursor)+'",';if(this.polyArea)str+='"polyArea":'+obj.polyArea.toString()+',';str+='"usePolyCollision":'+obj.usePolyCollision+',';str+='"matrix":'+(obj._matrix?obj._matrix.toString():'""');return str+"}";}}
DisplayBase.RESIZE="display_base_resize";DisplayBase.RESET_INSTANCE="display_reset_instance";var _element=Symbol("element");class DOMDisplay extends DisplayBase
{constructor()
{super();this.instance=this._rect=this._mask=this._parent_node=this[_element]=null;this.name=UniqueUtil.getName("dom_display");this.hide_over=this._global_visible=true;this._layer=this._depth=0;this.use_canvas=false;this.filters=[];}
get layer()
{return this._layer||this._depth;}
set layer(value)
{if(this._layer==value)return;this._layer=value;}
get visible()
{return this._visible;}
set visible(value)
{if(this._visible==value)return;this._visible=value;if(this[_element])
this[_element].style.display=(!this._visible||!this._global_visible)?"none":"";}
get stage()
{return this._stage;}
set stage(value)
{if(value==null)this._global_visible=true;if(this._stage==value)return;this._stage=value;if(value){this._update_visible();this.updateMatrix=true;}
this._display(value!=null);}
get element()
{return this[_element];}
set element(value)
{if(this[_element]==value)return;let node;if(this[_element]&&this[_element].parentNode){node=this[_element].parentNode;node.removeChild(this[_element]);}
else if(this._stage)
node=this._parent_node?this._parent_node:this._stage.div;if(value&&value.parentNode){value.parentNode.removeChild(value);}
this[_element]=value;if(value==null){this.width=this.height=0;return;}
if(StringUtil.isEmpty(this[_element].id))this[_element].id=this.name;this.width=(this[_element].width==undefined||typeof(this[_element].width)!="number")?(StringUtil.isEmpty(this[_element].style.width)?this.width:MathUtil.int(this[_element].style.width)):this[_element].width;this.height=(this[_element].height==undefined||typeof(this[_element].height)!="number")?(StringUtil.isEmpty(this[_element].style.height)?this.height:MathUtil.int(this[_element].style.height)):this[_element].height;if(node)node.appendChild(this[_element]);}
get mask()
{return this._mask;}
set mask(value)
{if(this._mask&&this._mask instanceof ShapeVO&&this._mask!=value){ObjectPool.remove(this._mask);}
this._mask=value;this.__checkDisplayUpdate();}
get parentNode()
{return this._parent_node;}
set parentNode(value)
{if(this._parent_node==value)return;this._parent_node=value;if(this[_element]==null||this[_element].parentNode==this._parent_node)return;if(this[_element]&&this._stage){if(this[_element].parentNode)this[_element].parentNode.removeChild(this[_element]);this._display(true);}}
render(object)
{if(this[_element]==null)return;this._depth=this._layer?this._layer:(++DOMDisplay._depth_count);this._transform(object);}
_render(){}
setInstance(target)
{if(target==undefined||target==null||this.instance==target){if(this.instance!=target)this.element=this.instance=null;return target;}
let temp;this._rect=null;if(target instanceof HTMLImageElement){target.style.display="none";this.element=target;}
else if(target instanceof HTMLCanvasElement){this.element=CanvasUtil.toImage(target);}
else if(target instanceof DisplayObject){this.setInstance(target.canvas?target.canvas:target.instance);this.param=target.param;}
else if(target instanceof Source){this.register_point=ObjectPool.create(Point).set(target.regX,target.regY);this._rect=target;if(this[_element]==undefined)this.element=DOMUtil.createDOM("div",{id:this.name,style:{width:target.width+"px",height:target.height+"px",backgroundImage:"url("+target.image.src+")",backgroundRepeat:"no-repeat"}});else if(this.instance.image!=target.image){this[_element].style.backgroundImage="url("+target.image.src+")";}}
else if(target instanceof Graphics){this.setInstance(target.canvas);}
else if(target instanceof HTMLDivElement){this.element=target;}
else if(target instanceof SVGSVGElement){this.element=target;}
else{trace("DOMDisplay:: set instance with a invalid value.",ClassUtil.getQualifiedClassName(target),"-",ObjectUtil.getType(target));return null;}
this.instance=target;if(this[_element]&&this._stage){this._display(true);}
if(target instanceof Source)this._transform();this.updateMatrix=true;this.__checkDisplayUpdate();this.dispatchEvent(Factory.c("ev",[DisplayBase.RESET_INSTANCE]));return this.instance;}
_transform(target)
{let bool=(this._visible&&this._global_visible);this[_element].style.display=bool?"":"none";if(!bool)return;var hasUpdate=(this.updateMatrix||this._refresh);var matrix=this.getMatrix(target,true);let prefix=Global.cssPrefix,isEmpty=StringUtil.isEmpty(prefix),origin=isEmpty?"transformOrigin":prefix+"TransformOrigin",transform=isEmpty?"transform":prefix+"Transform";this[_element].style.opacity=this._alpha*this._parent_alpha;this[_element].style.position=Global.position;this[_element].style.overflow=this.hide_over?"hidden":"visible";this[_element].style.zIndex=Global.layer+this._depth;if(this._rect){this.width=this._rect.width;this.height=this._rect.height;this[_element].style.backgroundPosition=(-this._rect.x)+"px "+(-this._rect.y)+"px";}
if(hasUpdate){this[_element].style.width=(this.width>0?this.width+"px":"100%");this[_element].style.height=(this.height>0?this.height+"px":"100%");if(Global.supportTransform){this[_element].style[origin]="0% 0%";this[_element].style.top=this[_element].style.left="0px";this[_element].style[transform]=this._get_transform_css(matrix);}else{this[_element].style.top=matrix.ty+"px";this[_element].style.left=matrix.tx+"px";}
this._refresh=false;}
if(this._mask){let isDisplay=(typeof this._mask=="string"||this._mask instanceof ShapeVO);let isSource=(this._mask instanceof Source);if(isDisplay){this[_element].style[prefix+"ClipPath"]=this[_element].style["clipPath"]="url(#"+(typeof this._mask=="string"?this._mask:this._mask.id+ShapeVO.CILP)+")";}else{this[_element].style[prefix+"MaskImage"]="url("+(isSource?this._mask.image:this._mask).src+")";this[_element].style[prefix+"MaskRepeat"]="no-repeat";this[_element].style[prefix+"MaskPosition"]=matrix.tx+"px "+matrix.ty+"px";}}else{this[_element].style[prefix+"ClipPath"]=this[_element].style["clipPath"]=this[_element].style[prefix+"MaskImage"]=this[_element].style[prefix+"MaskPosition"]='';}
if(this.filters&&this.filters.length>0){let filter;for(let i=0,l=this.filters.length;i<l;i++)
{filter=this.filters[i];if(filter==undefined)continue;filter.show(this[_element]);}}else{this[_element].style[Global.cssPrefix+'BoxShadow']=this[_element].style.textShadow='';}
this[_element].style.cursor=(this._cursor==null)?"":this._cursor;this[_element].style.pointerEvents=this.mouseEnabled?"auto":"none";}
_get_transform_css(matrix)
{return matrix.toCSS();}
_update_visible()
{if(this.parent==null)return;let bool=true,obj=this;for(obj=obj.parent;obj!=null;obj=obj.parent)
{bool=(bool&&obj.visible);if(!bool)break;}
this._global_visible=bool;}
hitTestPoint(x,y,usePolyCollision)
{return CollisionUtil.hitTestPoint(this,x,y,this.usePolyCollision)>0;};hitTestObject(object,usePolyCollision)
{return CollisionUtil.hitTestObject(this,object,this.usePolyCollision)>0;};_display(bool)
{if(bool){try{if(this[_element]&&this[_element].parentNode==null){(this._parent_node?this._parent_node:(this.stage.div?this.stage.div:this.stage.canvas.parentNode)).appendChild(this[_element]);}}
catch(err){trace("[ERROR]DOMDisplay _display()",this.name,err.message);}}else{if(this[_element]){if(this[_element].parentNode)this[_element].parentNode.removeChild(this[_element]);this[_element].style.display="none";}}}
reset()
{super.reset();if(this._parent){this.removeFromParent(false);}
if(this[_element]&&this[_element].parentNode){this[_element].parentNode.removeChild(this[_element]);}
if(this.instance&&(this.instance instanceof Source)&&this.instance.isClone){ObjectPool.remove(this.instance);}
this.instance=this._rect=this._mask=this._parent_node=this[_element]=null;this.hide_over=this._global_visible=true;this._layer=this._depth=0;this.use_canvas=false;this.filters=[];}
dispose()
{if(this._mask&&this._mask instanceof ShapeVO)ObjectPool.remove(this._mask);this.reset();super.dispose();delete this.hide_over,this._global_visible,this.filters,this._layer,this.instance,this._rect,this._depth,this[_element],this._parent_node,this._mask;}
toString()
{return DOMDisplay.name;}}
DOMDisplay._depth_count=0;var reverse_play=Symbol("reversePlay");class DOMMovie extends DOMDisplay
{constructor(s=null)
{super();this.label;this._frames=[];this._paused=true;this._replay_time=0;this[reverse_play]=false;this._frame=this._current_frame=1;if(s)this.setFrames(s);}
get reverse()
{return this[reverse_play];}
set reverse(value)
{if(value==undefined||value==null||value==this[reverse_play])return;this[reverse_play]=Boolean(value);}
get totalFrame()
{return this._frames.length;}
clearAllFrames()
{if(this._frames==undefined)return;let value;while(this._frames.length>0){value=this._frames.pop();this._remove_frame(value);}
this._frame=this._current_frame=1;this._paused=true;}
setFrames(data)
{if(data==null)return;for(let i in data)this.addFrame(data[i]);if(this._frames.length>0)this.gotoAndPlay(1);}
addFrame(f,i)
{if(f==undefined||f==null||!(f instanceof Source))return;if(i==undefined)this._frames.push(f);else this._frames.splice(i,0,f);this.width=Math.max(this.width,f.frame_width,f.width);this.height=Math.max(this.height,f.frame_height,f.height);}
getFrame(i)
{return(i>=0&&i<this._frames.length)?this._frames[i]:null;}
removeFrame(i)
{if(i<0||i>=this._frames.length)return;let frame=this._frames.splice(i,1);this._remove_frame(frame);}
_remove_frame(frame)
{if(frame==undefined||frame==null)return;if(frame instanceof Source&&frame.isClone){ObjectPool.remove(frame);}
else if(frame instanceof DisplayObject){frame.removeFromParent(true);}}
play(time)
{this._replay_time=(time==undefined)?0:time;this._paused=false;}
stop()
{this._paused=true;}
gotoAndStop(index)
{if(this._frames==undefined)return;if(typeof index=="string"){let i;var len=this._frames.length;for(i=0;i<len;i++){if(this._frames[i]&&this._frames[i].label==index){index=Number(i)+1;break;}}}
if(index<1||index>this._frames.length)return;this._frame=index;this._paused=true;}
gotoAndPlay(index)
{this.gotoAndStop(index);this._paused=false;}
nextFrame()
{this._frame=this[reverse_play]?(this._current_frame<=1?this._frames.length:(this._current_frame-1)):(this._current_frame>=this._frames.length?1:(this._current_frame+1));}
render(object)
{if(!this.visible||this.alpha<=0){super.render(object);return;}
if((!this._paused||this.instance==null||(this._frame!=this._current_frame))&&this._frames.length>0){this._current_frame=this._frame;var target=this._frames[this._current_frame-1];this.setInstance(target);this.label=target.animation+(StringUtil.isEmpty(target.label)?"":(":"+target.label));if(!this._paused){this.nextFrame();if(((this[reverse_play]&&this._current_frame<=1)||(!this[reverse_play]&&this._current_frame>=this._frames.length))&&this._replay_time>0){this._replay_time--;if(this._replay_time==0){this._paused=true;this.dispatchEvent(Factory.c("ev",[Event.PLAY_OVER]));}}}}
super.render(object);}
reset()
{super.reset();this.clearAllFrames();this.label=null;this._paused=true;this._replay_time=0;this[reverse_play]=false;this._frame=this._current_frame=1;}
dispose()
{this.reset();super.dispose();delete this._frame,this[reverse_play],this._frames,this._paused,this._current_frame,this.label,this._replay_time;}
toString()
{return DOMMovie.name;}}
class DefsNode extends DOMDisplay
{constructor()
{super();this._defs=null;}
init()
{if(this.element)return this;this.element=SVGUtil.create("svg");this._defs=SVGUtil.create("defs");this.element.appendChild(this._defs);return this;}
get defs()
{return this._defs;}
addClipPath(vo)
{let clip=this.getClipPath(vo);if(clip)return;this._defs.appendChild(SVGUtil.create("clipPath",{id:(vo.id+ShapeVO.CILP),innerHTML:ShapeVO.string(vo)}));}
removeClipPath(vo)
{let clip=this.getClipPath(vo);if(!clip)return;this._defs.removeChild(clip);}
getClipPath(vo)
{if(!vo)return null;let id=vo.id+ShapeVO.CILP;let clip=SVGUtil.getElementsById(this._defs,"clipPath",id);return clip;}
reset()
{this._defs.innerHTML="";}
dispose()
{super.dispose();delete this._defs;}}
var _graphics=Symbol("graphics");class DisplayObject extends DisplayBase
{constructor()
{super();this.use_canvas=true;this._repeat=false;this._mask=null;this.name=UniqueUtil.getName("display_object");this.colorTransform=null;this[_graphics]=null;this.blendMode=null;this._context=null;this.polyArea=null;this._cache=null;this.canvas=null;this.filters=[];}
set cache(bool)
{if(!bool&&!this._cache)return;this.canvas=null;if(!bool){ObjectPool.remove(this._cache);this._cache=null;return;}
if(bool&&bool instanceof RenderObject){if(this._cache)ObjectPool.remove(this._cache);this._cache=bool;this.canvas=this._cache.canvas;return;}
if(!this._cache){this._cache=RenderObject.instance;if(!this._cache)return;}
else this._cache.clear();this._cache.setSize(this.width,this.height);this._render(this._cache,true);this.canvas=this._cache.canvas;}
get mask()
{return this._mask;}
set mask(value)
{if(!value||!(value instanceof ShapeVO)||!this.instance){this._mask=null;return;}
this._mask=value;this.__checkDisplayUpdate();}
get graphics()
{this[_graphics]=(!this[_graphics]?ObjectPool.create(GraphicsVO):this[_graphics]);return this[_graphics];}
set graphics(value)
{this[_graphics]=(value&&!(value instanceof GraphicsVO)?null:value);}
get context()
{this._context=(!this._context?ObjectPool.create(ContextVO):this._context)
return this._context;}
set context(value)
{this._context=value;}
repeat(w,h,t)
{if(this.instance==undefined||t=="no-repeat"||(w<=this.instance.width&&h<=this.instance.height)){this._repeat=false;return;}
t=t||"repeat";this.width=w;this.height=h;this._repeat=true;this.graphics.reset();this.graphics.beginBitmapFill(this.instance.image,t);this.graphics.drawRect(0,0,this.width,this.height);this.graphics.endFill();}
_transform(target,obj)
{let _temp_context=(obj==undefined?this.stage.context:obj.context);let mtx=this.getMatrix(target,true);_temp_context.transform(mtx.a,mtx.b,mtx.c,mtx.d,mtx.tx,mtx.ty);_temp_context.globalAlpha*=this.alpha*this._parent_alpha;}
setInstance(target)
{if(target&&(target instanceof Source)&&!target.image)target=null;if(this.instance!=target){if(this.instance&&(this.instance instanceof Source)&&this.instance.isClone){ObjectPool.remove(this.instance);}
this.instance=null;this.width=this.height=0;}
if(target==undefined||target==null||this.instance==target)return target;if(target instanceof Image||ClassUtil.getQualifiedClassName(target)=="HTMLImageElement"){let temp=target;target=ObjectPool.create(Source);target.image=temp;target.isClone=true;target.width=temp.width;target.height=temp.height;}
if(this.instance&&(this.instance instanceof Source)&&this.instance.isClone){ObjectPool.remove(this.instance);}
this.instance=target;if(!StringUtil.isEmpty(target.name))this.name=target.name;if(!this.register_point)this.register_point=ObjectPool.create(Point);this.register_point.set(target.regX,target.regY);this.width=this.instance.width;this.height=this.instance.height;this.updateMatrix=true;this.__checkDisplayUpdate();this.dispatchEvent(Factory.c("ev",[DisplayBase.RESET_INSTANCE]));return this.instance;}
do_actions(target,vo,bool=false)
{if(!target||!target.context||!vo)return;var canvas=(bool?target:target.context);var params=vo.getValue();let action;if(params){for(let i in params){if(canvas[i]==params[i])continue;canvas[i]=params[i];}}
for(action of vo.actions)
{canvas[action.method].apply(canvas,action.data);}}
_render(target=null,initial=false,upper=null)
{if(!this.visible||this.alpha<=0||(!target&&!this.stage))return;if(target==undefined)this.stage.context.save();if(!initial)this._transform(upper,target);if(this._mask){(target?target:this.stage.graphics).drawShape(this._mask);(target?target.context:this.stage.context).clip();}
if(target==undefined){this.stage.context.globalCompositeOperation=this.blendMode;}
if(this.filters&&this.filters.length>0){let filter;for(filter of this.filters)
{if(filter==undefined)continue;filter.show(target!=undefined?target.context:this.stage.context);}}
if(this.canvas){(target!=undefined?target.context:this.stage.context).drawImage(this.canvas,0,0);}
else if(this[_graphics]){this.do_actions(target?target:this.stage.graphics,this.graphics,true);}
else if(this.instance){(target!=undefined?target.context:this.stage.context).drawImage(this.instance.image,this.instance.x,this.instance.y,this.instance.width,this.instance.height,0,0,this.instance.width/this.instance.scale,this.instance.height/this.instance.scale);}
else if(this.context){this.do_actions(target?target:this.stage,this.context);}
if(target==undefined)this.stage.context.restore();}
render()
{this._render.apply(this,arguments);}
hitTestPoint(x,y)
{return CollisionUtil.hitTestPoint(this,x,y,this.usePolyCollision)>0;}
hitTestObject(obj)
{if(obj==null||!(obj instanceof DisplayBase))return false;if(obj==this)return true;return CollisionUtil.hitTestObject(this,obj,this.usePolyCollision);}
reset()
{super.reset();if(this._parent){this.removeFromParent(false);}
if(this.canvas&&this.canvas.parentNode){this.canvas.parentNode.removeChild(this.canvas);}
if(this.instance&&(this.instance instanceof Source)&&this.instance.isClone){ObjectPool.remove(this.instance);}
if(this._mask&&this._mask instanceof ShapeVO){ObjectPool.remove(this._mask);}
if(this[_graphics]){ObjectPool.remove(this[_graphics]);}
if(this.context){ObjectPool.remove(this.context);}
if(this._cache){ObjectPool.remove(this._cache);}
this.mask=this.instance=this._cache=this[_graphics]=this.colorTransform=this._context=this.canvas=this.blendMode=null;this.use_canvas=true;this._repeat=false;this.filters=[];}
dispose()
{this.reset();super.dispose();delete this._repeat,this._cache,this.filters,this._mask,this.instance,this.colorTransform,this.blendMode,this._context,this.canvas;}
toString()
{return DisplayObject.name;}}
class MediaManager
{constructor()
{this.cache_list=[];this.global_volume=1;}
add(media)
{if(!media||this.cache_list.indexOf(media)>=0)return;media.setVolume(this.global_volume);this.cache_list.push(media);}
remove(media)
{if(!media||this.cache_list.indexOf(media)<0)return;this.cache_list.splice(this.cache_list.indexOf(media),1);}
stopOther(media)
{if(!media||this.cache_list.length<2)return;ArrayUtil.each(this.cache_list,function(item){if(item!=media&&item.playing)item.stop();},this);}
stopAll()
{if(this.cache_list.length<1)return;ArrayUtil.each(this.cache_list,function(item){if(item.playing)item.stop();},this);}
setVolume(volume)
{this.global_volume=volume;ArrayUtil.each(this.cache_list,function(item){item.setVolume(this.global_volume);},this);}
dispose()
{this.stopAll();this.cache_list=this.global_volume=null;delete this.cache_list,this.global_volume;}}
class Media extends DisplayObject
{constructor()
{super();this.__over_handler=this.__update_handler=this.__load_handler=this.__error_handler=null;this.loadFail=this.once=this.auto_play=this.is_init=this.loading=this.loaded=this.playing=false;this.list=this._type=this.element=null;this.auto_next=true;this.seed_time=0;this.length=0;this.current=0;this.volume=1;this.delay_id=0;this.delay_max=30;this.delay_count=0;this.delay_time=500;}
init()
{if(this.is_init)return;this.is_init=true;this.name=UniqueUtil.getName(this._type);this.element=document.createElement(this._type);this.element.id=this.name;this.element.controls="";this.element.preload="auto";this.list=[];Media.Container.add(this);this.canvas=this.element;this.__delay_handler=Global.delegate(this._delay,this);this.__over_handler=Global.delegate(this._play_over,this);this.__load_handler=Global.delegate(this._load_handler,this);this.__update_handler=Global.delegate(this._time_update,this);this.__error_handler=Global.delegate(this._error_handler,this);this.element.addEventListener("error",this.__error_handler,false);}
_delay()
{if(this.element.readyState>0){this._load_complete();return;}
if(this.delay_count<=0){trace("[ERROR] MEDIA ERROR !!");this.dispatchEvent(Factory.c("ev",[Media.MEDIA_ERROR]));return;}
this.delay_count--;this.delay_id=setTimeout(this.__delay_handler,this.delay_time);}
_load_handler(e)
{this.length=(this.element.duration==null)?0:Math.max(0,this.element.duration);if(e.type.indexOf("canplay")!=0||this.loaded)return;this._load_complete();}
_load_complete()
{this.dispatchEvent(Factory.c("ev",[Media.MEDIA_LOAD_COMPLETE]));if(this.delay_id)clearTimeout(this.delay_id);this.delay_id=0;this.loaded=true;this.loading=false;if(this.auto_play&&!this.playing){if(this.once)this.auto_play=this.once=false;this.play();}}
_error_handler(e)
{this.loading=false;this.loadFail=true;trace("[ERROR] Media");this.dispatchEvent(Factory.c("ev",[Media.MEDIA_ERROR]));if(this.auto_next&&this.list.length>1){this.current=(this.current>=this.list.length?0:this.current+1);this._start_load();}
else this.close();}
_play_over(e)
{this.dispatchEvent(Factory.c("ev",[Media.MEDIA_PLAY_COMPLETE]));if(this.auto_next&&this.list.length>1){this.current=(this.current>=this.list.length?0:this.current+1);this._start_load();}
else this.close();}
_time_update(e)
{this.length=(this.element.duration==null)?0:Math.max(0,this.element.duration);this.seed_time=this.element.currentTime;}
setVolume(v)
{if(this.volume==v)return;this.volume=v;if(this.playing){this.element.volume=this.volume;if(this.volume>0)this.element.muted=false;}}
getVolume()
{return this.volume;}
setCurrentTime(t)
{if(this.element&&t!=null&&t>=0&&t<this.length){try{this.element.currentTime=t;}
catch(err){};}}
getCurrentTime()
{return this.element?this.element.currentTime:0;}
load(args)
{if(!this.is_init)this.init();if(typeof args=="number"){if(!this.loading){let old=this.current;this.current=args;if(!this._start_load())this.current=old;}
return;}
if(typeof args=="string"&&args.indexOf(",")>0){args=args.split(",");}
if(!(args instanceof Array)){if(typeof args=="string"){args={url:args};}
args=[args];}else{ArrayUtil.each(args,function(item,index){if(typeof item=="string")args[index]={url:item};});}
for(let source,obj,type,bool,i=0,l=args.length;i<l;i++){obj=args[i];if(StringUtil.isEmpty(obj.url))continue;type=this._type+'/'+this._fit_name(StringUtil.getPathExt(obj.url))+("codecs"in obj?';codecs="'+obj.codecs+'"':'');bool=this.element.canPlayType(type);if(!bool&&obj.url.indexOf("blob:")!=0)continue;if(bool){source=DOMUtil.createDOM("source",{type:type,src:obj.url});this.element.appendChild(source);}
this.list.push(obj);}
if(!this.loading&&this.list.length>0)this._start_load();else if(args.length>0&&this.list.length==0){this.dispatchEvent(Factory.c("ev",[Media.MEDIA_ERROR]));}}
_fit_name(name)
{switch(name)
{case"mov":return"quicktime";case"3gp":return"3gpp";case"mid":return"midi";case"ogv":return"ogg";case"m4a":return"acc";default:return name;}}
_start_load()
{if(!this.element||this.current<0||this.list.length==0||this.current>=this.list.length){return false;}
this.close();this.loading=true;this.element.addEventListener("loadedmetadata",this.__load_handler,false);this.element.addEventListener("canplaythrough",this.__load_handler,false);this.element.addEventListener('loadeddata',this.__load_handler,false);this.element.addEventListener("canplay",this.__load_handler,false);this.element.src=this.list[this.current].url;this.element.load();if(Global.ios){this.delay_count=this.delay_max;this.delay_id=setTimeout(this.__delay_handler,this.delay_time);}
return true;}
close()
{if(!this.element)return;this.element.removeEventListener("loadedmetadata",this.__load_handler);this.element.removeEventListener("canplaythrough",this.__load_handler);this.element.removeEventListener("loadeddata",this.__load_handler);this.element.removeEventListener("canplay",this.__load_handler);if(this.delay_id)clearTimeout(this.delay_id);this.delay_id=0;if(this.playing)this.stop();this.loadFail=this.loaded=this.loading=this.playing=false;this.seed_time=0;}
play(bool)
{if(!this.element)return;if(!this.loaded){if(!this.loading&&this.list.length>0){if(!this.auto_play){this.once=this.auto_play=true;}
this._start_load();}
return;}
if(this.playing)this.stop();if(bool)this.seed_time=0;if(this.seed_time>0){try{this.element.currentTime=this.seed_time;}
catch(err){}}
this.element.addEventListener("timeupdate",this.__update_handler,false);this.element.addEventListener("ended",this.__over_handler,false);if(this.volume>0)this.element.volume=this.volume;else this.element.muted=true;this.playing=true;this.element.play();}
stop()
{if(!this.element)return;this.seed_time=this.element.currentTime;this.element.removeEventListener("timeupdate",this.__update_handler);this.element.removeEventListener("ended",this.__over_handler);this.playing=false;this.element.pause();}
dispose()
{this.close();super.dispose();this.list=this.canvas=null;Media.Container.remove(this);delete this.delay_id,this.delay_max,this.delay_count,this.delay_time,this.loadFail,this.once,this.loaded,this.list,this.loading,this.playing,this.element,this.seed_time,this.length,this.current,this.volume,this.auto_play,this._type,this.auto_next,this.__over_handler,this.__update_handler,this.__load_handler,this.__error_handler;}}
Media.MEDIA_ERROR="mediaError";Media.MEDIA_LOAD_COMPLETE="mediaLoadComplete";Media.MEDIA_PLAY_COMPLETE="mediaPlayComplete";Media.Container=new MediaManager();class Video extends Media
{constructor()
{super();this._type="video";}
getWidth()
{return MathUtil.format(Math.abs(this.element.videoWidth*this.scaleX));}
getHeight()
{return MathUtil.format(Math.abs(this.element.videoHeight*this.scaleY));}
init()
{if(this.is_init)return;super.init();this.element.style.width='100%';this.element.style.height='100%';this.element.style.objectFit='fill';this.element.removeAttribute("controls");if(Global.os!=SystemType.OS_PC){this.element.setAttribute('playsinline',true);this.element.setAttribute('x-webkit-airplay','allow');this.element.setAttribute('webkit-playsinline',true);}
if(Global.isWeixin){this.element.setAttribute('x5-video-player-type','h5');this.element.setAttribute('x5-video-player-fullscreen',true);}}
_start_load()
{if(super._start_load()&&"poster"in this.list[this.current]){this.element.poster=this.list[this.current].poster;}}
dispose()
{if(this.element&&this.element.parentNode){this.element.parentNode.removeChild(this.element);delete this.element;}
super.dispose();}}
class WebAudio extends EventDispatcher
{constructor()
{super();this.__over_handler=this.__change_handler=this.bufferSource=this.buffer=this.volumeNode=this._ajax=this._audio_tag=this.element=null;this.loadFail=this.auto_play=this.is_init=this.loading=this.loaded=this.playing=false;this.currentSave=this.currentTime=0;this._type="web_audio";this.length=0;this.volume=1;}
init()
{if(this.is_init)return false;this.is_init=true;try{this.element=new Global.canUseWebAudio();}
catch(error){Global.canUseWebAudio=null;return true;}
this.name=UniqueUtil.getName(this._type);this.element.id=this.name;this._ajax=new Ajax();this._ajax.responseType=Ajax.ARRAY_BUFFER;this._audio_tag=document.createElement("audio");Media.Container.add(this);this.__over_handler=Global.delegate(this._over_handler,this);return false;}
_over_handler(e)
{this.close();this.dispatchEvent(Factory.c("ev",[Media.MEDIA_PLAY_COMPLETE]));}
load(url)
{if(!url)return false;if(!this.is_init&&this.init())return false;if(typeof url!=="string"){if(Object.prototype.toString.apply(url)=='[object AudioBuffer]'){this.onload(url);}else if(Object.prototype.toString.apply(url)=='[object ArrayBuffer]'){this.loading=true;this.element.decodeAudioData(url,Global.delegate(this.onload,this),Global.delegate(function(error){this.loadFail=true;this.loading=false;trace("[ERROR] WebAudio:AudioContext decodeAudioData error : "+error.toString());this.dispatchEvent(Factory.c("ev",[Media.MEDIA_ERROR]));},this));}
return false;}
let c,d,s=this,q={"mov":["quicktime"],"3gp":["3gpp"],"midi":["midi"],"mid":["midi"],"ogv":["ogg"],"m4a":["acc"],"mp3":["mpeg"],"wav":["wav","x-wav","wave"],"wave":["wav","x-wav","wave"],"aac":["mp4","aac"]};d=StringUtil.getPathExt(url);if(q[d]){d=q[d];}else{d=[d];}
c=d.some(function(name,index,array){return s._audio_tag.canPlayType("audio/"+name);});if(c||(!StringUtil.isEmpty(url)&&url.indexOf("blob:")==0)){this.loading=true;this._ajax.get(url,{},Global.delegate(this.onload,this),function(){s.loadFail=true;s.loading=false;trace("[ERROR] WebAudio: load audio fail.");s.dispatchEvent(Factory.c("ev",[Media.MEDIA_ERROR]));});}else{this.loadFail=true;trace("Not support "+d+" : "+url);this.dispatchEvent(Factory.c("ev",[Media.MEDIA_ERROR]));return false;}
return true;}
onload(data)
{if(Object.prototype.toString.apply(data)!=='[object AudioBuffer]'){this.load(data);return;};this.buffer=data;this.loaded=true;this.loading=this.loadFail=false;this.length=this.buffer.duration;this.dispatchEvent(Factory.c("ev",[Media.MEDIA_LOAD_COMPLETE]));this.removeEventListener(Media.MEDIA_LOAD_COMPLETE);if(this.auto_play)this.play();}
setCurrentTime(t)
{if(!(this.element&&t!=null&&t>=0&&t<this.length))return;try{this.element.currentTime=t;}
catch(err){};this.currentTime=t;};getCurrentTime()
{return this.currentTime;};setVolume(v)
{this.volume=v;if(this.playing&&this.volumeNode){this.volumeNode.gain.setValueAtTime(v,this.currentTime);}};getVolume()
{return this.volume;};play(bool)
{if(this.length==0||this.playing)return;if(bool)this.currentTime=0;this.element.loop=false;this.playing=true;this.bufferSource=this.element.createBufferSource();this.bufferSource.buffer=this.buffer;this.volumeNode=this.element.createGain();this.volumeNode.gain.setValueAtTime(this.volume,this.currentTime);this.volumeNode.connect(this.element.destination);this.bufferSource.connect(this.volumeNode);this.currentSave=this.element.currentTime;this.bufferSource.addEventListener("ended",this.__over_handler,false);if(this.bufferSource.start){this.bufferSource.start(0,this.currentTime%this.length);}else{this.bufferSource.noteGrainOn(0,this.currentTime%this.length);}};stop()
{if(!this.playing)return;try{if(this.bufferSource.stop)this.bufferSource.stop(0);else this.bufferSource.noteOff(0);}catch(err){};this.currentTime+=this.element.currentTime-this.currentSave;this.playing=false;this.bufferSource.removeEventListener("ended",this.__over_handler);}
close()
{if(this.playing)this.stop();this.currentTime=this.currentSave=0;}
dispose()
{this.close();super.dispose();this.element=null;Media.Container.remove(this);delete this.element,this._type,this.loadFail,this.auto_play,this.is_init,this.loading,this.loaded,this.playing,this.length,this.__over_handler,this.__change_handler,this.volume,this.timeout,this.volumeNode,this.currentSave,this.currentTime,this._ajax,this._audio_tag;}}
class Sound extends Media
{constructor()
{super();this._type="audio";}}
class DisplayObjectContainer extends DisplayBase
{constructor()
{super();this.name=UniqueUtil.getName("display_object_container");this.use_canvas=Global.useCanvas;this.mouseChildren=true;this.autoSize=false;this._parentNode=null;this._children=[];}
get stage()
{return this._stage;}
set stage(value)
{if(this._stage==value)return;this._stage=value;if(this._children==undefined||this._children.length<1)return;let i,c,l;for(i=0,l=this._children.length;i<l;i++){c=this._children[i];c.stage=value;}}
get alpha()
{return this._alpha;}
set alpha(value)
{if(this._alpha==value)return;this._alpha=value;this.__checkDisplayUpdate();this._update_parent_alpha();}
get visible()
{return this._visible;}
set visible(value)
{if(this._visible==value)return;this._visible=value;this.__checkDisplayUpdate();if(this._children.length<1)return;this._update_child_visible();}
get updateMatrix()
{return this._updateMatrix;}
set updateMatrix(value)
{if(value)this.__checkDisplayUpdate();if(this._updateMatrix==value)return;this._updateMatrix=value;if(value&&this._bounds)this._bounds.width=this._bounds.heigth=0;if(!value||this._children.length<1)return;let i,c,l;for(i=0,l=this._children.length;i<l;i++){c=this._children[i];c.updateMatrix=true;}}
get parentNode()
{return this._parentNode;}
set parentNode(value)
{if(this._parentNode==value)return;this._parentNode=value;if(this._children.length<1)return;let i,c,l;for(i=0,l=this._children.length;i<l;i++){c=this._children[i];if(!(c instanceof DisplayObject))c.parentNode=value;}}
get numChildren()
{return this._children.length;}
_update_parent_alpha()
{if(this._children.length<1)return;let i,c,l;for(i=0,l=this._children.length;i<l;i++){c=this._children[i];c._parent_alpha=this._alpha*this._parent_alpha;if(c instanceof DisplayObjectContainer)c._update_parent_alpha();}}
_update_child_visible()
{let i,c,l;for(i=0,l=this._children.length;i<l;i++){c=this._children[i];if(c instanceof DisplayObjectContainer)
c._update_child_visible();else if(c instanceof DOMDisplay)
c._update_visible();}}
addChild(displayObject)
{if(displayObject==undefined)return;return this.addChildAt(displayObject,this._children.length);}
addChildAt(displayObject,index)
{if(displayObject==undefined)return;displayObject.parent&&displayObject.parent.removeChild(displayObject);this._children.splice(index,0,displayObject);if(displayObject instanceof DisplayObject)DisplayObjectContainer._num_canvas_target++;else displayObject.parentNode=this._parentNode;displayObject.stage=this.stage;displayObject.parent=this;displayObject.updateMatrix=true;displayObject._parent_alpha=this._alpha*this._parent_alpha;if(this.autoSize){this._updateSize();}else{this.width=Math.max(this.width,displayObject.getWidth());this.height=Math.max(this.height,displayObject.getHeight());}
return displayObject;}
_updateSize()
{if(this._children==undefined||this._children.length==0)return;let i,c,l,bounds,rect=ObjectPool.create(Rectangle);for(i=0,l=this._children.length;i<l;i++){c=this._children[i];bounds=c.getBounds(this);rect=rect.union(bounds);}
this._minX=Math.floor(rect.x);this._minY=Math.floor(rect.y);this.width=Math.ceil(rect.width);this.height=Math.ceil(rect.height);ObjectPool.remove(rect);}
removeChild(displayObject)
{return this.removeChildAt(this._children.indexOf(displayObject));}
removeChildAt(index)
{if(index<0||index>(this._children.length-1))return null;let displayObject=this._children[index];displayObject.stage=displayObject.parent=null;this._children.splice(index,1);displayObject._parent_alpha=1;if(this._children.length==0)this.width=this.height=0;else if(this.autoSize)this._updateSize();if(displayObject instanceof DisplayObject)DisplayObjectContainer._num_canvas_target--;else displayObject.parentNode=null;return displayObject;}
getChildByName(name)
{if(StringUtil.isEmpty(name))return;let i;let len=this._children.length;for(i=0;i<len;i++)
{if(this._children[i].name==name)return this._children[i];}
return null;}
getChildAt(index)
{if(index<0||index>(this._children.length-1))return null;return this._children[index];}
removeAllChildren(bool)
{if(this._children==undefined||this._children.length<1)return;let i,c,l;for(i=0,l=this._children.length;i<l;i++){c=this._children[i];c.stage=c.parent=null;c._parent_alpha=1;if(c instanceof DisplayObject)DisplayObjectContainer._num_canvas_target--;else c.parentNode=null;if(bool&&!Global.gc(c)){try{c.dispose();}
catch(e){}}}
this._children=[];this.width=this.height=0;}
contains(displayObject)
{return this._children.indexOf(displayObject)!=-1;}
render(target)
{if(this._children==undefined||this._children.length==0)return;if(this.updateMatrix)this.getMatrix(target,true);let i,child;for(i=0;i<this._children.length;i++){child=this._children[i];if(!this.visible&&(child instanceof DisplayObject))continue;child.render(...arguments);}
this.updateMatrix=false;}
swapChildrenAt(index1,index2)
{var len=this._children.length;if(len==0||index1>=len||index1<0)return;index2=index2<0?0:(index2>=len?len-1:index2);var temp=this._children[index1];this._children[index1]=this._children[index2];this._children[index2]=temp;}
setChildIndex(child,index)
{var pos=this._children.indexOf(child);if(child==null||pos<0||pos==index)return;this._children.splice(pos,1);this._children.splice(index,0,child);}
getObjectUnderPoint(x,y,usePixelTrace,all)
{let g;if(all)g=[];for(let i=this._children.length-1;i>=0;i--){let h=this._children[i];if(h==null||!h.visible)continue;if((h instanceof DisplayObjectContainer)&&h.mouseChildren&&h.numChildren>0){let j=h.getObjectUnderPoint(x,y,usePixelTrace,all);if(j){if(!all)return j;if(j.length>0)g=g.concat(j);}else if(h.mouseEnabled&&h.hitTestPoint(x,y,usePixelTrace)){if(!all)return h;g.push(h);}}else if(h.mouseEnabled&&h.hitTestPoint(x,y,usePixelTrace)){if(!all)return h;g.push(h);}}
return all?g:null;}
hitTestPoint(x,y,usePixelTrace)
{if(this._children.length<=0)return false;if(!this.mouseChildren&&this.autoSize){return CollisionUtil.hitTestPoint(this,x,y,this.usePolyCollision)>0;}
for(let i=this._children.length-1;i>=0;i--){let h=this._children[i];if(this.usePolyCollision&&!h.usePolyCollision)h.usePolyCollision=true;if(h.hitTestPoint(x,y,usePixelTrace))return true;}
return false;}
hitTestObject(obj,usePixelTrace)
{let i,h,j,g;for(i=this._children.length-1;i>=0;i--){h=this._children[i];if(!(obj instanceof DisplayObjectContainer)){if(h.hitTestObject(obj,usePixelTrace))return true;continue;}
for(j=obj._children.length-1;j>=0;j--){g=obj._children[i];if(h.hitTestObject(g,usePixelTrace))return true;}}
return false;}
catchAsImage()
{if(this._children.length<=1)return;this._updateSize();var image=CanvasUtil.containerToImage(this);this.removeAllChildren(true);let display_obj=Factory.c("do");display_obj.setInstance(image);this.addChild(display_obj);}
reset()
{this.parentNode=null;this.removeAllChildren(true);this.name=null;this.autoSize=false;this.mouseChildren=true;this.use_canvas=Global.useCanvas;super.reset();}
dispose()
{super.dispose();delete this.use_canvas,this._parentNode,this.autoSize,this._children,this.mouseChildren;}
toString()
{return DisplayObjectContainer.name;}}
DisplayObjectContainer._num_canvas_target=0;class Sprite extends DisplayObjectContainer
{constructor()
{super();this._defs=this._rect=this._mask=this.div=null;}
get maskRect()
{return(this._mask?(this._mask instanceof Rectangle?this._mask:this._rect):null);}
set maskRect(value)
{if(value){this._rect=new Rectangle(value.x,value.y,value.width,value.height);this.setSize(this._rect.width,this._rect.height);}
else this._rect=value;}
get defs()
{if(!this._defs&&!this.use_canvas){this._defs=ObjectPool.create(DefsNode).init();this.addChild(this._defs);}
return this._defs;}
get parentNode()
{return this._parentNode;}
set parentNode(value)
{if(this._parentNode==value)return;this._parentNode=value;if(this._parentNode&&this.div){if(this.div.parentNode)this.div.parentNode.removeChild(this.div);this._parentNode.appendChild(this.div);}}
get parent()
{return this._parent;}
set parent(value)
{if(this._parent==value)return;this._parent=value;if(this.use_canvas)return;if(this._parent==undefined){if(this.div&&this.div.parentNode)this.div.parentNode.removeChild(this.div);return;}
if(this.div==undefined){this.div=DOMUtil.createDOM("div",{id:"sprite_"+this.name});}
this.div.style.position=Global.position;let node=this._parentNode?this._parentNode:(this._parent.parentNode?this._parent.parentNode:(this._parent.div?this._parent.div:(this.stage?this.stage.div:null)));if(node)node.appendChild(this.div);if(this._mask&&(this._mask instanceof Rectangle)&&this.div){this.width=Math.ceil(this._mask.width);this.height=Math.ceil(this._mask.height);this.div.style.width=this.width+"px";this.div.style.height=this.height+"px";this.div.style.overflow="hidden";}}
get mask()
{return this._mask;}
set mask(value)
{if(value&&(value instanceof ShapeVO)){value=([SVGLabel.RECT,SVGLabel.CIRCLE,SVGLabel.ELLIPSE,SVGLabel.POLYGON,SVGLabel.PATH].indexOf(value.type)<0?null:value);}
if(this._mask&&this._mask!=value&&(this._mask instanceof Rectangle)&&this.div){this.div.style.overflow="auto";ObjectPool.remove(this._mask);}
if(this._mask&&(this._mask instanceof ShapeVO)&&this._mask!=value){if(!this.use_canvas)this.defs.removeClipPath(this._mask);ObjectPool.remove(this._mask);}
let bool=(this._mask!=null&&this._mask!=undefined&&this._mask!='');this._mask=value;this.maskRect=(this._mask&&(this._mask instanceof ShapeVO)&&this._mask.rect?this._mask.rect:null);if(this._mask&&(this._mask instanceof ShapeVO)&&!this.use_canvas){this.defs.addClipPath(this._mask);}
this.updateMatrix=true;if(!this._mask||!(this._mask instanceof Rectangle)){if(!this._mask&&bool){if(!this.use_canvas)this.x+=0.00001;this.__checkDisplayUpdate();}
return;}
this.autoSize=false;this.width=Math.ceil(this._mask.width);this.height=Math.ceil(this._mask.height);if(this.use_canvas)return;this._mask.x=this._mask.y=0;if(this.div==undefined)return;this.div.style.overflow="hidden";this.div.style.width=this.width+"px";this.div.style.height=this.height+"px";}
get stage()
{return this._stage;}
set stage(value)
{if(this._stage==value)return;this._stage=value;let node=(this._parentNode?this._parentNode:(this._parent&&this._parent.parentNode?this._parent.parentNode:(this._parent&&this._parent.div?this._parent.div:(this.stage?this.stage.div:null))));if(this.div){if(this.div.parentNode&&(!value||(node&&this.div.parentNode!=node)))this.div.parentNode.removeChild(this.div);if(node&&!this.div.parentNode&&value&&this._parent)node.appendChild(this.div);}
if(this._children==undefined||this._children.length<1)return;let i,c,l;for(i=0,l=this._children.length;i<l;i++){c=this._children[i];c.stage=value;}}
addChildAt(displayObject,index)
{let obj=super.addChildAt(displayObject,index);if(this.use_canvas)return obj;if(this.div==undefined){this.div=DOMUtil.createDOM("div",{id:"sprite_"+this.name});}
if(obj)obj.parentNode=this.div;return obj;}
render(target,object)
{if(this._children==undefined||this._children.length==0)return;if(!this.visible){if(this.div)this.div.style.display="none";return;}
var has_change=(this.updateMatrix||this._refresh);var matrix=this.getMatrix(target,true);if(this._mask&&this.use_canvas){let points,obj=(object?this.getMatrix(object):matrix).applyDisplay();obj.center=ObjectPool.create(Point);if(this._mask instanceof Rectangle){let copy=this._mask.clone();copy.multiply(obj.scaleX,obj.scaleY);let radians=MathUtil.getRadiansFromDegrees(obj.rotation);points=copy.rotation(radians,obj.center,obj,obj.scaleX<0,obj.scaleY<0);ObjectPool.remove(copy);}
(target?target.context:this.stage.context).save();if(this._mask instanceof Rectangle)(target?target:this.stage.graphics).drawPath(points,true);else if(this._mask instanceof ShapeVO)(target?target:this.stage.graphics).drawShape(this._mask,obj);(target?target.context:this.stage.context).clip();ObjectPool.remove(obj.center);obj.center=null;}
if(!this.use_canvas){DOMDisplay._depth_count++;if(this.div){if(this.div.style.display!="")this.div.style.display="";this.div.style.zIndex=Global.layer+DOMDisplay._depth_count;if(has_change){this._refresh=false;var prefix=Global.cssPrefix,transform=(prefix===""?"transform":prefix+"Transform"),origin=(prefix===""?"transformOrigin":prefix+"TransformOrigin");this.div.style[prefix+"ClipPath"]=this.div.style["clipPath"]=(this._mask&&this._mask instanceof ShapeVO?"url(#"+this._mask.id+ShapeVO.CILP+")":"");if(Global.supportTransform){this.div.style[origin]="0% 0%";this.div.style.top=this.div.style.left="0px";this.div.style[transform]=matrix.toCSS();}else{this.div.style.top=matrix.ty+"px";this.div.style.left=matrix.tx+"px";}}}}
let i,len;len=this._children.length;for(i=0;i<len;i++){this._children[i].render.apply(this._children[i],(!this.use_canvas?[this]:[target,false,object]));}
if(this._mask&&this.use_canvas){(target?target.context:this.stage.context).restore();}}
getObjectUnderPoint(x,y,usePixelTrace,all)
{if(this.maskRect&&this._checkTouch(x,y,usePixelTrace))return null;return super.getObjectUnderPoint(x,y,usePixelTrace,all);}
hitTestPoint(x,y,usePixelTrace)
{if(this.maskRect&&this._checkTouch(x,y,usePixelTrace))return false;return super.hitTestPoint(x,y,usePixelTrace);}
_checkTouch(x,y,usePixelTrace)
{let bounds=this.maskRect.clone();let obj=this.getMatrix().applyDisplay();bounds.multiply(obj.scaleX,obj.scaleY);let data,radians=MathUtil.getRadiansFromDegrees(obj.rotation);if(usePixelTrace){data=Rectangle.rectangleByRadians(bounds,radians,null,obj,obj.scaleX<0,obj.scaleY<0);ObjectPool.remove(bounds);}else if(radians==0){bounds.x=obj.x;bounds.y=obj.y;data=bounds;}else{let points=bounds.rotation(radians,null,obj,obj.scaleX<0,obj.scaleY<0);data=Rectangle.createRectangle(points[0],points[1],points[2],points[3]);ObjectPool.remove(bounds);}
return CollisionUtil.hitTestPoint(data,x,y,usePixelTrace)<0;}
dispose()
{if(this._mask&&this._mask instanceof ShapeVO){ObjectPool.remove(this._mask);}
if(this.div&&this.div.parentNode){this.div.parentNode.removeChild(this.div);}
this.mask=null;super.dispose(this);delete this._defs,this._mask,this.div,this.svg,this._rect;}}
class UIBase extends Sprite
{constructor()
{super();this._auto_dispose=true;this._register_instance=null;}
get instance()
{return this._register_instance;}
set instance(value)
{let depth=null;if(this._register_instance!=null){if(this._register_instance.parent){depth=this._register_instance.getIndex();depth=Math.max(0,depth);this._register_instance.removeFromParent(this._auto_dispose);}
this._register_instance=null;}
if(value==null)return;this._register_instance=value;if(depth!=null&&!isNaN(""+depth))this.addChildAt(this._register_instance,depth);else this.addChild(this._register_instance);this._updateSize();this.initialize();}
initialize(){}
dispose()
{this._register_instance.removeFromParent(true);this._register_instance=null;super.dispose();delete this._register_instance,this._auto_dispose;}
toString()
{return UIBase.name;}}
class UIContainer extends UIBase
{constructor()
{super();this.back_time=0.16;this.out_percent=0.5;this.time_ratio=0.0014;this.inertia_ratio=1.2;this.min_migration_length=1;this.max_migration_length=10;this.back_ease="easeoutquad";this._orientation=0;this._overflow=false;this._press_point=null;this._drag_area=null;this._inertia=false;this._drag_time=0;this._initial_width=this._initial_height=this._mask_width=this._mask_height=0;}
setDimension(w,h,orientation,overflow,inertia)
{this._initial_width=this._mask_width=w;this._initial_height=this._mask_height=h;this._inertia=inertia;this._overflow=overflow;this.max_migration_length=Math.floor(Math.max(w,h)*1.2);if(orientation!=undefined)this._orientation=orientation;if(this._register_instance!=undefined)this._control_orientation();}
initialize()
{if(this._register_instance&&(this._register_instance instanceof DisplayObjectContainer))this._register_instance._updateSize();if(this._register_instance!=undefined&&this._mask_width>0&&this._mask_height>0)this._control_orientation();}
_control_orientation()
{if(this._mask_width>0&&this._mask_height>0){let rect=this._mask?this._mask:new Rectangle();rect.height=this._mask_height;rect.width=this._mask_width;this.mask=rect;}
if(this._orientation==0)return;this._register_instance.addEventListener(DisplayBase.RESIZE,Global.delegate(this._reset_hold_control,this),this.name);this._reset_hold_control(null);}
_reset_hold_control(e)
{let bool=(((this._orientation==UIOrientation.isX||this._orientation==UIOrientation.isXY)&&this._register_instance.width>this._mask_width)||((this._orientation==UIOrientation.isY||this._orientation==UIOrientation.isXY)&&this._register_instance.height>this._mask_height));this.mouseEnabled=this._register_instance.mouseEnabled=bool;if(bool){if(!this._register_instance.hasEventListener(StageEvent.MOUSE_DOWN))
this._register_instance.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._mouse_drag_handler,this),this.name);}
else{this._register_instance.removeEventListener(StageEvent.DRAG_MOVE,null,this.name);this._register_instance.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);}}
_mouse_drag_handler(e)
{let pos=this.localToGlobal(0,0);let pos2=this._register_instance.localToGlobal(0,0);let w=(this._orientation==UIOrientation.isY)?0:Math.max(0,this._register_instance.getWidth()-this._mask_width);let h=(this._orientation==UIOrientation.isX)?0:Math.max(0,this._register_instance.getHeight()-this._mask_height);let free;if(this._overflow){free=new Rectangle(w>0?pos.x-w:pos2.x,h>0?pos.y-h:pos2.y,w,h);}
w=w>0?w+(this._overflow?this._mask_width*this.out_percent:0):0;h=h>0?h+(this._overflow?this._mask_height*this.out_percent:0):0;let rect=new Rectangle(w>0?pos.x-w:pos2.x,h>0?pos.y-h:pos2.y,w>0?w+(this._overflow?this._mask_width*this.out_percent:0):0,h>0?h+(this._overflow?this._mask_height*this.out_percent:0):0);if(this._inertia){this._drag_area=free?free:rect;this._drag_time=new Date().getTime();this._press_point=new Point(e.mouseX,e.mouseY);}
TweenLite.remove(this._register_instance);this._register_instance.addEventListener(StageEvent.DRAG_MOVE,Global.delegate(this._drag_move_handler,this),this.name);(this.stage?this.stage:Stage.current).startDrag(this._register_instance,rect,false,free);(this.stage?this.stage:Stage.current).addEventListener(StageEvent.MOUSE_UP,Global.delegate(this._mouse_up_handler,this),this.name);}
_drag_move_handler(e)
{this.dispatchEvent(Factory.c("ev",[UIContainer.DRAG_MOVE]));}
_mouse_up_handler(e)
{if(e){let bool=true,posX,posY;if(this._overflow){posX=this._register_instance.x>=0?0:(this._register_instance.x<(this._mask_width-this._register_instance.getWidth())?(this._mask_width-this._register_instance.getWidth()):this._register_instance.x);posY=this._register_instance.y>=0?0:(this._register_instance.y<(this._mask_height-this._register_instance.getHeight())?(this._mask_height-this._register_instance.getHeight()):this._register_instance.y);if(posX!=this._register_instance.x||posY!=this._register_instance.y){bool=false;TweenLite.to(this._register_instance,this.back_time,{ease:this.back_ease,x:posX,y:posY});}}
if(this._inertia&&bool){posX=e.mouseX-this._press_point.x;posY=e.mouseY-this._press_point.y;let length=MathUtil.format(Math.sqrt(posX*posX+posY*posY));let time=new Date().getTime()-this._drag_time;let speed=length/time;if(length>8){let data=this._count_speed(posX,posY,speed);TweenLite.to(this._register_instance,data.time,{ease:this.back_ease,x:data.x,y:data.y});}}}
else if(this._overflow){TweenLite.remove(this._register_instance);}
this._drag_time=0;this._drag_area=null;this._press_point=null;(this.stage?this.stage:Stage.current).stopDrag();(this.stage?this.stage:Stage.current).mouseTarget=null;(this.stage?this.stage:Stage.current).removeEventListener(StageEvent.MOUSE_UP,null,this.name);this._register_instance.removeEventListener(StageEvent.DRAG_MOVE,null,this.name);}
_count_speed(offsetX,offsetY,speed)
{let data={};speed=MathUtil.clamp(speed,0.3,4.5);data.x=offsetX*speed*this.inertia_ratio;data.y=offsetY*speed*this.inertia_ratio;Point.clamp(data,this.min_migration_length,this.max_migration_length);data.x=MathUtil.format(this._register_instance.x+data.x);data.y=MathUtil.format(this._register_instance.y+data.y);if(this._drag_area){let point=this.globalToLocal(Rectangle.innerPoint(this._drag_area,this.localToGlobal(data.x,data.y)));data.x=MathUtil.format(point.x);data.y=MathUtil.format(point.y);}
let length=Math.sqrt((data.x-this._register_instance.x)*(data.x-this._register_instance.x)+(data.y-this._register_instance.y)*(data.y-this._register_instance.y));data.time=Math.min(1,MathUtil.format((length/speed)*this.time_ratio));return data;}
moveTo(x,y)
{super.moveTo(x,y);if(this._register_instance)this._register_instance.dispatchEvent(Factory.c("ev",[Event.RESIZE,{w:this._mask_width,h:this._mask_height},{x:this.x,y:this.y}]));}
render()
{if((this.scaleX!=1&&this.scaleX!=0)||(this.scaleY!=1&&this.scaleY!=0)){this._recovery_scale(true);}
super.render(...arguments);}
_recovery_pos()
{if(this._register_instance.x<0&&(this._register_instance.getWidth()+this._register_instance.x)<this._mask_width){this._register_instance.x=this._mask_width-this._register_instance.getWidth();}else if(this._register_instance.x>0&&(this._register_instance.getWidth()+this._register_instance.x)>this._mask_width){this._register_instance.x=0;}
if(this._register_instance.y<0&&(this._register_instance.getHeight()+this._register_instance.y)<this._mask_height){this._register_instance.y=this._mask_height-this._register_instance.getHeight();}else if(this._register_instance.y>0&&(this._register_instance.getHeight()+this._register_instance.y)>this._mask_height){this._register_instance.y=0;}}
_recovery_scale(bool)
{this._mask_width=MathUtil.format(this._initial_width*this.scaleX);this._mask_height=MathUtil.format(this._initial_height*this.scaleY);if(bool)this.scaleX=this.scaleY=1;this._recovery_pos();if(this._mask){this._mask.width=this._mask_width;this._mask.height=this._mask_height;this.mask=this._mask;}
if(this._register_instance!=undefined){this._reset_hold_control(null);this._register_instance.resize=true;this._register_instance.dispatchEvent(Factory.c("ev",[Event.RESIZE,{w:this._mask_width,h:this._mask_height},{x:this.x,y:this.y,r:this.rotation}]));}}
updateSizeInArea(area_width,area_height)
{this._initial_height=this.instance.getHeight();this._initial_width=this.instance.getWidth();let count=0;if(this._initial_width>area_width){this.scaleX=area_width/this._initial_width;count+=1;}
if(this._initial_height>area_height){this.scaleY=area_height/this._initial_height;count+=2;}
if(count<3&&count!=1)this._mask_width=this._initial_width;if(count<3&&count!=2)this._mask_height=this._initial_height;if(count==0)this._recovery_scale();}
dispose()
{if(this._register_instance){if(this._register_instance.hasEventListener(StageEvent.MOUSE_DOWN)){this._mouse_up_handler(null);this._register_instance.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);}
if(this._register_instance.hasEventListener(DisplayBase.RESIZE)){this._register_instance.removeEventListener(DisplayBase.RESIZE,null,this.name);}}
super.dispose();delete this._initial_width,this._initial_height,this.time_ratio,this.min_migration_length,this.max_migration_length,this.inertia_ratio,this._drag_area,this._press_point,this._inertia,this._drag_time,this.back_ease,this.out_percent,this.back_time,this._orientation,this._overflow,this._mask_width,this._mask_height;}}
UIContainer.DRAG_MOVE="drag_container";class BoxShape extends DisplayObjectContainer
{constructor()
{super();this._redius=0;this._thickness=0;this._fill_alpha=1;this.autoSize=true;this.syncSize=false;this.instance=this._stroke=this._pattern=this._pattern_src=this._color=null;this.use_canvas=Global.useCanvas;this.mouseChildren=false;this.repeat="repeat";this._dash=null;}
set resize(value)
{if(value&&this._resize!=value){if(this.instance&&this.instance instanceof DisplayObject)this.instance.graphics.reset();this.dispatchEvent(Factory.c("ev",[DisplayBase.RESIZE]));this.__checkDisplayUpdate();}
this._resize=value;}
get resize()
{return this._resize;}
get pattern()
{return this._pattern;}
set pattern(value)
{if(this._pattern&&this._pattern.parentNode){this._pattern.parentNode.removeChild(this._pattern);}
this.resize=true;this.__checkDisplayUpdate();this._pattern_src=this._pattern=null;if(value==null||!(value instanceof Image))return;this._pattern_src=value.src;let svg=SVGUtil.supported;if(this._fill_alpha==0)this._fill_alpha=1;this._pattern=value?(this.use_canvas?[value,this.repeat,this._fill_alpha]:(svg?SVGUtil.create("pattern",{id:this.name+"_pattern",width:value.width,height:value.height,patternUnits:"userSpaceOnUse"}):value)):value;if(this.instance.element==null)this.redraw();if(value&&!this.use_canvas&&svg&&this.instance.element){let image=SVGUtil.create("image",{x:0,y:0,width:value.width,height:value.height});image.setAttributeNS(SVGUtil.xlink,"href",value.src);this._pattern.appendChild(image);let defs=this.instance.element.getElementsByTagName('defs')[0];if(defs==undefined){defs=SVGUtil.create("defs");this.instance.element.appendChild(defs);}
defs.appendChild(this._pattern);}}
get redius()
{return this._redius;}
set redius(value)
{if(value==null)return;value=Math.min(value,Math.ceil(Math.min(this.width,this.height)*0.5));if(value==this._redius)return;this._redius=value;this.resize=true;}
get dash()
{return this._dash;}
set dash(value)
{if(value==this._dash)return;this._dash=value;this.resize=true;}
get color()
{return this._color;}
set color(value)
{this.pattern=null;if(typeof value=="string"&&StringUtil.isEmpty(value))this._fill_alpha=0;else if(this._fill_alpha==0)this._fill_alpha=1;if(value==null||this._color==value)return;this._color=this._format_color(value);}
get strokeColor()
{return this._stroke;}
set strokeColor(value)
{if(value==null||value==this._stroke)return;if(StringUtil.isEmpty(value))this.thickness=0;else if(this.thickness==0)this.thickness=1;this._stroke=this._format_color(value);this.resize=true;}
get thickness()
{return this._thickness;}
set thickness(value)
{if(value==null||value==this._thickness||isNaN(value))return;this._thickness=value;this.resize=true;}
setup(c,w,h,r=0,t=0,s="#000000",a=1)
{this._redius=r;this.thickness=t;this._stroke=this._format_color(s);this._fill_alpha=a;if(this.instance==null){this.instance=Factory.c("do");this.instance.hide_over=false;this.instance.setSize(w,h);this.addChild(this.instance);}
else this.instance.moveTo(0,0);this.width=w;this.height=h;this.resize=true;this._color=this._format_color(c)||"#FFFFFF";}
_format_color(c)
{if(!(c&&(c instanceof GColor)))return c;if(this.use_canvas)return ColorUtil.getGradientColor(c);if(this.instance==null||this.instance.element==null)return c;let defs=this.instance.element.getElementsByTagName('defs')[0];if(defs==undefined){defs=SVGUtil.create("defs");this.instance.element.appendChild(defs);}
let gradient=this.instance.element.getElementById(this.name+"_gradient");if(gradient&&gradient.parentNode)gradient.parentNode.removeChild(gradient);let obj={id:this.name+"_gradient"};if(c.type==0){obj.x1=MathUtil.int(100*c.xStart/c.radiusStart)+"%";obj.y1=MathUtil.int(100*c.yStart/c.radiusEnd)+"%";obj.x2=MathUtil.int(100*c.xEnd/c.radiusStart)+"%";obj.y2=MathUtil.int(100*c.yEnd/c.radiusEnd)+"%";}else{obj.fx=MathUtil.int(100*c.xStart/(c.radiusEnd*2))+"%";obj.fy=MathUtil.int(100*c.yStart/(c.radiusEnd*2))+"%";obj.cx=MathUtil.int(100*c.xEnd/(c.radiusEnd*2))+"%";obj.cy=MathUtil.int(100*c.yEnd/(c.radiusEnd*2))+"%";obj.r=MathUtil.int(100*(c.radiusStart*2)/c.radiusEnd)+"%";}
gradient=SVGUtil.create(c.type==0?"linearGradient":"radialGradient",obj);let i,sc,len=c.offsetlist.length;for(i=0;i<len;i++){sc=SVGUtil.create("stop",{"offset":c.offsetlist[i],"stop-color":c.colorList[i]});gradient.appendChild(sc);}
defs.appendChild(gradient);return"url(#"+this.name+"_gradient)";}
redraw()
{let w=this.syncSize?this.getWidth():this.width;let h=this.syncSize?this.getHeight():this.height;this.instance.width=MathUtil.int(w);this.instance.height=MathUtil.int(h);if(this.syncSize){this.instance.scaleX=1/this.scaleX;this.instance.scaleY=1/this.scaleY;}
let thickness=this.thickness*(this.syncSize?(this.scaleX+this.scaleY)*0.5:1);this.instance.moveTo(-thickness*0.5,-thickness*0.5);if(this.use_canvas&&this.instance.graphics){if(thickness>0){this.instance.graphics.lineStyle(thickness,this._stroke);}else this.instance.graphics.stroke_style=null;if(this._pattern)this.instance.graphics.beginBitmapFill(...this._pattern);else this.instance.graphics.beginFill(this._color,this._fill_alpha);if(this._redius>0)this.instance.graphics.drawRoundRect(thickness*0.5,thickness*0.5,w,h,this._redius);else this.instance.graphics.drawRect(thickness*0.5,thickness*0.5,w,h);this.instance.graphics.endFill();return;}
if(!SVGUtil.supported){if(this.instance.element==undefined)this.instance.element=DOMUtil.createDOM("div",{style:{backgroundColor:this._color,width:w+"px",height:h+"px"}});else{this.instance.element.style.backgroundColor=this._color;this.instance.element.style.backgroundImage=this._pattern?"url("+this._pattern.src+")":"";this.instance.element.style.backgroundRepeat=this.repeat;}
return;}
let rect;if(this.instance.element==undefined){this.instance.element=SVGUtil.create("svg",{style:{width:w+"px",height:h+"px"}});rect=SVGUtil.create("rect",{"stroke-dasharray":(!StringUtil.isEmpty(this._dash)?this._dash:''),x:0,y:0,rx:this._redius,ry:this._redius,width:w,height:h,style:{fill:this._format_color(this._color),fillOpacity:this._fill_alpha,stroke:this._stroke,strokeWidth:thickness}});this.instance.element.appendChild(rect);return;}
rect=this.instance.element.getElementsByTagName('rect')[0];rect.style.stroke=this._stroke;rect.style.strokeWidth=thickness;rect.style.fillOpacity=this._fill_alpha;rect.style.fill=this._pattern?'url(#'+this._pattern.id+')':this._format_color(this._color);rect.setAttribute("stroke-dasharray",!StringUtil.isEmpty(this._dash)?this._dash:'');rect.setAttribute("height",h+thickness);rect.setAttribute("width",w+thickness);rect.setAttribute("ry",this._redius);rect.setAttribute("rx",this._redius);if(this._parent&&this._parent.autoSize)this._parent._updateSize();}
clone()
{let copy=ObjectPool.create(BoxShape);copy.param=this.param;if(this.origin)copy.origin=this.origin.clone();copy.setup(this._color,this.width,this.height,this._redius,this.thickness,this._stroke,this._fill_alpha);copy.syncSize=this.syncSize;copy._dash=this._dash;if(this._pattern&&!StringUtil.isEmpty(this._pattern_src)){let img=new Image();img.onload=function(){this.onload=null;copy.pattern=img;}
img.src=this._pattern_src;}
return copy;}
render()
{if(this.syncSize&&(this.scaleX!=1||this.scaleY!=1)&&(this.instance.width!=this.getWidth()||this.instance.height!=this.getHeight())){this.resize=true;}
if(this.resize)this.redraw();super.render(...arguments);this.resize=false;}
reset()
{if(this.instance){this.instance.removeFromParent(true);this.instance=null;}
this._pattern_src=this._stroke=this.pattern=this._color=null;super.reset();this._dash=null;this._redius=0;this._thickness=0;this._fill_alpha=1;this.autoSize=true;this.syncSize=false;this.mouseChildren=false;this.repeat="repeat";this.use_canvas=Global.useCanvas;}
dispose()
{super.dispose();delete this.use_canvas,this.syncSize,this._dash,this._pattern_src,this._fill_alpha,this._thickness,this._stroke,this._color,this._redius,this._pattern,this.repeat;}
toString()
{return BoxShape.name;}}
class Shape extends DisplayObjectContainer
{constructor()
{super();this._thickness=0;this._fill_alpha=1;this._dash=this._rect=this._vo=this.instance=this._stroke=this._pattern=this._pattern_src=this._color=null;this.use_canvas=Global.useCanvas;this.mouseChildren=false;this.repeat="repeat";}
get pattern()
{return this._pattern;}
set pattern(value)
{if(this._pattern&&this._pattern.parentNode){this._pattern.parentNode.removeChild(this._pattern);}
this.resize=true;this.__checkDisplayUpdate();this._pattern_src=this._pattern=null;if(value==null||!(value instanceof Image))return;this._pattern_src=value.src;let svg=SVGUtil.supported;if(this._fill_alpha==0)this._fill_alpha=1;this._pattern=value?(this.use_canvas?[value,this.repeat,this._fill_alpha]:(svg?SVGUtil.create("pattern",{id:this.name+"_pattern",width:value.width,height:value.height,patternUnits:"userSpaceOnUse"}):value)):value;if(this.instance.element==null)this.redraw();if(value&&!this.use_canvas&&svg&&this.instance.element){let image=SVGUtil.create("image",{x:0,y:0,width:value.width,height:value.height});image.setAttributeNS(SVGUtil.xlink,"href",value.src);this._pattern.appendChild(image);let defs=this.instance.element.getElementsByTagName('defs')[0];if(defs==undefined){defs=SVGUtil.create("defs");this.instance.element.appendChild(defs);}
defs.appendChild(this._pattern);}}
set resize(value)
{if(value&&this._resize!=value){if(this.use_canvas&&this.instance)this.instance.graphics.reset();this.dispatchEvent(Factory.c("ev",[DisplayBase.RESIZE]));this.__checkDisplayUpdate();}
this._resize=value;}
get resize()
{return this._resize;}
get dash()
{return this._dash;}
set dash(value)
{if(value==this._dash)return;this._dash=value;this.resize=true;}
get color()
{return this._color;}
set color(value)
{this.pattern=null;if(typeof value=="string"&&StringUtil.isEmpty(value))this._fill_alpha=0;else if(this._fill_alpha==0)this._fill_alpha=1;if(value==null||this._color==value)return;this._color=this._format_color(value);}
get strokeColor()
{return this._stroke;}
set strokeColor(value)
{if(value==null||value==this._stroke)return;if(StringUtil.isEmpty(value))this.thickness=0;else if(this.thickness==0)this.thickness=1;this._stroke=this._format_color(value);this.resize=true;}
get thickness()
{return this._thickness;}
set thickness(value)
{if(value==null||value==this._thickness)return;this._thickness=value;this.resize=true;}
setup(vo,c,t,s,a)
{if(!vo)return this;if(this._vo&&this._vo instanceof ShapeVO){if(vo&&this._vo.type!=vo.type&&this.instance.element){this.instance.element=null;}
ObjectPool.remove(this._vo);}
this._vo=vo;let _style=this._vo.properties.style;_style=_style?_style:{};delete this._vo.properties.style;this._thickness=t==0?0:(t||_style.strokeWidth||0);this._stroke=this._format_color(s)||_style.stroke||"#000000";this._fill_alpha=(a==undefined)?(_style.fillOpacity||_style.opacity||this._fill_alpha):a;if(this.instance==null){this.instance=Factory.c("do",null,this.use_canvas);this.instance.hide_over=false;this.addChild(this.instance);}
else this.instance.moveTo(0,0);if(this._vo.rect){this._rect=this._vo.rect.clone();this.setSize(this._rect.width,this._rect.height);}
this._color=this._format_color(c)||_style.fill||"#FFFFFF";this.resize=true;return this;}
_format_color(c)
{if(!(c&&(c instanceof GColor)))return c;if(this.use_canvas)return ColorUtil.getGradientColor(c);if(this.instance==null||this.instance.element==null)return c;let defs=this.instance.element.getElementsByTagName('defs')[0];if(defs==undefined){defs=SVGUtil.create("defs");this.instance.element.appendChild(defs);}
let gradient=this.instance.element.getElementById(this.name+"_gradient");if(gradient&&gradient.parentNode)gradient.parentNode.removeChild(gradient);let obj={id:this.name+"_gradient"};if(c.type==0){obj.x1=MathUtil.int(100*c.xStart/c.radiusStart)+"%";obj.y1=MathUtil.int(100*c.yStart/c.radiusEnd)+"%";obj.x2=MathUtil.int(100*c.xEnd/c.radiusStart)+"%";obj.y2=MathUtil.int(100*c.yEnd/c.radiusEnd)+"%";}else{obj.fx=MathUtil.int(100*c.xStart/(c.radiusEnd*2))+"%";obj.fy=MathUtil.int(100*c.yStart/(c.radiusEnd*2))+"%";obj.cx=MathUtil.int(100*c.xEnd/(c.radiusEnd*2))+"%";obj.cy=MathUtil.int(100*c.yEnd/(c.radiusEnd*2))+"%";obj.r=MathUtil.int(100*(c.radiusStart*2)/c.radiusEnd)+"%";}
gradient=SVGUtil.create(c.type==0?"linearGradient":"radialGradient",obj);let i,sc,len=c.offsetlist.length;for(i=0;i<len;i++){sc=SVGUtil.create("stop",{"offset":c.offsetlist[i],"stop-color":c.colorList[i]});gradient.appendChild(sc);}
defs.appendChild(gradient);return"url(#"+this.name+"_gradient)";}
redraw()
{this.__checkDisplayUpdate();this.instance.width=this.width;this.instance.height=this.height;if(this.use_canvas&&this.instance.graphics){if(this._thickness>0){this.instance.graphics.lineStyle(this._thickness,this._stroke);}else this.instance.graphics.stroke_style=null;if(this._pattern)this.instance.graphics.beginBitmapFill(...this._pattern);else this.instance.graphics.beginFill(this._color,this._fill_alpha);this.instance.graphics.drawShape(this._vo);this.instance.graphics.endFill();return;}
if(!SVGUtil.supported)return;let shape;if(this.instance.element==undefined){this.instance.element=SVGUtil.create("svg",{style:{width:this.width+"px",height:this.height+"px"}});shape=SVGUtil.create(this._vo.type,this._vo.properties);this.instance.element.appendChild(shape);}
else{shape=this.instance.element.getElementsByTagName(this._vo.type)[0];if(this._vo.properties)SVGUtil.setAttributes(shape,this._vo.properties);}
shape.style.stroke=this._stroke;shape.style.strokeWidth=this._thickness;shape.style.fillOpacity=this._fill_alpha;shape.style.fill=this._pattern?'url(#'+this._pattern.id+')':this._format_color(this._color);shape.setAttribute("stroke-dasharray",!StringUtil.isEmpty(this._dash)?this._dash:'');if(this._parent&&this._parent.autoSize)this._parent._updateSize();}
clone()
{let copy=ObjectPool.create(Shape);copy.param=this.param;if(this.origin)copy.origin=this.origin.clone();copy.setup(this._vo.clone(),this._color,this._thickness,this._stroke,this._fill_alpha);copy._dash=this._dash;if(this._pattern&&!StringUtil.isEmpty(this._pattern_src)){let img=new Image();img.onload=function(){this.onload=null;copy.pattern=img;}
img.src=this._pattern_src;}
return copy;}
render()
{if(this.resize)this.redraw();super.render(...arguments);this.resize=false;}
reset()
{if(this._vo)ObjectPool.remove(this._vo);if(this._rect)ObjectPool.remove(this._rect);this._rect=this._vo=this._pattern_src=this._stroke=this.pattern=this._color=null;if(this.instance){this.instance.removeFromParent(true);this.instance=null;}
super.reset();this._dash=null;this._thickness=0;this._fill_alpha=1;this.autoSize=true;this.repeat="repeat";this.mouseChildren=false;this.use_canvas=Global.useCanvas;}
dispose()
{super.dispose();delete this.use_canvas,this._dash,this._rect,this._vo,this._pattern_src,this._fill_alpha,this._thickness,this._stroke,this._color,this._pattern,this.repeat;}
toString()
{return Shape.name;}}
class VideoPlayer extends DisplayObjectContainer
{constructor()
{super();this._changeState=this.bg=this.play_btn=this._instance=this._video=this._url=null;this.isStrict=this.control=this._is_loading=this._is_reload=false;this.seedTime=this._video_width=this._video_height=0;this.isStop=true;this._volume=1;}
get src()
{return this._url;}
set src(value)
{this._loading(value);}
get volume()
{return this._volume;}
set volume(value)
{if(value==null||this._volume==value)return;this._volume=value;if(this._video)this._video.setVolume(this._volume);}
get instance()
{return this._instance;}
_loading(path)
{if(this._is_loading||StringUtil.isEmpty(path)||this._url==path)return;this._is_loading=true;this._is_reload=false;this._url=path;let video=new Video();video.addEventListener(Media.MEDIA_LOAD_COMPLETE,Global.delegate(this._complete_handler,this));video.load(this._url);}
_complete_handler(e)
{e.target.removeEventListener(Media.MEDIA_LOAD_COMPLETE);this._is_loading=false;if(e.target&&!e.target.loadFail){this.load(e.target);return;}
if(this._is_reload){this.dispatchEvent(Factory.c("ev",[VideoPlayer.ERROR]));return;}
e.target.dispose();this._is_reload=true;this._is_loading=true;let video=new Video();video.addEventListener(Media.MEDIA_LOAD_COMPLETE,Global.delegate(this._complete_handler,this));video.load(this._url);}
load(video)
{if(video==null)return;let vh=video.getHeight();let vw=video.getWidth();if(this.isStrict&&(vh<=0||vw<=0||(Global.isPC&&(isNaN(video.length)||video.length<=0)))){this.dispatchEvent(Factory.c("ev",[VideoPlayer.ERROR]));return;}
if(vh)this._video_height=vh;if(vw)this._video_width=vw;if(this._instance){if(this._video&&!this.isStop)this.stop();this._instance.removeFromParent(true);}
this._video=video;this._volume=video.volume;this._video.element.controls=this.control?"controls":"";if(this._changeState==null)this._changeState=Global.delegate(this.__change_state,this);if(this.bg==null){this.bg=Factory.c("bs",["#000000",this._video_width,this._video_height]);this.addChild(this.bg);this.bg.mouseEnabled=true;this.bg.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this.onMouseClick,this));}else{this.bg.setSize(this._video_width,this._video_height);}
if(Global.useCanvas){this._instance=this._video;}else{this._instance=ObjectPool.create(DOMDisplay);this._instance.element=this._video.element;this._instance.setSize(this._video_width,this._video_height);}
this.addChild(this._instance);this.setSize(this._video_width,this._video_height);this.update_view(false);this._video.setVolume(this._volume);if(this.play_btn&&!this.play_btn.hasEventListener(StageEvent.MOUSE_CLICK)){this.play_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this.onMouseClick,this));}
this.dispatchEvent(Factory.c("ev",[VideoPlayer.READY]));}
updateSize(w,h)
{if(this._is_loading||this._video==null||!(w&&h))return;this.setSize(w,h);if(this.bg)this.bg.setSize(w,h);if(this._instance){let scale=MathUtil.getSizeScale(this._video_width,this._video_height,w,h,true);this._instance.scale=scale;this._instance.moveTo(Math.round((w-this._instance.getWidth())*0.5),Math.round((h-this._instance.getHeight())*0.5));}
if(this.play_btn&&this.contains(this.play_btn))this.play_btn.moveTo(Math.ceil((w-this.play_btn.getWidth())*0.5),Math.ceil((h-this.play_btn.getHeight())*0.5));}
onMouseClick(e)
{if(this._is_loading||this._video==null)return;switch(e.target){case this.play_btn:this.play();break;case this.bg:if(!this.isStop&&this._video.playing)this.pause();break;}}
change()
{if(this._video==null)return;if(!this.isStop&&this._video.playing)this.pause();else this.play();}
play()
{if(this._video==null||this._video.playing)return;this.seedTime=this.isStop?0:this.seedTime;this.update_view(true);if(this.isStop){this._video.element.addEventListener("pause",this._changeState);this._video.element.addEventListener("playing",this._changeState);this._video.addEventListener(Media.MEDIA_PLAY_COMPLETE,Global.delegate(this.onPlayOver,this));}
this._video.play(this.seedTime);this.isStop=false;}
pause()
{if(this._video==null)return;this.seedTime=this._video.getCurrentTime();this._video.stop();this.update_view(false);}
stop()
{if(this._video==null||this.isStop)return;this.isStop=true;this.seedTime=0;this._video.stop();this.update_view(false);this._volume=this._video.volume;this._video.element.removeEventListener("playing",this._changeState);this._video.element.removeEventListener("pause",this._changeState);this._video.removeEventListener(Media.MEDIA_PLAY_COMPLETE);}
__change_state(e)
{if(e.type=="playing"){if(this._video.playing)return;this._video.playing=true;this.update_view(true);if(this.isStop){this._video.addEventListener(Media.MEDIA_PLAY_COMPLETE,Global.delegate(this.onPlayOver,this));}
this.isStop=false;this.dispatchEvent(Factory.c("ev",[VideoPlayer.PLAY]));}else if(e.type=="pause"){if(!this._video.playing)return;this._video.playing=false;this.seedTime=this._video.getCurrentTime();this.update_view(false);this.dispatchEvent(Factory.c("ev",[VideoPlayer.PAUSE]));}}
update_view(bool)
{this.__checkDisplayUpdate();if(bool){if(this.play_btn)this.play_btn.removeFromParent(false);if(Global.useCanvas&&!(this.stage?this.stage:Stage.current).hasEventListener(StageEvent.ENTER_FRAME,this.name)){(this.stage?this.stage:Stage.current).addEventListener(StageEvent.ENTER_FRAME,Global.delegate(this.onEnterFrame,this),this.name);}
return;}
if(this.play_btn){this.play_btn.moveTo(Math.ceil((this.width-this.play_btn.getWidth())*0.5),Math.ceil((this.height-this.play_btn.getHeight())*0.5));this.addChild(this.play_btn);}
if((this.stage?this.stage:Stage.current).hasEventListener(StageEvent.ENTER_FRAME,this.name)){(this.stage?this.stage:Stage.current).removeEventListener(StageEvent.ENTER_FRAME,null,this.name);}}
onEnterFrame(e)
{if(Global.useCanvas)this.__checkDisplayUpdate();}
onPlayOver(e)
{this.stop();this.dispatchEvent(Factory.c("ev",[VideoPlayer.COMPLETE]));}
dispose()
{if(this._video&&!this.isStop)this.stop();else if((this.stage?this.stage:Stage.current).hasEventListener(StageEvent.ENTER_FRAME,this.name)){(this.stage?this.stage:Stage.current).removeEventListener(StageEvent.ENTER_FRAME,null,this.name);}
super.dispose();delete this.isStrict,this._is_reload,this.control,this._changeState,this.bg,this.play_btn,this._instance,this._video,this._url,this.seedTime,this._video_width,this._video_height,this._is_loading,this.isStop,this._volume;}}
VideoPlayer.PLAY="video_player_play";VideoPlayer.ERROR="video_player_error";VideoPlayer.READY="video_player_ready";VideoPlayer.PAUSE="video_player_pause";VideoPlayer.COMPLETE="video_player_play_complete";class URLLoader extends EventDispatcher
{constructor()
{super();this.content=null;this.type=null;}
load(u)
{let type;var target=this;var ext=StringUtil.getPathExt(u);if(ext=="txt"){type=URLLoader.TYPE_TEXT;}else if(ext=="json"){type=URLLoader.TYPE_JSON;}else if(ext=="js"){type=URLLoader.TYPE_JS;}else if(ext=="prop"){type=URLLoader.TYPE_PROP;}else if(ext=="css"){type=URLLoader.TYPE_CSS;}
else retrun;this.type=type;if(type==URLLoader.TYPE_TEXT||type==URLLoader.TYPE_JSON||type==URLLoader.TYPE_PROP){let ajax=new Ajax();ajax.get(u,{},function(data){target.content=data;target.dispatchEvent(Factory.c("ev",[Event.COMPLETE]));target.removeEventListener(Event.COMPLETE);target.removeEventListener(Event.ERROR);},function(a){target.content=null;target.dispatchEvent(Factory.c("ev",[Event.ERROR]));target.removeEventListener(Event.COMPLETE);target.removeEventListener(Event.ERROR);});}
else if(type==URLLoader.TYPE_JS){target.content=document.createElement("script");target.content.onload=function(){target.dispatchEvent(Factory.c("ev",[Event.COMPLETE]));target.removeEventListener(Event.COMPLETE);target.removeEventListener(Event.ERROR);};target.content.onerror=function(){target.dispatchEvent(Factory.c("ev",[Event.ERROR]));target.removeEventListener(Event.COMPLETE);target.removeEventListener(Event.ERROR);};target.content.src=u;target.content.type="text/javascript";document.querySelector('head').appendChild(target.content);}
else if(type==URLLoader.TYPE_CSS){target.content=document.createElement("link");target.content.rel="stylesheet";target.content.type="text/css";target.content.onload=function(){target.dispatchEvent(Factory.c("ev",[Event.COMPLETE]));target.removeEventListener(Event.COMPLETE);target.removeEventListener(Event.ERROR);}
target.content.onerror=function(){target.dispatchEvent(Factory.c("ev",[Event.ERROR]));target.removeEventListener(Event.COMPLETE);target.removeEventListener(Event.ERROR);};target.content.href=u;document.querySelector('head').appendChild(target.content);}}
static parseXML(data,type)
{let n=null;if(Global.root.DOMParser){try{n=(new DOMParser).parseFromString(data,type);}catch(e){}}
else if(Global.root.ActiveXObject){let xmlDomVersions=['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];for(let i=0;i<xmlDomVersions.length;i++){try{n=new ActiveXObject(xmlDomVersions[i]);break;}catch(e){}}
if(n){n.async=false;n.loadXML(data);}}
return n;}}
URLLoader.TYPE_TEXT="text";URLLoader.TYPE_JSON="json";URLLoader.TYPE_PROP="prop";URLLoader.TYPE_CSS="css";URLLoader.TYPE_JS="js";class Loader extends EventDispatcher
{constructor(data=null,locale=null,callback=null,target=null)
{super();this.reset();this.once=true;this.locale=locale;this.fontDic=this.fontFormat=null;if(data)this.parse(data,callback,target);}
parse(data,callback,target)
{if(data==undefined)return;if(data instanceof Array){this._list=data;this._total=this._list.length;return;}
if(callback&&typeof data=="string"){if(this.load(data))this._feedback=(typeof callback=="string")?callback:{c:callback,t:target};return;}
this._data=data;}
errorHandler(e)
{if(e&&e.target){if(e.target instanceof Image){delete this._files[this._current_name];e.target.onerror=null;e.target.onload=null;}else if(e.target instanceof URLLoader){e.target.removeEventListener(Event.ERROR,this.__error_handler);e.target.removeEventListener(Event.COMPLETE,this.__load_handler);}else{e.target.removeEventListener(Media.MEDIA_ERROR,this.__error_handler);e.target.removeEventListener(Media.MEDIA_LOAD_COMPLETE,this.__load_handler);}}
if(this._list.length>0){this.dispatchEvent(Factory.c("ev",[Loader.STEP_ERROR,this._current_name,this._current_label]));trace("[ERROR] Loading path by",this._current_name);this._loaded++;this.load();return;}
this.dispatchEvent(Factory.c("ev",[Loader.LOAD_COMPLETE,this._files,this._current_label]));}
loadHandler(e)
{this._loaded++;if(this._list==undefined)return;if(e){if(e.target instanceof Image){e.target.onload=null;e.target.onerror=null;}else if(e.target instanceof URLLoader){e.target.removeEventListener(Event.ERROR,this.__error_handler);e.target.removeEventListener(Event.COMPLETE,this.__load_handler);}else if(e.target){e.target.removeEventListener(Media.MEDIA_ERROR,this.__error_handler);e.target.removeEventListener(Media.MEDIA_LOAD_COMPLETE,this.__load_handler);}else if(e instanceof FontFace){document.fonts.add(e);}}
let temp,fb;if(this._list.length>0){if(this.hasEventListener(Loader.LOAD_PROCESS))
this.dispatchEvent(Factory.c("ev",[Loader.LOAD_PROCESS,Math.ceil(100*this._loaded/this._total)]));temp=this._files[this._current_name];while(!this.load()&&this._list.length>0){trace("[WARM] Loader miss path by",this._current_name);this._loaded++;this.load();}
if(temp)this.dispatchEvent(Factory.c("ev",[Loader.STEP_COMPLETE,temp,this._current_label]));else this.dispatchEvent(Factory.c("ev",[Loader.STEP_ERROR,this._current_name,this._current_label]));}else{if(this._feedback==null){let name=this._current_name,label=this._current_label;temp=this._files;this.reset(true);this.dispatchEvent(Factory.c("ev",[Loader.STEP_COMPLETE,temp[name],label]));this.dispatchEvent(Factory.c("ev",[Loader.LOAD_COMPLETE,temp,label]));}else{fb=this._feedback;if(typeof this._feedback=="string"){temp=this._files[this._current_name].content;this.reset(true);this.parse(temp);this.load(fb);return;}else{temp=this._files[this._current_name];this.reset(true);try{fb.c.call(fb.t,temp,this);return;}catch(error){trace("[ERROR] Loader:loadHandler()",error);}}}
if(this._data==null&&this.once)this.dispose();}}
loadXML(xmlUrl,name,local)
{let xmlObj;if(Global.root.ActionXObject){let activexName=["Microsoft.XMLHTTP","Miscrosoft.XmlDom","MSXML.DOMDocument"];for(let i=0;i<activexName.length;i++){try{xmlObj=new ActionXObject(activexName[i]);break;}catch(e){}}}else if(Global.root.XMLHttpRequest){xmlObj=new XMLHttpRequest();}
if(xmlObj==undefined)return;xmlObj.onreadystatechange=function()
{if(xmlObj.readyState!=4)return;if(xmlObj.status==200)
{local._files[name]=xmlObj.responseXML?xmlObj.responseXML:xmlObj.response;}
local.loadHandler();};xmlObj.open("GET",xmlUrl,true);xmlObj.send(null);}
load(data=null)
{if(data==undefined&&this._list==null)return false;if(typeof data=="string"){this._loaded=0;if(this._data&&this._data.hasOwnProperty(data)){this._list=this._data[data];this._total=this._list.length;this._current_label=data;}else if(!StringUtil.isEmpty(data)&&data.indexOf(".")>0){this._list=[data];this._total=1;}}else{this.parse(data);}
if(this._list==null)return false;if(this._list.length==0){this.dispatchEvent(Factory.c("ev",[Loader.LOAD_COMPLETE,this._files,this._current_label]));return false;}
if(this.__load_handler==null){this.__load_handler=Global.delegate(this.loadHandler,this);}
if(this.__error_handler==null){this.__error_handler=Global.delegate(this.errorHandler,this);}
let url,name,type,temp=this._list.shift();if(ObjectUtil.getType(temp)=="object"){url=(temp.hasOwnProperty("url"))?temp.url:temp.data;type=StringUtil.getPathExt(url);name=(temp.hasOwnProperty("label"))?temp.label:temp.name;name=StringUtil.isEmpty(name)?Loader.getName(url):name;}else{url=String(temp);type=StringUtil.getPathExt(url);name=Loader.getName(url);}
if(StringUtil.isEmpty(url)||StringUtil.isEmpty(type))return false;url=(this.locale&&!StringUtil.exist(url,"http://","https://"))?this.locale+url:url;trace("[LOADING]",name,"("+(this._loaded+1)+"/"+this._total+")");this._current_name=name;let url_loader;let xmlDoc;let sound;let video;let font;let img;switch(type){case"mp3":case"wav":case"wave":sound=new(Global.canUseWebAudio&&url.indexOf(",")<0?WebAudio:Sound)();if(sound instanceof Sound){sound.load(url)}else if(!sound.load(url)){sound.dispose();sound=new Sound();sound.load(url);}
this._files[name]=sound;sound.addEventListener(Media.MEDIA_ERROR,this.__error_handler);sound.addEventListener(Media.MEDIA_LOAD_COMPLETE,this.__load_handler);break;case"xml":case"fnt":case"svg":this.loadXML(url,name,this);break;case"bmp":case"ttf":case"eot":case"otf":case"woff":try{font=new FontFace(this.fontDic?this.fontDic[StringUtil.getFileName(url)]:StringUtil.getFileName(url),"url('"+url+"')"+(!StringUtil.isEmpty(this.fontFormat)?this.fontFormat:""));this._files[name]=font;font.loaded.then(this.__load_handler,this.__error_handler);font.load();}catch(error){this.errorHandler();}
break;case"json":case"txt":case"js":case"css":case"prop":url_loader=new URLLoader();this._files[name]=url_loader;url_loader.addEventListener(Event.ERROR,this.__error_handler);url_loader.addEventListener(Event.COMPLETE,this.__load_handler);url_loader.load(url);break;case"mp4":case"webm":case"ogg":case"mov":video=new Video();this._files[name]=video;video.addEventListener(Media.MEDIA_ERROR,this.__error_handler);video.addEventListener(Media.MEDIA_LOAD_COMPLETE,this.__load_handler);video.load(url);break;case"jpeg":case"jpg":case"gif":case"png":case"webp":case"bmp":img=new Image;img.style.display="none";img.src=url;this._files[name]=img;if(img.complete||img.naturalWidth||img.width){this.loadHandler({target:img});break;}
img.onload=this.__load_handler;img.onerror=this.__error_handler;break;default:return false;}
return true;}
reset(part)
{this._files={};this._total=this._loaded=0;this.fontFormat=this.fontDic=null;this._feedback=this._list=this._current_name=this._current_label=null;if(part)return;this.__error_handler=this.locale=this._data=this.__load_handler=null;}
dispose()
{super.dispose();this.reset();delete this.__error_handler;delete this._current_label;delete this.__load_handler;delete this._current_name;delete this._feedback;delete this.fontDic;delete this._loaded;delete this._total;delete this._files;delete this.locale;delete this._list;delete this._data;delete this.once;}
static getName(url)
{if(StringUtil.isEmpty(url))return null;let arr,bool=false;try{arr=StringUtil.getFileName(url,1).split("/");}catch(err){bool=true;trace("[WARN] Loader.getName by",url);}
if(arr==null||bool)
return StringUtil.getFileName(url)+"@"+StringUtil.getPathExt(url);let str=arr.pop();while(StringUtil.isEmpty(str)&&arr.length>0)str=arr.pop();return str+"_"+StringUtil.getFileName(url)+"@"+StringUtil.getPathExt(url);}}
Loader.LOAD_PROCESS="loadProcess";Loader.LOAD_COMPLETE="loadComplete";Loader.STEP_ERROR="stepError";Loader.STEP_COMPLETE="stepComplete";class InputText extends DOMDisplay
{constructor(isInput=false,multiline=false,tabindex=-1,password=false)
{super();this.isInput=Boolean(isInput);this.tabindex=tabindex;this.password=password;this.multiline=multiline;this.element=this._init();this._lineWidth=this.width=this.height=0;this._size=8;this._leading=0;this._lineHeight=0;this._maxChars=0;this._font="Microsoft YaHei,Arial";this._color="#000000";this._textAlign="left";this._verticalAlign="top";this._selectable=true;this._enable=true;this.autoSize=true;this._writingMode=false;this._underline=this._bold=this._italic=false;this.selectable=this.mouseEnabled=this.isInput;}
get enable()
{return this._enable;}
set enable(value)
{if(value==null||this._enable==value)return;this._enable=value;if(this.isInput)this.element.disabled=this._enable?"":"disabled";}
get selectable()
{return this._selectable;}
set selectable(value)
{if(value==null)return;this._selectable=value;this._cursor=value?"text":"default";this.element.style["pointerEvents"]=value?"auto":"none";this.element.style[StringUtil.isEmpty(Global.cssPrefix)?"userSelect":Global.cssPrefix+"UserSelect"]=this._selectable?"text":"none";this.updateSize();}
get text()
{return this.element?(this.isInput?this.element.value:this.element.innerHTML):"";}
set text(value)
{if(this.element==undefined||(this.isInput&&this.element.value==value)||(!this.isInput&&this.element.innerHTML==value))return;this.isInput?this.element.value=value:this.element.innerHTML=value;this.updateSize();}
get writingMode()
{return this._writingMode;}
set writingMode(value)
{if(this.element==undefined||this._writingMode==value)return;this._writingMode=value;this.element.style["writingMode"]=this._writingMode?"tb-rl":"lr-tb";this.element.style[Global.cssPrefix+"WritingMode"]=this._writingMode?"tb-rl":"lr-tb";this.updateSize();}
get italic()
{return this._italic;}
set italic(value)
{if(this.element==undefined||this._italic==value)return;this._italic=value;this.element.style.fontStyle=this._italic?"italic":"normal";this.updateSize();}
get bold()
{return this._bold;}
set bold(value)
{if(this.element==undefined||this._bold==value)return;this._bold=value;this.element.style.fontWeight=this._bold?"bold":"normal";this.updateSize();}
get size()
{return this._size;}
set size(value)
{if(this.element==undefined)return;this._size=value;this.element.style.fontSize=this._size+"px";this.updateSize();}
get color()
{return this._color;}
set color(value)
{value=ColorUtil.formatColor(value);if(this.element==undefined||this._color==value)return;this._color=value;this.element.style.color=this._color;}
get font()
{return this._font;}
set font(value)
{if(this.element==undefined||this.element.style.fontFamily==value)return;this._font=value;this.element.style.fontFamily=this._font;this.updateSize();}
get align()
{return this._textAlign;}
set align(value)
{if(this.element==undefined||this._textAlign==value)return;this._textAlign=value;this.element.style.textAlign=this._textAlign;this.updateSize();}
get underline()
{return this._underline;}
set underline(value)
{if(this.element==undefined||this._underline==value)return;this._underline=value;this.element.style.textDecoration=this._underline?"underline":"none";this.updateSize();}
get verticalAlign()
{return this._verticalAlign;}
set verticalAlign(value)
{if(this.element==undefined||this._verticalAlign==value)return;this._verticalAlign=value;this.element.style.verticalAlign=this._verticalAlign;this.updateSize();}
get maxChars()
{return this._maxChars;}
set maxChars(value)
{if(this.element==undefined||this._maxChars==value)return;this._maxChars=value;this.element.maxLength=this._maxChars;}
get leading()
{return this._leading;}
set leading(value)
{if(this.element==undefined)return;this._leading=value;this.element.style.letterSpacing=this._leading+"px";this.updateSize();}
get lineHeight()
{return this._lineHeight;}
set lineHeight(value)
{if(this.element==undefined)return;this._lineHeight=value;this.element.style.lineHeight=this._lineHeight;this.updateSize();}
get lineWidth()
{return this._lineWidth;}
set lineWidth(value)
{if(this._lineWidth==value)return;this._lineWidth=value;this.updateSize();}
get bgColor()
{return this.element?this.element.style.backgroundColor:"";}
set bgColor(value)
{this.element.style.backgroundColor=value;}
_init()
{let inputElement;if(!this.isInput){inputElement=document.createElement("span");inputElement.style.wordBreak="break-all";inputElement.contenteditable=false;inputElement.draggable=false;inputElement.display="block";return inputElement;}
else if(this.multiline){inputElement=document.createElement("textarea");inputElement.style["resize"]="none";}
else{inputElement=document.createElement("input");}
this._cursor="text";inputElement.setAttribute("type",this.password?"password":"text");inputElement.setAttribute("tabindex",this.tabindex);inputElement.style.border="none";inputElement.style.outline="thin";inputElement.style.overflow="hidden";inputElement.style.autofocus="autofocus";inputElement.style.wordBreak="break-all";inputElement.style.background="none";inputElement.style.color=this._color;inputElement.style["writingMode"]=this._writingMode?"tb-rl":"lr-tb";var target=this;inputElement.oninput=function(){target.dispatchEvent(Factory.c("ev",[InputText.CHANGE,inputElement.value]));};inputElement.onfocus=function(){target.dispatchEvent(Factory.c("ev",[InputText.FOCUS_IN]));}
inputElement.onblur=function(){target.dispatchEvent(Factory.c("ev",[InputText.FOCUS_OUT]));}
return inputElement;}
_display(bool)
{super._display(bool);if(bool)this.updateSize();}
updateSize()
{this.__checkDisplayUpdate();if(!this.autoSize||this.isInput||this.element==undefined||this.element.offsetHeight==0)return;this.height=this.element.offsetHeight+this._size;this.width=this._lineWidth?this._lineWidth:this.height*this.text.length;if(this._lineWidth>0)this.height=MathUtil.format(this.height*this.height*this.text.length/this._lineWidth);}
dispose()
{super.dispose();delete this._lineHeight,this.autoSize,this._selectable,this._enable,this._underline,this._writingMode,this.isInput,this.tabindex,this.password,this.multiline,this._lineWidth,this._size,this._leading,this._maxChars,this._font,this._color,this._textAlign,this._verticalAlign,this._bold,this._italic;}}
InputText.CHANGE="updateText";InputText.FOCUS_OUT="focusOut";InputText.FOCUS_IN="focusIn";class SVGText extends DOMDisplay
{constructor(w,h)
{super();this._size=12;this._leading=0;this._lineWidth=0;this._thickness=0;this._lineHeight=1;this._fill_alpha=1;this._text="";this._color="#000000";this._textAlign="left";this._stroke_color="#000000";this._font="Microsoft YaHei";this.autoSize=false;this._instance=null;this._selectable=true;this._textAdjust=false;this._writingMode=this._underline=this._bold=this._italic=false;this.setSize(w,h);this.element=SVGUtil.create("svg");}
get selectable()
{return this._selectable;}
set selectable(value)
{this._selectable=value;this._cursor=value?"text":"default";if(this._instance){this._instance.style.userSelect=this._selectable?"text":"none";this._instance.style[Global.cssPrefix+"UserSelect"]=this._selectable?"text":"none";}}
get text()
{return this._text;}
set text(value)
{this._text=value;this._set_text(value);}
get writingMode()
{return this._writingMode;}
set writingMode(value)
{if(this.element==undefined||this._writingMode==value)return;this._writingMode=value;this.text=this.text;}
get italic()
{return this._italic;}
set italic(value)
{if(this.element==undefined||this._italic==value)return;this._italic=value;if(this._instance)
this._instance.style.fontStyle=this._italic?"italic":"normal";}
get bold()
{return this._bold;}
set bold(value)
{if(this.element==undefined||this._bold==value)return;this._bold=value;if(this._instance)
this._instance.style.fontWeight=this._bold?"bold":"normal";}
get size()
{return this._size;}
set size(value)
{if(this.element==undefined||this._size==value)return;this._size=value;this.text=this.text;}
get color()
{return this._color;}
set color(value)
{if(this._color==value)return;this._color=this._format_color(value);if(!StringUtil.isEmpty(this._color)&&this._instance)
this._instance.style.fill=this._color;}
get font()
{return this._font;}
set font(value)
{if(StringUtil.isEmpty(value)||this._font==value)return;this._font=value;if(this._instance)
this._instance.style.fontFamily=this._font;}
get align()
{return this._textAlign;}
set align(value)
{if(this.element==undefined||this._textAlign==value)return;this._textAlign=value;if(this._instance)
this._instance.style.textAlign=this._textAlign;}
get underline()
{return this._underline;}
set underline(value)
{if(this.element==undefined||this._underline==value)return;this._underline=value;if(this._instance)
this._instance.style.textDecoration=this._underline?"underline":"none";}
get textAdjust()
{return this._textAdjust;}
set textAdjust(value)
{if(this.element==undefined||this._textAdjust==value)return;this._textAdjust=value;this.text=this.text;}
get leading()
{return this._leading;}
set leading(value)
{if(this.element==undefined||this._leading==value)return;this._leading=value;this.text=this.text;}
get lineHeight()
{return this._lineHeight;}
set lineHeight(value)
{if(this.element==undefined||this._lineHeight==value)return;this._lineHeight=value;this.text=this.text;}
get lineWidth()
{return this._lineWidth;}
set lineWidth(value)
{if(value==null||this._lineWidth==value)return;this._lineWidth=value;this.text=this.text;}
get strokeColor()
{return this._stroke_color;}
set strokeColor(value)
{if(value==null||value==this._stroke_color)return;this._stroke_color=this._format_color(value);if(!StringUtil.isEmpty(this._stroke_color)&&this._instance)
this._instance.style.stroke=this._stroke_color;}
get thickness()
{return this._thickness;}
set thickness(value)
{if(value==null||value==this._thickness)return;this._thickness=value;if(this._instance)
this._instance.style.strokeWidth=this._thickness;}
_set_text(str)
{if(StringUtil.isEmpty(str))return;let texts=this._text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);let lineHeight=this._size*this._lineHeight;let i,j,d,line,l=texts.length,max=Math.floor(this._lineWidth/(this._size+this._leading));if(this.autoSize&&this._lineWidth>0){this[this._writingMode?"height":"width"]=this._lineWidth;}
let dy=this._writingMode?this.width-lineHeight*0.5:lineHeight;if(this._instance){this._instance.innerHTML="";this._instance.setAttribute("transform","translate(0, 0)");}else this._instance=SVGUtil.create("text",{width:this.width,height:this.height});if(this.autoSize&&this._lineWidth>0){this._instance.setAttribute(this._writingMode?"height":"width",this[this._writingMode?"height":"width"]);}
SVGUtil.setAttributes(this._instance,{style:{fill:this._color,fillOpacity:this._fill_alpha,stroke:this._stroke_color,strokeWidth:this._thickness,fontStyle:this._italic?"italic":"normal",fontWeight:this._bold?"bold":"normal",fontSize:this._size+"px",fontFamily:this._font,textDecoration:this._underline?"underline":"none",textAlign:this._textAlign,letterSpacing:(this._leading-(this._writingMode&&!this._textAdjust?Math.ceil(this._size/3.6):0))+"px"}});this._instance.style["writingMode"]=this._writingMode?"tb-rl":"lr-tb";this._instance.style[Global.cssPrefix+"WritingMode"]=this._writingMode?"tb-rl":"lr-tb";for(i=0;i<l;i++){line=texts[i];if(max>0&&line.length>max){d=StringUtil.toArray(line,max);for(j=0;j<d.length;j++){this.__create_text(d[j],dy,Math.ceil(lineHeight));dy=this._writingMode?(dy-lineHeight):(dy+lineHeight);}
continue;}
this.__create_text(line,dy,Math.ceil(lineHeight));dy=this._writingMode?(dy-lineHeight):(dy+lineHeight);}
if(this.autoSize){if(this._writingMode&&dy<0){this.width=Math.abs(dy)+this.width-lineHeight*0.5;this._instance.setAttribute("width",this.width);this._instance.setAttribute("transform","translate("+Math.abs(dy+lineHeight*0.5)+", 0)");}else if(!this._writingMode&&dy>0){this.height=dy;this._instance.setAttribute("height",this.height);}}
if(this._instance&&this._instance.parentNode==null)
this.element.appendChild(this._instance);this.selectable=this._selectable;}
__create_text(str,dy,h,first)
{let w=(this._lineWidth>0?this._lineWidth:this.width);let dx=StringUtil.countLeftSpace(str)*(this._size+this._leading);let param={x:this._writingMode?dy:dx,y:this._writingMode?dx:dy,textLength:w,lengthAdjust:"spacing"};if(this._textAdjust){param.textLength=(w-dx);param.lengthAdjust="spacing";}
let text=SVGUtil.create("tspan",param);text.innerHTML=str;this._instance.appendChild(text);}
_format_color(c)
{if(this.element==null||c==null)return c;if(c&&c instanceof HTMLImageElement)return this._set_pattern(c);if(!(c&&(c instanceof GColor)))return c;let defs=this.element.getElementsByTagName('defs')[0];if(defs==undefined){defs=SVGUtil.create("defs");this.element.appendChild(defs);}
let gradient=this.element.getElementById(this.name+"_gradient");if(gradient&&gradient.parentNode)gradient.parentNode.removeChild(gradient);let obj={id:this.name+"_gradient"};if(c.type==0){obj.x1=MathUtil.int(100*c.xStart/c.radiusStart)+"%";obj.y1=MathUtil.int(100*c.yStart/c.radiusEnd)+"%";obj.x2=MathUtil.int(100*c.xEnd/c.radiusStart)+"%";obj.y2=MathUtil.int(100*c.yEnd/c.radiusEnd)+"%";}else{obj.fx=MathUtil.int(100*c.xStart/(c.radiusEnd*2))+"%";obj.fy=MathUtil.int(100*c.yStart/(c.radiusEnd*2))+"%";obj.cx=MathUtil.int(100*c.xEnd/(c.radiusEnd*2))+"%";obj.cy=MathUtil.int(100*c.yEnd/(c.radiusEnd*2))+"%";obj.r=MathUtil.int(100*(c.radiusStart*2)/c.radiusEnd)+"%";}
gradient=SVGUtil.create(c.type==0?"linearGradient":"radialGradient",obj);let i,sc,len=c.offsetlist.length;for(i=0;i<len;i++){sc=SVGUtil.create("stop",{"offset":c.offsetlist[i],"stop-color":c.colorList[i]});gradient.appendChild(sc);}
defs.appendChild(gradient);return"url(#"+this.name+"_gradient)";}
_set_pattern(c)
{let defs=this.element.getElementsByTagName('defs')[0];if(defs==undefined){defs=SVGUtil.create("defs");this.element.appendChild(defs);}
let pattern=this.element.getElementById(this.name+"_pattern");if(pattern&&pattern.parentNode)pattern.parentNode.removeChild(pattern);pattern=SVGUtil.create("pattern",{id:this.name+"_pattern",width:c.width,height:c.height,patternUnits:"userSpaceOnUse"})
let image=SVGUtil.create("image",{x:0,y:0,width:c.width,height:c.height});image.setAttributeNS(SVGUtil.xlink,"href",c.src);pattern.appendChild(image);defs.appendChild(pattern);return"url(#"+this.name+"_pattern)";}
clone()
{let svg_text=new SVGText(this.width,this.height);svg_text.autoSize=this.autoSize;svg_text._size=this._size;svg_text._leading=this._leading;svg_text._lineWidth=this._lineWidth;svg_text._thickness=this._thickness;svg_text._lineHeight=this._lineHeight;svg_text._fill_alpha=this._fill_alpha;svg_text._stroke_color=this._stroke_color;svg_text._writingMode=this._writingMode;svg_text._selectable=this._selectable;svg_text._textAdjust=this._textAdjust;svg_text._textAlign=this._textAlign;svg_text._underline=this._underline;svg_text._italic=this._italic;svg_text._color=this._color;svg_text._font=this._font;svg_text._bold=this._bold;svg_text.text=this._text;return svg_text;}
dispose()
{super.dispose();delete this._size,this._leading,this._lineWidth,this._thickness,this._lineHeight,this._fill_alpha,this._text,this._color,this._textAlign,this._stroke_color,this._font,this.autoSize,this._instance,this._selectable,this._textAdjust,this._writingMode,this._underline,this._bold,this._italic;}}
class MoveBar extends DisplayObjectContainer
{constructor()
{super();this._enable=this.isInitialized=this.useUpdate=this.isY=false;this.mouseEnabled=this.mouseChildren=true;this._mousePos=this.bar=this.bottom=null;this._min=this._max=this._value=0;this.isOrder=true;}
get enable()
{return this._enable;}
set enable(value)
{if(value==null||value==this._enable)return;this._enable=value;this._activate_bar(this._enable);}
get min()
{return this._min;}
set min(value)
{if(value==null||value==this._min)return;this._min=value;this.barSync();}
get max()
{return this._max;}
set max(value)
{if(value==null||value==this._max)return;this._max=value;this.barSync();}
get value()
{return this._value;}
set value(value)
{if(value==null||value==undefined)return;value=MathUtil.clamp(value,this._min,this._max);if(value==this._value)return;this._value=value;this.barSync();}
setup(min,max,value,bar,bottom,isY=false,update=false)
{this.bar=bar;this.bottom=bottom;this._min=min;this._max=max;this._value=value;this.isY=Boolean(isY);this.useUpdate=Boolean(update);if(this.bar&&this.bottom)this.initialize();}
initialize()
{if(!this.contains(this.bottom))this.addChild(this.bottom);if(!this.contains(this.bar))this.addChild(this.bar);if(!this.isY){this.bar.x=this.bottom.x+this.bar.getWidth()/2;this.bar.y=this.bottom.y+(this.bottom.getHeight()-this.bar.getHeight())*0.5;}else{this.bar.x=this.bottom.x+(this.bottom.getWidth()-this.bar.getWidth())*0.5;this.bar.y=this.bottom.y+this.bottom.getHeight()-this.bar.getHeight()/2;}
this.enable=this.isInitialized=true;this.barSync();}
_activate_bar(bool)
{if(this.bar==undefined||this.bottom==undefined)return;this.bar.mouseEnabled=this.bottom.mouseEnabled=this.bar.buttonMode=bool;this.bar.breakTouch=bool;if(bool){this.bar.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._mouse_down_bar,this));if(this.bottom.alpha>0&&this.bottom.visible)this.bottom.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._mouse_move_handler,this));return;}
this.bar.removeEventListener(StageEvent.MOUSE_DOWN);this.bottom.removeEventListener(StageEvent.MOUSE_DOWN);}
_mouse_down_bar(e)
{this._mousePos=this.bar.globalToLocal(e.mouseX,e.mouseY);(this.stage?this.stage:Stage.current).addEventListener(StageEvent.MOUSE_MOVE,Global.delegate(this._mouse_move_handler,this),this.name);(this.stage?this.stage:Stage.current).addEventListener(StageEvent.MOUSE_UP,Global.delegate(this._mouse_up_bar,this),this.name);}
_mouse_up_bar(e)
{(this.stage?this.stage:Stage.current).removeEventListener(StageEvent.MOUSE_MOVE,null,this.name);(this.stage?this.stage:Stage.current).removeEventListener(StageEvent.MOUSE_UP,null,this.name);this._mousePos=null;this.dataSync();}
_mouse_move_handler(e)
{let offset;if(this._mousePos){offset=(this.bar.origin?this._mousePos.subtract(this.bar.origin):this._mousePos.clone());}
let pos=this.globalToLocal((e?e.mouseX:(this.stage?this.stage:Stage.current).mouseX)-(offset?offset.x:0),(e?e.mouseY:(this.stage?this.stage:Stage.current).mouseY)-(offset?offset.y:0))
let xmouse=pos.x,ymouse=pos.y;if(this.isY){if(ymouse<=this.bottom.y){this.bar.y=this.bottom.y;}else if(ymouse>=(this.bottom.y+this.bottom.getHeight()-this.bar.getHeight())){this.bar.y=(this.bottom.y+this.bottom.getHeight()-this.bar.getHeight());}else{this.bar.y+=ymouse-this.bar.y;}}else{if(xmouse<=this.bottom.x){this.bar.x=this.bottom.x;}else if(xmouse>=(this.bottom.x+this.bottom.getWidth()-this.bar.getWidth())){this.bar.x=(this.bottom.x+this.bottom.getWidth()-this.bar.getWidth());}else{this.bar.x+=xmouse-this.bar.x;}}
if(this.useUpdate||(e.target==this.bottom))this.dataSync();}
dataSync()
{let value=0;if(this.isY){value=MathUtil.format(((this.bar.y-this.bottom.y)/(this.bottom.getHeight()-this.bar.getHeight()))*(this._max-this._min));}else{value=MathUtil.format(((this.bar.x-this.bottom.x)/(this.bottom.getWidth()-this.bar.getWidth()))*(this._max-this._min));}
if(this.isOrder){this._value=(this._min+value)>=this._max?this._max:(this._min+value);}else{this._value=(this._max-value)<=this._min?this._min:(this._max-value);}
this.dispatchEvent(Factory.c("ev",[MoveBar.CHANGE,this._value,(this._mousePos==null)]));}
barSync()
{if(!this.isInitialized||this.bar==undefined||this.bottom==undefined)return;let value=0;if(this.isOrder){value=this._value-this._min;}else{value=this._max-this._value;}
if(this.isY){this.bar.y=((value/(this._max-this._min))*(this.bottom.getHeight()-this.bar.getHeight()))+this.bottom.y;}else{this.bar.x=((value/(this._max-this._min))*(this.bottom.getWidth()-this.bar.getWidth()))+this.bottom.x;}}
dispose()
{this.enable=false;super.dispose();delete this._mousePos,this._enable,this.isInitialized,this.useUpdate,this.isY,this._min,this._max,this._value,this.bar,this.bottom,this.isOrder;}}
MoveBar.CHANGE="moveBarChange";class SlideBar extends MoveBar
{constructor()
{super();this.space=0;this.delta=0.05;this.minSize=12;this.useWheel=this.isScale=this.autoVisible=true;this._offset=this._rect=this._target=this._up_btn=this._down_btn=null;}
get upBtn()
{return this._up_btn;}
set upBtn(value)
{if(value==null||value==this._up_btn)return;this._up_btn=value;}
get downBtn()
{return this._down_btn;}
set downBtn(value)
{if(value==null||value==this._down_btn)return;this._down_btn=value;}
get target()
{return this._target;}
set target(value)
{if(value==null||value==this._target)return;let bool=this.enable;this.enable=false;this._target=value;this._target.x=this._rect.x;this._target.y=this._rect.y;this.enable=bool;this.dataSync(true);}
setup(target,rect,bar,bottom,isY,isScale,offset,upBtn,downBtn)
{this._rect=rect;this._target=target;if(this.useWheel){this._target.mouseEnabled=true;}
this.bar=bar;this.bottom=bottom;this._offset=offset;this.useUpdate=true;this.isY=isY||false;this.isScale=isScale||false;if(upBtn)this._up_btn=upBtn;if(downBtn)this._down_btn=downBtn;this._min=0;this._value=0;this.resetRange();this.initLayout(this._offset);}
resetRange(e)
{this.max=Math.max(0,Math.ceil(this.isY?this._target.getHeight()-this._rect.height:this._target.getWidth()-this._rect.width));let bool=!(this._max==0&&this.autoVisible);this.bottom.visible=this.bar.visible=bool;if(this._down_btn)this._down_btn.visible=bool;if(this._up_btn)this._up_btn.visible=bool;if(e)this.updataSync();}
initLayout(offset)
{this._target.x=this._rect.x;this._target.y=this._rect.y;let w=this._up_btn?this._up_btn.getWidth():0;let h=this._up_btn?this._up_btn.getHeight():0;this.bottom.x=(this.isY?(this._rect.x+this._rect.width+this.space):this._rect.x+w)+(offset?offset.x:0);this.bottom.y=(this.isY?this._rect.y+h:this._rect.y+this._rect.height+this.space)+(offset?offset.y:0);if(this.isY)this.bottom.height=this._rect.height-2*h;else this.bottom.width=this._rect.width-2*w;this.initialize();if(this._up_btn){if(!this.contains(this._up_btn))this.addChild(this._up_btn);this._up_btn.moveTo((this.isY?(this._rect.x+this._rect.width+this.space):this._rect.x)+(offset?offset.x:0),(this.isY?this._rect.y:this._rect.y+this._rect.height+this.space)+(offset?offset.y:0));}
if(this._down_btn){if(!this.contains(this._down_btn))this.addChild(this._down_btn);this._down_btn.moveTo((this.isY?(this._rect.x+this._rect.width+this.space):this._rect.x+this._rect.width-w)+(offset?offset.x:0),(this.isY?this._rect.y+this._rect.height-h:this._rect.y+this._rect.height+this.space)+(offset?offset.y:0));}}
_reset_handler(e)
{if(e.params){this._rect.width=(e.params.hasOwnProperty("w")?e.params.w:this._rect.width);this._rect.height=(e.params.hasOwnProperty("h")?e.params.h:this._rect.height);this.initLayout(this._offset);this.updataSync();}
if(e.label){if(e.label.hasOwnProperty("r"))this.rotation=e.label.r;if(e.label.hasOwnProperty("x"))this.x=e.label.x;if(e.label.hasOwnProperty("y"))this.y=e.label.y;}}
_activate_bar(bool)
{super._activate_bar(bool);if(bool){if(this._target){this._target.addEventListener(Event.RESIZE,Global.delegate(this._reset_handler,this),this.name);this._target.addEventListener(DisplayBase.RESIZE,Global.delegate(this.resetRange,this),this.name);this._target.addEventListener(StageEvent.DRAG_MOVE,Global.delegate(this.dragHandler,this),this.name);this._target.addEventListener(DisplayBase.RESET_INSTANCE,Global.delegate(this.resetRange,this),this.name);if(this.useWheel)this._target.addEventListener(StageEvent.MOUSE_WHEEL,Global.delegate(this.wheelHandler,this),this.name);}
if(this._up_btn)this._up_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._clickUpBtn,this));if(this._down_btn)this._down_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._clickDownBtn,this));return;}
if(this._target){this._target.removeEventListener(Event.RESIZE,null,this.name);this._target.removeEventListener(DisplayBase.RESIZE,null,this.name);this._target.removeEventListener(StageEvent.DRAG_MOVE,null,this.name);this._target.removeEventListener(StageEvent.MOUSE_WHEEL,null,this.name);this._target.removeEventListener(DisplayBase.RESET_INSTANCE,null,this.name);}
if(this._up_btn)this._up_btn.removeEventListener(StageEvent.MOUSE_CLICK);if(this._down_btn)this._down_btn.removeEventListener(StageEvent.MOUSE_CLICK);}
dragHandler(e)
{this.value=this.isY?this._rect.y-this._target.y:this._rect.x-this._target.x;}
wheelHandler(e)
{this.updataSync(this._value+(e.delta<0?1:-1)*Math.max(1,Math.ceil(this.delta*this._max)));}
barSync()
{if(this.isScale){if(this.isY)this.bar.height=Math.max(this.bottom.height*(1-this.max/this.bottom.height),this.minSize);else this.bar.width=Math.max(this.bottom.width*(1-this.max/this.bottom.width),this.minSize);}
super.barSync();}
dataSync(bool)
{if(bool==undefined)super.dataSync();if(this.isY)this._target.y=this._rect.y-this._value;else this._target.x=this._rect.x-this._value;}
updataSync(v)
{this.value=(v==undefined)?(this.isY?this._rect.y-this._target.y:this._rect.x-this._target.x):v;this.dataSync(true);}
_clickUpBtn(e)
{this.updataSync(this._value-Math.max(1,Math.ceil(this.delta*this._max*2)));}
_clickDownBtn(e)
{this.updataSync(this._value+Math.max(1,Math.ceil(this.delta*this._max*2)));}
dispose()
{super.dispose();delete this._offset,this._target,this._up_btn,this._down_btn,this._rect;delete this.useWheel,this.space,this.delta,this.minSize,this.isScale,this.autoVisible;}}
class BitmapText extends DisplayObjectContainer
{constructor()
{super();this.mouseEnabled=this.mouseChildren=false;this._is_init=false;this.autoSize=true;this._has_update=true;this._lineHeight=1;this._lineWidth=0;this._leading=0;this._size=0;this._color="";this._text="";this._font="";this._textAlign="start";this.name="bitmap_text_"+this.name;this._ct=this._fonts=this._instance=null;}
get text()
{return this._text;}
set text(value)
{if(!this._is_init||this._text==value)return;this._text=value;this._has_update=true;}
get font()
{return this._font;}
set font(value)
{if(!this._is_init||this._font==value)return;this._font=value;this._fonts=FontManager.get(this._font);this._has_update=true;}
get color()
{return this._color;}
set color(value)
{value=ColorUtil.formatColor(value);if(this._color==value)return;this._color=value;this._has_update=true;}
get leading()
{return this._leading;}
set leading(value)
{if(!this._is_init||this._leading==value)return;this._leading=value;this._has_update=true;}
get lineHeight()
{return this._lineHeight;}
set lineHeight(value)
{if(value==null||this._lineHeight==value)return;this._lineHeight=value;this._has_update=true;}
get size()
{return this._size;}
set size(value)
{if(this._size==Number(value)||isNaN(value))return;value=Number(value);this.scale=this.scale*MathUtil.format(value/this._size);this._size=value;}
get lineWidth()
{return this._lineWidth;}
set lineWidth(value)
{if(!this._is_init||this._lineWidth==value)return;this.width=this._lineWidth=Math.min(100,value);this._has_update=true;}
get align()
{return this._textAlign;}
set align(value)
{if(!this._is_init||this._textAlign==value)return;this._textAlign=value;this._has_update=true;}
setup(t,f,w,c,a)
{this._text=t||this._text;this._font=f||this._font;this._color=c||this._color;this.width=this._lineWidth=w||this._lineWidth;this._textAlign=a||this._textAlign;this._fonts=FontManager.get(this._font);if(this._fonts==undefined)return;this._size=Math.abs(Number(this._fonts.info.size));if(this._instance==undefined&&Global.useCanvas){this._instance=ObjectPool.create(DisplayObject);this.addChild(this._instance);}
this._is_init=this._has_update=true;if(this._fonts)this._update();}
_update()
{this.__checkDisplayUpdate();let spacing=this._fonts.info.spacing.split(",");let space_left=Number(spacing[0]);let space_up=Number(spacing[1]);let i,countX=space_left,countY=space_up;let item,char,pos,len=this._text.length,charCode=-1,h=0,w=0;let old=ObjectPool.create(Point);let miss="";if(!Global.useCanvas)this.removeAllChildren(true);else this._instance.context.reset();for(i=0;i<len;i++){charCode=this._text.charCodeAt(i);char=this._fonts.chars[charCode];if(char==undefined){miss+='"'+this._text.charAt(i)+'" ';continue;}
if(Global.useCanvas){pos=ObjectPool.create(Point).set(char.regX,char.regY);this._instance.context.translate(countX-pos.x-old.x,countY-pos.y-old.y);this._instance.context.drawImage(char.image,Global.useCache?0:char.x,Global.useCache?0:char.y,char.width,char.height,0,0,char.width,char.height);old.set(countX-pos.x,countY-pos.y);ObjectPool.remove(pos);}else{item=ObjectPool.create(DOMDisplay);item.setInstance(char);item.moveTo(countX,countY);this.addChild(item);}
if(h==0)h=char.height;else h=Math.max(h,char.height);countX+=char.width+this._leading+space_left;if(countX>=(this._lineWidth<=0?(this.stage?this.stage.stageWidth:Global.width):this._lineWidth)-char.width){if(i+1<len){charCode=this._text.charCodeAt(i+1);if(charCode>=65&&charCode<123)continue;}
w=Math.max(w,countX);countX=space_left;countY+=(h?Math.ceil(h*this._lineHeight):0)+space_up;h=0;}}
w=Math.ceil(Math.max(w,countX));countY=Math.ceil(countY+h+space_up);if(this.autoSize){this.width=w;this.height=countY;}
this._has_update=false;ObjectPool.remove(old);if(Global.useCanvas){this._instance.width=w;this._instance.height=countY;}
if(!StringUtil.isEmpty(miss))
trace("[WARN] _update miss fonts ["+miss+"]");}
render()
{if(StringUtil.isEmpty(this._text))return;if(this._has_update)this._update();super.render(...arguments);}
dispose()
{if(this._instance)this._instance.removeFromParent(true);super.dispose();delete this.autoSize,this._lineHeight,this._size,this._ct,this._color,this._is_init,this._has_update,this._lineWidth,this._leading,this._text,this._font,this._textAlign,this._instance;}}
class TextField extends DisplayObject
{constructor(s="",f="Microsoft YaHei,Arial",c="#000000",z=12,t="fill",c2="#000000",l=1)
{super();this._text=s;this._font=f;this._size=z;this._leading=l;this._fill_type=t;this._color2=c2;this._color=ColorUtil.formatColor(c);this._lineHeight=1;this._has_update=true;this._textAlign="left";this._textBaseline="top";this._underline=this._italic=this._bold=false;this._lineWidth=null;this._fontMetrics=null;this.autoSize=true;this.scrollHeight=0;this.mouseEnabled=false;this._writingMode=false;this.width=0;if(!StringUtil.isEmpty(this._text))this._update();}
get has_update()
{return this._has_update;}
set has_update(value)
{if(this._has_update==value)return;this._has_update=value;if(value)this.__checkDisplayUpdate();}
get lineWidth()
{return this._lineWidth;}
set lineWidth(value)
{if(this._lineWidth==value)return;this._lineWidth=value;this.has_update=true;}
get italic()
{return this._italic;}
set italic(value)
{if(this._italic==value)return;this._italic=value;this.has_update=true;}
get writingMode()
{return this._writingMode;}
set writingMode(value)
{if(this._writingMode==value)return;this._writingMode=value;this.has_update=true;}
get underline()
{return this._underline;}
set underline(value)
{if(this._underline==value)return;this._underline=value;}
get bold()
{return this._bold;}
set bold(value)
{if(this._bold==value)return;this._bold=value;this.has_update=true;}
get text()
{return this._text;}
set text(value)
{if(this._text==value)return;this._text=value;this.has_update=true;}
get size()
{return this._size;}
set size(value)
{if(this._size==value)return;this._size=value;this.has_update=true;this._fontMetrics=TextField.getFontMetrics(this.font,this.size);}
get color()
{return this._color;}
set color(value)
{if(StringUtil.isEmpty(value))return;value=ColorUtil.formatColor(value);if(this._color==value)return;this._color=value;this.has_update=true;}
get strokeColor()
{return this._color2;}
set strokeColor(value)
{value=ColorUtil.formatColor(value);if(this._color2==value)return;this._color2=value;this.has_update=true;}
get font()
{return this._font;}
set font(value)
{if(this._font==value)return;this._font=value;this.has_update=true;this._fontMetrics=TextField.getFontMetrics(this.font,this.size);}
get fillType()
{return this._fill_type;}
set fillType(value)
{if(this._fill_type==value)return;this._fill_type=value;this.has_update=true;}
get align()
{return this._textAlign;}
set align(value)
{if(this._textAlign==value)return;this._textAlign=value;this.has_update=true;}
get leading()
{return this._leading;}
set leading(value)
{if(this._leading==value)return;this._leading=value;this.has_update=true;}
get lineHeight()
{return this._lineHeight;}
set lineHeight(value)
{if(value==null||this._lineHeight==value)return;this._lineHeight=value;this.has_update=true;}
get baseLine()
{return this._textBaseline;}
set baseLine(value)
{if(this._textBaseline==value)return;this._textBaseline=value;this.has_update=true;}
getTextWidth(str=null)
{var global_context=(this.stage?this.stage.context:Global.context);str=StringUtil.isEmpty(str)?this._text:str;if(!global_context||!this.context||StringUtil.isEmpty(str))return 0;if(global_context.font!=this.context.font)global_context.font=this.context.font;return global_context.measureText(str).width;}
get stage()
{return this._stage;}
set stage(value)
{if(this._stage==value)return;if(this._stage)this._stage.removeEventListener(StageEvent.UPDATE,null,this.name);this._stage=value;if(this._stage)this._stage.addEventListener(StageEvent.UPDATE,Global.delegate(this.__update_size,this),this.name);}
_update()
{this.context.reset();this.context.font=(this._italic?"italic ":"")+(this._bold?"bold ":"")+(ObjectUtil.getType(this._size)=="number"?this._size+"px ":this._size+" ")+this._font;this.context.textAlign=(!this._writingMode&&this._textAlign)?this._textAlign:"left";this.context.textBaseline=this._textBaseline!=null?this._textBaseline:"top";if(this._writingMode)this._vertical_text();else this._horizontal_text();this.has_update=false;}
_vertical_text()
{if(this._fontMetrics==null)this._fontMetrics=TextField.getFontMetrics(this.font,this.size);var texts=this._text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);let word,i,j,line,l=texts.length,width,dy=0,my=(this.autoSize?Math.max(this._lineWidth,this.height):this.height),sy=0,wordHeight=this._fontMetrics.height;let by=0,mw=0,mx=(Math.max(this._lineWidth,this.width)-this.size*0.5);let align_left=(this._textAlign=="left"),lines=(align_left?null:[]);for(i=0;i<l;i++){line=texts[i];width=0;by=sy;let wlen,cache=(align_left?null:[]);for(j=0,wlen=line.length;j<wlen;j++)
{word=line.charAt(j);if(!word||word.length==0)continue;width=this.getTextWidth(word);mw=Math.max(mw,width);if(sy+dy>=(my-wordHeight)){dy=0;mx-=mw*this._lineHeight;if(cache)cache=[];}
if(cache)cache.push({w:word,x:mx-width,y:by+dy});this._draw(word,by+dy,mx-width);dy=dy+(wordHeight+this._leading);by=0;}
dy=0;mx-=mw*this._lineHeight;if(cache){lines.push({d:cache,r:{x:cache[0].x,y:cache[0].y,w:width,h:(cache[cache.length-1].y-cache[0].y+wordHeight+this._leading)}});}}
if(!lines)return;for(i=0,l=lines.length;i<l;i++){line=lines[i];this.context.clearRect(line.r.x,line.r.y,line.r.w,line.r.h);sy=(this._textAlign=="center"?(my-line.r.h)*0.5:my-line.r.h);dy=line.d[0].y;for(j=0,wlen=line.d.length;j<wlen;j++)
{word=line.d[j];this._draw(word.w,word.y-dy+sy,word.x);}}}
_horizontal_text()
{if(this._fontMetrics==null)this._fontMetrics=TextField.getFontMetrics(this.font,this.size);var texts=this._text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);let i,line,width,l=texts.length,dy=0,lineHeight=this._fontMetrics.height*this._lineHeight;if(this.autoSize)this.width=this._lineWidth;for(i=0;i<l;i++){line=texts[i];width=this.getTextWidth(line);if(this._lineWidth==null||width<=this._lineWidth)
{if(width>this.width&&this.autoSize)this.width=width;this._draw(line,dy);dy+=lineHeight;continue;}
let words=line.split(/([^\x00-\xff]|\b)/),str=words[0];for(let j=1,wlen=words.length;j<wlen;j++)
{let word=words[j];if(!word||word.length==0)continue;let newWidth=this.getTextWidth(str+word);if(newWidth>this._lineWidth)
{this._draw(str,dy);dy+=lineHeight;str=word;}else
{str+=word;}}
this._draw(str,dy);dy+=lineHeight;}
this.scrollHeight=dy;if(this.autoSize)this.height=dy;}
_draw(str,posY,posX)
{posX=(posX==undefined)?0:posX;posY=(posY==undefined)?0:posY;if(!this._writingMode){switch(this._textAlign)
{case"center":posX=this.width*0.5;break;case"right":case"end":posX=this.width;break;};}
switch(this._fill_type)
{case"fill":this.context.fillStyle=this._color;this.context.fillText(str,posX,posY);break;case"stroke":this.context.strokeStyle=this._color2;this.context.strokeText(str,posX,posY);break;case"both":this.context.fillStyle=this._color;this.context.fillText(str,posX,posY);this.context.strokeStyle=this._color2;this.context.strokeText(str,posX,posY);break;}}
__update_size(e)
{if(this.canvas==null)return;if(this.stage.canvas.width>(this.canvas.width+1)||(this.stage?this.stage:Global).canvas.height>(this.canvas.height+1)){this.has_update=true;}}
_render()
{if(StringUtil.isEmpty(this._text))return;if(this._has_update)this._update();if(!this.context)return;super._render(...arguments);}
dispose()
{super.dispose();delete this.scrollHeight,this._lineHeight,this.autoSize,this._underline,this._writingMode,this._text,this._font,this._color,this._color2,this._size,this._textAlign,this._textBaseline,this._fill_type,this._has_update,this._leading,this._italic,this._bold,this._lineWidth,this._fontMetrics,this.mouseEnabled;}
toString()
{return TextField.name;}
static getFontMetrics(font,size)
{return{height:size};}}
class Stage extends DisplayObjectContainer
{constructor()
{super();this.usePixelTrace=false;this.traceMouseTarget=true;this.timer=this.dragTarget=this.mouseTarget=this._mouseDownTarget=null;this.stageX=this.stageY=0;this.mouseX=this.mouseY=0;this.isFullScreen=false;this.auto_clear=true;this.last_fresh=true;this.auto_fresh=true;this.block_ratio=0.05;this._dragMouseX=this._dragMouseY=0;this.stageWidth=this.stageHeight=0;this.name=UniqueUtil.getName("stage");this._parent_node=null;this._activate=false;this._isTap=false;this._graphics=null;this._block=null;this._area=null;this._layer=-1;this.interactive=true;this._enable=false;this.stage=this;this.context;this.canvas;this.div;Stage.current=this;}
get graphics()
{return this._graphics;}
initCanvas(w,h,c,e)
{let err=false;this.canvas=c;if(c==undefined){try{this.canvas=document.createElement("canvas");}
catch(error){err=true;this.canvas={style:{},context:{}};trace("[WARN] Stage initCanvas()",error);}
this.canvas.width=w;this.canvas.height=h;if(e)this.canvas.contenteditable=this.canvas.draggable=this.canvas.dropzone=true;this.canvas.tabindex=0;this.canvas.style.left=this.canvas.style.top="0px";this.canvas.style.position=Global.position;this.canvas.style.zIndex=Global.layer;this.canvas.style.padding=0;this.canvas.style.margin=0;if(this.div==undefined){this.div=DOMUtil.createDOM("div",{id:"container_"+this.name,style:{overflow:"hidden",position:Global.position,height:h+"px",width:w+"px",padding:"0",margin:"0",cursor:""}});document.body.appendChild(this.div);this._parentNode=this.div;}
if(!err)this.div.appendChild(this.canvas);}
this.stageWidth=w;this.stageHeight=h;this.context=err?this.canvas.context:this.canvas.getContext("2d");this.updatePosition();if(Stage.current==this){Global.context=this.context;Global.canvas=this.canvas;Global.div=this.div;Global.height=h;Global.width=w;}
if(!err)this._graphics=new Graphics(this.context);this.enable(true);}
size(w,h)
{if(w==null||h==null||this.div==null)return;w=Math.floor(w);h=Math.floor(h);if(this.div){this.div.style.height=h+"px";this.div.style.width=w+"px";}
if(this.canvas){this.canvas.width=w;this.canvas.height=h;}
this.stageWidth=w;this.stageHeight=h;if(Global.autoShapeSize){this.dispatchEvent(Factory.c("ev",[StageEvent.UPDATE]));}}
enable(bool)
{this.__enter_frame=this.__enter_frame?this.__enter_frame:Global.delegate(this._enterFrame,this);this._enable=bool;if(bool){if(!Global.animationFrame){this.timer=this.timer?this.timer:new Timer();this.timer.addEventListener(Timer.TIME,this.__enter_frame,false);this.timer.start();}
else this._enterFrame();}
else if(this.timer){this.timer.removeEventListener(Timer.TIME,this.__enter_frame);this.timer.stop();}
if(!this.interactive)return;this.__message_handler=this.__message_handler?this.__message_handler:Global.delegate(this._message_handler,this);this.__touch_handler=this.__touch_handler?this.__touch_handler:Global.delegate(this._touchHandler,this);this.__mouse_handler=this.__mouse_handler?this.__mouse_handler:Global.delegate(this._mouseHandler,this);this.__key_handler=this.__key_handler?this.__key_handler:Global.delegate(this._keyHandler,this);var body=this.div?this.div:document;if(Global.supportTouch)
{if(bool){body.addEventListener("touchstart",this.__touch_handler,false);body.addEventListener("touchmove",this.__touch_handler,false);document.addEventListener("touchend",this.__touch_handler,false);}else{body.removeEventListener("touchstart",this.__touch_handler);body.removeEventListener("touchmove",this.__touch_handler);document.removeEventListener("touchend",this.__touch_handler);}
return;}
else
{if(bool){body.addEventListener(Global.isFirefox?"DOMMouseScroll":"mousewheel",this.__mouse_handler,false);body.addEventListener("mousedown",this.__mouse_handler,false);body.addEventListener("mousemove",this.__mouse_handler,false);body.addEventListener("mouseenter",this.__mouse_handler,false);body.addEventListener("mouseleave",this.__mouse_handler,false);document.addEventListener("mouseup",this.__mouse_handler,false);}else{body.removeEventListener(Global.isFirefox?"DOMMouseScroll":"mousewheel",this.__mouse_handler);body.removeEventListener("mousedown",this.__mouse_handler);body.removeEventListener("mousemove",this.__mouse_handler);body.removeEventListener("mouseenter",this.__mouse_handler);body.removeEventListener("mouseleave",this.__mouse_handler);document.removeEventListener("mouseup",this.__mouse_handler);}}
if(bool){Global.root.addEventListener('message',this.__message_handler,false);document.addEventListener("keydown",this.__key_handler,false);document.addEventListener("keyup",this.__key_handler,false);}else{Global.root.removeEventListener('message',this.__message_handler,false);document.removeEventListener("keydown",this.__key_handler);document.removeEventListener("keyup",this.__key_handler);}}
_message_handler(e)
{this.dispatchEvent(Factory.c("ev",[StageEvent.MESSAGE,e&&e.data?e.data:e]));}
resize(w,h)
{this.dispatchEvent(Factory.c("ev",[StageEvent.RESIZE,{width:w,height:h}]));}
_enterFrame(e)
{this.dispatchEvent(Factory.c("ev",[StageEvent.ENTER_FRAME]));if(this.auto_clear&&(DisplayObjectContainer._num_canvas_target>0||this.last_fresh)){if(this.auto_fresh)this.clear();if(!DisplayObjectContainer._num_canvas_target>0&&this.last_fresh){this.last_fresh=false;if(this.canvas){let temp=this._parent_node;this._parent_node=this.canvas.parentNode;if(this._parent_node)this._parent_node.removeChild(this.canvas);else this._parent_node=temp?temp:this.div;}}}
if(this._enable&&Global.animationFrame)Global.animationFrame(this.__enter_frame);if(this.numChildren<=0)return;var _this=this;Promise.resolve().then(function(){_this.render();});}
render()
{if(!this.last_fresh&&DisplayObjectContainer._num_canvas_target>0){this.last_fresh=true;if(this.canvas&&this._parent_node){this._parent_node.appendChild(this.canvas);}}
DOMDisplay._depth_count=0;if(this.auto_fresh){this.auto_fresh=false;super.render();}}
_dragHandler()
{let posX=this._dragMouseX;let posY=this._dragMouseY;let pos=this.dragTarget.origin;let pos2=this.dragTarget.localToGlobal(pos?pos.x:0,pos?pos.y:0);pos=this.dragTarget.localToGlobal(posX,posY);posX=Math.round(this.mouseX-(pos.x-pos2.x));posY=Math.round(this.mouseY-(pos.y-pos2.y));let point;if(this._block&&!this._block.contains(posX,posY)){point=this.dragTarget.localToGlobal(0,0);posX=point.x+(posX-point.x)*this.block_ratio;posY=point.y+(posY-point.y)*this.block_ratio;}
if(this._area){point=new Point(posX,posY);point=Rectangle.innerPoint(this._area,point);posX=point.x;posY=point.y;}
if(pos)ObjectPool.remove(pos);pos=this.dragTarget.parent.globalToLocal(posX,posY);this.dragTarget.x=pos.x;this.dragTarget.y=pos.y;if(!this._isTap)this.dragTarget.dispatchEvent(Factory.c("ev",[StageEvent.DRAG_MOVE]));if(point)ObjectPool.remove(point);if(pos2)ObjectPool.remove(pos2);if(pos)ObjectPool.remove(pos);}
clear()
{if(!this.context||!this.canvas||!this.canvas.parentNode)return;this.context.clearRect(0,0,this.canvas.width,this.canvas.height);}
_touchHandler(e)
{let a=e.touches&&e.touches.length>0?e.touches[0]:(e.changedTouches&&e.changedTouches.length>0?e.changedTouches[0]:null);if(a){this.mouseX=(a.pageX||a.clientX)-this.stageX;this.mouseY=(a.pageY||a.clientY)-this.stageY;}
if(this.traceMouseTarget)this._getMouseTarget(e);a={id:(a?a.identifier:0),target:this.mouseTarget||this,mouseX:this.mouseX,mouseY:this.mouseY,button:0};a.type=Stage.translationType(e.type);a=Factory.c("se",a);a.touchs=[];if(this.mouseTarget&&this.mouseTarget.onMouseEvent&&(this.mouseTarget.onMouseEvent(a),a.type==StageEvent.MOUSE_UP)){var evt=Factory.c("se",{type:StageEvent.MOUSE_OUT});this.mouseTarget.onMouseEvent(evt);ObjectPool.remove(evt);}
let i,t,type,mx,my,l=e.touches.length;for(i=0;i<l;i++){t=e.touches[i];if(t.target==null)continue;type=Stage.translationType(t.type);if(type!=StageEvent.MOUSE_UP&&!DOMUtil.contains(this.div,t.target))continue;mx=(t.pageX||t.clientX)-this.stageX;my=(t.pageY||t.clientY)-this.stageY;a.touchs.push({mouseX:mx,mouseY:my,type:type,id:t.identifier});}
a.length=a.touchs?a.touchs.length:0;if(a.type==StageEvent.MOUSE_MOVE&&this.dragTarget)this._dragHandler();let bool=a.target.breakTouch;let copy=(a.target!=this)?Factory.c("se",a):null;let bt=this._checkMouseClick(a);a.target.dispatchEvent(a);if(copy)this.dispatchEvent(copy);if(!(Global.breakTouch||bool||bt||this.breakTouch)||a.type==StageEvent.MOUSE_UP)return;e.preventDefault();e.stopPropagation();}
_mouseHandler(e)
{if(e.target==null||e.type=="mouseleave"||(!DOMUtil.contains(this.div,e.target)&&e.type!="mouseup")){this._activate=false;this.dispatchEvent(Factory.c("se",[StageEvent.MOUSE_OUT,this._activate]));return;}
let mx=e.pageX-this.stageX;let my=e.pageY-this.stageY;let a=Factory.c("se",{type:e.type});let b=(mx==this.mouseX&&my==this.mouseY);if(e.type=="mouseenter"){a.type=StageEvent.MOUSE_OVER;this.updatePosition();this._activate=true;this.dispatchEvent(Factory.c("se",[StageEvent.MOUSE_OVER,this._activate]));}else if(!this.isFullScreen&&this._activate&&(mx<0||my<0||mx>this.stageWidth||my>this.stageHeight)){this._activate=false;this.dispatchEvent(Factory.c("se",[StageEvent.MOUSE_OUT,this._activate]));}else if(!this._activate&&e.type!="mouseup"){this._activate=true;this.dispatchEvent(Factory.c("se",[StageEvent.MOUSE_OVER,this._activate]));}
if(b&&e.type==StageEvent.MOUSE_MOVE){a.type=StageEvent.MOUSE_OVER;}
if(e.type=="DOMMouseScroll"){a.type=StageEvent.MOUSE_WHEEL;}
this.mouseX=mx;this.mouseY=my;if(this.traceMouseTarget)this._getMouseTarget(e);a.target=this.mouseTarget||this;a.mouseX=this.mouseX;a.mouseY=this.mouseY;a.delta=e.wheelDelta?(e.wheelDelta/120):(-e.detail/3);if(this.mouseTarget&&this.mouseTarget.onMouseEvent)this.mouseTarget.onMouseEvent(a);if(a.type==StageEvent.MOUSE_MOVE&&this.dragTarget)this._dragHandler();this.setCursor(this.mouseTarget);let bool=a.target.breakTouch;let copy=(a.target!=this)?Factory.c("se",a):null;let bt=this._checkMouseClick(a,b);a.target.dispatchEvent(a);if(copy)this.dispatchEvent(copy);if(!(Global.breakTouch||bool||bt||this.breakTouch)||a.type==StageEvent.MOUSE_UP)return;e.preventDefault();e.stopPropagation();}
_checkMouseClick(a,b)
{if(a.type==StageEvent.MOUSE_DOWN&&this.mouseTarget){this._mouseDownTarget=this.mouseTarget;this._isTap=true;}
if(a.type==StageEvent.MOUSE_UP){if(this._mouseDownTarget!=null&&a.target!=this&&a.target==this._mouseDownTarget){a.target.dispatchEvent(this.__copyStageEvent(a,this._mouseDownTarget,StageEvent.MOUSE_CLICK));if(this._isTap){let evt=this.__copyStageEvent(a,this._mouseDownTarget,StageEvent.MOUSE_TAP);this.__transmitEvent(evt);a.target.dispatchEvent(evt);}}
this._mouseDownTarget=null;this._isTap=false;}
if(a.type==StageEvent.MOUSE_MOVE&&!b){this._isTap=false;return false;}
if(a.target==this)return false;return this.__transmitEvent(a);}
__transmitEvent(a)
{if(a==undefined||a.target==undefined)return false;let bool,obj=a.target;for(obj=obj.parent;obj!=null&&obj!=this;obj=obj.parent)
{if(obj.breakTouch)return true;if(!obj.mouseEnabled)continue;if(a.type==StageEvent.MOUSE_OVER||a.type==StageEvent.MOUSE_OUT){bool=obj.hitTestPoint(this.mouseX,this.mouseY);if((a.type==StageEvent.MOUSE_OVER&&bool)||(a.type==StageEvent.MOUSE_OUT&&!bool)){obj.dispatchEvent(this.__copyStageEvent(a,obj));}}
else obj.dispatchEvent(this.__copyStageEvent(a,obj));}
return false;}
__copyStageEvent(a,o,t)
{let e=Factory.c("se",a);e.target=o;e.type=t?t:e.type;return e;}
_getMouseTarget(e)
{let s,a=this.getObjectUnderPoint(this.mouseX,this.mouseY,this.usePixelTrace,false);var c=this.mouseTarget;this.mouseTarget=a;if(c&&c!=a)
{s=Factory.c("se",[StageEvent.MOUSE_OUT]);s.target=c;s.mouseX=this.mouseX;s.mouseY=this.mouseY;this.__transmitEvent(s);if(c.onMouseEvent)c.onMouseEvent(s);if(c.dispatchEvent)c.dispatchEvent(s);if(this._mouseDownTarget==c)
this._mouseDownTarget=null;}
if(a&&c!=a){s=Factory.c("se",[StageEvent.MOUSE_OVER]);s.target=a;s.mouseX=this.mouseX;s.mouseY=this.mouseY;this.__transmitEvent(s);if(a.onMouseEvent)a.onMouseEvent(s);if(a.dispatchEvent)a.dispatchEvent(s);}}
startDrag(b,r,l,f)
{if(b==undefined||b.parent==undefined)return;if(this.dragTarget)this.stopDrag();this.dragTarget=b;if(l){this._layer=b.getIndex();this.dragTarget.toTop();}
else this._layer=-1;this._area=(r&&r instanceof Rectangle)?r:null;this._block=(f&&f instanceof Rectangle)?f:null;let p=this.dragTarget.globalToLocal(this.mouseX,this.mouseY);this._dragMouseX=p.x;this._dragMouseY=p.y;}
stopDrag()
{if(this.dragTarget==null||this.dragTarget==undefined)return;if(this._layer>=0&&this.dragTarget&&this.dragTarget.parent){this.dragTarget.parent.addChildAt(this.dragTarget,this._layer);}
this._dragMouseX=this._dragMouseY=0;this.dragTarget=null;this._block=null;this._area=null;this._layer=-1;}
_keyHandler(e)
{this.dispatchEvent(Factory.c("ev",[e.type,(e||Global.root.event).keyCode,e,this.mouseTarget]));}
setCursor(target)
{this.div.style.cursor=(this.cursor==null||this.cursor=="")?(target?(target.cursor==null?"":target.cursor):""):this.cursor;}
updatePosition()
{if((this.div==null||!DOMUtil.contains(document,this.div))&&(this.canvas==null||!DOMUtil.contains(document,this.canvas)))return;let offset=DOMUtil.getElementOffset(this.div||this.canvas);this.stageX=offset.left;this.stageY=offset.top;};toString()
{return Stage.name;}
dispose()
{this.enable(false);if(this.timer)this.timer.dispose();if(this._graphics)this._graphics.dispose();if(Stage.current==this)Stage.current=null;this.stage=this.context=this.canvas=this.div=null;super.dispose();delete this._graphics,this.traceMouseTarget,this._parent_node,this.dragTarget,this.mouseTarget,this._mouseDownTarget,this.timer;delete this.isFullScreen,this.stageX,this.stageY,this.mouseX,this.mouseY,this._dragMouseX,this._dragMouseY;delete this.__message_handler,this.__touch_handler,this.__mouse_handler,this.__key_handler,this.__enter_frame;delete this._enable,this.interactive,this._activate,this.block_ratio,this._block,this.context,this.canvas,this.div,this.auto_clear,this.last_fresh,this.auto_fresh;}
static translationType(t)
{switch(t){case"touchstart":return StageEvent.MOUSE_DOWN;break;case"touchmove":return StageEvent.MOUSE_MOVE;break;case"touchend":return StageEvent.MOUSE_UP;}
return"";}}
Stage.current=null;var _rate=Symbol("rate");var _reverse_play=Symbol("reversePlay");var _remove_frame=Symbol("remove_frame");var _current_frame=Symbol("currentFrame");class MovieClip extends DisplayObject
{constructor(s=null)
{super();this.label;this._frames=[];this._paused=true;this._replay_time=0;this[_reverse_play]=false;this._count=this[_rate]=1;this._frame=1;this[_current_frame]=1;if(s)this.setFrames(s);}
get totalFrame()
{return this._frames.length;}
get currentFrame()
{return this[_current_frame];}
get rate()
{return this[_rate];}
set rate(value)
{if(value==undefined||value==null||value<=1||value==this[_rate])return;this[_rate]=Math.abs(MathUtil.int(value));}
get reverse()
{return this[_reverse_play];}
set reverse(value)
{if(value==undefined||value==null||value==this[_reverse_play])return;this[_reverse_play]=Boolean(value);}
clearAllFrames()
{if(this._frames==undefined)return;let value;while(this._frames.length>0){value=this._frames.pop();this[_remove_frame](value);}
this._frame=this[_current_frame]=1;this._paused=true;}
setFrames(data)
{if(data==null||!(data instanceof Array)||data.length<=0)return;let i,l=data.length;for(i=0;i<l;i++)this.addFrame(data[i]);if(this._frames.length>0)this.gotoAndPlay(1);}
addFrame(f,i)
{if(f==undefined||f==null)return;if(!(f instanceof Source)&&!(f instanceof DisplayObject))return;if(i==undefined)this._frames.push(f);else this._frames.splice(i,0,f);var bool=(f instanceof DisplayObject);this.width=bool?f.width:Math.max(this.width,f.frame_width,f.width);this.height=bool?f.height:Math.max(this.height,f.frame_height,f.height);this.name=bool?this.name:f.animation+(StringUtil.isEmpty(f.label)?"":(":"+f.label));}
getFrame(i)
{return(i>=0&&i<this._frames.length)?this._frames[i]:null;}
removeFrame(i)
{if(i<0||i>=this._frames.length)return;let frame=this._frames.splice(i,1);this[_remove_frame](frame);}
[_remove_frame](frame)
{if(frame==undefined||frame==null)return;if(frame instanceof Source&&frame.isClone){ObjectPool.remove(frame);}
else if(frame instanceof DisplayObject){frame.removeFromParent(true);}}
play(time)
{this._replay_time=(time==undefined)?0:time;this._paused=false;}
stop()
{this._paused=true;}
gotoAndStop(index)
{if(this._frames==undefined)return;if(typeof index=="string"){let i;var len=this._frames.length;for(i=0;i<len;i++){if(this._frames[i]&&this._frames[i].label==index){index=Number(i)+1;break;}}}
if(index<1||index>this._frames.length)return;this._frame=index;this._paused=true;}
gotoAndPlay(index)
{this.gotoAndStop(index);this._paused=false;}
nextFrame()
{this._frame=this[_reverse_play]?(this[_current_frame]<=1?this._frames.length:(this[_current_frame]-1)):(this[_current_frame]>=this._frames.length?1:(this[_current_frame]+1));}
render()
{if(!this.visible||this.alpha<=0)return;if((!this._paused||this.instance==null||(this._frame!=this[_current_frame]))&&this._frames.length>0){this.label=this.name;this[_current_frame]=this._frame;let target=this._frames[this[_current_frame]-1];if(target&&(target instanceof DisplayObject)){this.setInstance(target.instance);this.height=target.getHeight();this.width=target.getWidth();}else{this._frames[this[_current_frame]-1]=this.setInstance(target);}
let temp=this.label;this.label=this.name;this.name=temp;if(!this._paused){this._count--;if(this._count<=0){this.nextFrame();if(((this[_reverse_play]&&this[_current_frame]<=1)||(!this[_reverse_play]&&this[_current_frame]>=this._frames.length))&&this._replay_time>0){this._replay_time--;if(this._replay_time==0){this._paused=true;this.dispatchEvent(Factory.c("ev",[Event.PLAY_OVER]));}}}
this._count=(this._count<=0)?this[_rate]:this._count;}}
super.render(...arguments);}
reset(s=null)
{super.reset();this.clearAllFrames();this.label=null;this._paused=true;this._replay_time=0;this[_reverse_play]=false;this._frame=this._count=this[_rate]=this[_current_frame]=1;if(s)this.setFrames(s);}
dispose()
{this.reset();super.dispose();delete this._frame,this._count,this[_rate],this[_reverse_play],this._replay_time,this._frames,this._paused,this[_current_frame],this.label;}
toString()
{return MovieClip.name;}}
class Button extends DisplayObjectContainer
{constructor()
{super();this.autoSize=true;this.name="button_"+this.name;this.state="";this._register_instance=null;this.mouseChildren=false;this.mouseEnabled=true;this.buttonMode=true;this._enable=true;this.disabled_color;this.over_color;this.out_color;this.tf=null;this.frames={};}
get instance()
{return this._register_instance;}
set instance(value)
{let depth=null;if(this._register_instance!=null){if(this._register_instance.parent){depth=this._register_instance.getIndex();depth=Math.max(0,depth);this._register_instance.removeFromParent(false);}
this._register_instance=null;}
if(value==null)return;this._register_instance=value;if(depth!=null&&!isNaN(""+depth))this.addChildAt(this._register_instance,depth);else this.addChild(this._register_instance);this._updateSize();}
get enable()
{return this._enable;}
set enable(value)
{if(value==undefined||value==null||value==this._enable)return;this._enable=value;this.mouseEnabled=this.buttonMode=value;if(!this._enable)this.setState(Button.state.DISABLED)||this.setState(Button.state.DOWN)||this.setState(Button.state.OVER);else this.setState(Button.state.UP);}
setup(up,over,down,disabled)
{up&&this.setupState(up,Button.state.UP);over&&this.setupState(over,Button.state.OVER);down&&this.setupState(down,Button.state.DOWN);disabled&&this.setupState(disabled,Button.state.DISABLED);this.setState(Button.state.UP);}
setLabel(tf,over_color,disabled_color)
{if(this.tf)this.tf.removeFromParent(true);if(!tf)return;this.tf=(tf instanceof DisplayBase)?f:Factory.c("tf",tf);this.tf.mouseEnabled=false;this.addChild(this.tf);this.out_color=tf.color;this.over_color=over_color;this.disabled_color=disabled_color;}
getLabel()
{return this.tf?this.tf.text:"";}
setupState(obj,label)
{if(this.frames==undefined||obj==undefined||StringUtil.isEmpty(label)||(!(obj instanceof Source)&&!(obj instanceof Image)&&!(obj instanceof DisplayBase)&&!(obj instanceof Effect)&&!(obj instanceof Array)))return;let _frame=this.frames[label];if(_frame){if(_frame instanceof DisplayBase){if(obj instanceof Source){_frame.setInstance(obj);return;}
else _frame.removeFromParent(true);}
else if(_frame instanceof Effect)ObjectPool.remove(_frame);else if(_frame instanceof Array){for(j=0;j<_frame.length;j++)ObjectPool.remove(_frame[j]);}}
if(obj instanceof Source||obj instanceof Image){let temp=Factory.c("do");temp.setInstance(obj);obj=temp;}
this.frames[label]=obj;}
setState(b,p)
{if(this.state==b&&(p==undefined||!p))return false;this.state=b;if(this.tf){let color=(this.state==Button.state.DISABLED)?this.disabled_color:(this.state==Button.state.OVER||this.state==Button.state.DOWN?this.over_color:this.out_color);if(!StringUtil.isEmpty(color))this.tf.color=color;this.tf.dispatchEvent(Factory.c("ev",[Button.STATE_CHANGE,this.state]));}
if(this.frames.hasOwnProperty(this.state)&&this.frames[b]){if(this.frames[b]instanceof DisplayBase)this.instance=this.frames[b];else if(this.instance==undefined)return;else if(this.frames[b]instanceof Effect||this.frames[b]instanceof Array){Effect.run(this.instance,this.frames[b]);}}
else if(!this.tf)return false;this.__checkDisplayUpdate();return true;};onMouseEvent(b)
{if(!b||!this._enable)return;switch(b.type){case"mousemove":this.setState(Button.state.OVER);break;case"mouseout":this.setState(Button.state.UP);break;case"mousedown":if(!this.setState(Button.state.DOWN))this.setState(Button.state.OVER);break;case"mouseup":if(this.state!=Button.state.OVER)this.setState(Button.state.UP);}}
dispose()
{this._register_instance.removeFromParent(true);this._register_instance=null;if(this.frames){let i,j,obj;for(i in this.frames){obj=this.frames[i];if(obj){if(obj instanceof DisplayBase)obj.removeFromParent(true);else if(obj instanceof Effect)ObjectPool.remove(obj);else if(obj instanceof Array){for(j=0;j<obj.length;j++)ObjectPool.remove(obj[j]);}}
delete this.frames[i];}}
super.dispose();delete this._register_instance,this.frames,this.tf,this.is_reversal,this.state,this.disabled_color,this.over_color,this.out_color;;}
toString()
{return Button.name;}}
Button.STATE_CHANGE="stateChange";Button.state={UP:"up",OVER:"over",DOWN:"down",DISABLED:"disabled"};class File extends DOMDisplay
{constructor(multiple=false,accept=null)
{super();this.name=UniqueUtil.getName("File");this._reader=this._cancel_handler=this._file_select_handler=null;this.alpha=0;this.layer=995;this.max_size=0;this.auto_parse=true;this.image_to_base64=false;this.buttonMode=this.mouseEnabled=true;if(this.supported)this._browseForOpen("openFile",multiple,accept);}
get supported()
{return(Global.root.File&&Global.root.FileReader&&Global.root.FileList);}
open(cache)
{if(!cache)this._clearInputFile();if(this.element)this.element.click();}
_clearInputFile()
{if(!this.supported||this.element==null)return;this.element.removeEventListener('change',this._file_select_handler);let multiple=this.element.multiple;let accept=this.element.accept;this.element=null;this._browseForOpen("openFile",multiple,accept);}
_browseForOpen(name,multiple,accept)
{multiple=multiple||false;if(this.element==undefined){this.element=DOMUtil.createDOM("input",{type:"file",multiple:multiple,id:this.name,name:name,style:{position:Global.position}});}else{this.element.multiple=multiple;this.element.name=name;}
if(!StringUtil.isEmpty(accept)){this.element.accept=accept;}
if(this._file_select_handler==undefined){this._file_select_handler=Global.delegate(this._fileSelectHandle,this);}
this.element.addEventListener('change',this._file_select_handler,false);}
_fileSelectHandle(e)
{let i,f,t,p,files=e.target.files,failed=[],list=[],target=this,URL=Global.root.URL||Global.root.webkitURL;if(files.length&&this.max_size>0){let arr=[];for(i=0;f=files[i];i++){if(f&&f.size<1000000*this.max_size){arr.push(f);continue;}
failed.push(f?f.name:"null");}
files=arr;}
if(failed.length>0){target.dispatchEvent(Factory.c("ev",[File.LIMIT,failed]));}
if(!this.auto_parse||files.length==0){if(files.length)target.dispatchEvent(Factory.c("ev",[File.COMPLETE,files]));return;}
for(i=0;i<files.length;i++){f=files[i];if(f.type.indexOf("image")==0){p=URL.createObjectURL(f);if(!StringUtil.isEmpty(p)&&!this.image_to_base64){t=new Image();t.name=f.name;t.src=p;t.onload=function(e){URL.revokeObjectURL(t.src);list.push(t);if(i>=files.length-1)target.dispatchEvent(Factory.c("ev",[File.COMPLETE,list]));}
continue;}
target._reader=new FileReader();target._reader.onload=function(evt){if(target.image_to_base64){list.push(evt.target.result);}else{t=new Image();t.name=evt.target.name;t.src=evt.target.result;list.push(t);}
if(i>=files.length-1)target.dispatchEvent(Factory.c("ev",[File.COMPLETE,list]));}
target._reader.readAsDataURL(f);}
else if(f.type.indexOf("text")==0){target._reader=new FileReader();target._reader.onload=function(evt){t=DOMUtil.createDOM("p",{id:evt.target.name,innerHTML:"<pre>"+evt.target.result.replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</pre>"});list.push(t);if(i>=files.length-1)target.dispatchEvent(Factory.c("ev",[File.COMPLETE,list]));}
target._reader.readAsText(f);}else{target._reader=new FileReader();target._reader.onload=function(evt){list.push(evt.target.result);if(i>=files.length-1)target.dispatchEvent(Factory.c("ev",[File.COMPLETE,list]));}
target._reader.readAsBinaryString(f);}}}
abortRead()
{if(this._reader)try{this._reader.abort();}catch(e){};}
dispose()
{if(this.element){this.element.removeEventListener('change',this._file_select_handler);}
super.dispose();delete this.image_to_base64,this.auto_parse,this._cancel_handler,this._file_select_handler,this._file,this._reader,this.name;}}
File.LIMIT="file_size_out";File.COMPLETE="file_select_complete";class Effect
{constructor(type,value,time,align,tween)
{this.type=this.value=this.time=this.align=this.tween=null;this.setup(type,value,time,align,tween);}
setup(type,value,time,align,tween)
{this.type=type;this.time=time||0;this.value=value;this.align=align||0;this.tween=tween;}
clone()
{let copy=ObjectPool.create(Effect);copy.value=this.value;copy.align=this.align;copy.tween=this.tween;copy.type=this.type;copy.time=this.time;return copy;}
reset(type=null,value=null,time=0,align=0,tween=null)
{this.setup(type,value,time,align,tween);}
dispose()
{delete this.type,this.value,this.time,this.align,this.tween;}
static run(instance,effect)
{if(instance==undefined||effect==undefined)return;TweenLite.remove(instance);if(effect instanceof Effect){Effect._execute(instance,effect);return;}
if(effect instanceof Array){let i,l;for(i=0,l=effect.length;i<l;i++){Effect._execute(instance,effect[i]);}}}
static _execute(instance,effect)
{if(instance==undefined||effect==undefined)return;if(effect.align==Effect.CENTER){instance.origin={x:instance.width*0.5,y:instance.height*0.5};}
let obj,num,pos,bool=(effect.type==Effect.SHADOW);if(effect.type==Effect.MOVE||effect.type==Effect.OFFSET){pos=Point.toPoint(effect.value);if(effect.type==Effect.OFFSET)pos.offset(instance.x,instance.y);bool=true;}
if(instance[effect.type]==undefined&&!bool)return;if(effect.time<=0){if(bool)instance.moveTo(pos.x,pos.y);else instance[effect.type]=effect.value;}
if(instance.parent&&instance.parent.autoSize)instance._parent._updateSize();if(effect.time<=0)return;if(effect.type==Effect.COLOR){num=instance.color;instance.__temp_num=0;TweenLite.to(instance,effect.time,{ease:effect.tween,__temp_num:1,onUpdate:function(){instance.__checkDisplayUpdate();instance.color=ColorUtil.formatColor(ColorUtil.interpolateColor(num,effect.value,instance.__temp_num));},onComplete:function(){instance.__checkDisplayUpdate();instance.color=effect.value;}});return;}
if(effect.type==Effect.SHADOW){if(instance.filters==undefined){if((instance instanceof DisplayObjectContainer)&&instance.numChildren==1&&(instance.getChildAt(0).filters)){instance=instance.getChildAt(0);}
else return;}
if((typeof effect.value)=="string"){pos=JSON.parse(effect.value);}
else pos=effect.value;if(instance.filters.length==0){obj=new DropShadowFilter(0,0,0);instance.filters.push(obj);}else{for(let filter,i=0,l=instance.filters.length;i<l;i++){filter=instance.filters[i];if(filter&&ClassUtil.getQualifiedClassName(filter)=="DropShadowFilter"){obj=filter;continue;}}}
if(obj==undefined||pos==undefined||pos.length==undefined||pos.length<1)return;if((pos.length==1&&pos[0]==obj.distance)||(pos.length==2&&pos[0]==obj.distance&&pos[1]==obj.angle)||(pos.length==3&&pos[0]==obj.distance&&pos[1]==obj.angle&&pos[2]==obj.shadowBlur)||(pos.length==4&&pos[0]==obj.distance&&pos[1]==obj.angle&&pos[2]==obj.shadowBlur&&pos[3]==obj.shadowColor)||(pos.length==5&&pos[0]==obj.distance&&pos[1]==obj.angle&&pos[2]==obj.shadowBlur&&pos[3]==obj.shadowColor&&pos[4]==obj.alpha)||(pos.length==6&&pos[0]==obj.distance&&pos[1]==obj.angle&&pos[2]==obj.shadowBlur&&pos[3]==obj.shadowColor&&pos[4]==obj.alpha&&pos[5]==obj.radius))return;instance.__temp_num=0;TweenLite.to(instance,effect.time,{ease:effect.tween,__temp_num:1,onUpdateParams:[obj,pos,obj.distance,obj.angle,obj.shadowColor,obj.shadowBlur,obj.alpha,obj.radius],onUpdate:function(o,t,d,a,c,b,p,r){o.distance=MathUtil.format(d+(t[0]-d)*instance.__temp_num);if(t.length>1)o.angle=MathUtil.format(a+(t[1]-a)*instance.__temp_num);if(t.length>2)o.shadowBlur=MathUtil.format(b+(t[2]-b)*instance.__temp_num);if(t.length>3)o.shadowColor=ColorUtil.formatColor(ColorUtil.interpolateColor(c,t[3],instance.__temp_num));if(t.length>4)o.alpha=MathUtil.format(p+(t[4]-p)*instance.__temp_num);if(t.length>5)o.radius=MathUtil.format(r+(t[5]-r)*instance.__temp_num);if(t.length>1)o.setShadowOffset();instance.__checkDisplayUpdate();},onCompleteParams:[obj,pos],onComplete:function(o,t){o.distance=t[0];if(t.length>1)o.angle=t[1];if(t.length>2)o.shadowBlur=t[2];if(t.length>3)o.shadowColor=t[3];if(t.length>4)o.alpha=t[4];if(t.length>5)o.radius=t[5];if(t.length>1)o.setShadowOffset();instance.__checkDisplayUpdate();}});return;}
obj={ease:effect.tween};if(bool||effect.type==Effect.SCALE)
obj.onUpdate=function(){if(instance.parent&&instance.parent.autoSize)instance._parent._updateSize()};if(bool){obj.x=pos.x;obj.y=pos.y;}
else obj[effect.type]=effect.value;TweenLite.to(instance,effect.time,obj);}}
Effect.MOVE="move";Effect.COLOR="color";Effect.SCALE="scale";Effect.ALPHA="alpha";Effect.OFFSET="offset";Effect.SHADOW="shadow";Effect.CENTER=1;class Transformer extends DisplayObjectContainer
{constructor()
{super();this.lineWidth=2;this.round=16;this.support_finger=true;this.rotate=true;this.key_control=true;this.wheel_control=true;this.is_free=false;this.pos_percent={x:0.5,y:0.5};this.relative_data;this.min_size=0;this.adjust_pos=null;this._min_scale=this._point1=this._point2=this._finger_center=this._center=this._target=this._btn=this._redraw=this._canvas=this._color=this._point=null;this._target_center=this._move_point=this._target_angle=this._target_rotation=this._target_scaleX=this._target_scaleY=this._target_distance=this._target_offsetX=this._target_offsetY=null;this._cache_point={x:0,y:0};this._double_finger=false;this._has_key_down=false;this.mouseEnabled=true;this._state=0;}
get target()
{return this._target;}
set target(value)
{if(this._target==value)return;this._target=value;this.visible=(value!=null);if(this._target&&(this._target instanceof DisplayBase))this._init_transformer();else this._clear_transformer();this.update_relative_data();}
setup(target,btn,redraw,color="#888888")
{this._btn=(btn||QuickUI.getButton(this.round));this._redraw=Boolean(redraw);this._color=color;this.target=target;}
update_relative_data(bool)
{if(!this._target||!this._target.parent)return;this.relative_data=this._target.parent.getMatrix().applyDisplay();this.relative_data.radians=MathUtil.getRadiansFromDegrees(this.relative_data.rotation);if(bool)return;this.sync_display();}
sync_display()
{if(!this._target||!this._target.parent)return;DisplayUtil.copyTransform(this._target,this._canvas,this.relative_data,true);this._btn.moveTo(this.globalToLocal(this._canvas.localToGlobal(this._point.x,this._point.y)));this._canvas.thickness=(this.lineWidth*2/(this._canvas.scaleX+this._canvas.scaleY));this._canvas.resize=true;}
_update_target_size()
{this._target_rect=this._target.getBounds(this._target);if(this.adjust_pos&&this.adjust_pos.x)this._target_rect.x+=this.adjust_pos.x;if(this.adjust_pos&&this.adjust_pos.y)this._target_rect.y+=this.adjust_pos.y;if(this._canvas==undefined)this._canvas=Factory.c("bs");this._canvas.setup("#FFFFFF",this._target.width,this._target.height,0,this._redraw?this.lineWidth:0,this._color,0);if(Global.useCanvas)this._canvas.instance.moveTo(-this.lineWidth*0.5,-this.lineWidth*0.5);if(!this._point)this._point=ObjectPool.create(Point);this._point.set(this._target_rect.x+this._target_rect.width,this._target_rect.y+this._target_rect.height);if(!this._center)this._center=ObjectPool.create(Point);this._center.set(this._target_rect.x+this._target_rect.width*this.pos_percent.x,this._target_rect.y+this._target_rect.height*this.pos_percent.y);this._canvas.thickness=(this.lineWidth*2/(this._canvas.scaleX+this._canvas.scaleY));this._canvas.resize=true;if(this.min_size>0)this._min_scale=MathUtil.format(this.min_size/Math.min(this._target_rect.width,this._target_rect.height));}
_init_transformer()
{this._clear_transformer();this._update_target_size();if(!this.contains(this._canvas))this.addChild(this._canvas);this._canvas.syncSize=true;this._canvas.usePolyCollision=true;this._canvas.mouseEnabled=true;this._canvas.breakTouch=true;if(!this.contains(this._btn)){this._btn.breakTouch=true;this.addChild(this._btn);}
this._btn.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._trans_mouse_down,this),this.name);this._canvas.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._drag_mouse_down,this),this.name);this._canvas.matrix=this._target.matrix;this._btn.moveTo(this.globalToLocal(this._canvas.localToGlobal(this._point.x,this._point.y)));if(Global.isPC){if(this.wheel_control)this._canvas.addEventListener(StageEvent.MOUSE_WHEEL,Global.delegate(this._mouse_wheel_handle,this),this.name);if(this.key_control)(this.stage?this.stage:Stage.current).addEventListener(StageEvent.KEY_DOWN,Global.delegate(this._key_down,this),this.name);}}
_mouse_wheel_handle(e)
{if(!this.wheel_control)return;let sca=Math.max(this._min_scale,Math.abs(this._canvas.scaleX+e.delta*0.05));let dot=this._canvas.globalToLocal(e.mouseX,e.mouseY);this._canvas.scale=sca;dot=this._canvas.localToGlobal(dot);let poi=ObjectPool.create(Point).set(MathUtil.format(this._canvas.x+e.mouseX-dot.x),MathUtil.format(this._canvas.y+e.mouseY-dot.y));this._canvas.moveTo(poi);DisplayUtil.copyTransform(this._canvas,this._target,this.relative_data);this._canvas.thickness=(this.lineWidth*2/(this._canvas.scaleX+this._canvas.scaleY));this._btn.moveTo(this.globalToLocal(this._canvas.localToGlobal(this._point.x,this._point.y)));this.dispatchEvent(Factory.c("ev",[Transformer.SCALE]));ObjectPool.remove(poi);}
_key_up(e)
{if(this._has_key_down){(this.stage?this.stage:Stage.current).removeEventListener(StageEvent.KEY_UP,null,this.name);this.dispatchEvent(Factory.c("ev",[Transformer.MOVE]));}
this._has_key_down=false;}
_key_down(e)
{if(this.stage==null||this._target==null||!(this._target instanceof DisplayBase)||e==undefined||e.target!=this._canvas)return;let bool=false;switch(e.params){case 37:bool=true;this._canvas.x-=1;break;case 38:bool=true;this._canvas.y-=1;break;case 39:bool=true;this._canvas.x+=1;break;case 40:bool=true;this._canvas.y+=1;break;case 46:this.dispatchEvent(Factory.c("ev",[Transformer.DELETE]));return;}
if(bool){this._has_key_down=true;this._drag_mouse_move(null);(this.stage?this.stage:Stage.current).addEventListener(StageEvent.KEY_UP,Global.delegate(this._key_up,this),this.name);if(e.label){e.label.preventDefault();e.label.stopPropagation();}}}
_drag_mouse_down(e)
{this._double_finger=(e.length==2);this._state=(this.support_finger&&this._double_finger?3:1);if(this.support_finger&&this._double_finger){this._point1=e.touchs[0];this._point2=e.touchs[1];this._target_scaleX=this._canvas.scaleX;this._target_scaleY=this._canvas.scaleY;this._target_rotation=this._canvas.rotation;this._target_angle=MathUtil.getAngle(this._point1.mouseX,this._point1.mouseY,this._point2.mouseX,this._point2.mouseY);this._finger_center=ObjectPool.create(Point).set((this._point1.mouseX+this._point2.mouseX)*0.5,(this._point1.mouseY+this._point2.mouseY)*0.5);this._finger_center=this._canvas.globalToLocal(this._finger_center);this._target_distance=Math.sqrt((this._point1.mouseX-this._point2.mouseX)*(this._point1.mouseX-this._point2.mouseX)+(this._point1.mouseY-this._point2.mouseY)*(this._point1.mouseY-this._point2.mouseY));}
else{this._cache_point.x=this._canvas.x;this._cache_point.y=this._canvas.y;(this.stage?this.stage:Stage.current).startDrag(this._canvas);}
(this.stage?this.stage:Stage.current).addEventListener(StageEvent.MOUSE_UP,Global.delegate(this._drag_mouse_up,this),this.name);(this.stage?this.stage:Stage.current).addEventListener(StageEvent.MOUSE_MOVE,Global.delegate(this._drag_mouse_move,this),this.name);}
_drag_mouse_move(e)
{if(!this.support_finger||!this._double_finger){this._target.moveTo(this._target.parent.globalToLocal(this._canvas.localToGlobal(0,0)));this._btn.moveTo(this.globalToLocal(this._canvas.localToGlobal(this._point.x,this._point.y)));return;}
if(e.length!=2)return;if((this._point1.id!=e.touchs[0].id&&this._point2.id!=e.touchs[1].id)&&(this._point1.id!=e.touchs[1].id&&this._point2.id!=e.touchs[0].id))return;if(this._point1.id!=e.touchs[0].id){this._point1=e.touchs[1];this._point2=e.touchs[0];}else{this._point1=e.touchs[0];this._point2=e.touchs[1];}
if(this.rotate){let rad=MathUtil.getAngle(this._point1.mouseX,this._point1.mouseY,this._point2.mouseX,this._point2.mouseY);this._canvas.rotation=MathUtil.format(this._target_rotation+MathUtil.getDegreesFromRadians(rad-this._target_angle));}
let offX,offY,dis,cen,nce,poi;dis=Math.sqrt((this._point1.mouseX-this._point2.mouseX)*(this._point1.mouseX-this._point2.mouseX)+(this._point1.mouseY-this._point2.mouseY)*(this._point1.mouseY-this._point2.mouseY));offX=offY=dis/this._target_distance;offX=Math.max(this._min_scale,MathUtil.format(this._target_scaleX*offX));offY=Math.max(this._min_scale,MathUtil.format(this._target_scaleY*offY));this._canvas.scaleX=offX;this._canvas.scaleY=offY;cen=this._canvas.localToGlobal(this._finger_center.x,this._finger_center.y);nce=ObjectPool.create(Point).set((this._point1.mouseX+this._point2.mouseX)*0.5,(this._point1.mouseY+this._point2.mouseY)*0.5);poi=ObjectPool.create(Point).set(MathUtil.format(this._canvas.x+nce.x-cen.x),MathUtil.format(this._canvas.y+nce.y-cen.y));this._canvas.moveTo(poi);DisplayUtil.copyTransform(this._canvas,this._target,this.relative_data);this._btn.moveTo(this.globalToLocal(this._canvas.localToGlobal(this._point.x,this._point.y)));this.dispatchEvent(Factory.c("ev",[Transformer.SCALING]));ObjectPool.remove(nce);ObjectPool.remove(poi);}
_trans_mouse_down(e)
{this._target_center=this._canvas.localToGlobal(this._center.x,this._center.y);this._move_point=this._canvas.localToGlobal(this._point.x,this._point.y);this._target_distance=Point.distance(this._target_center,this._move_point);this._target_rotation=this._canvas.rotation;this._target_angle=MathUtil.getAngle(this._target_center.x,this._target_center.y,this._move_point.x,this._move_point.y);if(!this.rotate&&this.is_free&&this.relative_data&&this.relative_data.radians!=0){Point.rotate(this._move_point,this.relative_data,this.relative_data.radians,true);}
this._target_scaleX=this._canvas.scaleX;this._target_scaleY=this._canvas.scaleY;this._target_offsetX=Math.max(0,this._move_point.x-this._target_center.x);this._target_offsetY=Math.max(0,this._move_point.y-this._target_center.y);(this.stage?this.stage:Stage.current).addEventListener(StageEvent.MOUSE_UP,Global.delegate(this._drag_mouse_up,this),this.name);(this.stage?this.stage:Stage.current).addEventListener(StageEvent.MOUSE_MOVE,Global.delegate(this._trans_mouse_move,this),this.name);}
_trans_mouse_move(e)
{let pos=ObjectPool.create(Point).set(e.mouseX,e.mouseY);if(this.rotate){let rad=MathUtil.getAngle(this._target_center.x,this._target_center.y,pos.x,pos.y);this._canvas.rotation=MathUtil.format(this._target_rotation+MathUtil.getDegreesFromRadians(rad-this._target_angle));}
let offX,offY,dis;if(!this.rotate&&this.is_free){if(this.relative_data&&this.relative_data.radians!=0){Point.rotate(pos,this.relative_data,this.relative_data.radians,true);}
offX=Math.max(0,(pos.x-this._target_center.x))/this._target_offsetX;offY=Math.max(0,(pos.y-this._target_center.y))/this._target_offsetY;}
else{dis=Point.distance(this._target_center,pos);offX=offY=dis/this._target_distance;}
offX=Math.max(this._min_scale,MathUtil.format(this._target_scaleX*offX));offY=Math.max(this._min_scale,MathUtil.format(this._target_scaleY*offY));if(!(!this.rotate&&this.is_free&&(offX==this._min_scale||offY==this._min_scale))){this._canvas.scaleX=offX;this._canvas.scaleY=offY;if(this._redraw)this._canvas.thickness=(this.lineWidth*2/(offX+offY));}
let cen=this._canvas.localToGlobal(this._center.x,this._center.y);this._btn.moveTo(!this.rotate||offX==this._min_scale||offY==this._min_scale?this.globalToLocal(this._canvas.localToGlobal(this._point.x,this._point.y)):this.globalToLocal(e.mouseX,e.mouseY));this._canvas.moveTo(MathUtil.format(this._canvas.x+this._target_center.x-cen.x),MathUtil.format(this._canvas.y+this._target_center.y-cen.y));DisplayUtil.copyTransform(this._canvas,this._target,this.relative_data);this._state=2;ObjectPool.remove(pos);this.dispatchEvent(Factory.c("ev",[Transformer.SCALING]));}
_drag_mouse_up(e)
{(this.stage?this.stage:Stage.current).stopDrag();(this.stage?this.stage:Stage.current).removeEventListener(StageEvent.MOUSE_UP,null,this.name);(this.stage?this.stage:Stage.current).removeEventListener(StageEvent.MOUSE_MOVE,null,this.name);this._finger_center,this._point1=this._point2=this._target_center=this._move_point=this._target_scaleX=this._target_scaleY=this._target_distance=this._target_rotation=this._target_angle=null;if(this._state==1&&DoubleClick.check())this.dispatchEvent(Factory.c("ev",[Transformer.DOUBLE_CLICK]));else if(this._state==1&&Math.sqrt((this._cache_point.x-this._canvas.x)*(this._cache_point.x-this._canvas.x)+(this._cache_point.y-this._canvas.y)*(this._cache_point.y-this._canvas.y))<3)this.dispatchEvent(Factory.c("ev",[Transformer.CLICK]));else if(this._state>0)this.dispatchEvent(Factory.c("ev",[this._state==1?Transformer.MOVE:Transformer.SCALE]));this._state=0;}
_clear_transformer()
{if(this._canvas){if(this.contains(this._canvas))this._canvas.removeFromParent(false);this._canvas.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);if(Global.isPC&&this.wheel_control)
this._canvas.removeEventListener(StageEvent.MOUSE_WHEEL,null,this.name);this._canvas.reset();}
if(this._btn){this._btn.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);if(this.contains(this._btn))this._btn.removeFromParent(false);}
if(Global.isPC&&this.key_control&&(this.stage?this.stage:Stage.current).hasEventListener(StageEvent.KEY_DOWN,this.name)){(this.stage?this.stage:Stage.current).removeEventListener(StageEvent.KEY_DOWN,null,this.name);(this.stage?this.stage:Stage.current).removeEventListener(StageEvent.KEY_UP,null,this.name);}
this._drag_mouse_up(null);}
dispose()
{super.dispose();delete this._finger_center,this._double_finger,this._point1,this._point2,this._cache_point,this._state,this.relative_data,this._center,this._color,this._target,this._btn,this._redraw,this._canvas;delete this.support_finger,this._min_scale,this.min_size,this.wheel_control,this._has_key_down,this.key_control,this.is_free,this.pos_percent,this.rotate,this.round,this.lineWidth,this._target_center,this._move_point,this._target_angle,this._target_rotation,this._target_scaleX,this._target_scaleY,this._target_distance,this._target_offsetX,this._target_offsetY;}}
Transformer.MOVE="transformer_move";Transformer.SCALE="transformer_scale";Transformer.CLICK="transformer_click";Transformer.DELETE="transformer_delete";Transformer.SCALING="transformer_scaling";Transformer.DOUBLE_CLICK="transformer_double_click";class QuickUI
{static getButton(r,w,h,c1,c2,t,c3,s)
{r=(r==undefined)?0:r;w=(w==undefined)?0:w;h=(h==undefined)?0:h;c1=(c1==undefined)?"#FF9E26":ColorUtil.formatColor(c1);c2=(c2==undefined)?"#FF7C0D":ColorUtil.formatColor(c2);let btn=new Button();let shape=Factory.c("bs");let bool=(w==0&&h==0);w=Math.max(r*2,w);h=Math.max(r*2,h);let color=bool?new GColor(1,r,r,r,r,[0.1,1],[c1,c2],r*0.25,r):new GColor(0,0,0,0,h,[0.1,0.9],[c1,c2],w,h);shape.setup(color,w,h,r,t,c3);shape.origin={x:w*0.5,y:h*0.5};btn.instance=shape;if(Global.isPC&&(s==undefined||s==0)){btn.setup([Factory.c("ef",[Effect.MOVE,"{0,0}",0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)]),Factory.c("ef",[Effect.SHADOW,[4,70,10,"#222222",0.5,r],0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)])],[Factory.c("ef",[Effect.MOVE,"{0,3}",0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)]),Factory.c("ef",[Effect.SHADOW,[0,70,0,"#000000",0.5,r],0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)])]);}else{btn.setup([Factory.c("ef",[Effect.SCALE,1,0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)])],null,[Factory.c("ef",[Effect.SCALE,0.89,0.11,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.OUT)])]);}
return btn;}
static getImage(url,callback,only_image,errorback)
{if(StringUtil.isEmpty(url))return null;let dc,img=new Image();if(!only_image)dc=Factory.c("do");img.src=url;if(img.complete){if(only_image)return img;dc.setInstance(img);return dc;}
img.onload=function(){img.onerror=img.onload=null;if(!only_image)dc.setInstance(img);if(callback)callback(only_image?img:dc);only_image=errorback=null;}
img.onerror=function(){img.onerror=img.onload=null;if(errorback)errorback(only_image?null:dc);only_image=errorback=null;}
return dc?dc:img;}
static rectDisplay(w,h,c,use_canvas)
{if(!w||!h)return;c=c||"#000000";use_canvas=(use_canvas==null?Global.useCanvas:use_canvas);let is_img=(typeof c!="string"&&(c instanceof Image||ClassUtil.getQualifiedClassName(c)=="HTMLImageElement"));let obj=Factory.c("do",null,use_canvas);if(use_canvas){if(is_img){obj.setInstance(c);obj.repeat(w,h);}else{obj.graphics.lineStyle(0);obj.graphics.beginFill(c);obj.graphics.drawRect(0,0,w,h);obj.graphics.endFill();}}else{let args={width:w+"px",height:h+"px",overflow:"hidden"};if(is_img)args.background='url('+c.src+')';else args.backgroundColor=c;obj.element=DOMUtil.createDOM("div",{style:args});}
obj.setSize(w,h);return obj;}}
class DrawUtil
{static rect(rect,target,color,alpha)
{let bool=(target==undefined);let temp;if(!bool){if(!(target instanceof DisplayObject)&&!(target instanceof Graphics))return;if(target instanceof DisplayObject){temp=target;target=target.graphics;}}
target=target||new Graphics();color=color||"#000000";alpha=alpha||1;target.clear();target.lineStyle(1,color,alpha);target.beginFill(color,alpha);target.drawRect(rect.hasOwnProperty("x")?rect.x:0,rect.hasOwnProperty("y")?rect.y:0,rect.width,rect.height);target.endFill();if(!bool)return temp||target;return CanvasUtil.toImage(target.canvas);}
static roundRect(rect,radius,target,color,alpha)
{let bool=(target==undefined);let temp;if(!bool){if(!(target instanceof DisplayObject)&&!(target instanceof Graphics))return;if(target instanceof DisplayObject){temp=target;target=target.graphics;}}
target=target||new Graphics();color=color||"#000000";alpha=alpha||1;target.clear();target.lineStyle(1,color,alpha);target.beginFill(color,alpha);target.drawRoundRect(rect.hasOwnProperty("x")?rect.x:0,rect.hasOwnProperty("y")?rect.y:0,rect.width,rect.height,radius);target.endFill();if(!bool)return temp||target;return CanvasUtil.toImage(target.canvas);}
static circle(point,radius,target,color,alpha)
{let bool=(target==undefined);let temp;if(!bool){if(!(target instanceof DisplayObject)&&!(target instanceof Graphics))return;if(target instanceof DisplayObject){temp=target;target=target.graphics;}}
target=target||new Graphics();color=color||"#000000";alpha=alpha||1;target.clear();target.lineStyle(1,color,alpha);target.beginFill(color,alpha);target.drawCircle(point.hasOwnProperty("x")?point.x:0,point.hasOwnProperty("y")?point.y:0,radius);target.endFill();if(!bool)return temp||target;return CanvasUtil.toImage(target.canvas);}}
class ShapeUtil
{static pointsToPath(points,is_close,is_node)
{if(!points||points.length<2)return"";let p,str="";for(let i=0,l=points.length;i<l;i++){p=points[i];str+=(i==0?"M ":(i==1?" L ":", "))+(p instanceof Array?p[0]:p.x)+" "+(p instanceof Array?p[1]:p.y);}
p=points[0];str+=(is_close?" Z":'');return is_node?'<path d="'+str+'" />':str;}
static rectToPath(properties,is_node)
{let x=Number(properties.x||0),y=Number(properties.y||0),width=Number(properties.width),height=Number(properties.height),rx=Number(properties.rx||0),ry=Number(properties.ry||rx||0);rx=rx>width*0.5?width*0.5:rx;ry=ry>height*0.5?height*0.5:ry;let str,w=width-rx*2,h=height-ry*2,C=0.5522847498307933,cx=C*rx,cy=C*ry;if(0==rx||0==ry)
str='M'+x+' '+y+' L'+(x+width)+' '+y+' L'+(x+width)+' '+(y+height)+' L'+x+' '+(y+height)+' Z';else
str='M'+(x+width)+' '+(y+ry)+' C'+(x+width)+' '+(y+ry-cy)+' '+(x+w+rx+cx)+' '+y+' '+(x+w+rx)+' '+y+' L'+(x+rx)+' '+y+' C'+(x+rx-cx)+' '+y+' '+x+' '+(y+ry-cy)+' '+x+' '+(y+ry)+' L'+x+' '+(y+h+ry)+' C'+x+' '+(y+h+ry+cy)+' '+(x+rx-cx)+' '+(y+height)+' '+(x+rx)+' '+(y+height)+' L'+(x+rx+w)+' '+(y+height)+' C'+(x+w+rx+cx)+' '+(y+height)+' '+(x+width)+' '+(y+h+ry+cy)+' '+(x+width)+' '+(y+h+ry)+' Z';return is_node?'<path d="'+str+'" />':str;}
static ellipseToPath(properties,is_node)
{let cx=Number(properties.cx||0),cy=Number(properties.cy||0),r=Number(properties.r||0),rx=Number(properties.rx||0),ry=Number(properties.ry||0),k=0.5522848,a=(r==0?rx:r),b=(r==0?ry:r),x=a*k,y=b*k;let str='M'+MathUtil.format(cx-a)+' '+cy+' C'+MathUtil.format(cx-a)+' '+MathUtil.format(cy-y)+' '+MathUtil.format(cx-x)+' '+MathUtil.format(cy-b)+' '+cx+' '+MathUtil.format(cy-b)+' C'+MathUtil.format(cx+x)+' '+MathUtil.format(cy-b)+' '+MathUtil.format(cx+a)+' '+MathUtil.format(cy-y)+' '+MathUtil.format(cx+a)+' '+cy+' C'+MathUtil.format(cx+a)+' '+MathUtil.format(cy+y)+' '+MathUtil.format(cx+x)+' '+MathUtil.format(cy+b)+' '+cx+' '+MathUtil.format(cy+b)+' C'+MathUtil.format(cx-x)+' '+MathUtil.format(cy+b)+' '+MathUtil.format(cx-a)+' '+MathUtil.format(cy+y)+' '+MathUtil.format(cx-a)+' '+cy+' Z';return is_node?'<path d="'+str+'" />':str;}
static getShapeBounds(vo,only_pts)
{if(!vo)return null;let points=[];switch(vo.type)
{case SVGLabel.LINE:points.push([vo.properties.x1,vo.properties.y1]);points.push([vo.properties.x2,vo.properties.y2]);break;case SVGLabel.POLYLINE:case SVGLabel.POLYGON:points=ArrayUtil.each(vo.properties.points.split(/ /),function(d,i,a){a[i]=d.split(/,/);});break;case SVGLabel.RECT:points.push([(vo.properties.x||0),(vo.properties.y||0)]);points.push([(vo.properties.x||0)+vo.properties.width,(vo.properties.y||0)+vo.properties.height]);break;case SVGLabel.CIRCLE:points.push([(vo.properties.cx||0)-vo.properties.r,(vo.properties.cy||0)-vo.properties.r]);points.push([(vo.properties.cx||0)+vo.properties.r,(vo.properties.cy||0)+vo.properties.r]);break;case SVGLabel.ELLIPSE:points.push([(vo.properties.cx||0)-vo.properties.rx,(vo.properties.cy||0)-vo.properties.ry]);points.push([(vo.properties.cx||0)+vo.properties.rx,(vo.properties.cy||0)+vo.properties.ry]);break;case SVGLabel.PATH:let path=vo.properties.d.split(/[a-zA-Z]/);for(let i=0,j,p1,p2,s,n,l=path.length;i<l;i++){s=path[i];if(StringUtil.isEmpty(s))continue;s=ArrayUtil.format(StringUtil.trim(s).split(/,| |-/));for(j=0,n=s.length;j<n;j+=2){p1=s[j];p2=s[j+1];if(!StringUtil.isEmpty(p1)&&!StringUtil.isEmpty(p2)){points.push(only_pts?ObjectPool.create(Point).set(p1,p2):[p1,p2]);}}}
break;}
return only_pts?points:Rectangle.getPointsBounds(points);}
static replace(vo,pos)
{if(!vo||!pos||!vo.rect||(pos.x==vo.rect.x&&pos.y==vo.rect.y&&(!pos.s||pos.s==1)))return vo;if(vo.type==SVGLabel.PATH&&(/A|V|S|T|H/).test(vo.properties.d.toUpperCase())){trace("[ERROR] ShapeUtil.replace path won't support some attributes.");return vo;}
let scale=(!pos.s?1:pos.s);vo.rect.multiply(scale);let points,offset={x:(pos.x-vo.rect.x),y:(pos.y-vo.rect.y)};vo.rect.x=pos.x;vo.rect.y=pos.y;switch(vo.type)
{case SVGLabel.LINE:vo.properties.x1=MathUtil.format(parseFloat(vo.properties.x1)*scale+offset.x);vo.properties.y1=MathUtil.format(parseFloat(vo.properties.y1)*scale+offset.y);vo.properties.x2=MathUtil.format(parseFloat(vo.properties.x2)*scale+offset.x);vo.properties.y2=MathUtil.format(parseFloat(vo.properties.y2)*scale+offset.y);break;case SVGLabel.POLYLINE:case SVGLabel.POLYGON:points=ArrayUtil.each(ArrayUtil.format(vo.properties.points.split(/ /)),function(d,i,a){let point=d.split(/,/);a[i]=MathUtil.format(parseFloat(point[0])*scale+offset.x)+","+MathUtil.format(parseFloat(point[1])*scale+offset.y);});vo.properties.points=points.join(" ");break;case SVGLabel.RECT:vo.properties.x=MathUtil.format(parseFloat(vo.properties.x||0)*scale+offset.x);vo.properties.y=MathUtil.format(parseFloat(vo.properties.y||0)*scale+offset.y);vo.properties.height=vo.properties.height*scale;vo.properties.width=vo.properties.width*scale;if(vo.properties.hasOwnProperty("rx")&&vo.properties.rx)vo.properties.rx=vo.properties.rx*scale;if(vo.properties.hasOwnProperty("ry")&&vo.properties.ry)vo.properties.ry=vo.properties.ry*scale;break;case SVGLabel.CIRCLE:case SVGLabel.ELLIPSE:vo.properties.cx=MathUtil.format(parseFloat(vo.properties.cx||0)*scale+offset.x);vo.properties.cy=MathUtil.format(parseFloat(vo.properties.cy||0)*scale+offset.y);if(vo.properties.hasOwnProperty("r")&&vo.properties.r)vo.properties.r=vo.properties.r*scale;if(vo.properties.hasOwnProperty("rx")&&vo.properties.rx)vo.properties.rx=vo.properties.rx*scale;if(vo.properties.hasOwnProperty("ry")&&vo.properties.ry)vo.properties.ry=vo.properties.ry*scale;break;case SVGLabel.PATH:points=ShapeUtil.getShapeBounds(vo,true);points=ArrayUtil.each(points,function(p){p.x=MathUtil.format(p.x*scale+offset.x);p.y=MathUtil.format(p.y*scale+offset.y);});let str='',data=ArrayUtil.format(vo.properties.d.split(/,| |-|(?=[a-zA-Z])/));for(let p,i=0,j=0,l=data.length;i<l;i++){p=data[i];if((/[a-zA-Z]/).test(p)){str+=p[0]+" ";if(p.length==1){data.splice(i,1);p=data[i];l--;}}
if(j>=points.length)continue;p=points[j];str+=p[i%2==0?"x":"y"]+" ";if(i%2==1)j++;}
vo.properties.d=str;break;}
return vo;}
static getRect(x,y,w,h,rx,ry)
{rx=rx||0;ry=ry||rx||0;return ObjectPool.create(ShapeVO).setup(SVGLabel.RECT,{x:x,y:y,width:w,height:h,rx:rx,ry:ry});}
static getCircle(x,y,rx,ry)
{ry=ry||rx;return ObjectPool.create(ShapeVO).setup(ry==rx?SVGLabel.CIRCLE:SVGLabel.ELLIPSE,(ry==rx?{cx:x,cy:y,r:rx}:{cx:x,cy:y,rx:rx,ry:ry}));}
static getPolygon(points)
{if(!points||!(points instanceof Array)||points.length<3)return;let str='';ArrayUtil.each(points,function(p,i){let bool=(p instanceof Array);str+=(bool?p.join(","):p.x+","+p.y)+(i<(points.length-1)?" ":"");});return ObjectPool.create(ShapeVO).setup(SVGLabel.POLYGON,{points:str});}
static getLine(points)
{if(!points||!(points instanceof Array)||points.length<2)return;let str='';ArrayUtil.each(points,function(p,i){let bool=(p instanceof Array);str+=(bool?p.join(","):p.x+","+p.y)+(i<(points.length-1)?" ":"");});return ObjectPool.create(ShapeVO).setup(SVGLabel.POLYLINE,{points:str});}}
class DisplayUtil
{static copyTransform(obj,target,data,bool)
{if(obj==undefined||target==undefined||target.parent==undefined)return;let r=(data&&data.hasOwnProperty("rotation")?data.rotation:0);let sx=(data&&data.hasOwnProperty("scaleX")?data.scaleX:1);let sy=(data&&data.hasOwnProperty("scaleY")?data.scaleY:1);target.rotation=obj.rotation+(bool?r:-r);target.scaleX=obj.scaleX*(bool?sx:1/sx);target.scaleY=obj.scaleY*(bool?sy:1/sy);target.moveTo(target.parent.globalToLocal(obj.localToGlobal(0,0)));}
static equalOrContain(gt,ct)
{if(gt==null||ct==null)return false;if(!(ct instanceof DisplayObjectContainer))return(gt==ct);for(let obj=gt;obj!=null;obj=obj.parent)
{if(obj==ct)return true;}
return false;}
static autoSizeFromText(tf,minSize)
{if(tf==null||StringUtil.isEmpty(tf.text))return;let sh,th,bool,type=ClassUtil.getQualifiedClassName(tf);if(!(type=="InputText"||(type=="TextField"&&tf.lineWidth>0)))return;minSize=minSize||8;bool=(type=="InputText");tf.render();th=tf.height;sh=(bool?tf.element:tf).scrollHeight;if(sh<=th)return;while(tf.size>minSize&&sh>th){tf.size=tf.size-1;tf.render();sh=(bool?tf.element:tf).scrollHeight;}}}
class Easing
{static easeNone(t,b,c,d,p_params)
{return c*t/d+b;}
static easeInQuad(t,b,c,d,p_params)
{return c*(t/=d)*t+b;}
static easeOutQuad(t,b,c,d,p_params)
{return-c*(t/=d)*(t-2)+b;}
static easeInOutQuad(t,b,c,d,p_params)
{if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b;}
static easeOutInQuad(t,b,c,d,p_params)
{if(t<d/2)return Easing.easeOutQuad(t*2,b,c/2,d,p_params);return Easing.easeInQuad((t*2)-d,b+c/2,c/2,d,p_params);}
static easeInCubic(t,b,c,d,p_params)
{return c*(t/=d)*t*t+b;}
static easeOutCubic(t,b,c,d,p_params)
{return c*((t=t/d-1)*t*t+1)+b;}
static easeInOutCubic(t,b,c,d,p_params)
{if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b;}
static easeOutInCubic(t,b,c,d,p_params)
{if(t<d/2)return Easing.easeOutCubic(t*2,b,c/2,d,p_params);return Easing.easeInCubic((t*2)-d,b+c/2,c/2,d,p_params);}
static easeInQuart(t,b,c,d,p_params)
{return c*(t/=d)*t*t*t+b;}
static easeOutQuart(t,b,c,d,p_params)
{return-c*((t=t/d-1)*t*t*t-1)+b;}
static easeInOutQuart(t,b,c,d,p_params)
{if((t/=d/2)<1)return c/2*t*t*t*t+b;return-c/2*((t-=2)*t*t*t-2)+b;}
static easeOutInQuart(t,b,c,d,p_params)
{if(t<d/2)return Easing.easeOutQuart(t*2,b,c/2,d,p_params);return Easing.easeInQuart((t*2)-d,b+c/2,c/2,d,p_params);}
static easeInQuint(t,b,c,d,p_params)
{return c*(t/=d)*t*t*t*t+b;}
static easeOutQuint(t,b,c,d,p_params)
{return c*((t=t/d-1)*t*t*t*t+1)+b;}
static easeInOutQuint(t,b,c,d,p_params)
{if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b;}
static easeOutInQuint(t,b,c,d,p_params)
{if(t<d/2)return Easing.easeOutQuint(t*2,b,c/2,d,p_params);return Easing.easeInQuint((t*2)-d,b+c/2,c/2,d,p_params);}
static easeInSine(t,b,c,d,p_params)
{return-c*Math.cos(t/d*(Math.PI/2))+c+b;}
static easeOutSine(t,b,c,d,p_params)
{return c*Math.sin(t/d*(Math.PI/2))+b;}
static easeInOutSine(t,b,c,d,p_params)
{return-c/2*(Math.cos(Math.PI*t/d)-1)+b;}
static easeOutInSine(t,b,c,d,p_params)
{if(t<d/2)return Easing.easeOutSine(t*2,b,c/2,d,p_params);return Easing.easeInSine((t*2)-d,b+c/2,c/2,d,p_params);}
static easeInExpo(t,b,c,d,p_params)
{return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b-c*0.001;}
static easeOutExpo(t,b,c,d,p_params)
{return(t==d)?b+c:c*1.001*(-Math.pow(2,-10*t/d)+1)+b;}
static easeInOutExpo(t,b,c,d,p_params)
{if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b-c*0.0005;return c/2*1.0005*(-Math.pow(2,-10*--t)+2)+b;}
static easeOutInExpo(t,b,c,d,p_params)
{if(t<d/2)return Easing.easeOutExpo(t*2,b,c/2,d,p_params);return Easing.easeInExpo((t*2)-d,b+c/2,c/2,d,p_params);}
static easeInCirc(t,b,c,d,p_params)
{return-c*(Math.sqrt(1-(t/=d)*t)-1)+b;}
static easeOutCirc(t,b,c,d,p_params)
{return c*Math.sqrt(1-(t=t/d-1)*t)+b;}
static easeInOutCirc(t,b,c,d,p_params)
{if((t/=d/2)<1)return-c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b;}
static easeOutInCirc(t,b,c,d,p_params)
{if(t<d/2)return Easing.easeOutCirc(t*2,b,c/2,d,p_params);return Easing.easeInCirc((t*2)-d,b+c/2,c/2,d,p_params);}
static easeInElastic(t,b,c,d,p_params)
{if(t==0)return b;if((t/=d)==1)return b+c;let p=!Boolean(p_params)||isNaN(p_params.period)?d*.3:p_params.period;let s;let a=!Boolean(p_params)||isNaN(p_params.amplitude)?0:p_params.amplitude;if(!Boolean(a)||a<Math.abs(c)){a=c;s=p/4;}else{s=p/(2*Math.PI)*Math.asin(c/a);}
return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;}
static easeOutElastic(t,b,c,d,p_params)
{if(t==0)return b;if((t/=d)==1)return b+c;let p=!Boolean(p_params)||isNaN(p_params.period)?d*.3:p_params.period;let s;let a=!Boolean(p_params)||isNaN(p_params.amplitude)?0:p_params.amplitude;if(!Boolean(a)||a<Math.abs(c)){a=c;s=p/4;}else{s=p/(2*Math.PI)*Math.asin(c/a);}
return(a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b);}
static easeInOutElastic(t,b,c,d,p_params)
{if(t==0)return b;if((t/=d/2)==2)return b+c;let p=!Boolean(p_params)||isNaN(p_params.period)?d*(.3*1.5):p_params.period;let s;let a=!Boolean(p_params)||isNaN(p_params.amplitude)?0:p_params.amplitude;if(!Boolean(a)||a<Math.abs(c)){a=c;s=p/4;}else{s=p/(2*Math.PI)*Math.asin(c/a);}
if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;}
static easeOutInElastic(t,b,c,d,p_params)
{if(t<d/2)return Easing.easeOutElastic(t*2,b,c/2,d,p_params);return Easing.easeInElastic((t*2)-d,b+c/2,c/2,d,p_params);}
static easeInBack(t,b,c,d,p_params)
{let s=!Boolean(p_params)||isNaN(p_params.overshoot)?1.70158:p_params.overshoot;return c*(t/=d)*t*((s+1)*t-s)+b;}
static easeOutBack(t,b,c,d,p_params)
{let s=!Boolean(p_params)||isNaN(p_params.overshoot)?1.70158:p_params.overshoot;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;}
static easeInOutBack(t,b,c,d,p_params)
{let s=!Boolean(p_params)||isNaN(p_params.overshoot)?1.70158:p_params.overshoot;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;}
static easeOutInBack(t,b,c,d,p_params)
{if(t<d/2)return Easing.easeOutBack(t*2,b,c/2,d,p_params);return Easing.easeInBack((t*2)-d,b+c/2,c/2,d,p_params);}
static easeInBounce(t,b,c,d,p_params)
{return c-Easing.easeOutBounce(d-t,0,c,d)+b;}
static easeOutBounce(t,b,c,d,p_params)
{if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b;}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;}}
static easeInOutBounce(t,b,c,d,p_params)
{if(t<d/2)return Easing.easeInBounce(t*2,0,c,d)*.5+b;else return Easing.easeOutBounce(t*2-d,0,c,d)*.5+c*.5+b;}
static easeOutInBounce(t,b,c,d,p_params)
{if(t<d/2)return Easing.easeOutBounce(t*2,b,c/2,d,p_params);return Easing.easeInBounce((t*2)-d,b+c/2,c/2,d,p_params);}
static easeInStrong(t,b,c,d,p_params)
{return c*(t/=d)*t*t*t*t+b;}
static easeOutStrong(t,b,c,d,p_params)
{return c*((t=t/d-1)*t*t*t*t+1)+b;}
static easeInOutStrong(t,b,c,d,p_params)
{if((t/=d*0.5)<1)return c*0.5*t*t*t*t*t+b;return c*0.5*((t-=2)*t*t*t*t+2)+b;}}
class TweenLite
{static init()
{TweenLite._inited=true;TweenLite.register("easenone",Easing.easeNone);TweenLite.register("linear",Easing.easeNone);TweenLite.register("easeinquad",Easing.easeInQuad);TweenLite.register("easeoutquad",Easing.easeOutQuad);TweenLite.register("easeinoutquad",Easing.easeInOutQuad);TweenLite.register("easeoutinquad",Easing.easeOutInQuad);TweenLite.register("easeincubic",Easing.easeInCubic);TweenLite.register("easeoutcubic",Easing.easeOutCubic);TweenLite.register("easeinoutcubic",Easing.easeInOutCubic);TweenLite.register("easeoutincubic",Easing.easeOutInCubic);TweenLite.register("easeinquart",Easing.easeInQuart);TweenLite.register("easeoutquart",Easing.easeOutQuart);TweenLite.register("easeinoutquart",Easing.easeInOutQuart);TweenLite.register("easeoutinquart",Easing.easeOutInQuart);TweenLite.register("easeinquint",Easing.easeInQuint);TweenLite.register("easeoutquint",Easing.easeOutQuint);TweenLite.register("easeinoutquint",Easing.easeInOutQuint);TweenLite.register("easeoutinquint",Easing.easeOutInQuint);TweenLite.register("easeinsine",Easing.easeInSine);TweenLite.register("easeoutsine",Easing.easeOutSine);TweenLite.register("easeinoutsine",Easing.easeInOutSine);TweenLite.register("easeoutinsine",Easing.easeOutInSine);TweenLite.register("easeincirc",Easing.easeInCirc);TweenLite.register("easeoutcirc",Easing.easeOutCirc);TweenLite.register("easeinoutcirc",Easing.easeInOutCirc);TweenLite.register("easeoutincirc",Easing.easeOutInCirc);TweenLite.register("easeinexpo",Easing.easeInExpo);TweenLite.register("easeoutexpo",Easing.easeOutExpo);TweenLite.register("easeinoutexpo",Easing.easeInOutExpo);TweenLite.register("easeoutinexpo",Easing.easeOutInExpo);TweenLite.register("easeinelastic",Easing.easeInElastic);TweenLite.register("easeoutelastic",Easing.easeOutElastic);TweenLite.register("easeinoutelastic",Easing.easeInOutElastic);TweenLite.register("easeoutinelastic",Easing.easeOutInElastic);TweenLite.register("easeinback",Easing.easeInBack);TweenLite.register("easeoutback",Easing.easeOutBack);TweenLite.register("easeinoutback",Easing.easeInOutBack);TweenLite.register("easeoutinback",Easing.easeOutInBack);TweenLite.register("easeinbounce",Easing.easeInBounce);TweenLite.register("easeoutbounce",Easing.easeOutBounce);TweenLite.register("easeinoutbounce",Easing.easeInOutBounce);TweenLite.register("easeoutinbounce",Easing.easeOutInBounce);TweenLite.register("easeinstrong",Easing.easeInStrong);TweenLite.register("easeoutstrong",Easing.easeOutStrong);TweenLite.register("easeinoutstrong",Easing.easeInOutStrong);}
static register(p_name,p_function)
{TweenLite._transitionList[p_name]=p_function;}
static count(name,mode,start_value,target_value,min,max,param)
{if(!TweenLite._inited)TweenLite.init();var p_name=TweenLite.getEaseName(name,mode);return TweenLite._tween(p_name,min,target_value,target_value-start_value,max,param);}
static getEaseName(name,mode)
{return(name==TweenLite.LINEAR)?TweenLite.LINEAR:("ease"+(name==TweenLite.NONE?TweenLite.NONE:(mode+name)));}
static _tween(ease,start_value,target_value,min,max,param)
{if(!TweenLite._inited)TweenLite.init();if(!TweenLite._transitionList.hasOwnProperty(ease))return target_value;return TweenLite._transitionList[ease](min,start_value,target_value,max,param);}
static to(target,duration,vars)
{if(target==undefined||duration<=0||vars==undefined)return;if(TweenLite._tweens.length==0){if(!TweenLite._locked&&Stage.current){Stage.current.addEventListener(StageEvent.ENTER_FRAME,TweenLite._enterFrame);}else{if(TweenLite._timer==null)TweenLite._timer=new Timer();TweenLite._timer.addEventListener(Timer.TIME,TweenLite._enterFrame);TweenLite._timer.start();}}
var data={target:target,duration:duration,vars:vars};data.max=Math.ceil(duration*Timer.fps);data.min=0;if(data.vars.hasOwnProperty("delay")&&data.vars["delay"]){data.delay=Math.ceil(Number(data.vars["delay"])*Timer.fps);delete data.vars["delay"];}else{data.delay=0;}
if(data.vars.hasOwnProperty("ease")&&data.vars["ease"]){data.ease=data.vars["ease"];delete data.vars["ease"];}else{data.ease="easeoutquad";}
if(data.vars.hasOwnProperty("easeParams")&&data.vars["easeParams"]){data.easeParams=data.vars["easeParams"];delete data.vars["easeParams"];}
if(data.vars.hasOwnProperty("onStart")&&data.vars["onStart"]){data.onStart=data.vars["onStart"];delete data.vars["onStart"];}
if(data.vars.hasOwnProperty("onStartParams")&&data.vars["onStartParams"]){data.onStartParams=data.vars["onStartParams"];delete data.vars["onStartParams"];}
if(data.vars.hasOwnProperty("onUpdate")&&data.vars["onUpdate"]){data.onUpdate=data.vars["onUpdate"];delete data.vars["onUpdate"];}
if(data.vars.hasOwnProperty("onUpdateParams")&&data.vars["onUpdateParams"]){data.onUpdateParams=data.vars["onUpdateParams"];delete data.vars["onUpdateParams"];}
if(data.vars.hasOwnProperty("onComplete")&&data.vars["onComplete"]){data.onComplete=data.vars["onComplete"];delete data.vars["onComplete"];}
if(data.vars.hasOwnProperty("onCompleteParams")&&data.vars["onCompleteParams"]){data.onCompleteParams=data.vars["onCompleteParams"];delete data.vars["onCompleteParams"];}
let k;for(k in data.vars){if(data.first==undefined)data.first={};data.first[k]=(target[k]==undefined)?0:target[k];data.vars[k]-=data.first[k];}
TweenLite._tweens.push(data);}
static pause()
{if(TweenLite._timer&&TweenLite._timer.isStart()){TweenLite._timer.stop();TweenLite._timer.removeEventListener(Timer.TIME,TweenLite._enterFrame);}
else if(Stage.current){Stage.current.removeEventListener(StageEvent.ENTER_FRAME,TweenLite._enterFrame);}}
static resume()
{if(TweenLite._timer&&TweenLite._tweens.length>0&&!TweenLite._timer.isStart()){TweenLite._timer.addEventListener(Timer.TIME,TweenLite._enterFrame);TweenLite._timer.start();}
else if(Stage.current){Stage.current.addEventListener(StageEvent.ENTER_FRAME,TweenLite._enterFrame);}}
static remove(target)
{if(target==undefined||TweenLite._tweens.length==0)return;let i,tween;let len=TweenLite._tweens.length;for(i=0;i<len;i++){tween=TweenLite._tweens[i];if(tween.target==target){TweenLite._tweens.splice(i,1);len--;i--;}}
if(TweenLite._tweens.length==0)TweenLite.pause();}
static _enterFrame(e)
{if(TweenLite._tweens.length==0)return;TweenLite._default_params
let i,tween;var len=TweenLite._tweens.length;for(i=0;i<len;i++){tween=TweenLite._tweens[i];TweenLite._setAttribute(tween);}}
static _setAttribute(tween)
{if(tween==undefined)return;let k,twname;var target=tween["target"];if(tween.delay<=1&&tween.min==0&&tween.hasOwnProperty("onStart")&&tween["onStart"]){tween["onStart"].apply(null,tween.hasOwnProperty("onStartParams")?tween["onStartParams"]:null);delete tween["onStartParams"];delete tween["onStart"];}
if(tween.delay>0){tween.delay--;return;}
else tween.min++;for(k in tween.vars){target[k]=(tween.min>=tween.max)?(tween.vars[k]+tween.first[k]):TweenLite._tween(tween.ease,tween.first[k],tween.vars[k],tween.min,tween.max,tween.easeParams);}
if(tween.min>=tween.max){var index=TweenLite._tweens.indexOf(tween);TweenLite._tweens.splice(index,1);if(TweenLite._tweens.length==0)TweenLite.pause();if(tween.hasOwnProperty("onComplete")&&tween["onComplete"]){tween["onComplete"].apply(null,tween.hasOwnProperty("onCompleteParams")?tween["onCompleteParams"]:null);}
return;}
if(tween.hasOwnProperty("onUpdate")&&tween["onUpdate"]){tween["onUpdate"].apply(null,tween.hasOwnProperty("onUpdateParams")?tween["onUpdateParams"]:null);}}}
TweenLite.NONE="none";TweenLite.LINEAR="linear";TweenLite.QUAD="quad";TweenLite.CUBIC="cubic";TweenLite.QUART="quart";TweenLite.QUINT="quint";TweenLite.SINE="sine";TweenLite.CIRC="circ";TweenLite.EXPO="expo";TweenLite.ELASTIC="elastic";TweenLite.BACK="back";TweenLite.BOUNCE="bounce";TweenLite.STRONG="strong";TweenLite.IN="in";TweenLite.OUT="out";TweenLite.IN_OUT="inout";TweenLite.OUT_IN="outin";TweenLite._timer;TweenLite._tweens=[];TweenLite._inited=false;TweenLite._locked=false;TweenLite._transitionList={};class List extends DisplayObjectContainer
{constructor()
{super();this.disable_ft_color="#D5D5D5";this.over_ft_color="#000000";this.line_color="#D6D6D6";this.disable_color="#E0E0E0";this.over_color="#D8D8D8";this.bg_color="#F2F2F2";this.speed=300;this.canPush=false;this.useWheel=true;this.multiSelection=false;this.common_color=this.selectedList=null;this.item_height=this.w=this.h=this.time=0;this._handler=this.control=this._selected=this.container=this.tf_obj=this._datas=null;}
get selected()
{return this.multiSelection?this.selectedList:this._selected;}
set selected(value)
{if(this.multiSelection){if(!this.container||!this.container.numChildren)return;let bool=(!value||!value.length);ArrayUtil.each(this.container._children,function(item){if((bool&&item.bool)||(!bool&&((!item.bool&&value.indexOf(item.data)>=0)||item.bool)))this._click_item(item);},this);return;}
if(this._selected==value)return;if(this._selected)this._selected.enable=true;this._selected=value;if(value)this._selected.enable=false;}
get data()
{return this._datas;}
set data(value)
{this._datas=value;if(!value||!value.length){this.clear();return;}
if(!this.container){let bool=(!this.canPush&&this.h/this.item_height>=value.length);this.container=Factory.c("dc");if(!bool){this.control=new UIContainer();this.control.instance=this.container;this.control.setDimension(this.w,this.h,UIOrientation.isY,true,true);}
this.addChild(this.control?this.control:this.container);if(Global.isPC&&this.useWheel){this.container.mouseEnabled=true;this.container.addEventListener(StageEvent.MOUSE_WHEEL,Global.delegate(this._mouse_wheel,this));}}
ArrayUtil.each(this._datas,function(data){this.addItem(data);},this);}
setup(width,height,item_height,tf_obj,multi)
{this.w=width;this.h=height;this.tf_obj=tf_obj;this.setSize(width,height);this.item_height=item_height;this.multiSelection=(multi==true);if(tf_obj)this.common_color=tf_obj.color;if(this.multiSelection)this.selectedList=[];if(Global.isPC)this.time=0.5;this._handler=Global.delegate(this._click_item,this);}
_mouse_wheel(e)
{let bool=(e.delta>0);if((!bool&&(this.container.y<=(this.h-this.container.height)))||(bool&&(this.container.y>=0)))return;let posY=this.container.y+(bool?this.item_height:-this.item_height);posY=bool?Math.min(0,posY):Math.max(this.h-this.container.height,posY);let time=Math.abs(this.container.y-posY)/this.speed;TweenLite.remove(this.container);TweenLite.to(this.container,time,{y:posY});}
addItem(data)
{if(!data)return;let item=new Button();item.instance=Factory.c("bs",[this.bg_color,this.w-2,this.item_height-2,0,1,this.line_color]);item.setup([Factory.c("ef",[Effect.COLOR,this.bg_color,this.time])],[Factory.c("ef",[Effect.COLOR,this.over_color,this.time])],[Factory.c("ef",[Effect.COLOR,this.disable_color,this.time])]);this.tf_obj.width=this.tf_obj.size*data.label.length;this.tf_obj.height=this.tf_obj.size+1;this.tf_obj.text=data.label;this.tf_obj.y=(this.item_height-this.tf_obj.height)*0.5;this.tf_obj.x=(this.w-this.tf_obj.width)*0.5;item.setLabel(this.tf_obj,this.over_ft_color,this.disable_ft_color);item.data=data.value;item.bool=false;this.container.addChild(item);LayoutUtil.tile(this.container._children,1,false);this.container.height=(this.container.numChildren*this.item_height);item.addEventListener(StageEvent.MOUSE_TAP,this._handler);}
_click_item(e)
{if(!e)return;let btn=(e instanceof Button?e:e.target);if(this.multiSelection){if(btn.bool){let index=this.selectedList.indexOf(btn);if(index>=0)this.selectedList.splice(index,1);btn.setupState([Factory.c("ef",[Effect.COLOR,this.bg_color,this.time])],Button.state.UP);btn.out_color=this.common_color;}else{this.selectedList.push(btn);btn.setupState([Factory.c("ef",[Effect.COLOR,this.over_color,this.time])],Button.state.UP);btn.out_color=btn.over_color;}
btn.state=null;btn.bool=!btn.bool;btn.setState(Button.state.UP);return;}
this.selected=btn;this.dispatchEvent(Factory.c("ev",[List.CHANGE,btn.data,btn.tf.text]));}
size(w,h)
{if(!this.container||!this.container.numChildren)return;ArrayUtil.each(this.container._children,function(item){item.instance.width=w;item.tf.x=(w-this.tf_obj.size*item.tf.text.length)*0.5;},this);if(this.control)this.control.updateSizeInArea(w,h);}
clear()
{if(!this.container)return;this.container.removeFromParent(true);if(this.control)this.control.dispose();this.container=this.control=null;}
dispose()
{this.clear();super.dispose();delete this.speed,this.useWheel,this.disable_ft_color,this.over_ft_color,this.line_color,this.disable_color,this.over_color,this.bg_color,this.canPush,this.item_height,this.w,this.h,this._handler,this.control,this._selected,this.container,this.tf_obj,this._datas;}}
List.CHANGE="list_select_change";class SwitchButton extends DisplayObjectContainer
{constructor()
{super();this.space=2;this.redius=20;this.length=85;this.lock=false;this.bool=false;this.speed=1000;this.drag_rate=5;this.has_shadow=true;this.color="#FFFFFF";this.bg_color="#666666";this.sd_color="#000000";this.md_color="#FFF888";this.is_drag=this.is_open=false;this.hold_rect=this.point=this.point2=this.shadow=this.middle=this.bottom=this.bar=null;}
get value()
{return this.bool;}
set value(value)
{if(this.bool==value)return;this.bool=value;if(!this.bottom)return;this.sync_data(true);this.dispatchEvent(Factory.c("ev",[SwitchButton.CHANGE,this.bool]));}
setup(config)
{if(config)ObjectUtil.copyAttribute(this,config,true);if(!this.bottom){this.bottom=Factory.c("bs",[this.bg_color,this.length+this.space*2,(this.redius+this.space)*2,this.redius+this.space]);this.addChild(this.bottom);this.bottom.mouseEnabled=true;this.bottom.addEventListener(StageEvent.MOUSE_TAP,Global.delegate(this.change_handler,this));}else{this.bottom.setSize(this.length+this.space*2,(this.redius+this.space)*2);this.bottom.redius=this.redius+this.space;this.bottom.color=this.bg_color;}
if(!this.middle){this.middle=this.bottom.clone();this.middle.color=this.md_color;this.middle.mouseEnabled=false;this.addChild(this.middle);}else{this.middle.setSize(this.length+this.space*2,(this.redius+this.space)*2);this.middle.redius=this.redius+this.space;this.middle.color=this.md_color;}
if(!this.bar){this.bar=Factory.c("bs",[this.color,this.redius*2,this.redius*2,this.redius]);this.addChild(this.bar);this.bar.buttonMode=this.bar.mouseEnabled=true;this.bar.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this.mouse_handler,this));}else{this.bar.setSize(this.redius*2,this.redius*2);this.bar.redius=this.redius;this.bar.color=this.color;}
this.bar.y=this.redius+this.space;this.bar.origin={x:this.redius,y:this.redius};if(!this.shadow&&this.has_shadow){this.shadow=new DropShadowFilter(1,30,this.redius*0.3,this.sd_color,1,this.redius);}else{this.shadow=null;}
if(this.shadow&&this.bar.instance.filters&&this.bar.instance.filters.indexOf(this.shadow)<0){this.bar.instance.filters=[this.shadow];}
else if(!this.shadow)this.bar.instance.filters=[];this.sync_data();this.setSize(this.length+this.space*2,(this.redius+this.space)*2);}
change_handler(e)
{if(this.lock)return;this.value=!this.bool;}
mouse_handler(e)
{if(!this.stage||this.lock)return;if(!this.point)this.point=ObjectPool.create(Point);this.point.set(e.mouseX,e.mouseY);this.is_open=(!this.bool);this.is_drag=false;this.lock=true;this.stage.addEventListener(StageEvent.MOUSE_UP,Global.delegate(this.mouse_up,this),this.name);this.stage.addEventListener(StageEvent.MOUSE_MOVE,Global.delegate(this.mouse_move,this),this.name);}
mouse_move(e)
{if(!this.point2)this.point2=ObjectPool.create(Point);let oldX=this.point2.x;this.point2.set(e.mouseX,e.mouseY);if(!this.is_drag&&Point.distance(this.point,this.point2)>this.drag_rate){let posA=this.localToGlobal(this.space+this.redius,this.space+this.redius);let posB=this.localToGlobal(this.length+this.space-this.redius,this.space+this.redius);if(!this.hold_rect)this.hold_rect=new Rectangle();this.hold_rect.data={x:posA.x,y:posA.y,width:Math.abs(posB.x-posA.x)};this.stage.startDrag(this.bar,this.hold_rect);this.middle.visible=true;this.is_drag=true;}
else if(this.is_drag){this.is_open=(this.point2.x>=oldX);this._change_middle();}}
mouse_up(e)
{this.stage.removeEventListener(StageEvent.MOUSE_UP,null,this.name);this.stage.removeEventListener(StageEvent.MOUSE_MOVE,null,this.name);this.lock=false;if(!this.is_drag){this.change_handler();return;}
this.stage.stopDrag();if(this.bool!=this.is_open){this.value=this.is_open;return;}
this.sync_data(true);}
_change_middle()
{this.middle.width=this.redius+this.bar.x+this.space;}
sync_data(use_tween)
{let posX=(this.bool?this.length+this.space-this.redius:this.space+this.redius);if(!use_tween||posX==this.bar.x){this.bar.x=posX;this.middle.visible=this.bool;return;}
this.lock=true;this.middle.visible=true;TweenLite.remove(this.bar);TweenLite.to(this.bar,Math.abs(posX-this.bar.x)/this.speed,{x:posX,onUpdate:Global.delegate2(this._change_middle,this),onCompleteParams:[this],onComplete:function(t){t.lock=false;if(t.bool)t.middle.width=t.bottom.width;else t.middle.visible=false;}});}
reset()
{this.space=2;this.redius=20;this.length=85;this.lock=false;this.bool=false;this.speed=1000;this.drag_rate=5;this.has_shadow=true;this.color="#FFFFFF";this.bg_color="#666666";this.sd_color="#000000";this.md_color="#FFF888";this.is_drag=this.is_open=false;this.hold_rect=this.point=this.point2=this.shadow=this.middle=this.bottom=this.bar=null;super.reset();}
dispose()
{super.dispose();if(point)ObjectPool.remove(point);if(point2)ObjectPool.remove(point2);delete this.drag_rate,this.hold_rect,this.lock,this.point,this.point2,this.space,this.redius,this.length,this.bool,this.speed,this.has_shadow,this.color,this.bg_color,this.sd_color,this.shadow,this.bottom,this.bar;}}
SwitchButton.CHANGE="switch_button_change";class ComboList extends DisplayObjectContainer
{constructor()
{super();this._value=this._current=this._btn=this._datas=this._tf=this._sprite=this._bar=this._container=this._control=this._list=null;this._btn_height=this._timeID=this._list_width=this._list_height=0;this._downspread=this._init=this._enable=this._block=false;this.item_bg_color="#FFFFFF";this.item_over_color="#E6F4AC";this.item_frame_color="#CCCCCC";this.text_font="Microsoft YaHei";this.text_over_color="#666666";this.text_normal_color="#CCCCCC";this.delay_time=1000;this.item_rect=null;this.item_height=23;this.font_size=16;this.bar_width=4;this.spread=0;this.space=1;}
get enable()
{return this._enable;}
set enable(value)
{if(!this._init)return;this._enable=value;this._btn.enable=value;if(!value)this._closeList();}
get value()
{return this._value;}
get current()
{return this._current;}
set current(value)
{if(!this._init||value==undefined||this._datas==undefined||value<0||value>=this._datas.length)return;let bool=(this._current!=value);let old_item=this._datas[this._current];if(old_item)old_item.enable=true;let new_item=this._datas[value];if(new_item){new_item.enable=false;this._value=new_item.datas;this._tf.text=new_item.getLabel();}
this._current=value;if(bool)this.dispatchEvent(Factory.c("ev",[ComboList.SELECT,this._value]));}
select(d)
{if(d==null||!this._init||this._datas==null||this._datas.length<1)return false;for(let btn,i=0,l=this._datas.length;i<l;i++){btn=this._datas[i];if(btn&&btn.datas==d){this.current=(btn.index-1);return true;}}
return false;}
initialize()
{if(this._init)return;this._init=true;this._datas=[];this._list=Factory.c("dc");this._container=Factory.c("dc");this._container.setSize(this._list_width-this.bar_width*2,this._list_height);this._control=new UIContainer();this._control.setDimension(this._list_width-this.bar_width*2,this._list_height,UIOrientation.isY,true,false);this._control.instance=this._container;this._list.addChild(this._control);let bar_mc=Factory.c("bs");let bottom=Factory.c("bs");bar_mc.setup("#999999",this.bar_width*2,this._list_height,this.bar_width);bottom.setup("#E0E0E0",this.bar_width*2,this.bar_width);this._bar=new SlideBar();this._bar.setup(this._container,this._control.mask,bar_mc,bottom,true,true,{x:this._control.x,y:this._control.y});this._list.addChild(this._bar);this._sprite=new Sprite();this._sprite.addChild(this._list);this._sprite.mask=new Rectangle(0,0,this._list_width,this._list_height);this.addChild(this._sprite);this._tf=Factory.c("tf",{text:"",size:this.font_size,color:"#666666",font:this.text_font});this._tf.width=this._tf.lineWidth=this._list_width-this._btn.getWidth();this._tf.height=this._btn_height;let shape=Factory.c("bs",["#FFFFFF",this._tf.width,this._tf.height]);shape.alpha=0;this._btn.addChild(shape);shape.moveTo(-this._tf.width,(this._tf.height-(this.font_size+4))*0.5);this.addChild(this._btn);this.moveTo(this._btn.x,this._btn.y);this._btn.moveTo(this._tf.width,0);this._sprite.moveTo(0,this._tf.height);this._btn._updateSize();this._tf.moveTo(0,(this._tf.height-(this.font_size+4))*0.5);this.addChild(this._tf);this._list.mouseEnabled=true;this._list.addEventListener(StageEvent.MOUSE_OVER,Global.delegate(this._stopCountTime,this),this.name);this._list.addEventListener(StageEvent.MOUSE_OUT,Global.delegate(this._startCountTime,this),this.name);this._btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._onClickHandler,this),this.name);this._btn.addEventListener(StageEvent.MOUSE_OVER,Global.delegate(this._stopCountTime,this),this.name);this._btn.addEventListener(StageEvent.MOUSE_OUT,Global.delegate(this._startCountTime,this),this.name);this._sprite.visible=false;}
_onClickHandler(e)
{if(!this._sprite.visible)this._openList();else this._closeList();}
setup(datas,w,h,btn,current)
{this._btn=btn;this._list_width=w;this._list_height=h;this._btn_height=btn.getHeight();this._current=(current==undefined)?0:current;if(!this._init)this.initialize();if(datas==undefined||datas.length==undefined||datas.length<1)return;for(let i=0,l=datas.length;i<l;i++){this.addItem(datas[i],false);}
this._refresh();this.current=this._current;}
addItem(data,noRefresh)
{if(data==undefined)return;if(this.item_rect==null)this.item_rect=new Rectangle(0,0,this._list_width-this.bar_width*2,this.item_height);let v=(data.hasOwnProperty("value")||data.value)?data.value:data;let l=(data.hasOwnProperty("label")||data.label)?data.label:v;let btn=new Button();let shape=Factory.c("bs");shape.setup(this.item_bg_color,this._list_width-this.bar_width*2,this.item_height,0,1,this.item_frame_color);btn.instance=shape;btn.setup([Factory.c("ef",[Effect.COLOR,this.item_bg_color,0.15])],[Factory.c("ef",[Effect.COLOR,this.item_over_color,0.15])]);btn.setLabel({text:l,font:this.text_font,color:this.text_normal_color,size:this.font_size},this.text_over_color);btn.datas=v;this._container.addChild(btn);btn.index=this._datas.push(btn);btn.setSize(shape.width,shape.height);btn.addEventListener(StageEvent.MOUSE_TAP,Global.delegate(this._onTapHandler,this),this.name);if(noRefresh==undefined)this._refresh();}
_refresh()
{if(this._datas==undefined||this._datas.length<1)return;LayoutUtil.tile(this._datas,1,false,this.item_rect);this._container._updateSize();this._control._recovery_scale();this._bar.barSync();}
_onTapHandler(e)
{let btn=e.target;if(btn==undefined)return;this.current=(btn.index-1);this._closeList();}
_startCountTime(e)
{if(!this._sprite.visible)return;if(this._timeID>0)clearTimeout(this._timeID);this._timeID=setTimeout(Global.delegate(this._closeList,this),this.delay_time)}
_stopCountTime(e)
{clearTimeout(this._timeID);}
_openList()
{if(this._block)return;this._block=true;let pos=this.localToGlobal(0,0);this._downspread=(this.stage&&this.stage.stageHeight)?(pos.y+this._list_height<this.stage.stageHeight):(pos.y-this._list_height<0);this._downspread=(this.spread==1)?true:(this.spread==0?this._downspread:false);let h=Math.min(this._list_height,this._container.height);let d=Math.max(0,this._list_height-this._container.height);this._sprite.visible=true;this._sprite.moveTo(0,this._downspread?this._btn_height+this.space:-this.space-h-d);this._list.y=this._downspread?-this._list.height:h;TweenLite.remove(this._list);TweenLite.to(this._list,0.5,{y:this._downspread?0:d,onComplete:Global.delegate(this._outCompleteHandle,this)});}
_closeList()
{if(this._block)return;this._block=true;this._stopCountTime();TweenLite.remove(this._list);TweenLite.to(this._list,0.4,{y:this._downspread?-this._list_height:this._list_height,onComplete:Global.delegate(this._inCompleteHandle,this)});}
_inCompleteHandle()
{this._block=false;this._sprite.visible=false;this.dispatchEvent(Factory.c("ev",[ComboList.SPREAD,false]));}
_outCompleteHandle()
{this._block=false;this.dispatchEvent(Factory.c("ev",[ComboList.SPREAD,true]));}
dispose()
{this._closeList();this._stopCountTime();if(this._btn){this._btn.removeEventListener(StageEvent.MOUSE_CLICK,null,this.name);this._btn.removeEventListener(StageEvent.MOUSE_OVER,null,this.name);this._btn.removeEventListener(StageEvent.MOUSE_OUT,null,this.name);}
super.dispose();delete this._block,this._value,this._current,this._btn,this._datas,this._tf,this._sprite,this._bar,this._container,this._control,this._list;delete this.text_font,this.item_bg_color,this.item_over_color,this.item_frame_color,this.text_over_color,this.text_normal_color;delete this._btn_height,this._timeID,this._list_width,this._list_height,this._downspread,this._init,this._enable;delete this.spread,this.delay_time,this.item_rect,this.item_height,this.font_size,this.bar_width;}}
ComboList.SELECT="combo_list_select";ComboList.SPREAD="combo_list_spread";class ArrayUtil
{static indexByProperty(array,property,data)
{if(array==null||array.length<1||StringUtil.isEmpty(property))return-1;return array.findIndex(function(value,index,arr){return value[property]==data;});}
static sort(array,property,order,num)
{if(array==null||array.length<2)return;return MathUtil.sort(array,function(a,b){let value1=StringUtil.isEmpty(property)?a:a[property];let value2=StringUtil.isEmpty(property)?b:b[property];let is_number=!isNaN(parseFloat(value1));value1=is_number?parseFloat(value1):StringUtil.trim(value1);value2=is_number?parseFloat(value2):StringUtil.trim(value2);if(is_number)return(order?value2>value1:value1>value2);value1=value1.length>0?value1.toLowerCase():"";value2=value2.length>0?value2.toLowerCase():"";value1=(num&&value1.length>num)?value1.substr(0,num):value1;value2=(num&&value2.length>num)?value2.substr(0,num):value2;return(order?value2>value1:value1>value2);});}
static createUniqueCopy(array)
{return[...new Set(array)];}
static buildNumberArray(length,order)
{if(length==null||isNaN(Number(length)))return null;length=MathUtil.int(length);let r=[],i=(order?length-1:0);while(order?i>0:i<length){r.push(i);i=(order?i-1:i+1);}
return r;}
static mixArray(array)
{if(array==null)return;let i,d,l=array.length,r=MathUtil.randomInt(l);for(i=0;i<l;i++)
{if(r!=i){d=array[r];array[r]=array[i];array[i]=d;}
r=MathUtil.randomInt(l);}
return array;}
static sameItems(arrayA,arrayB,order)
{if(arrayA==null||arrayB==null)return null;if(order==true)return(arrayA.join(",")==arrayB.join(","));if(arrayA.length!=arrayB.length)return false;for(let i in arrayA){if(arrayB.indexOf(arrayA[i])<0)return false;}
return true;}
static copyArray(source=[],array)
{source.push(...array);return source;}
static each(array,func,target)
{if(!array||!array.length)return array;for(let[index,elem]of array.entries()){func.apply(target,[elem,index,array]);}
return array;}
static format(array)
{if(!array||!array.length)return[];let i=0,item,len=array.length;for(i=0;i<len;i++){item=array[i];if(StringUtil.isEmpty(item)){array.splice(i,1);len--;i--;}}
return array;}}
class ImageEditor extends DisplayObjectContainer
{constructor()
{super();this.mouseEnabled=true;this._bottom=this._right=this._left=this._top=this._image=this._frame_alpha=this._img_width=this._img_height=this._target=this._transformer=this._overlay=this._container=null;}
get target()
{return this._target;}
set target(value)
{if(this._container==null)return;this._target=value;if(value){this._container.addChild(this._target);if(this.width>0&&this.height>0)
this._target.moveTo((this.width-this._target.getWidth())*0.5,(this.height-this._target.getHeight())*0.5);this._transformer.target=this._target;}
else this._container.removeAllChildren();}
init(image,imgw,imgh,width,height,alpha)
{if(!Global.supportCanvas){trace("[ERROR]ImageEditor your browser can't support canvas.");return;}
this._image=image;this._img_width=imgw;this._img_height=imgh;this._frame_alpha=alpha;this._container=Factory.c("dc");this.addChild(this._container);this._overlay=Factory.c("dc");this.addChild(this._overlay);this._transformer=new TouchScale();this.addChild(this._transformer);this._bottom=Factory.c("bs");this._right=Factory.c("bs");this._left=Factory.c("bs");this._top=Factory.c("bs");this._overlay.addChild(this._bottom);this._overlay.addChild(this._image);this._overlay.addChild(this._right);this._overlay.addChild(this._left);this._overlay.addChild(this._top);this._bottom.alpha=this._right.alpha=this._left.alpha=this._top.alpha=this._frame_alpha;this.resizeFrame(width,height);}
resizeFrame(w,h)
{let first=(this.width==0&&this.height==0);this._image.moveTo(Math.floor((w-this._image.width)*0.5),Math.floor((h-this._image.height)*0.5));this._bottom.setup("#000000",w,Math.max(0,h-this._image.y-this._image.height));this._bottom.moveTo(0,this._image.y+this._image.height);this._top.setup("#000000",w,Math.ceil(Math.max(0,this._image.y)));this._top.moveTo(0,this._image.y-this._top.height);this._left.setup("#000000",Math.max(0,this._image.x),h<this._image.height?h:Math.max(0,h-Math.max(0,h-this._image.y-this._image.height)-Math.ceil(Math.max(0,this._image.y))));this._left.moveTo(this._image.x-this._left.width,Math.max(0,this._top.y+this._top.height));this._right.setup("#000000",Math.max(0,w-this._image.x-this._image.width),Math.max(0,this._left.height));this._right.moveTo(this._image.x+this._image.width,this._left.y);if(this._target&&!first){this._target.moveTo((w-this._target.getWidth())*0.5,(h-this._target.getHeight())*0.5);this._transformer.sync();}
this.height=h;this.width=w;}
screenshot(type)
{if(this._target==null||this.width==0||this.height==0)return null;let point,obj=CanvasUtil.create();obj.canvas.width=Math.ceil(this.width);obj.canvas.height=Math.ceil(this.height);if(Global.useCanvas){CanvasUtil._renderContainer(obj,this._container,this._container);}else{let mtx=this._target.getMatrix(this._container,true);obj.context.transform(mtx.a,mtx.b,mtx.c,mtx.d,mtx.tx,mtx.ty);obj.context.drawImage(this._target.element,0,0,Math.ceil(this.width),Math.ceil(this.height),0,0,Math.ceil(this.width),Math.ceil(this.height));}
let temp=CanvasUtil.create();temp.canvas.width=this._img_width;temp.canvas.height=this._img_height;point=this._container.globalToLocal(this._image.localToGlobal(0,0));temp.context.drawImage(obj.canvas,point.x,point.y,this._img_width,this._img_height,0,0,this._img_width,this._img_height);return temp.canvas.toDataURL(type||"image/jpeg");}
dispose()
{super.dispose();delete this._bottom,this._right,this._left,this._top,this._image,this._frame_alpha,this._img_width,this._img_height,this._target,this._transformer,this._overlay,this._container;}}
class TouchScale extends DisplayObjectContainer
{constructor()
{super();this.limit_rect=this.limit_scale=this._target_scaleX=this._target_scaleY=this._target_angle=this._target_rotation=this._target_distance=this._center=this._point1=this._point2=this._double_finger=this._canvas=this._target=null;this.wheel=this.rotate=this.mouseEnabled=true;}
get target()
{return this._target;}
set target(value)
{this._target=value;if(this._target&&(this._target instanceof DisplayBase))this._init_transformer();else this._clear_transformer();}
_init_transformer()
{this._clear_transformer();if(this._canvas==undefined)this._canvas=Factory.c("bs");this._canvas.setup("#FFFFFF",this._target.width,this._target.height,0,0,0,0);if(!this.contains(this._canvas))this.addChild(this._canvas);this._canvas.mouseEnabled=true;this._canvas.breakTouch=true;this._canvas.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._drag_mouse_down,this),this.name);this._canvas.matrix=this._target.matrix;if(this.wheel)this._canvas.addEventListener(StageEvent.MOUSE_WHEEL,Global.delegate(this._mouse_wheel_handle,this),this.name);}
_mouse_wheel_handle(e)
{let sca=this._canvas.scaleX+e.delta*0.1;let dot=this._canvas.globalToLocal(e.mouseX,e.mouseY);if(this.limit_scale)sca=MathUtil.clamp(sca,this.limit_scale.min,this.limit_scale.max);this._canvas.scale=sca;dot=this._canvas.localToGlobal(dot);let poi=new Point(MathUtil.format(this._canvas.x+e.mouseX-dot.x),MathUtil.format(this._canvas.y+e.mouseY-dot.y));if(this.limit_rect)poi=Rectangle.innerPoint(this._count_limit_area(),poi);this._canvas.moveTo(poi);DisplayUtil.copyTransform(this._canvas,this._target);}
sync()
{if(this._canvas&&this._target){DisplayUtil.copyTransform(this._target,this._canvas);}}
_drag_mouse_down(e)
{this._double_finger=(e.length==2);if(this._double_finger){this._point1=e.touchs[0];this._point2=e.touchs[1];this._target_scaleX=this._canvas.scaleX;this._target_scaleY=this._canvas.scaleY;this._target_rotation=this._canvas.rotation;this._target_angle=MathUtil.getAngle(this._point1.mouseX,this._point1.mouseY,this._point2.mouseX,this._point2.mouseY);this._center=new Point((this._point1.mouseX+this._point2.mouseX)*0.5,(this._point1.mouseY+this._point2.mouseY)*0.5);this._center=this._canvas.globalToLocal(this._center.x,this._center.y);this._target_distance=Math.sqrt((this._point1.mouseX-this._point2.mouseX)*(this._point1.mouseX-this._point2.mouseX)+(this._point1.mouseY-this._point2.mouseY)*(this._point1.mouseY-this._point2.mouseY));}
else{(this.stage?this.stage:Stage.current).startDrag(this._canvas,this.limit_rect?this._count_limit_area():null);this._point1=this._point2=null;}
(this.stage?this.stage:Stage.current).addEventListener(StageEvent.MOUSE_UP,Global.delegate(this._drag_mouse_up,this),this.name);(this.stage?this.stage:Stage.current).addEventListener(StageEvent.MOUSE_MOVE,Global.delegate(this._drag_mouse_move,this),this.name);}
_drag_mouse_move(e)
{if(!this._double_finger)this._target.moveTo(this._target.parent.globalToLocal(this._canvas.localToGlobal(0,0)));else if(e.length==2){if((this._point1.id!=e.touchs[0].id&&this._point2.id!=e.touchs[1].id)&&(this._point1.id!=e.touchs[1].id&&this._point2.id!=e.touchs[0].id))return;if(this._point1.id!=e.touchs[0].id){this._point1=e.touchs[1];this._point2=e.touchs[0];}else{this._point1=e.touchs[0];this._point2=e.touchs[1];}
if(this.rotate){let rad=MathUtil.getAngle(this._point1.mouseX,this._point1.mouseY,this._point2.mouseX,this._point2.mouseY);this._canvas.rotation=MathUtil.format(this._target_rotation+MathUtil.getDegreesFromRadians(rad-this._target_angle));}
let offX,offY,dis,cen,nce,poi;dis=Math.sqrt((this._point1.mouseX-this._point2.mouseX)*(this._point1.mouseX-this._point2.mouseX)+(this._point1.mouseY-this._point2.mouseY)*(this._point1.mouseY-this._point2.mouseY));offX=offY=dis/this._target_distance;offX=MathUtil.format(this._target_scaleX*offX);offY=MathUtil.format(this._target_scaleY*offY);if(this.limit_scale){offX=MathUtil.clamp(offX,this.limit_scale.min,this.limit_scale.max);offY=MathUtil.clamp(offY,this.limit_scale.min,this.limit_scale.max);}
this._canvas.scaleX=offX;this._canvas.scaleY=offY;cen=this._canvas.localToGlobal(this._center.x,this._center.y);nce=new Point((this._point1.mouseX+this._point2.mouseX)*0.5,(this._point1.mouseY+this._point2.mouseY)*0.5);poi=new Point(MathUtil.format(this._canvas.x+nce.x-cen.x),MathUtil.format(this._canvas.y+nce.y-cen.y));if(this.limit_rect){poi=Rectangle.innerPoint(this._count_limit_area(),poi);}
this._canvas.moveTo(poi);DisplayUtil.copyTransform(this._canvas,this._target);}}
_count_limit_area()
{let ch=this._canvas.getHeight();let cw=this._canvas.getWidth();let r=new Rectangle();let bool_w=(cw>this.limit_rect.width);let bool_h=(cw>this.limit_rect.height);r.x=bool_w?(this.limit_rect.right-cw):this.limit_rect.x;r.y=bool_h?(this.limit_rect.bottom-ch):this.limit_rect.y;r.width=Math.abs(this.limit_rect.width-cw);r.height=Math.abs(this.limit_rect.height-ch);return r;}
_drag_mouse_up(e)
{if(!this._double_finger)(this.stage?this.stage:Stage.current).stopDrag();(this.stage?this.stage:Stage.current).removeEventListener(StageEvent.MOUSE_UP,null,this.name);(this.stage?this.stage:Stage.current).removeEventListener(StageEvent.MOUSE_MOVE,null,this.name);this._target_scaleX=this._target_scaleY=this._target_distance=this._target_rotation=this._target_angle=this._center=this._point1=this._point2=null;}
_clear_transformer()
{if(this._canvas){if(this.contains(this._canvas))this._canvas.removeFromParent(false);this._canvas.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);this._canvas.removeEventListener(StageEvent.MOUSE_WHEEL,null,this.name);}
this._drag_mouse_up(null);}
dispose()
{super.dispose();this.target=null;delete this.limit_rect,this.limit_scale,this.wheel,this._canvas,this._target,this.rotate,this._target_scaleX,this._target_scaleY,this._target_distance,this._target_rotation,this._target_angle,this._center,this._point1,this._point2;}}
class LoadingClip extends DisplayObjectContainer
{constructor(url,cb)
{super();this._loop=this._call_back=this._img=this._instance=null;if(url){if(typeof url=="string")this.setup(url,cb);else this._set_instance(url);}
this.speed=1;}
get stage()
{return this._stage;}
set stage(value)
{if(this._stage==value)return;this._stage=value;if(this._instance&&this._stage)this.play();else this.stop();if(this._children==undefined||this._children.length<1)return;let i,c,l;for(i=0,l=this._children.length;i<l;i++){c=this._children[i];c.stage=value;}}
setup(url,cb)
{if(StringUtil.isEmpty(url))return;this._call_back=cb;this._img=new Image();this._img.style.display="none";this._img.onload=Global.delegate(this._load_handler,this);this._img.onerror=Global.delegate(this._error_handler,this);this._img.src=url;}
_load_handler(e)
{this._img.onload=this._img.onerror=null;this._set_instance(this._img);this._img=null;}
_set_instance(target)
{this._instance=Factory.c("do");this._instance.setInstance(target);target=(target instanceof Source)?target:target;this._instance.origin={x:target.width*0.5,y:target.height*0.5};this._loop=Global.delegate(this.play,this);this.addChild(this._instance);if(this._stage)this.play();if(this._call_back){this._call_back();this._call_back=null;}}
_error_handler(e)
{trace("[ERROR]LoadingClip loading error by",this._img.src);this._img.onload=this._img.onerror=null;this._img=null;}
play()
{if(this._instance==null)return;this._instance.rotation=this._instance.rotation>350?0:this._instance.rotation;TweenLite.to(this._instance,1/this.speed,{rotation:360,onComplete:this._loop});}
stop()
{if(this._instance)TweenLite.remove(this._instance);}
dispose()
{this.stop();super.dispose();delete this._loop,this._call_back,this._img,this._instance,this.speed;}}
class ScrollTouchList extends Sprite
{constructor()
{super();this.space=0;this.offset=1;this.mouseEnabled=true;this._portrait=true;this._is_init=this._is_next=this._has_drag=this._is_full=false;this._bg_color=this._base_size=this._temp_item=this._bg=this._temp_point=this._time=this._start_point=this._complete=this._length=this._hold_rect=this._free_rect=this._current=this._middle=this._list=this._container=this._max_num=this._max_num=this._item_class=this._list_width=this._list_height=this._item_size=this._datas=null;}
get data()
{return this._datas;}
set data(value)
{if(this._datas==value&&this._container)return;this._datas=value;if(this._list_height==null||value==null)return;if(this._container)this.clear();this.init();}
get listWidth()
{return this._list_width;}
set listWidth(value)
{if(value==null||this._list_width==value)return;this._list_width=value;if(this._list==null||this._list.length<1)return;if(this._portrait){if(this._bg)this._bg.width=this._list_width;for(let i in this._list)this._list[i].itemWidth=this._list_width;this.mask=new Rectangle(0,0,this._list_width,this._list_height);return;}
let curr=this._current;this.clear();this.init(curr);}
get listHeight()
{return this._list_height;}
set listHeight(value)
{if(value==null||this._list_height==value)return;this._list_height=value;if(this._list==null||this._list.length<1)return;if(!this._portrait){if(this._bg)this._bg.height=this._list_height;for(let i in this._list)this._list[i].itemHeight=this._list_height;this.mask=new Rectangle(0,0,this._list_width,this._list_height);return;}
let curr=this._current;this.clear();this.init(curr);}
get current()
{return this._current;}
set current(value)
{if(this._current==value)return;if(this._current!=null&&this._temp_item){this._temp_item.selected=false;}
this._current=value;}
setup(width,height,item_size,item_class,portrait=true,color=null,index=0)
{if(item_class==null)return;this._item_class=item_class;this._portrait=!(portrait==false);this._base_size=this._portrait?height:width;this._item_size=item_size;this._list_height=height;this._list_width=width;this._bg_color=color;if(this._datas==null)return;if(this._container)this.clear();this.init(index);}
clear()
{if(this._datas==null||this._list==null)return;let i,l=this._list.length,item;TweenLite.remove(this._container);for(i=0;i<l;i++){item=this._list[i];item.removeEventListener(StageEvent.MOUSE_TAP);item.removeFromParent(false);ObjectPool.remove(item);}
this.mask=null;this.removeAllChildren(true);this._current=this._temp_item=this._hold_rect=this._free_rect=this._container=this._list=null;}
init(index)
{index=(index==null)?0:index;if(!StringUtil.isEmpty(this._bg_color)){if(this._bg&&this.contains(this._bg))this._bg.removeFromParent(true);this._bg=Factory.c("bs",[this._bg_color,this._list_width,this._list_height]);this._bg.mouseEnabled=true;this.addChildAt(this._bg,0);}
this._middle=Math.ceil((this._portrait?this._list_height:this._list_width)*0.5)-Math.floor(this._item_size*0.5);this._max_num=Math.ceil((this._portrait?this._list_height:this._list_width)/(this._item_size+this.space))+2;this._length=(this._item_size+this.space)*this._datas.length-this.space;this._is_full=(this._datas.length>this._max_num);this._container=new DisplayObjectContainer();this.addChild(this._container);this._list=[];this._container.mouseEnabled=true;this._container.moveTo(this._portrait?0:this._middle,this._portrait?this._middle:0);this.mask=new Rectangle(0,0,this._list_width,this._list_height);this._free_rect=new Rectangle(0,0,this._portrait?0:this._length,this._portrait?this._length:0);this._hold_rect=new Rectangle(0,0,this._portrait?0:this._free_rect.width+this._list_width,this._portrait?this._free_rect.height+this._list_height:0);this._create_list();if(this._list.length>0){this._temp_item=this._list[0];this._list[0].selected=true;this.current=0;if(index>0)this.goto(index,true);else{this._update_items_state();this.dispatchEvent(Factory.c("ev",[ScrollTouchList.SELECT,this._datas[0]]));}}
if(this._is_init)return;this._is_init=true;this._complete=Global.delegate(this.onTweenComplete,this);this.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this.onMouseDown,this));this.addEventListener(StageEvent.MOUSE_WHEEL,Global.delegate(this.onMouseWheel,this));}
onMouseDown(e)
{this._has_drag=false;TweenLite.remove(this._container);this._start_point=new Point(e.mouseX,e.mouseY);this.stage.addEventListener(StageEvent.MOUSE_MOVE,Global.delegate(this.onMouseMove,this),this.name);this.stage.addEventListener(StageEvent.MOUSE_UP,Global.delegate(this.onMouseUp,this),this.name);}
onMouseMove(e)
{let point=new Point(e.mouseX,e.mouseY);if(!this._has_drag&&Point.distance(this._start_point,point)>5){let pos=this.localToGlobal(this._portrait?0:this._middle,this._portrait?this._middle:0);this._free_rect.x=this._portrait?pos.x:pos.x-this._length;this._free_rect.y=this._portrait?pos.y-this._length:pos.y;this._hold_rect.x=this._portrait?this._free_rect.x:Math.ceil(this._free_rect.x-this._list_width*0.5);this._hold_rect.y=this._portrait?Math.ceil(this._free_rect.y-this._list_height*0.5):this._free_rect.y;this._has_drag=true;this._is_next=(this._portrait?(pos.y<this._start_point.y):(pos.x<this._start_point.x));this.stage.startDrag(this._container,this._hold_rect,false,this._free_rect);this._time=new Date().getTime();this._start_point=point;}
if(!this._has_drag)return;let label=(this._portrait?"y":"x");if((this._is_next&&(point[label]<=(this._temp_point?this._temp_point:this._start_point)[label]))||(!this._is_next&&(point[label]>=(this._temp_point?this._temp_point:this._start_point)[label]))){this._temp_point=point;}else{this._start_point=this._temp_point=point;this._time=new Date().getTime();this._is_next=!this._is_next;}
this._update_list();}
onMouseUp(e)
{this.stage.removeEventListener(StageEvent.MOUSE_MOVE,null,this.name);this.stage.removeEventListener(StageEvent.MOUSE_UP,null,this.name);this._has_drag=false;this.stage.stopDrag();if(e==null){this._start_point=this._temp_point=this._time=null;return;}
let delay=new Date().getTime()-this._time;if(delay==0||this._temp_point==null){this._move_current_item();}else{this._move_list_by_speed(this._portrait?(Math.abs(this._start_point.y-this._temp_point.y)/delay):(Math.abs(this._start_point.x-this._temp_point.x)/delay));}
this._start_point=this._temp_point=this._time=null;let bool=this._portrait?(this._container.y>this._middle||this._container.y<this._middle-this._length+this._item_size):(this._container.x>this._middle||this._container.x<this._middle-this._length+this._item_size);if(!bool)return;let posX=this._portrait?0:(this._container.x>this._middle?this._middle:(this._container.x<this._middle-this._length+this._item_size?this._middle-this._length+this._item_size:this._container.x));let posY=this._portrait?(this._container.y>this._middle?this._middle:(this._container.y<this._middle-this._length+this._item_size?this._middle-this._length+this._item_size:this._container.y)):0;TweenLite.to(this._container,0.16,{ease:"easeoutquad",x:posX,y:posY,onComplete:this._complete});}
_move_list_by_speed(speed)
{if(speed==null)return;if(speed==0||speed<0.1){this._move_current_item();return;}
let offset=0.3;let num=MathUtil.format(speed*(this._item_size+this.space)*this.offset);let time=Math.max(0.1,MathUtil.format((num*this.offset*offset)/this._item_size));this.moveList(num,time);}
moveList(num,time)
{if(num==null||num==0)return;let label=(this._portrait?"y":"x");let pos=Math.ceil((this._container[label]+(this._is_next?-1:1)*num)/(this._item_size+this.space));pos=pos*(this._item_size+this.space)-(pos>1?this.space+this._item_size*0.5:this._item_size*0.5);pos=(pos>this._middle)?this._middle:(pos<this._middle-this._length+this._item_size?this._middle-this._length+this._item_size:pos);if(time==0){this._container[label]=pos;this.reset_list();return;}
let obj={};obj[label]=pos;obj.onComplete=this._complete;obj.onUpdate=Global.delegate(this._update_list,this);TweenLite.to(this._container,time,obj);}
onTweenComplete()
{this._update_items_state();this._move_current_item();}
onMouseWheel(e)
{this._is_next=(e.delta<0);TweenLite.remove(this._container);this._move_list_by_speed(Math.abs(e.delta));}
onMouseTap(e)
{let item=e.target;if(item==null)return;this.goto(item.index);}
goto(index,skip)
{if(index<0||index>=this._datas.length||this._current==index)return;TweenLite.remove(this._container);let label=(this._portrait?"y":"x");let temp=((index+1)*(this._item_size+this.space))-(index>0?this.space:0);temp=temp+this._container[label]-this._middle-this._item_size;this._is_next=(temp>0);let offset=0.1;let num=Math.abs(temp);let time=skip?0:Math.max(0.1,MathUtil.format((num*this.offset*offset)/this._item_size));this.moveList(num,time);}
reset_list()
{if(this._list==null||this._list.length<1)return;let i,j,l=this._list.length,item;let label=(this._portrait?"y":"x");let offset=this._container[label];let index=Math.abs(Math.ceil((this._middle-offset+this._item_size*0.5)/(this._item_size+this.space)));index=index>0?index-1:0;let half=Math.ceil(this._max_num*0.5)-(this._max_num%2==0?0:1);let start=(index-half);start=(index+half>(this._datas.length-1))?this._datas.length-this._list.length:start;start=start<0?0:start;for(i=0;i<l;i++){item=this._list[i];item.index=start;item.selected=false;item.data=this._datas[start];item[label]=start*(this._item_size+this.space);if(start==index)j=i;start++;}
this._update_items_state(j);this._move_current_item();}
_create_list()
{if(this._datas==null||this._datas.length<1)return;let i,data,item,len=Math.min(this._datas.length,this._max_num);for(i=0;i<len;i++){data=this._datas[i];item=ObjectPool.create(this._item_class);this._list.push(item);this._container.addChild(item);item.set(data,this._portrait?this._list_width:this._item_size,this._portrait?this._item_size:this._list_height);item.index=i;item.addEventListener(StageEvent.MOUSE_TAP,Global.delegate(this.onMouseTap,this));}
LayoutUtil.tile(this._list,1,!this._portrait,new Rectangle(0,0,this._portrait?this._list_width:this._item_size,this._portrait?this._item_size:this._list_height),new Point(this._portrait?0:this.space,this._portrait?this.space:0));}
_update_list()
{this._update_items_state();if(!this._is_full)return;let end=(this._is_next?this._list[this._list.length-1]:this._list[0]);let index=end.index;if((this._is_next&&index>=(this._datas.length-1))||(!this._is_next&&index<=0))return;let item=(this._is_next?this._list[0]:this._list[this._list.length-1]);let point={x:(item.x+this._container.x),y:(item.y+this._container.y)}
let label=(this._portrait?"y":"x");if(this._is_next){if(point[label]>-this._item_size)return;this._list.shift();item.index=index+1;item.data=this._datas[item.index];item.selected=(item.index==this._current);this._list.push(item);item[label]=end[label]+(this._item_size+this.space);}else{if(point[label]<(this._portrait?this._list_height:this._list_width)+this._item_size)return;this._list.pop();item.index=index-1;item.data=this._datas[item.index];item.selected=(item.index==this._current);if(item.selected)this._temp_item=item;this._list.unshift(item);item[label]=end[label]-(this._item_size+this.space);}}
_update_items_state(index)
{if(this._list==null||this._list.length<1)return;let target=(index==null)?this._middle:(this._list[index][label]+this._container[label]);let i,j=0,l=this._list.length,item,min,dy;let label=(this._portrait?"y":"x");for(i=0;i<l;i++){item=this._list[i];dy=Math.abs(item[label]+this._container[label]-target);if(i==0)min=dy;else if(dy<min){min=dy;j=i;}
item.update(MathUtil.format((this._middle-dy)/this._middle));}
j=(index==null)?j:index;this.current=this._list[j].index;this._temp_item=this._list[j];this._list[j].selected=true;}
_move_current_item()
{let label=(this._portrait?"y":"x");let offest=(this._temp_item[label]+this._container[label]-this._middle);this._container[label]-=offest;this.dispatchEvent(Factory.c("ev",[ScrollTouchList.SELECT,this._datas[this._current]]));}
dispose()
{this.clear();super.dispose();delete this._bg_color,this.space,this.offset,this.mouseEnabled,this._portrait,this._is_init,this._is_next,this._has_drag,this._is_full,this._temp_item,this._bg,this._temp_point,this._time,this._start_point,this._complete,this._length,this._hold_rect,this._free_rect,this._current,this._middle,this._list,this._container,this._max_num,this._max_num,this._item_class,this._list_width,this._list_height,this._item_size,this._datas;}}
ScrollTouchList.SELECT="stl_select_item";