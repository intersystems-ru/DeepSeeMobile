define([], function () {

    return {
        en: {
            home: "Home",
            filters: "Filters",
            reload: "Reload",
            signout: "Sign out",
            title: "Title",
            address: "Address",
            namespace: "Namespace",
            save: "Save",
            signin: "Sign in",
            server: "Server",
            login: "Login",
            password: "Password",
            newServer: "New server",
            selServer: "Select server",
            editServer: "Edit server",
            edit: "Edit",
            delete: "Delete",
            done: "Done",
            dismissFilters: "Dismiss filters",
            accept: "Accept",
            folder: "Folder",
            error: "Error",
            errNoStatus: "No status in JSON response",
            errWrongStatus: "Wrong status received",
            errWrongJson: "Incorrect json received",
            errUnauthorized: "Incorrect username or password",
            errTimeout: "Request timeout error",
            errNotFound: "Requested page not found on server"
        },
        de: {
            home: "Zuhause",
            filters: "Filter",
            reload: "Nachladen",
            signout: "Austragen",
            title: "Titel",
            address: "Anschrift",
            namespace: "Namensraum",
            save: "Speichern",
            signin: "Anmelden",
            server: "Server",
            login: "Einloggen",
            password: "Passwort",
            newServer: "Neuer Server",
            selServer: "Wählen Sie Server",
            editServer: "Server bearbeiten",
            edit: "Bearbeiten",
            delete: "Löschen",
            done: "Gemacht",
            dismissFilters: "Filter entlassen",
            accept: "Akzeptieren",
            folder: "Mappe",
            error: "Fehler",
            errNoStatus: "Nein Status in JSON antwort",
            errWrongStatus: "Falscher status erhalten",
            errWrongJson: "Falsche json erhalten",
            errUnauthorized: "Benutzernamen oder Ihr Password",
            errTimeout: "Antrag Timeout-Fehler",
            errNotFound: "Angeforderte Seite konnte nicht auf dem Server gefunden"
        },
        sp: {
            home: "Casa",
            filters: "Filtros",
            reload: "Recargar",
            signout: "Desconectar",
            title: "Título",
            address: "Dirección",
            namespace: "Espacio de nombres",
            save: "Guardar",
            signin: "Registrarse",
            server: "Servidor",
            login: "Iniciar Sesión",
            password: "Contraseña",
            newServer: "Nuevo servidor",
            selServer: "Seleccionar servidor",
            editServer: "Editar servidor",
            edit: "Editar",
            delete: "Borrar",
            done: "Hecho",
            dismissFilters: "Descartar filtros",
            accept: "Aceptar",
            folder: "Carpeta",
            error: "Error",
            errNoStatus: "No situación en respuesta JSON",
            errWrongStatus: "Estado incorrecto recibido",
            errWrongJson: "Json incorrecta recibida",
            errUnauthorized: "Nombre de usuario o contraseña incorrecta",
            errTimeout: "Error de tiempo de espera de solicitud",
            errNotFound: "La página solicitada no se encuentra en el servidor"
        },
        ru: {
            home: "Домой",
            filters: "Фильтры",
            reload: "Обновить",
            signout: "Выход",
            title: "Название",
            address: "Адрес",
            namespace: "Область",
            save: "Сохранить",
            signin: "Вход",
            server: "Сервер",
            login: "Логин",
            password: "Пароль",
            newServer: "Новый сервер",
            selServer: "Выберите сервер",
            editServer: "Изменить сервер",
            edit: "Изменить",
            delete: "Удалить",
            done: "Готово",
            dismissFilters: "Сбросить фильтры",
            accept: "Принять",
            folder: "Папка",
            error: "Ошибка",
            errNoStatus: "В ответе сервера не указан status",
            errWrongStatus: "Получен неверный status",
            errWrongJson: "Получен неверный json",
            errUnauthorized: "Неверный логин или пароль",
            errTimeout: "Превышен интервал ожидания ответа сервера",
            errNotFound: "Запрошенная страница не найдена на сервере"
        },
        currentLocale: function() {
            var locale = localStorage.currentLocale;
            if (!locale) locale = "en";
            locale = locale.toLowerCase();
            return locale;
        },
        setLocale: function(loc) {
            localStorage.currentLocale = loc.toLowerCase();
            this.applyLanguage();
        },
        getText: function(txtName) {
            var locale = this.currentLocale();
            var txt = "";
            if (this[locale][txtName]) txt = this[locale][txtName];
            if (!txt) {
                if (this["en"][txtName]) txt = this["en"][txtName];
            }
            return txt;
        },
        applyLanguage: function() {
            $("#lang").text(this.currentLocale().toUpperCase());
            $("#btnLogin").text(this.getText("signin"));
            $("#txtLogin").attr("placeholder", this.getText("login"));
            $("#txtPassword").attr("placeholder", this.getText("password"));

            $("#mainHomeText").text(this.getText("home"));
            $("#mainFilterText").text(this.getText("filters"));
            $("#mainReloadText").text(this.getText("reload"));
            $("#mainSignoutText").text(this.getText("signout"));

            var serverTxt = $("#selServer").text();
            var i = serverTxt.indexOf(": ");
            if (i != -1) serverTxt = serverTxt.substring(i + 1, serverTxt.length);
            $("#selServer").text(this.getText("server") + ": " + serverTxt);
        }
    }


});
