/**
 * 战斗行为
 * Created by 黑暗之神KDS on 2021-01-16 02:10:21.
 */
class GameBattleAction {
    //------------------------------------------------------------------------------------------------------
    // 事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 事件：行动开始
     */
    static EVENT_ACTION_START: string = "GameBattleActionEVENT_ACTION_START";
    /**
     * 事件：当一次行为结束时派发的事件
     */
    static EVENT_ONCE_ACTION_COMPLETE: string = "GameBattleActionEVENT_AFTER_ONCE_ACTION";
    /**
     * 事件：移动过去-开始 onActionMoveToStart(battler:Battler,toX:number,toY:number)
     */
    static EVENT_ACTION_MOVE_TO_START: string = "GameBattleActionEVENT_ACTION_MOVE_TO_START";
    /**
     * 事件：移动过去-完成 onActionMoveToOver(battler:Battler,toX:number,toY:number)
     */
    static EVENT_ACTION_MOVE_TO_OVER: string = "GameBattleActionEVENT_ACTION_MOVE_TO_OVER";
    /**
     * 事件：移动回来-开始 onActionMoveBackStart(battler:Battler,toX:number,toY:number)
     */
    static EVENT_ACTION_MOVE_BACK_START: string = "GameBattleActionEVENT_ACTION_MOVE_BACK_START";
    /**
     * 事件：移动回来-完成 onActionMoveBackOver(battler:Battler,toX:number,toY:number)
     */
    static EVENT_ACTION_MOVE_BACK_OVER: string = "GameBattleActionEVENT_ACTION_MOVE_BACK_OVER";
    /**
     * 事件：释放战斗者动作开始 onReleaseActionStart(battler:Battler,actionID:number,releaseFrame:number,voice:number,whenCompleteActionID:number)
     */
    static EVENT_ACTION_RELEASE_ACTION_START: string = "GameBattleActionEVENT_ACTION_RELEASE_ACTION_START";
    /**
     * 事件：释放战斗者动作完成 onReleaseActionOver(battler:Battler)
     */
    static EVENT_ACTION_RELEASE_ACTION_OVER: string = "GameBattleActionEVENT_ACTION_RELEASE_ACTION_OVER";
    /**
     * 事件：普通攻击 onActionAttack(fromBattler:Battler,targetBattler:Battler);
     */
    static EVENT_ACTION_ATTACK: string = "GameBattleActionEVENT_ACTION_ATTACK";
    /**
     * 事件：使用技能 onUseSkill(fromBattler:Battler,skill:Module_Skill);
     */
    static EVENT_ACTION_USE_SKILL: string = "GameBattleActionEVENT_ACTION_USE_SKILL";
    /**
     * 事件：释放技能 onReleaseSkill(fromBattler:Battler,skill:Module_Skill);
     */
    static EVENT_ACTION_RELEASE_SKILL: string = "GameBattleActionEVENT_ACTION_RELEASE_SKILL";
    /**
     * 事件：发射子弹-开始 onReleaseBulletStart(fromBattler:Battler,targetBattler:string,bullet:GCAnimation,bulletRotation:number);
     */
    static EVENT_ACTION_RELEASE_BULLET_START: string = "GameBattleActionEVENT_ACTION_RELEASE_BULLET_START";
    /**
     * 事件：发射子弹-结束 onReleaseBulletOver(fromBattler:Battler,targetBattler:string,bullet:GCAnimation);
     */
    static EVENT_ACTION_RELEASE_BULLET_OVER: string = "GameBattleActionEVENT_ACTION_RELEASE_BULLET_OVER";
    /**
     * 事件：使用道具 onUseItem(fromBattler:Battler,item:Module_Item);
     */
    static EVENT_ACTION_USE_ITEM: string = "GameBattleActionEVENT_ACTION_USE_ITEM";
    /**
     * 事件：击中目标 onEventActionHitTarget(isHitSuccess:boolean,fromBattler:Battler, targetBattler:Battler, actionType:number, skill:Module_Skill, item:Module_Item, status:Module_Status, isMelee:boolean);
     */
    static EVENT_ACTION_HIT_TARGET: string = "GameBattleActionEVENT_ACTION_HIT_TARGET";
    /**
     * 事件：状态DOT/HOT执行时事件 onStatusDotHotHit(fromBattler:Battler, targetBattler:Battler, status:Module_Status);
     */
    static EVENT_STATUS_DOT_HOT_HIT: string = "GameBattleActionEVENT_STATUS_DOT_HOT_HIT";
    //------------------------------------------------------------------------------------------------------
    // 变量
    //------------------------------------------------------------------------------------------------------
    /**
     * 当前行为的战斗者
     */
    static fromBattler: Battler;
    /**
     * 击中的目标（瞬间）
     */
    static hitBattler: Battler;
    /**
     * 行动中标志
     */
    static inAction: boolean;
    /**
     * 当前作用目标数
     */
    private static currentHitTarget: number;
    /**
     * 作用目标的总数
     */
    private static totalHitTarget: number;
    /**
     * 当前作用次数
     */
    private static currentHitTimes: number;
    /**
     * 作用次数
     */
    private static totalHitTimes: number;
    /**
     * 行动完成时回调
     */
    private static onComplete: Callback;
    /**
     * 此次行动已经作用过的目标（用于近战类技能多目标判定）
     */
    private static alreadyHitTargets: Battler[] = [];
    /**
     * 特殊效果：反击
     */
    private static seCounterattack: boolean;
    private static seCounterattackDamagePer: number;
    //------------------------------------------------------------------------------------------------------
    //  其他系统实现
    //------------------------------------------------------------------------------------------------------
    private static isMelee: boolean;
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
        GameBattle.battleUI.actionText.text = "";
        EventUtils.clear(GameBattleAction, GameBattleAction.EVENT_ONCE_ACTION_COMPLETE);
    }
    //------------------------------------------------------------------------------------------------------
    // 战斗者：行为
    //------------------------------------------------------------------------------------------------------
    /**
     * 行动
     * @param battler 战斗者 
     * @param onComplete 当完成时回调
     */
    static doAction(battler: Battler, onComplete: Callback): void {
        // 行动中标志
        this.inAction = true;
        // 记录当前行为的战斗者
        this.fromBattler = battler;
        // 完成时回调
        this.onComplete = onComplete;
        // 初始化数据
        this.alreadyHitTargets.length = 0;
        // 攻击者已经死亡的情况：无行动
        if (battler.isDead) {
            onComplete.run();
            return;
        }
        // 事件库：战斗者行动开始事件
        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_START);
        GameCommand.startCommonCommand(14029, [], Callback.New(() => {
            // 强制行为：如果拥有强制行为则串改指令
            let forceAction = GameBattleHelper.getForceActionType(this.fromBattler);
            // -- 攻击队友：没有队友可攻击的时候则什么都不做
            if (forceAction == 1) {
                let myTeam = GameBattleHelper.getTeamBattlers(this.fromBattler, false);
                if (myTeam.length == 0) {
                    battler.battleCommandType == -1;
                }
                else {
                    let teamBattler = myTeam[MathUtils.rand(myTeam.length)];
                    battler.battleCommandType = 0;
                    battler.battleCommandApplyTarget = teamBattler;
                }
            }
            // -- 随机普通攻击敌人
            else if (forceAction == 2) {
                let hostileBattlers = GameBattleHelper.getHostileBattlers(this.fromBattler);
                let hostileBattler = hostileBattlers[MathUtils.rand(hostileBattlers.length)];
                battler.battleCommandType = 0;
                battler.battleCommandApplyTarget = hostileBattler;
            }
            // 攻击
            if (battler.battleCommandType == 0) {
                this.attack();
            }
            // 使用技能
            else if (battler.battleCommandType == 1) {
                this.useSkill();
            }
            // 使用道具
            else if (battler.battleCommandType == 2) {
                this.useItem();
            }
            // 其他的情况：如无行动或防御的话
            else {
                onComplete.run();
            }
        }, this), battler, battler);
    }
    /**
     * 普通攻击
     * 播放攻击动作，直接击中目标，无弹道效果
     * @param firstUse 首次调用
     * @param forceLastTarget 强制目标，如果目标不能被攻击则忽略掉
     */
    static attack(firstUse: boolean = true, forceTarget: Battler = null): void {
        // 等待一次击中算作完成行为
        this.currentHitTarget = 0;
        this.totalHitTarget = 1;
        this.currentHitTimes = 0;
        this.totalHitTimes = firstUse ? GameBattleHelper.getNormalAttackTimes(this.fromBattler) : 1;
        this.isMelee = true;
        // 如果该战斗者不允许攻击的话
        if (!GameBattleHelper.canAttack(this.fromBattler)) {
            this.actionComplete(true, true);
            return;
        }
        // 获取攻击的目标
        let target = GameBattleHelper.getAttackTarget(this.fromBattler);
        if (forceTarget && forceTarget != target) {
            this.actionComplete(true, true);
            return;
        }
        this.fromBattler.battleCommandApplyTarget = target;
        // 如果不存在攻击目标的话则忽略
        if (!this.fromBattler.battleCommandApplyTarget) {
            this.actionComplete(true, true);
            return;
        }
        // 派发事件
        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_ATTACK, [this.fromBattler, this.fromBattler.battleCommandApplyTarget]);
        // 文本说明
        GameBattle.battleUI.actionText.text = WorldData.word_useAtk.replace("$1", this.fromBattler.actor.name);
        // 移动至目标身边
        this.moveTo(this.fromBattler, this.fromBattler.battleCommandApplyTarget, () => {
            // 攻击动作
            GameBattleAction.releaseAction(this.fromBattler, 3, this.fromBattler.actor.hitFrame, 1, () => {
                this.hitTarget(this.fromBattler, this.fromBattler.battleCommandApplyTarget, 0, null, null, null, true);
            }, 0);
        });
    }
    /**
     * 使用技能
     * @param firstUse 首次使用，非首次则说明是连击
     * @param forceLastTarget 强制目标，如果目标不相同则忽略
     */
    static useSkill(firstUse: boolean = true, forceTarget: Battler = null): void {
        // 获取使用的技能
        let skill = this.fromBattler.battleCommandUseSkill;
        // 使用技能
        let doUseSkill = () => {
            // 获取目标：如果近战且连击技能的话不允许当指定目标无法获取时指定别的目标（首次连击除外）
            let ifNoTargetGetOtherTarget = firstUse || !(GameBattleHelper.isMeleeSkill(skill) && GameBattleHelper.canMultipleHitSkill(skill));
            let targets = GameBattleHelper.getSkillTargets(this.fromBattler, this.fromBattler.battleCommandUseSkill, ifNoTargetGetOtherTarget);
            // 排除掉已作用的目标
            if (targets) {
                // 首次使用技能时，目标确认为首个目标（因为可能非最初的第一目标，以便连击首个目标在最初替换掉后能够正确连击）
                if (firstUse && targets.length != 0) {
                    this.fromBattler.battleCommandApplyTarget = targets[0];
                }
                for (let i = 0; i < this.alreadyHitTargets.length; i++) {
                    ArrayUtils.remove(targets, this.alreadyHitTargets[i]);
                }
            }
            // 如果没有目标的情况则此次行动结束
            if (!targets || targets.length == 0) {
                this.actionComplete(true, true);
                return;
            }
            // 强制目标，如果目标不相同则忽略
            if (forceTarget && forceTarget != targets[0]) {
                this.actionComplete(true, true);
                return;
            }
            // 首次使用技能时处理
            if (firstUse) {
                // 如果该战斗者不允许使用技能的话
                if (!GameBattleHelper.canUseOneSkill(this.fromBattler, skill)) {
                    this.actionComplete(true, true);
                    return;
                }
                // 使用技能
                if (this.fromBattler.battleCommandUseSkillFromItem) {
                    // 计算消耗
                    if (!GameBattleData.costItem(this.fromBattler, this.fromBattler.battleCommandUseSkillFromItem)) {
                        this.actionComplete(true, true);
                        return;
                    }
                    this.fromBattler.battleCommandUseSkillFromItem = null;
                }
                else {
                    GameBattleData.useSkill(this.fromBattler, skill);
                }
                // 文本说明
                if (skill == this.fromBattler.actor.atkSkill) {
                    GameBattle.battleUI.actionText.text = WorldData.word_useAtk.replace("$1", this.fromBattler.actor.name);
                }
                else {
                    GameBattle.battleUI.actionText.text = WorldData.word_useSkill.replace("$1", this.fromBattler.actor.name).replace("$2", skill.name);
                }
            }
            // 战场判定处理
            GameBattle.battlerfieldDetermineHandle(() => {
                // 如果使用者已经死亡的话则结束此次行为
                if (this.fromBattler.isDead) {
                    this.actionComplete(true, true);
                    return;
                }
                // 如果近战的场合：需要逐个移动过去攻击（近战需要满足的条件：直接且目标是敌人）
                if (GameBattleHelper.isMeleeSkill(skill)) {
                    // -- 当前的目标
                    let oneTarget = targets[0];
                    // 首次时初始化多击和连击次数
                    if (firstUse) {
                        this.currentHitTarget = 0;
                        this.totalHitTarget = 1;
                        this.currentHitTimes = 0;
                        this.totalHitTimes = 1;
                    }
                    // 连击：优先技能，然后被动普通攻击
                    if (GameBattleHelper.canMultipleHitSkill(skill)) {
                        if (firstUse) this.totalHitTimes = skill.releaseTimes;
                    }
                    // 由特殊效果产生的连击（技能本身的连击必须是1）
                    if (targets.length <= 1) {
                        if (firstUse && this.totalHitTimes == 1 && skill == this.fromBattler.actor.atkSkill) {
                            this.totalHitTimes = GameBattleHelper.getNormalAttackTimes(this.fromBattler);
                        }
                    }
                    // 多目标
                    else {
                        if (firstUse) this.totalHitTarget = targets.length;
                        this.alreadyHitTargets.push(oneTarget);
                    }
                    // -- 移动接近目标
                    this.moveTo(this.fromBattler, oneTarget, () => {
                        // -- 释放动作
                        GameBattleAction.releaseAction(this.fromBattler, skill.releaseActionID, skill.releaseFrame, 1, () => {
                            this.hitTarget(this.fromBattler, oneTarget, 1, skill, null, null, true);
                        }, 0);
                    });
                }
                // 非近战的场合：同时击中目标
                else {
                    // 存在释放动作的话：播放攻击释放后进入下一个阶段
                    GameBattleAction.releaseAction(this.fromBattler, skill.releaseActionID, skill.releaseFrame, 1, () => {
                        this.releaseSkill(targets, firstUse);
                    }, 0);
                }
                // 播放释放动画
                if (skill.releaseAnimation) {
                    this.fromBattler.playAnimation(skill.releaseAnimation, false, true);
                }
            });
        };
        if (firstUse) {
            EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_USE_SKILL, [this.fromBattler, skill]);
            if (skill.eventSetting && skill.useEvent) CommandPage.startTriggerFragmentEvent(skill.useEvent, this.fromBattler, this.fromBattler, Callback.New(doUseSkill, this));
            else doUseSkill.apply(this);
        }
        else {
            doUseSkill.apply(this);
        }
    }
    /**
     * 使用道具
     * @param fromBattler 来源战斗者
     * @param item 道具
     */
    static useItem(): void {
        // 获取使用的技能
        let item = this.fromBattler.battleCommandUseItem;
        // 等待一次击中算作完成行为
        this.currentHitTarget = 0;
        this.totalHitTarget = 1;
        this.currentHitTimes = 0;
        this.totalHitTimes = 1;
        // 获取目标
        let target = GameBattleHelper.getItemTarget(this.fromBattler, item);
        if (!target) {
            this.actionComplete();
            return;
        }
        // 计算消耗
        if (!GameBattleData.costItem(this.fromBattler, item)) {
            this.actionComplete();
            return;
        }
        // 使用道具
        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_USE_ITEM, [this.fromBattler, item]);
        // 文本说明
        GameBattle.battleUI.actionText.text = WorldData.word_useItem.replace("$1", this.fromBattler.actor.name).replace("$2", item.name);
        // 存在释放动作的话：播放释放动作后进入下一个阶段
        let hasUseItemAction = this.fromBattler.avatar.hasActionID(WorldData.useItemActID);
        if (hasUseItemAction) {
            // 监听当动作播放完毕时，恢复待机动作
            this.fromBattler.avatar.once(Avatar.ACTION_PLAY_COMPLETED, this, () => {
                this.fromBattler.avatar.actionID = 1;
                this.hitTarget(this.fromBattler, target, 2, null, item);
            });
            // 切换至释放动作
            this.fromBattler.avatar.currentFrame = 1;
            this.fromBattler.avatar.actionID = WorldData.useItemActID;
        }
        else {
            this.hitTarget(this.fromBattler, target, 2, null, item);
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 结算阶段
    //------------------------------------------------------------------------------------------------------
    /**
     * 结算战斗者的状态（每个回合结束时）
     * @param onComplete 当完成时回调
     */
    static calcBattlersStatus(onComplete: Callback): void {
        this.onComplete = null;
        // 遍历每个角色开始显示DOT/HOT
        let allBattlers = GameBattleHelper.allBattlers;
        this.currentHitTarget = 0;
        this.totalHitTarget = 0;
        this.currentHitTimes = 0;
        this.totalHitTarget = 1;
        // 等待一次击中算作完成行为
        let needWait = false;
        for (let i = 0; i < allBattlers.length; i++) {
            let battler = allBattlers[i];
            if (battler.isDead) continue;
            let battlerActor = battler.actor;
            for (let s = 0; s < battlerActor.status.length; s++) {
                let status = battlerActor.status[s];
                if (!status.overtime) continue;
                needWait = true;
                Callback.New(this.hitByStatus, this, [battler, status]).delayRun(GameBattle.settlementWaitTime);
            }
        }
        onComplete.delayRun(needWait ? GameBattle.settlementWaitTime * 2 : GameBattle.settlementWaitTime);
    }
    //------------------------------------------------------------------------------------------------------
    // 内部行为流程实现
    //------------------------------------------------------------------------------------------------------
    /**
     * 释放技能
     * @param fromBattler 来源战斗者
     * @param skill 施放的技能
     * @param gridPos 施放的格子坐标
     * @param targets 包含的目标集
     */
    private static releaseSkill(targets: Battler[], firstUse: boolean) {
        let fromBattler = this.fromBattler;
        let skill = fromBattler.battleCommandUseSkill;
        let doReleaseSkill = () => {
            // 等待一次击中算作完成行为
            this.currentHitTarget = 0;
            this.totalHitTarget = targets.length;
            // 首次时初始化连击次数
            if (firstUse) {
                this.currentHitTimes = 0;
                this.totalHitTimes = skill.releaseTimes;
            }
            // 直接
            if (skill.skillType == 0) {
                for (let i = 0; i < targets.length; i++) {
                    this.hitTarget(fromBattler, targets[i], 1, skill);
                }
            }
            // 弹幕
            else if (skill.skillType == 1) {
                for (let i = 0; i < targets.length; i++) {
                    this.releaseBullet(targets[i]);
                }
            }
        }
        // 释放时事件
        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_RELEASE_SKILL, [this.fromBattler, skill]);
        if (skill.eventSetting && skill.releaseEvent) CommandPage.startTriggerFragmentEvent(skill.releaseEvent, fromBattler, fromBattler, Callback.New(doReleaseSkill, this));
        else doReleaseSkill.apply(this);
    }
    /**
     * 发射子弹
     * @param skill 技能
     * @param posGrid 目的地所在格子位置
     * @param targetBattler 战斗者
     */
    private static releaseBullet(targetBattler: Battler = null) {
        let fromBattler = this.fromBattler;
        let skill = fromBattler.battleCommandUseSkill;
        // 创建子弹动画
        let bullet = new GCAnimation();
        bullet.id = skill.bulletAnimation;
        bullet.loop = true;
        bullet.play();
        GameBattle.battleUI.addChild(bullet);
        // 子弹起始位置
        let startPoint = new Point(fromBattler.x, fromBattler.y);
        // 子弹位置修正，根据起始点与目的地的角度
        let offset = WorldData.bulletSendOffset;
        let destinationPoint = new Point(targetBattler.x, targetBattler.y + WorldData.bulletTargetOffset);
        let angle = MathUtils.direction360(destinationPoint.x, destinationPoint.y, startPoint.x, startPoint.y);
        let dx = Math.sin(angle / 180 * Math.PI) * offset;
        let dy = Math.cos(angle / 180 * Math.PI) * offset - offset;
        startPoint.x += -dx;
        startPoint.y += dy;
        // 计算距离和需要的帧数
        let dis = Point.distance(startPoint, destinationPoint);
        let totalFrame = Math.max(Math.ceil(dis / skill.bulletSpeed * 60), 1);
        let currentFrame = 1;
        bullet.x = startPoint.x;
        bullet.y = startPoint.y;
        // 子弹面向
        let rotation = MathUtils.direction360(startPoint.x, startPoint.y, destinationPoint.x, destinationPoint.y);
        bullet.rotation = rotation;
        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_RELEASE_BULLET_START, [this.fromBattler, targetBattler, bullet, rotation]);
        os.add_ENTERFRAME(() => {
            // 刷新子弹当前位置
            let per = currentFrame / totalFrame;
            bullet.x = (destinationPoint.x - startPoint.x) * per + startPoint.x;
            bullet.y = (destinationPoint.y - startPoint.y) * per + startPoint.y;
            // 推进1帧，当击中目标时进入下一阶段
            currentFrame++;
            if (currentFrame > totalFrame) {
                // 派发事件
                EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_RELEASE_BULLET_OVER, [this.fromBattler, targetBattler, bullet]);
                // 清除帧刷
                //@ts-ignore
                os.remove_ENTERFRAME(arguments.callee, this);
                // 清除子弹
                bullet.dispose();
                // 到下一个阶段
                this.hitTarget(fromBattler, targetBattler, 1, skill);
            }
        }, this);
    }
    /**
     * 击中目标：攻击、技能、道具、状态
     * -- 计算命中率
     * -- 播放击中动画
     * -- 调用击中片段事件
     * -- 进入伤害结算
     * @param fromBattler 来源战斗者
     * @param targetBattler 目标战斗者
     * @param actionType 0-普通攻击 1-使用技能 2-使用道具 3-状态
     * @param skill [可选] 默认值=null 使用的技能
     * @param item [可选] 默认值=null 使用的道具
     * @param status [可选] 默认值=null 使用的状态
     * @param isMelee [可选] 默认值=null 是否近战
     */
    private static hitTarget(fromBattler: Battler, targetBattler: Battler, actionType: number, skill: Module_Skill = null, item: Module_Item = null, status: Module_Status = null, isMelee: boolean = false): void {
        this.isMelee = isMelee;
        // 获取战斗者的角色数据
        let fromActor = fromBattler.actor;
        let battleActor = targetBattler.actor;
        // 是否命中标识，根据对应行为计算命中率
        let isHitSuccess = GameBattleData.getHitResult(actionType, fromBattler, targetBattler, skill);
        // 击中动画
        let hitAniID = 0;
        // 是否显示目标受伤动作
        let showTargetHurtAnimation = false;
        // 普通攻击：(攻击者命中率 - 目标躲避率)%
        if (actionType == 0) {
            hitAniID = fromActor.hitAnimation;
            showTargetHurtAnimation = true;
        }
        // 使用技能：(技能命中率)%
        else if (actionType == 1) {
            hitAniID = skill.hitAnimation;
            showTargetHurtAnimation = GameBattleHelper.isHostileRelationship(fromBattler, targetBattler);
        }
        // 使用道具：100%
        else if (actionType == 2) {
            hitAniID = item.releaseAnimation;
        }
        // 状态:DOT/HOT
        else if (actionType == 3) {
            showTargetHurtAnimation = false;
        }
        // 内部函数
        let callNextStep = () => {
            // 已结束战斗的情况
            if (GameBattle.state == 0 || GameBattle.state == 3) {
                this.actionComplete();
            }
            // 目标死亡且非复活类技能/道具的话直接完成
            else if (targetBattler.isDead &&
                ((actionType != 1 && actionType != 2) || (actionType == 2 && !item.applyDeadBattler) || (actionType == 1 && !GameBattleHelper.isResurrectionSkill(skill)))) {
                this.actionComplete();
            }
            else {
                this.hitResult(fromBattler, targetBattler, isHitSuccess, actionType, skill, item, status);
            }
        }
        let keepHurtAni: GCAnimation = null;
        let callHitEvent = () => {
            // -- 结束持续受伤动作
            if (skill && skill.keepHurtAction && !isMelee && targetBattler.avatar.hasActionID(11)) {
                if (!targetBattler.isDead) {
                    targetBattler.avatar.actionID = 1;
                    targetBattler.autoPlayEnable = true;
                }
            }
            if (keepHurtAni) {
                targetBattler.stopAnimation(keepHurtAni);
            }
            // 记录击中目标
            this.hitBattler = targetBattler;
            // 执行片段事件-战斗过程：击中事件
            EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_HIT_TARGET, [isHitSuccess, fromBattler, targetBattler, actionType, skill, item, status, isMelee]);
            if (actionType == 1 && isHitSuccess && skill.eventSetting && skill.hitEvent) CommandPage.startTriggerFragmentEvent(skill.hitEvent, fromBattler, targetBattler, Callback.New(callNextStep, this));
            else if (actionType == 2 && item.callEvent) CommandPage.startTriggerFragmentEvent(item.callEvent, fromBattler, targetBattler, Callback.New(callNextStep, this));
            else callNextStep.apply(this);
        }
        // 存在击中动画：显示击中动画
        if (hitAniID) {
            // 已进入伤害显示阶段标识
            let alreadyInShowDamageStage = false;
            // 持续受伤
            let keepHurtAction = false;
            // 命中的话显示受伤动作和动画
            if (isHitSuccess && showTargetHurtAnimation) {
                let isPhysicalAttack = GameBattleHelper.isPhysicalAttack(actionType, skill);
                // -- 近战物理攻击且目标防御的情况
                if ((isMelee && isPhysicalAttack && targetBattler.battleCommandType == 3 && GameBattleHelper.canUseDefense(targetBattler))) {
                    // -- 目标播放一次防御动作
                    GameBattleAction.releaseAction(targetBattler, WorldData.defendActID, Number.MAX_VALUE, 1);
                    // -- 目标播放一次防御动画
                    if (WorldData.defendAni) {
                        targetBattler.playAnimation(WorldData.defendAni, false, true);
                    }
                }
                // -- 受伤动作
                else {
                    // -- 播放持续受伤动作
                    if (skill && skill.keepHurtAction && !isMelee) {
                        keepHurtAction = true;
                        // 播放受击语音
                        GameBattleAction.playBattlerVoice(targetBattler, 1);
                        if (targetBattler.avatar.hasActionID(11)) {
                            targetBattler.avatar.currentFrame = 1;
                            targetBattler.avatar.actionID = 11;
                            targetBattler.avatar.once(Avatar.ACTION_PLAY_COMPLETED, this, () => {
                                if (!alreadyInShowDamageStage) {
                                    targetBattler.avatar.currentFrame = targetBattler.avatar.totalFrame;
                                    targetBattler.autoPlayEnable = false;
                                }
                            });
                            // -- 持续受伤的动画
                            keepHurtAni = targetBattler.playAnimation(WorldData.keepHurtAni, true, isHitSuccess);
                        }
                    }
                    // -- 播放一次受伤动作
                    else {
                        GameBattleAction.releaseAction(targetBattler, 9, Number.MAX_VALUE, 1, null, 1);
                    }
                }
            }
            // 播放击中动画
            let hitAni = targetBattler.playAnimation(hitAniID, false, isHitSuccess, Config.ANIMATION_FPS, true);
            hitAni.once(GCAnimation.PLAY_COMPLETED, this, () => {
                if (!alreadyInShowDamageStage && !isMelee) {
                    callHitEvent.apply(this);
                }
            });
            // 非持续受伤时监听提前进入显示伤害阶段
            if (!keepHurtAction) {
                hitAni.once(GCAnimation.SIGNAL, this, (signalID: number) => {
                    if (signalID == 1) {
                        alreadyInShowDamageStage = true;
                        if (!isMelee) callHitEvent.apply(this);
                    }
                });
            }
            // 近战直接进入伤害阶段
            if (isMelee) callHitEvent.apply(this);
        }
        // 不存在时：直接进入下一个阶段
        else {
            callHitEvent.apply(this);
        }
    }
    /**
     * 计算击中后的效果
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
     * @param playEffect [可选] 默认值=true 播放效果 
     */
    private static hitResult(fromBattler: Battler, targetBattler: Battler, isHitSuccess: boolean, actionType: number, skill: Module_Skill = null, item: Module_Item = null, status: Module_Status = null): void {
        let damageType = actionType == 0 ? 0 : (skill ? skill.damageType : -2);
        // 等待播放效果播放完毕后算作「行动完成」
        let animationCount = 2;
        let onAnimationCompleteCallback = Callback.New(() => {
            animationCount--;
            if (animationCount == 0) {
                if (this.currentHitTimes == this.totalHitTimes - 1) {
                    // -- 特殊效果：遭受近战时反击
                    if (!this.seCounterattack) {
                        if (GameBattleHelper.isMeleeAction(this.fromBattler, actionType, skill)) {
                            if (!targetBattler.isDead && !fromBattler.isDead) {
                                let counterattackDmagePer = GameBattleHelper.getCounterattackDamagePer(fromBattler, targetBattler);
                                if (counterattackDmagePer != null) {
                                    this.seCounterattack = true;
                                    this.seCounterattackDamagePer = counterattackDmagePer;
                                    GameBattleAction.releaseAction(targetBattler, 3, targetBattler.actor.hitFrame, 1, () => {
                                        this.hitTarget(targetBattler, fromBattler, 0, null, null, null, true);
                                    });
                                    return;
                                }
                            }
                        }
                    }
                    else {
                        this.seCounterattack = false;
                        this.seCounterattackDamagePer = null;
                    }
                }
                this.actionComplete(false, false, actionType <= 1);
            }
        }, this);
        // 计算击中结果
        let res = GameBattleData.calculationHitResult(fromBattler, targetBattler, isHitSuccess, actionType, skill, item, status, this.seCounterattackDamagePer);
        if (res) {
            animationCount++;
            this.showDamage(targetBattler, res.damageType, res.damage, res.isCrit, onAnimationCompleteCallback);
            let showSlefDmage = false;
            let hpValue: number = 0;
            // 近战
            let suckCondition: number = null;
            if (GameBattleHelper.isMeleeAction(this.fromBattler, actionType, skill)) {
                // 特殊效果：反弹伤害
                let returnDmagePer = GameBattleHelper.getReturnAttackDamagePer(fromBattler, targetBattler);
                if (returnDmagePer != null) {
                    let returnDamage = MathUtils.int(res.damage * returnDmagePer * 0.01);
                    if (returnDamage != 0) {
                        hpValue += returnDamage;
                        this.showDamage(fromBattler, res.damageType, returnDamage, false);
                        showSlefDmage = true;
                    }
                }
                suckCondition = 3;
            }
            else {
                if (res.damageType >= 0 && res.damageType <= 2) suckCondition = res.damageType;
            }
            let isMelee = suckCondition == 3;
            // 特殊效果：吸取生命值-近战
            let suckHP = GameBattleHelper.getSuckPer(fromBattler, damageType, true, isMelee);
            if (suckHP != null) {
                let suckHPValue = MathUtils.int(-res.damage * suckHP * 0.01);
                if (suckHPValue != 0) {
                    hpValue += suckHPValue;
                    if (!showSlefDmage) this.showDamage(fromBattler, 3, suckHPValue, false);
                    showSlefDmage = true;
                }
            }
            // 特殊效果：吸取魔法值-近战
            let suckSP = GameBattleHelper.getSuckPer(fromBattler, damageType, false, isMelee);
            if (suckSP != null) {
                let spValue = MathUtils.int(-res.damage * suckSP * 0.01);
                if (spValue != 0) {
                    GameBattleData.changeBattlerSP(fromBattler, spValue);
                    if (!showSlefDmage) this.showDamage(fromBattler, 4, spValue, false);
                    showSlefDmage = true;
                }
            }
            // -- 血量增减
            if (hpValue != 0) {
                GameBattleData.changeBattlerHP(fromBattler, hpValue);
            }
        }
        // 检查来源者和目标是否死亡
        GameBattle.checkBattlerIsDead(fromBattler, () => {
            onAnimationCompleteCallback.run();
        });
        GameBattle.checkBattlerIsDead(targetBattler, () => {
            onAnimationCompleteCallback.run();
        });
    }
    /**
     * 行为结束:派发战斗行为阶段事件
     * 检查多目标完毕和连击完毕
     * @param skipHitMultipleTarget [默认值]=false 跳过攻击多目标
     * @param skipHitTimes [默认值]=false 跳过多次攻击
     * @param allowReleaseAgain [默认值]=true 允许再次攻击
     */
    private static actionComplete(skipHitMultipleTarget: boolean = false, skipHitTimes: boolean = false, allowReleaseAgain: boolean = true): void {
        let doMoveBack = () => {
            this.moveBack(this.fromBattler, () => {
                GameBattle.battlerfieldDetermineHandle(() => {
                    // 战斗者行为结束
                    GameCommand.startCommonCommand(14030, [], Callback.New(() => {
                        this.inAction = false;
                        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ONCE_ACTION_COMPLETE);
                        this.onComplete && this.onComplete.run();
                    }, this), this.fromBattler, this.fromBattler);
                }, () => {
                    EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ONCE_ACTION_COMPLETE);
                });
            });
        }
        if (!skipHitMultipleTarget && this.currentHitTarget < this.totalHitTarget) this.currentHitTarget++;
        let battlerMultipleTimesAttackTime = this.isMelee ? WorldData.battlerMultipleTimesAttackTime * 1000 : 0;
        // 刷新界面
        GameBattle.battleUI.refreshPlayerActorPanel();
        // 多目标全部完毕时
        if (skipHitMultipleTarget || this.currentHitTarget == this.totalHitTarget) {
            // 战场判定处理
            this.currentHitTimes++;
            // 连击次数尚未用完时
            if (allowReleaseAgain && !this.fromBattler.isDead && this.fromBattler.battleCommandType <= 1 && !skipHitTimes && this.currentHitTimes != this.totalHitTimes) {
                // 再次普通攻击
                if (this.fromBattler.battleCommandType == 0) {
                    setTimeout(() => {
                        this.attack(false, this.fromBattler.battleCommandApplyTarget);
                    }, battlerMultipleTimesAttackTime)
                }
                // 再次使用技能代替普通攻击
                else if (this.fromBattler.battleCommandType == 1 && this.fromBattler.battleCommandUseSkill == this.fromBattler.actor.atkSkill) {
                    setTimeout(() => {
                        this.useSkill(false, this.fromBattler.battleCommandApplyTarget);
                    }, battlerMultipleTimesAttackTime)
                }
                // 再次使用技能
                else {
                    if (this.alreadyHitTargets.length > 0) {
                        this.moveBack(this.fromBattler, () => {
                            this.useSkill(false, this.fromBattler.battleCommandApplyTarget);
                        });
                    }
                    else {
                        setTimeout(() => {
                            this.useSkill(false, this.fromBattler.battleCommandApplyTarget);
                        }, battlerMultipleTimesAttackTime)
                    }
                }
                return;
            }
            // 返回
            doMoveBack.apply(this);
        }
        // 继续下一个目标（近战多目标的话）
        else if (this.currentHitTarget != this.totalHitTarget && this.isMelee) {
            // 返回
            this.moveBack(this.fromBattler, () => {
                this.useSkill(false);
            });
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 内部实现：结算阶段
    //------------------------------------------------------------------------------------------------------
    /**
     * 来自状态的击中
     * @param battler 战斗者
     * @param status 状态
     * @param onFin 当完成时回调
     */
    private static hitByStatus(battler: Battler, status: Module_Status): boolean {
        // 获取来源者
        let allBattler = GameBattleHelper.allBattlers;
        let fromBattler = ArrayUtils.matchAttributes(allBattler, { inBattleID: status.fromBattlerID }, true)[0];
        // 不存在的话从虚空中获取
        if (!fromBattler) {
            fromBattler = ArrayUtils.matchAttributes(GameBattle.removedEnemyBattlers, { inBattleID: status.fromBattlerID }, true)[0];
        }
        if (fromBattler) {
            // 记录当前行为的战斗者
            this.fromBattler = fromBattler;
            // 如果存在状态事件的话
            if (status.overtime && status.whenOvertimeEvent) {
                EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_STATUS_DOT_HOT_HIT, [this.fromBattler, battler, status]);
                CommandPage.startTriggerFragmentEvent(status.whenOvertimeEvent, this.fromBattler, battler);
            }
            this.hitTarget(fromBattler, battler, 3, null, null, status);
            return true;
        }
        return false;
    }
    //------------------------------------------------------------------------------------------------------
    // 其他演出效果显示
    //------------------------------------------------------------------------------------------------------
    /**
     * 显示伤害
     * @param targetBattler 目标战斗者
     * @param damageType  -2-无 -1-Miss 0-物理伤害 1-魔法伤害 2-真实伤害 3-恢复生命值 4-恢复魔法值
     * @param damage [可选] 默认值=0 伤害
     * @param isCrit [可选] 默认值=false 是否暴击
     * @param onFin [可选] 默认值=null 回调
     */
    static showDamage(targetBattler: Battler, damageType: number, damage: number = 0, isCrit: boolean = false, onFin: Callback = null): void {
        // 取整
        damage = Math.trunc(damage);
        // 伤害显示对应的界面
        let uiID: number;
        switch (damageType) {
            case -2:
                uiID = 0;
                break;
            case -1:
                uiID = 1041;
                break;
            default:
                uiID = 1042 + damageType;
                break;
        }
        // 显示伤害（治疗）文字效果
        if (uiID != 0) {
            let damageUI = GameUI.load(uiID, true);
            damageUI.x = targetBattler.x;
            damageUI.y = targetBattler.y;
            GameBattle.battleUI.addChild(damageUI);
            let targetUI = damageUI["target"];
            if (!targetUI) targetUI = damageUI.getChildAt(0);
            if (targetUI) {
                if (damageType >= 0) {
                    let damageLabel: UIString = damageUI["damage"];
                    if (damageLabel && damageLabel instanceof UIString) {
                        damageLabel.text = (damage > 0 ? "+" : "") + damage.toString();
                    }
                }
                let damageAni = new GCAnimation();
                damageAni.target = targetUI;
                damageAni.once(GCAnimation.PLAY_COMPLETED, this, () => {
                    damageAni.dispose();
                    damageUI.dispose();
                });
                damageAni.id = isCrit ? 1015 : 1014;
                damageAni.play();
            }
        }
        onFin && onFin.run();
    }
    //------------------------------------------------------------------------------------------------------
    // 战斗者
    //------------------------------------------------------------------------------------------------------
    /**
     * 移动至
     * @param battler 战斗者
     * @param targetBattler 目标战斗者
     * @param onFin 完成时回调
     */
    private static moveTo(fromBattler: Battler, targetBattler: Battler, onFin: Function) {
        let actionCompleteTask = "releaseAction" + fromBattler.inBattleID;
        new SyncTask(actionCompleteTask, function () {
            // -- 获取接近目标战斗者的位置
            let nearPostion = targetBattler.nearPostion;
            // -- 已经在目的地的情况
            if (fromBattler.x == nearPostion.x && fromBattler.y == nearPostion.y) {
                onFin.apply(this);
                SyncTask.taskOver(actionCompleteTask);
                return;
            }
            // -- 如果目标是自己人则朝向变更（与原始朝向相反）
            if (fromBattler.isEnemy == targetBattler.isEnemy) {
                fromBattler.avatar.orientation = GameUtils.getFlipOri(fromBattler.oriOrientation);
            }
            // -- 切换动作
            if (fromBattler.avatar.hasActionID(2)) fromBattler.avatar.actionID = 2;
            // -- 移动至
            EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_MOVE_TO_START, [this.fromBattler, nearPostion.x, nearPostion.y]);
            Tween.to(fromBattler, { x: nearPostion.x, y: nearPostion.y }, WorldData.battleMoveToTime * 1000, null, Callback.New(() => {
                EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_MOVE_TO_OVER, [this.fromBattler, nearPostion.x, nearPostion.y]);
                fromBattler.avatar.actionID = 1;
                onFin.apply(this);
                SyncTask.taskOver(actionCompleteTask);
            }, this));
        });
    }
    /**
     *  回到原位置
     */
    static moveBack(fromBattler: Battler, onFin: Function) {
        let actionCompleteTask = "releaseAction" + fromBattler.inBattleID;
        new SyncTask(actionCompleteTask, function () {
            if (fromBattler.isDead) {
                onFin.apply(this);
                SyncTask.taskOver(actionCompleteTask);
                return;
            }
            // -- 获取接近目标战斗者的位置
            let oriPostion = fromBattler.oriPostion;
            // -- 已经在目的地的情况
            if (fromBattler.x == oriPostion.x && fromBattler.y == oriPostion.y) {
                onFin.apply(this);
                SyncTask.taskOver(actionCompleteTask);
                return;
            }
            // -- 切换动作
            if (fromBattler.avatar.hasActionID(2)) fromBattler.avatar.actionID = 2;
            // -- 移动至
            EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_MOVE_BACK_START, [this.fromBattler, oriPostion.x, oriPostion.y]);
            Tween.to(fromBattler, { x: oriPostion.x, y: oriPostion.y }, WorldData.battleMoveBackTime * 1000, null, Callback.New(() => {
                EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_MOVE_BACK_OVER, [this.fromBattler, oriPostion.x, oriPostion.y]);
                fromBattler.avatar.actionID = 1;
                // -- 恢复朝向
                fromBattler.avatar.orientation = fromBattler.oriOrientation;
                onFin.apply(this);
                SyncTask.taskOver(actionCompleteTask);
            }, this));
        });
    }
    /**
     * 释放战斗者动作
     * @param battler 战斗者
     * @param actionID 动作
     * @param releaseFrame 释放的帧数 
     * @param whenCompleteActionID 当释放完毕后恢复的动作编号 
     * @param onRelease 当释放完成时回调
     * @param voice 播放角色语音  0-attack 1-hit 2-die
     */
    static releaseAction(battler: Battler, actionID: number, releaseFrame: number, whenCompleteActionID: number = null, onRelease: Function = null, voice: number = -1): void {
        // 同步动作任务：同一个战斗者的动作只能顺序播放
        let taskName: string = "releaseAction" + battler.inBattleID;
        new SyncTask(taskName, () => {
            if (voice != -1) this.playBattlerVoice(battler, voice);
            // 存在该动作的话：播放该动作后进入下一个阶段
            let avatar = battler.avatar;
            let hasAtkAction = avatar.hasActionID(actionID);
            if (hasAtkAction) {
                let isReleaseAction = false;
                let onRender = () => {
                    // 超过击中帧数时则进入「击中阶段」
                    if (avatar.currentFrame >= releaseFrame) {
                        //@ts-ignore
                        avatar.off(Avatar.RENDER, avatar, arguments.callee);
                        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_RELEASE_ACTION_OVER, [battler]);
                        onRelease && onRelease();
                        isReleaseAction = true;
                    }
                }
                // 监听当动作播放完毕时，播放完毕后的动作
                avatar.once(Avatar.ACTION_PLAY_COMPLETED, this, () => {
                    if (battler.isDisposed) {
                        SyncTask.taskOver(taskName);
                        return;
                    }
                    avatar.off(Avatar.RENDER, avatar, onRender);
                    // 如果其动作已经被更改或已死亡则忽略 // || battler.isDead
                    if (avatar.actionID != actionID) {
                        SyncTask.taskOver(taskName);
                        return;
                    }
                    // 完成后变更的动作
                    if (whenCompleteActionID != null) avatar.actionID = whenCompleteActionID;
                    // 如果未能释放则直接释放
                    if (!isReleaseAction) {
                        EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_RELEASE_ACTION_OVER, [battler]);
                        onRelease && onRelease();
                    }
                    SyncTask.taskOver(taskName);
                });
                // 监听满足攻击帧数时
                avatar.on(Avatar.RENDER, avatar, onRender);
                // 切换至攻击动作，从第1帧开始播放
                avatar.currentFrame = 1;
                avatar.actionID = actionID;
                // 派发事件
                EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_RELEASE_ACTION_START, [battler, actionID, releaseFrame, voice, whenCompleteActionID]);
            }
            // 没有攻击动作时直接进入下一个阶段
            else {
                EventUtils.happen(GameBattleAction, GameBattleAction.EVENT_ACTION_RELEASE_ACTION_OVER, [battler]);
                onRelease && onRelease();
                SyncTask.taskOver(taskName);
            }
        });
    }
    /**
     * 播放角色语音
     * @param battler 战斗者
     * @param type 0-attack 1-hit 2-die
     */
    static playBattlerVoice(battler: Battler, type: number): void {
        if (!battler.actor.tsSetting) return;
        switch (type) {
            case 0:
                GameAudio.playSE(battler.actor.attackVoice);
                break;
            case 1:
                GameAudio.playSE(battler.actor.hitVoice);
                break;
            case 2:
                GameAudio.playSE(battler.actor.dieVoice);
                break;
        }
    }
}