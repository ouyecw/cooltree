
/**
 * @class
 * @module BlobUtil
 */
export default class BlobUtil {
	
	static blobToBase64(blob)
	{ 
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload=(e)=>{
				resolve(e.target.result);
			};
			reader.readAsDataURL(blob);
		})
	}
	
	static base64toBlob(dataurl) 
	{
	    var arr = dataurl.split(','), 
	    mime = arr[0].match(/:(.*?);/)[1],
	    bstr = atob(arr[1]), 
	    n = bstr.length, 
	    u8arr = new Uint8Array(n);
	    while (n--) {
	        u8arr[n] = bstr.charCodeAt(n);
	    }
	    return new Blob([u8arr], { type: mime });
	}
}