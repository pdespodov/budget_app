var budgetController = (function(){
    
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
                val: val
            };
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

    var ctrlAddItem = function() {
        var input = uiCtrl.getInput();
    };

    return {
        init: function() {
            console.log("Application start.");
            setUpEventListeners();
        }
    }
})(budgetController, uiController);

controller.init();