/**
===================================================================
Sound Class
===================================================================
**/
import Media from './Media.js'

/**
 * @class
 * @module Sound
 * @extends Media
 */
export default class Sound extends Media
{
	constructor()
	{
		super();
		this._type="audio";
	}
}

Sound.className="Sound";
