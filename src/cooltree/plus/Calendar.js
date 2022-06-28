
/**
 * @class
 * @module Calendar
 */
export default class Calendar
{
	static countMonthDays(year,month)
	{
		const months=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		return ((((year % 4) == 0) && (month == 2)) ? 29 : months[(month-1)]);
	}
	
	/**
	 * @param date     几号
	 * @param day 0~6  星期几 0 代表星期日
	 * @param type    “P”前一个月 “T”本月 “N”下一个月
	 * @param isToday  是今天否
	 */
	static createDateObject(date,day,type,isToday=false)
	{
		return {date:date,day:day,type:type,isToday:isToday};
	}
	
	/**
	 * @param month 1~12
	 * @param total 日历总格数
	 */
	static getMonthList(year,month,total=42)
	{
		const returnObj={P:[],T:[],N:[]};
					
		const prec_year =(month==1  ? (year-1) : year);
		const prec_month=(month==1  ? 12 : (month-1) );
		const next_year =(month==12 ? (year+1) : year);
		const next_month=(month==12 ? 1 : (month+1)  );
		
		const prec_number=Calendar.countMonthDays(prec_year,prec_month);
		const this_number=Calendar.countMonthDays(year,month);
		const next_number=Calendar.countMonthDays(next_year,next_month);
		
		const target_date = new Date(year,(month-1), 1);
		const day=target_date.getDay();
		const today = new Date();
		
		const now_year =today.getFullYear();
		const now_month=(today.getMonth()+1);
		const now_date =today.getDate();
		
		const prec_value=(now_year==prec_year && now_month==prec_month) ? now_date: -1;
		const this_value=(now_year==year      && now_month==month     ) ? now_date: -1;
		const next_value=(now_year==next_year && now_month==next_month) ? now_date: -1;
		
		Calendar.addData(returnObj.P,day,prec_number,day,true,"P",prec_value);
		Calendar.addData(returnObj.T,Math.min(this_number,(total-day)),this_number,day,false,"T",this_value);
		Calendar.addData(returnObj.N,(total-day-this_number),next_number,(new Date(next_year,(next_month-1), 1)).getDay(),false,"N",next_value);
		
		return returnObj;
	}
	
	static addData(list,num,total,day,isEnd,type,date=-1)
	{
		if(num<1 || num>total)return;
					
		for(let i=0;i<num;i++)
		{
			const _date=isEnd ? (total-(num-i-1)) : (i+1);
			const _day=isEnd ? Calendar.getDay(day-(num-i)) : Calendar.getDay(day+i);
			list.push(Calendar.createDateObject(_date,_day,type,(date>0 && date==_date)));
		}
	}
	
	static getDay(day)
	{
		while(day<0) day+=7;
		return (day % 7);
	}
}