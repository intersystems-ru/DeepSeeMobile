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
    'Utils',
    'lib/iscroll',
    "MessageCenter"
], function (Utils, IScroll, mc) {
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

        /**
         * Does rendering of filters
         * @function module:FiltersView#render
         */
        this.render = function () {
            require(['text!../FiltersView.html'], function (html) {

                var holder = "#filters .content";
                $(holder).empty();
                $("#filters .title").text("Filters");
                var list = $(html).clone();
                list.empty();
                $(holder).append(list);
                var infoItem = $(html).find(".filter-list-info-item").clone();
                $(holder).find(".filter-list-info").append(infoItem);
                var filtersNum = App.a.filters.length;
                for (var i = 0; i < filtersNum; i++) {
                    var listItem = $(html).find(".filter-list-item").clone();
                    listItem.html(
                        listItem.html().replace(/{{filterName}}/, App.a.filters[i].name) //todo: a.filters is BAAAD
                    );
                    listItem.data("filter", App.a.filters[i]);

                    if (App.a.widgets[App.a.activeWidget].filters.getFilter(App.a.filters[i].path) != "") {
                        var fv = App.a.widgets[App.a.activeWidget].filters.getFilter(App.a.filters[i].path).valueName || App.a.widgets[App.a.activeWidget].filters.getFilter(App.a.filters[i].path).value;
                        listItem.html(listItem.html().replace(/{{filterValue}}/, fv));
                        listItem.find(".toggle").addClass("active");

                    } else {
                        listItem.html(listItem.html().replace(/{{filterValue}}/, ""));
                    }
                    listItem.find("a").off("tap").on('tap', function (e) {
                        e.preventDefault();
                        if (e.originalEvent.target != this) return;
                        if (!$(this).find(".toggle").hasClass("active")) return;
                        self.selectedFilter = $(this).parent().data("filter");
                        self.getFilterInfo();
                        return false;
                    });
                    listItem.find(".toggle").off("toggle").on("toggle", function (e) {
                        if (e.originalEvent.detail.isActive) {
                            self.selectedFilter = $(this).parent().parent().data("filter");
                            self.getFilterInfo();
                            App.a.widgets[App.a.activeWidget].filters.setFilter(self.selectedFilter, true);
                        } else {
                            App.a.widgets[App.a.activeWidget].filters.remove($(this).parent().parent().data("filter").name);
                        }
                    });

                    $(holder).find(".filter-list").append(listItem);
                }
                if (IScroll) {
                    new IScroll('#filters .content', {
                        tap: true
                    });
                }
            });

        };
        /**
         Fetching data via module:MessageCenter
         *@function module:FiltersView#getFilterInfo
         * @listens module:MessageCenter#filter_values_acquired
         * @fires module:MessageCenter#filter_values_requested
         */
        this.getFilterInfo = function (d) {
            mc.subscribe("filter_values_acquired:" + self.selectedFilter.path, {
                subscriber: self,
                callback: self.renderInfo,
                once: true
            });
            mc.publish("filter_values_requested:"+self.selectedFilter.path, [self.selectedFilter.name]);



        };
        /**
         * Does rendering of selected filter's values
         * @function module:FiltersView#renderInfo
         */
        this.renderInfo = function (d) {
            var self=this;
            require(['text!../FiltersViewInfo.html'], function (html) {

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
                    if(wf.value == d.data[i].value) {li.addClass("active"); console.log("A+DS",li);}
                    li.data("name", d.name).data("value", d.data[i].value).data("valueName", d.data[i].name);
                    li.one('tap', function () {
                        App.a.widgets[App.a.activeWidget].filters.setFilter({
                            name: $(this).data("name"),
                            path: self.selectedFilter.path,
                            value: $(this).data("value"),
                            valueName: $(this).data("valueName")
                        });
                        $("#filters").removeClass("active");
                    });
                    list.append(li);


                }
                if (IScroll) {
                    new IScroll('#filters .content', {
                        tap: true
                    });
                }

            });


        };

        mc.subscribe("set_active_widget", {
            subscriber: this,
            callback: this.render
        });
        /*mc.subscribe("filters_acquired", {
            subscriber: this,
            callback: this.render
        }); //TODO: - what comes first - this one or in DashBoard?*/
        $("#filters").on('modalOpened', this.render);
    };
    return new FiltersView();
});