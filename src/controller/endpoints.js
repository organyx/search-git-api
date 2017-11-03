import { Router } from 'express'
import _ from 'lodash'
import util from 'util'

import axios from 'axios'

export default({ config }) => {
    // API Router
    let api = Router()

    // Logger
    const log = config.log()

    // GitHub API
    const git = config.github

    const baseUrl = 'https://api.github.com/search/code'
    const query = 'q=realtimebusapp'
    const auth = `client_id=${config.gitClient_ID}&client_secret=${config.gitClient_Secret}`
    const type = 'type=code'
    const scope = 'in:file'
    const extension = 'extension%3A.js'
    const language = 'language:js'
    const repo = 'repo:jquery/jquery'
    const user = 'user:organyx'
    const perPage = 'per_page=25'
    const sortBy = 'sort: score'
    
    // const url = `${baseUrl}?${query}+${scope}+${language}+${repo}+${user}+${perPage}`
    // const url = `${baseUrl}+${query}+${extension}+${type}+${perPage}`
    // const url = `${baseUrl}${query}&${type}&${perPage}`
    const url = `${baseUrl}?${query}`
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

    api.get('/', (req, res) => {
        // res.json({ response: 'Hello World' })
        // res.send('Hello World')
        axios.defaults.headers.common['Authorization'] = `token ${config.gitAccessToken}`
        axios.get(url)
            .then(function(response) {
                let hitsOut = []
                let items = response.data.items 
                // console.log(items)
                // res.json({ items: items })
                // console.log(typeof items === 'object')
                // res.json({ response: items })
                // for(let i = 0; i < items.length; i++) {
                //     // hits[i] = {'owner_name' : i.repository.owner.login }
                //     console.log(i.repository.owner.login)
                // }

                let item = items[0]
                console.log(JSON.stringify(item.name))
                for (const key of Object.keys(items)) {
                    // console.log(key, items[key])
                    // console.log(key, items[key]['name'])
                    // console.log(key, items[key]['repository']['name'])
                    // console.log(key, items[key]['repository']['owner']['login'])
                    // console.log(key, items[key]['score'])
                    let hit = {
                        'owner_name': items[key]['repository']['owner']['login'],
                        'repository_name' : items[key]['repository']['name'],
                        'file_name' : items[key]['name'],
                        'score' : items[key]['score']
                    }
                    hitsOut.push(hit)
                }
                _.sortBy(hitsOut, 'score')
                console.log(hitsOut)
                
                // for(var item in items) {
                //     // console.log(item['name'])
                    
                //     // if(items.hasOwnProperty(item)) {
                //     //     console.log(item + ' , ' + items[item] + '\n')
                //     //     // console.log(_.get(item, 'name'))
                //     //     for(var i in item) {
                //     //         console.log(_.has(item, i))
                            
                //     //     }
                //     // }
                //     if(_.has(item[1], 'name')) {
                //         console.log(_.get(item, 'name'))
                //         console.log(Object.keys(item['name']))
                //     }
                // }

                // res.json({ hits: hits })
                // log.info(response.data)
                // res.send(response)
                res.json({ items : items })
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
        // log.info('Hello World')
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
    return api
}