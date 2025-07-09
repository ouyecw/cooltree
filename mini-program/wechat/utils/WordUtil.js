import StringUtil from './StringUtil.js'

export class Language
{
	/**
	 * 简体中文
	 */
	static CN="cn";

	/**
	 * 日语
	 */
	static JA="ja";

	/**
	 * 英语
	 */
	static EN="en";

	/**
	 * 繁体中文
	 */
	static TW="zh-tw";
	static HK="zh-hk";

	/**
	 * 法语
	 */
	static FR="fr";

	/**
	 * 德语
	 */
	static DE="de";

	/**
	 * 韩语
	 */
	static KO="ko";

	/**
	 * 西班牙语
	 */
	static ES="es";

	/**
	 * 瑞典语
	 */
	static SV="sv";

	/**
	 * 意大利语
	 */
	static IT="it";
}

/**
 * @class
 * @module WordUtil
 */
export default class WordUtil
{
	static dic={};
	static language=Language.CN;

	static set(label,word,language)
	{
		if(StringUtil.isEmpty(label) || StringUtil.isEmpty(word)) return;
		language=(language==undefined) ? WordUtil.language : language;
		if(!WordUtil.dic.hasOwnProperty(language)) WordUtil.dic[language]={};
		WordUtil.dic[language][label]=word;
	}
	
	static get(label,language=null)
	{
		language=!language ? WordUtil.language : language;
		if(!WordUtil.dic.hasOwnProperty(language) || WordUtil.dic[language]==null || !(WordUtil.dic[language]).hasOwnProperty(label)) return "";
		return WordUtil.dic[language][label];
	}
	
	static format(language)
	{
		language=language.toLowerCase();
		if(language==Language.TW || language==Language.HK) return language;
		return language.split("-")[0];
	}
	
	static clear()
	{
		WordUtil.dic={};
	}
}

module.exports = {Language,WordUtil};
