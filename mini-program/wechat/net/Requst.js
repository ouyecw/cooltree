import ObjectUtil from '../utils/ObjectUtil.js'

export class Requst
{
   	static className="Requst";
	static succeedCode="200";
   	static loginAPI;
	static headerFunc;
   
   	constructor(path) {
	  this._root_path=(path || '');
  	}

	get(url,params=null,config=null)
	{
    	const header = (url==Requst.loginAPI || !Requst.headerFunc) ? {} : Requst.headerFunc();
		const obj=config ? Object.assign({url:url,method:"GET",data:params,header},config) : {url:url,method:"GET",data:params,header};
		return this.send(obj);
	}
	
	post(url,params=null,config=null)
	{	
		const header = (url==Requst.loginAPI || !Requst.headerFunc) ? {} : Requst.headerFunc();
		const obj=config ? Object.assign({url:url,method:"POST",data:params,header},config) : {url:url,method:"POST",data:params,header};
		return this.send(obj);
    }
  
	upload(url,params,name="file",header=null)
	{
		return new Promise(resolve => {
			const filePath=params[name];

			if(!params || !url || !filePath) {
				resolve(false);
				return;
			}

			delete params[name];
			if(url.indexOf("http")!=0) url=this._root_path+url;

			const obj={url,name,filePath};
			if(JSON.stringify(params)!="{}") obj.formData=params;

			if(header || Requst.headerFunc) {
				const temp = Requst.headerFunc ? Requst.headerFunc() : null;
				if(header && temp) ObjectUtil.copyAttribute(header,temp,false);
				obj.header=header || temp;
			}

			obj.success=res=>{
				
				if(typeof res.data=="string") res.data=JSON.parse(res.data);
				
				if(res.data.code!=Requst.succeedCode){
					wx.showToast({
						title: res.data.message,
						icon: 'none',
						duration: 2000,
					});
				}

				resolve(res.data.code==Requst.succeedCode ? res.data : null);
			}

			obj.fail=res=>{
				wx.showModal({
					title: "错误提示",
					content: "["+res.statusCode+"]"+res.data,
					showCancel: false
				});
				resolve(false);
			}

			wx.uploadFile(obj);
		});
	}
	/**
	 * @param {Object} obj
    url	           string		                开发者服务器接口地址	
		data	       string/object/ArrayBuffer	请求的参数	
		header	       Object		                设置请求的 header，header 中不能设置 Referer。content-type 默认为 application/json	
		method	       string                       GET HTTP 请求方法	
		dataType	   string                       json返回的数据格式	
		responseType   string                       text响应的数据类型
	 */
	send(obj)
	{
		return new Promise((resolve, reject) => {
			if(!obj || !obj.url ) return	resolve(false);
			obj.success=res=>{
				if(res.data.code!=Requst.succeedCode && res.data.message){
					wx.showToast({
						title: res.data.message,
						icon: 'none',
						duration: 2000,
					});
				}

				resolve(res.data.code==Requst.succeedCode ? res.data : null);
			}
    
			obj.fail=res=>{
				wx.showModal({
					title: "错误提示",
					content:res.statusCode? "["+res.statusCode+"]"+res.data:'请求超时',
					showCancel: false
				});	
				resolve(null);
			};
			
			if(obj.url.indexOf("http")!=0) obj.url=this._root_path+obj.url;
			wx.request(obj);
		});
	}
}

module.exports = Requst;
