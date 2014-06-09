//FiltersView Class Declaration

define([],function(){
    return function FiltersView(){
        this.holder = "#filters .content";
        this.render = function(){
            require(['text!../FiltersView.html'],function(html){
                var holder="#filters .content";
                var list = $(html);
                list.find("> *").remove();
                
                console.log(list,listItem);
                $(holder).append(list);
                var filtersNum = a.widgets[a.activeWidget].filters.getAll().length;
                for(var i=0;i<filtersNum;i++){
                    var listItem = $(html).find(".filter-list-item");
                    listItem.text(listItem.text().replace(/{{filterName}}/,i));
                    $(holder).find(".filter-list").append(listItem);
                }
            });
            
        }
    
    }
});