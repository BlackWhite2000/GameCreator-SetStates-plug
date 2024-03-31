/**
 * #1 preloadAsset
 */
class DataStructure_preloadAsset {
    assetType: number; // = 0; 资源类型
    asset0: string; // = ""; 图片
    asset1: string; // = ""; 音频
    asset2: number; // = 1; 行走图
    asset3: number; // = 1; 立绘
    asset4: number; // = 1; 动画
    asset5: number; // = 1; 界面
    asset6: number; // = 1; 对话框
}
/**
 * #2 packageItem
 */
class DataStructure_packageItem {
    isEquip: boolean; // = false; 是否装备
    equip: Module_Equip; // = 0; 装备
    item: Module_Item; // = 0; 道具
    number: number; // = 1; 数目
}
/**
 * #3 keys
 */
class DataStructure_keys {
    key: number; // = 0; 按键
}
/**
 * #4 
 */
class DataStructure_compName {
    未命名变量1: string; // = "";
}
/**
 * #5 shopItem
 */
class DataStructure_shopItem {
    isEquip: boolean; // = false; 装备
    item: number; // = 1; 道具
    equip: number; // = 1; 装备
    numberType: number; // = 0;
    number: number; // = 1; 数量
    numberVar: number; // = 0; 数量
    priceType: number; // = 0;
    price: number; // = 0; 价格
    priceVar: number; // = 0; 价格
}
/**
 * #6 gameKeyboard
 */
class DataStructure_gameKeyboard {
    gameKey: number; // = 0; 键位
    keyCode1: number; // = 0; 值1
    keyCode2: number; // = 0; 值2
    keyCode3: number; // = 0; 值3
    keyCode4: number; // = 0; 值4
}
/**
 * #7 inputMessage
 */
class DataStructure_inputMessage {
    type: number; // = 0; 类别
    numberValue: any; // 游戏数值
    booleanValue: any; // 游戏开关
    stringValue: any; // 游戏字符串
}
/**
 * #1001 dropItem
 */
class DataStructure_dropItem {
    dropProbability: number; // = 100; 掉落几率
    item: number; // = 1; 掉落道具
    num: number; // = 1; 数量
}
/**
 * #1002 dropEquip
 */
class DataStructure_dropEquip {
    dropProbability: number; // = 100; 掉落几率
    equip: Module_Equip; // = 1; 掉落装备
}
/**
 * #1003 classValidity
 */
class DataStructure_classValidity {
    class: number; // = 0; 职业
    per: number; // = 100; 有效度
}
/**
 * #1004 levelUpLearnSkill
 */
class DataStructure_levelUpLearnSkill {
    lv: number; // = 2;
    skill: number; // = 0; 技能
}
/**
 * #1005 inPartyActor
 */
class DataStructure_inPartyActor {
    actor: Module_Actor; // = 0;
    lv: number; // = 1; 等级
    dissolutionEnabled: boolean; // = true; 允许解散
}
/**
 * #1006 enemyActor
 */
class DataStructure_enemyActor {
    lv: number; // = 1; 等级
    actor: number; // = 1;
}
/**
 * #1007 enemyTakeItem
 */
class DataStructure_enemyTakeItem {
    item: Module_Item; // = 0; 道具
    number: number; // = 1; 数目
}
/**
 * #1008 equipRand
 */
class DataStructure_equipRand {
    type: number; // = 0; 属性
    usePer: boolean; // = true; 按照比例
    minValue: number; // = 100; 最低浮动率
    maxValue: number; // = 150; 最高浮动率
    minFixValue: number; // = 0; 最低浮动值
    maxFixValue: number; // = 0; 最高浮动值
    probability: number; // = 100; 概率
}
/**
 * #1009 specialBattleEffect
 */
class DataStructure_specialBattleEffect {
    type: number; // = 0; 类别
    counterattackPer: number; // = 100; 概率%
    counterattackDmagePer: number; // = 100; 伤害%
    returnPer: number; // = 100; 概率%
    returnDamagePer: number; // = 100; 伤害%
    suckCondition: number; // = 0; 限定条件
    attackTimesPer: number; // = 100; 概率%
    damagePer: number; // = 100; 有效度%
    resurrectionPer: number; // = 50; 概率%
    healthPer: number; // = 100; 恢复生命值%
    suckPer: number; // = 100; 吸取%
    strikePer: number; // = 100; 有效度%
    elementType: number; // = 1; 元素类别
    effectiveness: number; // = 100; 有效度%
}
/**
 * #1010 equipQualitySetting
 */
class DataStructure_equipQualitySetting {
    equipQualityType: number; // = 0; 品质
    color: string; // = ""; 颜色
}
