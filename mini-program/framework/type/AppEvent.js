/**
 * @class
 * @module AppEvent
 */
export default class AppEvent 
{
    //stage初始化完成
    static STARTUP="startup";

    //小程序状态前台还是后台
    static ACTIVE_APP="activeAPP";
}

module.exports = AppEvent;