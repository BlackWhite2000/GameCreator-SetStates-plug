/**
 * 战斗者的状态
 * Created by 黑暗之神KDS on 2021-01-26 14:30:15.
 */
class GUI_BattlerStatus extends GUI_26 {
    constructor() {
        super();
        this.on(EventObject.DISPLAY, this, this.onDisplay);
    }
    /**
     * 当界面显示时
     */
    private onDisplay() {
        this.refreshActorDataPanel();
        this.refreshStatus();
    }

    /**
     * 刷新角色数据面板
     */
    private refreshActorDataPanel() {
        let battler = GameBattleController.currentOperationBattler;
        if (!battler) return;
        let selectedActor = battler.actor;
        let lv = GameBattleHelper.getLevelByActor(selectedActor);
        // 基本信息
        this.smallAvatar.avatarID = selectedActor.avatar;
        this.actorFace.image = selectedActor.face;
        this.actorName.text = selectedActor.name;
        let classData: Module_Class = GameData.getModuleData(7, selectedActor.class);
        this.actorClass.text = classData ? classData.name : "";
        this.classIcon.image = classData ? classData.icon : "";
        // 等级和经验
        if (selectedActor.growUpEnabled) {
            this.actorLv.text = "LV." + lv;
            let nextExp = Game.getLevelUpNeedExp(selectedActor, lv);
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
        this.crit.text = selectedActor.CRIT.toString();
        this.magCrit.text = selectedActor.MagCrit.toString();
        this.hit.text = selectedActor.HIT.toString();
        this.dod.text = selectedActor.DOD.toString();
        this.refreshActorDataPanelEnergyValue();
    }
    /**
     * 刷新角色数据-能量类数值
     */
    private refreshActorDataPanelEnergyValue() {
        let battler = GameBattleController.currentOperationBattler;
        if (!battler) return;
        let selectedActor = battler.actor;
        this.maxHP.text = selectedActor.hp + "/" + selectedActor.MaxHP.toString();
        this.maxSP.text = selectedActor.sp + "/" + selectedActor.MaxSP.toString();
    }
    /**
     * 刷新状态栏
     */
    private refreshStatus() {
        let battler = GameBattleController.currentOperationBattler;
        if (!battler) return;
        let selectedActor = battler.actor;
        let arr = [];
        for (let i = 0; i < selectedActor.status.length; i++) {
            let status = selectedActor.status[i];
            if (!status.icon) continue;
            let d = new ListItem_1028;
            d.icon = status.icon;
            d.tipsLabel = GUI_Manager.statusDesc(status);
            d.layer = status.currentLayer > 1 ? status.currentLayer.toString() : "";
            arr.push(d);
        }
        this.statusList.items = arr;
    }
}