/**
 * @class
 * @module TimeUtil
 */
export default class TimeUtil
{
	static format (date,fmt='yyyy-MM-dd hh:mm:ss') 
	{ 
		var o = { 
			"M+" : date.getMonth()+1,                 //月份 
			"d+" : date.getDate(),                    //日 
			"h+" : date.getHours(),                   //小时 
			"m+" : date.getMinutes(),                 //分 
			"s+" : date.getSeconds(),                 //秒 
			"q+" : Math.floor((date.getMonth()+3)/3), //季度 
			"S"  : date.getMilliseconds()             //毫秒 
		}; 
		if(/(y+)/.test(fmt)) {
			fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		}
		for(var k in o) {
			if(new RegExp("("+ k +")").test(fmt)){
			    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
			}
		}
		return fmt; 
	}
	
	static auto(date)
	{
		const now=new Date();
		const same_year=(date.getFullYear()==now.getFullYear());
		const same_day=(date.getMonth()==now.getMonth() && date.getDate()==now.getDate());
		return TimeUtil.format(date,same_day ? 'hh:mm' : (same_year ? 'MM-dd hh:mm' :'yyyy-MM-dd hh:mm'));
	}
	
	static calculateTime(currenttime)
	{
		currenttime = String(currenttime);
		const current_1=currenttime.split(' ');
		const y_m_d=current_1[0]; //年月日
		const year=parseInt(y_m_d.split('-')[0]);
		const month=parseInt(y_m_d.split('-')[1]);
		const day=parseInt(y_m_d.split('-')[2]);

		const h_f_s=String(current_1[1]);  //时分秒
		const hour=parseInt(h_f_s.split(':')[0]);
		const fen=parseInt(h_f_s.split(':')[1]);
		const minutes=year*365*24*60+month*30*24*60+day*24*60+hour*60+fen;  //总的分钟
		return minutes;
	}
	
	static timeLabel(minute_cha)
	{
		if(minute_cha<2){
			return "刚刚";
		}else if(minute_cha>=2 && minute_cha<60){
			return minute_cha+"分钟前";
		}else if(minute_cha>=60 && minute_cha<1440){
			return parseInt(minute_cha/60)+"小时前";
		}else if(minute_cha>=1440 && minute_cha<10080){
			return parseInt(minute_cha/1440)+"天前";
		}else if(minute_cha>=10080 && minute_cha<43200){
			return parseInt(minute_cha/10080)+"周前";
		}else if(minute_cha>=43200 && minute_cha<518400){
			return parseInt(minute_cha/43200)+"月前";
		}else{
			return parseInt(minute_cha/518400)+"年前";
		}
	}
	
	/**
	 * @param {Object} time    需要转换的时间
	 * @param {Object} nowTime 服务器当前时间（选填）
	 */
	static getTime(time,nowTime=null)
	{
		return TimeUtil.timeLabel(TimeUtil.calculateTime(nowTime || TimeUtil.format(new Date()))-TimeUtil.calculateTime(time));
	}
}