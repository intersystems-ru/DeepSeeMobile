define([],function(){
    return function Filter(opts){
        this.path=opts.path || '';
        this.value=opts.value || '',
        this.valueList = opts.valueList || null;
    }
});