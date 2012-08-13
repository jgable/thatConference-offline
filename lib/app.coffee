express = require "express"
assets = require "connect-assets"
data = require "./data"

# Express Config
app = express()
app.use express.static(process.cwd() + '/public')
app.use assets()

app.set 'view engine', 'jade'

app.get "/", (req, resp) ->
    resp.render "index"

for session in data.Sessions
    session.Start = new Date(parseInt(session.ScheduledDateTime.substr(6), 10))

# Pre compute our simplified session list
sessionList = ({ id: session.SessionId, name: session.Title, start: new Date(parseInt(session.ScheduledDateTime.substr(6), 10)) } for session in data.Sessions)

# Pre compute our offline data


app.get "/sessions/list", (req, resp) ->
    resp.json sessionList

app.get "/sessions/offline", (req, resp) ->
    resp.json data.Sessions

app.get "/sessions/:id", (req, resp) ->
    sessId = req.param("id")|0

    found = null
    for session in data.Sessions
        if session.SessionId == sessId
            found = session
            break

    resp.json found

app.get "/cache.manifest", (req, resp) ->
    resp.type "test/cache-manifest"
    resp.render "manifest"

port = process.env.VMC_APP_PORT or 3000

app.listen port, -> console.log "Listening... [#{ port }]"