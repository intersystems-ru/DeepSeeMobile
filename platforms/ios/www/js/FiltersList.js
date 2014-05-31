define([], function () {
    return function FiltersList(options) {
        var _filters = options.filters || {};
        var self=this;
        this.hasFilters = function () {
            return (_filters && (Object.keys(_filters).length != 0));
        }
        this.getFilter = function (name) {
            return _filters[name] ? _filters[name] : "";
        };
        this.getAll = function(){return _filters;}
        this.setFilter = function (name, value) {
            name = name || '';
            if (value == "") {
                delete _filters[name];
            } else {
                _filters[name] = value;
            }
            if(options.onSetFilter) options.onSetFilter();
        };
        this.render = function(container){
             require(["text!../filter.html"], function(html){
                    //Assume we have some filters
                    for(var f in _filters){
                        _html = html.replace(/\{\{name\}\}/g, f).replace("{{id}}","filter1")
                        $(container).prepend(_html)
                        .find("[name='"+f+"']")
                        .change(function(){
                            self.setFilter('Тестовый фильтр',this.value);
                        });
                        
                    }
                    });
        }
    }
})