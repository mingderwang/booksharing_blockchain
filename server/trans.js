var axios = require('axios')
var sendTokens = require('./sendtokens')

class Trans {
  constructor (address) {
    this.address = address
  }
  async create () {
    var result = await actionTransation(this.address)
    return result
  }
}

async function actionTransation (userAddress) {
  let result = {
    number: null,
    blockHash: null
  }
  sendTokens(userAddress)
  result = {
    token: 1,
    address: userAddress,
    status: true
  }
  return result
}

module.exports = Trans
