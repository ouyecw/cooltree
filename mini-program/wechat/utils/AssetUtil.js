import PlistUtil from './PlistUtil.js'
import Source from '../core/Source.js'
import Loader from '../loader/Loader.js'
import ObjectPool from './ObjectPool.js'
import StringUtil from './StringUtil.js'
import BitmapFont from '../text/BitmapFont.js'
import Parser from '../libs/dom-parser.js'
import AssetManager from '../core/AssetManager.js'

/**
 * @class
 * @module AssetUtil
 */
export default class AssetUtil
{
	/**
	 * 解析
	 * @param {*} image 
	 * @param {*} data 
	 * @param {Number} type 1:XML,2:PLIST,3:JSON
	 * @returns 
	 */
	static parseSheet(image,data,type)
	{
		return type==1 ? AssetUtil._xml2sheet(image,data) : (type==2 ? AssetUtil._plist2sheet(image,data) :AssetUtil._json2sheet(image,data));
	}
	
	static _xml2sheet(image,xml)
	{
		if(image==null || xml==null) return;
		xml=(typeof xml =="string") ? AssetUtil.parseXML(xml,"text/xml") : xml;
		let array=[];
		
		let xmlDoc=xml.documentElement.childNodes;
		let source;
		let datas;
		let temp;
		let item;
		let len;
		
		let i;
		let j;
		
		for(i=0 ,len=xmlDoc.length; i<len;i++){
			
			datas=xmlDoc[i].attributes;
			if(datas==undefined || datas.length<=0) continue;
			
			temp={};
			for(j=0;j<datas.length;j++){
			 	item=datas[j];
			 	temp[item.nodeName]=item.value;
			}
			
			source=ObjectPool.create(Source);
			source.setup(image,temp,false,i);
			array.push(source);
		}
		
		return array;
	}

	static _plist2sheet(image,data)
	{
		if(image==null || data==null) return;
		const doc=(typeof data =="string" ? AssetUtil.parseXML(data,"text/xml") : data).documentElement;
		data=PlistUtil.parsePlistXML(doc);

		if(!data || data.length<1) return;
		let name,item,key,source,sub,array=[],i=0;

		for(name in data){
			item=data[name];
			if(!item || !item.hasOwnProperty("frames") || !item.frames) continue;

			for(key in item.frames){
				sub=item.frames[key];
				source=ObjectPool.create(Source);
				source.setPlist(image,sub,key,i++);
				array.push(source);
			}
		}

		return array
	}

	static _json2sheet(image,json)
	{
		if(image==null || json==null || !json.hasOwnProperty("frames") || !json.frames) return;
		let i,str,temp,source,datas,old,array=[],j=0;
		
		for(str in json){
			if(str=="meta") continue;
			datas=json[str];
			
			for(i in datas){
				temp=datas[i];
				if(!temp || typeof temp!="object") continue;
				temp.name=i;
				
				source=ObjectPool.create(Source);
				source.setup(image,temp,true,j++);
	
				if(source.width==0 && source.height==0 && !StringUtil.isEmpty(source.label) && old && source.label==old.label){
					
					source.height=source.rect.height;
					source.width=source.rect.width;
					
					if(old.width==0 && old.height==0){
						old.height=old.rect.height;
						old.width=old.rect.width;
					}
				}
				
				array.push(source);
				old=source;
			}
		}
		
		return array;
	}
	
	static parseFont(fnt,dic)
	{
		if(fnt==null) return null;
		
		const font=new BitmapFont();
		const xmlDoc=(typeof fnt=="string") ? AssetUtil.parseXML(fnt,"text/xml") : fnt.childNodes[0];
		const info=xmlDoc.getElementsByTagName("info")[0];
		const common=xmlDoc.getElementsByTagName("common")[0];
		const pnode=xmlDoc.getElementsByTagName("pages");
		
		if(pnode.length<=0) {
			if(xmlDoc.body) console.log("[ERROR] AssetUtil.parseFont() "+xmlDoc.body.innerText);
			return null;
		}
		
		const pages=pnode[0].childNodes;
		const chars =xmlDoc.getElementsByTagName("chars")[0].childNodes;
		
		AssetUtil.copyAttributes(font.info,info);
		AssetUtil.copyAttributes(font.common,common);
		
		let source,data,i,str,index,obj,img,len=pages.length;
		font.info.size=Math.abs(font.info.size);
		font.name=font.info.face;
		
		font.chars={};
		font.pages=[];
		font.images=[];
		
		for(i=0 ; i<len;i++){
			data=pages[i];
			if(data.nodeName!="page") continue;
			
			index=Number(data.getAttribute("id"));
			str=data.getAttribute("file");
			if(StringUtil.isEmpty(str)) continue;
			font.pages[index]=str;
			
			str=Loader.getName(str);
			
			if(!StringUtil.isEmpty(str)){
				font.images[index]=dic[str];
				delete dic[str];

				if(AssetManager._cache && AssetManager._cache.hasOwnProperty(str))
					delete AssetManager._cache[str];
			}else{
				console.log("[ERROR] AssetUtil.parseFont can't find asset of "+str);
			}
		}
		
		for(i=0,len=chars.length; i<len;i++){
			data=chars[i];
			if(data.nodeName!="char") continue;
			
			obj=AssetUtil.copyAttributes({},data);
			obj.name=font.name+"|"+obj.xadvance+" "+obj.id;
			obj.frameX=-obj.xoffset;
			obj.frameY=-obj.yoffset;
			
			img=font.images[obj.page];
			if(img==undefined) continue;
			
			source=ObjectPool.create(Source);
			source.setup(img,obj);
			source.label=Number(source.label);
			font.chars[source.index]=source;
		}
		
		return font;
	}

	static parseXML(data,type) 
	{
		const XML_parser=new Parser.DOMParser();
		return XML_parser.parseFromString(data,type);
	}
	
	static copyAttributes(obj,node)
	{
		let i,l,d,t,datas=node.attributes;
		
		for(i=0 ,l=datas.length; i<l;i++){
			d=datas[i];
			t=d.value;
			obj[d.name]=isNaN(t) ? t : Number(t);
		}
		
		return obj;
	}
	
	static asset2diplay(array)
	{
		let i,l,a,d,list=[];
		for(i=0,l=array.length; i<l;i++){
			a=array[i];
			d=Factory.c("do");
			d.setInstance(a);
			list.push(d);
		}
		return list;
	}
}

module.exports = AssetUtil;