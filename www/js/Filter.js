define([],function(){
    return function Filter(opts, cube, widget){
        if(!(opts.name) || !(opts.path)) {
            //throw new Error("Incorrect filter!");
            return;
        }
        this.name = opts.name;
        this.path = opts.path;
        this.info = opts.info || "";
        this.cube = cube;
        this.widget = widget;
    }
});