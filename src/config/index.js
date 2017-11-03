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
    key: process.env.CLIENT_ID || 'af9b78be587b59df0970',
    secret: process.env.CLIENT_SECRET || '061cd5816547abc0866b9f10cbf88853542a6f4e'
})

export default {
    'port' :  process.env.PORT || 3000,
    'bodyLimit' : '100kb',
    'env' : process.env.NODE_ENV || 'dev',
    'log': (env) => {
        if(env) return log[env]()
        return log[process.env.NODE_ENV || 'development']()
    },
    'gitClient_ID' : process.env.CLIENT_ID || 'af9b78be587b59df0970',
    'gitClient_Secret' : process.env.CLIENT_SECRET || '061cd5816547abc0866b9f10cbf88853542a6f4e',
    'gitAccessToken' : process.env.ACCESS_TOKEN || '7b2c1a19aae7677145941f24df12ba77ea4d5f0b',
    'github' : github
}