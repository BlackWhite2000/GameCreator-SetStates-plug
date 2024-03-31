/**
 * 战斗相关辅助计算类
 * Created by 黑暗之神KDS on 2021-01-14 13:52:47.
 */
class GameBattleHelper {
    //------------------------------------------------------------------------------------------------------
    // 获取
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取等级根据角色数据
     * 因为战斗者区分玩家拥有的角色和非玩家拥有的角色，储存等级的地方不一样
     * @param actor 角色数据 
     * @return [number] 等级
     */
    static getLevelByActor(actor: Module_Actor): number {
        // -- 如果是玩家拥有的角色时则从玩家队伍的该角色中获取等级
        let playerActorDS: DataStructure_inPartyActor = ArrayUtils.matchAttributes(Game.player.data.party, { actor: actor }, true)[0];
        if (playerActorDS) {
            return playerActorDS.lv;
        }
        // -- 否则根据场上的战斗者获取等级
        else {
            let allBattlers = this.allBattlers;
            let battler: Battler = ArrayUtils.matchAttributes(allBattlers, { actor: actor }, true)[0];
            if (battler) return battler.level;
        }
        return 1;
    }
    /**
     * 获取所有战斗者
     */
    static get allBattlers(): Battler[] {
        let battlers = GameBattle.playerBattlers.concat(GameBattle.enemyBattlers);
        return this.getNotNullBattlers(battlers);
    }
    /**
     * 获取battler的队友集
     * @param battler 战斗者
     * @param includeSelf 是否包含自己
     * @return [Battler] 
     */
    static getTeamBattlers(battler: Battler, includeSelf: boolean): Battler[] {
        let p: Battler[];
        if (battler.isEnemy) p = GameBattle.enemyBattlers;
        else p = GameBattle.playerBattlers;
        if (!includeSelf) {
            p = p.concat();
            ArrayUtils.remove(p, battler);
        }
        return this.getNotNullBattlers(p);
    }
    /**
     * 获取battler的敌人集
     * @param battler 战斗者
     * @return [Battler] 
     */
    static getHostileBattlers(battler: Battler): Battler[] {
        let p: Battler[];
        if (!battler.isEnemy) p = GameBattle.enemyBattlers;
        else p = GameBattle.playerBattlers;
        return this.getNotNullBattlers(p);
    }
    /**
     * 获取战斗者根据角色
     * @param actor 角色数据
     * @return [Battler] 
     */
    static getBattlerByActor(actor: Module_Actor): Battler {
        if (!GameBattleHelper.isInBattle) return null;
        let allBattlers = this.allBattlers;
        return ArrayUtils.matchAttributes(allBattlers, { actor: actor }, true)[0];
    }
    /**
     * 获取战斗者集合中实际存在的战斗者集合（剔除掉null对象）
     * @param battlers 
     * @return [Battler] 
     */
    static getNotNullBattlers(battlers: Battler[]): Battler[] {
        let notNullBattlers = [];
        for (let i = 0; i < battlers.length; i++) {
            let battler = battlers[i];
            if (battler) {
                notNullBattlers.push(battler);
            }
        }
        return notNullBattlers;
    }
    /**
     * 获取攻击目标
     */
    static getAttackTarget(thisBattler: Battler): Battler {
        if (!thisBattler.battleCommandApplyTarget) {
            return null;
        }
        // 如果其目标允许被攻击的话则返回该目标
        let canAttack = this.isCanHitByAttack(thisBattler, thisBattler.battleCommandApplyTarget);
        if (canAttack) return thisBattler.battleCommandApplyTarget;
        // 否则在目标阵营中随机找到一个可被攻击的目标
        let targetPartyBattlers = thisBattler.battleCommandApplyTarget.isEnemy ? GameBattle.enemyBattlers : GameBattle.playerBattlers;
        targetPartyBattlers = this.getNotNullBattlers(targetPartyBattlers);
        let canHitTargets = [];
        for (let i = 0; i < targetPartyBattlers.length; i++) {
            let nextTargetBattler = targetPartyBattlers[i];
            if (nextTargetBattler == thisBattler) continue;
            if (this.isCanHitByAttack(thisBattler, nextTargetBattler)) {
                canHitTargets.push(nextTargetBattler);
            }
        }
        if (canHitTargets.length == 0) return null;
        else return canHitTargets[MathUtils.rand(canHitTargets.length)];
    }
    /**
     * 获取技能使用的目标
     * @param thisBattler 
     * @param useSkill 
     * @param ifNoTargetGetOtherTarget 如果没有目标的话从其他目标中选择
     * @return [Battler] 
     */
    static getSkillTargets(thisBattler: Battler, useSkill: Module_Skill, ifNoTargetGetOtherTarget: boolean): Battler[] {
        // -- 目标是自己
        if (useSkill.targetType == 0) {
            return [thisBattler];
        }
        // -- 队友单体 或 敌人单体
        else if (useSkill.targetType == 1 || useSkill.targetType == 2) {
            // -- 如果目标允许指定的话则返回该目标
            let canSkillState = this.isCanHitBySkill(thisBattler, thisBattler.battleCommandApplyTarget, useSkill);
            if (canSkillState == 0) return [thisBattler.battleCommandApplyTarget];
            else if (canSkillState == 2 || !ifNoTargetGetOtherTarget) return null;
            let targetPartyBattlers: Battler[];
            // -- 否则查找速度最快的下一个目标
            if (useSkill.targetType == 1) targetPartyBattlers = thisBattler.isEnemy ? GameBattle.enemyBattlers : GameBattle.playerBattlers;
            else targetPartyBattlers = thisBattler.isEnemy ? GameBattle.playerBattlers : GameBattle.enemyBattlers;
            // -- 获取不为null的对象集合
            targetPartyBattlers = this.getNotNullBattlers(targetPartyBattlers);
            // -- 根据速度进行排序
            targetPartyBattlers.sort((a: Battler, b: Battler) => {
                return a.actor.ActionSpeed > b.actor.ActionSpeed ? -1 : 1;
            });
            // -- 找到速度最快的技能可作用的目标
            for (let i = 0; i < targetPartyBattlers.length; i++) {
                let nextTargetBattler = targetPartyBattlers[i];
                if (this.isCanHitBySkill(thisBattler, nextTargetBattler, useSkill) == 0) {
                    return [nextTargetBattler];
                }
            }
            return null;
        }
        // -- 队友全体 或 敌人全体
        else if (useSkill.targetType == 3 || useSkill.targetType == 4) {
            let targetPartyBattlers: Battler[];
            if (useSkill.targetType == 3) targetPartyBattlers = thisBattler.isEnemy ? GameBattle.enemyBattlers : GameBattle.playerBattlers;
            else targetPartyBattlers = thisBattler.isEnemy ? GameBattle.playerBattlers : GameBattle.enemyBattlers;
            targetPartyBattlers = this.getNotNullBattlers(targetPartyBattlers);
            let canHitTargets = [];
            for (let i = 0; i < targetPartyBattlers.length; i++) {
                let nextTargetBattler = targetPartyBattlers[i];
                if (this.isCanHitBySkill(thisBattler, nextTargetBattler, useSkill) == 0) {
                    canHitTargets.push(nextTargetBattler);
                }
            }
            return canHitTargets;
        }
        // -- 队友多体 或 敌人多体
        else if (useSkill.targetType == 5 || useSkill.targetType == 6) {
            let canHitTargets = [];
            // -- 记录作用的目标数目
            let targetNum = useSkill.targetNum;
            // -- 判断第一目标是否允许被技能作用
            let canSkillState = this.isCanHitBySkill(thisBattler, thisBattler.battleCommandApplyTarget, useSkill);
            // -- 允许的话则添加
            if (canSkillState == 0) {
                canHitTargets.push(thisBattler.battleCommandApplyTarget);
            }
            // -- 不允许且不允许作用其他目标的话则减少一个目标
            else if (canSkillState == 2 || !ifNoTargetGetOtherTarget) targetNum--;
            // -- 已经没有目标的话则返回无
            if (canHitTargets.length == targetNum) return canHitTargets;
            // -- 查询其他目标
            let targetPartyBattlers: Battler[];
            if (useSkill.targetType == 5) targetPartyBattlers = thisBattler.isEnemy ? GameBattle.enemyBattlers : GameBattle.playerBattlers;
            else targetPartyBattlers = thisBattler.isEnemy ? GameBattle.playerBattlers : GameBattle.enemyBattlers;
            targetPartyBattlers = this.getNotNullBattlers(targetPartyBattlers);
            // -- 根据速度进行排序
            targetPartyBattlers.sort((a: Battler, b: Battler) => {
                return a.actor.ActionSpeed > b.actor.ActionSpeed ? -1 : 1;
            });
            for (let i = 0; i < targetPartyBattlers.length; i++) {
                let nextTargetBattler = targetPartyBattlers[i];
                // -- 忽略最初指定的目标
                if (nextTargetBattler == thisBattler.battleCommandApplyTarget) continue;
                // -- 如果作用目标数到达指定数目上限的话
                if (canHitTargets.length == targetNum) break;
                // -- 获取该目标是否允许被该技能作用
                let canSkillState = this.isCanHitBySkill(thisBattler, nextTargetBattler, useSkill);
                if (canSkillState == 0) {
                    canHitTargets.push(nextTargetBattler);
                }
                else if (canSkillState == 2 || !ifNoTargetGetOtherTarget) {
                    targetNum--;
                }
            }
            return canHitTargets;
        }
    }
    /**
     * 获取道具使用的目标
     */
    static getItemTarget(thisBattler: Battler, useItem: Module_Item): Battler {
        // 如果其目标允许被攻击的话则返回该目标
        let canUseItemState = this.isCanHitByItem(thisBattler.battleCommandApplyTarget, useItem);
        if (canUseItemState == 0) return thisBattler.battleCommandApplyTarget;
        else if (canUseItemState == 2) return null;
        // 否则在目标阵营中随机找到一个可被攻击的目标
        let targetPartyBattlers = thisBattler.isEnemy ? GameBattle.enemyBattlers : GameBattle.playerBattlers;
        targetPartyBattlers = this.getNotNullBattlers(targetPartyBattlers);
        // -- 根据速度进行排序
        targetPartyBattlers.sort((a: Battler, b: Battler) => {
            return a.actor.ActionSpeed > b.actor.ActionSpeed ? -1 : 1;
        });
        for (let i = 0; i < targetPartyBattlers.length; i++) {
            let nextTargetBattler = targetPartyBattlers[i];
            let canUseItemState = this.isCanHitByItem(nextTargetBattler, useItem);
            if (canUseItemState == 0) {
                return nextTargetBattler;
            }
            else if (canUseItemState == 2) {
                return null;
            }
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 判定
    //------------------------------------------------------------------------------------------------------
    /**
     * 是否处于战斗中
     */
    static get isInBattle(): boolean {
        return GameBattle.state != 0;
    }
    /**
     * 是否属于玩家队伍
     * @param battler 战斗者
     * @return [boolean] 
     */
    static isInPlayerParty(battler: Battler): boolean {
        return ProjectPlayer.getPlayerActorIndexByActor(battler.actor) >= 0;
    }
    /**
     * 两个战斗者之间是否队友关系
     * @param so1 战斗者1
     * @param so2 战斗者2
     * @return [boolean] 
     */
    static isFriendlyRelationship(battler1: Battler, battler2: Battler): boolean {
        return battler1.isEnemy == battler2.isEnemy;
    }
    /**
     * 两个战斗者之间是否敌对关系
     * @param so1 战斗者1
     * @param so2 战斗者2
     * @return [boolean] 
     */
    static isHostileRelationship(battler1: Battler, battler2: Battler): boolean {
        return battler1.isEnemy != battler2.isEnemy;
    }
    /**
     * 是否开启了战斗相关的菜单
     */
    static get isOpendBattleMenu(): boolean {
        // 存在战斗者菜单的话
        let battlerMenu = GameUI.get(14) as GUI_14;
        if (battlerMenu && battlerMenu.stage) {
            return true;
        }
        // 存在通用菜单的话
        let commonMenu = GameUI.get(15) as GUI_15;
        if (commonMenu && commonMenu.stage) {
            return true;
        }
        return false;
    }
    /**
     * 判定该目标是否允许被攻击（非死亡目标以及目标不隐身）
     * @param fromBattler 攻击者
     * @param targetBattler 目标战斗者
     */
    static isCanHitByAttack(fromBattler: Battler, targetBattler: Battler): boolean {
        if (!targetBattler || targetBattler.isDead || (!this.hasSeeInvisible(fromBattler) && this.hasInvisible(targetBattler))) return false;
        return true;
    }
    /**
     * 获取允许使用技能作用的目标
     * @param fromBattler 来源者
     * @param targetBattler 目标战斗者
     * @param fromSkill 技能
     * @return [number] 0-允许 1-不允许（但自动找寻下一个目标） 2-不允许（不查找下一个目标）
     */
    static isCanHitBySkill(fromBattler: Battler, targetBattler: Battler, fromSkill: Module_Skill): number {
        // 如果敌对关系且目标隐形的话则不允许
        if (this.isHostileRelationship(fromBattler, targetBattler) && !this.hasSeeInvisible(fromBattler) && this.hasInvisible(targetBattler)) {
            return 1;
        }
        // 目标已死亡的情况
        if (targetBattler.isDead) {
            // -- 如果技能是复活技能则允许
            if (this.isResurrectionSkill(fromSkill)) return 0;
            // -- 否则不允许，自动找寻下一个目标
            return 1;
        }
        // 如果目标未死亡且是作用死亡目标的话则不允许，也不会自动找寻下一个目标
        else if (this.isResurrectionSkill(fromSkill)) {
            return 2;
        }
        // 其他情况：允许
        return 0;
    }
    /**
     * 获取允许使用道具作用的目标
     * @param targetBattler 目标战斗者
     * @param fromItem 道具
     * @return [number] 0-允许 1-不允许（但自动找寻下一个目标） 2-不允许（不查找下一个目标）
     */
    static isCanHitByItem(targetBattler: Battler, fromItem: Module_Item): number {
        if (targetBattler.isDead) {
            // -- 如果道具是复活道具则允许
            if (fromItem.applyDeadBattler) return 0;
            // -- 否则不允许，自动找寻下一个目标
            return 1;
        }
        // 如果目标未死亡且是作用死亡目标的话则不允许，也不会自动找寻下一个目标
        else if (fromItem.applyDeadBattler) {
            return 2;
        }
        // 其他情况：允许
        return 0;
    }
    /**
     * 是否近战行动
     * @param battler 战斗者
     * @param actionType 攻击类别
     * @param skill 技能
     * @return [boolean] 
     */
    static isMeleeAction(battler: Battler, actionType: number, skill: Module_Skill): boolean {
        return actionType == 0 || (skill && skill == battler.actor.atkSkill && GameBattleHelper.isMeleeSkill(skill));
    }
    //------------------------------------------------------------------------------------------------------
    // 技能
    //------------------------------------------------------------------------------------------------------
    /**
     * 是否是作用敌人的技能
     * @param skill 技能
     * @return [boolean] 
     */
    static isHostileSkill(skill: Module_Skill): boolean {
        return skill.skillType <= 1 && (skill.targetType == 2 || skill.targetType == 4 || skill.targetType == 6);
    }
    /**
     * 是否是作用我方的技能
     * @param skill 技能
     * @return [boolean] 
     */
    static isFriendlySkill(skill: Module_Skill): boolean {
        return skill.skillType <= 1 && !this.isHostileSkill(skill);
    }
    /**
     * 是否近战技能
     */
    static isMeleeSkill(skill: Module_Skill): boolean {
        return (skill.isMelee && skill.skillType == 0 && (skill.targetType == 2 || skill.targetType == 4 || skill.targetType == 6))
    }
    /**
     * 是否可连击的技能
     */
    static canMultipleHitSkill(skill: Module_Skill): boolean {
        return (skill.targetType != 0 && skill.skillType == 0 && !skill.isMelee) || (skill.targetType == 1 || skill.targetType == 2);
    }
    /**
     * 是否作用敌方目标的技能
     */
    static isTargetEnemySkill(skill: Module_Skill): boolean {
        return skill.targetType == 2 || skill.targetType == 4 || skill.targetType == 6;
    }
    /**
     * 是否复活技能
     */
    static isResurrectionSkill(skill: Module_Skill): boolean {
        return !GameBattleHelper.isTargetEnemySkill(skill) && skill.applyDeadBattler;
    }
    /**
     * 是否物理攻击
     * actionType 0-普通攻击 1-使用技能 2-使用道具 3-状态
     * skill [可选] 默认值=null 使用的技能
     */
    static isPhysicalAttack(actionType: number, skill: Module_Skill = null): boolean {
        return actionType == 0 || (actionType == 1 && skill && skill.useDamage && skill.damageType == 0);
    }
    //------------------------------------------------------------------------------------------------------
    // 状态
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取战斗者的状态
     * @param battler 战斗者
     * @param statusID 状态编号
     * @return [boolean] 
     */
    static getBattlerStatus(battler: Battler, statusID: number): Module_Status {
        return ArrayUtils.matchAttributes(battler.actor.status, { id: statusID }, true)[0];
    }
    /**
     * 检查战斗者是否包含指定的状态
     * @param battler 战斗者
     * @param statusID 状态编号
     * @return [boolean] 
     */
    static isIncludeStatus(battler: Battler, statusID: number): boolean {
        return ArrayUtils.matchAttributes(battler.actor.status, { id: statusID }, true).length == 1;
    }
    /**
     * 检查战斗者是否允许叠加状态，如果已拥有且最大层的话则不允许
     * @param battler 战斗者
     * @param statusID 状态编号
     * @return [boolean] 
     */
    static canSuperpositionLayer(battler: Battler, statusID: number): boolean {
        let status: Module_Status = ArrayUtils.matchAttributes(battler.actor.status, { id: statusID }, true)[0];
        if (status && status.currentLayer >= status.maxlayer) return false;
        return true;
    }
    /**
     * 获取来自状态的强制行为
     * @param battler 战斗者
     * @return [number] 0-无 1-普通攻击队友 2-随机普通攻击敌人
     */
    static getForceActionType(battler: Battler): number {
        let status: Module_Status = ArrayUtils.matchAttributes(battler.actor.status, { forceAction: 1 }, true)[0];
        if (status) return 1;
        status = ArrayUtils.matchAttributes(battler.actor.status, { forceAction: 2 }, true)[0];
        if (status) return 2;
        return 0;
    }
    //------------------------------------------------------------------------------------------------------
    // 是否允许行动
    //------------------------------------------------------------------------------------------------------
    /**
     * 是否允许行动
     * @param battler 战斗者
     * @return [boolean] 
     */
    static canAction(battler: Battler): boolean {
        return this.getForceActionType(battler) == 0 && (this.canAttack(battler) || this.canUseSkill(battler) || this.canUseItem(battler) || this.canUseDefense(battler));
    }
    /**
     * 是否允许攻击
     * @param battler 战斗者
     * @return [boolean] 
     */
    static canAttack(battler: Battler): boolean {
        // 当前回合已行动或已待机或死亡的话则不允许
        if (battler.isDead) return false;
        // 使用技能代替普通攻击的模式下，未冷却的话不允许攻击
        let actor = battler.actor;
        if (actor.atkMode == 1 && (!actor.atkSkill || actor.atkSkill.currentCD != 0 || actor.atkSkill.costSP > battler.actor.sp || actor.atkSkill.costHP >= battler.actor.hp)) return false;
        // 存在无法攻击的状态则不允许
        return ArrayUtils.matchAttributes(battler.actor.status, { cantAtk: true }, true).length == 0;
    }
    /**
     * 是否允许使用技能
     * @param battler 战斗者
     * @return [boolean] 
     */
    static canUseSkill(battler: Battler): boolean {
        // 已死亡的话则不允许
        if (battler.isDead) return false;
        // 存在无法使用技能的状态则不允许
        if (ArrayUtils.matchAttributes(battler.actor.status, { cantUseSkill: true }, true).length == 1) return false;
        return true;
    }
    /**
     * 是否允许使用技能
     * @param battler 战斗者
     * @param skill 技能
     * @param checkUseSkillCommconCondition [可选] 默认值=true 检查使用技能的通用条件
     * @param calcSkillCost [可选] 默认值=true 计算技能是否满足消耗
     * @return [boolean] 
     */
    static canUseOneSkill(battler: Battler, skill: Module_Skill, checkUseSkillCommconCondition: boolean = true, calcSkillCost: boolean = true): boolean {
        // 非战斗者不允许
        if (checkUseSkillCommconCondition && !this.canUseSkill(battler)) return false;
        // 被动技能不允许
        if (skill.skillType == 2) return false;
        // 技能未冷却、不足的消耗、行动力不允许的情况不允许使用
        return !(skill.currentCD != 0 || skill.costSP > battler.actor.sp || skill.costHP >= battler.actor.hp);
    }
    /**
     * 是否允许使用道具
     * @param battler 战斗者
     * @return [boolean] 
     */
    static canUseItem(battler: Battler): boolean {
        // 已死亡的话则不允许
        if (battler.isDead) return false;
        // 存在无法使用道具的状态则不允许
        if (ArrayUtils.matchAttributes(battler.actor.status, { cantUseItem: true }, true).length == 1) return false;
        return true;
    }
    /**
     * 道具是否可用：行动力允许
     * @param battler 战斗者
     * @param item 道具
     * @param checkUseItemCommconCondition [可选] 默认值=true 检查使用道具的通用条件
     * @return [boolean] 
     */
    static canUseOneItem(battler: Battler, item: Module_Item, checkUseItemCommconCondition: boolean = true): boolean {
        // 不允许使用的话
        if (!item.isUse || item.useType == 1) return false;
        // 通用条件
        if (checkUseItemCommconCondition && !this.canUseItem(battler)) return false;
        // 已死亡的话不允许
        if (battler.isDead) return false;
        return true;
    }
    /**
     * 是否允许防御
     * @param battler 战斗者
     * @return [boolean] 
     */
    static canUseDefense(battler: Battler): boolean {
        // 已死亡的话则不允许
        if (battler.isDead) return false;
        // 存在无法防御的状态则不允许
        if (ArrayUtils.matchAttributes(battler.actor.status, { cantUseDefense: true }, true).length == 1) return false;
        return true;
    }
    //------------------------------------------------------------------------------------------------------
    //  特殊效果
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取战斗者的反击信息（遭受近战攻击后的反击）
     * @param fromBattler 攻击者
     * @param targetBattler 受击者
     * @return [number] 反击伤害百分比（对比自己的普通攻击伤害） null=无反击
     */
    static getCounterattackDamagePer(fromBattler: Battler, targetBattler: Battler): number {
        // -- 攻击者拥有无视反击的能力时不会遭受反击
        for (let i = 0; i < fromBattler.actor.skills.length; i++) {
            let skill = fromBattler.actor.skills[i];
            if (skill.specialAbility && ArrayUtils.matchAttributes(skill.specialBattleEffect, { type: 1 }, true).length == 1) {
                return null;
            }
        }
        for (let i = 0; i < fromBattler.actor.status.length; i++) {
            let status = fromBattler.actor.status[i];
            if (status.specialAbility && ArrayUtils.matchAttributes(status.specialBattleEffect, { type: 1 }, true).length == 1) {
                return null;
            }
        }
        // -- 尝试触发反击（根据伤害高低排序后逐一尝试触发）
        let specialBattleEffects: DataStructure_specialBattleEffect[] = this.getSpecialBattleEffects(targetBattler, 0);;
        if (specialBattleEffects.length == 0) return null;
        specialBattleEffects.sort((a, b) => { return a.counterattackDmagePer > b.counterattackDmagePer ? -1 : 1 });
        for (let i = 0; i < specialBattleEffects.length; i++) {
            if (MathUtils.rand(100) < specialBattleEffects[i].counterattackPer) {
                return specialBattleEffects[i].counterattackDmagePer;
            }
        }
        return null;
    }
    /**
     * 获取战斗者的反伤信息（遭受近战攻击后的反伤）
     * @param fromBattler 攻击者
     * @param targetBattler 受击者
     * @return [number] 反伤百分比（对比自己的普通攻击伤害） null=无反伤
     */
    static getReturnAttackDamagePer(fromBattler: Battler, targetBattler: Battler): number {
        // -- 攻击者拥有无视反伤的能力时不会遭受反伤
        for (let i = 0; i < fromBattler.actor.skills.length; i++) {
            let skill = fromBattler.actor.skills[i];
            if (skill.specialAbility && ArrayUtils.matchAttributes(skill.specialBattleEffect, { type: 3 }, true).length == 1) {
                return null;
            }
        }
        for (let i = 0; i < fromBattler.actor.status.length; i++) {
            let status = fromBattler.actor.status[i];
            if (status.specialAbility && ArrayUtils.matchAttributes(status.specialBattleEffect, { type: 3 }, true).length == 1) {
                return null;
            }
        }
        // -- 尝试触发反伤（根据伤害高低排序后逐一尝试触发）
        let specialBattleEffects: DataStructure_specialBattleEffect[] = this.getSpecialBattleEffects(targetBattler, 2);
        if (specialBattleEffects.length == 0) {
            return null;
        }
        specialBattleEffects.sort((a, b) => { return a.returnDamagePer > b.returnDamagePer ? -1 : 1 });
        for (let i = 0; i < specialBattleEffects.length; i++) {
            if (MathUtils.rand(100) < specialBattleEffects[i].returnPer) {
                return specialBattleEffects[i].returnDamagePer;
            }
        }
        return null;
    }
    /**
     * 获取吸血百分比
     * @param fromBattler 战斗者
     * @param damageType 限定类别 0-物理伤害 1-魔法伤害 2-真实伤害
     * @param isHP 是否生命值，否则就是魔法值
     * @param isMelee 是否近战
     * @return [number] 
     */
    static getSuckPer(fromBattler: Battler, damageType: number, isHP: boolean, isMelee: boolean): number {
        let type = isHP ? 4 : 5;
        let specialBattleEffects: DataStructure_specialBattleEffect[] = this.getSpecialBattleEffects(fromBattler, type);
        for (var i = 0; i < specialBattleEffects.length; i++) {
            let specialBattleEffect = specialBattleEffects[i];
            if ((specialBattleEffect.suckCondition <= 2 && damageType != specialBattleEffect.suckCondition) ||
                (specialBattleEffect.suckCondition == 3 && !isMelee)) {
                specialBattleEffects.splice(i, 1);
                i--;
            }
        }
        if (specialBattleEffects.length == 0) return null;
        let suckPer = 0;
        for (let i = 0; i < specialBattleEffects.length; i++) {
            suckPer += specialBattleEffects[i].suckPer;
        }
        return suckPer;
    }
    /**
     * 获取普通攻击连击的概率
     * @param fromBattler 战斗者
     * @return [number] 
     */
    static getNormalAttackTimes(fromBattler: Battler): number {
        let specialBattleEffects: DataStructure_specialBattleEffect[] = this.getSpecialBattleEffects(fromBattler, 6);
        for (let i = 0; i < specialBattleEffects.length; i++) {
            if (MathUtils.rand(100) < specialBattleEffects[i].attackTimesPer) {
                return 2;
            }
        }
        return 1;
    }
    /**
     * 获取是否隐形
     */
    static hasInvisible(fromBattler: Battler): boolean {
        let specialBattleEffects: DataStructure_specialBattleEffect[] = this.getSpecialBattleEffects(fromBattler, 7);
        return specialBattleEffects.length != 0;
    }
    /**
     * 获取是否可以感知隐形
     */
    static hasSeeInvisible(fromBattler: Battler): boolean {
        let specialBattleEffects: DataStructure_specialBattleEffect[] = this.getSpecialBattleEffects(fromBattler, 8);
        return specialBattleEffects.length != 0;
    }
    /**
     * 获取伤害加成数值
     */
    static getDamagePer(fromBattler: Battler): number {
        let specialBattleEffects: DataStructure_specialBattleEffect[] = this.getSpecialBattleEffects(fromBattler, 9);
        let damagePer = 100;
        for (let i = 0; i < specialBattleEffects.length; i++) {
            damagePer *= specialBattleEffects[i].damagePer * 0.01;
        }
        return damagePer;
    }
    /**
     * 获取减少伤害数值
     */
    static getStrikePer(fromBattler: Battler): number {
        let specialBattleEffects: DataStructure_specialBattleEffect[] = this.getSpecialBattleEffects(fromBattler, 10);
        let strikePer = 100;
        for (let i = 0; i < specialBattleEffects.length; i++) {
            strikePer *= specialBattleEffects[i].strikePer * 0.01;
        }
        return strikePer;
    }
    /**
     * 获取死亡复活恢复的生命值
     */
    static getResurrectionHealthPer(fromBattler: Battler): number {
        let specialBattleEffects: DataStructure_specialBattleEffect[] = this.getSpecialBattleEffects(fromBattler, 11);
        for (let i = 0; i < specialBattleEffects.length; i++) {
            if (MathUtils.rand(100) < specialBattleEffects[i].resurrectionPer) {
                return specialBattleEffects[i].healthPer;
            }
        }
        return null;
    }
    /**
     * 元素伤害有效度
     * @param fromBattler 来自战斗者
     * @param elementType 元素类别
     * @return [number] 
     */
    static getElementEffectivenessPer(fromBattler: Battler, elementType: number): number {
        let specialBattleEffects: DataStructure_specialBattleEffect[] = this.getSpecialBattleEffects(fromBattler, 12);
        let v = 100;
        for (let i = 0; i < specialBattleEffects.length; i++) {
            if (specialBattleEffects[i].elementType == elementType) {
                v *= specialBattleEffects[i].effectiveness * 0.01;
            }
        }
        return v;
    }
    //------------------------------------------------------------------------------------------------------
    // 获取下一个战斗角色
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取下一个玩家可控角色
     * @return [Battler] 
     */
    static get nextPlayerControlBattler(): Battler {
        for (let i = 0; i < GameBattle.playerBattlers.length; i++) {
            let battler = GameBattle.playerBattlers[i];
            // 如果无法行动且不能强制发出指令时
            if (!GameBattleHelper.canAction(battler) && !WorldData.forceSendActionCommand) {
                battler.commandControlComplete = true;
                battler.battleCommandType = null;
                continue;
            }
            // 如果电脑控制或已操作完成的话则忽略
            if (battler.actor.AI || battler.commandControlComplete) continue;
            return battler;
        }
    }
    /**
     * 获取指定类型的特殊效果集合，根据战斗者拥有的技能和状态集内附带的特殊效果
     * @param battler 战斗者
     * @param specialType 类别
     */
    private static getSpecialBattleEffects(battler: Battler, specialType: number): DataStructure_specialBattleEffect[] {
        let specialBattleEffects: DataStructure_specialBattleEffect[] = [];
        for (let i = 0; i < battler.actor.skills.length; i++) {
            let skill = battler.actor.skills[i];
            if (!skill.specialAbility) continue;
            specialBattleEffects = specialBattleEffects.concat(ArrayUtils.matchAttributes(skill.specialBattleEffect, { type: specialType }, false));
        }
        for (let i = 0; i < battler.actor.status.length; i++) {
            let status = battler.actor.status[i];
            if (!status.specialAbility) continue;
            specialBattleEffects = specialBattleEffects.concat(ArrayUtils.matchAttributes(status.specialBattleEffect, { type: specialType }, false));
        }
        return specialBattleEffects;
    }
}