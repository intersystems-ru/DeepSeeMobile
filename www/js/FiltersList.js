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
            _filters[d.name].valueList.push({name:"Выкл",value:""});
            this.render();

        };
        this.setFilter = function (filter, dontRender) {
            var name = filter.name || '',
                value = filter.value || '';
            if (!_filters[name]) _filters[name] = new Filter(filter);
                _filters[name].value = value;
            if (!_filters[name] || !_filters[name].valueList) {
                mc.subscribe("filter_list_acquired" + _filters[name].path, {
                    subscriber: this,
                    callback: this.addFilterInfo
                });
                mc.publish("filter_list_requested", [_filters[name].path, name]);
            }

            if (options.onSetFilter && !dontRender) options.onSetFilter();
        };
        //Setting up filters from options
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
                        if (_filters[f].valueList) {
                            $(container).find("select optgroup > *").remove();
                            for (var v = 0; v < _filters[f].valueList.length; v++) {
                                var selected = _filters[f].value == _filters[f].valueList[v].value ? " selected" : "";
                                var html = "<option" + selected + " value='" + _filters[f].valueList[v].value + "'>" + _filters[f].valueList[v].name + "</option>";
                                $(container).find("select optgroup").append(html);

                            }
                            $(container).find("select").change(function () {
                                self.setFilter({
                                    name: f,
                                    value: this.value,
                                });
                            });

                        }

                }
            });
        };

    }
})