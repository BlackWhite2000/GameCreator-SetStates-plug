/**
 * 奖励界面
 * Created by 黑暗之神KDS on 2021-02-09 05:26:33.
 */
class GUI_Reward extends GUI_27 {
    /**
     * 角色增加经验值，升级等的信息
     */
    static increaseExpResArr: { isLevelUp: boolean, fromLv: number, toLv: number, fromExp: number, toExp: number, learnSkills: Module_Skill[] }[];
    private getExpAnimationTask = "getExpAnimationTask";
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        this.dropItemList.on(UIList.ITEM_CREATE, this, this.onCreateDropItemListDisplayItem);
        this.actorList.on(UIList.ITEM_CREATE, this, this.onCreateActorItem);
    }
    /**
     * 当界面显示时
     */
    private onDisplay() {
        this.skillBlock.visible = false;
        this.taskShowGetItems();
        this.taskShowGetExp();
        this.taskShowLearnSkills();
        this.taskCloseUI();
    }
    /**
     * 当创建角色项时
     * @param ui 角色项对应的界面 
     * @param data 角色项数据
     * @param index 所在位置索引
     */
    private onCreateActorItem(ui: GUI_1032, data: ListItem_1032, index: number) {
        let actorDS = Game.player.data.party[index];
        let battler = GameBattle.playerBattlers[index];
        ui.deadSign.visible = battler.isDead;
    }
    /**
     * 当创建掉落道具/装备项时
     * @param ui 掉落道具/装备项界面
     * @param data 掉落道具/装备项数据
     * @param index 
     */
    private onCreateDropItemListDisplayItem(ui: GUI_1029, data: ListItem_1029, index: number) {
        let goodsInfo = data.data;
        let isEquip = goodsInfo[0];
        ui.itemNumLabel.visible = !isEquip;
        ui.itemNum.visible = !isEquip;
    }
    //------------------------------------------------------------------------------------------------------
    // 
    //------------------------------------------------------------------------------------------------------
    /**
     * 显示获得的道具
     */
    private taskShowGetItems(): void {
        // 显示金币和经验值
        this.getExp.text = GameBattleData.rewardRecord.exp.toString();
        this.getGold.text = GameBattleData.rewardRecord.gold.toString();
        // 系那是掉落物品
        let dropItems = GameBattleData.rewardRecord.items;
        let dropEquips = GameBattleData.rewardRecord.equips;
        if (dropItems.length == 0 && dropEquips.length == 0) {
            this.dropItemList.items = [];
            return;
        }
        let arr = [];
        for (let i = 0; i < dropItems.length; i++) {
            let dropItemInfo = dropItems[i];
            let dropItem: Module_Item = GameData.getModuleData(1, dropItemInfo.itemID);
            let d = new ListItem_1029;
            d.data = [false, dropItem];
            d.icon = dropItem.icon;
            d.itemNum = dropItemInfo.num.toString();
            arr.push(d);
        }
        for (let i = 0; i < dropEquips.length; i++) {
            let dropEquip = dropEquips[i];
            let d = new ListItem_1029;
            d.data = [true, dropEquip];
            d.icon = dropEquip.icon;
            d.itemNum = "1";
            arr.push(d);
        }
        this.dropItemList.items = arr;
        new SyncTask(this.getExpAnimationTask, () => {
            SyncTask.taskOver(this.getExpAnimationTask);
        });
    }
    /**
     * 显示经验值
     */
    private taskShowGetExp(): void {
        // 显示玩家队伍的角色
        let arr = [];
        let actorIncreaseExpRes
        for (let i = 0; i < Game.player.data.party.length; i++) {
            if (!GameBattle.playerBattlers[i]) break;
            let actorDS = Game.player.data.party[i];
            let actor = actorDS.actor;
            let actorClass: Module_Class = GameData.getModuleData(7, actor.class);
            actorIncreaseExpRes = GUI_Reward.increaseExpResArr[i];
            let d = new ListItem_1032;
            d.actorFace = actor.face;
            d.actorName = actor.name;
            d.classIcon = actorClass?.icon;
            arr.push(d);
        }
        this.actorList.items = arr;
        // 播放获得经验值的效果（角色同步播放，所有角色播放完毕后出现）
        new SyncTask(this.getExpAnimationTask);
        // 记录有多少个角色需要播放经验值增长动画
        let actorIncreaseExpAnimationCount = 0;
        for (let i = 0; i < Game.player.data.party.length; i++) {
            if (!GameBattle.playerBattlers[i]) break;
            let singleActorTask = "increaseActorExpTask" + i;
            let actorDS = Game.player.data.party[i];
            let actor = actorDS.actor;
            actorIncreaseExpRes = GUI_Reward.increaseExpResArr[i];
            let actorUI = this.actorList.getItemUI(i) as GUI_1032;
            // 非成长角色
            if (!actor.growUpEnabled) {
                actorUI.lvBox.visible = false;
                actorUI.actorExp.text = "";
                actorUI.expSlider.value = 100;
                continue;
            }
            // 如果没有经验值获得的话
            if (!actorIncreaseExpRes) {
                let needExp = Game.getLevelUpNeedExp(actor, actorDS.lv);
                actorUI.lvBox.visible = true;
                actorUI.actorLv.text = actorDS.lv.toString();
                actorUI.actorExp.text = `${actor.currentEXP}/${needExp}`;
                actorUI.expSlider.value = actor.currentEXP * 100 / needExp;
                continue;
            }
            // 需要播放
            actorIncreaseExpAnimationCount++;
            // 遍历升级数（一次奖励可能多次升级）
            for (let lv = actorIncreaseExpRes.fromLv; lv <= actorIncreaseExpRes.toLv; lv++) {
                // 获取当前等级和需要的经验
                let thisLvStartExp: number;
                if (lv == actorIncreaseExpRes.fromLv) {
                    thisLvStartExp = actorIncreaseExpRes.fromExp;
                }
                else {
                    thisLvStartExp = 0;
                }
                let thisLvEndExp: number;
                let thisLvNeedExp: number = Game.getLevelUpNeedExp(actor, lv);
                if (lv == actorIncreaseExpRes.toLv) {
                    thisLvEndExp = actorIncreaseExpRes.toExp;
                }
                else {
                    thisLvEndExp = thisLvNeedExp;
                }
                // 播放经验增长动画效果
                new SyncTask(singleActorTask, (singleActorTask: string, actorIndex: number, lv: number, thisLvStartExp: number, thisLvEndExp: number, thisLvNeedExp: number) => {
                    let actorDS = Game.player.data.party[actorIndex];
                    let actor = actorDS.actor;
                    let actorClass: Module_Class = GameData.getModuleData(7, actor.class);
                    let actorIncreaseExpRes = GUI_Reward.increaseExpResArr[actorIndex];
                    let actorUI = this.actorList.getItemUI(actorIndex) as GUI_1032;
                    let battler = GameBattle.playerBattlers[actorIndex];
                    actorUI.actorLv.text = lv.toString();
                    actorUI.expSlider.value = thisLvStartExp * 100 / thisLvNeedExp;
                    let toValue = thisLvEndExp * 100 / thisLvNeedExp;
                    // -- 播放升级动画
                    if (lv != actorIncreaseExpRes.fromLv) {
                        battler.playAnimation(44, false, true);
                        if (actor.levelUpEvent) CommandPage.startTriggerFragmentEvent(actor.levelUpEvent, battler, battler);
                        if (actorClass && actorClass.levelUpEvent) CommandPage.startTriggerFragmentEvent(actorClass.levelUpEvent, battler, battler);
                    }
                    // -- 播放经验值条增长动效
                    Tween.to(actorUI.expSlider, { value: toValue }, 1000, null, Callback.New(() => {
                        SyncTask.taskOver(singleActorTask);
                    }, this));
                    // -- 播放经验值数值更改动效
                    let _currentExp = thisLvStartExp;
                    let expTextObj = {
                        get value() {
                            return _currentExp;
                        },
                        set value(v: number) {
                            _currentExp = v;
                            actorUI.actorExp.text = Math.floor(v) + "/" + thisLvNeedExp;
                        }
                    }
                    Tween.to(expTextObj, { value: thisLvEndExp }, 1000);
                }, [singleActorTask, i, lv, thisLvStartExp, thisLvEndExp, thisLvNeedExp]);
            }
            // 可能存在singleActorTask任务，该任务为结尾任务，这样如果前面存在任务的话则会等待前面的任务执行完毕
            new SyncTask(singleActorTask, (singleActorTask: string) => {
                SyncTask.taskOver(singleActorTask);
                actorIncreaseExpAnimationCount--;
                if (actorIncreaseExpAnimationCount == 0) {
                    SyncTask.taskOver(this.getExpAnimationTask);
                }
            }, [singleActorTask]);
        }
        // 如果不存在经验任务的话则忽略
        if (actorIncreaseExpAnimationCount == 0) {
            SyncTask.taskOver(this.getExpAnimationTask);
        }
    }
    /**
     * 学习技能
     */
    private taskShowLearnSkills(): void {
        // 遍历队伍
        for (let i = 0; i < Game.player.data.party.length; i++) {
            if (!GameBattle.playerBattlers[i]) break;
            new SyncTask(this.getExpAnimationTask, (i: number) => {
                // -- 获取角色
                let actorDS = Game.player.data.party[i];
                let actor = actorDS.actor;
                let actorIncreaseExpRes = GUI_Reward.increaseExpResArr[i];
                // -- 显示习得的技能
                if (actorIncreaseExpRes) {
                    let learnSkills = actorIncreaseExpRes.learnSkills;
                    if (learnSkills.length != 0) {
                        this.skillBlock.visible = true;
                        this.learnSkillActorFace.image = actor.face;
                        this.learnSkillText.text = `${WorldData.word_learnSkill}`;
                        let arr = [];
                        for (let i = 0; i < learnSkills.length; i++) {
                            let learnSkill = learnSkills[i];
                            let d = new ListItem_1030;
                            d.data = learnSkill;
                            d.icon = learnSkill.icon;
                            arr.push(d);
                        }
                        this.learnSkillList.items = arr;
                        // -- 延迟结束任务
                        setTimeout(() => {
                            this.skillBlock.visible = false;
                            setTimeout(() => {
                                SyncTask.taskOver(this.getExpAnimationTask);
                            }, 200);
                        }, 1500);
                        return;
                    }
                }
                // -- 没有习得的技能时
                this.learnSkillList.items = [];
                SyncTask.taskOver(this.getExpAnimationTask);
            }, [i]);
        }
    }
    /**
     * 关闭界面
     */
    private taskCloseUI(): void {
        new SyncTask(this.getExpAnimationTask, () => {
            setTimeout(() => {
                SyncTask.taskOver(this.getExpAnimationTask);
                GameUI.hide(this.guiID);
            }, WorldData.battleRewardStayTime * 1000);
        });
    }
}