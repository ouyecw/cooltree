/**
===================================================================
Loader Class
===================================================================
**/
import StringUtil from '../utils/StringUtil.js'
import Parser from '../libs/dom-parser.js'
import Global from '../core/Global.js'

/**
 * @class
 * @module Loader
 */
export default class Loader
{
	static className="Loader";
	
	/**
	 * loader
	 */
	constructor()
	{
		this.fs = wx.getFileSystemManager();
		this.targetPath=`${wx.env.USER_DATA_PATH}/files/`;
	}

	loadURL(path)
	{
		const ext=StringUtil.getPathExt(path);
		const type=Loader.getContentType(ext);

		return new Promise((resolve, reject)=>{
			wx.request({
				url: path+(path.indexOf("?")<0 ? '?r='+Math.random() : ""),
				header: {
					'content-type': type
				},
				success:(res)=> {
					resolve(res.data);
				},
				fail: (res)=>{
					console.error("加载文件失败",res);
					resolve(null);
				}
			})
		})
		
	}

	loadFont(path,fontName)
	{
		return new Promise((resolve, reject)=>{
			wx.loadFontFace({
				family: fontName,
				source: `url("${path}")`,
				success: (res)=>{
					resolve(true);
				},
				fail: (res)=>{
					console.error("加载字体失败",res);
					resolve(false);
				}
			})
		})
	}

	loadSound(path)
	{
		return new Promise(async (resolve, reject)=>{
			const audioCtx = wx.createWebAudioContext();
			const res =await this.loadURL(path);
			
			if(!res) {
				resolve(null);
				return;
			}

			audioCtx.decodeAudioData(res.data, buffer => {
				const source = audioCtx.createBufferSource()
				source.buffer = buffer
				source.connect(audioCtx.destination)
				resolve(source);
			}, err => {
				console.error('decodeAudioData fail', err)
				resolve(null);
			})
		})
	}

	/**
	 * 
	 * @param {string} path || base64数据
	 * @returns 
	 */
	static loadImage(path)
	{
		return new Promise((resolve, reject)=>{
			Loader.loadImg(path,resolve);
		})
	}

	static loadImg(path,callback)
	{
		const img = Global.stage.canvas.createImage();
		img.onload = () => {
			callback(img);
		}
		img.onerror=() => {
			callback(null);
		}
		img.src = path;
		return img;
	}

	isAccess(path,isDir=true)
    {
        try{
            return this.fs.accessSync(this.targetPath+path) && (!isDir || this.fs.readdirSync(this.targetPath+path).length>0);
        }
        catch(err){}
        return false;
    }

	/**
	 * 
	 * @param {string} name 注意要加后缀名
	 * @param {*} data 
	 * @param {string} type 'base64' 'utf8'
	 */
	static saveFile(name,data,type)
	{
		try {
			const res = fs.writeFileSync(
			  `${wx.env.USER_DATA_PATH}/temp/`+name,
			  data,
			  type
			)

			return res;
		} catch(e) {
			console.error(e)
		}
		return null;
	}

	removeDir(dirPath)
	{
		const path=this.targetPath+dirPath;
		const files = this.fs.readdirSync(path);
		let name,filePath;

        for(name of files){
			if(name.indexOf(".")<0){
				this.removeDir(dirPath+"/"+name);
				continue;
			}

			filePath=path+"/"+name;
			this.fs.unlink({
				filePath,
				fail(res) {
					console.error("删除文件失败",res);
				}
			});
		}

		this.fs.rmdir({
			dirPath:path,
			fail(res) {
				console.error("删除文件夹失败",res);
			}
		});
	}

	getFileInfo(filePath)
	{
		return new Promise((resolve, reject)=>{
			this.fs.getFileInfo({
				filePath,
				success:resolve,
				fail(e){
					console.error("获取文件信息失败",e);
					resolve(null);
				}
			})
		})
	}

	newDir(dirPath)
	{
		try{
			this.fs.mkdir({
				dirPath: this.targetPath+dirPath,
				recursive: true,
				fail(res) {
					// console.error("创建文件夹失败",res);
				}
			})
        }
        catch(err){};
	}

	moveFile(temp,target)
	{
		return new Promise((resolve, reject)=>{
			this.fs.saveFile({
				tempFilePath:temp,
				filePath:this.targetPath+target,
				success:resolve,
				fail:res=>{
					console.error("移动文件失败",res);
					resolve();
				}
			})
		});
	}

	async readDirFile(dirPath)
    {
        const files = this.fs.readdirSync(this.targetPath+dirPath);
        const dic ={};

        let name;
        for(name of files){
			dic[Loader.getName(name)]= await this.readFile(dirPath+"/"+name);
        }

        return dic;
    }

	async readFile(path)
	{
		let data,ext,type;
		path=this.targetPath+path;
		ext=StringUtil.getPathExt(path);
		type=Loader.getFileType(ext);

		data=this.fs.readFileSync(path,type);
		return await this.parseData(data,ext);
	}

	async parseData(data,ext)
	{
		switch(ext){
			case "png":
			case "jpg":
			case "jpeg":
			case "gif":
				if(Global.stage?.canvas)
					data=await Loader.loadImage(`data:image/${ext};base64,`+data);
				break;

			case "json":
				data=JSON.parse(data);
				break;

			case "xml":
			case "fnt":
			case "plist":
				const XML_parser=new Parser.DOMParser();
				data=XML_parser.parseFromString(data,"text/xml");
				break;
		}

		return data;
	}

    download(path,name=null)
    {
        return new Promise((resolve, reject)=>{
            wx.downloadFile({
                url:path,
                success:(res)=> {
                    if(name)
                        this.unzip(res.tempFilePath,this.targetPath+name,resolve,reject);
                    else
                        resolve(res.tempFilePath);
                },
                fail:(res)=> {
                    console.log("下载 zip 失败", res.errMsg);
					reject(res);
                }
            })
        })
    }

    unzip(zipFilePath,targetPath,callback,error)
    {
        try{
			// if(!this.fs.accessSync(targetPath))
			this.fs.mkdir({
				dirPath: targetPath,
				recursive: true,
				fail(res) {
					// console.error("创建文件夹失败",res);
				}
			})
        }
        catch(err){};

        this.fs.unzip({
            zipFilePath,
            targetPath,
            success(_res) {
                callback(targetPath);
            },
            fail(res) {
                console.log("解压失败", res.errMsg);
				error(res);
            }
        })
    }
	
	dispose()
	{
		delete this.fs,this.targetPath;
	}

	static getFileType(ext)
	{
		switch(ext){
			case "png":
			case "jpg":
			case "jpeg":
			case "gif":
				return "base64";

			case "txt":
			case "xml":
			case "plist":
			case "json":
			case "fnt":
				return "utf8";

			case "skel":
				return "";

			default:
				return "binary";
		}
	}

	static getContentType(ext)
	{
		let type;
		switch(ext){
			case "json":
				type="application/json";
				break;

			case "xml":
			case "plist":
				type="text/xml";
				break;

			case "gif":
			case "png":
			case "jpeg":
				type="image/"+ext;
				break;

			case "html":
				type="text/html";
				break;

			case "md":
				type='application/x-www-form-urlencoded';
				break;

			case "mp3":
				type="arraybuffer";
				break
			
			default:
				type="text/plain";
				break;
		}
		return type;
	}
	
	static getName(url)
	{
		if(StringUtil.isEmpty(url)) return null;
		
		let arr,bool=false;
		
		try{
			arr=StringUtil.getFileName(url,1).split("/");
		}catch(err){
			bool=true;
			// console.log("[WARN] Loader.getName by",url);
		}
		
		if(arr==null || bool) 
			return StringUtil.getFileName(url)+"@"+StringUtil.getPathExt(url);
		
		let str=arr.pop();
		while(StringUtil.isEmpty(str) && arr.length>0) str=arr.pop();
		return str+"_"+StringUtil.getFileName(url)+"@"+StringUtil.getPathExt(url);
	}

}

module.exports = Loader;