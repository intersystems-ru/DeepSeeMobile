define(['MessageCenter'], function (mc) {
    function LoadingSpinner() {
        if (LoadingSpinner.prototype._instance) return LoadingSpinner.prototype._instance;
        LoadingSpinner.prototype._instance = this;
        var dataCount = 0;

        this.show = function() {
            console.log("Loading spinner.show");
            if (!dataCount && ($(".spinner-wrapper")[0] === undefined)) {
                require(['text!../views/Spinner.html'], function (html) {
                    $("body").append(html);
                });
            }
            else if($(".spinner-wrapper")[0] != undefined){
                $(".spinner-wrapper").show();
                $(".spinner-wrapper").css("opacity",1);
            }
            dataCount++;
            console.log('Data count.show:',dataCount);
            
        };
        this.hide = function () {
            console.log("Loading spinner.hide");
            if (dataCount <= 0) return;

            dataCount--;
            console.log('Data count.hide:',dataCount);
            if (dataCount == 0) {
                console.log("щас спрячу");
                $(".spinner-wrapper").animate({opacity: 0}, 300, function () {
                    $(".spinner-wrapper").hide();
                });
            }
            
        };
        mc.subscribe('data_requested', {
            subscriber: this,
            callback: this.show
        });
        mc.subscribe('filters_values_requested', {
            subscriber: this,
            callback: this.show
        });
        mc.subscribe('data_acquired', {
            subscriber: this,
            callback: this.hide
        });
        mc.subscribe('filters_values_acquired', {
            subscriber: this,
            callback: this.hide
        });

    };
    LoadingSpinner.prototype.toString = function () {
        return "LoadingSpinner";
    }
    return new LoadingSpinner();
});