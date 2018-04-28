var TSOperation = require("TSOperation");

var tsFormule = cc.Class({
    properties: {
        num1: 0,
        num2: 0,
        num3: null,
        opsNum: [],
        result: 0,
        wrongAnswer: 0,
        usedTime: 0,
        operation: {
            default: TSOperation.加法,
            type: TSOperation,
            notify : function() {
                this.setOperation();
            }
        },
        operationStr: {
            default: "+",
            visible: false,
        },

        correct: true,

        isPossible: true,
    },

    toString(withResult = true) {
        // if (this.isPossible === false) {
        //     return "error";
        // }
        var str = "";
        if (this.opsNum > 0) {
            for (var j = 0; j < this.opsNum.length; ++j) {
                str += " " + this.opsNum[j].toString() + " ";
                if (j !== this.opsNum.length - 1) {
                    str += this.operationStr;
                } 
            }
        } else {
            str = this.num1 + " " + this.operationStr + " ";
            str += this.num2;
            str += (this.num3 === 0 ? "" : (" " + this.operationStr + " " + this.num3));
        }

        if (withResult) {
            str += " = " + (this.correct ? this.result : this.wrongAnswer);
        }

        return str;
    },

    descStr() { // for coder only
        var str = this.toString(true);
        str += ", result: " + this.result;
        str += ", wrongResult: " + this.wrongAnswer;
        str += ", correct: " + this.correct;
        return str;
    },

    setWrongAnswer(min, max, result) {
        if (min === max) {
            this.wrongAnswer = Math.random() > 0.5 ? (result + 1) : (result - 1);
        } else {
            var wrong = 0;
            do {
                wrong = Math.round((Math.random() * (max - min)) + min);
            } while (wrong === result);
            this.wrongAnswer = wrong;
        }
    },

    isEqual(formule) {
        if (this.num3 === null) {
            if ((this.num1 === formule.num1) && (this.num2 === formule.num2)) {
                return true;
            }
        } else {
            if ((this.num1 === formule.num1) && (this.num2 === formule.num2) && (this.num3 === formule.num3)) {
                return true;
            }
        }

        return false;
    },

    isSameResult(formule) {
        return this.result === formule.result;
    },

    isIn(formules) {
        for (i = 0; i < formules.length; ++i) {
            if (this.isEqual(formules[i])) {
                return true;
            }
        }
        return false;
    },

    isResultIn(formules) {
        for (i = 0; i < formules.length; ++i) {
            if (this.isSameResult(formules[i])) {
                return true;
            }
        }
        return false;
    },

    setOperation() {
        switch(this.operation) {
            case 0:
                this.operationStr = "+";
                break;
            case 1:
                this.operationStr = "-";
                break;
            case 2:
                this.operationStr = "x";
                break;
            case 3:
                this.operationStr = "/";
                break;
        }
    },

});

module.exports = tsFormule;

