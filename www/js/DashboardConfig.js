//Dashboard config class definition

define([], function(){
    return function(){
        this.name = "";
        this.locked = false;
        this.holder = "#mainScreen > .content"; //here our dashboard will be stored
    }
});