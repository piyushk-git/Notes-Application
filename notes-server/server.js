import 'dotenv/config'
import app       from './app.js'
import connectDB from './config/db.js'

const PORT = process.env.PORT ?? 5000

const start = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`✔  Server running on http://localhost:${PORT}  [${process.env.NODE_ENV}]`)
  })
}

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message)
  process.exit(1)
})

start()
