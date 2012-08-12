(function($) {

    // Set up our app namespace
    var $app = window.$app = {
        pages: {},
        data: {},
        helpers: {
            showLoady: function() {
                $.mobile.showPageLoadingMsg();
            },
            hideLoady: function() {
                $.mobile.hidePageLoadingMsg();
            }
        }
    };

    // Set the router namespace
    $.mobile.mvc.settings.pageNS = $.mobile.mvc.pages = $app.pages;

}(jQuery));