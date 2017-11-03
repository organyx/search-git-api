module.exports = class urlConstructor {

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

    getUrl() {
        return `${this.baseUrl}?${this.query}`
    }
}