import express from 'express'

import config from '../config'
import middleware from '../middleware'
import endpoints from '../controller/endpoints'

let router = express()

// Connect internal middleware
router.use(middleware({ config }))
// API routes v1 
router.use('/endpoints', endpoints({ config }))

export default router
