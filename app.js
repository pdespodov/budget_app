var budgetController = (function(){
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

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
        }
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
        }
    }
})();

var uiController = (function(){
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
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                selector = "expenses__list";
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            var newHtml = html.replace("%id%", obj.id).replace("%description%", obj.description).replace("%value%", obj.value);

            document.querySelector("." + selector).insertAdjacentHTML("beforeend", newHtml);
        },
        clearFields: function() {
            var fields = document.querySelectorAll(".add__description, .add__value");

            var fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(currentValue, index, array) {
                currentValue.value = "";
            });

            fieldsArray[0].focus();
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
    };

    var updateBudget = function() {

    };

    var ctrlAddItem = function() {
        var input = uiCtrl.getInput();

        if(!input.description || isNaN(input.val) || input.val <= 0)
            return;

        var newItem = budgetCtrl.addItem(input.type, input.description, input.val);

        uiCtrl.addListItem(newItem, input.type);

        uiCtrl.clearFields();

        updateBudget();
    };

    return {
        init: function() {
            console.log("Application start.");
            setUpEventListeners();
        }
    }
})(budgetController, uiController);

controller.init();