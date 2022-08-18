Language={};

/**
 * 简体中文
 */
Language.CN="zh";

/**
 * 日语
 */
Language.JA="ja";

/**
 * 英语
 */
Language.EN="en";

/**
 * 繁体中文
 */
Language.TW="zh-tw";
Language.HK="zh-hk";

/**
 * 法语
 */
Language.FR="fr";

/**
 * 德语
 */
Language.DE="de";

/**
 * 韩语
 */
Language.KO="ko";

/**
 * 西班牙语
 */
Language.ES="es";

/**
 * 瑞典语
 */
Language.SV="sv";

/**
 * 意大利语
 */
Language.IT="it";

WordUtil={}
WordUtil.dic={};
WordUtil.language=Language.CN;

WordUtil.set=function(label,word,language)
{
	if(StringUtil.isEmpty(label) || StringUtil.isEmpty(word)) return;
	language=(language==undefined) ? WordUtil.language : language;
	if(!WordUtil.dic.hasOwnProperty(language)) WordUtil.dic[language]={};
	WordUtil.dic[language][label]=word;
}

WordUtil.get=function(label,language)
{
	language=(language==undefined) ? WordUtil.language : language;
	if(!WordUtil.dic.hasOwnProperty(language) || WordUtil.dic[language]==null || !(WordUtil.dic[language]).hasOwnProperty(label)) return "";
	return WordUtil.dic[language][label];
}

WordUtil.format=function(language)
{
	language=language.toLowerCase();
	if(language==Language.TW || language==Language.HK) return language;
	return language.split("-")[0];
}

WordUtil.clear=function()
{
	WordUtil.dic={};
}
