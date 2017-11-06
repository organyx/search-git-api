import { Router } from 'express'
import _ from 'lodash'
import { UrlBuilder, Pagination } from '../util'

import axios from 'axios'

export default({ config }) => {
    // API Router
    let api = Router()

    // Logger
    const log = config.log()

    // const url = `${baseUrl}${query}&${type}&${perPage}`

    // const url = `${baseUrl}&${query}&${auth}`
    // 'https://api.github.com/search/code?q=addClass+in:file+language:js+repo:jquery/jquery+user:organyx'
    // const url = `https://api.github.com/users/organyx?${auth}`

    // axios.get(`https://github.com/login/oauth/authorize?client_id=${config.gitClient_ID}`)
    //         .then(function(response) {
    //             console.log(response)
    //         })
    //         .catch(function(error) {
    //             console.log(error)
    //         })

    // axios.get(`https://api.github.com/users/organyx?${auth}`)
    //     .then(function(response) {
    //         console.log(response.data)
    //     })
    //     .catch(function(error) {
    //         console.log(error)
    //     })

    // axios.post('https://github.com/login/oauth/access_token', {
    //     client_id: config.gitClient_ID,
    //     client_secret: config.gitClient_Secret
    // })
    //     .then(function(response) {
    //         console.log(response)
    //     })
    //     .catch(function(error) {
    //         console.log(error)
    //     })

    api.get('/callback', (req, res) => {
        log.debug(res)
    })
    /**
     * Main End-Point
     * @param {*} ':query' Search query
     * @param {*} ':page_num' Page number
     * @param {*} ':per_page' Page limit
     * @param {*} ':sort_by' Sorting criteria
     */
    api.get('/:query/:page_num/:per_page/:sort_by', (req, res) => {
        // Provider URL
        const baseUrl = 'https://api.github.com/search/code'
        // Search query 
        let query = `q=${req.params.query}`
        // Page number
        let page_num = req.params.page_num
        // Page Limit
        let per_page = req.params.per_page
        // Sorting criteria
        let sort_by = req.params.sort_by
        log.debug(req.params)
        // New Url builder
        let url = new UrlBuilder(baseUrl, query).getUrl()
        // Setting new Auth Header to make requests to GitHub
        axios.defaults.headers.common['Authorization'] = `token ${config.gitAccessToken}`
        axios.get(url)
            .then(function(response) {
                // Setting up array of Hits
                let hitsOut = []
                // Getting the data items
                let items = response.data.items 
                // Looping through every item
                for (const key of Object.keys(items)) {
                    // Creating new Hit on every iteration
                    let hit = {
                        'owner_name': items[key]['repository']['owner']['login'],
                        'repository_name' : items[key]['repository']['name'],
                        'file_name' : items[key]['name'],
                        'score' : items[key]['score']
                    }
                    // Adding new Hit to array of Hits
                    hitsOut.push(hit)
                }
                // Setting up Pagination
                let pages = new Pagination(hitsOut, 1, per_page)
                // Selecting the page of the results
                hitsOut = pages.changePage(page_num)
                // Filter out Null results
                hitsOut = hitsOut.filter((value) => { return value != null })
                // Sort remaining Hits
                _.sortBy(hitsOut, sort_by)
                // log.debug(hitsOut)
                res.json({ hits : hitsOut })
            })
            .catch(function (error) {
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                    log.fatal(error.response.data)
                    log.fatal(error.response.status)
                    log.fatal(error.response.headers)
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                    log.fatal(error.request)
                } else {
                  // Something happened in setting up the request that triggered an Error
                    log.fatal('Error', error.message)
                }
                log.fatal(error.config)
            })
    })

    // api.get('/', (req, res) => {
    //     git.search.code({
    //         q: 'AleksTheDev',
    //         per_page: 10
    //     }, function(err, res) {
    //         if (err) {
    //             console.log(err) 
    //         }
    //         console.log(JSON.stringify(res))
    //     })
    // })

    // api.get('/new_provider/:provider', (req, res) => {
    //     let provider = req.params.provider
    //     console.log(provider)
    //     res.send(provider)
    // })

    return api
}

