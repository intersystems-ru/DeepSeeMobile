//
//********************
// Filter List Class Definition
//
define(['Filter'], function (Filter) {
    return function FiltersList(options) {
        var _filters = {};
        var self = this;
        var curId = 0;
        var container = options.container || {};
        this.hasFilters = function () {
            return (_filters && (Object.keys(_filters).length != 0));
        };
        this.getFilter = function (name) {
            return _filters[name] ? _filters[name] : "";
        };
        this.getAll = function () {
            return _filters;
        };
        this.addFilterInfo = function (d) {
            _filters[d.name].valueList = d.data;
            this.render();

        };
        this.setFilter = function (filter, dontRender) {
            console.log(filter);
            var name = filter.name || '',
                value = filter.value || '';
            if (!_filters[name]) _filters[name] = new Filter(filter);
            console.log(_filters[name]);
            if (value == "") {
                curId--;
                delete _filters[name];
            } else {
                _filters[name].value = value;

            }
            if (!_filters[name] || !_filters[name].valueList) {
                console.log("Нету _filters[name].valueList");
                mc.subscribe("filter_list_acquired" + _filters[name].path, {
                    subscriber: this,
                    callback: this.addFilterInfo
                });
                mc.publish("filter_list_requested", [_filters[name].path, name]);
            }

            if (options.onSetFilter && !dontRender) options.onSetFilter();
        };
        if (options.filters) {
            for (var f = 0; f < options.filters.length; f++) {
                this.setFilter(options.filters[f], true);
            }
        }
        this.render = function () {
            require(["text!../filter.html"], function (html) {
                //Assume we have some filters
                for (var f in _filters) {
                    _html = html.replace(/\{\{name\}\}/g, f).replace("{{id}}", "filter1");
                    $(container).find("select").remove();
                    $(container).prepend(_html);
                    for (var f in _filters)
                        if (_filters[f].valueList)
                        {
                            $(container).find("select > *").remove();
                            for (var v = 0; v < _filters[f].valueList.length; v++) {
                                var selected = _filters[f].value == _filters[f].valueList[v].value ?" selected":"";
                                var html = "<option"+ selected+" value='" + _filters[f].valueList[v].value + "'>" + _filters[f].valueList[v].name + "</option>";
                                console.log("HTML:", html);
                                console.log($(container).find("select"));
                                $(container).find("select").append(html)
                                    .change(function () {
                                        console.log(1);
                                        self.setFilter({
                                            name: 'Тестовый фильтр',
                                            value: this.value,
                                        });
                                    });
                            }
                            
                        }

                }
            });
        };

    }
})