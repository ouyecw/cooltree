/**
===================================================================
Sound Class
===================================================================
**/
import Media from './Media.js'

export default class Sound extends Media
{
	constructor()
	{
		super();
		this._type="audio";
	}
}

Sound.className="Sound";
