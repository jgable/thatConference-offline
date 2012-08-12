express = require "express"

# Express Config
app = express()
app.use express.static(process.cwd() + '/public')

app.set 'view engine', 'jade'

app.get "/", (req, resp) ->
    resp.render "index"

port = process.env.VMC_APP_PORT or 3000

app.listen port, -> console.log "Listening... [#{ port }]"