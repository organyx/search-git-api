import { Router } from 'express'
import _ from 'lodash'
import util from 'util'
import { UrlBuilder, Pagination } from '../util/index'

import axios from 'axios'

export default({ config }) => {
    // API Router
    let api = Router()

    // Logger
    const log = config.log()

    // GitHub API
    const git = config.github

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
        log.info(res)
    })
    /**
     * Main End-Point
     * @param {*} ':query' Search query
     * @param {*} ':page_num' Page number
     * @param {*} ':per_page' Page limit
     * @param {*} ':sort_by' Sorting criteria
     */
    api.get('/:query/:page_num/:per_page/:sort_by', (req, res) => {
        const baseUrl = 'https://api.github.com/search/code'
        let query = `q=${req.params.query}`
        console.log(req.params)
        let page_num = req.params.page_num
        let per_page = req.params.per_page
        let sort_by = req.params.sort_by
        let url = new UrlBuilder(baseUrl, query).getUrl()
        axios.defaults.headers.common['Authorization'] = `token ${config.gitAccessToken}`
        axios.get(url)
            .then(function(response) {
                let hitsOut = []
                let items = response.data.items 
                for (const key of Object.keys(items)) {
                    let hit = {
                        'owner_name': items[key]['repository']['owner']['login'],
                        'repository_name' : items[key]['repository']['name'],
                        'file_name' : items[key]['name'],
                        'score' : items[key]['score']
                    }
                    hitsOut.push(hit)
                }
                let pages = new Pagination(hitsOut, 1, per_page)
                hitsOut = pages.changePage(page_num)
                // Filter out Null results
                hitsOut = hitsOut.filter((value) => { return value != null })
                _.sortBy(hitsOut, sort_by)
                // log.info(hitsOut)
                res.json({ hits : hitsOut })
            })
            .catch(function (error) {
                // if(error) {
                //     log.fatal(error)
                // }
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

