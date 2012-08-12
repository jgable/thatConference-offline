
describe "thatConference offline app", ->
    it "uses the latest jQuery Mobile (1.1.1) with jQuery 1.7.1", -> true
    it "has a cache manifest that lists everything needed to go offline"
    
    describe "home page", ->
        it "shows a list of session names"
        it "loads sessions from ajax request when in 'online' mode"
        it "loads sessions from localStorage when in 'offline' mode"
        it "lets you click on a session name and view the details of that session on another page"
        it "lets you change whether you want to be in 'online' or 'offline' mode"
    
    describe "session page", ->
        it "shows the details of a session"
        it "loads the session details from an ajax request when in 'online' mode"
        it "loads the session details from localStorage when in 'offline' mode"
        it "lets you click a back button to return to the home page"

    describe "session data access", ->
        it "uses a provider model"
        it "can detect when the app is offline"
        it "can choose the correct provider to use to get session data when offline"

    describe "offline mode", ->
        it "downloads data from the server"
        it "stores the data in localStorage"
