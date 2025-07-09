
export default class AidUtil
{
    /**
	 * 微信确认
	 * @param {String} content 
	 * @param {String} title 
	 * @returns true取消,false确认成功
	 */
	static confirm(content,title="提示")
	{
		return new Promise((resolve, reject)=>{
			wx.showModal({
				title: title,
				content: content,
				success (res) {
					resolve(!res.confirm);
				}
			})
		})
	}

	/**
	 * 本地录音转换成文字
	 * @param {String} localId 录音ID
	 * @returns 
	 */
	static transText(localId)
    {
        return new Promise((resolve, reject)=>{
            wx.translateVoice({
                localId: localId, 
                isShowProgressTips: 1,
                success:(res)=> {
                    // console.log(res);
                    resolve(res.translateResult); 
                }
            })
        })
    }

	/**
	 * 延时（ms）
	 * @param {Number} time 
	 */
	static delay(time=1)
	{
		return new Promise((resolve, reject)=>{
			setTimeout(resolve,time);
		});
	}
}

module.exports = AidUtil;