AssetUtil={}

AssetUtil.parseSheet=function(image,data,isXML)
{
	return isXML ? AssetUtil._xml2sheet(image,data) : AssetUtil._json2sheet(image,data.content);
}

AssetUtil._xml2sheet=function(image,xml)
{
	if(image==null || xml==null) return;
	
	var array=[];
	
	var xmlDoc=xml.documentElement.childNodes;
	var source;
	var datas;
	var temp;
	var item;
	var len;
	
	var i;
	var j;
	
	for(i=0 ,len=xmlDoc.length; i<len;i++){
		
		datas=xmlDoc[i].attributes;
		if(datas==undefined || datas.length<=0) continue;
		
		temp={};
		for(j=0;j<datas.length;j++){
		 	item=datas[j];
		 	temp[item.nodeName]=item.value;
		}
		
		source=ObjectPool.create(Source);
		source.setup(image,temp);
		array.push(source);
	}
	
	return array;
}

AssetUtil._json2sheet=function(image,json)
{
	if(image==null || json==null) return;
	var i,str,temp,source,datas,old,array=[];
	
	for(str in json){
		if(str=="meta") continue;
		datas=json[str];
		
		for(i in datas){
			temp=datas[i];
			temp.name=i;
			
			source=ObjectPool.create(Source);
			source.setup(image,temp,true);

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

AssetUtil.parseFont=function(fnt)
{
	if(fnt==null) return null;
	
	var font=new BitmapFont();
	var xmlDoc=URLLoader.parseXML(fnt,"text/xml");
	var info=xmlDoc.getElementsByTagName("info")[0];
	var common=xmlDoc.getElementsByTagName("common")[0];
	var pnode=xmlDoc.getElementsByTagName("pages");
	
	if(pnode.length<=0) {
		if(xmlDoc.body) trace("[ERROR] AssetUtil.parseFont() "+xmlDoc.body.innerText);
		return null;
	}
	
	var pages=pnode[0].childNodes;
	var chars =xmlDoc.getElementsByTagName("chars")[0].childNodes;
	
	AssetUtil.copyAttributes(font.info,info);
	AssetUtil.copyAttributes(font.common,common);
	
	var source,data,i,str,index,obj,img,len=pages.length;
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
		
		if(!StringUtil.isEmpty(str) && AssetManager._cache.hasOwnProperty(str)){
			font.images[index]=AssetManager._cache[str];
			delete AssetManager._cache[str];
		}else{
			trace("[ERROR] AssetUtil.parseFont can't find asset of "+str);
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

AssetUtil.copyAttributes=function(obj,node)
{
	var i,l,d,t,datas=node.attributes;
	
	for(i=0 ,l=datas.length; i<l;i++){
		d=datas[i];
		t=d.value;
		obj[d.name]=isNaN(t) ? t : Number(t);
	}
	
	return obj;
}

AssetUtil.asset2diplay=function(array)
{
	var i,l,a,d,list=[];
	for(i=0,l=array.length; i<l;i++){
		a=array[i];
		d=Factory.c("do");
		d.setInstance(a);
		list.push(d);
	}
	return list;
}
