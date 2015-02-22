/**
 * @fileOverview
 * FiltersView module<br>
 * Responsible for rendering filters page<br>
 * Singleton
 * @author Shmidt Ivan
 * @version 0.0.1
 * @module FiltersView
 * @requires Utils
 * @requires lib/iscroll
 * @requires MessageCenter
 * @requires lib/jquery.tap
 * @requires jQuery
 * @todo Delete high dependency with window.a = dashboard
 */
define([
    'Language',
    "MessageCenter"
], function (Lang, mc) {
    'use strict';
    /**
     * Creates or returns existing FiltersView object
     * @alias module:FiltersView
     * @constructor FiltersView
     * @listens module:MessageCenter#set_active_widget
     * @listens module:MessageCenter#filters_acquired
     */
    function FiltersView() {
        /** @lends module:FiltersView#*/
        if (FiltersView.prototype._instance) {
            return FiltersView.prototype._instance;
        }
        FiltersView.prototype._instance = this;
        var self = this;
        this.holder = "#filters .content";
        /**
        @var {Object} module:FiltersView#selectedFilter Filter, that you selects in filterView
        */
        this.selectedFilter = null;
        /**
        Simply returns module name
        *@function module:FiltersView#toString
        *@return {string} Module name
        */
        this.toString = function () {
            return "FiltersView";
        };


        this.getFilter = function(path) {
            for (var i = 0; i < App.filters.length; i++) if (App.filters[i].path == path) {
                if (App.filters[i].widget) if (App.filters[i].widget == App.a.widgets[App.a.activeWidget])
                    return App.filters[i];
            }
            return null;
        }
        /**
         * Does rendering of filters
         * @function module:FiltersView#render
         */
        this.render = function () {
            //var self = this;
            $("#filters header h1").text(Lang.getText("filters"));
            $("#btnDismissFilters").text(Lang.getText("dismissFilters"));
            $("#btnFilterAccept").text(Lang.getText("accept"));

            require(['text!../views/Filters.html'], function (html) {
                $("#fltBarFooter").hide();

                $("#filters").data("isValues", 0);
                $("#btnFilterAccept").hide();
                var holder = "#filters .content";
                $(holder).empty();
                //$("#filters .title").text("Filters");
                var list = $(html).clone();
                list.empty();
                $(holder).append(list);
                var infoItem = $(html).find(".filter-list-info-item").clone();
                $(holder).find(".filter-list-info").append(infoItem);
                var w = App.a.widgets[App.a.activeWidget];
                var filtersNum = w.controls.length;
                for (var i = 0; i < filtersNum; i++) if (w.controls[i].action == "applyFilter") {
                    var listItem = $(html).find(".filter-list-item").clone();
                    listItem.html(
                        listItem.html().replace(/{{filterName}}/, w.controls[i].label)
                    );
                    var flt = w.filters.getFilter(w.controls[i].targetProperty);
                    if (!flt) continue;
                    //if (!flt)
                    //var flt = w.getFilter(w.controls[i].targetProperty);
                    listItem.data("filter", flt);


                    var fv = flt.valueName || flt.value;
                    if (fv) {
                        listItem.html(listItem.html().replace(/{{filterValue}}/, fv));
                        listItem.find(".toggle").addClass("active");
                    } else {
                        listItem.html(listItem.html().replace(/{{filterValue}}/, ""));
                    }


                    if (listItem.find(".toggle").hasClass('active')) {
                        $(holder).find(".filter-list").prepend(listItem);
                    } else {
                        $(holder).find(".filter-list").append(listItem);
                    }
                    listItem = null;
                }
                /*var filtersNum = App.filters.length;
                for (var i = 0; i < filtersNum; i++) {
                    if (App.a.activeWidget != App.filters[i].widget.id) continue;
                    var listItem = $(html).find(".filter-list-item").clone();
                    listItem.html(
                        listItem.html().replace(/{{filterName}}/, App.filters[i].name)
                    );
                    listItem.data("filter", App.filters[i]);

                    if (App.a && (App.a.widgets[App.a.activeWidget].filters.getFilter(App.filters[i].path) != "")) {
                        var fv = App.a.widgets[App.a.activeWidget].filters.getFilter(App.filters[i].path).valueName || App.a.widgets[App.a.activeWidget].filters.getFilter(App.filters[i].path).value;
                        listItem.html(listItem.html().replace(/{{filterValue}}/, fv));
                        listItem.find(".toggle").addClass("active");
                    } else {
                        listItem.html(listItem.html().replace(/{{filterValue}}/, ""));
                    }


                    if (listItem.find(".toggle").hasClass('active')) {
                        $(holder).find(".filter-list").prepend(listItem);
                    } else {
                        $(holder).find(".filter-list").append(listItem);
                    }
                    listItem = null;
                };*/
                var $holder = $(holder);
                $holder.find("a").off('tap').on('tap', function (e) {
                    //if ($(this).find(".toggle").hasClass("active")) return;
                    e.preventDefault();
                    if (e.originalEvent.target != this) return;

                    self.selectedFilter = $(this).parent().data("filter");
                    self.getFilterInfo();
                    return false;
                });
                $holder.find(".toggle").off("click").off("tap").off("toggle").on("toggle", function (e) {
                    if (e.originalEvent.detail.isActive) {
                        self.selectedFilter = $(this).parent().parent().data("filter");
                        self.getFilterInfo();
                        App.a.widgets[App.a.activeWidget].filters.setFilter(self.selectedFilter, true);
                    } else {
                        App.a.widgets[App.a.activeWidget].filters.remove($(this).parent().parent().data("filter").path);
                    }
                });

                if (App.a.widgets[App.a.activeWidget].filters.hasFilters()) {
                    $("#fltBarFooter").show();
                } else $("#fltBarFooter").hide();

                $("#btnDismissFilters").off('tap').on('tap', function (e) {
                    $("#filters").removeClass("active");
                    var allFilters = App.a.widgets[App.a.activeWidget].filters.getAll();
                    for (var f in allFilters) {
                        App.a.widgets[App.a.activeWidget].filters.remove(f);
                    }
                    $("#btnMainFilter").removeClass("tab-item-green");
                });
            });

        };
        /**
         Fetching data via module:MessageCenter
         *@function module:FiltersView#getFilterInfo
         * @listens module:MessageCenter#filter_values_acquired
         * @fires module:MessageCenter#filter_values_requested
         */
        this.getFilterInfo = function (d) {
            //var fv = sessionStorage.getItem("filters_values_" + self.selectedFilter.path);
            //if (!fv) {
                var c = App.a.widgets[App.a.activeWidget].controls;
                if (c) if (c.length != 0) {
                    var d = [];
                    for (var k = 0; k < c.length; k++) if (c[k].targetProperty == self.selectedFilter.path){
                        for (var i = 0; i < c[k].values.length; i++) {
                            d.push({name: c[k].values[i].name, value: c[k].values[i].path});
                        }
                        self.renderInfo({data: d, path: self.selectedFilter.path, name: c[k].targetPropertyDisplay});
                        break;
                    }
                }
            //} else self.renderInfo(JSON.parse(fv));
            /*if (!fv) {
                mc.subscribe("filter_values_acquired:" + self.selectedFilter.path, {
                    subscriber: self,
                    callback: self.renderInfo,
                    once: true
                });
                mc.publish("filter_values_requested:" + self.selectedFilter.path, self.selectedFilter);
            } else {
                self.renderInfo(JSON.parse(fv));
            }*/
        };
        /**
         * Does rendering of selected filter's values
         * @function module:FiltersView#renderInfo
         */
        this.renderInfo = function (d) {
            var self = this;
            var fv = sessionStorage.getItem("filters_values_" + self.selectedFilter.path);
            if (!fv) {
                sessionStorage.setItem("filters_values_" + self.selectedFilter.path, JSON.stringify(d))
            }
            $("#filters").data("isValues", 1);
            require(['text!../views/FiltersInfo.html'], function (html) {
                var holder = "#filters .content";
                $(holder).empty();
                $("#filters .title").text(d.name);
                $("#filters .title").text(d.name);
                var list = $(html);
                list.empty();
                $(holder).append(list);

                var valNum = d.data.length
                for (var i = 0; i < valNum; i++) {
                    var li = $(html).find("> *").html(
                        $(html).find("> *").html()
                        .replace(/{{filterValueValue}}/, d.data[i].value)
                        .replace(/{{filterValueName}}/, d.data[i].name)
                    );
                    var wf = App.a.widgets[App.a.activeWidget].filters.getFilter(self.selectedFilter.path);
                    if ($.isArray(wf.value)) {
                        if (wf.value.indexOf(d.data[i].value) != -1) {
                            li.addClass("active");
                            li.find(".icon-check").show();
                        }
                    } else {
                        if (wf.value == d.data[i].value) {
                            li.addClass("active");
                        }
                    }
                    li.data("name", d.name).data("value", d.data[i].value).data("valueName", d.data[i].name);
                    li.off('tap').on('tap', function (e) {
                        e.preventDefault();
                        var check = $(this).find(".icon-check");
                        if (check.is(":visible")) {
                            $(this).removeClass("active");
                            check.hide();
                        } else {
                            $(this).addClass("active");
                            check.show();
                        }

                        // is any filter is checked? then show button accept
                        if ($("#filters .content").find(".icon-check:visible").length != 0) $("#btnFilterAccept").show();
                        else $("#btnFilterAccept").hide();
                    });
                    list.append(li);


                }

                if ($("#filters .content").find(".icon-check:visible").length != 0) $("#btnFilterAccept").show();
                else $("#btnFilterAccept").hide();

                $("#btnFilterAccept").off("tap").on("tap", function(){
                    $("#btnMainFilter").removeClass("tab-item-green");
                    var items = $("#filters .content").find(".icon-check:visible");
                    if (items.length == 0) return;
                    var values = [];
                    var valueNames = [];
                    for (var i = 0; i < items.length; i++) {
                        values.push($(items[i]).parent().data("value"));
                        valueNames.push($(items[i]).parent().data("valueName"));
                    }
                    App.a.widgets[App.a.activeWidget].filters.setFilter({
                        name: $(items[0]).parent().data("name"),
                        path: self.selectedFilter.path,
                        value: values,
                        valueName: valueNames
                    });
                    $("#btnMainFilter").addClass("tab-item-green");
                    $("#filters").removeClass("active");
                    $("#btnMainFilter").show();
                });
            });


        };

        $("#btnFilterBack").off("tap").on("tap", function() {
            if ($("#filters").data("isValues") == 1) {
                self.render();
            } else {
                if (!App.a.widgets[App.a.activeWidget].filters.hasFilters()) $("#btnMainFilter").removeClass("tab-item-green");
                $("#filters").removeClass("active");
            }
        });

        $("#btnMainFilter").off("tap").on("tap", function() {
            self.render();
            $("#filters").addClass("active");
        });
    };
    return new FiltersView();
});