//
//********************
// Filter List Class Definition
//
define(['Filter'], function (Filter) {
    return function FiltersList(options) {
       
        var _filters = {};
        var self = this;
        this.hasFilters = function () {
            return (_filters && (Object.keys(_filters).length != 0));
        };
        this.getFilter = function (name) {
            return _filters[name] ? _filters[name] : "";
        };
        this.remove = function(name){
            delete _filters[name];
            if(options.onSetFilter) options.onSetFilter.call(options.w_obj);
        }
        this.getAll = function () {
            return _filters;
        };
        this.setFilter = function (filter,silent) {
            var name = filter.name || '',
                value = filter.value || '',
                valueName = filter.valueName || '';
            if (!_filters[name]) _filters[name] = new Filter(filter);
                _filters[name].value = value;
                _filters[name].valueName = valueName;
            if (options.onSetFilter && !silent) options.onSetFilter.call(options.w_obj);
        };
        //Setting up filters from options
        if (options.filters) {
            for (var f = 0; f < options.filters.length; f++) {
                this.setFilter(options.filters[f], true);
            }
        }

    }
})