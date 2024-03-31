/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */

/**
 * 1-标题界面 [BASE]
 */
class GUI_1 extends GUI_BASE {
   标题背景:UIBitmap;
   衬底:UIBitmap;
   GameLOGO:UIBitmap;
   游戏标题:UIBitmap;
   游戏副标题:UIBitmap;
   开始游戏按钮:UIButton;
   读取存档按钮:UIButton;
   游戏设置按钮:UIButton;
   退出游戏按钮:UIButton;
   constructor(){
      super(1);
   }
}
class ListItem_1 extends UIListItemData {
   标题背景:string;
   衬底:string;
   GameLOGO:string;
   游戏标题:string;
   游戏副标题:string;

}

/**
 * 2-读档界面 [BASE]
 */
class GUI_2 extends GUI_BASE {
   背景:UIBitmap;
   黑色遮罩:UIBitmap;
   界面框背景:UIBitmap;
   滚动条背景遮罩:UIBitmap;
   list:UIList; // Item=1001
   档案滚动条框:UIBitmap;
   关闭读档界面按钮:UIButton;
   界面标题背景:UIBitmap;
   界面标题:UIString;
   constructor(){
      super(2);
   }
}
class ListItem_2 extends UIListItemData {
   背景:string;
   黑色遮罩:string;
   界面框背景:string;
   滚动条背景遮罩:string;
   list:UIListItemData[];
   档案滚动条框:string;
   界面标题背景:string;
   界面标题:string;
}

/**
 * 3-菜单界面 [BASE]
 */
class GUI_3 extends GUI_BASE {
   黑底:UIBitmap;
   顶部菜单背景:UIBitmap;
   菜单标志:UIBitmap;
   背包按钮:UIButton;
   存档按钮:UIButton;
   读档按钮:UIButton;
   设置按钮:UIButton;
   返回标题界面按钮:UIButton;
   返回游戏按钮:UIButton;
   队伍编成按钮:UIButton;
   constructor(){
      super(3);
   }
}
class ListItem_3 extends UIListItemData {
   黑底:string;
   顶部菜单背景:string;
   菜单标志:string;

}

/**
 * 4-背包界面 [BASE]
 */
class GUI_4 extends GUI_BASE {
   背景:UIBitmap;
   黑色遮罩:UIBitmap;
   道具框背景:UIBitmap;
   说明栏背景:UIBitmap;
   说明栏背景底衬:UIBitmap;
   货币栏背景:UIBitmap;
   背包标题背景:UIBitmap;
   背包滚动条背景遮罩:UIBitmap;
   详细滚动条背景遮罩:UIBitmap;
   list:UIList; // Item=1002
   背包滚动条框:UIBitmap;
   itemIntroRoot:UIRoot;
   itemIntro:UIString;
   详细滚动条框:UIBitmap;
   itemName:UIString;
   玩家金币数:UIString;
   关闭背包界面按钮:UIButton;
   货币图片:UIBitmap;
   我的金币文本:UIString;
   targetUI:GUI_TargetActor;
   装饰线:UIBitmap;
   详细文本:UIString;
   道具名称文本:UIString;
   持有数量文本:UIString;
   背包标题:UIString;
   constructor(){
      super(4);
   }
}
class ListItem_4 extends UIListItemData {
   背景:string;
   黑色遮罩:string;
   道具框背景:string;
   说明栏背景:string;
   说明栏背景底衬:string;
   货币栏背景:string;
   背包标题背景:string;
   背包滚动条背景遮罩:string;
   详细滚动条背景遮罩:string;
   list:UIListItemData[];
   背包滚动条框:string;
   itemIntro:string;
   详细滚动条框:string;
   itemName:string;
   货币图片:string;
   我的金币文本:string;
   targetUI:number;
   装饰线:string;
   详细文本:string;
   道具名称文本:string;
   持有数量文本:string;
   背包标题:string;
}

/**
 * 5-存档界面 [BASE]
 */
class GUI_5 extends GUI_BASE {
   背景:UIBitmap;
   黑色遮罩:UIBitmap;
   界面框背景:UIBitmap;
   滚动条背景遮罩:UIBitmap;
   list:UIList; // Item=1001
   关闭存档界面按钮:UIButton;
   档案滚动条框:UIBitmap;
   界面标题背景:UIBitmap;
   界面标题:UIString;
   constructor(){
      super(5);
   }
}
class ListItem_5 extends UIListItemData {
   背景:string;
   黑色遮罩:string;
   界面框背景:string;
   滚动条背景遮罩:string;
   list:UIListItemData[];
   档案滚动条框:string;
   界面标题背景:string;
   界面标题:string;
}

/**
 * 6-系统设置 [BASE]
 */
class GUI_6 extends GUI_BASE {
   背景:UIBitmap;
   黑色遮罩:UIBitmap;
   顶部菜单背景:UIBitmap;
   设置框背景:UIBitmap;
   设置标题:UIString;
   typeTab:UITabBox;
   常规:UIRoot;
   bgmFocus:UIButton;
   bgsFocus:UIButton;
   seFocus:UIButton;
   tsFocus:UIButton;
   背景音乐条底部:UIBitmap;
   背景音乐条框:UIBitmap;
   背景音效条底部:UIBitmap;
   背景音效条框:UIBitmap;
   音效条底部:UIBitmap;
   音效条框:UIBitmap;
   语音条底部:UIBitmap;
   语音条框:UIBitmap;
   bgmSlider:UISlider;
   bgsSlider:UISlider;
   seSlider:UISlider;
   tsSlider:UISlider;
   背景音乐音量文本:UIString;
   环境音效音量文本:UIString;
   音效音量文本:UIString;
   语音音量文本:UIString;
   键盘控制:UIRoot;
   键盘滚动条背景遮罩:UIBitmap;
   keyboardList:UIList; // Item=1018
   键盘滚动条框:UIBitmap;
   keyboardReset:UIButton;
   手柄控制:UIRoot;
   手柄滚动条背景遮罩:UIBitmap;
   gamepadList:UIList; // Item=1019
   手柄滚动条框:UIBitmap;
   gamepadReset:UIButton;
   关闭系统设置界面按钮:UIButton;
   needInputKeyPanel:UIBitmap;
   needInputKeyLabel:UIString;
   constructor(){
      super(6);
   }
}
class ListItem_6 extends UIListItemData {
   背景:string;
   黑色遮罩:string;
   顶部菜单背景:string;
   设置框背景:string;
   设置标题:string;
   typeTab:string;
   背景音乐条底部:string;
   背景音乐条框:string;
   背景音效条底部:string;
   背景音效条框:string;
   音效条底部:string;
   音效条框:string;
   语音条底部:string;
   语音条框:string;
   bgmSlider:number;
   bgsSlider:number;
   seSlider:number;
   tsSlider:number;
   背景音乐音量文本:string;
   环境音效音量文本:string;
   音效音量文本:string;
   语音音量文本:string;
   键盘滚动条背景遮罩:string;
   keyboardList:UIListItemData[];
   键盘滚动条框:string;
   手柄滚动条背景遮罩:string;
   gamepadList:UIListItemData[];
   手柄滚动条框:string;
   needInputKeyPanel:string;
   needInputKeyLabel:string;
}

/**
 * 7-文本输入界面 [BASE]
 */
class GUI_7 extends GUI_BASE {
   界面背景:UIBitmap;
   输入框背景:UIBitmap;
   input:UIInput;
   提交文本输入按钮:UIButton;
   constructor(){
      super(7);
   }
}
class ListItem_7 extends UIListItemData {
   界面背景:string;
   输入框背景:string;
   input:string;

}

/**
 * 8-数字输入界面 [BASE]
 */
class GUI_8 extends GUI_BASE {
   界面背景:UIBitmap;
   输入框背景:UIBitmap;
   input:UIInput;
   提交数字输入按钮:UIButton;
   constructor(){
      super(8);
   }
}
class ListItem_8 extends UIListItemData {
   界面背景:string;
   输入框背景:string;
   input:string;

}

/**
 * 9-密码输入界面 [BASE]
 */
class GUI_9 extends GUI_BASE {
   界面背景:UIBitmap;
   输入框背景:UIBitmap;
   input:UIInput;
   提交密码输入按钮:UIButton;
   constructor(){
      super(9);
   }
}
class ListItem_9 extends UIListItemData {
   界面背景:string;
   输入框背景:string;
   input:string;

}

/**
 * 10-游戏结束界面 [BASE]
 */
class GUI_10 extends GUI_BASE {
   半透明背景:UIBitmap;
   梦之剑:UIBitmap;
   底部装饰:UIBitmap;
   GameOver文本:UIString;
   constructor(){
      super(10);
   }
}
class ListItem_10 extends UIListItemData {
   半透明背景:string;
   梦之剑:string;
   底部装饰:string;
   GameOver文本:string;
}

/**
 * 11-商店界面 [BASE]
 */
class GUI_11 extends GUI_BASE {
   背景:UIBitmap;
   黑色遮罩:UIBitmap;
   顶部菜单背景:UIBitmap;
   商店标题:UIString;
   goodsListBox:UIBitmap;
   文本_商品名称:UIString;
   文本_价格:UIString;
   文本_数量:UIString;
   文本_持有数量:UIString;
   滚动条背景遮罩:UIBitmap;
   goodsList:UIList; // Item=1003
   sellItemList:UIList; // Item=1003
   滚动条框:UIBitmap;
   说明栏背景:UIBitmap;
   装饰线:UIBitmap;
   详细文本:UIString;
   buyBox:UIRoot;
   buyBoxArea:UIRoot;
   购买数量背景底衬:UIBitmap;
   buyNum_text:UIString;
   sellNum_text:UIString;
   subNumBtn:UIButton;
   addNumBtn:UIButton;
   maxNumBtn:UIButton;
   购买数量背景纹路:UIBitmap;
   buyNum:UIString;
   sureBtn:UIButton;
   cancelBtn:UIButton;
   详细滚动条背景遮罩:UIBitmap;
   itemBox:UIBitmap;
   itemName:UIString;
   itemIntroRoot:UIRoot;
   itemIntro:UIString;
   详细滚动条框:UIBitmap;
   货币栏背景:UIBitmap;
   goldNum:UIString;
   closeBtn:UIButton;
   typeTab:UITabBox;
   我的金币文本:UIString;
   货币图片:UIBitmap;
   constructor(){
      super(11);
   }
}
class ListItem_11 extends UIListItemData {
   背景:string;
   黑色遮罩:string;
   顶部菜单背景:string;
   商店标题:string;
   goodsListBox:string;
   文本_商品名称:string;
   文本_价格:string;
   文本_数量:string;
   文本_持有数量:string;
   滚动条背景遮罩:string;
   goodsList:UIListItemData[];
   sellItemList:UIListItemData[];
   滚动条框:string;
   说明栏背景:string;
   装饰线:string;
   详细文本:string;
   购买数量背景底衬:string;
   buyNum_text:string;
   sellNum_text:string;
   购买数量背景纹路:string;
   buyNum:string;
   详细滚动条背景遮罩:string;
   itemBox:string;
   itemName:string;
   itemIntro:string;
   详细滚动条框:string;
   货币栏背景:string;
   typeTab:string;
   我的金币文本:string;
   货币图片:string;
}

/**
 * 12-虚拟按键 [BASE]
 */
class GUI_12 extends GUI_BASE {
   容器:UIRoot;
   A:UIButton;
   B:UIButton;
   START:UIButton;
   BACK:UIButton;
   rockerBg:UIBitmap;
   上标识:UIBitmap;
   右标识:UIBitmap;
   下标识:UIBitmap;
   左标识:UIBitmap;
   rocker:UIBitmap;
   dirBtnRoot:UIRoot;
   上按钮:UIButton;
   下按钮:UIButton;
   左按钮:UIButton;
   右按钮:UIButton;
   隐藏按键:UIButton;
   constructor(){
      super(12);
   }
}
class ListItem_12 extends UIListItemData {
   rockerBg:string;
   上标识:string;
   右标识:string;
   下标识:string;
   左标识:string;
   rocker:string;

}

/**
 * 13-计时器 [BASE]
 */
class GUI_13 extends GUI_BASE {
   图片:UIBitmap;
   time:UIString;
   constructor(){
      super(13);
   }
}
class ListItem_13 extends UIListItemData {
   图片:string;
   time:string;
}

/**
 * 14-预留 [BASE]
 */
class GUI_14 extends GUI_BASE {

   constructor(){
      super(14);
   }
}
class ListItem_14 extends UIListItemData {

}

/**
 * 15-预留 [BASE]
 */
class GUI_15 extends GUI_BASE {

   constructor(){
      super(15);
   }
}
class ListItem_15 extends UIListItemData {

}

/**
 * 16-队伍编成 [BASE]
 */
class GUI_16 extends GUI_BASE {
   背景:UIBitmap;
   黑色遮罩:UIBitmap;
   顶部菜单背景:UIBitmap;
   队伍编成标题:UIString;
   关闭队伍编成界面按钮:UIButton;
   actorPanel:UIBitmap;
   actorList:UIList; // Item=1011
   人物属性背景:UIBitmap;
   actorBattler:UIAvatar;
   actorName:UIString;
   classIcon:UIBitmap;
   等级经验容器:UIRoot;
   职业底衬:UIBitmap;
   经验条底部:UIBitmap;
   actorExpSlider:UISlider;
   经验条框:UIBitmap;
   actorExpInfo:UIString;
   actorClass:UIString;
   actorLv:UIString;
   EXP标志:UIBitmap;
   属性底衬:UIBitmap;
   属性显示容器:UIRoot;
   文本Label:UIRoot;
   HPLabel:UIBitmap;
   MPLabel:UIBitmap;
   攻击力Label:UIString;
   防御力Label:UIString;
   魔力Label:UIString;
   魔法防御力Label:UIString;
   命中Label:UIString;
   躲避Label:UIString;
   力量Label:UIString;
   耐力Label:UIString;
   敏捷Label:UIString;
   行动速度Label:UIString;
   暴击率Label:UIString;
   魔法暴击率Label:UIString;
   属性Label:UIRoot;
   maxHP:UIString;
   maxSP:UIString;
   atk:UIString;
   def:UIString;
   mag:UIString;
   magDef:UIString;
   hit:UIString;
   dod:UIString;
   pow:UIString;
   end:UIString;
   agi:UIString;
   actionSpeed:UIString;
   crit:UIString;
   magCrit:UIString;
   attributeChangeBox:UIRoot;
   maxHPChange:UIString;
   maxSPChange:UIString;
   atkChange:UIString;
   defChange:UIString;
   magChange:UIString;
   magDefChange:UIString;
   hitChange:UIString;
   dodChange:UIString;
   powChange:UIString;
   endChange:UIString;
   agiChange:UIString;
   actionSpeedChange:UIString;
   critChange:UIString;
   magCritChange:UIString;
   属性标题:UIString;
   smallAvatar:UIAvatar;
   图片:UIBitmap;
   说明栏背景:UIBitmap;
   说明栏底衬:UIBitmap;
   descRoot:UIRoot;
   descName:UIString;
   descText:UIString;
   配置项背景:UIBitmap;
   actorPanelTab:UITabBox;
   skillPanel:UIBitmap;
   技能滚动条背景遮罩:UIBitmap;
   技能栏:UIBitmap;
   actorSkillList:UIList; // Item=1013
   技能标题:UIString;
   技能滚动条框:UIBitmap;
   装饰线:UIBitmap;
   装备栏:UIBitmap;
   装备库底衬:UIBitmap;
   装备滚动条背景遮罩:UIBitmap;
   actorEquipPanel:UIBitmap;
   actorEquipList:UIList; // Item=1012
   equipPackagePanel:UIBitmap;
   equipPackageList:UIList; // Item=1014
   装备标题:UIString;
   装备滚动条框:UIBitmap;
   设置栏:UIBitmap;
   设置标题:UIString;
   电脑控制背景框:UIBitmap;
   设置自动行动文本:UIString;
   aiBtn:UIButton;
   ai:UICheckBox;
   dissolutionBox:UIBitmap;
   解散文本:UIString;
   dissolutionBtn:UIButton;
   targetUI:GUI_TargetActor;
   constructor(){
      super(16);
   }
}
class ListItem_16 extends UIListItemData {
   背景:string;
   黑色遮罩:string;
   顶部菜单背景:string;
   队伍编成标题:string;
   actorPanel:string;
   actorList:UIListItemData[];
   人物属性背景:string;
   actorBattler:number;
   actorName:string;
   classIcon:string;
   职业底衬:string;
   经验条底部:string;
   actorExpSlider:number;
   经验条框:string;
   actorExpInfo:string;
   actorClass:string;
   actorLv:string;
   EXP标志:string;
   属性底衬:string;
   HPLabel:string;
   MPLabel:string;
   攻击力Label:string;
   防御力Label:string;
   魔力Label:string;
   魔法防御力Label:string;
   命中Label:string;
   躲避Label:string;
   力量Label:string;
   耐力Label:string;
   敏捷Label:string;
   行动速度Label:string;
   暴击率Label:string;
   魔法暴击率Label:string;
   maxHP:string;
   maxSP:string;
   atk:string;
   def:string;
   mag:string;
   magDef:string;
   hit:string;
   dod:string;
   pow:string;
   end:string;
   agi:string;
   actionSpeed:string;
   crit:string;
   magCrit:string;
   maxHPChange:string;
   maxSPChange:string;
   atkChange:string;
   defChange:string;
   magChange:string;
   magDefChange:string;
   hitChange:string;
   dodChange:string;
   powChange:string;
   endChange:string;
   agiChange:string;
   actionSpeedChange:string;
   critChange:string;
   magCritChange:string;
   属性标题:string;
   smallAvatar:number;
   图片:string;
   说明栏背景:string;
   说明栏底衬:string;
   descName:string;
   descText:string;
   配置项背景:string;
   actorPanelTab:string;
   skillPanel:string;
   技能滚动条背景遮罩:string;
   技能栏:string;
   actorSkillList:UIListItemData[];
   技能标题:string;
   技能滚动条框:string;
   装饰线:string;
   装备栏:string;
   装备库底衬:string;
   装备滚动条背景遮罩:string;
   actorEquipPanel:string;
   actorEquipList:UIListItemData[];
   equipPackagePanel:string;
   equipPackageList:UIListItemData[];
   装备标题:string;
   装备滚动条框:string;
   设置栏:string;
   设置标题:string;
   电脑控制背景框:string;
   设置自动行动文本:string;
   ai:boolean;
   dissolutionBox:string;
   解散文本:string;
   targetUI:number;
}

/**
 * 17-指定角色 [BASE]
 */
class GUI_17 extends GUI_BASE {
   targetPanel:UIBitmap;
   队伍框背景:UIBitmap;
   actorList:UIList; // Item=1015
   closeTargetBtn:UIButton;
   constructor(){
      super(17);
   }
}
class ListItem_17 extends UIListItemData {
   targetPanel:string;
   队伍框背景:string;
   actorList:UIListItemData[];

}

/**
 * 18-预留 [BASE]
 */
class GUI_18 extends GUI_BASE {

   constructor(){
      super(18);
   }
}
class ListItem_18 extends UIListItemData {

}

/**
 * 19-预留 [BASE]
 */
class GUI_19 extends GUI_BASE {

   constructor(){
      super(19);
   }
}
class ListItem_19 extends UIListItemData {

}

/**
 * 20-====战斗相关==== [BASE]
 */
class GUI_20 extends GUI_BASE {

   constructor(){
      super(20);
   }
}
class ListItem_20 extends UIListItemData {

}

/**
 * 21-战斗界面 [BASE]
 */
class GUI_21 extends GUI_BASE {
   background:UIBitmap;
   battlerRoot:UIRoot;
   enemy0:UIAvatar;
   moveToHelper:UIBitmap;
   enemy1:UIAvatar;
   enemy2:UIAvatar;
   enemy3:UIAvatar;
   enemy4:UIAvatar;
   enemy5:UIAvatar;
   enemy6:UIAvatar;
   enemy7:UIAvatar;
   playerActor0:UIAvatar;
   playerActor1:UIAvatar;
   playerActor2:UIAvatar;
   playerActor3:UIAvatar;
   playerActor4:UIAvatar;
   playerActor5:UIAvatar;
   playerActor6:UIAvatar;
   playerActor7:UIAvatar;
   actorInfoList:UIList; // Item=1025
   提示文本背景:UIBitmap;
   actionText:UIString;
   constructor(){
      super(21);
   }
}
class ListItem_21 extends UIListItemData {
   background:string;
   enemy0:number;
   moveToHelper:string;
   enemy1:number;
   enemy2:number;
   enemy3:number;
   enemy4:number;
   enemy5:number;
   enemy6:number;
   enemy7:number;
   playerActor0:number;
   playerActor1:number;
   playerActor2:number;
   playerActor3:number;
   playerActor4:number;
   playerActor5:number;
   playerActor6:number;
   playerActor7:number;
   actorInfoList:UIListItemData[];
   提示文本背景:string;
   actionText:string;
}

/**
 * 22-战斗-战斗者菜单 [BASE]
 */
class GUI_22 extends GUI_BASE {
   菜单背景:UIBitmap;
   攻击按钮:UIButton;
   技能按钮:UIButton;
   道具按钮:UIButton;
   防御按钮:UIButton;
   状态按钮:UIButton;
   自动按钮:UIButton;
   constructor(){
      super(22);
   }
}
class ListItem_22 extends UIListItemData {
   菜单背景:string;

}

/**
 * 23-战斗-通用菜单 [BASE]
 */
class GUI_23 extends GUI_BASE {
   底部装饰:UIBitmap;
   战斗按钮:UIButton;
   逃跑按钮:UIButton;
   文本提示:UIString;
   constructor(){
      super(23);
   }
}
class ListItem_23 extends UIListItemData {
   底部装饰:string;
   文本提示:string;
}

/**
 * 24-战斗-技能栏 [BASE]
 */
class GUI_24 extends GUI_BASE {
   黑底:UIBitmap;
   说明栏背景:UIBitmap;
   技能栏:UIBitmap;
   技能滚动条背景遮罩:UIBitmap;
   skillList:UIList; // Item=1013
   技能滚动条框:UIBitmap;
   tipsUI:GUI_1027;
   关闭技能栏按钮:UIButton;
   技能标题:UIString;
   装饰线:UIBitmap;
   constructor(){
      super(24);
   }
}
class ListItem_24 extends UIListItemData {
   黑底:string;
   说明栏背景:string;
   技能栏:string;
   技能滚动条背景遮罩:string;
   skillList:UIListItemData[];
   技能滚动条框:string;
   tipsUI:number;
   技能标题:string;
   装饰线:string;
}

/**
 * 25-战斗-道具栏 [BASE]
 */
class GUI_25 extends GUI_BASE {
   黑底:UIBitmap;
   说明栏背景:UIBitmap;
   道具栏:UIBitmap;
   道具滚动条背景遮罩:UIBitmap;
   itemList:UIList; // Item=1031
   道具滚动条背景框:UIBitmap;
   tipsUI:GUI_1027;
   关闭道具栏按钮:UIButton;
   道具标题:UIString;
   装饰线:UIBitmap;
   constructor(){
      super(25);
   }
}
class ListItem_25 extends UIListItemData {
   黑底:string;
   说明栏背景:string;
   道具栏:string;
   道具滚动条背景遮罩:string;
   itemList:UIListItemData[];
   道具滚动条背景框:string;
   tipsUI:number;
   道具标题:string;
   装饰线:string;
}

/**
 * 26-战斗-状态栏 [BASE]
 */
class GUI_26 extends GUI_BASE {
   黑底:UIBitmap;
   状态背景:UIBitmap;
   人物属性背景:UIBitmap;
   actorFace:UIBitmap;
   actorName:UIString;
   等级经验容器:UIRoot;
   职业底衬:UIBitmap;
   经验条底部:UIBitmap;
   actorExpSlider:UISlider;
   经验条框:UIBitmap;
   actorExpInfo:UIString;
   actorClass:UIString;
   actorLv:UIString;
   EXP标志:UIBitmap;
   classIcon:UIBitmap;
   属性底衬:UIBitmap;
   属性显示容器:UIRoot;
   文本Label:UIRoot;
   HPLabel:UIBitmap;
   MPLabel:UIBitmap;
   攻击力Label:UIString;
   防御力Label:UIString;
   魔力Label:UIString;
   魔法防御力Label:UIString;
   命中Label:UIString;
   躲避Label:UIString;
   力量Label:UIString;
   耐力Label:UIString;
   敏捷Label:UIString;
   行动速度Label:UIString;
   暴击率Label:UIString;
   魔法暴击率Label:UIString;
   属性Label:UIRoot;
   maxHP:UIString;
   maxSP:UIString;
   atk:UIString;
   def:UIString;
   mag:UIString;
   magDef:UIString;
   hit:UIString;
   dod:UIString;
   pow:UIString;
   end:UIString;
   agi:UIString;
   actionSpeed:UIString;
   crit:UIString;
   magCrit:UIString;
   smallAvatar:UIAvatar;
   属性标题:UIString;
   图片:UIBitmap;
   状态说明滚动条背景遮罩:UIBitmap;
   statusList:UIList; // Item=1028
   状态说明滚动条框:UIBitmap;
   关闭状态栏按钮:UIButton;
   技能标题:UIString;
   装饰线:UIBitmap;
   constructor(){
      super(26);
   }
}
class ListItem_26 extends UIListItemData {
   黑底:string;
   状态背景:string;
   人物属性背景:string;
   actorFace:string;
   actorName:string;
   职业底衬:string;
   经验条底部:string;
   actorExpSlider:number;
   经验条框:string;
   actorExpInfo:string;
   actorClass:string;
   actorLv:string;
   EXP标志:string;
   classIcon:string;
   属性底衬:string;
   HPLabel:string;
   MPLabel:string;
   攻击力Label:string;
   防御力Label:string;
   魔力Label:string;
   魔法防御力Label:string;
   命中Label:string;
   躲避Label:string;
   力量Label:string;
   耐力Label:string;
   敏捷Label:string;
   行动速度Label:string;
   暴击率Label:string;
   魔法暴击率Label:string;
   maxHP:string;
   maxSP:string;
   atk:string;
   def:string;
   mag:string;
   magDef:string;
   hit:string;
   dod:string;
   pow:string;
   end:string;
   agi:string;
   actionSpeed:string;
   crit:string;
   magCrit:string;
   smallAvatar:number;
   属性标题:string;
   图片:string;
   状态说明滚动条背景遮罩:string;
   statusList:UIListItemData[];
   状态说明滚动条框:string;
   技能标题:string;
   装饰线:string;
}

/**
 * 27-战斗-奖励 [BASE]
 */
class GUI_27 extends GUI_BASE {
   底部装饰:UIBitmap;
   战斗结束标志:UIBitmap;
   装饰线:UIBitmap;
   actorBlock:UIBitmap;
   actorList:UIList; // Item=1032
   itemBlock:UIBitmap;
   dropItemList:UIList; // Item=1029
   getExp:UIString;
   getGold:UIString;
   获得金币文本:UIString;
   获得EXP文本:UIString;
   金币标志:UIBitmap;
   获得EXP标志:UIBitmap;
   skillBlock:UIRoot;
   半透明背景:UIBitmap;
   技能获得栏背景:UIBitmap;
   获得技能底衬:UIBitmap;
   习得技能装饰线:UIBitmap;
   learnSkillText:UIString;
   learnSkillList:UIList; // Item=1030
   learnSkillActorFace:UIBitmap;
   constructor(){
      super(27);
   }
}
class ListItem_27 extends UIListItemData {
   底部装饰:string;
   战斗结束标志:string;
   装饰线:string;
   actorBlock:string;
   actorList:UIListItemData[];
   itemBlock:string;
   dropItemList:UIListItemData[];
   getExp:string;
   getGold:string;
   获得金币文本:string;
   获得EXP文本:string;
   金币标志:string;
   获得EXP标志:string;
   半透明背景:string;
   技能获得栏背景:string;
   获得技能底衬:string;
   习得技能装饰线:string;
   learnSkillText:string;
   learnSkillList:UIListItemData[];
   learnSkillActorFace:string;
}

/**
 * 28- [BASE]
 */
class GUI_28 extends GUI_BASE {

   constructor(){
      super(28);
   }
}
class ListItem_28 extends UIListItemData {

}

/**
 * 29- [BASE]
 */
class GUI_29 extends GUI_BASE {

   constructor(){
      super(29);
   }
}
class ListItem_29 extends UIListItemData {

}

/**
 * 30- [BASE]
 */
class GUI_30 extends GUI_BASE {

   constructor(){
      super(30);
   }
}
class ListItem_30 extends UIListItemData {

}

/**
 * 1001-档案_Item [BASE]
 */
class GUI_1001 extends GUI_BASE {
   项目背景:UIBitmap;
   screenshotImg:UIBitmap;
   截图背景:UIBitmap;
   存档编号背景:UIBitmap;
   存档编号英文:UIString;
   mapName:UIString;
   dateStr:UIString;
   no:UIString;
   delBtn:UIButton;
   关闭标志:UIBitmap;
   texts:UIRoot;
   游戏时长文本:UIString;
   创建时间文本:UIString;
   gameTimeStr:UIString;
   地图名称装饰:UIBitmap;
   constructor(){
      super(1001);
   }
}
class ListItem_1001 extends UIListItemData {
   项目背景:string;
   screenshotImg:string;
   截图背景:string;
   存档编号背景:string;
   存档编号英文:string;
   mapName:string;
   dateStr:string;
   no:string;
   关闭标志:string;
   游戏时长文本:string;
   创建时间文本:string;
   gameTimeStr:string;
   地图名称装饰:string;
}

/**
 * 1002-道具_Item [BASE]
 */
class GUI_1002 extends GUI_BASE {
   项目背景:UIBitmap;
   itemNum:UIString;
   itemName:UIString;
   道具背景:UIBitmap;
   icon:UIBitmap;
   道具框:UIBitmap;
   constructor(){
      super(1002);
   }
}
class ListItem_1002 extends UIListItemData {
   项目背景:string;
   itemNum:string;
   itemName:string;
   道具背景:string;
   icon:string;
   道具框:string;
}

/**
 * 1003-商品_Item [BASE]
 */
class GUI_1003 extends GUI_BASE {
   项目背景:UIBitmap;
   ownNum:UIString;
   itemNum:UIString;
   道具背景:UIBitmap;
   itemPrice:UIString;
   道具框:UIBitmap;
   itemName:UIString;
   icon:UIBitmap;
   constructor(){
      super(1003);
   }
}
class ListItem_1003 extends UIListItemData {
   项目背景:string;
   ownNum:string;
   itemNum:string;
   道具背景:string;
   itemPrice:string;
   道具框:string;
   itemName:string;
   icon:string;
}

/**
 * 1004- [BASE]
 */
class GUI_1004 extends GUI_BASE {

   constructor(){
      super(1004);
   }
}
class ListItem_1004 extends UIListItemData {

}

/**
 * 1005- [BASE]
 */
class GUI_1005 extends GUI_BASE {

   constructor(){
      super(1005);
   }
}
class ListItem_1005 extends UIListItemData {

}

/**
 * 1006- [BASE]
 */
class GUI_1006 extends GUI_BASE {

   constructor(){
      super(1006);
   }
}
class ListItem_1006 extends UIListItemData {

}

/**
 * 1007- [BASE]
 */
class GUI_1007 extends GUI_BASE {

   constructor(){
      super(1007);
   }
}
class ListItem_1007 extends UIListItemData {

}

/**
 * 1008-按钮选中效果样式1 [BASE]
 */
class GUI_1008 extends GUI_BASE {
   容器:UIRoot;
   target:UIBitmap;
   constructor(){
      super(1008);
   }
}
class ListItem_1008 extends UIListItemData {
   target:string;
}

/**
 * 1009-按钮选中效果样式2 [BASE]
 */
class GUI_1009 extends GUI_BASE {
   容器:UIRoot;
   target:UIBitmap;
   constructor(){
      super(1009);
   }
}
class ListItem_1009 extends UIListItemData {
   target:string;
}

/**
 * 1010-按钮选中效果样式3 [BASE]
 */
class GUI_1010 extends GUI_BASE {
   容器:UIRoot;
   target:UIBitmap;
   constructor(){
      super(1010);
   }
}
class ListItem_1010 extends UIListItemData {
   target:string;
}

/**
 * 1011-角色_Item [BASE]
 */
class GUI_1011 extends GUI_BASE {
   头像底衬:UIBitmap;
   face:UIBitmap;
   ai:UIBitmap;
   deadSign:UIBitmap;
   constructor(){
      super(1011);
   }
}
class ListItem_1011 extends UIListItemData {
   头像底衬:string;
   face:string;
   ai:string;
   deadSign:string;
}

/**
 * 1012-角色装备_Item [BASE]
 */
class GUI_1012 extends GUI_BASE {
   装备图标框:UIBitmap;
   装备图标背景:UIBitmap;
   partName:UIString;
   icon:UIBitmap;
   constructor(){
      super(1012);
   }
}
class ListItem_1012 extends UIListItemData {
   装备图标框:string;
   装备图标背景:string;
   partName:string;
   icon:string;
}

/**
 * 1013-角色技能_item [BASE]
 */
class GUI_1013 extends GUI_BASE {
   技能图标背景:UIBitmap;
   技能图标容器:UIRoot;
   icon:UIBitmap;
   技能框:UIBitmap;
   skillName:UIString;
   constructor(){
      super(1013);
   }
}
class ListItem_1013 extends UIListItemData {
   技能图标背景:string;
   icon:string;
   技能框:string;
   skillName:string;
}

/**
 * 1014-角色待装备_Item [BASE]
 */
class GUI_1014 extends GUI_BASE {
   unequipBtn:UIBitmap;
   卸下装备背景:UIBitmap;
   卸下装备文本:UIString;
   equipBox:UIBitmap;
   装备背景:UIBitmap;
   icon:UIBitmap;
   itemNum:UIString;
   itemName:UIString;
   装备框:UIBitmap;
   constructor(){
      super(1014);
   }
}
class ListItem_1014 extends UIListItemData {
   unequipBtn:string;
   卸下装备背景:string;
   卸下装备文本:string;
   equipBox:string;
   装备背景:string;
   icon:string;
   itemNum:string;
   itemName:string;
   装备框:string;
}

/**
 * 1015-目标角色选择_Item [BASE]
 */
class GUI_1015 extends GUI_BASE {
   actorInfoBox:UIBitmap;
   职业底衬:UIBitmap;
   魔法条底部:UIBitmap;
   spSlider:UISlider;
   魔法条框:UIBitmap;
   actorFace:UIBitmap;
   生命条底部:UIBitmap;
   hpSlider:UISlider;
   生命条框:UIBitmap;
   hpText:UIString;
   spText:UIString;
   actorName:UIString;
   actorLvLabel:UIString;
   actorLv:UIString;
   classText:UIString;
   deadSign:UIBitmap;
   classIcon:UIBitmap;
   constructor(){
      super(1015);
   }
}
class ListItem_1015 extends UIListItemData {
   actorInfoBox:string;
   职业底衬:string;
   魔法条底部:string;
   spSlider:number;
   魔法条框:string;
   actorFace:string;
   生命条底部:string;
   hpSlider:number;
   生命条框:string;
   hpText:string;
   spText:string;
   actorName:string;
   actorLvLabel:string;
   actorLv:string;
   classText:string;
   deadSign:string;
   classIcon:string;
}

/**
 * 1016- [BASE]
 */
class GUI_1016 extends GUI_BASE {

   constructor(){
      super(1016);
   }
}
class ListItem_1016 extends UIListItemData {

}

/**
 * 1017- [BASE]
 */
class GUI_1017 extends GUI_BASE {

   constructor(){
      super(1017);
   }
}
class ListItem_1017 extends UIListItemData {

}

/**
 * 1018-设置_Item1 [BASE]
 */
class GUI_1018 extends GUI_BASE {
   项目背景:UIBitmap;
   keyName:UIString;
   key1:UIButton;
   key2:UIButton;
   key3:UIButton;
   key4:UIButton;
   constructor(){
      super(1018);
   }
}
class ListItem_1018 extends UIListItemData {
   项目背景:string;
   keyName:string;

}

/**
 * 1019-设置_Item2 [BASE]
 */
class GUI_1019 extends GUI_BASE {
   项目背景:UIBitmap;
   keyName:UIString;
   key1:UIButton;
   constructor(){
      super(1019);
   }
}
class ListItem_1019 extends UIListItemData {
   项目背景:string;
   keyName:string;

}

/**
 * 1020- [BASE]
 */
class GUI_1020 extends GUI_BASE {

   constructor(){
      super(1020);
   }
}
class ListItem_1020 extends UIListItemData {

}

/**
 * 1021- [BASE]
 */
class GUI_1021 extends GUI_BASE {

   constructor(){
      super(1021);
   }
}
class ListItem_1021 extends UIListItemData {

}

/**
 * 1022-===== 战斗相关 ==== [BASE]
 */
class GUI_1022 extends GUI_BASE {

   constructor(){
      super(1022);
   }
}
class ListItem_1022 extends UIListItemData {

}

/**
 * 1023- [BASE]
 */
class GUI_1023 extends GUI_BASE {

   constructor(){
      super(1023);
   }
}
class ListItem_1023 extends UIListItemData {

}

/**
 * 1024-战斗者绑定界面 [BASE]
 */
class GUI_1024 extends GUI_BASE {
   battlerName:UIString;
   constructor(){
      super(1024);
   }
}
class ListItem_1024 extends UIListItemData {
   battlerName:string;
}

/**
 * 1025-战斗人物头像 [BASE]
 */
class GUI_1025 extends GUI_BASE {
   actorInfoBox:UIBitmap;
   deadSign:UIBitmap;
   魔法条底部:UIBitmap;
   生命条底部:UIBitmap;
   hpSlider:UISlider;
   spSlider:UISlider;
   生命条框:UIBitmap;
   魔法条框:UIBitmap;
   HP文字:UIBitmap;
   hpText:UIString;
   spText:UIString;
   actorName:UIString;
   statusList:UIList; // Item=1026
   actorLv:UIString;
   actorFace:UIBitmap;
   MP文字:UIBitmap;
   autoBattleBtn:UIButton;
   constructor(){
      super(1025);
   }
}
class ListItem_1025 extends UIListItemData {
   actorInfoBox:string;
   deadSign:string;
   魔法条底部:string;
   生命条底部:string;
   hpSlider:number;
   spSlider:number;
   生命条框:string;
   魔法条框:string;
   HP文字:string;
   hpText:string;
   spText:string;
   actorName:string;
   statusList:UIListItemData[];
   actorLv:string;
   actorFace:string;
   MP文字:string;

}

/**
 * 1026-战斗人物头像状态_Item [BASE]
 */
class GUI_1026 extends GUI_BASE {
   状态背景:UIBitmap;
   icon:UIBitmap;
   layer:UIString;
   constructor(){
      super(1026);
   }
}
class ListItem_1026 extends UIListItemData {
   状态背景:string;
   icon:string;
   layer:string;
}

/**
 * 1027-战斗：说明栏 [BASE]
 */
class GUI_1027 extends GUI_BASE {
   说明栏背景:UIBitmap;
   descName:UIString;
   说明滚动条背景遮罩:UIBitmap;
   descTextBox:UIRoot;
   descText:UIString;
   说明滚动条框:UIBitmap;
   cdBox:UIRoot;
   cdTextLabel:UIString;
   cdSlider:UISlider;
   冷却条框:UIBitmap;
   cdText:UIString;
   constructor(){
      super(1027);
   }
}
class ListItem_1027 extends UIListItemData {
   说明栏背景:string;
   descName:string;
   说明滚动条背景遮罩:string;
   descText:string;
   说明滚动条框:string;
   cdTextLabel:string;
   cdSlider:number;
   冷却条框:string;
   cdText:string;
}

/**
 * 1028-战斗状态栏的状态_Item [BASE]
 */
class GUI_1028 extends GUI_BASE {
   状态底衬:UIBitmap;
   状态框:UIBitmap;
   icon:UIBitmap;
   tipsLabel:UIString;
   layer:UIString;
   constructor(){
      super(1028);
   }
}
class ListItem_1028 extends UIListItemData {
   状态底衬:string;
   状态框:string;
   icon:string;
   tipsLabel:string;
   layer:string;
}

/**
 * 1029-战斗掉落物品_Item [BASE]
 */
class GUI_1029 extends GUI_BASE {
   战利品底:UIBitmap;
   icon:UIBitmap;
   战利品框:UIBitmap;
   itemNum:UIString;
   itemNumLabel:UIString;
   constructor(){
      super(1029);
   }
}
class ListItem_1029 extends UIListItemData {
   战利品底:string;
   icon:string;
   战利品框:string;
   itemNum:string;
   itemNumLabel:string;
}

/**
 * 1030-升级习得技能_Item [BASE]
 */
class GUI_1030 extends GUI_BASE {
   icon:UIBitmap;
   技能框:UIBitmap;
   constructor(){
      super(1030);
   }
}
class ListItem_1030 extends UIListItemData {
   icon:string;
   技能框:string;
}

/**
 * 1031-战斗道具_Item [BASE]
 */
class GUI_1031 extends GUI_BASE {
   战斗道具背景:UIBitmap;
   容器:UIRoot;
   icon:UIBitmap;
   道具框:UIBitmap;
   itemNum:UIString;
   itemName:UIString;
   constructor(){
      super(1031);
   }
}
class ListItem_1031 extends UIListItemData {
   战斗道具背景:string;
   icon:string;
   道具框:string;
   itemNum:string;
   itemName:string;
}

/**
 * 1032-战斗奖励人物头像_Item [BASE]
 */
class GUI_1032 extends GUI_BASE {
   actorInfoBox:UIBitmap;
   deadSign:UIBitmap;
   actorFace:UIBitmap;
   expSlider:UISlider;
   经验条框:UIBitmap;
   actorExp:UIString;
   actorName:UIString;
   lvBox:UIRoot;
   actorLvLabel:UIString;
   actorLv:UIString;
   EXP文字:UIBitmap;
   classIcon:UIBitmap;
   constructor(){
      super(1032);
   }
}
class ListItem_1032 extends UIListItemData {
   actorInfoBox:string;
   deadSign:string;
   actorFace:string;
   expSlider:number;
   经验条框:string;
   actorExp:string;
   actorName:string;
   actorLvLabel:string;
   actorLv:string;
   EXP文字:string;
   classIcon:string;
}

/**
 * 1033-提示栏 [BASE]
 */
class GUI_1033 extends GUI_BASE {
   tipsRoot:UIBitmap;
   tipsLabel:UIString;
   constructor(){
      super(1033);
   }
}
class ListItem_1033 extends UIListItemData {
   tipsRoot:string;
   tipsLabel:string;
}

/**
 * 1034- [BASE]
 */
class GUI_1034 extends GUI_BASE {

   constructor(){
      super(1034);
   }
}
class ListItem_1034 extends UIListItemData {

}

/**
 * 1035- [BASE]
 */
class GUI_1035 extends GUI_BASE {

   constructor(){
      super(1035);
   }
}
class ListItem_1035 extends UIListItemData {

}

/**
 * 1036- [BASE]
 */
class GUI_1036 extends GUI_BASE {

   constructor(){
      super(1036);
   }
}
class ListItem_1036 extends UIListItemData {

}

/**
 * 1037- [BASE]
 */
class GUI_1037 extends GUI_BASE {

   constructor(){
      super(1037);
   }
}
class ListItem_1037 extends UIListItemData {

}

/**
 * 1038- [BASE]
 */
class GUI_1038 extends GUI_BASE {

   constructor(){
      super(1038);
   }
}
class ListItem_1038 extends UIListItemData {

}

/**
 * 1039- [BASE]
 */
class GUI_1039 extends GUI_BASE {

   constructor(){
      super(1039);
   }
}
class ListItem_1039 extends UIListItemData {

}

/**
 * 1040-===== 伤害显示 ==== [BASE]
 */
class GUI_1040 extends GUI_BASE {

   constructor(){
      super(1040);
   }
}
class ListItem_1040 extends UIListItemData {

}

/**
 * 1041-miss显示 [BASE]
 */
class GUI_1041 extends GUI_BASE {
   容器:UIRoot;
   target:UIRoot;
   targetLabel:UIString;
   constructor(){
      super(1041);
   }
}
class ListItem_1041 extends UIListItemData {
   targetLabel:string;
}

/**
 * 1042-物理伤害数字显示 [BASE]
 */
class GUI_1042 extends GUI_BASE {
   容器:UIRoot;
   target:UIRoot;
   damage:UIString;
   constructor(){
      super(1042);
   }
}
class ListItem_1042 extends UIListItemData {
   damage:string;
}

/**
 * 1043-魔法伤害数字显示 [BASE]
 */
class GUI_1043 extends GUI_BASE {
   容器:UIRoot;
   target:UIRoot;
   damage:UIString;
   constructor(){
      super(1043);
   }
}
class ListItem_1043 extends UIListItemData {
   damage:string;
}

/**
 * 1044-真实伤害数字显示 [BASE]
 */
class GUI_1044 extends GUI_BASE {
   容器:UIRoot;
   target:UIRoot;
   damage:UIString;
   constructor(){
      super(1044);
   }
}
class ListItem_1044 extends UIListItemData {
   damage:string;
}

/**
 * 1045-恢复生命值数字显示 [BASE]
 */
class GUI_1045 extends GUI_BASE {
   容器:UIRoot;
   target:UIRoot;
   damage:UIString;
   constructor(){
      super(1045);
   }
}
class ListItem_1045 extends UIListItemData {
   damage:string;
}

/**
 * 1046-恢复魔法值数值显示 [BASE]
 */
class GUI_1046 extends GUI_BASE {
   容器:UIRoot;
   target:UIRoot;
   damage:UIString;
   constructor(){
      super(1046);
   }
}
class ListItem_1046 extends UIListItemData {
   damage:string;
}

/**
 * 1047- [BASE]
 */
class GUI_1047 extends GUI_BASE {

   constructor(){
      super(1047);
   }
}
class ListItem_1047 extends UIListItemData {

}

/**
 * 1048- [BASE]
 */
class GUI_1048 extends GUI_BASE {

   constructor(){
      super(1048);
   }
}
class ListItem_1048 extends UIListItemData {

}

/**
 * 1049- [BASE]
 */
class GUI_1049 extends GUI_BASE {

   constructor(){
      super(1049);
   }
}
class ListItem_1049 extends UIListItemData {

}

/**
 * 1050- [BASE]
 */
class GUI_1050 extends GUI_BASE {

   constructor(){
      super(1050);
   }
}
class ListItem_1050 extends UIListItemData {

}

/**
 * 2001-启动载入界面 [BASE]
 */
class GUI_2001 extends GUI_BASE {
   加载背景:UIBitmap;
   黑色遮罩:UIBitmap;
   加载LOGO:UIBitmap;
   loadingComp:UISlider;
   constructor(){
      super(2001);
   }
}
class ListItem_2001 extends UIListItemData {
   加载背景:string;
   黑色遮罩:string;
   加载LOGO:string;
   loadingComp:number;
}

/**
 * 2002-新游戏载入界面 [BASE]
 */
class GUI_2002 extends GUI_BASE {
   图片:UIBitmap;
   constructor(){
      super(2002);
   }
}
class ListItem_2002 extends UIListItemData {
   图片:string;
}

/**
 * 2003-读档载入界面 [BASE]
 */
class GUI_2003 extends GUI_BASE {
   图片:UIBitmap;
   constructor(){
      super(2003);
   }
}
class ListItem_2003 extends UIListItemData {
   图片:string;
}

/**
 * 2004-场景载入界面 [BASE]
 */
class GUI_2004 extends GUI_BASE {
   图片:UIBitmap;
   constructor(){
      super(2004);
   }
}
class ListItem_2004 extends UIListItemData {
   图片:string;
}

/**
 * 2005- [BASE]
 */
class GUI_2005 extends GUI_BASE {

   constructor(){
      super(2005);
   }
}
class ListItem_2005 extends UIListItemData {

}

/**
 * 3001-我的自定义界面 [BASE]
 */
class GUI_3001 extends GUI_BASE {
   图片:UIBitmap;
   文本:UIString;
   游戏数值:UIString;
   按钮:UIButton;
   constructor(){
      super(3001);
   }
}
class ListItem_3001 extends UIListItemData {
   图片:string;
   文本:string;

}

/**
 * 3002- [BASE]
 */
class GUI_3002 extends GUI_BASE {

   constructor(){
      super(3002);
   }
}
class ListItem_3002 extends UIListItemData {

}

/**
 * 15001- [BASE]
 */
class GUI_15001 extends GUI_BASE {

   constructor(){
      super(15001);
   }
}
class ListItem_15001 extends UIListItemData {

}
GameUI["__compCustomAttributes"] = {"UIRoot":["enabledLimitView","scrollShowType","hScrollBar","hScrollBg","vScrollBar","vScrollBg","scrollWidth","slowmotionType","enabledWheel","hScrollValue","vScrollValue"],"UIButton":["label","image1","grid9img1","image2","grid9img2","image3","grid9img3","fontSize","color","overColor","clickColor","bold","italic","smooth","align","valign","letterSpacing","font","textDx","textDy","textStroke","textStrokeColor"],"UIBitmap":["image","grid9","flip","isTile","pivotType"],"UIString":["text","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor","onChangeFragEvent"],"UIVariable":["varID","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor","onChangeFragEvent"],"UICustomGameNumber":["customData","previewNum","previewFixed","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor"],"UICustomGameString":["customData","inEditorText","fontSize","color","bold","italic","smooth","align","valign","leading","letterSpacing","font","wordWrap","overflow","shadowEnabled","shadowColor","shadowDx","shadowDy","stroke","strokeColor"],"UIAvatar":["avatarID","scaleNumberX","scaleNumberY","orientationIndex","avatarFPS","playOnce","isPlay","avatarFrame","actionID","avatarHue"],"UIStandAvatar":["avatarID","actionID","scaleNumberX","scaleNumberY","flip","playOnce","isPlay","avatarFrame","avatarFPS","avatarHue"],"UIAnimation":["animationID","scaleNumberX","scaleNumberY","aniFrame","playFps","playType","showHitEffect","silentMode"],"UIInput":["text","fontSize","color","prompt","promptColor","bold","italic","smooth","align","leading","font","wordWrap","restrict","inputMode","maxChars","shadowEnabled","shadowColor","shadowDx","shadowDy","onInputFragEvent","onEnterFragEvent"],"UICheckBox":["selected","image1","grid9img1","image2","grid9img2","onChangeFragEvent"],"UISwitch":["selected","image1","grid9img1","image2","grid9img2","previewselected","onChangeFragEvent"],"UITabBox":["selectedIndex","itemImage1","grid9img1","itemImage2","grid9img2","itemWidth","itemHeight","items","rowMode","spacing","labelSize","labelColor","labelFont","labelBold","labelItalic","smooth","labelAlign","labelValign","labelLetterSpacing","labelSelectedColor","labelDx","labelDy","labelStroke","labelStrokeColor","onChangeFragEvent"],"UISlider":["image1","bgGrid9","image2","blockGrid9","image3","blockFillGrid9","step","min","max","value","transverseMode","blockFillMode","blockPosMode","fillStrething","isBindingVarID","bindingVarID","onChangeFragEvent"],"UIGUI":["guiID","instanceClassName"],"UIList":["itemModelGUI","previewSize","selectEnable","repeatX","itemWidth","itemHeight","spaceX","spaceY","scrollShowType","hScrollBar","hScrollBg","vScrollBar","vScrollBg","scrollWidth","selectImageURL","selectImageGrid9","selectedImageAlpha","selectedImageOnTop","overImageURL","overImageGrid9","overImageAlpha","overImageOnTop","overSelectMode","slowmotionType"],"UIComboBox":["itemLabels","selectedIndex","bgSkin","bgGrid9","fontSize","color","bold","italic","smooth","align","valign","letterSpacing","font","textDx","textStroke","textStrokeColor","displayItemSize","listScrollBg","listScrollBar","listAlpha","listBgColor","itemHeight","itemFontSize","itemColor","itemBold","itemItalic","itemAlign","itemValign","itemLetterSpacing","itemFont","itemOverColor","itemOverBgColor","itemTextDx","itemTextDy","itemTextStroke","itemTextStrokeColor","onChangeFragEvent"],"UIVideo":["videoURL","playType","volume","playbackRate","currentTime","muted","loop","pivotType","flip","onLoadedFragEvent","onErrorFragEvent","onCompleteFragEvent"]};
