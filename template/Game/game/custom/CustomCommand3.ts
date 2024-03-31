/**
 * 自定义事件命令-战斗指令
 * 
 * -- 调用「进入战斗」的指令
 *    -- 记录战斗前的状态
 *    -- 暂停当前事件执行，直到战斗结束后恢复
 *    -- 触发世界设定中的「战斗开始时事件」
 *    -- 玩家的场景对象变为光标
 * 
 * -- 调用「进入结束」的指令：默认模板的常规战斗结束后奖励框中点击后调用，或是自行在任意时中断战斗
 *    -- 恢复战前的状态
 *    -- 触发世界设定中的「战斗结束时事件」
 *    -- 恢复调用进入战斗的事件，使之后续能够正常执行
 * 
 * 
 * 
 * 
 * Created by 黑暗之神KDS on 2021-01-12 07:06:34.
 */
module CommandExecute {
    //------------------------------------------------------------------------------------------------------
    // 战斗相关指令
    //------------------------------------------------------------------------------------------------------
    // 记录玩家战斗前的状态
    let recordBeforeBattleState: {
        lastBgmURL: string,
        lastBGMPitch: number,
        lastBGMVolume: number,
        lastBgsURL: string,
        lastBGSPitch: number,
        lastBGSVolume: number,
        battleTriggerID: number,
        battleSceneID: number
    } = {} as any;
    // 结束战斗处理中
    let overHandle: boolean;
    /**
     * 开始进入战斗
     */
    export function customCommand_9001(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_9001): void {
        // 已在战斗的话则忽略该指令
        if (GameBattle.state != 0 || overHandle) {
            // -- 暂停并等待完成
            trigger.pause = true;
            Callback.CallLater(customCommand_9001, this, [commandPage, cmd, trigger, triggerPlayer, playerInput, cp]);
            return;
        }
        // 如果没有该敌人队伍则失效
        let enemyParty: Module_Party = GameData.getModuleData(11, cp.useVar ? Game.player.variable.getVariable(cp.enemyPartyVarID) : cp.enemyParty);
        if (!enemyParty || enemyParty.enemys.length == 0) return;
        // -- 记录当前的背景音乐和环境音效
        recordBeforeBattleState.lastBgmURL = GameAudio.lastBgmURL;
        recordBeforeBattleState.lastBGMPitch = GameAudio.lastBGMPitch;
        recordBeforeBattleState.lastBGMVolume = GameAudio.lastBGMVolume;
        recordBeforeBattleState.lastBgsURL = GameAudio.lastBgsURL;
        recordBeforeBattleState.lastBGSPitch = GameAudio.lastBGSPitch;
        recordBeforeBattleState.lastBGSVolume = GameAudio.lastBGSVolume;
        // -- 记录当前场景和事件触发器ID
        recordBeforeBattleState.battleTriggerID = trigger.id;
        recordBeforeBattleState.battleSceneID = Game.currentScene.id;
        // 事件中断
        trigger.offset(1);
        trigger.pause = true;
        // 战斗初始化
        GameBattle.init(cp);
        // 图像层置换到界面层上方
        Game.layer.addChild(Game.layer.imageLayer);
        // 执行进入战斗前事件处理
        GameCommand.startCommonCommand(14020, [], null, trigger.trigger as ClientSceneObject, trigger.executor as ClientSceneObject);
    }
    /**
     * 结束战斗
     */
    export function customCommand_9002(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_9002): void {
        // 未在战斗中则忽略
        if (GameBattle.state == 0) return;
        overHandle = true;
        // 胜利标识
        let isWin: boolean;
        // -- 默认：根据实际战斗胜败
        if (cp.battleOverMode == 0) {
            isWin = GameBattle.resultIsWin;
        }
        // -- 根据设定
        else {
            GameBattle.resultIsWin = isWin = (cp.battleOverMode == 1 ? true : false);
        }
        // 胜利开关修改
        if (GameBattle.setting.battleResultSwitch) Game.player.variable.setSwitch(GameBattle.setting.battleResultSwitch, isWin ? 1 : 0);
        // 停止战斗
        GameBattle.stop(() => {
            // 恢复战前的状态
            if (recordBeforeBattleState.lastBgmURL) GameAudio.playBGM(recordBeforeBattleState.lastBgmURL, recordBeforeBattleState.lastBGMVolume, 99999, true, 500, recordBeforeBattleState.lastBGMPitch)
            else GameAudio.stopBGM(true, 500);
            if (recordBeforeBattleState.lastBgsURL) GameAudio.playBGS(recordBeforeBattleState.lastBgsURL, recordBeforeBattleState.lastBGSVolume, 99999, true, 500, recordBeforeBattleState.lastBGSPitch)
            else GameAudio.stopBGS(true, 500);
            // 战斗结束时事件（使用Game.player.sceneObject触发以便保证不会由于战斗者被销毁掉了而失效）
            // -- 事件：战斗结束
            EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_OVER, [GameBattle.resultIsWin]);
            GameCommand.startCommonCommand(14023, [], Callback.New(() => {
                // 还原层次
                Game.layer.addChild(Game.layer.uiLayer);
                overHandle = false;
                // -- 如果仍然是战斗前的场景的话则恢复事件执行
                if (recordBeforeBattleState.battleSceneID == Game.currentScene.id) {
                    GameCommand.inputMessageAndContinueExecute([], true, 0, recordBeforeBattleState.battleTriggerID);
                }
            }, this), Game.player.sceneObject, Game.player.sceneObject);
        });
    }
    //------------------------------------------------------------------------------------------------------
    // 
    //------------------------------------------------------------------------------------------------------
    function getBattleActors(type: number, battlerIndex: number): Battler[] {
        let arr: Battler[] = [];
        if (type == 0) {
            arr = [GameBattle.playerBattlers[battlerIndex]];
        }
        else if (type == 1) {
            arr = [GameBattle.enemyBattlers[battlerIndex]];
        }
        else if (type == 2) {
            arr = [GameBattleAction.fromBattler];
        }
        else if (type == 3) {
            arr = [GameBattleAction.hitBattler];
        }
        else if (type == 4) {
            arr = GameBattle.playerBattlers;
        }
        else if (type == 5) {
            arr = GameBattle.enemyBattlers;
        }
        return arr;
    }
    /**
     * 增减战斗者的生命
     */
    export function customCommand_9004(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_9004): void {
        if (!GameBattleHelper.isInBattle) return;
        let battlerIndex = MathUtils.int(cp.battlerIndexUseVar ? Game.player.variable.getVariable(cp.battlerIndexVarID) : cp.battlerIndex);
        if (battlerIndex < 0) return;
        let battlers = getBattleActors(cp.inPartyType, battlerIndex);
        if (battlers.length == 0) return;
        let value = MathUtils.int(cp.valueUseVar ? Game.player.variable.getVariable(cp.valueVarID) : cp.value);
        for (let i = 0; i < battlers.length; i++) {
            let battler = battlers[i];
            if (battler.isDead) continue;
            let actor = battler.actor;
            actor.hp += cp.symbol == 0 ? value : -value;
            actor.hp = Math.max(Math.min(actor.hp, actor.MaxHP), 0);
        }
    }
    /**
     * 增减战斗者的魔法
     */
    export function customCommand_9005(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_9005): void {
        if (!GameBattleHelper.isInBattle) return;
        let battlerIndex = MathUtils.int(cp.battlerIndexUseVar ? Game.player.variable.getVariable(cp.battlerIndexVarID) : cp.battlerIndex);
        if (battlerIndex < 0) return;
        let battlers = getBattleActors(cp.inPartyType, battlerIndex);
        if (battlers.length == 0) return;
        let value = MathUtils.int(cp.valueUseVar ? Game.player.variable.getVariable(cp.valueVarID) : cp.value);
        for (let i = 0; i < battlers.length; i++) {
            let battler = battlers[i];
            if (battler.isDead) continue;
            let actor = battler.actor;
            actor.sp += cp.symbol == 0 ? value : -value;
            actor.sp = Math.max(Math.min(actor.sp, actor.MaxSP), 0);
        }
    }
    /**
     * 增减战斗者的状态
     */
    export function customCommand_9006(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_9006): void {
        if (!GameBattleHelper.isInBattle) return;
        let battlerIndex = MathUtils.int(cp.battlerIndexUseVar ? Game.player.variable.getVariable(cp.battlerIndexVarID) : cp.battlerIndex);
        if (battlerIndex < 0) return;
        let battlers = getBattleActors(cp.inPartyType, battlerIndex);
        if (battlers.length == 0) return;
        let statusID = MathUtils.int(cp.statusUseVar ? Game.player.variable.getVariable(cp.statusIDVarID) : cp.statusID);
        for (let i = 0; i < battlers.length; i++) {
            let battler = battlers[i];
            if (battler.isDead) continue;
            let actor = battler.actor;
            if (cp.symbol == 0) {
                GameBattleData.addStatus(battler, statusID, battler, cp.force);
            }
            else if (cp.symbol == 1) {
                GameBattleData.removeStatus(battler, statusID);
            }
            else if (cp.symbol == 2) {
                GameBattleData.removeAllStatus(battler);
            }
            let level = GameBattleHelper.getLevelByActor(actor);
            Game.refreshActorAttribute(actor, level);
        }
    }
    /**
     * 显示伤害
     */
    export function customCommand_9007(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_9007): void {
        if (!GameBattleHelper.isInBattle) return;
        let battlerIndex = MathUtils.int(cp.battlerIndexUseVar ? Game.player.variable.getVariable(cp.battlerIndexVarID) : cp.battlerIndex);
        if (battlerIndex < 0) return;
        let battlers = getBattleActors(cp.inPartyType, battlerIndex);
        for (let i = 0; i < battlers.length; i++) {
            let battler = battlers[i];
            let value = MathUtils.int(cp.valueUseVar ? Game.player.variable.getVariable(cp.valueVarID) : cp.value);
            if (cp.type <= 2) value = -value;
            GameBattleAction.showDamage(battler, cp.type, value, cp.isCrit);
        }
    }
    /**
     * 生成战斗者
     */
    export function customCommand_9008(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_9008): void {
        if (!GameBattleHelper.isInBattle) return;
        let actorID = MathUtils.int(cp.useVar ? Game.player.variable.getVariable(cp.actorIDVarID) : cp.actorID);
        let presetActorData: Module_Actor = GameData.getModuleData(6, actorID);
        if (!presetActorData) return;
        // 等级
        let lv = MathUtils.int(cp.lvUseVar ? Game.player.variable.getVariable(cp.lvVarID) : cp.lv);
        lv = Math.max(1, Math.min(lv, presetActorData.MaxLv));
        // 获取相关数据
        let newBattlerInPartyIndex: number;
        let newActor: Module_Actor;
        newBattlerInPartyIndex = GameBattle.battleUI.getEnemyPartyEmptyPostion();
        if (newBattlerInPartyIndex == -1) return;
        let enemyRefBattlerUI = GameBattle.battleUI.getRefEnemyBattlerUI(newBattlerInPartyIndex);
        if (!enemyRefBattlerUI) return;
        let newBattler = Battler.createBattler(`enemy${newBattlerInPartyIndex}`, enemyRefBattlerUI);
        GameBattle.enemyBattlers[newBattlerInPartyIndex] = newBattler;
        // 新建敌人角色
        newActor = GameData.newModuleData(6, actorID);
        // 初始化
        newBattler.setData(newActor, lv, true);
        // 播放创建动画
        if (cp.createAni) newBattler.playAnimation(cp.createAni, false, true);
        // 储存至数值变量
        if (cp.saveNewInPartyIndex) {
            Game.player.variable.setVariable(cp.newInPartyIndexVarID, newBattlerInPartyIndex);
        }
    }
    /**
     * 强制行动
     */
    export function customCommand_9009(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_9009): void {
        if (!GameBattleHelper.isInBattle) return;
        if (GameBattleAction.inAction) return;
        // 获取使用者
        let battler: Battler;
        if (cp.inPartyType <= 1) {
            battler = getBattleActors(cp.inPartyType, cp.inPartyType)[0];
        }
        else {
            let actorID = MathUtils.int(cp.useVar ? Game.player.variable.getVariable(cp.actorIDVarID) : cp.actorID);
            battler = ArrayUtils.matchAttributesD2(GameBattle.playerBattlers, "actor", { id: actorID }, true)[0];
        }
        if (!battler) return;
        // 获取操作
        if (cp.symbol == 0) {
            battler.battleCommandType = 0;
        }
        else if (cp.symbol == 1) {
            let skillID = cp.skillUseVar ? Game.player.variable.getVariable(cp.skillIDVarID) : cp.skillID;
            let skill = ArrayUtils.matchAttributes(battler.actor.skills, { id: skillID }, true)[0];
            if (!skill) {
                if (cp.forceUse) {
                    skill = GameData.newModuleData(8, skillID);
                    if (!skill) return;
                }
                else {
                    return;
                }
            }
            battler.battleCommandType = 1;
            battler.battleCommandUseSkill = skill;
        }
        else if (cp.symbol == 2) {
            let itemID = cp.itemUseVar ? Game.player.variable.getVariable(cp.itemIDVarID) : cp.itemID;
            let item: Module_Item;
            if (battler.isEnemy) {
                item = ArrayUtils.matchAttributesD2(GameBattle.enemyParty.takeItems, "item", { id: itemID }, true)[0]?.item;
            }
            else {
                item = ProjectPlayer.getItem(itemID);
            }
            if (!item) {
                if (cp.forceUse) {
                    item = GameData.newModuleData(1, itemID);
                    if (!battler.isEnemy) {
                        ProjectPlayer.addItemByInstance(item, false);
                    }
                    if (!item) return;
                }
                else {
                    return;
                }
            }
            battler.battleCommandType = 2;
            // -- 道具当做技能使用的情况
            if (item.releaseSkill && item.skill && GameData.getModuleData(8, item.skill)) {
                battler.battleCommandType = 1;
                battler.battleCommandUseSkillFromItem = item;
                battler.battleCommandUseSkill = GameData.newModuleData(8, item.skill);
            }
            battler.battleCommandUseItem = item;
        }
        else if (cp.symbol == 3) {
            battler.battleCommandType = 3;
        }
        else if (cp.symbol == 4) {
            battler.battleCommandType = 3;
            battler.battleCommandApplyTarget = battler;
        }
        // 获取目标
        if (cp.target == 0) {
            if (battler.battleCommandApplyTarget) {
                let allBattlers = GameBattleHelper.allBattlers;
                if (allBattlers.indexOf(battler.battleCommandApplyTarget) == -1) {
                    battler.battleCommandApplyTarget = battler.battleCommandApplyTarget.isEnemy ?
                        GameBattle.enemyBattlers[MathUtils.rand(GameBattle.enemyBattlers.length)] : GameBattle.playerBattlers[MathUtils.rand(GameBattle.playerBattlers.length)];
                }
            }
            else {
                cp.target = 1;
            }
        }
        if (cp.target == 1) {
            let isHostileRelationship: boolean;
            if (cp.symbol == 0) {
                isHostileRelationship = true;
            }
            else if (cp.symbol == 1) {
                isHostileRelationship = GameBattleHelper.isHostileSkill(battler.battleCommandUseSkill);
            }
            else if (cp.symbol == 2) {
                isHostileRelationship = battler.battleCommandUseItem.releaseSkill ? GameBattleHelper.isHostileSkill(battler.battleCommandUseSkill) : false;
            }
            if (isHostileRelationship) {
                let targetBattlers = GameBattleHelper.getHostileBattlers(battler);
                battler.battleCommandApplyTarget = targetBattlers[MathUtils.rand(targetBattlers.length)];
            }
            else {
                let targetBattlers = GameBattleHelper.getTeamBattlers(battler, true);
                battler.battleCommandApplyTarget = targetBattlers[MathUtils.rand(targetBattlers.length)];
            }
        }
        else if (cp.target == 2 || cp.target == 3) {
            let battlerIndex = MathUtils.int(cp.battlerIndexUseVar1 ? Game.player.variable.getVariable(cp.battlerIndexVarID1) : cp.battlerIndex1);
            if (battlerIndex < 0) return;
            battler.battleCommandApplyTarget = getBattleActors(cp.target == 2 ? 0 : 1, battlerIndex)[0];
        }
        if (!battler.battleCommandApplyTarget) return;
        // 立刻行动一次
        trigger.offset(1);
        trigger.pause = true;
        GameBattleAction.doAction(battler, Callback.New(() => {
            CommandPage.executeEvent(trigger);
        }, this));
    }
    //------------------------------------------------------------------------------------------------------
    // 
    //------------------------------------------------------------------------------------------------------
    /**
     * 增减装备
     */
    export function customCommand_10001(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_10001): void {
        let equipID = p.useVar1 ? Game.player.variable.getVariable(p.equipIDVarID) : p.equipID;
        let num = p.useVar2 ? Game.player.variable.getVariable(p.numVarID) : p.num;
        // 找不到预设装备的话则忽略
        if (!GameData.getModuleData(9, equipID)) return;
        // 浮动装备设定
        if (p.attributeRand && p.equipRandSetting.length > 0 && p.symbol == 0) {
            let equipAttributeNames = ["maxHP", "maxSP", "atk", "def", "mag", "magDef", "agi", "actionSpeed", "hit", "crit", "magCrit"];
            // 生成装备
            for (let n = 0; n < num; n++) {
                let newEquip: Module_Equip = GameData.newModuleData(9, equipID, true);
                for (let i = 0; i < p.equipRandSetting.length; i++) {
                    let thisSetting = p.equipRandSetting[i];
                    let thisPer = thisSetting.probability;
                    if (MathUtils.rand(100) < thisPer) {
                        // 全属性变化（已有属性）
                        if (thisSetting.type == 11) {
                            for (let s = 0; s < equipAttributeNames.length; s++) {
                                if (thisSetting.usePer) {
                                    let per = (MathUtils.rand(thisSetting.maxValue - thisSetting.minValue) + thisSetting.minValue) / 100;
                                    let newValue = newEquip[equipAttributeNames[s]] * per;
                                    newEquip[equipAttributeNames[s]] = Math.ceil(newValue);
                                }
                                else {
                                    if (newEquip[equipAttributeNames[s]]) {
                                        let newValue = MathUtils.rand(thisSetting.maxFixValue - thisSetting.minFixValue) + thisSetting.minFixValue;
                                        newEquip[equipAttributeNames[s]] += Math.ceil(newValue);
                                    }
                                }
                            }
                        }
                        // 单属性变化
                        else {
                            if (thisSetting.usePer) {
                                let per = (MathUtils.rand(thisSetting.maxValue - thisSetting.minValue) + thisSetting.minValue) / 100;
                                let newValue = newEquip[equipAttributeNames[thisSetting.type]] * per;
                                newEquip[equipAttributeNames[thisSetting.type]] = Math.ceil(newValue);
                            }
                            else {
                                let newValue = MathUtils.rand(thisSetting.maxFixValue - thisSetting.minFixValue) + thisSetting.minFixValue;
                                newEquip[equipAttributeNames[thisSetting.type]] += Math.ceil(newValue);
                            }
                        }
                    }
                }
                ProjectPlayer.addEquipByInstance(newEquip);
            }
        }
        else {
            ProjectPlayer.changeItemNumber(equipID, p.symbol == 0 ? num : -num, true, true);
        }
    }
    /**
     * 替换队伍角色，战斗中会动态增减
     */
    export function customCommand_10002(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_10002): void {
        let actorID = MathUtils.int(cp.useVar ? Game.player.variable.getVariable(cp.actorIDVarID) : cp.actorID);
        let presetActorData: Module_Actor = GameData.getModuleData(6, actorID);
        if (!presetActorData) return;
        if (cp.type == 0) {
            let lv = MathUtils.int(cp.lvUseVar ? Game.player.variable.getVariable(cp.lvVarID) : cp.lv);
            lv = Math.max(1, Math.min(lv, presetActorData.MaxLv));
            let actorDS = ProjectPlayer.addPlayerActorByActorID(actorID, lv);
            actorDS.dissolutionEnabled = cp.allowDissolution;
            if (cp.applyBattle && GameBattleHelper.isInBattle) {
                // 获取相关数据
                let newBattlerInPartyIndex: number;
                newBattlerInPartyIndex = ArrayUtils.getNullPosition(GameBattle.playerBattlers);
                if (newBattlerInPartyIndex == -1) return;
                let playerRefBattlerUI = GameBattle.battleUI.getRefPlayerBattlerUI(newBattlerInPartyIndex);
                if (!playerRefBattlerUI) return;
                let newBattler = Battler.createBattler(`player${newBattlerInPartyIndex}`, playerRefBattlerUI);
                GameBattle.playerBattlers[newBattlerInPartyIndex] = newBattler;
                // 初始化
                newBattler.setData(actorDS.actor, lv, false);
                // 刷新界面
                GameBattle.battleUI.initActorInfoList();
            }
        }
        else {
            let actorDS = ProjectPlayer.getPlayerActorDSByActorID(actorID);
            if (cp.applyBattle && GameBattleHelper.isInBattle && actorDS) {
                let battler = GameBattleHelper.getBattlerByActor(actorDS.actor);
                // 删除战斗者显示对象和数据
                if (battler) {
                    Battler.removeBattler(battler);
                    GameBattle.playerBattlers.splice(GameBattle.playerBattlers.indexOf(battler), 1);
                }
                // 刷新界面
                GameBattle.battleUI.initActorInfoList();
            }
            ProjectPlayer.removePlayerActorByActorID(actorID);
        }
    }
    /**
     * 替换角色的技能
     */
    export function customCommand_10003(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_10003): void {
        // 获取角色
        let actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID,
            cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID,
            cp.enemyInPartyIndexVarIDUseVar, cp.enemyInPartyIndex, cp.enemyInPartyIndexVarID);
        if (!actor) return;
        // 获取技能编号
        let skillID = MathUtils.int(cp.skillUseVar ? Game.player.variable.getVariable(cp.skillIDVarID) : cp.skillID);
        // 学习技能
        if (cp.symbol == 0) {
            Game.actorLearnSkill(actor, skillID);
        }
        // 忘记技能
        else if (cp.symbol == 1) {
            Game.actorForgetSkill(actor, skillID);
        }
        // 忘记全部技能
        else if (cp.symbol == 2) {
            Game.actorForgetAllSkills(actor);
        }
        // 随机忘记一个技能
        else if (cp.symbol == 3) {
            let skill = actor.skills[MathUtils.rand(actor.skills.length)];
            if (skill) {
                let skillID = skill.id;
                Game.actorForgetSkill(actor, skillID);
            }
        }
        // 替换普通技能
        else if (cp.symbol == 4) {
            Game.actorReplaceAttackSkill(actor, skillID);
        }
        // 恢复普通攻击
        else if (cp.symbol == 5) {
            actor.atkMode = 0;
            actor.atkSkill = null;
        }
    }
    /**
     * 替换角色的装备
     */
    export function customCommand_10004(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_10004): void {
        // 获取角色
        let actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID,
            cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID,
            cp.enemyInPartyIndexVarIDUseVar, cp.enemyInPartyIndex, cp.enemyInPartyIndexVarID);
        if (!actor) return;
        // 获取装备编号
        let equipID = MathUtils.int(cp.equipUseVar ? Game.player.variable.getVariable(cp.equipIDVarID) : cp.equipID);
        // 判断是否是玩家的角色
        let inPartyActorDS: DataStructure_inPartyActor = ProjectPlayer.getPlayerActorDSByActor(actor);
        let inPartyActorIndex = ProjectPlayer.getPlayerActorIndexByActor(actor);
        // 记录卸下的装备
        let takeOffEquip: Module_Equip;
        // 穿戴
        if (cp.symbol == 0) {
            if (inPartyActorDS && cp.fromPlayerPackage) {
                // -- 如果该装备存在于玩家的背包的话则穿戴
                let fromPackageEquip = ProjectPlayer.getItemDS(equipID, true, true);
                if (fromPackageEquip) ProjectPlayer.wearPlayerActorEquip(inPartyActorIndex, fromPackageEquip.equip);
            }
            else {
                // 新建一件装备进行穿戴
                if (GameData.getModuleData(9, equipID)) {
                    let newEquip = GameData.newModuleData(9, equipID);
                    Game.wearActorEquip(actor, newEquip);
                }
            }
        }
        // 卸下/移除
        else if (cp.symbol == 1 || cp.symbol == 3) {
            // 使用部件卸下
            if (cp.usePartID) {
                if (inPartyActorDS && cp.symbol == 1) takeOffEquip = ProjectPlayer.takeOffPlayerActorEquipByPartID(inPartyActorIndex, cp.partID);
                else takeOffEquip = Game.takeOffActorEquipByPartID(actor, cp.partID);
            }
            // 否则查找该件装备是否已经穿戴上了
            else {
                let thisEquip = Game.getActorEquipByEquipID(actor, equipID);
                if (thisEquip) {
                    let thisEquipPartID = thisEquip.partID;
                    if (inPartyActorDS && cp.symbol == 1) takeOffEquip = ProjectPlayer.takeOffPlayerActorEquipByPartID(inPartyActorIndex, thisEquipPartID);
                    else takeOffEquip = Game.takeOffActorEquipByPartID(actor, thisEquipPartID);
                }
            }
        }
        // 卸下/移除全部装备
        else if (cp.symbol == 2 || cp.symbol == 4) {
            if (inPartyActorDS && cp.symbol == 2) ProjectPlayer.takeOffPlayerActorAllEquips(inPartyActorIndex);
            else Game.takeOffActorAllEquips(actor);
        }
        // 刷新属性
        Game.refreshActorAttribute(actor, GameBattleHelper.getLevelByActor(actor));
        // 记录卸下的装备编号
        if (cp.isTakeOffEquipSaveToVar) {
            let takeOffEquipID = takeOffEquip ? takeOffEquip.id : -1;
            Game.player.variable.setVariable(cp.takeOffEquipSaveToVar, takeOffEquipID);
        }
    }
    /**
     * 永久增加属性
     */
    export function customCommand_10005(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_10005): void {
        let actors: Module_Actor[] = [];
        // 玩家的全体角色
        if (cp.actorCheckType == 5) {
            actors = ProjectPlayer.getPlayerActors();
        }
        // 敌方的全体角色（仅限战斗中）
        else if (cp.actorCheckType == 6) {
            if (!GameBattleHelper.isInBattle) return;
            actors = GameBattle.getEnemyActors();
        }
        // 单个角色
        else {
            let actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID,
                cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID,
                cp.enemyInPartyIndexVarIDUseVar, cp.enemyInPartyIndex, cp.enemyInPartyIndexVarID);
            if (!actor) return;
            actors = [actor];
        }
        let value = MathUtils.int(cp.valueUseVar ? Game.player.variable.getVariable(cp.valueVarID) : cp.value);
        for (var i = 0; i < actors.length; i++) {
            let actor = actors[i];
            // 判断是否是玩家的角色
            let inPartyActorDS: DataStructure_inPartyActor = ProjectPlayer.getPlayerActorDSByActor(actor);
            let inPartyActorIndex = ProjectPlayer.getPlayerActorIndexByActor(actor);
            // 增加永久属性
            switch (cp.attributeType) {
                case 0:
                    actor.increaseMaxHP += value;
                    break;
                case 1:
                    actor.increaseMaxSP += value;
                    break;
                case 2:
                    actor.increasePow += value;
                    break;
                case 3:
                    actor.increaseMag += value;
                    break;
                case 4:
                    actor.increaseEnd += value;
                    break;
                case 5:
                    actor.increaseAgi += value;
                    break;
                case 6:
                    if (inPartyActorIndex != -1) {
                        let res = ProjectPlayer.increaseExpByIndex(inPartyActorIndex, value);
                        if (res && res.isLevelUp) {
                            if (actor.levelUpEvent) CommandPage.startTriggerFragmentEvent(actor.levelUpEvent, Game.player.sceneObject, Game.player.sceneObject);
                            let actorClass: Module_Class = GameData.getModuleData(7, actor.class);
                            if (actorClass && actorClass.levelUpEvent) CommandPage.startTriggerFragmentEvent(actorClass.levelUpEvent, Game.player.sceneObject, Game.player.sceneObject);
                        }
                    }
                    break;
                case 7:
                    if (inPartyActorIndex != -1) {
                        inPartyActorDS.lv += value;
                        if (value > 0) {
                            if (actor.levelUpEvent) CommandPage.startTriggerFragmentEvent(actor.levelUpEvent, Game.player.sceneObject, Game.player.sceneObject);
                            let actorClass: Module_Class = GameData.getModuleData(7, actor.class);
                            if (actorClass && actorClass.levelUpEvent) CommandPage.startTriggerFragmentEvent(actorClass.levelUpEvent, Game.player.sceneObject, Game.player.sceneObject);
                        }
                        ProjectPlayer.initPlayerActor(inPartyActorIndex);
                    }
                    break;
                case 8:
                    if (inPartyActorIndex != -1) {
                        inPartyActorDS.lv -= value;
                        ProjectPlayer.initPlayerActor(inPartyActorIndex);
                    }
                    break;
                case 9:
                    actor.hp += value;
                    if (actor.hp <= 0) {
                        if (cp.allowDead) {
                            actor.dead = true;
                        }
                        else {
                            actor.hp = 1;
                        }
                    }
                    break;
                case 10:
                    actor.sp += value;
                    break;
            }
            // 刷新属性
            Game.refreshActorAttribute(actor, GameBattleHelper.getLevelByActor(actor));
        }

    }
    /**
     * 更改角色的名称
     */
    let changeActorNameInfo: { [actorID: number]: string } = {};
    export function customCommand_10006(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_10006): void {
        // 获取角色
        let actor: Module_Actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID,
            cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID,
            null, null, null);
        if (!actor) return;
        // 更改该角色的名称
        let newName = cp.valueUseVar ? Game.player.variable.getString(cp.valueVarID) : cp.value;
        for (let i = 0; i < Game.player.data.party.length; i++) {
            let inPartyActor = Game.player.data.party[i];
            let actorID = inPartyActor.actor.id;
            if (actorID == actor.id) {
                inPartyActor.actor.name = newName;
            }
        }
        // 记录更改项以便恢复存档时重新需要设置该值
        changeActorNameInfo[actor.id] = newName;
    }
    /**
     * 使用SinglePlayerGame需要在非行为编辑器模式下
     */
    if (!Config.BEHAVIOR_EDIT_MODE) {
        SinglePlayerGame.regSaveCustomData("___changeActorName", Callback.New(() => {
            return changeActorNameInfo;
        }, null));
        EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(() => {
            EventUtils.addEventListener(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, Callback.New(() => {
                if (GameGate.gateState == GameGate.STATE_3_IN_SCENE_COMPLETE) {
                    let restoryChangeActorNameInfo = SinglePlayerGame.getSaveCustomData("___changeActorName");
                    if (restoryChangeActorNameInfo) {
                        changeActorNameInfo = restoryChangeActorNameInfo;
                        for (let i = 0; i < Game.player.data.party.length; i++) {
                            let actorID = Game.player.data.party[i].actor.id;
                            if (changeActorNameInfo[actorID]) {
                                Game.player.data.party[i].actor.name = changeActorNameInfo[actorID];
                            }
                        }
                    }
                }
            }, null));
        }, null), true);
    }
    /**
     * 更改角色的职业
     */
    export function customCommand_10007(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_10007): void {
        // 获取角色
        let actor: Module_Actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID,
            cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID,
            null, null, null);
        if (!actor) return;
        // 更改职业
        let classID = cp.valueUseVar ? Game.player.variable.getVariable(cp.valueVarID) : cp.value;
        actor.class = classID;
        // 清理缓存
        for (var i in actor) {
            if (i.indexOf("_cache") != -1) {
                delete actor[i];
            }
        }
        // 刷新属性
        Game.refreshActorAttribute(actor, GameBattleHelper.getLevelByActor(actor));
    }
    /**
     * 完全恢复
     */
    export function customCommand_10008(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_10008): void {
        let actors: Module_Actor[];
        // 玩家的全体角色
        if (cp.actorCheckType == 5) {
            actors = ProjectPlayer.getPlayerActors();
        }
        // 敌方的全体角色（仅限战斗中）
        else if (cp.actorCheckType == 6) {
            if (!GameBattleHelper.isInBattle) return;
            actors = GameBattle.getEnemyActors();
        }
        // 单个角色
        else {
            let actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID,
                cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID,
                cp.enemyInPartyIndexVarIDUseVar, cp.enemyInPartyIndex, cp.enemyInPartyIndexVarID);
            if (!actor) return;
            actors = [actor];
        }
        for (var i = 0; i < actors.length; i++) {
            let actor = actors[i];
            if (actor.dead) actor.dead = false;
            actor.hp = actor.MaxHP;
            actor.sp = actor.MaxSP;
            if (GameBattleHelper.isInBattle) {
                let battler = GameBattleHelper.getBattlerByActor(actor);
                if (battler && battler.isDead) battler.isDead = false;
            }
        }
    }
    /**
     * 更改角色的形象
     */
    export function customCommand_10009(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_10009): void {
        // 获取角色
        let actor: Module_Actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID,
            cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID,
            null, null, null);
        if (!actor) return;
        // 更改头像
        if (cp.faceEnabled) {
            let faceURL = cp.faceUseVar ? Game.player.variable.getString(cp.faceVarID) : cp.face;
            actor.face = faceURL;
        }
        // 更改行走图
        if (cp.avatarEnabled) {
            let avatarID = cp.avatarUseVar ? Game.player.variable.getVariable(cp.avatarVarID) : cp.avatar;
            actor.avatar = avatarID;
        }
        // 更改战斗图
        if (cp.battlerEnabled) {
            let battlerID = cp.battlerUseVar ? Game.player.variable.getVariable(cp.battlerVarID) : cp.battler;
            actor.bttlerAvatar = battlerID;
            if (GameBattleHelper.isInBattle) {
                let battler = GameBattleHelper.getBattlerByActor(actor);
                if (battler) battler.avatar.id = battlerID;
            }
        }
    }
    /**
    * 修改角色的技能
    */
    export function customCommand_10010(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_10010): void {
        // 获取角色
        let actor: Module_Actor = Game.getActorByCheckType(cp.actorCheckType, cp.useVar, cp.actorID, cp.actorIDVarID,
            cp.actorInPartyIndexVarIDUseVar, cp.actorInPartyIndex, cp.actorInPartyIndexVarID,
            null, null, null);
        if (!actor) return;
        // 获取技能编号
        let skillID = MathUtils.int(cp.skillUseVar ? Game.player.variable.getVariable(cp.skillIDVarID) : cp.skillID);
        // 获取角色的技能
        let skills = actor.skills.concat(actor.atkSkill);
        let skill: Module_Skill = ArrayUtils.matchAttributes(skills, { id: skillID }, true)[0];
        // 升级技能
        if (skill) {
            CustomCompData.setData(skill, cp.attributes);
        }
    }
}