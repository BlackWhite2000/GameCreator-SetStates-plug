/**
 * 项目层游戏管理器实现类
 * -- 为了让系统API属性的类别直接指向项目层的实现类
 *    游戏内会经常用到Game.player以及Game.currentScene，实现此类可指向项目层自定义的「玩家类」和「场景类」
 *    
 * 
 * Created by 黑暗之神KDS on 2020-09-08 17:00:46.
 */
class ProjectGame extends GameBase {
    //------------------------------------------------------------------------------------------------------
    // 事件：角色
    //------------------------------------------------------------------------------------------------------
    /**
     * 事件：卸下了角色的道具 onRemoveActorItem(actor: Module_Actor, itemIndex: number, item: Module_Item);
     */
    EVENT_REMOVE_ACTOR_ITEM: string = "GameEVENT_REMOVE_ACTOR_ITEM";
    /**
     * 事件：安装了角色的道具 onCarryActorItem(actor: Module_Actor, itemIndex: number, removeItem: Module_Item, newItem: Module_Item);
     */
    EVENT_CARRY_ACTOR_ITEM: string = "GameEVENT_CARRY_ACTOR_ITEM";
    /**
     * 事件：学习了技能 onLearnSkill(actor: Module_Actor, newSkill: Module_Skill);
     */
    EVENT_LEARN_SKILL: string = "GameEVENT_LEARN_SKILL";
    /**
     * 事件：忘记了技能 onForgetSkill(actor: Module_Actor, forgetSkill: Module_Skill);
     */
    EVENT_FORGET_SKILL: string = "GameEVENT_FORGET_SKILL";
    /**
     * 事件：替换普通攻击 onReplaceAttackSkill(actor: Module_Actor, skill: Module_Skill);
     */
    EVENT_REPLACE_ATTACK_SKILL: string = "GameEVENT_REPLACE_ATTACK_SKILL";
    /**
     * 事件：穿戴了装备 onWearActorEquip(actor: Module_Actor, partID: number, takeOffEquip: Module_Equip, newEquip: Module_Equip);
     */
    EVENT_WEAR_ACTOR_EQUIP: string = "GameEVENT_WEAR_ACTOR_EQUIP";
    /**
     * 事件：卸下了装备 onTakeOffActorEquip(actor: Module_Actor, partID: number, takeOffEquip: Module_Equip);
     */
    EVENT_TAKE_OFF_ACTOR_EQUIP: string = "GameEVENT_TAKE_OFF_ACTOR_EQUIP";
    //------------------------------------------------------------------------------------------------------
    // 
    //------------------------------------------------------------------------------------------------------
    /**
     * 游戏开始时间（新游戏时记录，读档后记录档案的时间会计算差值以便获得游戏总游玩时间）
     */
    static gameStartTime: Date;
    /**
    * 当前的场景对象：重写，以便类别能够对应项目层自定义的子类
    */
    declare currentScene: ProjectClientScene;
    /**
     * 玩家对象：重写，便类别能够对应项目层自定义的子类
     */
    declare player: ProjectPlayer;
    /**
     * 构造函数
     */
    constructor() {
        super();
        EventUtils.addEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, this.onInSceneStateChange, this);
    }
    /**
     * 初始化
     */
    init() {
        // 创建的玩家是这个项目层自定义类的实例
        this.player = new ProjectPlayer();
    }
    //------------------------------------------------------------------------------------------------------
    //  获取角色
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取玩家的角色
     * @param actorCheckType 检查类别 0-通过角色编号获取玩家队伍的角色 1-通过角色所在队伍的位置 2-通过场景对象编号查找
     * @param actorIDUseVar  检查类别0的参数：指定角色编号的模式 0-常量 1-变量
     * @parma actorID        检查类别0的参数：角色编号
     * @param actorIDVarID   检查类别0的参数：记录角色编号的数值变量编号
     * @param actorInPartyIndexVarIDUseVar   检查类别1的参数：指定角色所在玩家队伍位置的模式 0-常量 1-变量
     * @param actorInPartyIndex              检查类别1的参数：角色所在玩家队伍的位置
     * @param actorInPartyIndexVarID         检查类别1的参数：记录角色所在玩家队伍位置的数值变量编号
     * @param enemyInPartyIndex              检查类别2的参数：指定角色所在敌人队伍位置的模式 0-常量 1-变量
     * @param enemyInPartyIndexVarID         检查类别2的参数：角色所在敌人队伍的位置
     * @param enemyInPartyIndexVarIDUseVar   检查类别2的参数：记录角色所在敌人队伍位置的数值变量编号
     */
    getActorByCheckType(actorCheckType: number, actorIDUseVar: number, actorID: number, actorIDVarID: number,
        actorInPartyIndexVarIDUseVar: number, actorInPartyIndex: number, actorInPartyIndexVarID: number,
        enemyInPartyIndexVarIDUseVar: number, enemyInPartyIndex: number, enemyInPartyIndexVarID: number): Module_Actor {
        // 通过角色编号获取玩家队伍的角色
        if (actorCheckType == 0) {
            let pActorID = MathUtils.int(actorIDUseVar ? Game.player.variable.getVariable(actorIDVarID) : actorID);
            let playerActorDS = ProjectPlayer.getPlayerActorDSByActorID(pActorID);
            return playerActorDS ? playerActorDS.actor : null;
        }
        // 通过所在玩家队伍的编号查找角色
        else if (actorCheckType == 1) {
            let pActorInPartyIndex = MathUtils.int(actorInPartyIndexVarIDUseVar ? Game.player.variable.getVariable(actorInPartyIndexVarID) : actorInPartyIndex);
            let playerActorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(pActorInPartyIndex);
            return playerActorDS ? playerActorDS.actor : null;
        }
        // 通过所在敌人队伍的编号查找角色
        else if (actorCheckType == 2) {
            if (!GameBattleHelper.isInBattle) return null;
            let pEnemyActorInPartyIndex = MathUtils.int(enemyInPartyIndexVarIDUseVar ? Game.player.variable.getVariable(enemyInPartyIndexVarID) : enemyInPartyIndex);
            let battler = GameBattle.enemyBattlers[pEnemyActorInPartyIndex];
            if (battler) return battler.actor
            return null;
        }
        // 获取行动瞬间时的行动者
        else if (actorCheckType == 3) {
            if (!GameBattleHelper.isInBattle) return null;
            let battler = GameBattleAction.fromBattler;
            if (battler) return battler.actor
            return null;
        }
        // 获取行动瞬间时被击中者
        else if (actorCheckType == 4) {
            if (!GameBattleHelper.isInBattle) return null;
            let battler = GameBattleAction.hitBattler;
            if (battler) return battler.actor
            return null;
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 角色的技能
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取角色的技能：根据技能编号
     * @param actor 角色
     * @param skillID 技能编号
     * @return [Module_Skill] 
     */
    getActorSkillBySkillID(actor: Module_Actor, skillID: number): Module_Skill {
        return ArrayUtils.matchAttributes(actor.skills, { id: skillID }, true)[0];
    }
    /**
     * 角色学习技能
     * @param actor 角色
     * @param skillID 技能编号
     * @param happenEvent [可选] 默认值=true 是否派发事件
     * @return [Module_Skill] 
     */
    actorLearnSkill(actor: Module_Actor, skillID: number, happenEvent: boolean = true): Module_Skill {
        let skill = this.getActorSkillBySkillID(actor, skillID);
        if (skill || !GameData.getModuleData(8, skillID)) return;
        let newSkill = GameData.newModuleData(8, skillID);
        actor.skills.push(newSkill);
        if (happenEvent) EventUtils.happen(Game, Game.EVENT_LEARN_SKILL, [actor, newSkill]);
        return newSkill;
    }
    /**
     * 角色忘记技能
     * @param actor 角色
     * @param skillID 技能编号
     * @param happenEvent [可选] 默认值=true 是否派发事件
     * @return [Module_Skill] 忘却的技能
     */
    actorForgetSkill(actor: Module_Actor, skillID: number, happenEvent: boolean = true): Module_Skill {
        let skill = this.getActorSkillBySkillID(actor, skillID);
        if (!skill || !GameData.getModuleData(8, skillID)) return;
        actor.skills.splice(actor.skills.indexOf(skill), 1);
        if (happenEvent) EventUtils.happen(Game, Game.EVENT_FORGET_SKILL, [actor, skill]);
        return skill;
    }
    /**
     * 角色忘记全部技能
     * @param actor 角色
     * @param happenEvent [可选] 默认值=true 是否派发事件
     * @return [Module_Skill] 忘却的技能集合
     */
    actorForgetAllSkills(actor: Module_Actor, happenEvent: boolean = true): Module_Skill[] {
        let forgetSkills = actor.skills.concat();
        actor.skills.length = 0;
        for (let i = 0; i < forgetSkills.length; i++) {
            if (happenEvent) EventUtils.happen(Game, Game.EVENT_FORGET_SKILL, [actor, forgetSkills[i]]);
        }
        return forgetSkills;
    }
    /**
     * 替换普通技能
     * @param actor 角色
     * @param skillID 技能编号
     * @return [Module_Skill] 
     */
    actorReplaceAttackSkill(actor: Module_Actor, skillID: number, happenEvent: boolean = true): Module_Skill[] {
        if (!GameData.getModuleData(8, skillID)) return;
        let newSkill = GameData.newModuleData(8, skillID);
        actor.atkSkill = newSkill;
        actor.atkMode = 1;
        if (happenEvent) EventUtils.happen(Game, Game.EVENT_REPLACE_ATTACK_SKILL, [actor, newSkill]);
        return newSkill;
    }
    //------------------------------------------------------------------------------------------------------
    // 角色的装备
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取角色的装备：根据装备部位
     * @param actor 角色
     * @param partID 装备部位
     * @return [Module_Equip] 
     */
    getActorEquipByPartID(actor: Module_Actor, partID: number): Module_Equip {
        return ArrayUtils.matchAttributes(actor.equips, { partID: partID }, true)[0];
    }
    /**
     * 获取角色的装备：根据装备的编号
     * @param actor 角色
     * @param equipID 装备编号
     * @return [Module_Equip] 
     */
    getActorEquipByEquipID(actor: Module_Actor, equipID: number): Module_Equip {
        return ArrayUtils.matchAttributes(actor.equips, { id: equipID }, true)[0];
    }
    /**
     * 穿戴角色装备
     * @param actor 角色数据
     * @param newEquip 新的装备
     * @param happenEvent [可选] 默认值=true 是否派发事件
     * @return success=是否更换成功 removeEquip=更换下来的装备
     */
    wearActorEquip(actor: Module_Actor, newEquip: Module_Equip, happenEvent: boolean = true): { success: boolean, takeOffEquip: Module_Equip } {
        if (newEquip) {
            let takeOffEquip = this.takeOffActorEquipByPartID(actor, newEquip.partID);
            actor.equips.push(newEquip);
            if (happenEvent) EventUtils.happen(Game, Game.EVENT_WEAR_ACTOR_EQUIP, [actor, newEquip.partID, takeOffEquip, newEquip]);
            return { success: true, takeOffEquip: takeOffEquip };
        }
    }
    /**
     * 卸下装备
     * @param actor 角色
     * @param partID 部位
     * @param happenEvent [可选] 默认值=true 是否派发事件
     * @return [Module_Equip] 
     */
    takeOffActorEquipByPartID(actor: Module_Actor, partID: number, happenEvent: boolean = true): Module_Equip {
        let idx = ArrayUtils.matchAttributes(actor.equips, { partID: partID }, true, "==", true)[0];
        if (idx == null) return null;
        let takeOffEquip = actor.equips.splice(idx, 1)[0];
        if (takeOffEquip && happenEvent) EventUtils.happen(Game, Game.EVENT_TAKE_OFF_ACTOR_EQUIP, [actor, partID, takeOffEquip]);
        return takeOffEquip;
    }
    /**
     * 卸下全部装备
     * @param actor 角色
     * @param happenEvent [可选] 默认值=true 是否派发事件
     * @return [Module_Equip] 
     */
    takeOffActorAllEquips(actor: Module_Actor, happenEvent: boolean = true): Module_Equip[] {
        let takeOffEquipArr = actor.equips.concat();
        actor.equips.length = 0;
        for (let i = 0; i < takeOffEquipArr.length; i++) {
            let takeOffEquip = takeOffEquipArr[i];
            if (happenEvent) EventUtils.happen(Game, Game.EVENT_TAKE_OFF_ACTOR_EQUIP, [actor, takeOffEquip.partID, takeOffEquip]);
        }
        return takeOffEquipArr;
    }
    //------------------------------------------------------------------------------------------------------
    // 角色的属性
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取下一等级所需经验值
     * @param actor 角色数据
     * @param lv 当前等级
     * @return [number] 
     */
    getLevelUpNeedExp(actor: Module_Actor, lv: number): number {
        return Math.floor(this.getGrowValueByLv(actor, "needEXPGrow", lv));
    }
    /**
     * 刷新角色属性
     * -- 基础属性
     * -- 加点属性
     * -- 装备加成
     * -- 状态加成
     */
    refreshActorAttribute(actor: Module_Actor, lv: number = null): void {
        if (lv == null) lv = GameBattleHelper.getLevelByActor(actor);
        // 获取数据库预设的数据
        let res = this.clacActorAttribute(actor, lv);
        // 写入属性至该角色数据里
        if (res) {
            actor.ATK = Math.floor(res.ATK);
            actor.DEF = Math.floor(res.DEF);
            actor.AGI = Math.floor(res.AGI);
            actor.DOD = Math.floor(res.DOD);
            actor.MaxHP = Math.floor(res.MaxHP);
            actor.MaxSP = Math.floor(res.MaxSP);
            actor.POW = Math.floor(res.POW);
            actor.END = Math.floor(res.END);
            actor.MAG = Math.floor(res.MAG);
            actor.MagDef = Math.floor(res.MagDef);
            actor.HIT = Math.floor(res.HIT);
            actor.CRIT = Math.floor(res.CRIT);
            actor.MagCrit = Math.floor(res.MagCrit);
            actor.ActionSpeed = Math.floor(res.ActionSpeed);
            // 因为状态而增加的最大生命值，当前生命值应增加上
            let statusMaxHP = Math.floor(res.statusAddMaxHP);
            if (statusMaxHP > 0) {
                actor.hp += statusMaxHP;
            }
            actor.hp = Math.min(actor.MaxHP, Math.max(actor.hp, 0));
            actor.sp = Math.min(actor.MaxSP, Math.max(actor.sp, 0));
        }
    }
    /**
     * 计算角色属性
     * @param actor 角色
     * @param lv 等级
     * @param previewChangeEquipMode [可选] 默认值=false 是否预览替换的装备模式
     * @param previewChangeEquipID [可选] 默认值=0 预览替换的装备部位ID
     * @param previewChangeEquip [可选] 默认值=null 预览替换的装备属性
     */
    clacActorAttribute(actor: Module_Actor, lv: number, previewChangeEquipMode: boolean = false, previewChangeEquipID: number = 0, previewChangeEquip: Module_Equip = null) {
        // 获取数据库预设的数据
        let systemActor = GameData.getModuleData(6, actor.id) as Module_Actor;
        if (!systemActor) return;
        // 获取原始属性
        let fromStatusMaxHP: number = 0;
        let fromStatusMaxHPper: number = 100;
        let maxhp: number;
        let maxsp: number;
        let mag: number;
        let agi: number;
        let pow: number;
        let end: number;
        let magDef: number;
        let hit: number;
        let crit: number;
        let magCrit: number;
        let actionSpeed: number;
        // -- 成长型的角色
        if (actor.growUpEnabled) {
            maxhp = this.getGrowValueByLv(actor, "MaxHPGrow", lv) + actor.increaseMaxHP;
            maxsp = this.getGrowValueByLv(actor, "MaxSPGrow", lv) + actor.increaseMaxSP;
            mag = this.getGrowValueByLv(actor, "MAGGrow", lv) + actor.increaseMag;
            agi = this.getGrowValueByLv(actor, "AGIGrow", lv) + actor.increaseAgi;
            pow = this.getGrowValueByLv(actor, "POWGrow", lv) + actor.increasePow;
            end = this.getGrowValueByLv(actor, "ENDGrow", lv) + actor.increaseEnd;
        }
        // -- 非成长型角色（固定值）
        else {
            maxhp = systemActor.MaxHP + actor.increaseMaxHP;
            maxsp = systemActor.MaxSP + actor.increaseMaxSP;
            mag = systemActor.MAG + actor.increaseMag;
            agi = systemActor.AGI + actor.increaseAgi;
            pow = systemActor.POW + actor.increasePow;
            end = systemActor.END + actor.increaseEnd;
        }
        // 其他战斗属性（通用固定值）
        magDef = systemActor.MagDef;
        hit = systemActor.HIT;
        crit = 0;
        magCrit = 0;
        actionSpeed = systemActor.ActionSpeed;
        // 刷新装备和技能以及状态，剔除相同的元素
        ArrayUtils.removeSameObjectD2(actor.equips, "id", false);
        ArrayUtils.removeSameObjectD2(actor.skills, "id", false);
        ArrayUtils.removeSameObjectD2(actor.status, "id", false);
        // 追加来自装备的属性和状态：加法
        let atkIncrease = 0;
        let defIncrease = 0;
        actor.selfStatus.length = 0;
        actor.selfImmuneStatus.length = 0;
        actor.hitTargetStatus.length = 0;
        actor.hitTargetSelfAddStatus.length = 0;
        let equipPartsLength = GameData.getLength(19);
        for (let i = 1; i <= equipPartsLength; i++) {
            let equip: Module_Equip;
            // 预览模式下该部件使用指定的装备（可能无装备）
            if (previewChangeEquipMode && previewChangeEquipID == i) {
                equip = previewChangeEquip;
            }
            // 否则使用当前该部位上已佩戴的装备
            else {
                equip = Game.getActorEquipByPartID(actor, i);
            }
            // 存在装备的话，属性加成
            if (equip) {
                // -- 装备被动属性
                maxhp += equip.maxHP;
                maxsp += equip.maxSP;
                atkIncrease += equip.atk;
                defIncrease += equip.def;
                mag += equip.mag;
                magDef += equip.magDef;
                actionSpeed += equip.actionSpeed;
                hit += equip.hit;
                agi += equip.agi;
                crit += equip.crit;
                magCrit += equip.magCrit;
                // -- 装备状态
                if (equip.passiveStatus) {
                    actor.selfStatus = actor.selfStatus.concat(equip.selfStatus);
                    actor.selfImmuneStatus = actor.selfImmuneStatus.concat(equip.selfImmuneStatus);
                    actor.hitTargetStatus = actor.hitTargetStatus.concat(equip.hitTargetStatus);
                    actor.hitTargetSelfAddStatus = actor.hitTargetSelfAddStatus.concat(equip.hitTargetSelfAddStatus);
                }
            }
        }
        // 追加来自技能的属性、状态、元素有效度
        let skills = actor.skills;
        if (actor.atkMode == 1 && actor.atkSkill) skills = skills.concat(actor.atkSkill);
        for (let i = 0; i < skills.length; i++) {
            let actorSkill = skills[i];
            // -- 技能被动属性
            if (actorSkill.passiveAttribute) {
                maxhp += actorSkill.maxHP;
                maxsp += actorSkill.maxSP;
                atkIncrease += actorSkill.atk;
                defIncrease += actorSkill.def;
                mag += actorSkill.mag;
                magDef += actorSkill.magDef;
                actionSpeed += actorSkill.actionSpeed;
                hit += actorSkill.hitC;
                agi += actorSkill.agi;
                crit += actorSkill.crit;
                magCrit += actorSkill.magCrit;
            }
            // -- 技能被动状态
            if (actorSkill.passiveStatus) {
                actor.selfStatus = actor.selfStatus.concat(actorSkill.selfStatus);
                actor.selfImmuneStatus = actor.selfImmuneStatus.concat(actorSkill.selfImmuneStatus);
                actor.hitTargetStatus = actor.hitTargetStatus.concat(actorSkill.hitTargetStatus);
                actor.hitTargetSelfAddStatus = actor.hitTargetSelfAddStatus.concat(actorSkill.hitTargetSelfAddStatus);
            }
        }
        // 转换计算
        let atk = pow * 1.5 + atkIncrease;
        let def = end * 2 + defIncrease;
        let dod = agi * 0.1;
        actionSpeed += agi * 0.5;
        // 追加来自状态的属性 %
        let stHPPer = 100;
        let stSPPer = 100;
        let stATKPer = 100;
        let stDEFPer = 100;
        let stMAGPer = 100;
        let stMagDefPer = 100;
        let stActionSpeedPer = 100;
        let stHitPer = 100;
        let stCritPer = 100;
        let stMagCritPer = 100;
        for (let i = 0; i < actor.status.length; i++) {
            let status = actor.status[i];
            stHPPer *= Math.pow(status.maxHPPer / 100, status.currentLayer);
            stSPPer *= Math.pow(status.maxSPPer / 100, status.currentLayer);
            stATKPer *= Math.pow(status.atkPer / 100, status.currentLayer);
            stDEFPer *= Math.pow(status.defPer / 100, status.currentLayer);
            stMAGPer *= Math.pow(status.magPer / 100, status.currentLayer);
            stMagDefPer *= Math.pow(status.magDefPer / 100, status.currentLayer);
            stActionSpeedPer *= Math.pow(status.actionSpeedPer / 100, status.currentLayer);
            stHitPer *= Math.pow(status.hitPer / 100, status.currentLayer);
            stCritPer *= Math.pow(status.critPer / 100, status.currentLayer);
            stMagCritPer *= Math.pow(status.magCritPer / 100, status.currentLayer);
            maxhp += status.maxHP * status.currentLayer;
            maxsp += status.maxSP * status.currentLayer;
            atk += status.atk * status.currentLayer;
            def += status.def * status.currentLayer;
            mag += status.mag * status.currentLayer;
            magDef += status.magDef * status.currentLayer;
            actionSpeed += status.actionSpeed * status.currentLayer;
            hit += status.hit * status.currentLayer;
            crit += status.crit * status.currentLayer;
            magCrit += status.magCrit * status.currentLayer;
            // 记录由状态变更的最大生命值（永续的不会恢复生命值）
            if (status.totalDuration != 0) {
                fromStatusMaxHP += status.maxHP * status.currentLayer;
                fromStatusMaxHPper *= Math.pow(status.maxHPPer / 100, status.currentLayer);
            }
        }
        fromStatusMaxHP += maxhp * fromStatusMaxHPper / 100 - maxhp;
        maxhp *= stHPPer / 100;
        maxsp *= stSPPer / 100;
        atk *= stATKPer / 100;
        def *= stDEFPer / 100;
        mag *= stMAGPer / 100;
        magDef *= stMagDefPer / 100;
        actionSpeed *= stActionSpeedPer / 100;
        hit *= stHitPer / 100;
        crit *= stCritPer / 100;
        magCrit *= stMagCritPer / 100;
        // 限制
        atk = Math.max(atk, 0);
        def = Math.max(def, 0);
        agi = Math.max(agi, 0);
        dod = Math.max(dod, 0);
        maxhp = Math.max(maxhp, 0);
        maxsp = Math.max(maxsp, 0);
        pow = Math.max(pow, 0);
        end = Math.max(end, 0);
        mag = Math.max(mag, 0);
        magDef = Math.max(magDef, 0);
        hit = Math.max(hit, 0);
        crit = Math.max(Math.min(crit, 100), 0);
        magCrit = Math.max(Math.min(magCrit, 100), 0);
        actionSpeed = Math.max(actionSpeed, 0);
        // 返回结果
        return {
            ATK: Math.floor(atk),
            DEF: Math.floor(def),
            AGI: Math.floor(agi),
            DOD: Math.floor(dod),
            MaxHP: Math.floor(maxhp),
            MaxSP: Math.floor(maxsp),
            POW: Math.floor(pow),
            END: Math.floor(end),
            MAG: Math.floor(mag),
            MagDef: Math.floor(magDef),
            HIT: Math.floor(hit),
            CRIT: Math.floor(crit),
            MagCrit: Math.floor(magCrit),
            ActionSpeed: Math.floor(actionSpeed),
            statusAddMaxHP: Math.floor(fromStatusMaxHP)
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 私有实现
    //------------------------------------------------------------------------------------------------------
    /**
     * 监听事件：进入场景的状态改变时派发事件
     * @param inNewSceneState 
     */
    private onInSceneStateChange(inNewSceneState: number) {
        // 状态：离开场景时（标题时视为离开空场景）
        if (GameGate.gateState == GameGate.STATE_0_START_EXECUTE_LEAVE_SCENE_EVENT) {
            // 新游戏的话：记录当前时间为启动时间
            if (inNewSceneState == 1) {
                ProjectGame.gameStartTime = new Date();
                ProjectPlayer.init();
            }
            // 读取存档的情况：以当前的时间减去已游戏时间来记录
            else if (inNewSceneState == 2) {
                ProjectGame.gameStartTime = new Date((Date.now() - GUI_SaveFileManager.currentSveFileIndexInfo.indexInfo.gameTime));
            }
        }
        // 状态：加载场景完毕
        else if (GameGate.gateState == GameGate.STATE_3_IN_SCENE_COMPLETE) {
            // -- 新游戏/读档：数据变为副本模式
            if (inNewSceneState == 1 || inNewSceneState == 2) {
                // 将角色转为副本模式，以便支持存档
                for (let i = 0; i < Game.player.data.party.length; i++) {
                    let actorDS = Game.player.data.party[i];
                    if (actorDS == null) continue;
                    GameData.changeModuleDataToCopyMode(actorDS.actor, 1);
                }
            }
        }
    }
    /**
     * 获取成长数据根据等级
     * @param actor 角色数据 
     * @param growAttrName 属性名称 
     * @param lv 等级
     * @return [number] 
     */
    private getGrowValueByLv(actor: Module_Actor, growAttrName: string, lv: number): number {
        // -- 获取职业
        let actorClass: Module_Class = GameData.getModuleData(7, actor.class);
        if (!actorClass) return 0;
        // -- 获取属性
        let cacheGrowName = growAttrName + "_cache";
        let growData = actor[cacheGrowName];
        if (!actor[cacheGrowName]) growData = actor[cacheGrowName] = GameUtils.getCurveData(actorClass[growAttrName]);
        let per = lv == 0 ? 0 : (lv - 1) / (actor.MaxLv - 1); // 转为0-1的空间
        return GameUtils.getBezierPoint2ByGroupValue(growData, per);
    }
}