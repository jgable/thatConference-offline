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
        _sessions: null,
        _getSessions: function() {
            var def = new $.Deferred();

            if (this._sessions) {
                def.resolve(this._sessions);
                return def.promise();
            }

            var sessionIds = $app.offline.storage.getObj("sessionIds");

            var sessions = $.map(sessionIds, function(id) {
                return $app.offline.storage.getObj("session_" + id);
            });

            this._sessions = sessions;

            def.resolve(sessions);

            return def.promise();
        },
        getList: function() {
            var def = new $.Deferred();
            
            this._getSessions()
                .then(function(sessions) {
                    // TODO: Parse the date here before we pass it back
                    def.resolve($.map(sessions, function(s) { return { id: s.SessionId, name: s.Title };}))
                });

            return def.promise();
        },
        detail: function(id) {
            var def = new $.Deferred();

            this._getSessions()
                .then(function(sessions) {
                    var found = null,
                        i = 0, len = sessions.length;
                    for (; i < len; i++) {
                        
                        if (sessions[i].SessionId === id) {
                            found = sessions[i];
                            break;
                        }
                    }

                    def.resolve(found);
                });

            return def.promise();
        }
    };

    $app.data.sessions = {
        provider: function() {
            // TODO: Determine whether to use the offline or online provider.
            return $app.offline.isOffline() ? sessionsOffline : sessionsOnline;
        },
        getList: function() {
            return this.provider().getList();
        },
        detail: function(id) {
            return this.provider().detail(id);
        }
    };

}(jQuery, $app));