var budgetController = (function(){
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;

        data.allItems[type].forEach(function(cur) {
            sum = sum + cur.value;
        });

        data.totals[type] = sum;
    }

    var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0;

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, desc, value){
            var newItem;
            var ID;

            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if(type === "exp") {
                newItem = new Expense(ID, desc, value);
            } else {
                newItem = new Income(ID, desc, value);
            }

            data.allItems[type].push(newItem);

            return newItem;
        },
        deleteItem: function(type, id) {
            var ids = data.allItems[type].map(function(current){
                return current.id;
            });

            var index = ids.indexOf(id);

            if(index > -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function(){
            calculateTotal("exp");
            calculateTotal("inc");

            data.budget = data.totals["inc"] - data.totals["exp"];

            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals["exp"] / data.totals["inc"]) * 100);
            } else {
                data.percentage = -1;
            }
        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        calculatePercentages: function(){
            data.allItems["exp"].forEach(function(cur){
                cur.calcPercentage(data.totals["inc"]);
            });
        },
        getPercentages: function(){
            return data.allItems["exp"].map(function(cur){
                return cur.getPercentage();
            });
        }
    }
})();

var uiController = (function(){
    var formatNumber = function(num, type) {
        num = Math.abs(num);

        num = num.toFixed(2);

        var numSplit = num.split(".");
        var int = numSplit[0];

        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
        }

        var dec = numSplit[1];

        var sign = "";

        type == "exp" ? sign = "-" : sign = "+";

        return sign + " " + int + "." + dec;
    };

    return {
        getInput: function(){
            var type = document.querySelector(".add__type").value;
            var description = document.querySelector(".add__description").value;
            var val = document.querySelector(".add__value").value;

            return {
                type: type,
                description: description,
                val: parseFloat(val)
            };
        },
        addListItem: function(obj, type) {
            var html;
            var selector;

            if(type === "inc") {
                selector = "income__list";
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                selector = "expenses__list";
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            var newHtml = html.replace("%id%", obj.id).replace("%description%", obj.description).replace("%value%", formatNumber(obj.value, type));

            document.querySelector("." + selector).insertAdjacentHTML("beforeend", newHtml);
        },
        deleteListItem: function(selectorId) {
            var element = document.getElementById(selectorId);

            element.parentNode.removeChild(element);
        },
        clearFields: function() {
            var fields = document.querySelectorAll(".add__description, .add__value");

            var fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(currentValue, index, array) {
                currentValue.value = "";
            });

            fieldsArray[0].focus();
        },
        displayBudget: function(obj){
            document.querySelector(".budget__value").innerHTML = formatNumber(obj.budget, obj.budget > 0 ? "inc" : "exp");
            document.querySelector(".budget__income--value").innerHTML = formatNumber(obj.totalInc, "inc");
            document.querySelector(".budget__expenses--value").innerHTML = formatNumber(obj.totalExp, "exp");

            if(obj.percentage > 0) {
                document.querySelector(".budget__expenses--percentage").innerHTML = obj.percentage + "%";
            } else {
                document.querySelector(".budget__expenses--percentage").innerHTML = "---";
            }
        },
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(".item__percentage");

            var nodeListForEach = function(list, callback){
                for(var i = 0; i < list.length; i ++){
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index){
                current.innerHTML = percentages[index] > 0 ? percentages[index] + "%"
                    : "---";
            });
        }
    }
})();

var controller = (function(budgetCtrl, uiCtrl){
    var setUpEventListeners = function(){
        document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function(event) {
            if(event.keyCode != 13 && event.which != 13)
                return;

                ctrlAddItem();
        });

        document.querySelector(".container").addEventListener("click", ctrlDeleteItem);
    };

    var updateBudget = function() {
        budgetCtrl.calculateBudget();

        var budget = budgetCtrl.getBudget();

        uiCtrl.displayBudget(budget);
    };

    var ctrlAddItem = function() {
        var input = uiCtrl.getInput();

        if(!input.description || isNaN(input.val) || input.val <= 0)
            return;

        var newItem = budgetCtrl.addItem(input.type, input.description, input.val);

        uiCtrl.addListItem(newItem, input.type);

        uiCtrl.clearFields();

        updateBudget();

        updatePercentages();
    };

    var ctrlDeleteItem = function(event) {
        var itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemId) {
            var splitId = itemId.split("-");

            var type = splitId[0];

            var id = parseInt(splitId[1]);

            budgetCtrl.deleteItem(type, id);

            uiCtrl.deleteListItem(itemId);

            updateBudget();

            updatePercentages();
        }
    };

    var updatePercentages = function(){
        budgetCtrl.calculatePercentages();

        var percentages = budgetCtrl.getPercentages();

        uiCtrl.displayPercentages(percentages);
    };

    return {
        init: function() {
            console.log("Application start.");
            uiCtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setUpEventListeners();
        }
    }
})(budgetController, uiController);

controller.init();