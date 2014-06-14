define([],function(){
    return {
        getClassName: function(obj){
            //Function returns constructor name = Class Name
            if((!obj)||!(obj.constructor)) return "";
             return obj.constructor.name || "";
        },
        trim:function(str, num){
            var DEFAULT = 17;
            //Function trims big string and adds "..."
            if(!(str&&(typeof(str)=="string"))) { throw new Error("Utils.trim: Only strings accepted"); return ""}
            if(str.length<= +(num || DEFAULT)) return str;
            return str.substring(0, +(num || DEFAULT))+"...";
        }
    }
});