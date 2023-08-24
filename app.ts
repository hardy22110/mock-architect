import express from 'express'
import { getRoute, postRoute } from './routes'
import { PORT } from './utils/getEnvConfig'
import bodyParser from 'body-parser'
import cors from 'cors'
import ip from 'ip'
const app = express()


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// cross
app.use(cors())

app.use(getRoute)
app.use(postRoute)

// run
app.listen(PORT, () => {
  console.log(`Running on`, `(${ip.address()}:${PORT})`)
})
