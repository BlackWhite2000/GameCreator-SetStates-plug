/**
 * 战斗控制器
 * Created by 黑暗之神KDS on 2021-01-14 15:08:03.
 */
class GameBattleController {
    //------------------------------------------------------------------------------------------------------
    // 用以枚举
    //------------------------------------------------------------------------------------------------------
    /**
     * 阶段:开启了选择目标的指示器
     */
    private static OPEN_SELECT_TARGET_INDICATOR: number = 1;
    //------------------------------------------------------------------------------------------------------
    // 
    //------------------------------------------------------------------------------------------------------
    /**
     * 玩家控制角色的阶段
     */
    private static playerControlBattlerStage: number = 0;
    /**
      * 当前玩家操作的战斗角色
      */
    static currentOperationBattler: Battler;
    /**
     * 当前指示器中选中的目标
     */
    private static selectedTargetBattlers: Battler[];
    private static selectedTargetBattler: Battler;
    //------------------------------------------------------------------------------------------------------
    // 实现用的变量
    //------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------
    // 
    //------------------------------------------------------------------------------------------------------
    /**
     * 初始化
     */
    static init(): void {

    }
    /**
     * 启动
     */
    static start(): void {
        // 初始化
        this.currentOperationBattler = null;
        this.playerControlBattlerStage = 0;
        // 鼠标事件
        let controllerStage = Browser.onMobile ? GameUI.get(21) : stage;
        controllerStage.on(EventObject.MOUSE_DOWN, this, this.onMouseDown);
        controllerStage.on(EventObject.RIGHT_MOUSE_DOWN, this, this.onRightMouseUp);
        controllerStage.on(EventObject.MOUSE_MOVE, this, this.onMouseMove);
        // 键盘事件
        stage.on(EventObject.KEY_DOWN, this, this.onKeyDown);
        // 监听技能选择
        EventUtils.addEventListenerFunction(GUI_BattleSkill, GUI_BattleSkill.EVENT_SELECT_SKILL, this.battleCommand_onSkillSelect, this);
        // 监听道具选择
        EventUtils.addEventListenerFunction(GUI_BattleItem, GUI_BattleItem.EVENT_SELECT_ITEM, this.battleCommand_onItemSelect, this);
    }
    /**
     * 停止
     */
    static stop(): void {
        // 取消鼠标事件
        let controllerStage = Browser.onMobile ? GameUI.get(21) : stage;
        controllerStage.off(EventObject.MOUSE_DOWN, this, this.onMouseDown);
        controllerStage.off(EventObject.RIGHT_MOUSE_DOWN, this, this.onRightMouseUp);
        controllerStage.off(EventObject.MOUSE_MOVE, this, this.onMouseMove);
        // 取消键盘事件
        stage.off(EventObject.KEY_DOWN, this, this.onKeyDown);
        // 取消监听
        EventUtils.removeEventListenerFunction(GUI_BattleSkill, GUI_BattleSkill.EVENT_SELECT_SKILL, this.battleCommand_onSkillSelect, this);
        EventUtils.removeEventListenerFunction(GUI_BattleItem, GUI_BattleItem.EVENT_SELECT_ITEM, this.battleCommand_onItemSelect, this);
    }
    //------------------------------------------------------------------------------------------------------
    // 菜单接口
    //------------------------------------------------------------------------------------------------------
    /**
     * 开启攻击指示器：当前玩家可控角色对象开启攻击范围显示
     */
    static battleCommand_openAtkIndicator(): void {
        // 不存在当前操作的角色或已行动过则忽略
        let battler = this.currentOperationBattler;
        if (!battler) return;
        // 使用技能代替普通攻击的情况
        let isAtkUseSkill = battler.actor.atkMode != 0;
        let atkSkill: Module_Skill = battler.actor.atkSkill;
        if (isAtkUseSkill && atkSkill) {
            this.battleCommand_onSkillSelect(atkSkill);
            return;
        }
        // 设定为攻击
        battler.battleCommandType = 0;
        // 打开选择目标的指示器
        this.openSelectedTargetIndicator(2);
    }
    /**
     * 开启技能指示器：当前玩家可控角色对象开启攻击范围显示
     * @param battler 战斗者
     * @param skill 技能
     * @param fromItem 来自道具
     */
    private static battleCommand_onSkillSelect(skill: Module_Skill, fromItem: Module_Item = null) {
        let battler = this.currentOperationBattler;
        // 关闭战斗菜单
        this.closeBattlerMenu();
        // 选择技能
        battler.battleCommandType = 1;
        battler.battleCommandUseSkill = skill;
        battler.battleCommandUseSkillFromItem = fromItem;
        // 如果是全体技能则直接释放技能
        if ((skill.targetType >= 3 && skill.targetType <= 4) || skill.targetType == 0) {
            this.sureSelectBattlerTarget();
        }
        else {
            // 打开选择目标的指示器
            if (skill.targetType == 1 || skill.targetType == 5) {
                this.openSelectedTargetIndicator(1);
            }
            else {
                this.openSelectedTargetIndicator(0);
            }
        }
    }
    /**
     * 当道具选择时
     * @param battler 战斗者
     * @param item 技能
     */
    private static battleCommand_onItemSelect(item: Module_Item): void {
        // 关闭战斗菜单
        this.closeBattlerMenu();
        // 选择道具
        this.currentOperationBattler.battleCommandType = 2;
        this.currentOperationBattler.battleCommandUseItem = item;
        // 如果是当做技能使用的话则视为选择技能
        if (item.releaseSkill) {
            let skill = GameData.getModuleData(8, item.skill)
            if (skill) {
                this.battleCommand_onSkillSelect(skill, item);
                return;
            }
        }
        // 打开选择目标的指示器
        this.openSelectedTargetIndicator(1);
    }
    /**
     * 防御：当前玩家可控角色对象进入防御
     */
    static battleCommand_defend() {
        // 不存在当前操作的角色或已行动过则忽略
        let battler = this.currentOperationBattler;
        if (!battler) return;
        battler.battleCommandType = 3;
        this.sureSelectBattlerTarget();
    }
    /**
     * 自动战斗：当前玩家可控角色对象更改自动战斗的状态
     * @param isAuto 
     */
    static battleCommand_autoBattle(): void {
        // 不存在当前操作的角色或已行动过则忽略
        let battler = this.currentOperationBattler;
        if (!battler) return;
        battler.actor.AI = true;
        battler.battleCommandType = null;
        let battleUI = GameUI.get(21) as GUI_Battle;
        let playerActorIndex = GameBattle.playerBattlers.indexOf(battler);
        battleUI.refreshActorPanel(playerActorIndex);
        this.sureSelectBattlerTarget();
    }
    //------------------------------------------------------------------------------------------------------
    // 呼出和关闭菜单
    //------------------------------------------------------------------------------------------------------
    /**
     * 打开战斗者菜单
     * @param battler 
     */
    static openBattlerMenu(battler: Battler) {
        // 记录当前的操作对象
        GameBattleController.currentOperationBattler = battler;
        // 打开战斗者菜单
        GameCommand.startCommonCommand(15014);
    }
    /**
     * 关闭战斗者菜单
     */
    static closeBattlerMenu() {
        GameCommand.startCommonCommand(15015);
    }
    /**
     * 打开通用菜单
     */
    static openBattleCommonMenu() {
        GameCommand.startCommonCommand(15016);
    }
    /**
     * 关闭通用菜单
     */
    static closeBattleCommonMenu() {
        GameCommand.startCommonCommand(15017);
    }
    /**
     * 重新打开技能栏
     */
    static reOpenSkillMenu() {
        GameCommand.startCommonCommand(15020);
    }
    /**
     * 关闭技能栏
     */
    static closeSkillMenu() {
        GameCommand.startCommonCommand(15019);
    }
    /**
     * 重新打开道具栏
     */
    static reOpenItemMenu() {
        GameCommand.startCommonCommand(15023);
    }
    /**
     * 关闭道具栏
     */
    static closeItemMenu() {
        GameCommand.startCommonCommand(15022);
    }
    /**
     * 打开状态栏
     */
    static openStatusMenu() {
        GameCommand.startCommonCommand(15024);
    }
    /**
     * 关闭状态栏
     */
    static closeStatusMenu() {
        GameCommand.startCommonCommand(15025);
    }
    //------------------------------------------------------------------------------------------------------
    // 关闭菜单
    //------------------------------------------------------------------------------------------------------
    /**
     * 关闭战斗相关的菜单
     * @return [boolean] 是否关闭了菜单
     */
    private static closeMenu(): boolean {
        // 按照检查以下界面是否打开，打开的话则关闭掉
        let battleMenus = [[26, this.closeStatusMenu], [24, this.closeSkillMenu], [25, this.closeItemMenu]];
        for (let i = 0; i < battleMenus.length; i++) {
            let battleMenuInfo = battleMenus[i];
            let uiID = battleMenuInfo[0] as number;
            let closeFunction: Function = battleMenuInfo[1] as any;
            let battlerMenu = GameUI.get(uiID);
            if (battlerMenu && battlerMenu.stage) {
                closeFunction.apply(this);
                return true;
            }
        }
        return false;
    }
    //------------------------------------------------------------------------------------------------------
    // 鼠标键盘操作
    //------------------------------------------------------------------------------------------------------
    /**
     * 当按键按下时
     * @param e 
     */
    static onKeyDown(e: EventObject): void {
        // 非玩家自由行动阶段时不允许操作
        if (!GameBattle.playerControlEnabled || GameDialog.isInDialog) return;
        // 退出按键
        if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.B)) {
            this.onControllerBack();
        }
        // 确定键
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.A)) {
            this.onControllerSure();
        }
        // 方向键：更改朝向
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.UP)) {
            if (this.playerControlBattlerStage == GameBattleController.OPEN_SELECT_TARGET_INDICATOR) GameBattleController.selectNextTarget(8);
        }
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.DOWN)) {
            if (this.playerControlBattlerStage == GameBattleController.OPEN_SELECT_TARGET_INDICATOR) GameBattleController.selectNextTarget(2);
        }
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.LEFT)) {
            if (this.playerControlBattlerStage == GameBattleController.OPEN_SELECT_TARGET_INDICATOR) GameBattleController.selectNextTarget(4);
        }
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.RIGHT)) {
            if (this.playerControlBattlerStage == GameBattleController.OPEN_SELECT_TARGET_INDICATOR) GameBattleController.selectNextTarget(6);
        }
    }
    /**
     * 当鼠标点击时
     * @param e 
     */
    static onMouseDown(e: EventObject): void {
        // 非玩家自由行动阶段时不允许操作
        if (!GameBattle.playerControlEnabled || GameDialog.isInDialog) return;
        this.onControllerSure(true);
    }
    private static onRightMouseUp(): void {
        // 非玩家自由行动阶段时不允许操作
        if (!GameBattle.playerControlEnabled || GameDialog.isInDialog) return;
        this.onControllerBack();
    }
    private static onMouseMove(): void {
        // 选择目标的阶段
        if (this.playerControlBattlerStage == GameBattleController.OPEN_SELECT_TARGET_INDICATOR) {
            let targetBattler = this.getMouseTarget();
            if (targetBattler) this.selectTarget(targetBattler);
        }
    }
    /**
     * 控制-确定
     * @param checkTarget[可选] 默认值=false 
     */
    private static onControllerSure(checkTarget: boolean = false): void {
        // 开启了战斗者菜单的话不允许操作
        if (GameBattleHelper.isOpendBattleMenu) return;
        // 存在玩家控制阶段时
        if (this.playerControlBattlerStage > 0) {
            switch (this.playerControlBattlerStage) {
                case GameBattleController.OPEN_SELECT_TARGET_INDICATOR:
                    // 确定
                    this.sureSelectBattlerTarget(checkTarget);
                    return;
            }
        }
    }
    private static onControllerBack(): void {
        // 存在战斗技能栏的话
        let isClosedMenu = this.closeMenu();
        if (isClosedMenu) return;
        // 存在玩家控制阶段时
        if (this.playerControlBattlerStage > 0) {
            switch (this.playerControlBattlerStage) {
                case GameBattleController.OPEN_SELECT_TARGET_INDICATOR:
                    // 取消移动指示器
                    this.cancelSelectTargetIndicator();
                    break;
            }
            return;
        }
        // 选择上一个战斗者
        GameBattle.lastPlayerBattlerControl();
    }
    /**
     * 获取鼠标位置的目标
     */
    private static getMouseTarget(): Battler {
        let selBattlers = this.selectedTargetBattlers.concat();
        selBattlers.sort((a, b) => { return a.y > b.y ? -1 : 1 })
        for (let i = 0; i < selBattlers.length; i++) {
            let targetBattler = selBattlers[i];
            if (targetBattler.avatar.hitTestPoint(stage.mouseX, stage.mouseY)) {
                return targetBattler;
            }
        }
        return null;
    }
    //------------------------------------------------------------------------------------------------------
    // 开启指示器
    //------------------------------------------------------------------------------------------------------
    /**
     * 打开选择目标的指示器
     * @param mode 模式 0-选择敌人 1-选择我方目标 2-敌我全体（不包含自己）
     */
    private static openSelectedTargetIndicator(mode: number): void {
        let targetBattlers: Battler[];
        switch (mode) {
            case 0:
                targetBattlers = GameBattle.enemyBattlers;
                break;
            case 1:
                targetBattlers = GameBattle.playerBattlers;
                break;
            case 2:
                if (WorldData.allowAtkOwnUnit) {
                    targetBattlers = GameBattle.enemyBattlers.concat(GameBattle.playerBattlers);
                }
                else {
                    targetBattlers = this.currentOperationBattler.isEnemy ? GameBattle.playerBattlers : GameBattle.enemyBattlers;
                }
                ArrayUtils.remove(targetBattlers, this.currentOperationBattler);
                break;
        }
        targetBattlers = GameBattleHelper.getNotNullBattlers(targetBattlers);
        this.selectedTargetBattlers = targetBattlers;
        this.selectTarget(targetBattlers[0]);
        this.playerControlBattlerStage = this.OPEN_SELECT_TARGET_INDICATOR;
    }
    /**
     * 选中指定的目标战斗者
     * @param battler 
     */
    private static selectTarget(battler: Battler): void {
        if (this.selectedTargetBattler == battler) return;
        if (this.selectedTargetBattler) {
            GameCommand.startCommonCommand(14032, [], null, this.selectedTargetBattler, this.selectedTargetBattler);
        }
        this.selectedTargetBattler = battler;
        if (this.selectedTargetBattler) {
            GameCommand.startCommonCommand(14031, [], null, this.selectedTargetBattler, this.selectedTargetBattler);
        }
    }
    /**
     * 选择下一个目标
     * @param dir 
     */
    private static selectNextTarget(dir: number): void {
        let idx: number = this.selectedTargetBattlers.indexOf(this.selectedTargetBattler);
        if (idx >= 0) {
            let toIdx = ProjectUtils.groupElementsMoveIndex(this.selectedTargetBattlers, idx, dir);
            if (toIdx == null || toIdx < 0) return;
            this.selectTarget(this.selectedTargetBattlers[toIdx]);
            GameAudio.playSE(ClientWorld.data.selectSE);
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 发出行动指令
    //------------------------------------------------------------------------------------------------------
    /**
     * 操作角色到当前光标位置上移动，当开启了移动指示器
     * @param checkTarget 检查目标
     */
    private static sureSelectBattlerTarget(checkTarget: boolean = false): void {
        if (checkTarget) {
            // 如果鼠标位置是另一个目标则应作用目标上
            let targetBattler = this.getMouseTarget();
            if (targetBattler && targetBattler != this.selectedTargetBattler) {
                this.selectTarget(targetBattler);
                return;
            }
            // 非PC端必须点中目标才允许确定
            if (!Browser.onPC && !(targetBattler && targetBattler == this.selectedTargetBattler)) {
                return;
            }
        }
        this.closeBattlerMenu();
        this.playerControlBattlerStage = 0;
        this.currentOperationBattler.commandControlComplete = true;
        this.currentOperationBattler.battleCommandApplyTarget = this.selectedTargetBattler;
        this.selectTarget(null);
        GameBattle.nextPlayerBattlerControl();
    }
    //------------------------------------------------------------------------------------------------------
    // 撤回
    //------------------------------------------------------------------------------------------------------
    /**
     * 撤回待机选择朝向
     */
    private static cancelSelectTargetIndicator(): void {
        let battler = this.currentOperationBattler;
        this.playerControlBattlerStage = 0;
        switch (battler.battleCommandType) {
            case 1:
                if (battler.battleCommandUseSkill == battler.actor.atkSkill) {
                    this.openBattlerMenu(GameBattleController.currentOperationBattler);
                    break;
                }
                else {
                    this.reOpenSkillMenu();
                    break;
                }
            case 2:
                this.reOpenItemMenu();
                break;
            default:
                this.openBattlerMenu(GameBattleController.currentOperationBattler);
                break;
        }
        this.selectTarget(null);
    }
}