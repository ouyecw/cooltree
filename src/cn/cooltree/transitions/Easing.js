
class Easing
{
	static easeNone  (t, b, c, d, p_params) 
	{
		return c*t/d + b;
	}
		
	static easeInQuad  (t, b, c, d, p_params) 
	{
		return c*(t/=d)*t + b;
	}
	
	static easeOutQuad  (t, b, c, d, p_params) 
	{
		return -c *(t/=d)*(t-2) + b;
	}
	
	static easeInOutQuad  (t, b, c, d, p_params) 
	{
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	}
	
	static easeOutInQuad  (t, b, c, d, p_params) 
	{
		if (t < d/2) return Easing.easeOutQuad (t*2, b, c/2, d, p_params);
		return Easing.easeInQuad((t*2)-d, b+c/2, c/2, d, p_params);
	}
	
	static easeInCubic  (t, b, c, d, p_params) 
	{
		return c*(t/=d)*t*t + b;
	}
	
	static easeOutCubic  (t, b, c, d, p_params) 
	{
		return c*((t=t/d-1)*t*t + 1) + b;
	}
	
	static easeInOutCubic  (t, b, c, d, p_params) 
	{
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	}
	
	static easeOutInCubic  (t, b, c, d, p_params) 
	{
		if (t < d/2) return Easing.easeOutCubic (t*2, b, c/2, d, p_params);
		return Easing.easeInCubic((t*2)-d, b+c/2, c/2, d, p_params);
	}
	
	static easeInQuart  (t, b, c, d, p_params) 
	{
		return c*(t/=d)*t*t*t + b;
	}
	
	static easeOutQuart  (t, b, c, d, p_params) 
	{
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	}
	
	static easeInOutQuart  (t, b, c, d, p_params) 
	{
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	}
	
	static easeOutInQuart  (t, b, c, d, p_params) 
	{
		if (t < d/2) return Easing.easeOutQuart (t*2, b, c/2, d, p_params);
		return Easing.easeInQuart((t*2)-d, b+c/2, c/2, d, p_params);
	}
	
	static easeInQuint  (t, b, c, d, p_params) 
	{
		return c*(t/=d)*t*t*t*t + b;
	}
	
	static easeOutQuint  (t, b, c, d, p_params) 
	{
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	}
	
	static easeInOutQuint  (t, b, c, d, p_params) 
	{
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	}
	
	static easeOutInQuint  (t, b, c, d, p_params) 
	{
		if (t < d/2) return Easing.easeOutQuint (t*2, b, c/2, d, p_params);
		return Easing.easeInQuint((t*2)-d, b+c/2, c/2, d, p_params);
	}
	
	static easeInSine  (t, b, c, d, p_params) 
	{
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	}
	
	static easeOutSine  (t, b, c, d, p_params) 
	{
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	}
	
	static easeInOutSine  (t, b, c, d, p_params) 
	{
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	}
	
	static easeOutInSine  (t, b, c, d, p_params) 
	{
		if (t < d/2) return Easing.easeOutSine (t*2, b, c/2, d, p_params);
		return Easing.easeInSine((t*2)-d, b+c/2, c/2, d, p_params);
	}
	
	static easeInExpo  (t, b, c, d, p_params) 
	{
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
	}
	
	static easeOutExpo  (t, b, c, d, p_params) 
	{
		return (t==d) ? b+c : c * 1.001 * (-Math.pow(2, -10 * t/d) + 1) + b;
	}
	
	static easeInOutExpo  (t, b, c, d, p_params) 
	{
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
		return c/2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
	}
	
	static easeOutInExpo  (t, b, c, d, p_params) 
	{
		if (t < d/2) return Easing.easeOutExpo (t*2, b, c/2, d, p_params);
		return Easing.easeInExpo((t*2)-d, b+c/2, c/2, d, p_params);
	}
	
	static easeInCirc  (t, b, c, d, p_params) 
	{
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	}
	
	static easeOutCirc  (t, b, c, d, p_params) 
	{
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	}
	
	static easeInOutCirc  (t, b, c, d, p_params) 
	{
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	}
	
	static easeOutInCirc  (t, b, c, d, p_params) 
	{
		if (t < d/2) return Easing.easeOutCirc (t*2, b, c/2, d, p_params);
		return Easing.easeInCirc((t*2)-d, b+c/2, c/2, d, p_params);
	}
	
	static easeInElastic  (t, b, c, d, p_params) 
	{
		if (t==0) return b;
		if ((t/=d)==1) return b+c;
		let p = !Boolean(p_params) || isNaN(p_params.period) ? d*.3 : p_params.period;
		let s;
		let a = !Boolean(p_params) || isNaN(p_params.amplitude) ? 0 : p_params.amplitude;
		if (!Boolean(a) || a < Math.abs(c)) {
			a = c;
			s = p/4;
		} else {
			s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	}
	
	static easeOutElastic  (t, b, c, d, p_params) 
	{
		if (t==0) return b;
		if ((t/=d)==1) return b+c;
		let p = !Boolean(p_params) || isNaN(p_params.period) ? d*.3 : p_params.period;
		let s;
		let a = !Boolean(p_params) || isNaN(p_params.amplitude) ? 0 : p_params.amplitude;
		if (!Boolean(a) || a < Math.abs(c)) {
			a = c;
			s = p/4;
		} else {
			s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
	}
	
	static easeInOutElastic  (t, b, c, d, p_params) 
	{
		if (t==0) return b;
		if ((t/=d/2)==2) return b+c;
		let p = !Boolean(p_params) || isNaN(p_params.period) ? d*(.3*1.5) : p_params.period;
		let s;
		let a = !Boolean(p_params) || isNaN(p_params.amplitude) ? 0 : p_params.amplitude;
		if (!Boolean(a) || a < Math.abs(c)) {
			a = c;
			s = p/4;
		} else {
			s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	}
	
	static easeOutInElastic  (t, b, c, d, p_params) 
	{
		if (t < d/2) return Easing.easeOutElastic (t*2, b, c/2, d, p_params);
		return Easing.easeInElastic((t*2)-d, b+c/2, c/2, d, p_params);
	}
	
	static easeInBack  (t, b, c, d, p_params) 
	{
		let s = !Boolean(p_params) || isNaN(p_params.overshoot) ? 1.70158 : p_params.overshoot;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	}
	
	static easeOutBack  (t, b, c, d, p_params) 
	{
		let s = !Boolean(p_params) || isNaN(p_params.overshoot) ? 1.70158 : p_params.overshoot;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}
	
	static easeInOutBack  (t, b, c, d, p_params) 
	{
		let s = !Boolean(p_params) || isNaN(p_params.overshoot) ? 1.70158 : p_params.overshoot;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	}
	
	static easeOutInBack  (t, b, c, d, p_params) 
	{
		if (t < d/2) return Easing.easeOutBack (t*2, b, c/2, d, p_params);
		return Easing.easeInBack((t*2)-d, b+c/2, c/2, d, p_params);
	}
	
	static easeInBounce  (t, b, c, d, p_params) 
	{
		return c - Easing.easeOutBounce (d-t, 0, c, d) + b;
	}
	
	static easeOutBounce  (t, b, c, d, p_params) 
	{
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	}
	
	static easeInOutBounce  (t, b, c, d, p_params) 
	{
		if (t < d/2) return Easing.easeInBounce (t*2, 0, c, d) * .5 + b;
		else return Easing.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
	
	static easeOutInBounce  (t, b, c, d, p_params) 
	{
		if (t < d/2) return Easing.easeOutBounce (t*2, b, c/2, d, p_params);
		return Easing.easeInBounce((t*2)-d, b+c/2, c/2, d, p_params);
	}
	
	static easeInStrong (t, b, c, d, p_params) 
	{
		return c*(t/=d)*t*t*t*t + b;
	}
	
	static easeOutStrong (t, b, c, d, p_params) 
	{
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	}
	
	static easeInOutStrong (t, b, c, d, p_params) 
	{
		if ((t/=d*0.5) < 1) return c*0.5*t*t*t*t*t + b;
		return c*0.5*((t-=2)*t*t*t*t + 2) + b;
	}

}
