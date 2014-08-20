(function(){
    var obj = {
        /**
        Parses MDX. @param String mdx
        @return Object
        */
        parse:function(mdx){
            var RE = {
                selectWhat : '^SELECT (.+) ON',
                whichRows: '\{((.+),?)+\}'
            };
            
            var re1 = new RegExp(RE.selectWhat);
                var full = mdx.match(re1)[1];
            
            var re2 = new RegExp(RE.whichRows);
                var rows = full.match(re2);
            
            console.log("full:\n",full);
            console.log('rows:\n',rows);
            
                
        
        
        }
    };
    var test = '\
SELECT \
NON EMPTY {[ProfileMODep].[H1].[Profile].Members, [ProfileMODep].[H1].[Profile].[&Терапевт]} \
ON 1 \
FROM [QueueCube] \
%FILTER [MU].[H1].[MU].&[КГБУЗ "Абанская РБ" / Поликлиника Абанской РБ] \
%FILTER [MU].[H1].[MU].&[SomeElse]'
    return obj.parse(test);

})();