//FiltersView Class Declaration

define(['Utils'], function (Utils) {
    return function FiltersView() {
        var self = this;
        this.toString = function () {
            return "FiltersView"
        };
        this.holder = "#filters .content";
        this.selectedFilter = null;
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
                var filtersNum = a.filters.length;
                for (var i = 0; i < filtersNum; i++) {
                    var listItem = $(html).find(".filter-list-item").clone();
                    listItem.html(
                        listItem.html().replace(/{{filterName}}/, Utils.trim(a.filters[i].name)) //todo: a.filters is BAAAD
                    );
                    listItem.data("filter", a.filters[i]);

                    if (a.widgets[a.activeWidget].filters.getFilter(a.filters[i].name) != "") {
                        listItem.html(listItem.html().replace(/{{filterValue}}/, a.widgets[a.activeWidget].filters.getFilter(a.filters[i].name).value));
                        listItem.find(".toggle").addClass("active");

                    } else {
                        listItem.html(listItem.html().replace(/{{filterValue}}/, ""));
                    }
                    listItem.on('tap', function (e) {
                        if (e.originalEvent.target != this) return;
                        self.selectedFilter = $(this).data("filter");
                        self.showFilterInfo();
                    });
                    listItem.find(".toggle").on("toggle", function (e) {
                        if (e.originalEvent.detail.isActive) {
                            self.selectedFilter = $(this).parent().parent().data("filter");
                            self.showFilterInfo();
                            a.widgets[a.activeWidget].filters.setFilter(self.selectedFilter);
                        } else {
                            a.widgets[a.activeWidget].filters.remove($(this).parent().parent().data("filter").name);
                        }
                    });
                    $(holder).find(".filter-list").append(listItem);
                }
            });

        }
        this.showFilterInfo = function (d) {
            mc.subscribe("filter_list_acquired" + self.selectedFilter.path, {
                subscriber: self,
                callback: self.renderInfo,
                once: true
            });
            mc.publish("filter_list_requested", [self.selectedFilter.path, self.selectedFilter.name]);



        }
        this.renderInfo = function (d) {

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
                    li.data("name", d.name).data("value", d.data[i].value);
                    li.on('tap', function () {
                        console.log($(this).data("name"));
                        a.widgets[a.activeWidget].filters.setFilter({
                            name: $(this).data("name"),
                            value: $(this).data("value")
                        });
                        $("#filters").removeClass("active");
                    });
                    list.append(li);


                }


            });


        };
        mc.subscribe("set_active_widget", {
            subscriber: this,
            callback: this.render
        });
        mc.subscribe("filters_acquired", {
            subscriber: this,
            callback: this.render
        }); //TODO: - what comes first - this one or in DashBoard?
        $("a[href='#filters']").on('tap', this.render);
    }
});