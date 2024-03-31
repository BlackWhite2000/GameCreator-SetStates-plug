module OpenAPI {
  /**
   * 增减多层状态
   */
  export class SetStates {
    /**
     * 当前版本号
     */
    static Version = 1.1
    /**
     * 是否安装
     */
    static Installed = true
  }
}
module CommandExecute {
  export function customCommand_15001(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15001): void {
    if (!GameBattleHelper.isInBattle)
      return
    const battlerIndex = MathUtils.int(p.battlerIndexUseVar ? Game.player.variable.getVariable(p.battlerIndexVarID) : p.battlerIndex)
    if (battlerIndex < 0)
      return
    const battlers = getBattleActors(p.inPartyType, battlerIndex)
    if (battlers.length === 0)
      return
    const statusID = MathUtils.int(p.statusUseVar ? Game.player.variable.getVariable(p.statusIDVarID) : p.statusID)
    for (let i = 0; i < battlers.length; i++) {
      const battler = battlers[i]
      if (battler.isDead)
        continue
      const actor = battler.actor
      const count = p.countType === 0 ? p.count : Game.player.variable.getVariable(p.countVar)
      if (p.symbol === 0)
        addStatus(battler, statusID, battler, p.force, count)

      else if (p.symbol === 1)
        removeStatus(battler, statusID, count)

      else if (p.symbol === 2)
        GameBattleData.removeAllStatus(battler)

      const level = GameBattleHelper.getLevelByActor(actor)
      Game.refreshActorAttribute(actor, level)
    }
  }

  function getBattleActors(type: number, battlerIndex: number): Battler[] {
    let arr: Battler[] = []
    if (type === 0)
      arr = [GameBattle.playerBattlers[battlerIndex]]

    else if (type === 1)
      arr = [GameBattle.enemyBattlers[battlerIndex]]

    else if (type === 2)
      arr = [GameBattleAction.fromBattler]

    else if (type === 3)
      arr = [GameBattleAction.hitBattler]

    else if (type === 4)
      arr = GameBattle.playerBattlers

    else if (type === 5)
      arr = GameBattle.enemyBattlers

    return arr
  }

  /**
   * 添加目标状态
   * @param targetBattler 目标战斗者
   * @param statusID 状态
   * @return [boolean]
   */
  function addStatus(targetBattler: Battler, statusID: number, fromBattler: Battler | null = null, force: boolean = false, count: number): boolean {
    // 获取系统预设的该状态，如果不存在则无法添加
    const systemStatus: Module_Status = GameData.getModuleData(10, statusID)
    if (!systemStatus)
      return false
    // 计算命中率
    if (!force && MathUtils.rand(100) >= systemStatus.statusHit)
      return false

    if (fromBattler == null)
      fromBattler = targetBattler
    const targetBattlerActor = targetBattler.actor
    // -- 如果目标免疫该状态的话则忽略
    const targetIsImmuneThisStatus = targetBattlerActor.selfImmuneStatus.indexOf(statusID) !== -1
    if (!force && targetIsImmuneThisStatus)
      return false
    let thisStatus: Module_Status = ArrayUtils.matchAttributes(targetBattlerActor.status, { id: statusID }, true)[0]
    let firstAddStatus = false
    if (thisStatus) {
      thisStatus.currentLayer += count
      if (thisStatus.currentLayer > thisStatus.maxlayer)
        thisStatus.currentLayer = thisStatus.maxlayer
    }
    else {
      firstAddStatus = true
      thisStatus = GameData.newModuleData(10, statusID)
      thisStatus.fromBattlerID = fromBattler.inBattleID
      thisStatus.currentLayer = count
      targetBattlerActor.status.push(thisStatus)
    }
    // -- 自动动画
    if (thisStatus.animation)
      targetBattler.playAnimation(thisStatus.animation, true, true)
    // -- 刷新状态的持续回合
    thisStatus.currentDuration = thisStatus.totalDuration
    // -- 事件处理
    EventUtils.happen(GameBattleData, GameBattleData.EVENT_ADD_STATUS, [fromBattler, targetBattler, statusID, thisStatus, force])
    if (firstAddStatus && thisStatus.eventSetting && thisStatus.addEvent)
      CommandPage.startTriggerFragmentEvent(thisStatus.addEvent, fromBattler, targetBattler)
    return true
  }

  /**
   * 移除目标状态层数
   * @param targetBattler 目标战斗者
   * @param statusID 状态编号
   * @param count 层数
   * @return [boolean]
   */
  function removeStatus(targetBattler: Battler, statusID: number, count: number): boolean {
    // 获取系统预设的该状态，如果不存在则无法添加
    const systemStatus: Module_Status = GameData.getModuleData(10, statusID)
    if (!systemStatus)
      return false
    const targetBattlerActor = targetBattler.actor
    const thisStatusIdx: number = ArrayUtils.matchAttributes(targetBattlerActor.status, { id: statusID }, true, '==', true)[0]
    if (thisStatusIdx != null) {
      const removedStatus = targetBattlerActor.status[thisStatusIdx]
      removedStatus.currentLayer -= count
      // 解除状态+动画
      if (removedStatus.currentLayer <= 0 && systemStatus.animation) {
        targetBattlerActor.status.splice(thisStatusIdx, 1)
        // 如果该动画在其他状态下不存在则直接清除
        if (ArrayUtils.matchAttributes(targetBattlerActor.status, { animation: systemStatus.animation }, true, '==', true).length === 0)
          targetBattler.stopAnimation(systemStatus.animation)
      }
      // -- 事件处理
      EventUtils.happen(GameBattleData, GameBattleData.EVENT_REMOVE_STATUS, [targetBattler, statusID, removedStatus])
      if (systemStatus.eventSetting && systemStatus.removeEvent)
        CommandPage.startTriggerFragmentEvent(systemStatus.removeEvent, targetBattler, targetBattler)
      return true
    }
    return false
  }
}
