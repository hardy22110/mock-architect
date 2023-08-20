import express from 'express'
import routes from './routes'
import { PORT } from './utils/getEnvConfig'
import ip from 'ip'
const app = express()

app.use(routes)

// run
app.listen(PORT, () => {
  console.log(`Running on`, `(${ip.address()}:${PORT})`)
})
