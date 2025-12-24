import express from 'express'
import { generateImage, getUserGenerations, getGeneration } from '../controllers/imageControllers.js'
import userAuth from '../middlewares/auth.js'

const imageRouter = express.Router()

// ✅ FIX: Browser / Health check route
imageRouter.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Image API is working ✅'
  })
})

// 🔥 Image generation
imageRouter.post('/generate-image', userAuth, generateImage)

// 🔥 Fetch user generations
imageRouter.get('/user-generations', userAuth, getUserGenerations)

// 🔥 Single generation by ID
imageRouter.get('/generation/:id', userAuth, getGeneration)

export default imageRouter
