import express from 'express'
import { registerUser, loginUser, userCredits, buyCredits } from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/credits', userAuth, userCredits)

// 🔥 NEW – Buy Credits
userRouter.post('/buy-credits', userAuth, buyCredits)

export default userRouter
