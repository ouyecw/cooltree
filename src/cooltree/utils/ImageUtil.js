/**
 * @class
 * @module ImageUtil
 */
export default class ImageUtil
{
	/**
	 * 快速加载图片
	 * @param {String} url
	 * @param {Object} config 
	 *      {cors:"是否跨域",random:"是否添加随机参数"} 
	 */
	static load(url,config=null)
	{
		url=url.trim();
		
		const img=new Image();
		
		if(config){
			if(typeof config=="boolean" || config.cors) img.crossOrigin = "anonymous";
			if(typeof config=="boolean" || config.random) url=(url.indexOf("?")<0 ? url : url.split("?")[0])+"?"+Math.random();
		}
		
		img.src=url;
		return ImageUtil.check(img);
	}
	
	static check(img)
	{
		return new Promise(resolve => {
			if(img.complete) return resolve(img);
			
			img.onload=function(){
				img.onerror=img.onload=null;
				resolve(img);
			}
			
			img.onerror=function(){
				img.onerror=img.onload=null;
				resolve(null);
			}
		});
	}
	
	static queue(list,config=null)
	{
		if(!list || !list.length) return new Error('[ImageUtil] wrong args');
		
		let i=0,length=list.length;
		const array=[];
		
		const func=async resolve => {
			if(i==length) return resolve(array);
			
			let img;
			if(list[i] && list[i].trim()!="")
				img=await ImageUtil.load(list[i],config);
			
			if(img) 
				array.push(img);
			
			i++;
			func(resolve);
		}
		
		return new Promise(func)
	}
}