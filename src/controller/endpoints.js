import { Router } from 'express'
import _ from 'lodash'
import { UrlBuilder, Pagination } from '../util'

import axios from 'axios'

export default({ config }) => {
    // API Router
    let api = Router()

    // Logger
    const log = config.log()

    /**
     * End-Point with All parameters: Query, Page number, Page Limit and Sorting
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

    /**
     * End-Point with Query, Page number and Page Limit. Sorting is set to Score by default.
     * @param {*} ':query' Search query
     * @param {*} ':page_num' Page number
     * @param {*} ':per_page' Page limit
     */
    api.get('/:query/:page_num/:per_page', (req, res) => {
        // Provider URL
        const baseUrl = 'https://api.github.com/search/code'
        // Search query 
        let query = `q=${req.params.query}`
        // Page number
        let page_num = req.params.page_num
        // Page Limit
        let per_page = req.params.per_page
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
                _.sortBy(hitsOut, 'score')
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

    /**
     * End-Point with Query, Page number. Page Limit is set to 25 by default. Sorting is set to Score by default.
     * @param {*} ':query' Search query
     * @param {*} ':page_num' Page number
     */
    api.get('/:query/:page_num', (req, res) => {
        // Provider URL
        const baseUrl = 'https://api.github.com/search/code'
        // Search query 
        let query = `q=${req.params.query}`
        // Page number
        let page_num = req.params.page_num
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
                let pages = new Pagination(hitsOut, 1)
                // Selecting the page of the results
                hitsOut = pages.changePage(page_num)
                // Filter out Null results
                hitsOut = hitsOut.filter((value) => { return value != null })
                // Sort remaining Hits
                _.sortBy(hitsOut, 'score')
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

    /**
     * End-Point with Query. Page number is set to 1 by default. Page Limit is set to 25 by default. Sorting is set to Score by default.
     * @param {*} ':query' Search query
     */
    api.get('/:query', (req, res) => {
        // Provider URL
        const baseUrl = 'https://api.github.com/search/code'
        // Search query 
        let query = `q=${req.params.query}`
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
                let pages = new Pagination(hitsOut, 1)
                // Selecting the page of the results
                hitsOut = pages.changePage(1)
                // Filter out Null results
                hitsOut = hitsOut.filter((value) => { return value != null })
                // Sort remaining Hits
                _.sortBy(hitsOut, 'score')
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

    return api
}

