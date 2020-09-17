
export default class Compile
{
	//加密
	static encode(code)
	{
		let i,l=code.length,c=String.fromCharCode(code.charCodeAt(0)+l);  
	    for(i=1;i<l;i++) c+=String.fromCharCode(code.charCodeAt(i)-code.charCodeAt(i-1));  
	    return escape(c);
	}
	
	//解密
	static decode(code)
	{
	    code = unescape(code); 
	    let i,l=code.length,c=String.fromCharCode(code.charCodeAt(0)-l);  
	    for(i=1;i<l;i++) c+=String.fromCharCode(code.charCodeAt(i)+c.charCodeAt(i-1));
	    return c;
	}
}

Compile.className="Compile";