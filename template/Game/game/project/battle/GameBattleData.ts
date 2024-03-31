/**
 * 战斗数据
 * Created by 黑暗之神KDS on 2022-10-11 10:29:55.
 */
class GameBattleData {
    //------------------------------------------------------------------------------------------------------
    //  事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 事件：计算击中结果-开始 onCalcHitResultStart(fromBattler:Battler,targetBattler:Battler,actionType:number,skill:Module_Skill,item:Module_Item,status:Module_Status);
     */
    static EVENT_CALC_HIT_RESULT_START: string = "GameBattleDataEVENT_CALC_HIT_RESULT_START";
    /**
     * 事件：计算击中结果-完成 onCalcHitResultOver(fromBattler:Battler,targetBattler:Battler,damageType: number,damage:number,isCrit:boolean);
     */
    static EVENT_CALC_HIT_RESULT_OVER: string = "GameBattleDataEVENT_CALC_HIT_RESULT_OVER";
    /**
     * 事件：添加状态 onAddStatus(fromBattler:Battler, targetBattler:Battler, statusID:number, thisStatus:Module_Status, force:boolean);
     */
    static EVENT_ADD_STATUS: string = "GameBattleDataEVENT_ADD_STATUS";
    /**
     * 事件：移除状态 onRemoveStatus(targetBattler:Battler, statusID:number, removedStatus:Module_Status);
     */
    static EVENT_REMOVE_STATUS: string = "GameBattleDataEVENT_REMOVE_STATUS";
    /**
     * 事件：战斗者死亡 onEventBattlerDead(battler:Battler);
     */
    static EVENT_BATTLER_DEAD: string = "GameBattleDataEVENT_BATTLER_DEAD";
    //------------------------------------------------------------------------------------------------------
    //  死亡与奖励
    //------------------------------------------------------------------------------------------------------
    /**
     * 记录奖励
     */
    static rewardRecord: {
        gold: number,
        exp: number,
        items: { itemID: number, num: number }[],
        equips: Module_Equip[],
    } = { gold: 0, exp: 0, items: [], equips: [] };
    /**
     * 让战斗者死亡
     * @param battler 
     */
    static dead(battler: Battler): void {
        if (battler.isDead) return;
        // -- 死亡标记
        battler.isDead = true;
        // -- 置空
        battler.actor.hp = 0;
        GameBattleData.removeAllStatus(battler);
        // -- 派发战斗者死亡事件
        EventUtils.happen(GameBattleData, GameBattleData.EVENT_BATTLER_DEAD, [battler]);
        // -- 记录击杀奖励：金币、经验、道具、装备
        let battleActor = battler.actor;
        if (battler.isEnemy && battleActor.dropEnabled) {
            this.rewardRecord.gold += battleActor.dropGold;
            this.rewardRecord.exp += battleActor.dropExp;
            for (let i = 0; i < battleActor.dropItems.length; i++) {
                let dropItemDS = battleActor.dropItems[i];
                if (MathUtils.rand(100) < dropItemDS.dropProbability) {
                    this.rewardRecord.items.push({ itemID: dropItemDS.item, num: dropItemDS.num });
                }
            }
            for (let i = 0; i < battleActor.dropEquips.length; i++) {
                let dropEquipDS = battleActor.dropEquips[i];
                if (MathUtils.rand(100) < dropEquipDS.dropProbability) {
                    let newEquip = ObjectUtils.depthClone(dropEquipDS.equip);
                    this.rewardRecord.equips.push(newEquip);
                }
            }
        }
    }
    /**
     * 队伍死亡奖励
     */
    static partyDeadReward(): void {
        let enemyParty = GameBattle.enemyParty;
        if (enemyParty.dropEnabled) {
            this.rewardRecord.gold += enemyParty.dropGold;
            this.rewardRecord.exp += enemyParty.dropExp;
            for (let i = 0; i < enemyParty.dropItems.length; i++) {
                let dropItemDS = enemyParty.dropItems[i];
                if (MathUtils.rand(100) < dropItemDS.dropProbability) {
                    this.rewardRecord.items.push({ itemID: dropItemDS.item, num: dropItemDS.num });
                }
            }
            for (let i = 0; i < enemyParty.dropEquips.length; i++) {
                let dropEquipDS = enemyParty.dropEquips[i];
                if (MathUtils.rand(100) < dropEquipDS.dropProbability) {
                    let newEquip = ObjectUtils.depthClone(dropEquipDS.equip);
                    this.rewardRecord.equips.push(newEquip);
                }
            }
        }
    }
    //------------------------------------------------------------------------------------------------------
    //  道具
    //------------------------------------------------------------------------------------------------------
    /**
     * 敌方队伍拥有的道具
     */
    static enemyPackageItems: DataStructure_enemyTakeItem[];
    /**
     * 初始化敌人队伍的背包道具
     * @param enemyParty 敌人队伍
     */
    static initEnemyPartyPackageItem(enemyParty: Module_Party): void {
        if (enemyParty.takeItemsSetting) {
            this.enemyPackageItems = ObjectUtils.depthClone(enemyParty.takeItems);
        }
        else {
            this.enemyPackageItems = [];
        }
    }
    /**
     * 消耗道具
     * @param fromBattler 来源战斗者
     * @param item 道具
     * @return [boolean] 
     */
    static costItem(fromBattler: Battler, item: Module_Item): boolean {
        if (item.isConsumables) {
            if (fromBattler.isEnemy) {
                GameBattleData.costEnemyPartyPackageItem(item);
            }
            else {
                // 如果不存在该道具的话
                if (!ProjectPlayer.getItem(item.id)) {
                    return false;
                }
                ProjectPlayer.changeItemNumber(item.id, -1, false);
            }
        }
        return true;
    }
    /**
     * 消耗敌人队伍的背包道具
     * @param item 道具 
     * @param v 数目
     */
    private static costEnemyPartyPackageItem(item: Module_Item): void {
        let itemDSIndex: number = ArrayUtils.matchAttributes(this.enemyPackageItems, { item: item }, true, "==", true)[0];
        if (itemDSIndex != null) {
            let itemDS = this.enemyPackageItems[itemDSIndex];
            itemDS.number--;
            if (itemDS.number == 0) {
                this.enemyPackageItems.splice(itemDSIndex, 1);
            }
        }
    }
    //------------------------------------------------------------------------------------------------------
    //  技能
    //------------------------------------------------------------------------------------------------------
    /**
     * 推进全体战斗者的技能冷却时间以及状态时间
     * @param battleRound 当前回合数
     */
    static forwardAllBattlersSkillCDAndStatusTime(battleRound: number): void {
        // 遍历所有战斗者
        let allBattlers = GameBattleHelper.allBattlers;
        for (let i in allBattlers) {
            let battler = allBattlers[i];
            let actor = battler.actor;
            // -- 指令操作完成标识初始化
            battler.commandControlComplete = false;
            // -- 普通攻击是技能的情况，刷新冷却时间
            if (actor.atkMode == 1 && actor.atkSkill) {
                if (actor.atkSkill.currentCD > 0) actor.atkSkill.currentCD--;
            }
            // -- 刷新技能冷却时间
            for (let s = 0; s < actor.skills.length; s++) {
                let skill = actor.skills[s];
                if (skill.currentCD > 0) skill.currentCD--;
            }
            // -- 刷新状态时间，到期解除
            if (battleRound != 1) {
                this.forwardStatusTime(battler);
            }
        }
    }
    /**
     * 使用技能：减少消耗以及冷却计时
     * @param battler 战斗者
     * @param skill 技能
     */
    static useSkill(battler: Battler, skill: Module_Skill): void {
        battler.actor.sp -= skill.costSP;
        battler.actor.hp -= skill.costHP;
        skill.currentCD = skill.totalCD;
    }
    //------------------------------------------------------------------------------------------------------
    // 状态
    //------------------------------------------------------------------------------------------------------
    /**
     * 添加目标状态
     * @param targetBattler 目标战斗者
     * @param statusID 状态
     * @return [boolean] 
     */
    static addStatus(targetBattler: Battler, statusID: number, fromBattler: Battler = null, force: boolean = false): boolean {
        // 获取系统预设的该状态，如果不存在则无法添加
        let systemStatus: Module_Status = GameData.getModuleData(10, statusID);
        if (!systemStatus) return false;
        // 计算命中率
        if (!force && MathUtils.rand(100) >= systemStatus.statusHit) {
            return false;
        }
        if (fromBattler == null) fromBattler = targetBattler;
        let targetBattlerActor = targetBattler.actor;
        // -- 如果目标免疫该状态的话则忽略
        let targetIsImmuneThisStatus = targetBattlerActor.selfImmuneStatus.indexOf(statusID) != -1;
        if (!force && targetIsImmuneThisStatus) return false;;
        let thisStatus: Module_Status = ArrayUtils.matchAttributes(targetBattlerActor.status, { id: statusID }, true)[0];
        let firstAddStatus = false;
        if (thisStatus) {
            thisStatus.currentLayer += 1;
            if (thisStatus.currentLayer > thisStatus.maxlayer) thisStatus.currentLayer = thisStatus.maxlayer;
        }
        else {
            firstAddStatus = true;
            thisStatus = GameData.newModuleData(10, statusID);
            thisStatus.fromBattlerID = fromBattler.inBattleID;
            targetBattlerActor.status.push(thisStatus);
        }
        // -- 自动动画
        if (thisStatus.animation) targetBattler.playAnimation(thisStatus.animation, true, true);
        // -- 刷新状态的持续回合
        thisStatus.currentDuration = thisStatus.totalDuration;
        // -- 事件处理
        EventUtils.happen(GameBattleData, GameBattleData.EVENT_ADD_STATUS, [fromBattler, targetBattler, statusID, thisStatus, force]);
        if (firstAddStatus && thisStatus.eventSetting && thisStatus.addEvent) CommandPage.startTriggerFragmentEvent(thisStatus.addEvent, fromBattler, targetBattler);
        return true;
    }
    /**
     * 移除目标状态
     * @param targetBattler 目标战斗者
     * @param statusID 状态编号
     * @return [boolean] 
     */
    static removeStatus(targetBattler: Battler, statusID: number): boolean {
        // 获取系统预设的该状态，如果不存在则无法添加
        let systemStatus: Module_Status = GameData.getModuleData(10, statusID);
        if (!systemStatus) return false;
        let targetBattlerActor = targetBattler.actor;
        let thisStatusIdx: number = ArrayUtils.matchAttributes(targetBattlerActor.status, { id: statusID }, true, "==", true)[0];
        if (thisStatusIdx != null) {
            let removedStatus = targetBattlerActor.status.splice(thisStatusIdx, 1)[0];
            // 解除动画
            if (systemStatus.animation) {
                // 如果该动画在其他状态下不存在则直接清除
                if (ArrayUtils.matchAttributes(targetBattlerActor.status, { animation: systemStatus.animation }, true, "==", true).length == 0) {
                    targetBattler.stopAnimation(systemStatus.animation);
                }
            }
            // -- 事件处理
            EventUtils.happen(GameBattleData, GameBattleData.EVENT_REMOVE_STATUS, [targetBattler, statusID, removedStatus]);
            if (systemStatus.eventSetting && systemStatus.removeEvent) CommandPage.startTriggerFragmentEvent(systemStatus.removeEvent, targetBattler, targetBattler);
            return true;
        }
        return false;
    }
    /**
     * 解除全部状态
     */
    static removeAllStatus(battler: Battler): void {
        // 动画效果解除
        let statusArr = battler.actor.status;
        for (let i = 0; i < statusArr.length; i++) {
            let status = statusArr[i];
            if (status.animation) battler.stopAnimation(status.animation);
            let systemStatus: Module_Status = GameData.getModuleData(10, status.id);
            // -- 事件处理
            EventUtils.happen(GameBattleData, GameBattleData.EVENT_REMOVE_STATUS, [battler, status.id, status]);
            if (systemStatus.eventSetting && systemStatus.removeEvent) CommandPage.startTriggerFragmentEvent(systemStatus.removeEvent, battler, battler);
        }
        // 清理状态数据
        battler.actor.status.length = 0;
    }
    /**
     * 解除所有战斗者中来源是指定某个战斗者的状态
     * @param fromBattler 来源战斗者
     */
    static removeAllBattlerStatusByFromBattler(fromBattler: Battler): void {
        // 获取目标队伍
        let targetBattlers = fromBattler.isEnemy ? GameBattle.playerBattlers : GameBattle.enemyBattlers;
        targetBattlers = GameBattleHelper.getNotNullBattlers(targetBattlers);
        // 遍历目标队伍
        for (let i = 0; i < targetBattlers.length; i++) {
            let targetBattler = targetBattlers[i];
            let statusArr = targetBattler.actor.status;
            let isRemoveStatus = false;
            for (let s = 0; s < statusArr.length; s++) {
                let status = statusArr[s];
                if (status.fromBattlerID == fromBattler.inBattleID) {
                    if (this.removeStatus(targetBattler, status.id)) {
                        s--;
                        isRemoveStatus = true;
                    }
                }
                if (isRemoveStatus) Game.refreshActorAttribute(targetBattler.actor);
            }
        }
    }
    //------------------------------------------------------------------------------------------------------
    //  战斗计算
    //------------------------------------------------------------------------------------------------------
    /**
     * 计算是否命中
     * @param actionType 0-普通攻击 1-使用技能 2-使用道具 3-状态 
     * @param fromBattler 来源战斗者
     * @param targetBattler 目标战斗者
     * @param skill [可选] 默认值=null 使用的技能
     * @return [boolean] 
     */
    static getHitResult(actionType: number, fromBattler: Battler, targetBattler: Battler, skill: Module_Skill = null): boolean {
        // 获取战斗者的角色数据
        let fromActor = fromBattler.actor;
        let battleActor = targetBattler.actor;
        let isHitSuccess = true;
        // 普通攻击：(攻击者命中率 - 目标躲避率)%
        if (actionType == 0) {
            isHitSuccess = MathUtils.rand(100) < (fromActor.HIT - battleActor.DOD);
        }
        // 使用技能：(技能命中率)%
        else if (actionType == 1) {
            if ((fromActor.atkMode == 1 && skill == fromActor.atkSkill)) {
                isHitSuccess = MathUtils.rand(100) < (fromActor.HIT - battleActor.DOD);
            }
            else {
                isHitSuccess = MathUtils.rand(100) < skill.hit;
            }
        }
        // 使用道具：100%
        else if (actionType == 2) {
            isHitSuccess = true;
        }
        return isHitSuccess;
    }
    /**
     * 计算击中结果
     * -- 状态变更
     * -- 计算伤害
     * -- 计算仇恨
     * -- 死亡判定
     * @param fromBattler 
     * @param targetBattler 
     * @param isHitSuccess 
     * @param actionType 0-普通攻击 1-使用技能 2-使用道具 3-状态
     * @param skill [可选] 默认值=null 
     * @param item [可选] 默认值=null 
     * @param status [可选] 默认值=null
     * @param damagePer [可选] 默认值=null 伤害比例 100 = 100% null=无
     * @return  damageType=伤害类别（-2-无 -1-Miss 0-物理伤害 1-魔法伤害 2-真实伤害 3-恢复生命值 4-恢复魔法值） damage=伤害 isCrit=是否暴击
     */
    static calculationHitResult(fromBattler: Battler, targetBattler: Battler, isHitSuccess: boolean, actionType: number, skill: Module_Skill = null, item: Module_Item = null, status: Module_Status = null, damagePer = null): {
        damageType: number,
        damage: number,
        isCrit: boolean
    } {
        // 派发事件
        EventUtils.happen(GameBattleData, GameBattleData.EVENT_CALC_HIT_RESULT_START, [fromBattler, targetBattler, isHitSuccess, actionType, skill, item, status]);
        // 返回值
        let res: {
            damageType: number,
            damage: number,
            isCrit: boolean
        };
        // 来源和目标的角色数据
        let fromActor = fromBattler.actor;
        let targetBattlerActor = targetBattler.actor;
        // 添加的状态组
        let addTargetBattlerStatusArr: number[] = [];
        let addFromBattlerStatusArr: number[] = [];
        let removeTargetBattlerStatusArr: number[] = [];
        // 记录目标原有的状态
        let targetOriStatus = targetBattlerActor.status.concat();
        // 作用类别和相关数值 
        let damageType = -2; // -2-无 -1-MISS 0-物理伤害 1-魔法伤害 2-真实伤害 3-恢复生命值 4-恢复魔法值
        let hpChangeValue = 0;
        let spChangeValue = 0;
        // 击中后移除状态（造成伤害才允许移除）
        let hitRemoveStatus = false;
        // 计算暴击率
        let critPer: number;
        let magCritPer: number;
        let isCrit: boolean;
        let isMagCrit: boolean;
        // 优先计算状态和刷新属性（如技能带有降低对方属性的状态，即当前立刻以降低后的属性来计算伤害）
        if (isHitSuccess) {
            isCrit = MathUtils.rand(100) < fromActor.CRIT ? true : false;
            isMagCrit = MathUtils.rand(100) < fromActor.MagCrit ? true : false;
            critPer = isCrit ? 2 : 1;
            magCritPer = isMagCrit ? 2 : 1;
            // 普通攻击
            if (actionType == 0) {
                // 击中目标后自身附加的状态
                addFromBattlerStatusArr = addFromBattlerStatusArr.concat(fromActor.hitTargetSelfAddStatus);
                // 击中目标后目标附加的状态
                addTargetBattlerStatusArr = addTargetBattlerStatusArr.concat(fromActor.hitTargetStatus);
            }
            // 使用技能
            else if (actionType == 1) {
                // -- 添加的状态
                if (skill.statusSetting) addTargetBattlerStatusArr = addTargetBattlerStatusArr.concat(skill.addStatus);
                // -- 减少的状态
                if (skill.statusSetting) removeTargetBattlerStatusArr = removeTargetBattlerStatusArr.concat(skill.removeStatus);
            }
            // 使用道具
            else if (actionType == 2) {
                // -- 添加的状态
                addTargetBattlerStatusArr = addTargetBattlerStatusArr.concat(item.addStatus);
                // -- 减少的状态
                removeTargetBattlerStatusArr = removeTargetBattlerStatusArr.concat(item.removeStatus);
            }
            // 添加目标状态
            for (let i = 0; i < addTargetBattlerStatusArr.length; i++) {
                let addStatusID = addTargetBattlerStatusArr[i];
                GameBattleData.addStatus(targetBattler, addStatusID, fromBattler);
            }
            // 移除目标状态
            for (let i = 0; i < removeTargetBattlerStatusArr.length; i++) {
                let removeStatusID = removeTargetBattlerStatusArr[i];
                GameBattleData.removeStatus(targetBattler, removeStatusID);
            }
            // 添加来源的状态
            for (let i = 0; i < addFromBattlerStatusArr.length; i++) {
                let addStatusID = addFromBattlerStatusArr[i];
                GameBattleData.addStatus(fromBattler, addStatusID, fromBattler);
            }
            // 如果目标更新了状态的话则刷新目标属性
            if (addTargetBattlerStatusArr.length > 0 || removeTargetBattlerStatusArr.length > 0) {
                let level = GameBattleHelper.getLevelByActor(targetBattlerActor);
                Game.refreshActorAttribute(targetBattlerActor, level)
            }
            // 如果来源者更新了状态的话刷新来源的属性
            if (addFromBattlerStatusArr.length > 0) {
                let level = GameBattleHelper.getLevelByActor(targetBattlerActor);
                Game.refreshActorAttribute(targetBattlerActor, level)
            }
        }
        // -- MISS
        if (!isHitSuccess) {
            damageType = -1;
            res = { damageType: -1, damage: hpChangeValue, isCrit: false };
        }
        // -- 普通攻击：(攻击者命中率 - 目标躲避率)%
        else if (actionType == 0) {
            damageType = 0;
            hpChangeValue = -Math.max(1, fromActor.ATK - targetBattlerActor.DEF) * critPer;
            if (targetBattler.battleCommandType == 3 && GameBattleHelper.canUseDefense(targetBattler)) hpChangeValue = Math.floor(hpChangeValue / 2);
            res = { damageType: 0, damage: hpChangeValue, isCrit: isCrit };
            hitRemoveStatus = true;
        }
        // -- 使用技能：
        else if (actionType == 1) {
            let skillDamage = 0;
            // 使用伤害
            if (skill.useDamage) {
                let damageShowCrit: boolean = false;
                damageType = skill.damageType;
                // -- 技能固定伤害
                skillDamage = skill.damageValue;
                // -- 技能伤害加成
                if (skill.useAddition) {
                    let actorAttributeValue = skill.additionMultipleType == 0 ? fromActor.ATK : fromActor.MAG;
                    let addDamageValue = skill.additionMultiple / 100 * actorAttributeValue;
                    skillDamage += addDamageValue;
                }
                // -- 物理伤害
                if (damageType == 0) {
                    hpChangeValue = -Math.max(1, skillDamage - targetBattlerActor.DEF) * critPer;
                    if (targetBattler.battleCommandType == 3 && GameBattleHelper.canUseDefense(targetBattler)) hpChangeValue = Math.floor(hpChangeValue / 2);
                    hitRemoveStatus = true;
                    damageShowCrit = isCrit;
                }
                // -- 魔法伤害
                else if (damageType == 1) {
                    hpChangeValue = -Math.max(1, skillDamage - targetBattlerActor.MagDef) * magCritPer;
                    // -- 元素有效度加成
                    hpChangeValue *= GameBattleHelper.getElementEffectivenessPer(targetBattler, skill.elementType) * 0.01;
                    hitRemoveStatus = true;
                    damageShowCrit = isMagCrit;
                }
                // -- 真实伤害
                else if (damageType == 2) {
                    hpChangeValue = -Math.max(1, skillDamage);
                    hitRemoveStatus = true;
                }
                // -- 恢复生命值
                else if (damageType == 3) {
                    hpChangeValue = Math.max(0, skillDamage) * magCritPer;
                    damageShowCrit = isMagCrit;
                    // -- 复活的情况
                    if (GameBattleHelper.isResurrectionSkill(skill) && targetBattler.isDead && hpChangeValue > 0) {
                        targetBattler.isDead = false;
                    }
                }
                // -- 恢复魔法值
                else if (damageType == 4) {
                    spChangeValue = Math.max(0, skillDamage) * magCritPer;
                    damageShowCrit = isMagCrit;
                }
                // -- 显示伤害 
                if (hpChangeValue != 0) {
                    res = { damageType: damageType, damage: hpChangeValue, isCrit: damageShowCrit };
                }
                else if (spChangeValue != 0) {
                    res = { damageType: damageType, damage: spChangeValue, isCrit: damageShowCrit };
                }
            }
        }
        // -- 使用道具
        else if (actionType == 2) {
            if (item.recoveryHP) {
                damageType = 3;
                hpChangeValue = item.recoveryHP;
                res = { damageType: damageType, damage: hpChangeValue, isCrit: false };
                // -- 复活的情况
                if (item.applyDeadBattler && targetBattler.isDead && hpChangeValue > 0) {
                    targetBattler.isDead = false;
                }
            }
            if (item.recoverySP) {
                spChangeValue = item.recoverySP;
                if (damageType != 3) {
                    damageType = 4;
                    res = { damageType: damageType, damage: spChangeValue, isCrit: false };
                }
            }
        }
        // -- 状态:DOT/HOT
        else if (actionType == 3) {
            // 使用伤害
            damageType = status.damageType;
            let damageShowCrit: boolean = false;
            // -- 技能固定伤害
            let statusDamage = status.damageValue;
            // -- 技能伤害加成
            if (status.useAddition) {
                let actorAttributeValue = status.additionMultipleType == 0 ? fromActor.ATK : fromActor.MAG;
                let addDamageValue = status.additionMultiple / 100 * actorAttributeValue;
                statusDamage += addDamageValue;
            }
            // 状态叠加层
            statusDamage *= status.currentLayer;
            // -- 物理伤害
            if (damageType == 0) {
                hpChangeValue = -Math.max(1, statusDamage - targetBattlerActor.DEF);
                hitRemoveStatus = true;
                damageShowCrit = isCrit;
            }
            // -- 魔法伤害
            else if (damageType == 1) {
                hpChangeValue = -Math.max(1, statusDamage - targetBattlerActor.MagDef);
                // -- 元素有效度加成
                hpChangeValue *= GameBattleHelper.getElementEffectivenessPer(targetBattler, status.elementType) * 0.01;
                hitRemoveStatus = true;
                damageShowCrit = isMagCrit;
            }
            // -- 真实伤害
            else if (damageType == 2) {
                hpChangeValue = -Math.max(1, statusDamage);
                hitRemoveStatus = true;
            }
            // -- 恢复生命值
            else if (damageType == 3) {
                hpChangeValue = Math.max(0, statusDamage);
                damageShowCrit = isMagCrit;
            }
            // -- 恢复魔法值
            else if (damageType == 4) {
                spChangeValue = Math.max(0, statusDamage);
                damageShowCrit = isMagCrit;
            }
            // -- 显示伤害
            if (hpChangeValue != 0) {
                res = { damageType: damageType, damage: hpChangeValue, isCrit: damageShowCrit };
            }
            else if (spChangeValue != 0) {
                res = { damageType: damageType, damage: spChangeValue, isCrit: damageShowCrit };
            }
        }
        // 伤害加成
        if (damageType <= 2) {
            if (GameBattleHelper.isHostileRelationship(fromBattler, targetBattler) && res && res.damage < 0) {
                let fromBattlerDamagePer = GameBattleHelper.getDamagePer(fromBattler);
                let targetBattlerStrikePer = GameBattleHelper.getStrikePer(targetBattler);
                res.damage = hpChangeValue = hpChangeValue * fromBattlerDamagePer * 0.01 * targetBattlerStrikePer * 0.01;
            }
            // 叠加比例
            if (damagePer != null && res && res.damage < 0) {
                res.damage = hpChangeValue = hpChangeValue * damagePer * 0.01;
            }
        }
        // 最小伤害值
        if (damageType >= 0 && damageType <= 2 && res && Math.abs(res.damage) < 1) {
            res.damage = hpChangeValue = -1;
        }
        // 更改生命值和魔法值
        hpChangeValue = Math.trunc(hpChangeValue);
        spChangeValue = Math.trunc(spChangeValue);
        if (hpChangeValue != 0) targetBattlerActor.hp += hpChangeValue;
        if (spChangeValue != 0) targetBattlerActor.sp += spChangeValue;
        // 修正生命值和魔法值范围
        targetBattlerActor.hp = Math.max(Math.min(targetBattlerActor.hp, targetBattlerActor.MaxHP), 0);
        targetBattlerActor.sp = Math.max(Math.min(targetBattlerActor.sp, targetBattlerActor.MaxSP), 0);
        // 计算受伤害解除的状态
        if (hitRemoveStatus) {
            // 受伤解除状态
            let hitRemoveStatusSuccess = false;
            if ((actionType == 0 || actionType == 1 || actionType == 3) && damageType <= 2) {
                for (let i = 0; i < targetOriStatus.length; i++) {
                    let needRemoveStatus = targetOriStatus[i];
                    if (needRemoveStatus.removeWhenInjured && MathUtils.rand(100) < needRemoveStatus.removePer) {
                        if (GameBattleData.removeStatus(targetBattler, needRemoveStatus.id)) hitRemoveStatusSuccess = true;
                    }
                }
                if (hitRemoveStatusSuccess) {
                    let level = GameBattleHelper.getLevelByActor(targetBattlerActor);
                    Game.refreshActorAttribute(targetBattlerActor, level);
                }
            }
        }
        // 派发事件
        EventUtils.happen(GameBattleData, GameBattleData.EVENT_CALC_HIT_RESULT_OVER, [fromBattler, targetBattler, res?.damageType, res?.damage, res?.isCrit]);
        return res;
    }
    /**
     * 更改战斗者生命值
     * @param battle 
     * @param changeValue 
     */
    static changeBattlerHP(battle: Battler, changeValue: number): void {
        battle.actor.hp += changeValue;
        battle.actor.hp = Math.max(Math.min(battle.actor.hp, battle.actor.MaxHP), 0);
    }
    /**
     * 更改战斗者魔法值
     * @param battle 
     * @param changeValue 
     */
    static changeBattlerSP(battle: Battler, changeValue: number): void {
        battle.actor.sp += changeValue;
        battle.actor.sp = Math.max(Math.min(battle.actor.sp, battle.actor.MaxSP), 0);
    }
    //------------------------------------------------------------------------------------------------------
    //  内部实现
    //------------------------------------------------------------------------------------------------------
    /**
     * 刷新状态时间
     * @param battler 
     */
    private static forwardStatusTime(battler: Battler): void {
        let isRemoveStatus = false;
        for (let s = 0; s < battler.actor.status.length; s++) {
            let status = battler.actor.status[s];
            status.currentDuration--;
            if (status.currentDuration <= 0) {
                let isRemove = GameBattleData.removeStatus(battler, status.id);
                if (isRemove) {
                    s--;
                    isRemoveStatus = true;
                }
            }
        }
        if (isRemoveStatus) {
            Game.refreshActorAttribute(battler.actor);
        }
    }
}