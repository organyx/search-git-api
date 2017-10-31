import { Router } from 'express'
import util from 'util'

import axios from 'axios'

export default({ config }) => {
    // API Router
    let api = Router()

    // Logger
    const log = config.log()
    const baseUrl = 'https://api.github.com/search/code'
    const query = 'q=addClass'
    const auth = `client_id=${config.gitClient_ID}&client_secret=${config.gitClient_Secret}`
    const mention = 'in:file'
    const language = 'language:js'
    const repo = 'repo:jquery/jquery'
    const user = 'user:organyx'
    const perPage = 'per_page=2'
    
    const url = `${baseUrl}?${query}+${mention}+${language}+${repo}+${user}+${perPage}`
    // 'https://api.github.com/search/code?q=addClass+in:file+language:js+repo:jquery/jquery+user:organyx'

    api.get('/', (req, res) => {
        // res.json({ response: 'Hello World' })
        // res.send('Hello World')
        axios.get(url)
            .then(function(response) {
                res.json({ response: util.inspect(response.data) })
                // res.send(response)
                log.info(response)
            })
            .catch(function(error) {
                log.fatal(error)
            })
        log.info('Hello World')
    })

    return api
}