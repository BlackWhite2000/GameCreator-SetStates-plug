/**
 * 战斗者
 * Created by 黑暗之神KDS on 2022-10-05 18:02:48.
 */
class Battler extends ProjectClientSceneObject {
    //------------------------------------------------------------------------------------------------------
    //  静态
    //------------------------------------------------------------------------------------------------------
    /**
     * 缓存
     */
    private static cacheBattlers: { [sign: string]: Battler } = {};
    /**
     * 创建战斗者：基于战斗场景创建场景对象作为实际的战斗者，界面中的avatar用于参考位置等信息
     * @param sign 战斗者唯一标记
     * @param refBattlerUI 战斗界面中参考的avatar
     * @return [Battler] 战斗者
     */
    static createBattler(sign: string, refBattlerUI: UIAvatar): Battler {
        let battler = Battler.cacheBattlers[sign];
        if (!battler) {
            battler = Battler.cacheBattlers[sign] = Game.currentScene.addNewSceneObject(1, { className: "Battler" }) as Battler;
            let moveToHelper: UIBitmap = refBattlerUI.getChildByName("moveToHelper") as UIBitmap;
            battler.refBattlerUI = refBattlerUI;
            refBattlerUI.data = { battler: battler };
            battler.moveToHelper = moveToHelper;
            if (battler.moveToHelper) battler.moveToHelper.visible = false;
            // 记录战斗者的初始位置（经过了换算，更改层次不会受到影响）
            battler.oriPostion = GameBattle.battleUI.globalToLocal(battler.refBattlerUI.localToGlobal(new Point()));
            // 记录战斗者原始位置
            battler.oriOrientation = refBattlerUI.avatar.orientation;
            // 记录战斗者的原始缩放比例
            battler.oriScale = refBattlerUI.scaleNumberX;
            // 记录战斗者的原始帧率
            battler.oriFPS = refBattlerUI.avatarFPS;
        }
        else {
            Game.currentScene.addSceneObject(battler, true);
        }
        return battler;
    }
    /**
     * 删除战斗者：从场景上移除，但不会从列表中移除
     * @param battler 战斗者
     */
    static removeBattler(battler: Battler): void {
        if (battler) {
            // 清理全部动画
            battler.stopAllAnimation();
            // 解除全部状态
            GameBattleData.removeAllStatus(battler);
            // 从场景上移除
            Game.currentScene.removeSceneObject(battler, false);
        }
    }
    /**
     * 移除全部战斗者
     */
    static removeAll(): void {
        for (let i = 0; i < Game.currentScene.sceneObjects.length; i++) {
            let battler = Game.currentScene.sceneObjects[i] as Battler;
            this.removeBattler(battler);
        }
    }
    //------------------------------------------------------------------------------------------------------
    //  实例
    //------------------------------------------------------------------------------------------------------
    /**
     * 战斗者唯一编号
     */
    inBattleID: number;
    /**
     * 是否敌人
     */
    isEnemy: boolean;
    /**
     * 等级
     */
    level: number;
    /**
     * 角色数据
     */
    actor: Module_Actor;
    /**
     * 是否死亡
     */
    set isDead(v: boolean) {
        if (this.actor) {
            this.actor.dead = v;
        }
    }
    get isDead(): boolean {
        return this.actor ? this.actor.dead : false;
    }
    /**
     * 战斗指令
     * 0-攻击 1-技能 2-道具 3-防御
     */
    battleCommandType: number;
    /**
     * 使用的技能
     */
    battleCommandUseSkill: Module_Skill;
    /**
     * 技能来自的道具
     */
    battleCommandUseSkillFromItem: Module_Item;
    /**
     * 使用的道具
     */
    battleCommandUseItem: Module_Item;
    /**
     * 指定的目标
     */
    battleCommandApplyTarget: Battler;
    /**
     * 指令操作完成标识
     */
    commandControlComplete: boolean;
    /**
     * 原始朝向记录
     */
    oriOrientation: number;
    /**
     * 原始缩放
     */
    oriScale: number;
    /**
     * 原始帧率
     */
    oriFPS: number;
    /**
     * 原始位置记录
     */
    oriPostion: Point;
    /**
     * 战斗者绑定的界面
     */
    private battlerUI: GUI_Battler;
    /**
     * 近战受击的位置
     */
    private _nearPostion: Point;
    /**
     * 战斗者位置参考用
     */
    private refBattlerUI: UIAvatar;
    /**
     * 敌方近战时移动到该战斗者的坐标参考
     */
    private moveToHelper: UIBitmap;
    /**
     * 构造函数
     */
    constructor(soData: SceneObject, scene: ClientScene) {
        super(soData, scene);
        this.battlerUI = new GUI_Battler();
        this.battlerUI.battler = this;
        this.animationHighLayer.addChild(this.battlerUI);
        this.supportPause = false;
    }
    //------------------------------------------------------------------------------------------------------
    // 初始化
    //------------------------------------------------------------------------------------------------------
    /**
     * 设置数据
     * @param actor 角色数据 
     * @param level 等级
     * @param isEnemy 是否敌人
     */
    setData(actor: Module_Actor, level: number, isEnemy: boolean): void {
        // 记录战斗者的初始位置（经过了换算，更改层次不会受到影响）
        this.oriPostion = GameBattle.battleUI.globalToLocal(this.refBattlerUI.localToGlobal(new Point()));
        // 记录战斗者近战受击的位置
        if (this.moveToHelper) {
            this._nearPostion = GameBattle.battleUI.globalToLocal(this.refBattlerUI.localToGlobal(new Point(this.moveToHelper.x, this.moveToHelper.y)));
        }
        else {
            this._nearPostion = new Point(this.x, this.y);
        }
        // 初始化数据
        this.x = this.oriPostion.x;
        this.y = this.oriPostion.y;
        this.avatar.id = actor.bttlerAvatar;
        this.avatar.actionID = 1;
        this.avatarFPS = this.oriFPS;
        this.scale = this.oriScale;
        this.isDead = isEnemy ? false : actor.dead;
        // 记录参数
        this.actor = actor;
        this.level = level;
        this.isEnemy = isEnemy;
        // 设置形象
        //@ts-ignore
        this.avatar.id = actor.bttlerAvatar;
        // 设置朝向
        this.avatar.orientation = this.oriOrientation;
        // 设置名称
        this.battlerUI.battlerName.text = actor.name;
        // 设置战斗者唯一编号
        this.inBattleID = ObjectUtils.getInstanceID();
        // 初始携带设定
        if (isEnemy && !actor.takeSetting) {
            actor.skills.length = 0;
            actor.equips.length = 0;
        }
        // 刷新一次属性获取 selfStatus
        Game.refreshActorAttribute(actor, level);
        // 已经死亡的情况
        if (this.isDead) {
            this.autoPlayEnable = false;
            this.avatar.actionID = 7;
            this.avatar.currentFrame = this.avatar.totalFrame;
        }
        // 未死亡的话
        else {
            this.autoPlayEnable = true;
            for (let i = 0; i < actor.selfStatus.length; i++) {
                let status = actor.selfStatus[i];
                GameBattleData.addStatus(this, status);
            }
        }
        // 刷新属性
        Game.refreshActorAttribute(actor, level);
        if (isEnemy) {
            actor.hp = actor.MaxHP;
            actor.sp = actor.MaxSP;
        }
        // 开始执行
        GameCommand.startCommonCommand(14027, [], null, this, this);
    }
    //------------------------------------------------------------------------------------------------------
    // 获取
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取接近该战斗者的位置
     */
    get nearPostion(): Point {
        return this._nearPostion;
    }
    //------------------------------------------------------------------------------------------------------
    //  实现
    //------------------------------------------------------------------------------------------------------
    /**
     * 重写播放动画，避免默认的近大远小效果
     */
    playAnimation(aniID: number, loop: boolean, isHit: boolean, fps?: number, superposition?: boolean, isReset?: boolean): GCAnimation {
        let animation: GCAnimation;
        // 覆盖模式
        if (superposition) {
            animation = new GCAnimation();
            this["___animations"].push(animation);
        }
        // 非覆盖模式，查找已存在的该动画
        else {
            animation = ArrayUtils.matchAttributes(this["___animations"], { id: aniID }, true, "==")[0];
            if (!animation) {
                animation = new GCAnimation();
                this["___animations"].push(animation);
            } else if (!isReset) {
                return animation;
            }
        }
        animation.sceneObject = this;
        if (fps) animation.fps = fps;
        animation.loop = loop
        animation.showHitEffect = isHit;
        animation.once(GCAnimation.PLAY_COMPLETED, this, this.stopAnimation, [animation]);
        animation.once(EventObject.LOADED, this, (animation: GCAnimation) => {
            if (animation.isDisposed) return;
            if (animation.isParticle) {
                this.animationHighLayer.addChild(animation);
            }
            else {
                animation.addToGameSprite(this.avatarContainer, this.animationLowLayer, this.animationHighLayer);
            }
        }, [animation]);
        animation.id = aniID;
        animation.sceneObject = null;
        animation.gotoAndPlay();
        return animation;
    }
}