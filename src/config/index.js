import bunyan from 'bunyan'

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

export default {
    'port' :  process.env.PORT || 3000,
    'bodyLimit' : '100kb',
    'env' : process.env.NODE_ENV || 'dev',
    'log': (env) => {
        if(env) return log[env]()
        return log[process.env.NODE_ENV || 'development']()
    },
    'gitClient_ID' : process.env.CLIENT_ID || 'f5ec97973b3d62c9f8de',
    'gitClient_Secret' : process.env.CLIENT_SECRET || 'f3821e1ef9c060b0057a88112a4b538321c11854'
}