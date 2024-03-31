/**
 * 战斗扩展
 * Created by 黑暗之神KDS on 2022-10-03 22:30:38.
 */
//------------------------------------------------------------------------------------------------------
//  
//------------------------------------------------------------------------------------------------------
Object.defineProperty(AsynTask.prototype, "length", {
    get: function () {
        return this._asynLength;
    },
    enumerable: false,
    configurable: true
});