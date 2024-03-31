/**
 * #1 道具
 */
class Module_Item {
    id: number;
    name: string;
    icon: string; // = ""; 图标
    intro: string; // = "";
    sell: number; // = 0; 商店售价
    isUse: boolean; // = false; 可使用
    sellEnabled: boolean; // = false; 允许出售给商店
    isConsumables: boolean; // = false; 消耗品
    callEvent: string; // = ""; 使用后执行的事件
    se: string; // = ""; 非战斗使用时音效
    useType: number; // = 0; 使用的场合
    isSingleTarget: boolean; // = true; 指定单个目标
    applyDeadBattler: boolean; // = false; 作用已死亡的目标
    releaseSkill: boolean; // = false; 释放技能
    skill: number; // = 0; 非战斗使用时音效
    releaseAnimation: number; // = 0; 释放动画
    recoveryHP: number; // = 0; 恢复生命值
    recoverySP: number; // = 0; 恢复魔法值
    addStatus: number[]; // = [];
    removeStatus: number[]; // = [];
}
/**
 * #2 预留
 */
class Module_reserve2 {
    id: number;
    name: string;
}
/**
 * #3 预留
 */
class Module_reserve3 {
    id: number;
    name: string;
}
/**
 * #4 预留
 */
class Module_reserve4 {
    id: number;
    name: string;
}
/**
 * #5 预留
 */
class Module_reserve5 {
    id: number;
    name: string;
}
/**
 * #6 角色
 */
class Module_Actor {
    id: number;
    name: string;
    face: string; // = ""; 头像
    class: number; // = 1; 职业
    growUpEnabled: boolean; // = false; 可成长角色
    dropEnabled: boolean; // = false; 死亡后掉落设定
    avatar: number; // = 0; 行走图
    bttlerAvatar: number; // = 0; 战斗图
    takeSetting: boolean; // = false; 初始携带设定
    aiSetting: boolean; // = false; 电脑控制设定
    tsSetting: boolean; // = false; 语音设定
    MaxHP: number; // = 100; 生命值
    MaxSP: number; // = 100; 魔法值
    POW: number; // = 10; 力量
    END: number; // = 5; 耐力
    MAG: number; // = 0; 魔力
    AGI: number; // = 0; 敏捷
    MaxLv: number; // = 100; 最大等级
    levelUpEvent: string; // = ""; 升级后执行的事件
    ActionSpeed: number; // = 0; 行动速度
    MagDef: number; // = 0; 魔法防御力
    HIT: number; // = 100; 命中率
    atkMode: number; // = 0; 普通攻击使用技能代替
    atkSkill: Module_Skill; // = 0; 攻击技能
    hitFrame: number; // = 1; 击中帧
    hitAnimation: number; // = 1; 击中动画
    skills: Module_Skill[]; // = [];
    equips: Module_Equip[]; // = [];
    dropGold: number; // = 0; 掉落金币
    dropExp: number; // = 0; 掉落经验值
    dropEquips: DataStructure_dropEquip[]; // = [];
    dropItems: DataStructure_dropItem[]; // = [];
    tryUseItemProbability: number; // = 20; 尝试使用道具的概率
    tryUseSkillProbability: number; // = 50; 尝试使用技能的概率
    attackVoice: string; // = ""; 攻击语音
    hitVoice: string; // = ""; 受击语音
    dieVoice: string; // = ""; 阵亡语音
    currentEXP: number; // = 0; 当前经验值
    increaseMaxHP: number; // = 0; 增加的最大生命值
    increaseMaxSP: number; // = 0; 增加的最大魔法值
    increasePow: number; // = 0; 增加的力量
    increaseEnd: number; // = 0; 增加的耐力
    increaseMag: number; // = 0; 增加的魔力
    increaseAgi: number; // = 0; 增加的敏捷
    status: Module_Status[]; // = [];
    ATK: number; // = 0; 攻击力
    DEF: number; // = 0; 防御力
    DOD: number; // = 0; 躲避率
    CRIT: number; // = 0; 暴击率
    MagCrit: number; // = 0; 暴击率
    AI: boolean; // = false;
    hp: number; // = 1;
    sp: number; // = 1;
    selfStatus: number[]; // = [];
    selfImmuneStatus: number[]; // = [];
    hitTargetStatus: number[]; // = [];
    hitTargetSelfAddStatus: number[]; // = [];
    dead: boolean; // = false;
}
/**
 * #7 职业
 */
class Module_Class {
    id: number;
    name: string;
    lvUpAutoGetSkills: DataStructure_levelUpLearnSkill[]; // = [];
    icon: string; // = ""; 职业图标
    levelUpEvent: string; // = ""; 升级后执行的事件
    equipSetting: number[]; // = [];
    MaxHPGrow: string; // = ""; 生命值
    MaxSPGrow: string; // = ""; 魔法值
    POWGrow: string; // = ""; 力量
    ENDGrow: string; // = ""; 耐力
    MAGGrow: string; // = ""; 魔力
    AGIGrow: string; // = ""; 敏捷
    needEXPGrow: string; // = ""; 经验值设定
}
/**
 * #8 技能
 */
class Module_Skill {
    id: number;
    name: string;
    icon: string; // = ""; 技能图标
    intro: string; // = "";  
    skillType: number; // = 0; 技能类别
    targetType: number; // = 2; 目标类别
    targetNum: number; // = 1; 目标个数
    totalCD: number; // = 1; 冷却回合
    hit: number; // = 100; 命中率
    costSP: number; // = 0; 消耗魔法值
    costHP: number; // = 0; 消耗生命值
    useDamage: boolean; // = true; 计算伤害
    releaseFrame: number; // = 5; 释放帧
    releaseActionID: number; // = 3; 释放动作
    releaseTimes: number; // = 1; 连击次数
    isMelee: boolean; // = false; 近战攻击
    applyDeadBattler: boolean; // = false; 作用已死亡的目标
    canUsedInMenu: boolean; // = true; 菜单中可使用
    menuSE: string; // = ""; 使用时音效
    bulletSpeed: number; // = 0; 弹幕速度
    bulletAnimation: number; // = 0; 弹幕对象
    damageType: number; // = 0; 伤害类型
    damageValue: number; // = 0; 数值
    additionMultiple: number; // = 100; 属性加成值
    useAddition: boolean; // = true; 属性加成
    additionMultipleType: number; // = 0; 加成类别
    elementType: number; // = 1; 元素类别
    releaseAnimation: number; // = 0; 释放动画
    hitAnimation: number; // = 1; 击中目标的动画
    menuHitAnimation: number; // = 0; 菜单中击中目标的动画
    keepHurtAction: boolean; // = false; 保持受伤动作
    passiveAttribute: boolean; // = false; 被动属性
    passiveStatus: boolean; // = false; 被动状态
    specialAbility: boolean; // = false; 特殊能力
    statusSetting: boolean; // = false; 状态变更
    eventSetting: boolean; // = false; 事件设定
    addStatus: number[]; // = [];
    removeStatus: number[]; // = [];
    useEvent: string; // = ""; 使用技能时事件
    hitEvent: string; // = ""; 击中目标时事件
    releaseEvent: string; // = ""; 释放技能时事件
    maxHP: number; // = 0;
    maxSP: number; // = 0;
    atk: number; // = 0; 攻击力
    def: number; // = 0; 防御力
    mag: number; // = 0; 魔力
    magDef: number; // = 0; 魔法防御力
    hitC: number; // = 0; 命中率变更
    actionSpeed: number; // = 0; 行动速度
    agi: number; // = 0; 敏捷
    crit: number; // = 0; 暴击率变更
    magCrit: number; // = 0; 魔法暴击率变更
    selfStatus: number[]; // = [];
    selfImmuneStatus: number[]; // = [];
    hitTargetStatus: number[]; // = [];
    hitTargetSelfAddStatus: number[]; // = [];
    specialBattleEffect: DataStructure_specialBattleEffect[]; // = [];
    currentCD: number; // = 0;
}
/**
 * #9 装备
 */
class Module_Equip {
    id: number;
    name: string;
    icon: string; // = ""; 装备图标
    intro: string; // = "";  
    sell: number; // = 0; 商店售价
    partID: number; // = 1; 部位
    sellEnabled: boolean; // = true; 允许出售
    type: number; // = 1; 类别
    quality: number; // = 2; 品质
    maxHP: number; // = 0;
    maxSP: number; // = 0;
    atk: number; // = 0; 攻击力
    def: number; // = 0; 防御力
    mag: number; // = 0; 魔力
    magDef: number; // = 0; 魔法防御力
    hit: number; // = 0; 命中率变更
    actionSpeed: number; // = 0; 行动速度
    agi: number; // = 0; 敏捷
    crit: number; // = 0; 暴击率变更
    magCrit: number; // = 0; 魔法暴击率变更
    passiveStatus: boolean; // = false; 被动状态
    eventSetting: boolean; // = false; 事件设定
    wearEvent: string; // = ""; 佩戴时事件
    takeOffEvent: string; // = ""; 卸下时事件
    selfStatus: number[]; // = [];
    selfImmuneStatus: number[]; // = [];
    hitTargetStatus: number[]; // = [];
    hitTargetSelfAddStatus: number[]; // = [];
}
/**
 * #10 状态
 */
class Module_Status {
    id: number;
    name: string;
    icon: string; // = ""; 图标
    intro: string; // = "";
    totalDuration: number; // = 1; 持续回合
    overtime: boolean; // = false; DOT/HOT
    statusHit: number; // = 100; 命中率%
    cantAtk: boolean; // = false; 无法攻击
    cantUseSkill: boolean; // = false; 无法使用技能
    removeWhenInjured: boolean; // = false; 受伤时解除
    maxlayer: number; // = 1; 最大叠加层
    removePer: number; // = 100; 解除概率%
    animation: number; // = 1; 状态自动动画
    cantUseItem: boolean; // = false; 无法使用道具
    cantUseDefense: boolean; // = false; 无法防御
    forceAction: number; // = 0; 强制行为
    turnInterval: number; // = 1; 回合间隔
    damageType: number; // = 0; 伤害类别
    damageValue: number; // = 0; 数值
    additionMultiple: number; // = 100; 属性加成值
    useAddition: boolean; // = false; 属性加成
    additionMultipleType: number; // = 0; 加成类别
    whenOvertimeEvent: string; // = ""; 执行的事件
    elementType: number; // = 1; 元素类别
    maxHP: number; // = 0; maxHP
    maxSP: number; // = 0; maxSP
    atk: number; // = 0; 攻击力
    def: number; // = 0; 防御力
    mag: number; // = 0; 魔力
    magDef: number; // = 0; 魔法防御力
    hit: number; // = 0; 命中率
    actionSpeed: number; // = 0; 行动速度
    crit: number; // = 0; 暴击率变更
    magCrit: number; // = 0; 魔法暴击率
    maxHPPer: number; // = 100; maxHP%
    maxSPPer: number; // = 100; maxSP%
    atkPer: number; // = 100; 攻击力%
    defPer: number; // = 100; 防御力%
    magPer: number; // = 100; 魔力%
    magDefPer: number; // = 100; 魔法防御力%
    hitPer: number; // = 100; 命中率%
    actionSpeedPer: number; // = 100; 行动速度%
    critPer: number; // = 100; 暴击率%
    magCritPer: number; // = 100; 魔法暴击率%
    specialAbility: boolean; // = false; 特殊能力
    eventSetting: boolean; // = false; 事件设定
    addEvent: string; // = ""; 添加状态时事件
    removeEvent: string; // = ""; 移除状态时事件
    specialBattleEffect: DataStructure_specialBattleEffect[]; // = [];
    currentLayer: number; // = 1; 当前层
    fromBattlerID: number; // = 0; 来源的战斗者唯一编号
    currentDuration: number; // = 0;
}
/**
 * #11 队伍
 */
class Module_Party {
    id: number;
    name: string;
    enemys: DataStructure_enemyActor[]; // = [];
    background: string; // = ""; 战斗背景图
    battlerBgType: number; // = 0; 战斗背景类别
    battleScene: number; // = 0; 战斗场景
    battleBGM: string; // = "asset/audio/bgm/Battle_1.ogg"; 战斗音乐
    randEnemy: boolean; // = false; 随机敌人
    takeItemsSetting: boolean; // = false; 携带道具设定
    eventSetting: boolean; // = false; 事件设定
    dropEnabled: boolean; // = false; 额外的掉落设定
    battleStage1_newTurn: string; // = ""; 战斗阶段：新的回合
    battleStage2_beforeAction: string; // = ""; 战斗阶段：行动开始前
    battleStage0_inBattle: string; // = ""; 战斗阶段：开始战斗
    battleStage3_outBattle: string; // = ""; 战斗阶段：结束战斗
    takeItems: DataStructure_enemyTakeItem[]; // = [];
    dropGold: number; // = 0; 掉落金币
    dropExp: number; // = 0; 掉落经验值
    dropEquips: DataStructure_dropEquip[]; // = [];
    dropItems: DataStructure_dropItem[]; // = [];
}
/**
 * #15 
 */
class Module_unnamed15 {
    id: number;
    name: string;
}
/**
 * #16 
 */
class Module_unnamed16 {
    id: number;
    name: string;
}
/**
 * #17 元素类别
 */
class Module_elementType {
    id: number;
    name: string;
}
/**
 * #18 装备类别
 */
class Module_equipType {
    id: number;
    name: string;
}
/**
 * #19 装备部位
 */
class Module_equipParts {
    id: number;
    name: string;
}
/**
 * #20 装备品质
 */
class Module_equipQuality {
    id: number;
    name: string;
}
/**
 * #21 
 */
class Module_unnamed21 {
    id: number;
    name: string;
}
