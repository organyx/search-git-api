class UrlBuilder {

    /**
     * Constructor for Url setup.
     * @param {*} baseUrl Provider Url
     * @param {*} query Search Query
     */
    constructor(baseUrl, query) {
        this.baseUrl = baseUrl
        this.query = query
        this.type = 'type=code'
        this.scope = 'in:file'
        this.extension = 'extension%3A.js'
        this.language = 'language:js'
        this.repo = 'repo:jquery/jquery'
        this.user = 'user:organyx'
        this.perPage = 'per_page=25'
        this.sortBy = 'sort: score'
    }
    /**
     * Function to return ready to execute url on given parameters.
     */
    getUrl() {
        return `${this.baseUrl}?${this.query}`
    }
}

class Pagination {
    /**
     * Constructor for Pagination setup.
     * @param {Object[]} hits List of all available Hits.
     * @param {*} currentPage Current page of displayed results. Default is 1.
     * @param {*} perPage Current page limit. Default is 25.
     */
    constructor(hits, currentPage, perPage) {
        this.hits = hits
        this.currentPage = currentPage || 1
        this.perPage = perPage || 25
        this.hitsOut = []
    }

    /**
     * Function to change the page results from current one to the previous one.
     */
    prevPage() {
        if(this.currentPage > 1) {
            this.currentPage--
            this.changePage(this.currentPage)
        }
    }
    /**
     * Function to change the page results from current one to the next one.
     */
    nextPage() {
        if(this.currentPage < this.numPages()) {
            this.currentPage++
            this.changePage(this.currentPage)
        }
    }
    /**
     * Function to change the page for displayed results.
     * @param {*} page Set page for current Hit set.
     */
    changePage(page) {
        if(page < 1) 
            page = 1
        if(page > this.numPages())
            page = this.numPages()
        for(var i = (page - 1) * this.perPage; i < (page * this.perPage); i++ ) {
            this.hitsOut.push(this.hits[i])
        }

        return this.hitsOut
    }
    /**
     * Function to calculate the number of pages based on amount of overall Hits and set page limit.
     */
    numPages() {
        return Math.ceil(this.hits.length / this.perPage)
    }
}

module.exports = { UrlBuilder, Pagination }