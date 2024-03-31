/**
 * 战斗界面
 * Created by 黑暗之神KDS on 2021-02-24 01:19:31.
 */
class GUI_Battle extends GUI_21 {
    /**
     * 选中的玩家战斗者
     */
    private _selectedPlayerBattlerIndex: number = -1;
    /**
     * 当前的战斗场景
     */
    currentBattleScene: ProjectClientScene;
    /**
     * 战斗场景缓存
     */
    private battleSceneCaches: ProjectClientScene[] = [];
    /**
     * 鼠标over显示的状态id
     */
    private statusID: number;
    //------------------------------------------------------------------------------------------------------
    // 初始化
    //------------------------------------------------------------------------------------------------------
    /**
     * 构造函数
     */
    constructor() {
        super();
        // 隐藏参考用的显示对象
        this.background.image = "";
        // 当创建角色面板项时
        this.actorInfoList.on(UIList.ITEM_CREATE, this, this.onCreateActorPanelItem);
        this.actorInfoList.mouseEnabled = true;
    }
    /**
     * 初始化
     */
    init(): void {
        // -- 背景图设置
        this.background.image = GameBattle.enemyParty.background;
        // -- 创建角色面板
        this.initActorInfoList();
    }
    /**
     * 初始化角色面板
     */
    initActorInfoList(): void {
        let arr = [];
        for (let i = 0; i < Game.player.data.party.length; i++) {
            if (!GameBattle.playerBattlers[i]) {
                break;
            }
            let d = new ListItem_1025;
            d.data = Game.player.data.party[i];
            arr.push(d);
        }
        this.actorInfoList.items = arr;
    }
    //------------------------------------------------------------------------------------------------------
    // 战斗场景
    //------------------------------------------------------------------------------------------------------
    /**
     * 创建场景
     * @param onFin 创建完成时回调
     * @param enemyParty 敌方队伍数据
     */
    createBattleScene(onFin: Function, enemyParty: Module_Party): void {
        // 完成
        let onComplete = () => {
            this.battlerRoot.addChild(this.currentBattleScene.displayObject);
            this.currentBattleScene.mapSupportPause = false;
            this.currentBattleScene.startRender();
            onFin();
        }
        // picture
        if (enemyParty.battlerBgType == 0) {
            if (!this.battleSceneCaches[0]) this.battleSceneCaches[0] = this.createImageScene(Config.WINDOW_WIDTH, Config.WINDOW_HEIGHT, ProjectClientScene);
            this.currentBattleScene = this.battleSceneCaches[0];
            let bgLayer = this.currentBattleScene.getLayerByPreset(1);
            bgLayer.setBigImage(enemyParty.background);
            if (bgLayer['imgWidth']) bgLayer.scaleX = Config.WINDOW_WIDTH / bgLayer['imgWidth'];
            if (bgLayer['imgHeight']) bgLayer.scaleY = Config.WINDOW_HEIGHT / bgLayer['imgHeight'];
            bgLayer.dx = this.background.x;
            bgLayer.dy = this.background.y;
            bgLayer.visible = this.background.visible;
            bgLayer.alpha = this.background.alpha;
            this.battlerRoot.addChild(this.currentBattleScene.displayObject);
            onComplete.apply(this);
        }
        // scene
        else {
            if (!this.battleSceneCaches[enemyParty.battleScene]) {
                ClientScene.createScene(enemyParty.battleScene, null, Callback.New((scene: ProjectClientScene) => {
                    this.currentBattleScene = this.battleSceneCaches[enemyParty.battleScene] = scene;
                    this.battlerRoot.addChild(this.currentBattleScene.displayObject);
                    onComplete.apply(this);
                }, this), true);
            }
            else {
                this.currentBattleScene = this.battleSceneCaches[enemyParty.battleScene];
                this.battlerRoot.addChild(this.currentBattleScene.displayObject);
                onComplete.apply(this);
            }
        }
    }
    /**
     * 清理战斗场景
     */
    clearBattleScene(): void {
        // 清理旧的战斗场景
        if (this.currentBattleScene) {
            this.currentBattleScene.stopRender();
            this.battlerRoot.removeChild(this.currentBattleScene.displayObject);
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 获取
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取敌人战斗者参考
     * @param position 位置 0~N 
     * @return [UIAvatar] 
     */
    getRefEnemyBattlerUI(position: number): UIAvatar {
        return this["enemy" + position];
    }
    /**
     * 获取敌人战斗者空的位置
     */
    getEnemyPartyEmptyPostion(): number {
        for (let i = 0; i < 999; i++) {
            let inBattlefieldBattler = GameBattle.enemyBattlers[i];
            if (!inBattlefieldBattler) {
                let emptyBattler = this.getRefEnemyBattlerUI(i);
                if (emptyBattler) return i;
            }
        }
        return -1;
    }
    /**
     * 获取玩家战斗者参考
     * @param position 位置 0~N 
     * @return [UIAvatar] 
     */
    getRefPlayerBattlerUI(position: number): UIAvatar {
        return this["playerActor" + position];
    }
    /**
     * 获取敌人战斗者空的位置
     */
    getPlayerPartyEmptyPostion(): number {
        for (let i = 0; i < 999; i++) {
            let inBattlefieldBattler = GameBattle.playerBattlers[i];
            if (!inBattlefieldBattler) {
                let emptyBattler = this.getRefEnemyBattlerUI(i);
                if (emptyBattler) return i;
            }
        }
        return -1;
    }
    /**
     * 获取玩家战斗者
     */
    getPlayerBattler(position: number): Battler {
        return this.getRefPlayerBattlerUI(position).data.battler;
    }
    //------------------------------------------------------------------------------------------------------
    // 设置
    //------------------------------------------------------------------------------------------------------
    /**
     * 选中玩家战斗者的索引
     */
    set selectedPlayerBattlerIndex(v: number) {
        let lastSelectedPlayerBattle = this.selectedPlayerBattler;
        if (lastSelectedPlayerBattle) {
            GameCommand.startCommonCommand(14034, [], null, this.selectedPlayerBattler, this.selectedPlayerBattler);
        }
        this._selectedPlayerBattlerIndex = v;
        if (this.selectedPlayerBattler) {
            GameCommand.startCommonCommand(14033, [], null, this.selectedPlayerBattler, this.selectedPlayerBattler);
        }
    }
    get selectedPlayerBattlerIndex(): number {
        return this._selectedPlayerBattlerIndex;
    }
    /**
     * 选中玩家战斗者的索引根据战斗者对象
     */
    set selectedPlayerBattler(battler: Battler) {
        this.selectedPlayerBattlerIndex = GameBattle.playerBattlers.indexOf(battler);
    }
    get selectedPlayerBattler(): Battler {
        if (this._selectedPlayerBattlerIndex < 0) return null;
        return this.getPlayerBattler(this._selectedPlayerBattlerIndex);
    }
    //------------------------------------------------------------------------------------------------------
    // 刷新
    //------------------------------------------------------------------------------------------------------
    /**
     * 刷新玩家全部角色的面板
     */
    refreshPlayerActorPanel(): void {
        for (let i = 0; i < Game.player.data.party.length; i++) {
            this.refreshActorPanel(i);
        }
    }
    /**
     * 刷新角色面板
     * @param index 位置
     * @param isFirstRefresh [可选] 默认值=false 是否首次
     */
    refreshActorPanel(index: number, isFirstRefresh: boolean = false): void {
        let actorDS: DataStructure_inPartyActor = Game.player.data.party[index];
        let actor = actorDS.actor;
        let ui: GUI_1025 = this.actorInfoList.getItemUI(index) as any;
        if (ui && actorDS) {
            ui.hpText.text = actor.hp.toString();
            ui.spText.text = actor.sp.toString();
            ui.hpSlider.value = actor.hp * 100 / actor.MaxHP;
            ui.spSlider.value = actor.sp * 100 / actor.MaxSP;
            ui.actorName.text = actor.name;
            ui.actorLv.text = actorDS.lv.toString();
            ui.deadSign.visible = actor.dead;
            ui.actorFace.image = actor.face;
            ui.autoBattleBtn.visible = actor.AI;
            //刷新鼠标over状态
            if (this.statusID > 0) {
                var showStatus = ArrayUtils.matchAttributes(actor.status, { id: this.statusID }, true);
                if (showStatus.length <= 0) this.onHideStatusTips();
            }
            let stArr = [];
            for (let i = 0; i < actor.status.length; i++) {
                let status = actor.status[i];
                if (!status.icon) continue;
                let d = new ListItem_1026;
                d.icon = status.icon;
                d.layer = status.currentLayer == 1 ? "" : status.currentLayer.toString();
                d.data = status;
                stArr.push(d);
            }
            ui.statusList.mouseEnabled = true;
            ui.statusList.off(UIList.ITEM_CREATE, this, this.onActorStatusCreate);
            ui.statusList.on(UIList.ITEM_CREATE, this, this.onActorStatusCreate);
            ui.statusList.items = stArr;
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 内部实现
    //------------------------------------------------------------------------------------------------------
    /**
     * 创建玩家的战斗者面板项时
     * @param ui 玩家战斗者界面
     * @param data 项数据
     * @param index 索引
     */
    private onCreateActorPanelItem(ui: GUI_1025, data: ListItem_1025, index: number): void {
        this.refreshActorPanel(index, true);
        ui.autoBattleBtn.commandInputMessage = [index];
    }
    /**
     * 创建玩家战斗者面板的状态图标
     * @param ui 状态图标
     * @param data 项数据
     * @param index 索引
     */
    private onActorStatusCreate(ui: GUI_1026, data: ListItem_1026, index: number): void {
        ui.icon.on(EventObject.MOUSE_OVER, this, this.onShowStatusTips, [data.data]);
        ui.icon.on(EventObject.MOUSE_OUT, this, this.onHideStatusTips);
    }
    /**
     * 显示状态提示内容
     * @param status 
     */
    private onShowStatusTips(status: Module_Status): void {
        let tipsUI = GameUI.show(1033) as GUI_1033;
        tipsUI.tipsLabel.text = GUI_Manager.statusDesc(status);
        tipsUI.tipsLabel.height = tipsUI.tipsLabel.textHeight;
        tipsUI.tipsRoot.height = Math.max(tipsUI.tipsLabel.textHeight + 30 + tipsUI.tipsLabel.y, 80);
        tipsUI.x = stage.mouseX;
        tipsUI.y = stage.mouseY + 15;
        let maxWidth = Config.WINDOW_WIDTH - 5;
        if (tipsUI.x + tipsUI.tipsRoot.width > maxWidth) tipsUI.x = maxWidth - tipsUI.tipsRoot.width;
        let maxHeight = Config.WINDOW_HEIGHT - 15;
        if (tipsUI.y + tipsUI.tipsRoot.height > maxHeight) tipsUI.y = maxHeight - tipsUI.tipsRoot.height;
        this.statusID = status.id;
    }
    /**
     * 隐藏状态提示内容
     */
    private onHideStatusTips(): void {
        GameUI.hide(1033);
        this.statusID = 0;
    }
    /**
     * 创建图片场景
     * @param width 
     * @param height 
     * @param classObj 
     * @return [ProjectClientScene] 
     */
    private createImageScene(width: number, height: number, classObj: typeof ProjectClientScene): ProjectClientScene {
        // 创建空场景
        let scene = new classObj;
        scene["isSetScene"] = true;
        scene.id = 0;
        let mapData: any = {};
        mapData.width = width;
        mapData.height = height;
        mapData.dataLayers = [];
        mapData.LayerDatas = [{
            "dx": 0,
            "dy": 0,
            "scaleX": 1,
            "scaleY": 1,
            "skewX": 0,
            "skewY": 0,
            "xMove": 0,
            "yMove": 0,
            "prospectsPerX": 1,
            "prospectsPerY": 1,
            "xLoop": false,
            "yLoop": false,
            "opacity": 1,
            "blendMode": null,
            "drawMode": false,
            "tileData": [],
            "autoTileDataCache": [],
            "img": "",
            "showOnEditor": true,
            "rotation": 0,
            "modeType": false,
            "modeLock": false,
            "materialData": [
                {
                    "materials": []
                }
            ]
        }, { p: true }];
        scene.parse(mapData, Game["data"]);
        scene["install"](Callback.New(() => { }, scene));
        return scene;
    }
}