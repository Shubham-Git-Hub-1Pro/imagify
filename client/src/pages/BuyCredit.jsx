import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'

const BuyCredit = () => {

  const { user } = useContext(AppContext)

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='min-h-[80vh] text-center pt-14 mb-10'
    >

      {/* 🔹 HEADER */}
      <h1 className='text-center text-3xl font-medium mb-4'>
        Choose Your Plan
      </h1>

      <p className='text-center text-gray-500 mb-12'>
        Demo credit system for academic project evaluation
      </p>

      {/* 🔹 PLANS */}
      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((item, index) => (
          <div
            key={index}
            className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500'
          >
            <img width={40} src={assets.logo_icon} alt="" />

            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>

            <p className='mt-6'>
              <span className='text-3xl font-medium'>
                ₹{item.price}
              </span>
              {' '} / {item.credits} Credits
            </p>

            {/* 🔹 DEMO NOTE */}
            <p className='text-xs text-gray-400 mt-2'>
              Free demo credits (No payment required)
            </p>

            <button
              className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'
            >
              {user ? 'Add Credits' : 'Login to Continue'}
            </button>
          </div>
        ))}
      </div>

    </motion.div>
  )
}

export default BuyCredit
