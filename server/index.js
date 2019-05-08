var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Transaction {
    address: String
    token: Int
    status: Boolean
  }

  type Query {
    issueToken(address: String, amount: String): Transaction
  }
`);

Trans = require('./trans')

// The root provides the top-level API endpoints
var root = {
  issueToken: function ({
    address
  }) {
    return new Trans(address).create()
  }
}

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
var port = (process.env.PORT || 1337);
var host = (process.env.HOST || '127.0.0.1');
app.listen(port, host);
console.log('Running a GraphQL API server at http://'+ host +':'+port+'/graphql');
