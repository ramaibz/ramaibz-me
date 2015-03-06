module.exports = {
  development: {
    db: 'mongodb://localhost/ramaibz-me'
  },
  production: {
    db: 'mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/'
  }
}
