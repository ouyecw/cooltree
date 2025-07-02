
export class Storage
{
	static className="Storage";

	/**
	 * @exp     number  默认缓存有效时间为3小时
	 */
	constructor(exp=108000000) {
	    this._default_exp=exp;
	}
	
	/**
	 * 加入缓存数据，返回true成功，false失败
	 * @key 名称
	 * @val 数据
	 * @exp 有效时间 0为始终有效
	 */
	add(key, val, exp=null,force=false)
	{ 	
		if(key==null) return false;
		
		if(!force){
			exp=(exp==null ? this._default_exp : exp);
			val=exp ? {data:val,time:new Date().getTime(),exp: exp} : val;
		}
		
	    try {
	      wx.setStorageSync(""+key, val);
		  return;
	    } catch (e) { }
		
		try {
		  const info = wx.getStorageInfoSync();
		} catch (e) {
		  return false;
		}
		
		if(force || !info.keys || !info.keys.length) return false;
		
		this._clear(info.keys);
		return this.add(key, val, exp,true);
	}
	
	get(key)
	{
		if(key==null) return null;
		var value=null,temp=null;

		try {
		  temp = wx.getStorageSync(""+key);
		}
		catch (e) {
			return null;
		}
		
		if(temp==null) return null;
		if(typeof temp!="object" || !temp.hasOwnProperty("time")) value=temp;
		else if(temp.exp >0 && (new Date().getTime() - temp.time) > temp.exp) {
			this.remove(key);
		}
		else value=temp.data;
		return value;
	}

	remove(key)
	{
		try {
			wx.removeStorageSync(""+key);
		} catch (e) {}
	}
	
	_clear(keys)
	{
		for(key of keys) this.get(key);
	}
}

module.exports = Storage;