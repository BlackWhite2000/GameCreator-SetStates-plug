/**
 * 队伍编成
 * Created by 黑暗之神KDS on 2021-01-09 07:08:31.
 */
class GUI_Party extends GUI_16 {
    /**
     * 技能作用目标
     */
    static get skillSelectedActorIndex(): number {
        let partyUI = GameUI.get(16) as GUI_Party;
        if (partyUI) return partyUI.targetUI.actorList.selectedIndex;
        return 0;
    }
    /**
     * 选中的角色
     */
    static get skillActorIndex(): number {
        let partyUI = GameUI.get(16) as GUI_Party;
        if (partyUI) return partyUI.actorList.selectedIndex;
        return 0;
    }
    /**
     * 初始描述颜色
     */
    private descNameInitColor: string;
    /**
     * 构造函数
     */
    constructor() {
        super();
        // 记录初始描述的颜色
        this.descNameInitColor = this.descName.color;
        // 当显示该界面时触发的事件
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        // 当选中角色项时刷新角色数据
        this.actorList.on(EventObject.CHANGE, this, this.onActorListChange);
        // 当操作角色时
        this.actorList.on(UIList.ITEM_CLICK, this, this.onActorItemClick);
        // 标准化List
        GUI_Manager.standardList(this.actorList);
        GUI_Manager.standardList(this.actorEquipList);
        GUI_Manager.standardList(this.equipPackageList, false);
        GUI_Manager.standardList(this.actorSkillList, false);
        GUI_Manager.standardList(this.targetUI.actorList, false);
        // 当角色功能标签栏切换时
        this.actorPanelTab.on(EventObject.CHANGE, this, this.onActorPanelTabChange);
        // 当创建角色列表项时
        this.actorList.on(UIList.ITEM_CREATE, this, this.onCreateActorItem);
        // 当创建技能列表项时
        this.actorSkillList.on(UIList.ITEM_CREATE, this, this.onCreateActorSkillItem);
        // 当创建可装备栏项时（玩家背包中的装备）
        this.equipPackageList.on(UIList.ITEM_CREATE, this, this.onCreateEquipPackageItem);
        // 当技能栏选中项更改时
        this.actorSkillList.on(EventObject.CHANGE, this, this.onActorSkillChange);
        // 当技能栏确定时
        this.actorSkillList.on(UIList.ITEM_CLICK, this, this.onActorSkillClick);
        // 当角色装备栏选中项更改时
        this.actorEquipList.on(EventObject.CHANGE, this, this.onActorEquipChange);
        // 当角色装备栏确定时
        this.actorEquipList.on(UIList.ITEM_CLICK, this, this.onActorEquipItemClick);
        // 当玩家可装备栏选中项更改时
        this.equipPackageList.on(EventObject.CHANGE, this, this.onEquipPackageChage);
        // 当玩家可装备栏确定时
        this.equipPackageList.on(UIList.ITEM_CLICK, this, this.onEquipPackageItemClick);
        // 当目标角色窗口点击时
        this.targetUI.actorList.on(UIList.ITEM_CLICK, this, this.onTargetActorItemClick);
        // 当玩家AI设定更改时
        this.ai.on(EventObject.CHANGE, this, this.onChangeActorAI);
        // 按键
        stage.on(EventObject.KEY_DOWN, this, this.onKeyDown);
        // 鼠标激活列表
        GUI_Manager.regHitAreaFocusList(this.actorPanel, this.actorList, true, FocusButtonsManager.closeFocus);
        GUI_Manager.regHitAreaFocusList(this.skillPanel, this.actorSkillList);
        GUI_Manager.regHitAreaFocusList(this.actorEquipPanel, this.actorEquipList);
        GUI_Manager.regHitAreaFocusList(this.equipPackagePanel, this.equipPackageList, false);
        // 当列表焦点改变时事件
        EventUtils.addEventListenerFunction(UIList, UIList.EVENT_FOCUS_CHANGE, this.onListFocusChange, this);
        // 监听数据变化刷新
        EventUtils.addEventListenerFunction(Game, Game.EVENT_LEARN_SKILL, this.refreshActorSkillPanel, this);
        EventUtils.addEventListenerFunction(Game, Game.EVENT_FORGET_SKILL, this.refreshActorSkillPanel, this);
    }
    //------------------------------------------------------------------------------------------------------
    // 接口
    //------------------------------------------------------------------------------------------------------
    /**
     * 快捷键：返回
     */
    static onBack(): boolean {
        let uiParty = GameUI.get(16) as GUI_Party;
        // 关闭界面
        if (UIList.focus == uiParty.actorList) {
            return true;
        }
        // 回到技能界面
        else if (UIList.focus == uiParty.targetUI.actorList) {
            UIList.focus = uiParty.actorSkillList;
            return false;
        }
        // 回到角色装备界面
        else if (UIList.focus == uiParty.equipPackageList) {
            UIList.focus = uiParty.actorEquipList;
            // 刷新装备变更时的属性差预览
            uiParty.refreshPreEquipChangeInfo();
        }
        // 回到角色界面
        else if (UIList.focus != uiParty.actorList) {
            FocusButtonsManager.closeFocus();
            UIList.focus = uiParty.actorList;
        }
        // 刷新描述
        uiParty.refreshDescribe();
        return false;
    }
    /**
     * 解散选定的角色
     */
    static dissolutionPartyActor(): void {
        let uiParty = GameUI.get(16) as GUI_Party;
        if (!uiParty) return;
        if (!uiParty.selectedActorDS) return;
        if (Game.player.data.party.length == 1 || !uiParty.selectedActorDS.dissolutionEnabled) {
            GameAudio.playSE(WorldData.disalbeSE);
            return;
        }
        GameAudio.playSE(WorldData.sureSE);
        ProjectPlayer.removePlayerActorByInPartyIndex(uiParty.actorList.selectedIndex);
        uiParty.refreshActorList();
        FocusButtonsManager.closeFocus();
        UIList.focus = uiParty.actorList;
    }
    //------------------------------------------------------------------------------------------------------
    // 通常
    //------------------------------------------------------------------------------------------------------
    /**
     * 当按键按下时
     * @param e 
     */
    private onKeyDown(e: EventObject) {
        if (!this.stage) return;
        // 切换标签按键按下时切换对应的标签
        if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.L1)) {
            this.actorPanelTab.selectedIndex = Math.max(this.actorPanelTab.selectedIndex - 1, 0);
        }
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.R1)) {
            this.actorPanelTab.selectedIndex = Math.min(this.actorPanelTab.length - 1, this.actorPanelTab.selectedIndex + 1);
        }
    }
    /**
     * 当列表焦点改变时事件
     * @param lastFocus 上一个焦点
     * @param currentFocus 当前焦点
     */
    private onListFocusChange(lastFocus: UIList, currentFocus: UIList) {
        if (this.stage) {
            // 非选择目标窗口时关闭选择目标的窗口
            if (UIList.focus != this.targetUI.actorList) {
                this.targetUI.visible = false;
            }
            // 刷新焦点栏显示
            this.refreshFocusBarVisible();
            // 刷新装备变更时的属性差预览
            this.refreshPreEquipChangeInfo();
            // 刷新描述栏
            this.refreshDescribe();
            // 刷新焦点按钮
            if (UIList.focus == this.actorList) {
                FocusButtonsManager.closeFocus();
            }
        }
    }
    /**
     * 判断是否可在菜单中使用的技能
     * -- 未死亡 && 作用我方的技能 && 允许在菜单中使用 && 恢复类技能
     * @param skill 
     * @return [boolean] 
     */
    private isCanUsedInMenuSkill(skill: Module_Skill): boolean {
        if (!skill) return false;
        let actor = this.selectedActorDS.actor;
        return !actor.dead &&
            (skill.skillType != 2 && [0, 1, 3, 5].indexOf(skill.targetType) != -1 && skill.canUsedInMenu && skill.useDamage)
            && skill.costSP <= actor.sp && skill.costHP < actor.hp &&
            (skill.damageType == 3 || skill.damageType == 4)
    }
    //------------------------------------------------------------------------------------------------------
    // 角色列表
    //------------------------------------------------------------------------------------------------------
    /**
     * 当角色列表选中发生变更时
     * @param state state=0 表示selectedIndex改变，否则是overIndex
     */
    private onActorListChange(state: number) {
        // 忽略掉悬停时触发的CHANGE事件
        if (state != 0) return;
        this.refreshActorPanels(true);
    }
    /**
     * 确认操作该角色时处理
     */
    private onActorItemClick() {
        this.refreshOperactionActorFocus();
    }
    /**
     * 当角色功能标签栏切换时
     */
    private onActorPanelTabChange() {
        if (WorldData.selectSE) GameAudio.playSE(WorldData.selectSE);
        this.refreshOperactionActorFocus();
    }
    /**
     * 刷新操作角色焦点
     */
    private refreshOperactionActorFocus() {
        // 技能
        if (this.actorPanelTab.selectedIndex == 0) {
            UIList.focus = this.actorSkillList;
        }
        // 装备
        else if (this.actorPanelTab.selectedIndex == 1) {
            UIList.focus = this.actorEquipList;
        }
        // 设置
        else if (this.actorPanelTab.selectedIndex == 2) {
            UIList.focus = null;
            if (this.actorPanelTab.onChangeFragEvent)
                CommandPage.startTriggerFragmentEvent(this.actorPanelTab.onChangeFragEvent, Game.player.sceneObject, Game.player.sceneObject);
        }
        // 刷新描述
        this.refreshDescribe();
    }
    /**
     * 刷新焦点栏显示
     */
    private refreshFocusBarVisible() {
        this.actorSkillList.selectedImage.visible = UIList.focus == this.actorSkillList;
        this.actorEquipList.selectedImage.visible = UIList.focus == this.actorEquipList || UIList.focus == this.equipPackageList;
        this.equipPackageList.selectedImage.visible = UIList.focus == this.equipPackageList;
    }
    //------------------------------------------------------------------------------------------------------
    // 数据
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取当前选中的角色DS
     * @return [DataStructure_inPartyActor] 
     */
    private get selectedActorDS(): DataStructure_inPartyActor {
        let d = this.actorList.selectedItem as ListItem_1011;
        if (!d) return;
        let actorDS: DataStructure_inPartyActor = d.data;
        if (!actorDS) return;
        return actorDS;
    }
    //------------------------------------------------------------------------------------------------------
    // 初始化
    //------------------------------------------------------------------------------------------------------
    private onDisplay() {
        // 刷新队伍成员列表
        this.refreshActorList();
        // 焦点
        UIList.focus = this.actorList;
        // 刷新描述
        this.refreshDescribe();
        // 不显示装备属性变更预览
        this.attributeChangeBox.visible = false;
        // 刷新焦点栏显示
        this.refreshFocusBarVisible();
    }
    //------------------------------------------------------------------------------------------------------
    // 队伍成员
    //------------------------------------------------------------------------------------------------------
    /**
     * 当创建可装备的道具栏项时
     */
    private onCreateActorItem(ui: GUI_1011, data: ListItem_1011, index: number) {
        let actorDS: DataStructure_inPartyActor = data.data;
        if (actorDS) {
            ui.ai.visible = actorDS.actor.AI ? true : false;
            ui.deadSign.visible = actorDS.actor.dead ? true : false;
        }
    }
    /**
     * 刷新角色列表
     */
    private refreshActorList() {
        let arr = [];
        // 遍历我的队伍
        for (let i = 0; i < Game.player.data.party.length; i++) {
            // 获取角色DS格式数据
            let actorDS: DataStructure_inPartyActor = Game.player.data.party[i];
            // 获取角色模块数据
            let actor: Module_Actor = actorDS.actor;
            // 创建列表的项数据
            let d = new ListItem_1011;
            // 头像
            d.face = actor.face;
            // 绑定数据，以免后面直接访问
            d.data = actorDS;
            // 添加至数组中
            arr.push(d);
        }
        this.actorList.items = arr;
    }
    //------------------------------------------------------------------------------------------------------
    // 角色面板
    //------------------------------------------------------------------------------------------------------
    /**
     * 刷新角色面板
     * @param needRefreshPackage 需要刷新玩家背包（物品、装备）
     */
    private refreshActorPanels(needRefreshPlayerPackage: boolean) {
        // 获取角色数据
        let d = this.actorList.selectedItem as ListItem_1011;
        if (!d) return;
        let actorDS: DataStructure_inPartyActor = d.data;
        if (!actorDS) return;
        // 计算并刷新角色属性
        Game.refreshActorAttribute(actorDS.actor, actorDS.lv);
        // 刷新角色数据面板显示
        this.refreshActorDataPanel();
        // 刷新角色技能
        this.refreshActorSkillPanel();
        // 刷新角色装备
        this.refreshActorEquips();
        // 刷新角色设置
        this.refreshActorSetting();
        // 需要刷新玩家背包（物品、装备）的情况
        if (needRefreshPlayerPackage) {
            // 刷新可装备栏
            this.refreshEquipPackageList();
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 属性
    //------------------------------------------------------------------------------------------------------
    /**
     * 刷新角色数据面板
     */
    private refreshActorDataPanel() {
        let selectedActorDS = this.selectedActorDS;
        if (!selectedActorDS) return;
        let selectedActor = selectedActorDS.actor;
        // 基本信息
        this.actorBattler.avatarID = selectedActor.bttlerAvatar;
        this.actorName.text = selectedActor.name;
        this.smallAvatar.avatarID = selectedActor.avatar;
        let classData: Module_Class = GameData.getModuleData(7, selectedActor.class);
        this.actorClass.text = classData ? classData.name : "";
        this.classIcon.image = classData ? classData.icon : "";
        // 等级和经验
        if (selectedActor.growUpEnabled) {
            this.actorLv.text = "Lv." + selectedActorDS.lv;
            let nextExp = Game.getLevelUpNeedExp(selectedActor, selectedActorDS.lv);
            this.actorExpInfo.text = `${selectedActor.currentEXP}/${nextExp}`;
            this.actorExpSlider.value = selectedActor.currentEXP * 100 / nextExp;
        }
        else {
            this.actorLv.text = "-----";
            this.actorExpInfo.text = "-----";
            this.actorExpSlider.value = 100;
        }
        // 属性
        this.atk.text = selectedActor.ATK.toString();
        this.def.text = selectedActor.DEF.toString();
        this.agi.text = selectedActor.AGI.toString();
        this.mag.text = selectedActor.MAG.toString();
        this.magDef.text = selectedActor.MagDef.toString();
        this.pow.text = selectedActor.POW.toString();
        this.end.text = selectedActor.END.toString();
        this.actionSpeed.text = selectedActor.ActionSpeed.toString();
        this.hit.text = selectedActor.HIT.toString();
        this.crit.text = selectedActor.CRIT.toString();
        this.magCrit.text = selectedActor.MagCrit.toString();
        this.dod.text = selectedActor.DOD.toString();
        this.refreshActorDataPanelEnergyValue();
    }
    /**
     * 刷新角色数据-能量类数值
     */
    private refreshActorDataPanelEnergyValue() {
        let selectedActorDS = this.selectedActorDS;
        if (!selectedActorDS) return;
        let selectedActor = selectedActorDS.actor;
        this.maxHP.text = selectedActor.hp + "/" + selectedActor.MaxHP.toString();
        this.maxSP.text = selectedActor.sp + "/" + selectedActor.MaxSP.toString();
    }
    //------------------------------------------------------------------------------------------------------
    // 角色面板-技能
    //------------------------------------------------------------------------------------------------------
    /**
     * 当创建技能栏项时
     */
    private onCreateActorSkillItem(ui: GUI_1013, data: ListItem_1013, index: number) {
        let skill: Module_Skill = data.data;
        if (!skill) return;
        ui.icon.alpha = this.isCanUsedInMenuSkill(skill) ? 1 : 0.3;
    }
    /**
     * 刷新角色技能面板
     */
    private refreshActorSkillPanel() {
        let selectedActorDS = this.selectedActorDS;
        if (!selectedActorDS) return;
        let arr = [];
        // 遍历角色的技能
        for (let i = 0; i < selectedActorDS.actor.skills.length; i++) {
            // 获取背包的道具DS格式
            let skill: Module_Skill = selectedActorDS.actor.skills[i];
            // 如果没有技能图标忽略显示
            if (!skill.icon) continue;
            // 创建对应的背包物品项数据，该项数据由系统自动生成
            let d = new ListItem_1013;
            // 绑定项数据，项显示对象会自动根据项数据设置对应的值，参考UIList.api头部注释（CTRL+SHIFT+R搜索UIList.api）
            d.data = skill; // 项数据记录对应的技能，以便能够通过项数据找到其对应的技能
            d.icon = skill.icon; // 设置图标
            d.skillName = skill.name; // 设置技能名称
            arr.push(d);
        }
        this.actorSkillList.items = arr;
    }
    /**
     * 当技能选中发生改变时处理
     */
    private onActorSkillChange() {
        this.refreshDescribe();
    }
    /**
     * 当角色装备栏确定时
     */
    private onActorSkillClick(): void {
        if (!this.actorSkillList.selectedItem) return;
        let skill: Module_Skill = this.actorSkillList.selectedItem.data;
        if (!this.isCanUsedInMenuSkill(skill)) {
            GameAudio.playSE(WorldData.disalbeSE);
            return;
        }
        // 单体目标、多体目标：弹出窗口
        if (!(skill.targetType == 0 || skill.targetType == 3)) {
            this.startSelectTarget();
        }
        // 使用者、全体目标：直接使用
        else {
            this.onUseSkill();
        }
    }
    /**
      * 开始选择目标
      */
    private startSelectTarget() {
        // 播放确定音效
        GameAudio.playSE(WorldData.sureSE);
        // 打开目标窗口
        this.targetUI.visible = true;
        // 刷新目标窗口数值显示
        this.targetUI.refreshTargetPanel();
        // 焦点指向目标窗口的角色列表
        UIList.focus = this.targetUI.actorList;
    }
    /**
     * 当角色项确认时：使用技能
     */
    private onTargetActorItemClick() {
        // 使用技能
        this.onUseSkill();
    }
    /**
     * 当使用技能时
     */
    private onUseSkill(): void {
        let skill: Module_Skill = this.actorSkillList.selectedItem?.data;
        if (!skill) return;
        // 不再允许使用的情况
        if (!this.isCanUsedInMenuSkill(skill)) {
            GameAudio.playSE(WorldData.disalbeSE);
            return;
        }
        let fromActorDS = this.selectedActorDS;
        // 恢复的生命值
        let restoreHP = skill.damageType == 3 ? skill.damageValue : 0;
        let restoreSP = skill.damageType == 4 ? skill.damageValue : 0;
        // 技能使用者
        if (skill.targetType == 0) {
            if ((skill.applyDeadBattler && !fromActorDS.actor.dead) || (!skill.applyDeadBattler && fromActorDS.actor.dead)) {
                GameAudio.playSE(WorldData.disalbeSE);
                return;
            }
            if (skill.useEvent) CommandPage.startTriggerFragmentEvent(skill.useEvent, Game.player.sceneObject, Game.player.sceneObject);
            this.useSkillOnOneTarget(skill, fromActorDS, restoreHP, restoreSP);
        }
        // 队友单体 && 队友多体
        else if (skill.targetType == 1 || skill.targetType == 5) {
            let targetActorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(this.targetUI.actorList.selectedIndex);
            if ((skill.applyDeadBattler && !targetActorDS.actor.dead) || (!skill.applyDeadBattler && targetActorDS.actor.dead)) {
                GameAudio.playSE(WorldData.disalbeSE);
                return;
            }
            if (skill.useEvent) CommandPage.startTriggerFragmentEvent(skill.useEvent, Game.player.sceneObject, Game.player.sceneObject);
            this.useSkillOnOneTarget(skill, targetActorDS, restoreHP, restoreSP);
            // 其他多个目标
            if (skill.targetType == 5 && skill.targetNum > 1) {
                // -- 排除已作用的目标
                let partyClone = Game.player.data.party.concat();
                ArrayUtils.remove(partyClone, targetActorDS);
                // -- 作用死亡或者非死亡
                for (let i = 0; i < partyClone.length; i++) {
                    if ((skill.applyDeadBattler && !partyClone[i].actor.dead) || (!skill.applyDeadBattler && partyClone[i].actor.dead)) {
                        partyClone.splice(i, 1);
                        i--;
                    }
                }
                // -- 恢复生命值/魔法值优先比例更低的
                partyClone.sort((a, b) => {
                    if (skill.damageType == 3) return (a.actor.hp / a.actor.MaxHP) < (b.actor.hp / b.actor.MaxHP) ? -1 : 1;
                    else return (a.actor.sp / a.actor.MaxSP) < (b.actor.sp / b.actor.MaxSP) ? -1 : 1;
                })
                // -- 开始作用
                for (let i = 0; i < skill.targetNum - 1; i++) {
                    let targetActorDS = partyClone[i];
                    if (!targetActorDS) break;
                    this.useSkillOnOneTarget(skill, targetActorDS, restoreHP, restoreSP);
                }
            }
        }
        // 队友全体
        else if (skill.targetType == 3) {
            let used = false;
            for (let i = 0, k = 0; i < Game.player.data.party.length; i++) {
                let targetActorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(i);
                if ((skill.applyDeadBattler && targetActorDS.actor.dead) || (!skill.applyDeadBattler && !targetActorDS.actor.dead)) {
                    if (skill.useEvent && k == 0) {
                        k++;
                        CommandPage.startTriggerFragmentEvent(skill.useEvent, Game.player.sceneObject, Game.player.sceneObject);
                    }
                    this.useSkillOnOneTarget(skill, targetActorDS, restoreHP, restoreSP);
                    used = true;
                }
            }
            if (!used) {
                GameAudio.playSE(WorldData.disalbeSE);
                return;
            }
        }
        // 音效
        if (skill.menuSE) GameAudio.playSE(skill.menuSE);
        // 消耗
        fromActorDS.actor.sp -= skill.costSP;
        fromActorDS.actor.hp -= skill.costHP;
        Game.refreshActorAttribute(fromActorDS.actor, fromActorDS.lv);
        // 刷新界面
        this.refreshActorPanels(false);
        this.targetUI.refreshTargetPanel();
        if (skill.applyDeadBattler) this.refreshActorList();
    }
    /**
     * 使用技能在指定的目标上
     */
    private useSkillOnOneTarget(skill: Module_Skill, targetActorDS: DataStructure_inPartyActor, restoreHP: number, restoreSP: number) {
        if (!targetActorDS || !skill) return;
        // -- 复活
        if (skill.applyDeadBattler && restoreHP > 0 && targetActorDS.actor.dead) {
            targetActorDS.actor.dead = false;
        }
        // -- 恢复
        if (!targetActorDS.actor.dead) {
            targetActorDS.actor.hp += restoreHP;
            targetActorDS.actor.sp += restoreSP;
        }
        // -- 菜单中的作用目标动画
        if (skill.menuHitAnimation) {
            let targetInPartyIndex = Game.player.data.party.indexOf(targetActorDS);
            if (targetInPartyIndex != -1) {
                let targetItemUI: GUI_1015 = this.targetUI.actorList.getItemUI(targetInPartyIndex) as any;
                let ani = new GCAnimation();
                ani.id = skill.menuHitAnimation;
                let lx = targetItemUI.actorFace.width / 2;
                let ly = targetItemUI.actorFace.height / 2;
                let globalPos = targetItemUI.actorFace.localToGlobal(new Point(lx, ly));
                let localPos = this.targetUI.globalToLocal(globalPos);
                ani.x = localPos.x;
                ani.y = localPos.y;
                this.targetUI.addChild(ani);
                ani.once(GCAnimation.PLAY_COMPLETED, this, () => {
                    ani.dispose();
                });
                ani.play();
            }
        }
        // -- 目标事件
        if (skill.hitEvent)
            CommandPage.startTriggerFragmentEvent(skill.hitEvent, Game.player.sceneObject, Game.player.sceneObject);
        // -- 刷新属性
        Game.refreshActorAttribute(targetActorDS.actor, targetActorDS.lv);
    }
    //------------------------------------------------------------------------------------------------------
    // 角色面板-装备
    //------------------------------------------------------------------------------------------------------
    /**
     * 当创建可装备的背包道具栏项时
     */
    private onCreateEquipPackageItem(ui: GUI_1014, data: ListItem_1014, index: number) {
        let equipDS: DataStructure_packageItem = data.data;
        if (equipDS) {
            ui.unequipBtn.visible = false;
            ui.equipBox.visible = true;
            ui.itemName.color = GUI_Manager.getEquipNameColorByInstance(equipDS.equip);
        }
        else {
            ui.unequipBtn.visible = true;
            ui.equipBox.visible = false;
        }
    }
    /**
     * 刷新角色装备
     */
    private refreshActorEquips() {
        let selectedActorDS = this.selectedActorDS;
        if (!selectedActorDS) return;
        let arr = [];
        let lastSelectedIndex = this.actorEquipList.selectedIndex;
        if (lastSelectedIndex == -1) lastSelectedIndex = 0;
        // 遍历部件
        let equipPartsLength = GameData.getLength(19, 1);
        for (let i = 1; i <= equipPartsLength; i++) {
            let equip: Module_Equip = Game.getActorEquipByPartID(selectedActorDS.actor, i);
            // 创建对应的背包物品项数据，该项数据由系统自动生成
            let d = new ListItem_1012;
            // 该部件存在装备的情况下
            if (equip) {
                d.data = equip;
                d.icon = equip.icon;
            }
            else {
                d.icon = "";
            }
            d.partName = GameData.getModuleData(19, i).name;
            arr.push(d);
        }
        this.actorEquipList.items = arr;
        this.actorEquipList.selectedIndex = lastSelectedIndex;
    }
    /**
     * 刷新可装备列表
     * -- 进入编成界面时刷新
     * -- 携带/卸下装备时刷新
     */
    private refreshEquipPackageList() {
        let selectedActorDS = this.selectedActorDS;
        if (!selectedActorDS) return;
        let equipSelectIndex = this.actorEquipList.selectedIndex;
        if (equipSelectIndex < 0) return;
        let partID = equipSelectIndex + 1;
        // 筛选出背包的全部装备
        let allEquips: DataStructure_packageItem[] = ArrayUtils.matchAttributes(Game.player.data.package, { isEquip: true }, false) as any;
        // 筛选出指定部件的装备
        let partEquips: DataStructure_packageItem[] = ArrayUtils.matchAttributesD2(allEquips, "equip", { partID: partID }, false);
        // 筛选出可职业可佩带的装备
        let classID = selectedActorDS.actor.class;
        let classData: Module_Class = GameData.getModuleData(7, classID);
        if (!classData) return;
        for (let i = 0; i < partEquips.length; i++) {
            if (classData.equipSetting.indexOf(partEquips[i].equip.type) == -1) {
                partEquips.splice(i, 1);
                i--;
            }
        }
        // 刷新可装备的列表
        let items = [new ListItem_1014];
        for (let i = 0; i < partEquips.length; i++) {
            let d = new ListItem_1014;
            let packageEquip: DataStructure_packageItem = partEquips[i];
            d.data = packageEquip;
            d.itemName = packageEquip.equip.name;
            d.icon = packageEquip.equip.icon;
            d.itemNum = "x" + packageEquip.number;
            items.push(d);
        }
        this.equipPackageList.items = items;
    }
    /**
     * 当角色装备栏选项发生改变时
     */
    private onActorEquipChange(): void {
        // 刷新可佩戴的装备列表
        this.refreshEquipPackageList();
        // 刷新描述
        this.refreshDescribe();
    }
    /**
     * 当角色装备栏确定时
     */
    private onActorEquipItemClick(): void {
        // 焦点设置为可装备栏
        UIList.focus = this.equipPackageList;
        // 刷新描述
        this.refreshDescribe();
        // 刷新装备变更时的属性差预览
        this.refreshPreEquipChangeInfo();
    }
    /**
     * 当可装备栏选项发生改变时
     */
    private onEquipPackageChage(): void {
        // 刷新描述
        this.refreshDescribe();
        // 刷新装备变更时的属性差预览
        this.refreshPreEquipChangeInfo();
    }
    /**
     * 当可装备栏确定时
     */
    private onEquipPackageItemClick(): void {
        let selectedActorDS = this.selectedActorDS;
        let actor = selectedActorDS.actor;
        let index = this.equipPackageList.selectedIndex;
        let actorInPartyIndex = this.actorList.selectedIndex;
        let equipPartID = this.actorEquipList.selectedIndex + 1;
        // 卸下
        if (index == 0) {
            let takeOffEuqip = ProjectPlayer.takeOffPlayerActorEquipByPartID(actorInPartyIndex, equipPartID);
            if (takeOffEuqip) GameAudio.playSE(ClientWorld.data.unequipSE);
            else GameAudio.playSE(ClientWorld.data.disalbeSE);
        }
        else {
            let res: { success: boolean, takeOffEquip: Module_Equip };
            let itemData = this.equipPackageList.selectedItem;
            let equipDS = itemData.data as DataStructure_packageItem;
            if (equipDS && equipDS.equip) {
                let equip = equipDS.equip;
                res = ProjectPlayer.wearPlayerActorEquip(actorInPartyIndex, equip);
            }
            if (res.success) GameAudio.playSE(ClientWorld.data.equipSE);
            else GameAudio.playSE(ClientWorld.data.disalbeSE);
        }
        // 计算并刷新角色属性
        Game.refreshActorAttribute(actor, selectedActorDS.lv);
        // 刷新角色属性显示
        this.refreshActorDataPanel();
        // 刷新列表
        this.refreshActorEquips();
        this.refreshEquipPackageList();
        // 焦点回到角色装备栏
        UIList.focus = this.actorEquipList;
        // 刷新装备更换预览
        this.refreshPreEquipChangeInfo();
        // 刷新描述
        this.refreshDescribe();
    }
    /**
     * 刷新装备变更时的属性差预览
     */
    private refreshPreEquipChangeInfo(): void {
        if (UIList.focus == this.equipPackageList) {
            let actor = this.selectedActorDS.actor;
            this.attributeChangeBox.visible = true;
            // 计算更换装备的属性变更预览
            let previewChangeEquipDS: DataStructure_packageItem = this.equipPackageList.selectedItem.data;
            let previewChangeEquip = previewChangeEquipDS ? previewChangeEquipDS.equip : null;
            let previewChangeEquipIndex = this.actorEquipList.selectedIndex;
            let previewChangeEquipID = previewChangeEquipIndex + 1;
            let attributeRes = Game.clacActorAttribute(actor, this.selectedActorDS.lv, true, previewChangeEquipID, previewChangeEquip);
            // 属性变更显示
            this.setEquipChangePreviewAttributeLabel(this.atkChange, attributeRes.ATK - actor.ATK);
            this.setEquipChangePreviewAttributeLabel(this.defChange, attributeRes.DEF - actor.DEF);
            this.setEquipChangePreviewAttributeLabel(this.dodChange, attributeRes.DOD - actor.DOD);
            this.setEquipChangePreviewAttributeLabel(this.maxHPChange, attributeRes.MaxHP - actor.MaxHP);
            this.setEquipChangePreviewAttributeLabel(this.maxSPChange, attributeRes.MaxSP - actor.MaxSP);
            this.setEquipChangePreviewAttributeLabel(this.powChange, attributeRes.POW - actor.POW);
            this.setEquipChangePreviewAttributeLabel(this.magChange, attributeRes.MAG - actor.MAG);
            this.setEquipChangePreviewAttributeLabel(this.magDefChange, attributeRes.MagDef - actor.MagDef);
            this.setEquipChangePreviewAttributeLabel(this.hitChange, attributeRes.HIT - actor.HIT);
            this.setEquipChangePreviewAttributeLabel(this.critChange, attributeRes.CRIT - actor.CRIT);
            this.setEquipChangePreviewAttributeLabel(this.magCritChange, attributeRes.MagCrit - actor.MagCrit);
            this.setEquipChangePreviewAttributeLabel(this.actionSpeedChange, attributeRes.ActionSpeed - actor.ActionSpeed);
            this.setEquipChangePreviewAttributeLabel(this.endChange, attributeRes.END - actor.END);
            this.setEquipChangePreviewAttributeLabel(this.agiChange, attributeRes.AGI - actor.AGI);
        }
        else {
            this.attributeChangeBox.visible = false;
        }
    }
    /**
     * 设置属性变更颜色和文本显示
     * @param label 
     * @param changeValue 
     */
    private setEquipChangePreviewAttributeLabel(label: UIString, changeValue: number): void {
        label.visible = changeValue != 0;
        if (changeValue > 0) {
            label.color = "#00ff00";
            label.text = "+" + changeValue.toString();
        }
        else if (changeValue < 0) {
            label.color = "#ff0000";
            label.text = changeValue.toString();
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 角色面板-设置
    //------------------------------------------------------------------------------------------------------
    /**
     * 刷新角色
     */
    refreshActorSetting() {
        let selectedActorDS = this.selectedActorDS;
        if (!selectedActorDS) return;
        this.ai.selected = selectedActorDS.actor.AI;
        this.dissolutionBox.visible = this.dissolutionBtn.visible = selectedActorDS.dissolutionEnabled;
    }
    /**
     * 更改角色AI
     */
    onChangeActorAI(): void {
        let selectedActorDS = this.selectedActorDS;
        if (!selectedActorDS) return;
        selectedActorDS.actor.AI = this.ai.selected;
        let actorItemUI = this.actorList.getItemUI(this.actorList.selectedIndex);
        // 刷新角色列表的单项（此处优化，无需刷新全部列表）
        this.onCreateActorItem(actorItemUI as GUI_1011, this.actorList.selectedItem as ListItem_1011, this.actorList.selectedIndex);
    }
    //------------------------------------------------------------------------------------------------------
    // 描述
    //------------------------------------------------------------------------------------------------------
    /**
     * 刷新描述
     */
    private refreshDescribe(): void {
        let name = "";
        let desc = "";
        this.descName.color = this.descNameInitColor;
        // 焦点在技能栏的情况下
        if (UIList.focus == this.actorSkillList) {
            let itemData = this.actorSkillList.selectedItem;
            let skill = itemData?.data as Module_Skill;
            if (skill) {
                name = skill.name;
                desc = GUI_Manager.skillDesc(skill, this.selectedActorDS.actor);
            }
        }
        // 焦点在装备栏的情况下
        else if (UIList.focus == this.actorEquipList) {
            let equip: Module_Equip = this.actorEquipList.selectedItem?.data;
            if (equip) {
                name = equip.name;
                desc = GUI_Manager.equipDesc(equip);
                this.descName.color = GUI_Manager.getEquipNameColorByInstance(equip);
            }
        }
        // 焦点在可装备栏的情况下
        else if (UIList.focus == this.equipPackageList) {
            let itemData = this.equipPackageList.selectedItem;
            let equipDS = itemData?.data as DataStructure_packageItem;
            if (equipDS && equipDS.equip) {
                let equip = equipDS.equip;
                name = equip.name;
                desc = GUI_Manager.equipDesc(equip);
                this.descName.color = GUI_Manager.getEquipNameColorByInstance(equip);
            }
        }
        this.descName.text = name;
        this.descText.text = desc;
        this.descText.height = this.descText.textHeight;
        this.descRoot.refresh();
    }
}