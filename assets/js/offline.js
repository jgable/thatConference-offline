(function($, $app) {

    var offlineDataPersistence = {
        localStorage: function(sessions) {
            // Stick a list of its id's in local storage
            var def = new $.Deferred()
                ids = $.map(sessions, function(el) { return el.SessionId; });

            $app.offline.storage.setObj("sessionIds", ids);

            // Stick each one in localStorage with key: session_{id}
            $.each(sessions, function() {
                $app.offline.storage.setObj("session_" + this.SessionId, this);
            });

            // Set a value to let the provider chooser know to use localStorage
            window.localStorage.setItem("offline", "localStorage");

            def.resolve();
            return def.promise();
        }
        // TODO: Could have other kinds, like indexedDb and webSql
    };

    $app.offline = {
        hasCacheManifest: function() {
            return !!window.applicationCache;
        },

        hasLocalStorage: function() {
            return !!window.localStorage;
        },

        canGoOffline: function() {
            return this.hasCacheManifest() && this.hasLocalStorage();
        },

        goOffline: function() {
            var def = new $.Deferred(),
                that = this;

            if (!this.canGoOffline()) {
                def.reject("not supported");
                return def.promise();
            }

            // Download the data
            $.get("/sessions/offline")
             .then(function(sessions) {
                
                // TODO: Check for webSql and indexedDb support and use them instead of localStorage
                offlineDataPersistence.localStorage(sessions)
                    .then(function() {
                        def.resolve();
                    }, function() {
                        def.reject("data persistence error");
                    });

             }, function() {
                def.reject("data retrieve error");
             });

            return def.promise();
        },

        isOffline: function() {
            if (!this.hasLocalStorage()) {
                return false;
            }
            var offlineVal = window.localStorage.getItem("offline");

            return offlineVal && offlineVal !== "web"
        },

        // Add a helper for getting and setting local storage JSON objects.
        storage: {
            setObj: function(name, obj) {
                var content;
                try {
                    content = JSON.stringify(obj);
                } catch(err) {
                    throw new Error("Error converting object to JSON for localStorage");
                }

                window.localStorage.setItem(name, content);
            },
            getObj: function(name) {
                return JSON.parse(window.localStorage.getItem(name));
            }
        }
    }

}(jQuery, $app));