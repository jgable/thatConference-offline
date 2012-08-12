(function($, $app){
    "use strict";

    // Home Page
    var HomePage = function() {
        this.init = false;
    };

    HomePage.prototype = {
        // Handle the initial creation of the jQuery Mobile page
        create: function($page) {
            this.$sessionList = $page.find("#sessionList");
        },

        // Handle the page being shown
        show: function($page) {
            
            // If we haven't loaded the sessions yet, load them now
            if (!this.init) {
                this.loadSessions();
                this.init = true;
            }
        },

        // Load sessions from our session provider and fill our listview with them
        loadSessions: function() {
            var $ul = this.$sessionList,
                makeItem = function(session) {
                    // TODO: Templating library
                    $ul.append("<li><a href='#session' data-sessionid='" + session.id + "' class='navLink'>" + session.name + "</a></li>")
                },
                that = this;

            $app.helpers.showLoady();
            $app.data
                .sessions
                .getList()
                .always($app.helpers.hideLoady)
                .then(function(sessions) {
                    $.each(sessions, function() {
                        makeItem(this);
                    });

                    $ul.listview("refresh");
                }, function() {
                    alert("There was a problem retreiving the sessions");
                });
        }
    };

    $app.pages.home = new HomePage();

    // TODO: Session Page

    var SessionPage = function() {}

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

                    // TODO: Template and more detail
                    detailHtml = "<h2>" + session.Title + "</h2><p>" + session.Description + "</p>";

                    that.$title.text(session.Title);
                    that.$details.html(detailHtml);

                }, function() {
                    alert("There was an error loading the session");
                });

        }

    };

    $app.pages.session = new SessionPage()

}(jQuery, window.$app));