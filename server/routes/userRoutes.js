import express from 'express'
import { registerUser, loginUser, userCredits, buyCredits } from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'

const userRouter = express.Router()

// ✅ FIX: GET route for browser / health check
userRouter.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'User API is working ✅'
  })
})

// Auth routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

// Credits routes
userRouter.get('/credits', userAuth, userCredits)
userRouter.post('/buy-credits', userAuth, buyCredits)

export default userRouter
