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
        this.getFilter = function (path) {
            return _filters[path] ? _filters[path] : "";
        };
        this.remove = function(path){
            delete _filters[path];
            if(options.onSetFilter) options.onSetFilter.call(options.w_obj);
        }
        this.getAll = function () {
            return _filters;
        };
        this.setFilter = function (filter,silent) {
            var path = filter.path || '',
                value = filter.value || '',
                valueName = filter.valueName || '',
                name = filter.name || "";
            if (!_filters[path]) _filters[path] = new Filter(filter);
                _filters[path].value = value;
                _filters[path].valueName = valueName;
                _filters[path].name = name;
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