import TextField from './TextField.js'
import StringUtil from '../utils/StringUtil.js'
import ObjectUtil from '../utils/ObjectUtil.js'

export default class RichText extends TextField
{
	constructor(ops)
	{
		super();

		if(ops && typeof ops=="object") {
			ObjectUtil.copyAttribute(this,ops,true);
			if(!StringUtil.isEmpty(this._text)) this._update();
		}
	}

	getText()
	{
		return this._text ? this._text.split(/<[^>]+>/).join("") : "";
	}
	
	//竖排
	_vertical_text()
	{
		if(StringUtil.isEmpty(this._text)) return;
		if(this._text.indexOf(RichText.sign)<0) {
			super._vertical_text();
			return;
		}
		
		
		if(this._fontMetrics == null) 
			this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
		
		if(this._text.indexOf("<br>")>=0){
			this._text=StringUtil.replaceAll(this._text,["<br>"],["\n"]);
		}
		
		const styles=[];
		const array=this._text.split(/(<[^>]+>)/).filter(Boolean);
		const align_left=(this._textAlign=="start" || this._textAlign=="left");
		
		let str,current,data,style;
		for(str of array){
			if(StringUtil.isEmpty(str)) continue;
			
			if(str==RichText.sign){
				current=null;
				continue;
			}
			
			if(/^<.*>$/.test(String(str).trim())){
				style=RichText.parse_label(String(str).trim());
				if(current){
					styles.push(current);
					current=null;
				}
				styles.push(style);
				continue;
			}
			
			if(!current && styles.length>0)
				current=styles.pop();
			
			data=this._vertical_render(str,data ? data.pos : null,current,data ? data.lines: null);
		}
		
		if(!data) return;
		this.context.reset();
		if(!this.context.strict) this.context.strict=true;

		const lines=data.lines;
		let word,i,j,l,dy,vy,line,wlen,max=0,sy,
		mx=Math.abs(lines[lines.length-1].d[0].x)+this._leading+this.size*0.5,
		oy=(this._fontMetrics.height+this._leading)*0.5;
		
		for (i=0,l=lines.length;i<l;i++){
			line=lines[i];
			sy=oy+(this._textAlign=="center" ? (my-line.r.h)*0.5 : (align_left ? this._fontMetrics.height*0.5 : my-line.r.h));
			dy=line.d[0].y;
			vy=line.b;
			
			for(j = 0, wlen = line.d.length; j < wlen; j++)
			{
				word=line.d[j];
				max=Math.max(mx+word.x,max);
				this._drawText(word.w, vy>0 ? word.y-dy+vy+sy : word.y-dy+sy,mx+word.x,word.n,word.s);
			}
		}
		
		max+=this.size;
		this.scrollValue = max;
		
		if(this.autoSize) {
			if(this._lineWidth)
				this.height = Math.min(this._lineWidth,this.getTextWidth(this.getText()));
				
			this.width=max;
		}
	}
	
	_vertical_render(str,pos=null,style=null,list=null)
	{
		const texts=str.split(/\r\n|\r|\n/);
		this._fontMetrics.height=(style && style.hasOwnProperty("size") && !isNaN(Number(style.size))) ? Number(style.size) : this.size;
		
		let isNormal,word,i,j,line,l=texts.length, width,
		oy=this._fontMetrics.height * this._lineHeight*0.5,dy =pos ? pos.y : oy,
		my=(this.autoSize && this._lineWidth ? this._lineWidth : this.height), 
		sy=this._fontMetrics.height*0.5, wordHeight = this._fontMetrics.height;
		
		let mw=0,mx=pos ? pos.x : (this.autoSize ? 0 : this.width-this.size*0.5);
		let wlen,lines=list || [],bool=(pos && pos.y>0 && list && list.length>0);
		
		for (i=0;i<l;i++){
			line=texts[i];
			width=0;
			
			if(i>0){
				dy=oy;
				mx-=mw*this._lineHeight;
			}
			
			if(!this.autoSize && mx<=this._leading) break;
			
			let cache=[];
			if(this.wordBreak)
			{
				for(j = 0, wlen = line.length; j < wlen; j++)
				{
					word = line.charAt(j);
					if(!word || word.length == 0) continue;
					isNormal=!word.match(/[\u4e00-\u9fa5]/);//line.charCodeAt(j)<257;
					width=Math.ceil(this.getTextWidth(word));
					mw=Math.max(mw,width);
					
					if(sy+dy>=my-this._leading){
						if(cache && cache.length) {
							lines.push({d:cache,r:{x:mx-mw,y:cache[0].y,w:mw,h:(cache[cache.length-1].y-cache[0].y+wordHeight+this._leading)},b:(bool ? pos.y : 0)});
							bool=false;
							cache=[];
						}
						
						dy=oy;
						mx-=this._fontMetrics.height*this._lineHeight;
						if(!this.autoSize && mx<=this._leading) break;
					}
					
					cache.push({w:word,x:mx-width,y:sy*(isNormal ? 2 :1)+dy,n:isNormal,s:style});
					dy=dy+(isNormal ? width : wordHeight)+this._leading;
				}
			}else{
				const words = line.split(/([^\x00-\xff]|\b)/);
				for(let j = 0, wlen = words.length; j < wlen; j++)
				{
					const word = words[j];
					if(!word || word.length == 0) continue;

					if(sy+dy>=my-this._leading){
						if(cache && cache.length) {
							lines.push({d:cache,r:{x:mx-mw,y:cache[0].y,w:mw,h:(cache[cache.length-1].y-cache[0].y+wordHeight+this._leading)},b:(bool ? pos.y : 0)});
							bool=false;
							cache=[];
						}
						
						dy=oy;
						mx-=this._fontMetrics.height*this._lineHeight;
						if(!this.autoSize && mx<=this._leading) break;
					}

					for(let k=0,len=word.length;k<len;k++){
						const letter=word[k];
						if(!letter || letter.length == 0) continue;
						isNormal=!letter.match(/[\u4e00-\u9fa5]/);//line.charCodeAt(j)<257;
						width=Math.ceil(this.getTextWidth(letter));
						mw=Math.max(mw,width);

						cache.push({w:letter,x:mx-width,y:sy*(isNormal ? 2 :1)+dy,n:isNormal,s:style});
						dy=dy+(isNormal ? width : wordHeight)+this._leading;
					}
				}
			}
			
			if(cache && cache.length) {
				lines.push({d:cache,r:{x:mx-mw,y:cache[0].y,w:mw,h:(cache[cache.length-1].y-cache[0].y+wordHeight+this._leading)},b:(bool ? pos.y : 0)});
				bool=false;
				cache=[];
			}
		}
		return {"pos":{x:mx,y:dy-oy},lines};
	}
	
	//横排
	_horizontal_text()
	{
		if(StringUtil.isEmpty(this._text)) return;
		if(this._text.indexOf(RichText.sign)<0) {
			super._horizontal_text();
			return;
		}
		
		this.context.reset();
		if(!this.context.strict) this.context.strict=true;
		if(this._fontMetrics == null) this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
		
		if(this._text.indexOf("<br>")>=0){
			this._text=StringUtil.replaceAll(this._text,["<br>"],["\n"]);
		}
		
		const styles=[];
		const array=this._text.split(/(<[^>]+>)/).filter(Boolean);

		if(this.autoSize) {
			this.width = Math.ceil(this.getTextWidth(this.getText()));
			this._lineWidth = this._lineWidth || this.width;
		}
		
		const maxWidth=(this.autoSize && this._lineWidth ? this._lineWidth : this.width);
		const align_left=(this._textAlign=="start" || this._textAlign=="left");
		
		let str,current,pos,style,max_width=0;
		for(str of array){
			if(StringUtil.isEmpty(str)) continue;
			
			if(str==RichText.sign){
				current=null;
				continue;
			}
			
			if(/^<.*>$/.test(String(str).trim())){
				style=RichText.parse_label(String(str).trim());
				if(current){
					styles.push(current);
					current=null;
				}
				styles.push(style);
				continue;
			}
			
			if(!current && styles.length>0)
				current=styles.pop();
			
			pos=this._horizontal_render(str,maxWidth,align_left,pos,current);
			max_width=Math.max(max_width,pos.max);
		}
		
		this.scrollValue = pos.y;
		if(this.autoSize) {
			if(max_width>0 && align_left) this.width = max_width;
			this.height = pos.y;
		}
	}

	_horizontal_render(str,maxWidth,align_left,pos=null,style=null)
	{
		const texts=str.split(/\r\n|\r|\n/);
		this._fontMetrics.height=(style && style.hasOwnProperty("size") && !isNaN(Number(style.size))) ? Number(style.size) : this.size;
		
		const lineHeight = this._fontMetrics.height * this._lineHeight;
		let i,line,max_width=0,l=texts.length,cx=pos ? pos.x : 0,dy=pos ? pos.y : this._fontMetrics.height * this._lineHeight*0.5;
		
		for (i=0;i<l;i++){
			line=texts[i];
			if(i>0) cx=0;
			
			if(!this.autoSize && dy>=this.height-this._leading) break;
			let cache=align_left ? null : [];
			
			if(this.wordBreak)
			{
				for(let j = 0, len = line.length; j < len; j++)
				{
					const letter=line.charAt(j);
					const letterWidth=this.getTextWidth(letter)+this._leading;
					
					if(cx>0 && maxWidth>0 && maxWidth<=cx+letterWidth){
						if(!align_left && cache.length){
							const offsetX=Math.floor((maxWidth-cx-this._leading)*(this._textAlign=="center" ? 0.5 : 1));
							cache.forEach(item=>this._drawText(item.l, item.y,item.x+offsetX),false,style);
							cache=[];
						}
						
						dy += lineHeight;
						cx=0;
						
						if(!this.autoSize && dy>=this.height-this._leading) break;
					}
					
					if(align_left) this._drawText(letter, dy,cx,false,style);
					else cache.push({l:letter,x:cx,y:dy});
					cx+=letterWidth;
					max_width=Math.max(max_width,cx);
				}
			}
			else
			{
				const words = line.split(/([^\x00-\xff]|\b)/);
				for(let j = 0, wlen = words.length; j < wlen; j++)
				{
					const word = words[j];
					if(!word || word.length == 0) continue;
					
					const wordWidth=this.getTextWidth(word)+word.length*this._leading;
					if(cx>0 && maxWidth>0 && maxWidth<=cx+wordWidth){
						if(!align_left && cache.length){
							const offsetX=Math.floor((maxWidth-cx-this._leading)*(this._textAlign=="center" ? 0.5 : 1));
							cache.forEach(function(item){
								this._drawText(item.l, item.y,item.x+offsetX,false,style)
							}.bind(this));
							cache=[];
						}
						
						dy += lineHeight;
						cx=0;
					}
					
					if(!this.autoSize && dy>=this.height-this._leading) break;
					for(let k=0,len=word.length;k<len;k++){
						const letter=word[k];
						if(align_left) this._drawText(letter, dy,cx,false,style);
						else cache.push({l:letter,x:cx,y:dy});
						cx+=this.getTextWidth(letter)+this._leading;
					}
					max_width=Math.max(max_width,cx);
				}
			}
			
			if(!align_left && cache.length){
				const offsetX=Math.floor((maxWidth-cx-this._leading)*(this._textAlign=="center" ? 0.5 : 1));
				cache.forEach(function(item){
					this._drawText(item.l, item.y,item.x+offsetX,false,style);
				}.bind(this));
			}
			
			dy += lineHeight;
		}
		
		return {x:cx,y:dy-lineHeight,max:max_width};
	}
	
	_drawText(str,posY=0,posX=0,vertical=false,style=null)
	{
		if(!style){
			this.context.font = (this._italic ? "italic " : "")+(this._bold ? "bold " : "")+(ObjectUtil.getType(this._size)=="number" ? this._size+"px " : this._size+" ")+this._font;
			this._draw(str,posY,posX,vertical);
			return;
		}
		
		const record={};
		let label,value,type,glass;
		
		for(label in style){
			if(!RichText.sign_labels.hasOwnProperty(label)) continue;
			glass=RichText.sign_labels[label];
			
			value=style[label];
			type=(typeof value);
		
			if(type!=glass){
				if(glass=="boolean"){
					value=(type=="string") ? (value=="true") : (type=="number" ? (value!=0) : (value!=null));
				}
				else if(glass=="number"){
					value=Number(value);
					if(isNaN(value)) continue;
				}
			}
			record[label]=this[label];
			this[label]=value;
		}
		
		if(JSON.stringify(record)=="{}"){
			this._draw(str,posY,posX,vertical);
			return;
		}
		
		this.context.font = (this._italic ? "italic " : "")+(this._bold ? "bold " : "")+(ObjectUtil.getType(this._size)=="number" ? this._size+"px " : this._size+" ")+this._font;
		this._draw(str,posY,posX,vertical);
		
		for(label in record){
			this[label]=record[label];
		}
		this.has_update=false;
	}
	
	static parse_label(str)
	{
		const content = str.replace(/^<|>$/g, '');
		const regex = /(\w+)\s*=\s*(['"]?)(.+?)\2(?=\s|$)/g;
		const result = {};
		let match;

		while ((match = regex.exec(content)) !== null) {
		    const key = match[1];
		    let value = match[3];
		    
		    if (value === 'true') {
		      value = true;
		    } else if (value === 'false') {
		      value = false;
		    } else if (!isNaN(value)) {
		      value = Number(value);
		    }
		    
		    result[key] = value;
		}
		  
		return result;
	}
}

RichText.className="RichText";
RichText.sign_labels={"fillType":"string","font":"string","strokeColor":"string","color":"string","bold":"boolean","italic":"boolean","size":"number"};
RichText.sign="</>";
