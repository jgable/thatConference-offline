(function($, $app) {

    var sessionsOnline = {
        getList: function() {
            return $.get("/sessions/list");
        },
        detail: function(id) {
            return $.get("/sessions/" + id);
        }
    };

    var sessionsOffline = {
        getList: function() {
            throw new Error("Not implemented");
        },
        detail: function(id) {
            throw new Error("Not implemented");
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