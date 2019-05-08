var Web3 = require('web3')
var Tx = require('ethereumjs-tx')

// 使用 infura.io rinkeby test net
var web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/d86510acd23942b68c9e2057291cd7e6'
  )
)
var privateKey =
  '18CD85207759BAAB0ECDBE0ECB668E4E2CA94057E5BC2C175C60BBD47272EE6D'
var addr = '0x5b781f44D45091feED513b585047142Ec3F1aB29'
var contractAddress = '0x6a86ee9373c16ae44022e6dafda62d300e4efc0b' // b: 合約位址
var networkID = 4 // 3 for Ropsten testnet, 4 for rinkeby testnet

// 使用 local node 或 Ganache
/*
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
var privateKey = 'd9ef9547adb9232212d69cb9d98e20a42bac852760b0c988febe82286126055e'
var addr = '0xd4918E4AE64c45Df81E16518fE8A56f4205aD358'
var contractAddress = '0x66cf5F40Fb8EA433A7dDc88c6E9B5b9b2DBDE8A2'
var networkID = 5777 // 3 for Ropsten testnet, 4 for rinkeby testnet, 5777 for local node
*/

// 使用 infura.io 的 ropsten testnet
/*
var web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://ropsten.infura.io/v3/d86510acd23942b68c9e2057291cd7e6'
  )
)
var privateKey =
  '4FC219DF930DA10F6D9F36988948BEBFDBB670514AF14287174D7AFE55F959E9'
var addr = '0x5842d94A698d625857993859ac5b380dC3e5C3eA'
var contractAddress = '0xCB7792819565E11c34B77D5b881d3e541cF1F68b'
*/

var nonce = '' // 每次 transaction 會加 1
var value = web3.utils.toWei('0.001', 'ether')
var gasPrice = web3.utils.toHex(web3.utils.toWei('1', 'gwei')) // '0x4A817C800' = 0.00000002 Ether (20 Gwei) // or get with web3.eth.gasPrice
var gasLimit = web3.utils.toHex('21000') // '0x5208' = 21,000

// contract abi
var abi = [
  {
    constant: false,
    inputs: [
      {
        name: 'from',
        type: 'address'
      },
      {
        name: 'to',
        type: 'address'
      }
    ],
    name: 'transfer_by_owner',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'success',
        type: 'bool'
      }
    ],
    name: 'AACalled',
    type: 'event'
  }
]

var sendTokens = function sendTokens (userAddress) {
  console.log('web3 version:' + web3.version)
  console.log('userAddress: ' + userAddress)
  web3.eth.net.getId(function (err, res) {
    console.log('Net: ' + res)
  })
  web3.eth.net.getNetworkType(function (err, res) {
    console.log('getNetworkType: ' + res)
  })
  web3.eth.getBlockNumber(function (error, result) {
    console.log('Block Number: ' + result)
  })

  web3.eth.getGasPrice().then(result => {
    gasPrice = web3.utils.toHex(result)
    console.log('gasPrice: ' + gasPrice) // 0x3b9aca00

    web3.eth.getTransactionCount(addr).then(_nonce => {
      nonce = '0x' + _nonce.toString(16)
      console.log(nonce)

      const myContractInstance = new web3.eth.Contract(
        abi,
        contractAddress, // contract address
        {
          defaultAccount: addr, // default from address
          defaultGasPrice: gasPrice // default gas price in wei, 1 gwei in this case
        }
      )

      let tx_builder = myContractInstance.methods.transfer_by_owner(
        addr,
        userAddress
      )
      let encoded_tx = tx_builder.encodeABI()

      var rawTransaction = {
        from: addr,
        nonce: nonce,
        gasPrice: gasPrice,
        gas: 4712388, // TODO 可能不要寫死比較好. 看你 contract function 所需耗掉的 gas, 目前這數字夠用
        to: contractAddress,
        data: encoded_tx,
        chainId: networkID
      }

      var privKey = new Buffer.from(privateKey, 'hex')
      var tx = new Tx(rawTransaction)
      tx.sign(privKey)
      var serializedTx = tx.serialize()
      console.log(serializedTx)
      var data = '0x' + serializedTx.toString('hex')

      web3.eth.sendSignedTransaction(data).then(console.log) // 很慢才會有回音, 

      // TOD 未來可以加 filter
      /*
        var filter = myContractInstance.myEvent({a: 5}, function (error, result) {
            if (!error)
        console.log(result);
   */
    })
  })
}

module.exports = sendTokens
