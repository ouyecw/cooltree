
/**
 * @class
 * @module DoubleClick
 */
export default class DoubleClick
{
	static _time=0;
	static _interval=300;

	static check()
	{
		let now=(new Date()).getTime();
		let delay=now-DoubleClick._time;
		DoubleClick._time=now;
		
		if(delay<DoubleClick._interval){
			DoubleClick._time=0;
			return true;
		}
		
		return false;
	}
}

module.exports = DoubleClick;