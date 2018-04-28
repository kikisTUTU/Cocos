
var TSFormule = require("TSFormule");
var TSOperation = require("TSOperation");

var tsFormuleGenerator = {

    singlePlus: function(min, max, resultMax, allowSame) {
        var num1, num2, result = 0;
        do {
            num1 = Math.round((Math.random() * (max - min)) + min);

            if (allowSame) {
                num2 = Math.round((Math.random() * (max - min)) + min);
            } else {
                do {
                    num2 = Math.round((Math.random() * (max - min)) + min);
                }
                while (num2 === num1);
            }
            result = num1 + num2;
        } while (result > resultMax);


        var tsFormule = new TSFormule();
        tsFormule.num1 = num1;
        tsFormule.num2 = num2;
        tsFormule.result = result;
        tsFormule.setWrongAnswer(0, resultMax, result);
        tsFormule.operation = TSOperation.加法;
        
        return tsFormule;
    },

    plusWithRange: function(min1, max1, min2, max2, min3, max3, resultMin, resultMax, allowSame) {
        var num1, num2, num3, result, opsTime = 0;

        var min = min1 + min2 + min3;
        var max = max1 + max2 + max3;

        if ((min > resultMax) || (max < resultMin)){
            var errorFormule = new TSFormule();
            errorFormule.isPossible = false;
            return errorFormule;
        } else if (min === resultMax) {
            var tsFormule = new TSFormule();
            tsFormule.num1 = min1;
            tsFormule.num2 = min2;
            tsFormule.num3 = min3;
            tsFormule.result = resultMax;
            tsFormule.setWrongAnswer(resultMin, resultMax, result);
            tsFormule.operation = TSOperation.加法;
            return tsFormule;
        } else if (max === resultMin) {
            cc.log("max === resultMin");
            var tsFormule = new TSFormule();
            tsFormule.num1 = 9;
            tsFormule.num2 = 9;
            tsFormule.num3 = 0;
            tsFormule.result = 18;
            tsFormule.wrongAuswer = 19;
            tsFormule.operation = TSOperation.加法;
            return tsFormule;
        }

        do {
            num1 = Math.round((Math.random() * (max1 - min1)) + min1);

            do {
                num2 = Math.round((Math.random() * (max2 - min2)) + min2);
                
                if (min3 !== 0 && max3 !== 0) {
                    num3 = Math.round((Math.random() * (max3 - min3)) + min3);
                } else {
                    num3 = 0;
                }
                
            } while (((num2 === num1) || (num3 === num1) || (num2 === num3)) && !allowSame);
            
            result = num1 + num2 + num3;

            opsTime++;
            if (opsTime > 5000) {
                cc.warn("数值范围设置不合逻辑，请检查");
                break;
            }
            
        } while (result > resultMax || result < resultMin);

        var tsFormule = new TSFormule();
        tsFormule.num1 = num1;
        tsFormule.num2 = num2;
        tsFormule.num3 = num3;
        tsFormule.result = result;
        tsFormule.setWrongAnswer(resultMin, resultMax, result);
        tsFormule.operation = TSOperation.加法;

        return tsFormule;
    },

    complexPlus: function(opsCount, min, max, resultMax, allowSame) {
        var opsNum = [];
        var result = 0;
        var opsTime = 0;
        do {
            opsNum = [];
            result = 0;
            for (i = 0; i < opsCount; ++i) {
                var rand = Math.random();
                var num1 = Math.round((rand * (max - min)) + min);
                if (!allowSame) {
                    do {
                        rand = Math.random();
                        num1 = Math.round((rand * (max - min)) + min);
                    }
                    while (opsNum.indexOf(num1) > -1);
                } 
                opsNum.push(num1);

                result = result + num1;
            }
            opsTime++;
            if (opsTime > 20) {
                cc.warn("数字设置不符合逻辑，请检查");
                break;
            }
        } while (result > resultMax);

        
        var tsFormule = new TSFormule();
        tsFormule.opsNum = opsNum;
        tsFormule.result = result;
        tsFormule.setWrongAnswer(resultMin, resultMax, result);
        tsFormule.operation = TSOperation.加法;

        return tsFormule;
    },

    singleMinus: function(min, max, allowSame, allowNegative) {
        var num1, num2, result = 0;
        num1 = Math.round((Math.random() * (max - min)) + min);

        if (allowSame) {
            num2 = Math.round((Math.random() * (max - min)) + min);
        } else {
            do {
                num2 = Math.round((Math.random() * (max - min)) + min);
            }
            while (num2 === num1);
        }

        if (!allowNegative) {
            var maxNum = num1 > num2 ? num1 : num2;
            var minNum = num1 < num2 ? num1 : num2;

            num1 = maxNum;
            num2 = minNum
        }
        
        result = num1 - num2;
        
        var tsFormule = new TSFormule();
        tsFormule.num1 = num1;
        tsFormule.num2 = num2;
        tsFormule.result = result;
        tsFormule.setWrongAnswer(0, max, result);
        tsFormule.operation = TSOperation.减法;

        return tsFormule;
    },

    minusWithRange: function(min1, max1, min2, max2, min3, max3, resultMin, resultMax, allowSame) {
        var num1, num2, num3, result, opsTime = 0;
        
        do {
            num1 = Math.round((Math.random() * (max1 - min1)) + min1);

            do {
                num2 = Math.round((Math.random() * (max2 - min2)) + min2);
                
                if (min3 !== 0 && max3 !== 0) {
                    num3 = Math.round((Math.random() * (max3 - min3)) + min3);
                } else {
                    num3 = 0;
                }
                
            } while (((num2 === num1) || (num3 === num1) || (num2 === num3)) && !allowSame);
            
            result = num1 - num2 - num3;

            opsTime++;
            if (opsTime > 5000) {
                cc.warn("输入数字不合逻辑，请检查");
                break;
            }
        } while (result > resultMax || result < resultMin);

        var tsFormule = new TSFormule();
        tsFormule.num1 = num1;
        tsFormule.num2 = num2;
        tsFormule.num3 = num3;
        tsFormule.result = result;
        tsFormule.setWrongAnswer(resultMin, resultMax, result);
        tsFormule.operation = TSOperation.减法;

        return tsFormule;
    },

    singleMutiple: function(min, max) {

    },

    singleDivision: function(min, max) {

    },

    opsWithRange(operation, min1, max1, min2, max2, min3, max3, resultMin, resultMax, allowSame, correctCount, correctSameCount, falseCount) {
        var formule;
        switch (operation) {
            case 0: 
            formule = this.plusWithRange(min1, max1, min2, max2, min3, max3, resultMin, resultMax, allowSame);
            break;
            case 1: 
            formule = this.minusWithRange(min1, max1, min2, max2, min3, max3, resultMin, resultMax, allowSame);
            break;
        }
        return formule;
    },

    

    formuleArr: function(operation, min1, max1, min2, max2, min3, max3, resultMin, resultMax, allowSame, correctCount, correctSameCount, falseCount) {
        if (correctSameCount > correctCount) {
            cc.warn("输入错误，正确相同数不可大于正确数");
            return;
        }
        
        var formules = [];

        var correctSameResult = null;
        if (correctSameCount > 0) {
            var resultFormule = this.opsWithRange(operation, min1, max1, min2, max2, min3, max3, resultMin, resultMax, allowSame, correctCount, correctSameCount, falseCount);
            
            if (resultFormule.isPossible === false) {
                cc.warn("公式设置不正确");
                return [];
            }
            
            correctSameResult = resultFormule.result;
            for (var j = 0; j < correctSameCount; j++) {
                var formule;
                do {
                    formule = this.opsWithRange(operation, min1, max1, min2, max2, min3, max3, correctSameResult, correctSameResult, allowSame, correctCount, correctSameCount, falseCount);
                    if (formule.isPossible === false) {
                        cc.warn("公式设置不正确");
                        return [];
                    }
                } while ((!allowSame) && formule.isIn(formules));
                formule.correct = true;
                formules.push(formule);
            }
        }

        var restCorrectCount = correctCount - correctSameCount;
        for (var q = 0; q < restCorrectCount; ++q) {
            var formule;
            do {
                do {
                    formule = this.opsWithRange(operation, min1, max1, min2, max2, min3, max3, resultMin, resultMax, allowSame, correctCount, correctSameCount, falseCount);
                    if (formule.isPossible === false) {
                        cc.warn("公式设置不正确");
                        return [];
                    }
                } while ((!allowSame) && (formule.isIn(formules) || formule.isResultIn(formules)));
            } while (formule.result === correctSameResult);
            formule.correct = true;
            formules.push(formule);
        }

        for (var y = 0; y < falseCount; ++y) {
            var formule;
            do {
                formule = this.opsWithRange(operation, min1, max1, min2, max2, min3, max3, resultMin, resultMax, allowSame, correctCount, correctSameCount, falseCount);
                if (formule.isPossible === false) {
                    cc.warn("公式设置不正确");
                    return [];
                }
            } while ((!allowSame) && (formule.isIn(formules) || formule.isResultIn(formules)));
            formule.correct = false;
            formules.push(formule);
        }

        return formules;
    },

    testAllOperations() {
        // cc.log("test single Plus"); 
        // for (i = 0; i < 10; ++i) {
        //     var formule = this.singlePlus(1, 9, 10, false);
        //     cc.log(formule.toString());
        // }

        // cc.log("test Plus with range"); 
        // for (var p = 0; p < 5; ++p) {
        //     var formule = this.plusWithRange(1, 9, 10, 20, 20, 30, 10, 35, false);
        //     cc.log(formule.toString());
        // }

        // cc.log("test complex Plus"); 
        // for (var q = 0; q < 5; ++q) {
        //     var formule = this.complexPlus(3, 1, 9, 15, false);
        //     cc.log(formule.toString());
        // }

        // cc.log("test single minus"); 
        // for (i = 0; i < 10; ++i) {
        //     var formule = this.singleMinus(1, 9, false, false);
        //     cc.log(formule.toString());
        // }

        // cc.log("test Minus with range");  
        // for (i = 0; i < 10; ++i) {
        //     var formule = this.minusWithRange(20, 30, 10, 20, 1, 10, 6, 7, false);
        //     cc.log(formule.toString());
        // }

        // cc.log("test plus array");
        // var plusArray = this.plusArr(1, 9, 10, 20, 20, 30, 10, 40, false, 5, 3, 2);
        // for (i = 0; i < plusArray.length; ++i) {
        //     var formule = plusArray[i];
        //     cc.log(formule.toString());
        // }

        // cc.log("test minus array");
        // var plusArray = this.minusArr(1, 10, false, false, 4);
        // for (i = 0; i < plusArray.length; ++i) {
        //     var formule = plusArray[i];
        //     cc.log(formule[0] + " - " + formule[1] + " = " + formule[2]);
        // }
    }
}

module.exports = tsFormuleGenerator;