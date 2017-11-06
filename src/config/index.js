import bunyan from 'bunyan'
import GitHubApi from 'github'

const log = {
    development: () => {
        return bunyan.createLogger({ name: 'AleksTheDev_development', level: 'debug' })
    },
    production: () => {
        return bunyan.createLogger({ name: 'AleksTheDev-production', level: 'info' })
    },
    test: () => {
        return bunyan.createLogger({ name: 'AleksTheDev-test', level: 'fatal' })
    }
}

const github = new GitHubApi({
    debug: true,
    host: 'api.github.com',
    protocol: 'https'
})

github.authenticate({
    type: 'oauth',
    key: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
})

export default {
    'port' :  process.env.PORT || 3000,
    'bodyLimit' : '100kb',
    'env' : process.env.NODE_ENV || 'dev',
    'log': (env) => {
        if(env) return log[env]()
        return log[process.env.NODE_ENV || 'development']()
    },
    'gitClient_ID' : process.env.CLIENT_ID,
    'gitClient_Secret' : process.env.CLIENT_SECRET,
    'gitAccessToken' : process.env.ACCESS_TOKEN,
    'github' : github
}