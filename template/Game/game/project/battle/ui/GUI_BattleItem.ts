/**
 * 战斗道具栏
 * Created by 黑暗之神KDS on 2021-01-19 06:07:49.
 */
class GUI_BattleItem extends GUI_25 {
    /**
     * 选择道具 onSelectItem(item:Module_Item);
     */
    static EVENT_SELECT_ITEM: string = "GUI_BattleItemEVENT_SELECT_ITEM";
    /**
     * 构造函数
     */
    constructor() {
        super();
        // 初始化列表
        GUI_Manager.standardList(this.itemList);
        // 当该界面显示时
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        this.on(EventObject.UNDISPLAY, this, this.onUnDisplay);
        // 当道具栏选中项更改时
        this.itemList.on(EventObject.CHANGE, this, this.onActorItemChange);
        // 当道具栏选中项更改时
        this.itemList.on(UIList.ITEM_CLICK, this, this.onItemUIItemClick);
        // 当道具栏项创建时
        this.itemList.onCreateItem = Callback.New(this.onCreateItemUIItem, this);
    }
    /**
     * 当该界面显示时
     */
    private onDisplay(): void {
        // -- 刷新道具列表
        this.refreshItemList();
        // -- 焦点
        UIList.focus = this.itemList;
        // -- 刷新说明栏
        this.refreshDescribe();
        // 监听数据变化后刷新
        EventUtils.addEventListenerFunction(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER, this.refreshItemList, this);
    }
    /**
     * 当该界面不再显示时
     */
    private onUnDisplay(): void {
        // 取消监听数据变化
        EventUtils.removeEventListenerFunction(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER, this.refreshItemList, this);
    }
    /**
     * 刷新道具列表
     */
    private refreshItemList(): void {
        // -- 获取当前选中的战斗者
        let battler = GameBattleController.currentOperationBattler;
        if (!battler || Game.player.data.package.length == 0) {
            this.itemList.items = [];
            return;
        }
        // -- 列出非被动道具
        let arr = [];
        for (let i = 0; i < Game.player.data.package.length; i++) {
            let itemDS = Game.player.data.package[i];
            if (itemDS.isEquip) continue;
            let item = itemDS.item;
            if (item && item.isUse && item.useType != 1) {
                let d = new ListItem_1031;
                d.icon = item.icon;
                d.itemName = item.name;
                d.data = item;
                d.itemNum = itemDS.number == 1 ? "" : ("x" + itemDS.number.toString()); // 设置道具数目
                arr.push(d);
            }
        }
        this.itemList.items = arr;
    }
    /**
     * 当道具选中发生改变时处理
     */
    private onActorItemChange(): void {
        this.refreshDescribe();
    }
    /**
     * 当道具项点击时
     */
    private onItemUIItemClick(): void {
        // 获取战斗者和道具
        let battler = GameBattleController.currentOperationBattler;
        let item: Module_Item = this.itemList.selectedItem ? this.itemList.selectedItem.data : null;
        if (!battler || !item) return;
        // 派发选择道具的事件
        Callback.CallLaterBeforeRender(() => {
            // 暂时关闭界面
            GameCommand.startCommonCommand(15022);
            EventUtils.happen(GUI_BattleItem, GUI_BattleItem.EVENT_SELECT_ITEM, [item]);
        }, this)
    }
    /**
     * 当创建项时
     * @param ui 
     * @param data 
     * @param index 
     */
    private onCreateItemUIItem(ui: GUI_1031, data: ListItem_1031, index: number) {
        let item: Module_Item = data.data;
        ui.itemNum.visible = ui.icon.visible = item ? true : false;
    }
    //------------------------------------------------------------------------------------------------------
    // 描述
    //------------------------------------------------------------------------------------------------------
    /**
     * 刷新描述
     */
    private refreshDescribe(): void {
        this.tipsUI.cdBox.visible = false;
        let battler = GameBattleController.currentOperationBattler;
        let name = "";
        let desc = "";
        if (!(!battler || !this.itemList.selectedItem)) {
            // 焦点在道具栏的情况下
            if (UIList.focus == this.itemList) {
                let itemData = this.itemList.selectedItem;
                let item = itemData.data as Module_Item;
                if (item) {
                    name = item.name;
                    desc = GUI_Manager.itemDesc(item);
                }
            }
        }
        this.tipsUI.descName.text = name;
        this.tipsUI.descText.text = desc;
        this.tipsUI.descText.height = this.tipsUI.descText.textHeight;
        this.tipsUI.descTextBox.refresh();
    }
}