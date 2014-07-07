define(['MessageCenter'], function (mc) {
    function LoadingSpinner() {
        if (LoadingSpinner.prototype._instance) return LoadingSpinner.prototype._instance;
        LoadingSpinner.prototype._instance = this;
        var dataCount = 0;

        this.show = function show() {

            if (!dataCount) {
                require(['text!../Spinner.html'], function (html) {
                    $("body").append(html);
                });
            };
            dataCount++;
        };
        this.hide = function hide() {
            if (dataCount === 0) return;

            dataCount--;
            if (dataCount === 0) {
                $(".spinner-wrapper").animate({
                    opacity: 0
                }, 300, function () {
                    $(this).remove();
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
    return new LoadingSpinner();
});