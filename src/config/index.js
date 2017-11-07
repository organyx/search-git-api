import bunyan from 'bunyan'

const log = {
    development: () => {
        return bunyan.createLogger({ name: 'Search-API_development', level: 'debug' })
    },
    production: () => {
        return bunyan.createLogger({ name: 'Search-API_production', level: 'info' })
    },
    test: () => {
        return bunyan.createLogger({ name: 'Search-API_test', level: 'fatal' })
    }
}

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
    'gitAccessToken' : process.env.ACCESS_TOKEN
}