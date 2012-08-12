
describe "thatConference offline app", ->
    it "uses the latest jQuery Mobile (1.1.1) with jQuery 1.7.1", -> true
    it "has a cache manifest that lists everything needed to go offline", -> true
    
    describe "home page", ->
        it "shows a list of session names", -> true
        it "loads sessions from ajax request when in 'online' mode", -> true
        it "loads sessions from localStorage when in 'offline' mode", -> true
        it "lets you click on a session name and view the details of that session on another page", -> true
        it "lets you change whether you want to be in 'online' or 'offline' mode", -> true
    
    describe "session page", ->
        it "shows the details of a session", -> true
        it "loads the session details from an ajax request when in 'online' mode", -> true
        it "loads the session details from localStorage when in 'offline' mode", -> true
        it "lets you click a back button to return to the home page", -> true

    describe "session data access", ->
        it "uses a provider model", -> true
        it "can detect when the app is in offline mode", -> true
        it "can choose the correct provider to use to get session data when in offline mode", -> true

    describe "offline mode", ->
        it "downloads data from the server", -> true
        it "stores the data in localStorage", -> true
