/**
 * 战斗核心流程类
 * Created by 黑暗之神KDS on 2021-01-14 09:47:28.
 */
class GameBattle {
    //------------------------------------------------------------------------------------------------------
    // 配置
    //------------------------------------------------------------------------------------------------------
    /**
     * 结算等待的时间（如有状态DOT/HOT）
     */
    static settlementWaitTime: number = 1000;
    //------------------------------------------------------------------------------------------------------
    // 事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 事件：战斗开始
     */
    static EVENT_BATTLE_START: string = "GameBattleEVENT_BATTLE_START";
    /**
     * 事件：战斗结束 onBattleOver(isWin:boolean)
     */
    static EVENT_BATTLE_OVER: string = "GameBattleEVENT_BATTLE_OVER";
    /**
     * 事件：新的回合
     */
    static EVENT_BATTLE_NEW_TURN: string = "GameBattleEVENT_BATTLE_NEW_TURN";
    /**
     * 事件：开始行动
     */
    static EVENT_BATTLE_BEFORE_ACTION: string = "GameBattleEVENT_BATTLE_BEFORE_ACTION";
    /**
     * 事件：结算阶段
     */
    static EVENT_BATTLE_SETTLEMENT: string = "GameBattleEVENT_BATTLE_SETTLEMENT";
    /**
     * 事件：战斗者离场开始 onBattlerDeadLeaveStart(battler:Battler)
     */
    static EVENT_BATTLE_BATTLER_DEAD_LEAVE_START: string = "GameBattleEVENT_BATTLE_BATTLER_DEAD_LEAVE_START";
    /**
     * 事件：战斗者离场结束 onBattlerDeadLeaveOver()
     */
    static EVENT_BATTLE_BATTLER_DEAD_LEAVE_OVER: string = "GameBattleEVENT_BATTLE_BATTLER_DEAD_LEAVE_OVER";
    /**
     * 事件：胜负满足时
     */
    static EVENT_BATTLE_ON_WIN_OR_LOSE: string = "GameBattleEVENT_BATTLE_ON_WIN_OR_LOSE";
    /**
     * 事件：奖励显示开始
     */
    static EVENT_BATTLE_REWARD_START: string = "GameBattleEVENT_BATTLE_REWARD_START";
    /**
     * 事件：奖励显示结束
     */
    static EVENT_BATTLE_REWARD_OVER: string = "GameBattleEVENT_BATTLE_REWARD_OVER";
    //------------------------------------------------------------------------------------------------------
    // 系统
    //------------------------------------------------------------------------------------------------------
    /**
     * 战斗参数设定
     */
    static setting: CustomCommandParams_9001;
    /**
     * 当前的战斗队伍
     */
    static enemyParty: Module_Party;
    /**
     * 战斗界面
     */
    static battleUI: GUI_Battle;
    /**
     * 战斗标识 0-无 1-战斗开始阶段 2-战斗阶段 3-战斗结束阶段
     */
    static state: number = 0;
    //------------------------------------------------------------------------------------------------------
    // 流程相关
    //------------------------------------------------------------------------------------------------------
    /**
     * 战斗回合
     */
    static battleRound: number = 0;
    /**
     * 回合内阶段步骤
     */
    static inTurnStage: number;
    /**
     * 玩家自由操作标识
     */
    static playerControlEnabled: boolean;
    //------------------------------------------------------------------------------------------------------
    // 战斗数据
    //------------------------------------------------------------------------------------------------------
    /**
     * 我方战斗成员
     */
    static playerBattlers: Battler[] = [];
    /**
     * 敌方战斗成员
     */
    static enemyBattlers: Battler[] = [];
    /**
     * 已移除的敌人
     */
    static removedEnemyBattlers: Battler[] = [];
    //------------------------------------------------------------------------------------------------------
    // 结果
    //------------------------------------------------------------------------------------------------------
    /**
     * 上次战斗胜负
     */
    static resultIsWin: boolean;
    /**
     * 是否游戏结束
     */
    static resultIsGameOver: boolean;
    //------------------------------------------------------------------------------------------------------
    // 实现用变量
    //------------------------------------------------------------------------------------------------------
    private static nextStepCB: Callback;
    private static battleOverTask: string = "battleOverTask";
    private static battleStartTask: string = "battleStartTask";
    private static lastCurrentScene: ProjectClientScene;
    private static deadEventSign: number = 0;
    //------------------------------------------------------------------------------------------------------
    // 获取
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取敌方队伍角色
     * @return [Module_Actor] 
     */
    static getEnemyActors(): Module_Actor[] {
        let arr: Module_Actor[] = []
        for (let i = 0; i < this.enemyBattlers.length; i++) {
            let enemyBattler = this.enemyBattlers[i];
            if (enemyBattler) arr.push(enemyBattler.actor);
        }
        return arr;
    }
    //------------------------------------------------------------------------------------------------------
    // 开始
    //------------------------------------------------------------------------------------------------------
    /**
     * 战斗开始前处理
     */
    static init(cp: CustomCommandParams_9001): void {
        // 记录战斗参数设定
        this.setting = cp;
        this.enemyParty = GameData.getModuleData(11, cp.useVar ? Game.player.variable.getVariable(cp.enemyPartyVarID) : cp.enemyParty);
        // 设定为准备阶段
        GameBattle.state = 1;
        // 战斗控制器启动
        GameBattleController.init();
        // AI管理启动
        GameBattleAI.init();
        // 行为管理启动
        GameBattleAction.init();
        // 清理
        this.resultIsWin = false;
        this.resultIsGameOver = false;
        this.inTurnStage = 0;
        this.battleRound = 0;
        // 监听一次战斗界面打开事件，打开后记录并初始化战斗者
        EventUtils.addEventListenerFunction(GameUI, GameUI.EVENT_OPEN_SYSTEM_UI, this.onBattleUIOpen, this, [], true);
    }
    /**
     * 开始战斗
     */
    static start(): void {
        new SyncTask(GameBattle.battleStartTask, () => {
            // 事件片段：队伍中的战斗开始事件
            EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_START);
            let battleStage0_inBattle = this.enemyParty.eventSetting ? this.enemyParty.battleStage0_inBattle : null;
            CommandPage.startTriggerFragmentEvent(battleStage0_inBattle, Game.player.sceneObject, Game.player.sceneObject, Callback.New(() => {
                if (!this.nextStepCB) this.nextStepCB = Callback.New(this.nextStep, this)
                // 战斗中标识
                GameBattle.state = 2;
                // 战斗控制器启动
                GameBattleController.start();
                // AI管理启动
                GameBattleAI.start();
                // 行为管理启动
                GameBattleAction.start();
                // 进入新的回合
                this.nextStep();
                SyncTask.taskOver(GameBattle.battleStartTask);
            }, this));
        });
    }
    //------------------------------------------------------------------------------------------------------
    // 结束
    //------------------------------------------------------------------------------------------------------
    /**
     * 停止战斗：通常来自结束战斗指令的调用（无论是主动结束战斗或是满足条件自动结束战斗）
     * -- 满足胜负条件：GameBattle.checkBattleIsComplete => WorldData.reachBattleCompelteConditionEvent => 调用结束战斗指令
     * -- 主动结束：调用结束战斗指令
     */
    static stop(onFin: Function): void {
        // 清理战斗中标识
        GameBattle.state = 0;
        // 战斗控制器结束
        GameBattleController.stop();
        // AI管理结束
        GameBattleAI.stop();
        // 行为管理启动
        GameBattleAction.stop();
        // 如果不是游戏结束
        if (!GameBattle.resultIsGameOver) {
            // 重置全部角色数据
            GameBattle.resetActorParty();
            // 清理战场
            GameBattle.clearBattlefield();
            // 回调
            onFin();
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 战斗内部流程
    //------------------------------------------------------------------------------------------------------
    /**
     * 执行下一个阶段
     */
    static nextStep(): void {
        // 检查战斗结束，如果战斗已经结束则不再继续
        this.battlerfieldDetermineHandle(() => {
            // 初始化
            this.playerControlEnabled = false;
            // 战斗阶段累加，如果超出则回到第一个步骤
            let currentInTurnStage = this.inTurnStage++;
            if (this.inTurnStage > 3) this.inTurnStage = 0;
            // 流程1：新的回合阶段
            if (currentInTurnStage == 0) {
                this.newTurnStep();
            }
            // 流程2：先行方行动阶段
            else if (currentInTurnStage == 1) {
                this.playerControlStep();
            }
            // 流程3：行动阶段
            else if (currentInTurnStage == 2) {
                this.battlerActionStep();
            }
            // 流程4：结算阶段
            else {
                this.settlementStep();
            }
            // -- 刷新战斗界面
            this.battleUI.refreshPlayerActorPanel();
        });
    }
    //------------------------------------------------------------------------------------------------------
    // 阶段
    //------------------------------------------------------------------------------------------------------
    /**
     * 新的回合
     */
    private static newTurnStep(): void {
        // 回合数累加
        this.battleRound++;
        // 新的回合数据处理
        GameBattleData.forwardAllBattlersSkillCDAndStatusTime(this.battleRound);
        // 事件：新的回合
        EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_NEW_TURN);
        // -- 如果存在局部事件的话，优先执行局部事件再执行全局事件然后进入下一个阶段
        if (this.enemyParty.battleStage1_newTurn) {
            // -- 追加执行该次战斗的额外的片段事件「战斗阶段：新的回合」
            let battleStage1_newTurn = this.enemyParty.eventSetting ? this.enemyParty.battleStage1_newTurn : null;
            CommandPage.startTriggerFragmentEvent(battleStage1_newTurn, Game.player.sceneObject, Game.player.sceneObject, Callback.New(() => {
                // -- 战场判定处理
                this.battlerfieldDetermineHandle(() => {
                    // -- 执行事件「战斗阶段：新的回合」
                    GameCommand.startCommonCommand(14024, [], Callback.New(this.nextStep, this), Game.player.sceneObject, Game.player.sceneObject);
                });
            }, this));
        }
        // -- 否则仅运行全局事件然后进入下一个阶段
        else {
            // -- 执行事件「战斗阶段：新的回合」
            GameCommand.startCommonCommand(14024, [], Callback.New(this.nextStep, this), Game.player.sceneObject, Game.player.sceneObject);
        }
    }
    /**
     * 玩家控制阶段
     */
    private static playerControlStep(): void {
        this.nextPlayerBattlerControl();
    }
    /**
     * 开始行动
     */
    private static battlerActionStep(): void {
        // -- 事件：开始行动
        EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_BEFORE_ACTION);
        // -- 如果存在局部事件的话，优先执行局部事件再执行全局事件然后进入下一个阶段
        if (this.enemyParty.battleStage2_beforeAction) {
            // -- 追加执行该次战斗的额外的片段事件「战斗阶段：新的回合」
            let battleStage2_beforeAction = this.enemyParty.eventSetting ? this.enemyParty.battleStage2_beforeAction : null;
            CommandPage.startTriggerFragmentEvent(battleStage2_beforeAction, Game.player.sceneObject, Game.player.sceneObject, Callback.New(() => {
                // -- 战场判定处理
                this.battlerfieldDetermineHandle(() => {
                    // -- 执行事件「战斗阶段：开始行动」
                    GameCommand.startCommonCommand(14025, [], Callback.New(this.battlersAction, this), Game.player.sceneObject, Game.player.sceneObject);
                });
            }, this));
        }
        // -- 否则仅运行全局事件然后进入下一个阶段
        else {
            // -- 执行事件「战斗阶段：开始行动」
            GameCommand.startCommonCommand(14025, [], Callback.New(this.battlersAction, this), Game.player.sceneObject, Game.player.sceneObject);
        }
    }
    /**
     * 结算阶段
     */
    private static settlementStep(): void {
        GameBattle.battleUI.actionText.text = ""
        // -- 事件：结算阶段
        EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_SETTLEMENT);
        // -- 执行事件「战斗阶段：开始结算」
        GameCommand.startCommonCommand(14026, [], Callback.New(() => {
            // 战场判定处理
            this.battlerfieldDetermineHandle(() => {
                GameBattleAction.calcBattlersStatus(this.nextStepCB);
            })
        }, this), Game.player.sceneObject, Game.player.sceneObject);
    }
    //------------------------------------------------------------------------------------------------------
    // 我方指令控制
    //------------------------------------------------------------------------------------------------------
    /**
     * 上一个玩家战斗者控制
     */
    static lastPlayerBattlerControl(): void {
        for (let i = GameBattle.playerBattlers.length - 1; i >= 0; i--) {
            let battler = GameBattle.playerBattlers[i];
            // 自动行动的角色 或 未行动过 或 不允许强制控制的情况下无法控制的角色则查找下一个
            if (battler.actor.AI || !battler.commandControlComplete || (!WorldData.forceSendActionCommand && !GameBattleHelper.canAction(battler))) continue;
            battler.commandControlComplete = false;
            break;
        }
        this.nextPlayerBattlerControl();
    }
    /**
     * 下一个玩家控制
     */
    static nextPlayerBattlerControl(): void {
        // 获取下一个自由控制的战斗角色，如果不存在的话则
        let nextPlayerControlBattler = GameBattleHelper.nextPlayerControlBattler;
        if (nextPlayerControlBattler) {
            // 我方自由控制的标识
            this.playerControlEnabled = true;
            this.battleUI.selectedPlayerBattler = nextPlayerControlBattler;
            GameBattleController.openBattlerMenu(nextPlayerControlBattler);
        }
        else {
            this.battleUI.selectedPlayerBattler = null;
            this.nextStep();
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 行动
    //------------------------------------------------------------------------------------------------------
    /**
     * 战斗者行动
     */
    private static battlersAction(): void {
        let taskName = "battlersActionTask";
        SyncTask.clear(taskName);
        // 获取目前的所有战斗者
        let allBattler = GameBattleHelper.allBattlers;
        // 根据速度进行排序
        allBattler.sort((a: Battler, b: Battler) => {
            return a.actor.ActionSpeed > b.actor.ActionSpeed ? -1 : 1;
        });
        for (let i = 0; i < allBattler.length; i++) {
            let battler = allBattler[i];
            // 如果是电脑控制则使用AI进行辅助
            if (battler.actor.AI || battler.isEnemy) {
                new SyncTask(taskName, (battler: Battler) => {
                    if (!battler.inScene) {
                        taskOver.apply(this);
                        return;
                    }
                    GameBattleAI.action(battler, Callback.New(() => {
                        taskOver.apply(this);
                    }, this));
                }, [battler]);
            }
            else {
                new SyncTask(taskName, (battler: Battler) => {
                    GameBattleAction.doAction(battler, Callback.New(() => {
                        if (!battler.inScene) {
                            taskOver.apply(this);
                            return;
                        }
                        taskOver.apply(this);
                    }, this));
                }, [battler]);
            }
        }
        new SyncTask(taskName, () => {
            SyncTask.taskOver(taskName);
            this.nextStep();
        });
        function taskOver() {
            setTimeout(() => {
                SyncTask.taskOver(taskName);
            }, WorldData.battlerActionOverTime * 1000);
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 战场判定处理
    //------------------------------------------------------------------------------------------------------
    /**
     * 战场判定处理：如果未结束战斗才继续
     * @param onFin 当完成时回调
     */
    static battlerfieldDetermineHandle(onFin: Function, onBattlerOver: Function = null): void {
        // -- 已经结束战斗的情况
        if (GameBattle.state == 0 || GameBattle.state == 3) return;
        // -- 死亡者判定
        let allBattlers = GameBattleHelper.allBattlers;
        let allBattlersCount = allBattlers.length;
        if (allBattlersCount > 0) {
            for (let i = 0; i < allBattlers.length; i++) {
                let battler = allBattlers[i];
                this.checkBattlerIsDead(battler, () => {
                    allBattlersCount--;
                    if (allBattlersCount == 0) {
                        // -- 胜负判定
                        let isComplete = GameBattle.checkBattleIsComplete();
                        if (!isComplete) onFin.apply(this);
                        else onBattlerOver && onBattlerOver.apply(this);
                    }
                });
            }
        }
        else {
            // -- 胜负判定
            let isComplete = GameBattle.checkBattleIsComplete();
            if (!isComplete) onFin.apply(this);
            else onBattlerOver && onBattlerOver.apply(this);
        }
    }
    /**
     * 检查战斗者是否死亡
     * @param battler 战斗者 
     * @param onFin 
     */
    static checkBattlerIsDead(battler: Battler, onFin: Function): void {
        let onComplete = () => {
            if (!battler.isEnemy) {
                let inPartyIndex = ProjectPlayer.getPlayerActorIndexByActor(battler.actor);
                if (inPartyIndex >= 0) GameBattle.battleUI.refreshActorPanel(inPartyIndex);
            }
            onFin.apply(this);
        }
        // 当生命值归零的时候
        if (!battler.isDead && battler.actor.hp == 0) {
            // 特殊效果：复活
            let getResurrectionHealthPer = GameBattleHelper.getResurrectionHealthPer(battler);
            if (getResurrectionHealthPer != null) {
                let hpValue = MathUtils.int(battler.actor.MaxHP * getResurrectionHealthPer * 0.01);
                if (hpValue > 0) {
                    GameBattleData.removeAllStatus(battler);
                    setTimeout(() => {
                        GameBattleData.changeBattlerHP(battler, hpValue);
                        GameBattleAction.showDamage(battler, 3, hpValue, false);
                        onComplete.apply(this);
                    }, 500);
                    return;
                }
            }
            let needRemoveEnemy = battler.isEnemy && this.setting.removeDeadBattler;
            // 播放死亡动作和事件：此处使用GameBattle.battleOverTask以便战斗结束时必须等待最晚的死亡事件执行完毕
            this.deadEventSign++;
            SyncTask.taskOver(GameBattle.battleOverTask);
            new SyncTask(GameBattle.battleOverTask, (deadEventSign: number) => {
                GameBattleAction.releaseAction(battler, 7, Number.MAX_VALUE, null, () => {
                    battler.avatar.currentFrame = battler.avatar.totalFrame;
                    battler.autoPlayEnable = false;
                    if (needRemoveEnemy) {
                        // -- 事件：战斗者离场开始
                        EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_BATTLER_DEAD_LEAVE_START, [battler]);
                        GameCommand.startCommonCommand(14028, [], Callback.New(() => {
                            EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_BATTLER_DEAD_LEAVE_OVER, [battler]);
                            if (deadEventSign == this.deadEventSign) SyncTask.taskOver(GameBattle.battleOverTask);
                        }, this), battler, battler);
                    }
                    else {
                        if (deadEventSign == this.deadEventSign) SyncTask.taskOver(GameBattle.battleOverTask);
                    }
                }, 2);
            }, [this.deadEventSign]);
            // 死亡数据标记
            GameBattleData.dead(battler);
            // 移除敌人
            if (needRemoveEnemy) {
                let enemyBattlerIndex = this.enemyBattlers.indexOf(battler);
                this.enemyBattlers[enemyBattlerIndex] = null;
                this.removedEnemyBattlers.push(battler);
            }
            onComplete.apply(this);
        }
        else {
            // 复活：可能需要返回到原位置
            if (!battler.isDead && battler.avatar.actionID == 7) {
                battler.avatar.actionID = 1;
                battler.autoPlayEnable = true;
                GameBattleAction.moveBack(battler, () => {
                    onComplete.apply(this);
                });
                return;
            }
            onComplete.apply(this);
        }
    }
    //------------------------------------------------------------------------------------------------------
    //  内部实现：判断
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取战斗的结束状态，满足以下任意条件则结束战斗
     * -- 我方指定的任意角色死亡
     * -- 我方全员阵亡
     * -- 敌方全员阵亡
     * @return [number] 0-无 1-胜利 2-失败
     */
    private static getBattleCompleteState(): number {
        // 我方全员阵亡的情况
        if (ArrayUtils.matchAttributes(this.playerBattlers, { isDead: true }, false).length == this.playerBattlers.length) {
            return 2;
        }
        // 敌方全员从场上移除的情况
        let realEnemys = GameBattleHelper.getNotNullBattlers(this.enemyBattlers);
        if (realEnemys.length == 0) {
            return 1;
        }
        // 敌方全员阵亡的情况
        if (ArrayUtils.matchAttributes(realEnemys, { isDead: true }, false).length == realEnemys.length) {
            return 1;
        }
        return 0;
    }
    /**
     * 由系统检查战斗是否完成（满足了胜负条件）
     */
    private static checkBattleIsComplete(): boolean {
        // 已结束的情况
        if (GameBattle.state == 0 || GameBattle.state == 3) return true;
        // 如果需要结束的情况
        let battleOverState = this.getBattleCompleteState();
        let isBattleOver = battleOverState != 0;
        // 执行战斗结束事件
        if (isBattleOver) {
            GameBattle.state = 3;
            let isWin = battleOverState == 1
            GameBattle.resultIsWin = isWin;
            GameBattle.resultIsGameOver = !isWin;
            // 如果战败后继续的话，不视为游戏结束
            if (GameBattle.setting.battleFailHandleType == 1) {
                GameBattle.resultIsGameOver = false;
            }
            setTimeout(() => {
                // 结算击杀奖励
                this.calcReward(Callback.New(() => {
                    // 事件片段：队伍中的战斗结束事件
                    let battleStage3_outBattle = this.enemyParty.eventSetting ? this.enemyParty.battleStage3_outBattle : null;
                    CommandPage.startTriggerFragmentEvent(battleStage3_outBattle, Game.player.sceneObject, Game.player.sceneObject, Callback.New(() => {
                        // 执行片段事件 战斗阶段：结束 
                        new SyncTask(GameBattle.battleOverTask, () => {
                            // -- 事件：胜负满足时
                            EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_ON_WIN_OR_LOSE);
                            GameCommand.startCommonCommand(14021, [], Callback.New(() => {
                                SyncTask.taskOver(GameBattle.battleOverTask);
                            }, this));
                        });
                    }, this));
                }, this));
            }, WorldData.battleOverStayTime * 1000);
            return true;
        }
        return false;
    }
    //------------------------------------------------------------------------------------------------------
    // 内部实现：开始
    //------------------------------------------------------------------------------------------------------
    /**
     * 当战斗界面打开时回调
     * @param uiID 战斗界面 
     */
    private static onBattleUIOpen(uiID: number): void {
        if (uiID == 21) {
            this.battleUI = GameUI.get(21) as GUI_Battle;
            this.initBattlefield();
        }
    }
    /**
     * 初始化战斗区域
     * -- 根据敌人队伍预设创建敌人
     * -- 根据玩家角色预设创建玩家的战斗者
     */
    private static initBattlefield(): void {
        new SyncTask(GameBattle.battleStartTask, () => {
            // 初始化战斗场景
            this.battleUI.createBattleScene(() => {
                // 当前场景设置为战斗场景
                this.lastCurrentScene = Game.currentScene;
                Game.currentScene = this.battleUI.currentBattleScene;
                // 清理战斗者列表记录
                this.enemyBattlers.length = 0;
                this.playerBattlers.length = 0;
                this.removedEnemyBattlers.length = 0;
                // 复制敌人拥有的道具
                GameBattleData.initEnemyPartyPackageItem(this.enemyParty);
                // 初始化敌人
                // -- 区分随机模式
                let enemys: DataStructure_enemyActor[];
                if (GameBattle.enemyParty.randEnemy) {
                    enemys = GameBattle.enemyParty.enemys.concat();
                    ArrayUtils.randOrder(enemys);
                    enemys.length = MathUtils.rand(GameBattle.enemyParty.enemys.length) + 1;
                }
                else {
                    enemys = GameBattle.enemyParty.enemys;
                }
                let enemyLength = enemys.length;
                // -- 遍历界面中预设的敌人战斗者位置（根据命名规则enemyN随意添加减少，数字必须是连续的）
                for (let i = 0; i < 99; i++) {
                    // -- 如果不存在该敌人位置则中断
                    let enemyRefBattlerUI = this.battleUI.getRefEnemyBattlerUI(i);
                    if (!enemyRefBattlerUI) break;
                    // -- 参考物本身隐藏
                    enemyRefBattlerUI.visible = false;
                    enemyRefBattlerUI.isPlay = false;
                    // -- 如果已超出此次战斗队伍最大的敌人数则隐藏该位置战斗者
                    if (i >= enemyLength) {
                        continue;
                    }
                    // -- 否则生成敌人数据并绑定至该战斗者显示对象上
                    else {
                        let enemyActorDS = enemys[i];
                        if (!GameData.getModuleData(6, enemyActorDS.actor)) {
                            continue;
                        }
                        let newEnemyAvtorData = GameData.newModuleData(6, enemyActorDS.actor);
                        let enemyBattler = Battler.createBattler(`enemy${i}`, enemyRefBattlerUI);
                        enemyBattler.setData(newEnemyAvtorData, enemyActorDS.lv, true);
                        this.enemyBattlers.push(enemyBattler);
                    }
                }
                // -- 遍历界面中预设的角色战斗者位置（根据命名规则playerActorN随意添加减少，数字必须是连续的）
                for (let i = 0; i < 99; i++) {
                    // -- 如果不存在该敌人位置则中断
                    let playerRefBattlerUI = this.battleUI.getRefPlayerBattlerUI(i);
                    if (!playerRefBattlerUI) break;
                    // -- 参考物本身隐藏
                    playerRefBattlerUI.visible = false;
                    playerRefBattlerUI.isPlay = false;
                    // -- 如果已超出此次战斗队伍最大的敌人数则隐藏该位置战斗者
                    if (i >= Game.player.data.party.length) {
                        continue;
                    }
                    // -- 否则生成敌人数据并绑定至该战斗者显示对象上
                    else {
                        let playerActorDS = ProjectPlayer.getPlayerActorDSByInPartyIndex(i);
                        let playerBattler = Battler.createBattler(`player${i}`, playerRefBattlerUI);
                        playerBattler.setData(playerActorDS.actor, playerActorDS.lv, false);
                        this.playerBattlers.push(playerBattler);
                    }
                }
                // 初始化界面
                this.battleUI.init();
                SyncTask.taskOver(GameBattle.battleStartTask);
            }, this.enemyParty);
        });
    }
    //------------------------------------------------------------------------------------------------------
    //  内部实现：结束
    //------------------------------------------------------------------------------------------------------
    /**
     * 清理战场
     */
    private static clearBattlefield(): void {
        // 清理旧的战斗场景
        this.battleUI.clearBattleScene();
        // 移除全部战斗者
        Battler.removeAll();
        // 回归
        Game.currentScene = this.lastCurrentScene;
    }
    /**
     * 战斗结束后重置角色数据：刷新属性
     */
    private static resetActorParty(): void {
        for (let i = 0; i < Game.player.data.party.length; i++) {
            let actorDS = Game.player.data.party[i];
            let actor = actorDS.actor;
            let battler = GameBattle.playerBattlers[i];
            if (battler == null) {
                break;
            }
            // 死亡状态记录至Actor中
            actor.dead = battler.isDead;
            // 重置冷却时间
            if (actor.atkMode == 1 && actor.atkSkill) actor.atkSkill.currentCD = 0;
            for (let s = 0; s < actor.skills.length; s++) {
                let skill = actor.skills[s];
                skill.currentCD = 0;
            }
            // 刷新属性
            Game.refreshActorAttribute(actor, actorDS.lv);
        }
    }
    /**
     * 结算奖励
     * @param onFin 
     */
    private static calcReward(onFin: Callback): void {
        // 未胜利的情况不结算
        if (!GameBattle.resultIsWin) {
            onFin.run();
            return;
        }
        // 结算队伍死亡时奖励
        GameBattleData.partyDeadReward();
        // 是否获得了奖励
        let isGetReward = GameBattleData.rewardRecord.exp || GameBattleData.rewardRecord.gold || GameBattleData.rewardRecord.items.length != 0 || GameBattleData.rewardRecord.equips.length != 0;
        if (!isGetReward) {
            onFin.run();
            return;
        }
        // -- 获得金币
        if (GameBattleData.rewardRecord.gold) {
            ProjectPlayer.increaseGold(GameBattleData.rewardRecord.gold);
        }
        // -- 获得经验值
        let increaseExpResArr = [];
        for (let i = 0; i < Game.player.data.party.length; i++) {
            let actorDS = Game.player.data.party[i];
            let battler = GameBattle.playerBattlers[i];
            if (battler == null) {
                break;
            }
            if (battler.isDead) {
                increaseExpResArr.push(null);
                continue;
            }
            let increaseExpRes = ProjectPlayer.increaseExpByIndex(i, GameBattleData.rewardRecord.exp);
            increaseExpResArr.push(increaseExpRes);
            if (increaseExpRes && increaseExpRes.isLevelUp) {
                Game.refreshActorAttribute(actorDS.actor, GameBattleHelper.getLevelByActor(actorDS.actor));
                actorDS.actor.hp = actorDS.actor.MaxHP;
                actorDS.actor.sp = actorDS.actor.MaxSP;
                GameBattle.battleUI.refreshActorPanel(i);
            }
        }
        // -- 记录角色经验值升级等信息
        GUI_Reward.increaseExpResArr = increaseExpResArr;
        // -- 获得道具
        for (let i = 0; i < GameBattleData.rewardRecord.items.length; i++) {
            let itemInfo = GameBattleData.rewardRecord.items[i];
            ProjectPlayer.changeItemNumber(itemInfo.itemID, itemInfo.num, false);
        }
        // -- 获得装备
        for (let i = 0; i < GameBattleData.rewardRecord.equips.length; i++) {
            let newEquip = GameBattleData.rewardRecord.equips[i];
            GameData.changeModuleDataToCopyMode(newEquip, 9);
            ProjectPlayer.addEquipByInstance(newEquip);
        }
        // -- 执行事件
        EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_REWARD_START);
        GameCommand.startCommonCommand(14022, [], Callback.New(() => {
            EventUtils.happen(GameBattle, GameBattle.EVENT_BATTLE_REWARD_OVER);
            // 重置记录的击杀奖励
            GameBattleData.rewardRecord = { gold: 0, exp: 0, items: [], equips: [] };
            // 完成时回调
            onFin.run();
        }, this), Game.player.sceneObject, Game.player.sceneObject);
    }
}