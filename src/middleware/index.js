import { Router } from 'express'

import bodyParser from 'body-parser'
import cors from 'cors'

export default({ config }) => {
    let api = Router()

    api.use(bodyParser.json({
        limit: config.bodyLimit
    }))
    api.use(bodyParser.urlencoded({
        extended: true
    }))
    api.use(cors())
    
    return api
}