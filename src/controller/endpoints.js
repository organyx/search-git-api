import { Router } from 'express'
import util from 'util'

import axios from 'axios'

export default({ config }) => {
    // API Router
    let api = Router()

    // Logger
    const log = config.log()
    const baseUrl = 'https://api.github.com/search?utf8=✓'
    const query = 'q=AleksTheDev'
    const auth = `client_id=${config.gitClient_ID}&client_secret=${config.gitClient_Secret}`
    const type = 'type=code'
    const scope = 'in:file'
    const extension = 'extension%3A.js'
    const language = 'language:js'
    const repo = 'repo:jquery/jquery'
    const user = 'user:organyx'
    const perPage = 'per_page=10'
    const sortBy = 'sort: score'
    
    // const url = `${baseUrl}?${query}+${scope}+${language}+${repo}+${user}+${perPage}`
    const url = `${baseUrl}+${query}+${extension}+${type}+${perPage}`
    // 'https://api.github.com/search/code?q=addClass+in:file+language:js+repo:jquery/jquery+user:organyx'
    // const url = `https://api.github.com/users/organyx?${auth}`

    axios.post(`https://github.com/login/oauth/authorize?client_id=${config.gitClient_ID}`)
            .then(function(response) {
                console.log(response)
            })
            .catch(function(error) {
                console.log(error)
            })

    api.get('/callback', (req, res) => {
        log.info(res)
    })

    // api.get('/', (req, res) => {
    //     // res.json({ response: 'Hello World' })
    //     // res.send('Hello World')
    //     // axios.defaults.headers.common['Authorization'] = config.gitAccessToken
    //     axios.get(url)
    //         .then(function(response) {
    //             res.json({ response: util.inspect(response.data) })
    //             // res.send(response)
    //             log.info(response.data)
    //         })
    //         .catch(function (error) {
    //             // if (error.response) {
    //             //   // The request was made and the server responded with a status code
    //             //   // that falls out of the range of 2xx
    //             //     log.fatal(error.response.data)
    //             //     log.fatal(error.response.status)
    //             //     log.fatal(error.response.headers)
    //             // } else if (error.request) {
    //             //   // The request was made but no response was received
    //             //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //             //   // http.ClientRequest in node.js
    //             //     log.fatal(error.request)
    //             // } else {
    //             //   // Something happened in setting up the request that triggered an Error
    //             //     log.fatal('Error', error.message)
    //             // }
    //             // log.fatal(error.config)
    //         })
    //     // log.info('Hello World')
    // })

    return api
}