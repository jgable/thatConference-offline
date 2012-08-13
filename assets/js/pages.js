(function($, $app){
    "use strict";

    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        formatDate = function(d) {
            // Date Time Formatting in javascript is so awesome.
            var min = d.getMinutes(),
                hr = d.getHours(),
                meridian = hr < 12 ? "AM" : "PM";

            hr = hr % 12;
            if (hr === 0) {
                hr = 12;
            }
                
            min = min < 10 ? "0" + min : "" + min;
            return daysOfWeek[d.getDay()] + ", " + hr + ":" + min + " " + meridian;
        };

    // Home Page
    var HomePage = function() {
        this.init = false;
    };

    HomePage.prototype = {
        // Handle the initial creation of the jQuery Mobile page
        create: function($page) {
            ich.grabTemplates();
            var that = this;

            this.$sessionList = $page.find("#sessionList");
            this.$offlineToggle = $page.find("#offlineFlip");

            this.$offlineToggle.change(function(evt) {
                
                var val = $(this).val();
                console.log("Toggle Offline: " + val);
                if(val === "on") {
                    
                    $app.helpers.showLoady();
                    // Go offline
                    $app.offline.goOffline()
                        .always($app.helpers.hideLoady)
                        .then(function() {
                            
                            that.init = false;
                            that.show($page);

                        }, function(msg) {
                            alert("There was an error going offline: " + msg)
                        });
                } else {
                    
                    // Go back to web based provider
                    window.localStorage.setItem("offline", "web");
                    
                    that.init = false;
                    that.show($page);
                }
            });
        },

        // Handle the page being shown
        show: function() {
            
            // If we haven't loaded the sessions yet, load them now
            if (!this.init) {
                this.loadSessions();
                this.init = true;
            }

            // Update the state of the offline toggle
            if(!$app.offline.canGoOffline()) {
                // Disable the toggle if we can't go offline.
                this.$offlineToggle.slider({ disabled: true });
            }
            if ($app.offline.isOffline()) {
                var mode = "on";
                if(this.$offlineToggle.val() !== mode) {
                   this.$offlineToggle.val(mode);
                   this.$offlineToggle.slider("refresh");
                }
            }
        },

        // Load sessions from our session provider and fill our listview with them
        loadSessions: function() {
            var $ul = this.$sessionList,
                that = this;

            $app.helpers.showLoady();
            $app.data
                .sessions
                .getList()
                .always($app.helpers.hideLoady)
                .then(function(sessions) {
                    var grouped = {},
                        templData = [],
                        resultHtml;

                    // Sort by date
                    sessions.sort(function(a, b) {
                        return (new Date(a.start)) - (new Date(b.start));
                    });

                    // Group by day
                    $.each(sessions, function() {
                        grouped[this.start] = grouped[this.start] || [];
                        grouped[this.start].push(this)
                    });

                    // Aggregate for our listview
                    $.each(grouped, function(k, v) {
                        templData.push({ start: formatDate(new Date(k)), sessions: v});
                    });

                    // Get template html from grouped data
                    resultHtml = ich.sessionGroup({ timeslots: templData });
                    $ul.find("li").remove();
                    $ul.append(resultHtml);

                    $ul.listview("refresh");
                }, function() {
                    alert("There was a problem retreiving the sessions");
                });
        }
    };

    $app.pages.home = new HomePage();

    var SessionPage = function() {};

    SessionPage.prototype = {
        create: function($page) {
            this.$details = $page.find("#sessionDetails");
            this.$title = $page.find("#sessionTitle");
        },

        show: function($page) {
            var currId = $.mobile.mvc.state.sessionid;

            if(!currId) {
                alert("Unable to load session");
                // TODO: Clear details?  Change back to sessions page?
                return;
            }

            this.loadDetails(currId);
        },

        hide: function() {
            this.$details.html('');
            this.$title.text('');
        },

        loadDetails: function(id) {

            var that = this,
                detailHtml;

            $app.helpers.showLoady();

            $app.data
                .sessions
                .detail(id)
                .always($app.helpers.hideLoady)
                .then(function(session) {

                    detailHtml = ich.sessionDetail(session);

                    that.$title.text(session.Title);
                    that.$details.html(detailHtml);

                }, function() {
                    alert("There was an error loading the session");
                });

        }

    };

    $app.pages.session = new SessionPage()

}(jQuery, window.$app));