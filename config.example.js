
const db_name = "reddit-alerts";
const db_uri  = `mongodb://localhost/${db_name}`;


module.exports = {
    email: {
        user: 'email@exmaple.com',
        pass: 'password123?'
    },
    session: {
        secret: 'secret_string'
    },
    MONGO_URI: db_uri,
    MONGO_OPTIONS: {
        production: {
            useMongoClient: true,
            autoIndex: false, // Don't build indexes
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            poolSize: 10, // Maintain up to 10 socket connections
            bufferMaxEntries: 0
        },
        local: {
            /* none */
        }
    },
    PORT: 9002
}
