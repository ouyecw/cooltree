/**
===================================================================
Video Class
===================================================================
**/
import Media from './Media.js'
import Global from '../core/Global.js'
import MathUtil from '../utils/MathUtil.js'
import SystemType from '../type/SystemType.js'

export default class Video extends Media
{
	constructor()
	{
		super();
		this._type="video";
	}
	
	getWidth ()
	{
		return MathUtil.format(Math.abs(this.element.videoWidth * this.scaleX));
	}
			
	getHeight ()
	{
		return MathUtil.format(Math.abs(this.element.videoHeight * this.scaleY));
	}
	
	init  () 
	{
		if(this.is_init) return;
		super.init();
		
		this.element.style.width='100%';
		this.element.style.height='100%';
		this.element.style.objectFit='fill';
		this.element.removeAttribute("controls");
			
		if(Global.os!=SystemType.OS_PC){
			this.element.setAttribute('playsinline', true);
			this.element.setAttribute('x-webkit-airplay', 'allow');
			this.element.setAttribute('webkit-playsinline', true);
		}
		
		if(Global.isWeixin){
			this.element.setAttribute('x5-video-player-type', 'h5');
			this.element.setAttribute('x5-video-player-fullscreen', true);
		}
	}
	
	_start_load()
	{
		if(super._start_load() && "poster" in this.list[this.current]){
			this.element.poster=this.list[this.current].poster;
		}
	}
	
	dispose ()
	{
		if(this.element && this.element.parentNode){
			this.element.parentNode.removeChild(this.element);
			delete this.element;
		}
		
		super.dispose();
	}
}

Video.className="Video";