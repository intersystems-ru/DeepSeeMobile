/**
 * @fileOverview
 * Loading Spinner module.<br>
 * Shows when data is loading and hides when loaded.<br>
 * @author Shmidt Ivan
 * @version 0.0.1
 * @module LoadingSpinner
 * @requires MessageCenter
 */
define(['MessageCenter'], function (mc) {
    function LoadingSpinner() {
        if (LoadingSpinner.prototype._instance) return LoadingSpinner.prototype._instance;
        LoadingSpinner.prototype._instance = this;
        this.dataCount = 0;

        this.show = function () {
            //console.log("Loading spinner.show");
            if (!this.dataCount && ($(".spinner-wrapper")[0] === undefined)) {
                require(['text!../views/Spinner.html'], function (html) {
                    $("body").append(html);
                });
            } else if ($(".spinner-wrapper")[0] != undefined) {
                //$(".spinner-wrapper").show();
                $(".spinner-wrapper").stop().css("opacity", 1);
                $(".spinner-wrapper").css("z-index", 2000);
            }
            this.dataCount++;
            //console.log('Data count.show:', this.dataCount);

        };
        this.hide = function () {
            //console.log("Loading spinner.hide");
            if (this.dataCount <= 0) return;

            this.dataCount--;
            //console.log('Data count.hide:', this.dataCount);
            if (this.dataCount == 0) {
                //console.log("щас спрячу");
                $(".spinner-wrapper").stop().animate({
                    opacity: 0,
                }, 300, function () {
                    $(".spinner-wrapper").css("z-index", -2000);
                });
            }

        };
//        mc.subscribe('data_requested', {
//            subscriber: this,
//            callback: this.show
//        });
//        mc.subscribe('filters_values_requested', {
//            subscriber: this,
//            callback: this.show
//        });
//        mc.subscribe('data_acquired', {
//            subscriber: this,
//            callback: this.hide
//        });
//        mc.subscribe('filters_values_acquired', {
//            subscriber: this,
//            callback: this.hide
//        });

    };
    LoadingSpinner.prototype.toString = function () {
        return "LoadingSpinner";
    }
    return new LoadingSpinner();
});