/*
    使用说明：
        1. 在场景下新建一个空节点（可在Canvas外）位置可任意
        2. 将此脚本挂载到节点上
        3. 设置各值范围
        4. 运算形式为 A + B + C = D 且 =/= E
        5. 至程序员:
            5.1 以上为一个TSFormule的数据结构
            5.2 A B C D E 分别对应 num1 num2 num3 result wrongAnswer
            5.3 可通过 TSFormule.toString(withResult: bool) 实例方法获取封装好的字符串
*/

var TSFormule = require("TSFormule");
var TSFormuleGenerator = require("TSFormuleGenerator");
var TSOperation = require("TSOperation");


cc.Class({
    extends: cc.Component,

    properties: {
        tsOperation: {
            default: TSOperation.加法,        
            type: cc.Enum(TSOperation), 
            displayName: "运算类型",
            tooltip: "test"
        },

        a_range: {
            default: cc.Vec2.ZERO,
            displayName: "A_范围",
        },

        b_range: {
            default: cc.Vec2.ZERO,
            displayName: "B_范围",
        },

        c_range: {
            default: cc.Vec2.ZERO,
            displayName: "C_范围",
        },

        d_range: {
            default: cc.Vec2.ZERO,
            displayName: "结果_范围",
        },

        correctCount: {
            default: 0,
            type: cc.Integer,
            displayName: "正确公式数",
        },

        correctSameCount: {
            default: 0,
            type: cc.Integer,
            displayName: "相同结果正确公式数",
        },

        falseCount: {
            default: 0,
            type: cc.Integer,
            displayName: "错误公式数",
        },

        allowSame: {
            default: false,
            displayName: "是否允许ABC可能相同",
            tooltip: "是否允许ABC可能相同, 公式A + B + C"
        },

        formules: {
            default: [],
            type: [TSFormule],
            visible: false
        }
    },

    createFormule() {
        var arr;
        switch (this.tsOperation) {
            case TSOperation.加法:
            arr = TSFormuleGenerator.formuleArr(0, this.a_range.x, this.a_range.y, this.b_range.x, this.b_range.y, this.c_range.x, this.c_range.y, this.d_range.x, this.d_range.y, this.allowSame, this.correctCount, this.correctSameCount, this.falseCount);
            break;

            case TSOperation.减法:
            arr = TSFormuleGenerator.formuleArr(1, this.a_range.x, this.a_range.y, this.b_range.x, this.b_range.y, this.c_range.x, this.c_range.y, this.d_range.x, this.d_range.y, this.allowSame, this.correctCount, this.correctSameCount, this.falseCount);
            break;
        }
        return arr;
    },

    lessUsedFormule() {
        var i = 0;
        if (this.formules.length === 0) {
            return null
        }
        var formule = this.formules[0];
        while (i < this.formules.length) {
            if (this.formules[i].usedTime === 0) {
                this.formules[i].usedTime++;
                return this.formules[i];
            } 
            this.formule = this.formules[i].usedTime > formule.usedTime ? formule : this.formules[i];
            this.formule.usedTime++;
            i++;
        }
        return formule;
    },

    start() {
        // var plusF = TSFormuleGenerator.plusWithRange(5, 9, 5, 9, 0, 0, 1, 3, true); 
        // plusF.toString

    }

});
