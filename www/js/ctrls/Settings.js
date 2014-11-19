define([], function(){
    return function(){ 
        
        if (App.settings.server) $("#serverIP").val(App.settings.server);
        $("#serverIP").on('input', function(e){setTimeout(function(){App.settings.server = $("#serverIP").val();},0)});
        if (App.settings.username) $("#username").val(App.settings.username);
         $("#username").on('input', function(e){setTimeout(function(){App.settings.username = $("#username").val();},0)});
         $("#password").on('input', function(e){setTimeout(function(){App.settings.password = $("#password").val();},0)});
        if (App.settings.password) $("#password").val(App.settings.password);
        if (App.settings.cubeName) $("#cube").val(App.settings.cubeName);
         $("#cube").on('input', function(e){setTimeout(function(){App.settings.cubeName = $("#cube").val();},0)});
        if (App.settings.namespace) $("#namespace").val(App.settings.namespace);
         $("#namespace").on('input', function(e){setTimeout(function(){App.settings.namespace = $("#namespace").val();},0)});
         
    
    };
});