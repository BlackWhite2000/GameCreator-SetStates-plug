/**
 * 战斗者AI-处理器
 * Created by 黑暗之神KDS on 2021-01-14 14:26:09.
 */
class GameBattleAI {
    //------------------------------------------------------------------------------------------------------
    // 
    //------------------------------------------------------------------------------------------------------
    /**
     * 当前战斗者
     */
    private static currentBattler: Battler;
    /**
     * 正在行动中
     */
    private static isInAction: boolean;
    //------------------------------------------------------------------------------------------------------
    // 初始化
    //------------------------------------------------------------------------------------------------------
    /**
     * 初始化
     */
    static init(): void {

    }
    /**
     * 开始
     */
    static start(): void {

    }
    /**
     * 结束
     */
    static stop(): void {

    }
    //------------------------------------------------------------------------------------------------------
    // 接口
    //------------------------------------------------------------------------------------------------------
    /**
     * 开始行动
     * @param battler 行动的战斗者
     * @param onActionComplete 当行动完毕时回调
     */
    static action(battler: Battler, onActionComplete: Callback) {
        // 记录当前的战斗者
        this.currentBattler = battler;
        // 初始化
        this.currentBattler.battleCommandType = null;
        this.isInAction = false;
        // 尝试使用道具
        this.tryUseItem();
        // 尝试使用技能
        this.tryUseSkill();
        // 尝试攻击
        this.tryAtk();
        // 结束
        GameBattleAction.doAction(battler, onActionComplete);
    }
    //------------------------------------------------------------------------------------------------------
    // 行为
    //------------------------------------------------------------------------------------------------------
    /**
     * 使用技能，遍历所有的技能
     * -- 在范围内的话直接使用，优先使用在范围内允许使用的技能
     * -- 预先计算包含移动范围内的最优解（即能够作用到的最多目标）
     */
    private static tryUseSkill() {
        // -- 正在行动中时无法使用
        if (this.isInAction) return;
        // 满足使用技能的概率
        if (MathUtils.rand(100) < this.currentBattler.actor.tryUseSkillProbability) {
            // -- 获取战斗者
            let battler = this.currentBattler;
            let actor = battler.actor;
            // -- 未满足使用技能的通用条件则无法使用
            if (!GameBattleHelper.canUseSkill(battler)) return;
            // -- 遍历该战斗者的技能获取允许使用的技能
            let canUseSkills: { skill: Module_Skill, target: Battler }[] = [];
            for (let i = 0; i < actor.skills.length; i++) {
                let skill = actor.skills[i];
                // 如果该技能无法使用的情况，则检查下一个
                if (!GameBattleHelper.canUseOneSkill(battler, skill, false)) continue;
                // 获取技能的作用目标
                let isHostileSkill = GameBattleHelper.isHostileSkill(skill);
                let skillTarget: Battler = this.getSkillTarget(skill, isHostileSkill);
                // 没有目标的情况
                if (!skillTarget) continue;
                canUseSkills.push({ skill: skill, target: skillTarget });
            }
            // -- 随机使用
            if (canUseSkills.length > 0) {
                let canUseSkill = canUseSkills[MathUtils.rand(canUseSkills.length)];
                this.doUseSkill(canUseSkill.skill, canUseSkill.target);
            }
        }
    }
    /**
     * 使用道具
     */
    private static tryUseItem() {
        // 已行动则忽略
        if (this.isInAction) return;
        // 满足使用道具的概率
        if (MathUtils.rand(100) < this.currentBattler.actor.tryUseItemProbability) {
            // -- 获取我方的背包道具集
            let packageItems = this.packageItems;
            // -- 获取我方的成员集合
            let myPartyBattlers = this.currentBattler.isEnemy ? GameBattle.enemyBattlers : GameBattle.playerBattlers;
            // 遍历道具
            for (let i = 0; i < packageItems.length; i++) {
                let item = packageItems[i];
                // 道具本身不允许使用的话则忽略
                if (!GameBattleHelper.canUseOneItem(this.currentBattler, item)) continue;
                // 当做技能使用道具忽略掉
                if (item.releaseSkill) continue;
                // 遍历队伍
                for (let p = 0; p < myPartyBattlers.length; p++) {
                    let myPartyBattler = myPartyBattlers[p];
                    if (!myPartyBattler) continue;
                    let myPartyActor = myPartyBattler.actor;
                    // 目标不允许被使用道具的话忽略
                    if (GameBattleHelper.isCanHitByItem(myPartyBattler, item) != 0) continue;
                    // 附加状态：如果目标仍然允许叠加该状态的话
                    for (let s = 0; s < item.addStatus.length; s++) {
                        let addStatus = item.addStatus[s];
                        if (GameBattleHelper.canSuperpositionLayer(myPartyBattler, addStatus)) {
                            this.doUseItem(item, myPartyBattler);
                            return;
                        }
                    }
                    // 解除状态：如果目标拥有该状态的话
                    for (let s = 0; s < item.removeStatus.length; s++) {
                        let removeStatus = item.removeStatus[s];
                        if (GameBattleHelper.isIncludeStatus(myPartyBattler, removeStatus)) {
                            this.doUseItem(item, myPartyBattler);
                            return;
                        }
                    }
                    // 恢复生命值或恢复魔法值
                    if ((item.recoveryHP > 0 && (myPartyActor.MaxHP - myPartyActor.hp >= item.recoveryHP || myPartyActor.hp / myPartyActor.MaxHP < 0.5)) ||
                        (item.recoverySP > 0 && (myPartyActor.MaxSP - myPartyActor.sp >= item.recoverySP || myPartyActor.sp / myPartyActor.MaxSP < 0.5))) {
                        this.doUseItem(item, myPartyBattler);
                        return;
                    }
                }
            }
        }
    }
    /**
     * 普通攻击
     */
    private static tryAtk() {
        // 已行动则忽略
        if (this.isInAction) return;
        // -- 获取战斗者
        let battler = this.currentBattler;
        let actor = battler.actor;
        let targetPartyBattlers = battler.isEnemy ? GameBattle.playerBattlers : GameBattle.enemyBattlers;
        // 剔除掉不存在的战斗者
        targetPartyBattlers = targetPartyBattlers.concat();
        for (let i = 0; i < targetPartyBattlers.length; i++) {
            if (!targetPartyBattlers[i]) {
                targetPartyBattlers.splice(i, 1);
                i--;
                break;
            }
        }
        // 未作出任何行动时，随机攻击一个敌对目标
        if (battler.battleCommandType == null) {
            // 普通攻击
            if (battler.actor.atkMode == 0) {
                this.doUseAttack(targetPartyBattlers[MathUtils.rand(targetPartyBattlers.length)])
            }
            // 使用技能代替普通攻击
            else {
                // -- 未满足使用技能的通用条件则无法使用
                if (!GameBattleHelper.canUseSkill(battler)) return;
                // -- 遍历该战斗者的技能获取允许使用的技能
                let skill = actor.atkSkill;
                // 如果该技能无法使用的情况，则检查下一个
                if (!skill || !GameBattleHelper.canUseOneSkill(battler, skill, false)) return;
                // 获取技能的作用目标
                let skillTarget: Battler = targetPartyBattlers[MathUtils.rand(targetPartyBattlers.length)];
                // 没有目标的情况
                if (!skillTarget) return;
                // -- 随机使用
                this.doUseSkill(skill, skillTarget);
            }
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 设置指令
    //------------------------------------------------------------------------------------------------------
    /**
     * 执行攻击指令
     */
    private static doUseAttack(target: Battler): void {
        this.isInAction = true;
        this.currentBattler.battleCommandType = 0;
        this.currentBattler.battleCommandApplyTarget = target;
    }
    /**
     * 执行使用技能指令
     * @param skill 
     * @param skillTarget 
     * @return [boolean] 成功使用
     */
    private static doUseSkill(skill: Module_Skill, skillTarget: Battler) {
        this.isInAction = true;
        this.currentBattler.battleCommandUseSkill = skill;
        this.currentBattler.battleCommandType = 1;
        this.currentBattler.battleCommandApplyTarget = skillTarget;
    }
    /**
     * 执行使用道具指令
     * @param item 
     */
    private static doUseItem(item: Module_Item, target: Battler) {
        this.isInAction = true;
        this.currentBattler.battleCommandUseItem = item;
        this.currentBattler.battleCommandType = 2;
        this.currentBattler.battleCommandApplyTarget = target;
    }
    //------------------------------------------------------------------------------------------------------
    // 获取
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取一个技能目标，可能为空
     * @param skill 技能
     * @param isHostileSkill 是否作用敌方的技能 
     * @return [ProjectClientSceneObject] 
     */
    private static getSkillTarget(skill: Module_Skill, isHostileSkill: boolean): Battler {
        let realTarget: Battler;
        let currentBattlerActor = this.currentBattler.actor;
        // 获取目标组
        let targetArr: Battler[] = [];
        // -- 如果是针对敌方的技能
        if (isHostileSkill) {
            targetArr = this.currentBattler.isEnemy ? GameBattle.playerBattlers.concat() : GameBattle.enemyBattlers.concat();
        }
        // -- 如果是作用自己的技能
        else if (skill.targetType == 0) {
            targetArr = [this.currentBattler];
        }
        else {
            targetArr = this.currentBattler.isEnemy ? GameBattle.enemyBattlers.concat() : GameBattle.playerBattlers.concat();
        }
        // 剔除掉无法作为技能目标的对象
        for (let i = 0; i < targetArr.length; i++) {
            let target = targetArr[i];
            if (!target || GameBattleHelper.isCanHitBySkill(this.currentBattler, target, skill) != 0) {
                targetArr.splice(i, 1);
                i--;
                continue;
            }
        }
        // 找不到目标的情况
        if (targetArr.length == 0) return;
        // 附加状态的技能，需要确认目标该状态是否拥有该状态或允许继续叠加
        for (let s = 0; s < skill.addStatus.length; s++) {
            let st = skill.addStatus[s];
            for (let i = 0; i < targetArr.length; i++) {
                realTarget = targetArr[i];
                if (GameBattleHelper.canSuperpositionLayer(realTarget, st)) {
                    return realTarget;
                }
            }
        }
        // 如果存在状态但无法作用到任何目标的话则视为无目标
        if (skill.addStatus.length > 0) {
            return null;
        }
        // 移除状态的技能，需要确认目标是否拥有该状态
        for (let s = 0; s < skill.removeStatus.length; s++) {
            let st = skill.removeStatus[s];
            for (let i = 0; i < targetArr.length; i++) {
                realTarget = targetArr[i];
                if (GameBattleHelper.isIncludeStatus(realTarget, st)) {
                    return realTarget;
                }
            }
        }
        // 如果存在状态但无法作用到任何目标的话则视为无目标
        if (skill.removeStatus.length > 0) {
            return null;
        }
        // 恢复
        if (!isHostileSkill && skill.useDamage) {
            let skillDamage = skill.damageValue;
            // -- 计算技能伤害加成
            if (skill.useAddition) {
                let actorAttributeValue = skill.additionMultipleType == 0 ? currentBattlerActor.ATK : currentBattlerActor.MAG;
                let addDamageValue = skill.additionMultiple / 100 * actorAttributeValue;
                skillDamage += addDamageValue;
            }
            // -- 恢复生命值
            if (skill.damageType == 3) {
                for (let i = 0; i < targetArr.length; i++) {
                    realTarget = targetArr[i];
                    let targetActor = realTarget.actor;
                    if (targetActor.MaxHP - targetActor.hp >= skillDamage || targetActor.hp / targetActor.MaxHP < 0.5) {
                        return realTarget;
                    }
                }
                return null;
            }
            // -- 恢复魔法值
            else if (skill.damageType == 4) {
                for (let i = 0; i < targetArr.length; i++) {
                    realTarget = targetArr[i];
                    let targetActor = realTarget.actor;
                    if (targetActor.MaxSP - targetActor.sp >= skillDamage || targetActor.sp / targetActor.MaxSP < 0.5) {
                        return realTarget;
                    }
                }
                return null;
            }
            else {
                return targetArr[0];
            }
        }
        // 目标是敌方的技能：随机找到一个目标
        if (isHostileSkill) {
            return targetArr[MathUtils.rand(targetArr.length)];
        }
        // 目标是我方的技能：自己
        else {
            return this.currentBattler;
        }
    }
    /**
     * 获取对应队伍的背包：根据我方或敌方判断背包来源
     */
    private static get packageItems(): Module_Item[] {
        let items: Module_Item[] = [];
        if (this.currentBattler.isEnemy) {
            for (let i = 0; i < GameBattleData.enemyPackageItems.length; i++) {
                items.push(GameBattleData.enemyPackageItems[i].item);
            }
        }
        else {
            for (let i = 0; i < Game.player.data.package.length; i++) {
                let itemDS = Game.player.data.package[i];
                if (itemDS.isEquip) continue;
                items.push(itemDS.item);
            }
        }
        return items;
    }
}