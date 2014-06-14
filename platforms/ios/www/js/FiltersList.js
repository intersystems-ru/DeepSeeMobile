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
            if(options.onSetFilter) options.onSetFilter();
        }
        this.getAll = function () {
            return _filters;
        };
        this.setFilter = function (filter,silent) {
            var name = filter.name || '',
                value = filter.value || '';
            if (!_filters[name]) _filters[name] = new Filter(filter);
                _filters[name].value = value;
            if (options.onSetFilter && !silent) options.onSetFilter();
        };
        //Setting up filters from options
        if (options.filters) {
            for (var f = 0; f < options.filters.length; f++) {
                this.setFilter(options.filters[f], true);
            }
        }

    }
})