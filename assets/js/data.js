(function($, $app) {

    var sessionsOnline = {
        getList: function() {
            return $.get("/sessions/list");
        },
        detail: function(id) {
            return $.get("/sessions/" + id);
        }
    };

    $app.data.sessions = {
        provider: function() {
            // TODO: Determine whether to use the offline or online provider.
            return sessionsOnline;
        },
        getList: function() {
            return this.provider().getList();
        },
        detail: function(id) {
            return this.provider().detail(id);
        }
    };

}(jQuery, $app));