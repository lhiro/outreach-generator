'use client'
import { motion } from 'framer-motion'

export const Slogon = () => (
  <motion.div
    initial={{ y: 5, opacity: 0 }}
    animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
    className="mt-20 flex flex-col items-center"
  >
    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
      See it, ship it
    </h1>
    <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
      Enter a lead (name, role, company)
    </p>
    or
    <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-10">
      Press tab to get started.
    </p>
  </motion.div>
)
