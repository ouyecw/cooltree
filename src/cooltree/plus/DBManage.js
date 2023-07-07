
import Storage from "./Storage.js"

/**
 * @class
 * @module DBManage
 */
export default class DBManage
{
	/**
	 * 数据库名称
	 * @param {String} databaseName 数据库名称
	 */
	constructor(databaseName)
	{
		this.db=null;
		this.databaseName=databaseName;
		
		this.storage=new Storage();
		this.version=this.storage.getItem(databaseName) || 1;
	}
	
	/**
	 * 添加表格
	 * @param {String} tableName 表格名称
	 * @param {Object} indexObj  表格数据结构 true不可重复
	 */
	async addTable(tableName,indexObj)
	{
		this.version++;
		this.db=await DBManage.create(this.databaseName,this.version,true);
		this.storage.addItem(this.databaseName,this.version);
		let objectStore;
		
		if(!this.db.objectStoreNames.contains(tableName)) {
			objectStore = this.db.createObjectStore(tableName, { keyPath: 'id' ,autoIncrement:true});
		}else{
			try{
				const transaction = this.db.transaction([tableName],"readwrite");
				objectStore = transaction.objectStore(tableName);
			}
			catch(err){
				console.log("[DBManage] addTable:",err);
				return;
			}
		}
		
		for( let name in indexObj){
			try{
				objectStore.createIndex(name, name, { unique: indexObj[name] ? true : false});
			}
			catch(err){
				console.log("[DBManage] addTable::",err)
			}
		}
		
		return new Promise((resolve, reject) => {
			objectStore.transaction.oncomplete=(event) => {
				this.close();
			    resolve();
			}
			
			objectStore.transaction.onerror = (event) => {
				this.close();
				reject();
			}
		});
	}
	
	/**
	 * 删除表格
	 * @param {String} tableName 表格名称
	 */
	async removeTable(tableName)
	{
		this.version++;
		this.db=await DBManage.create(this.databaseName,this.version,true);
		this.storage.addItem(this.databaseName,this.version);
		let objectStore;
		
		if(this.db.objectStoreNames.contains(tableName)) {
			this.db.deleteObjectStore(tableName);
		}

		this.close();
	}
	
	/**
	 * 关闭已连接数据库
	 */
	close()
	{
		if(!this.db) return;
		this.db.close();
		this.db=null;
	}
	
	/**
	 * 添加数据
	 * @param {String} tableName 表格名称
	 * @param {Object | Array} data      单元数据
	 */
	async addData(tableName,data)
	{
		if(!this.db) this.db=await DBManage.create(this.databaseName,this.version);
		if(!this.db || !this.db.objectStoreNames.contains(tableName)) return;
		
		const transaction = this.db.transaction([tableName],"readwrite");
		const objectStore = transaction.objectStore(tableName);
		
		return new Promise((resolve, reject) => { 
			try{
				if(data instanceof Array){
					for(let sub of data){
						objectStore.add(sub);
					}
				}
				else{
					objectStore.add(data);
				}
			}
			catch(err){
				console.log("[DBManage] addData:",err);
				this.close();
				reject();
				return;
			}
			
			transaction.oncomplete = (event) => {
				this.close();
			    resolve();
			}
			
			transaction.onerror = (event) => {
				console.log("[DBManage] addData:",event.target.error.message);
				this.close();
			    reject();
			}
		});
	}
	
	/**
	 * 清空表格数据
	 * @param {String} tableName 表格名称
	 */
	async clearTable(tableName)
	{
		if(!this.db) this.db=await DBManage.create(this.databaseName,this.version);
		if(!this.db || !this.db.objectStoreNames.contains(tableName)) return;
		
		const transaction = this.db.transaction([tableName],"readwrite");
		const objectStore = transaction.objectStore(tableName);
		
		return new Promise((resolve, reject) => { 
			const request = objectStore.clear();
			
			request.onsuccess = (event) => {
				this.close();
			    resolve();
			}
			
			request.onerror = (event) => {
				this.close();
			    reject();
			}
		});
	}
	
	/**
	 * 更新单元数据
	 * @param {String} tableName  表格名称
	 * @param {Object} data       单元数据
	 */
	async updateData(tableName,data)
	{
		if(!this.db) this.db=await DBManage.create(this.databaseName,this.version);
		if(!this.db || !this.db.objectStoreNames.contains(tableName)) return;
		
		const transaction = this.db.transaction([tableName],"readwrite");
		const objectStore = transaction.objectStore(tableName);
		
		return new Promise((resolve, reject) => { 
			const request = objectStore.put(data);
			
			request.onsuccess = (event) => {
				this.close();
			    resolve();
			}
			
			request.onerror = (event) => {
				this.close();
			    reject();
			}
		});
	}
	
	/**
	 * 获取单元数据
	 * @param {String} tableName 表格名称
	 * @param {Number} index     索引值
	 */
	async getData(tableName,index)
	{
		if(!this.db) this.db=await DBManage.create(this.databaseName,this.version);
		if(!this.db || !this.db.objectStoreNames.contains(tableName)) return;
		
		const transaction = this.db.transaction([tableName],"readonly");
		const objectStore = transaction.objectStore(tableName);
		
		return new Promise((resolve, reject) => { 
			const request = objectStore.get(index);
			
			request.onsuccess = (event) => {
				const result = event.target.result;
			    resolve(result);
				this.close();
			}
			
			request.onerror = (event) => {
				this.close();
			    reject();
			}
		});
	}
	
	/**
	 * 删除单元数据
	 * @param {String} tableName 表格名称
	 * @param {Number} index     索引值
	 */
	async removeData(tableName,index)
	{
		if(!this.db) this.db=await DBManage.create(this.databaseName,this.version);
		if(!this.db || !this.db.objectStoreNames.contains(tableName)) return;
		
		const transaction = this.db.transaction([tableName],"readwrite");
		const objectStore = transaction.objectStore(tableName);
		
		return new Promise((resolve, reject) => { 
			const request = objectStore.delete(index);
			request.onsuccess = (event) => {
				this.close();
			    resolve();
			}
			
			request.onerror = (event) => {
				this.close();
			    reject();
			}
		});
	}
	
	/**
	 * 搜索数据
	 * @param {String} tableName 表格名称
	 * @param {String} label     字段名
	 * @param {String} value     字段数值
	 */
	async search(tableName,label,value)
	{
		if(!this.db) this.db=await DBManage.create(this.databaseName,this.version);
		if(!this.db || !this.db.objectStoreNames.contains(tableName)) return;
		
		const transaction = this.db.transaction([tableName],"readonly");
		const objectStore = transaction.objectStore(tableName);
		const index = objectStore.index(label);
		
		return new Promise((resolve, reject) => { 
			const request = index.get(value);
			
			request.onerror = (event) => {
				this.close();
				reject();
			}
		
			request.onsuccess = (event) => {
				const result = event.target.result;
				resolve(result);
				this.close();
			}
		});
	}
	
	/**
	 * 获取全部表格数据
	 * @param {String} tableName 表格名称
	 */
	async getList(tableName)
	{
		if(!this.db) this.db=await DBManage.create(this.databaseName,this.version);
		if(!this.db || !this.db.objectStoreNames.contains(tableName)) return;
		
		const transaction = this.db.transaction([tableName],"readonly");
		const objectStore = transaction.objectStore(tableName);

		return new Promise((resolve, reject) => {
			const request = objectStore.openCursor();
			const list=[];
			
			request.onerror = (event) => {
				this.close();
				reject();
			}
			
			request.onsuccess = (event) => {
				const result = event.target.result;
				
				if(result) {
					list.push(result.value);
					result.continue();
				}else {
					resolve(list);
					this.close();
				}
			}
		});
	}
	
	/**
	 * 移除本数据库
	 */
	removeDB()
	{
		if(!this.databaseName) return;
		const request = window.indexedDB.deleteDatabase(this.databaseName);
		
		return new Promise((resolve, reject) => { 
			request.onerror = (event) => {
				reject();
			}
			
			request.onsuccess = (event) => {
				this.storage.removeItem(this.databaseName);
				resolve();
			}
		});
	}
	
	/**
	 * 销毁
	 */
	dispose()
	{
		this.close();
		this.databaseName=this.storage=this.version=null;
	}
	
	/**
	 * 创建数据库连接
	 * @param {String} databaseName  数据库名称
	 * @param {Number} version       数据库版本号
	 * @param {Boolean} upgrade      是否升级版本
	 */
	static create(databaseName, version , upgrade=false)
	{
		if(!window.indexedDB) window.indexedDB = window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		const request = window.indexedDB.open(databaseName, version);
		
		return new Promise((resolve, reject) => {
			if(upgrade){
				request.onupgradeneeded = (ev)=>{
					resolve(request.result);
				}
			}else{
				request.onsuccess = (ev)=>{
					resolve(request.result);
				}
			}
		
			request.onerror = (ev)=>{
				reject(ev);
			}
		});
	}
}