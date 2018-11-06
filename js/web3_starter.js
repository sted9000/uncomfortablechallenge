// Find connection; else throw error
window.addEventListener('load', function() {

  // First
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 === 'undefined') {

    // Throw error
    $('body').addClass('error-no-metamask-plugin').addClass('error');

  } else {
      // Use Mist/MetaMask's provider
      console.log('Web3 provider found');
      web3 = new Web3(web3.currentProvider);
  }

    // Second
    // Network check; else throw error
    web3.version.getNetwork((err, netId) => {

      switch (netId) {
        case "1":
          console.log('This is mainnet');
          // Not throw error message and screen
          break
        case "2":
          console.log('This is the deprecated Morden test network.');
          $('body').addClass('error-invalid-network').addClass('error');
          break
        case "3":
          console.log('This is the ropsten test network.');
          $('body').addClass('error-invalid-network').addClass('error');
          break
        case "4":
          console.log('This is the Rinkeby test network.');
          $('body').addClass('error-invalid-network').addClass('error');
          break
        case "42":
          console.log('This is the Kovan test network.');
          $('body').addClass('error-invalid-network').addClass('error');
          break
        default:
          console.log('This is an unknown network.');
          $('body').addClass('error-invalid-network').addClass('error');
      }

       // Third
       // User has an account
       web3.eth.getAccounts((err, acc) => {
           if (!err) {

               if (acc.length <= 0) {
                   $('body').addClass('error-no-metamask-accounts').addClass('error');
               } else {
                   web3.eth.defaultAccount = web3.eth.accounts[0];
                   console.log("Active account: " + web3.eth.defaultAccount);

                   // get lastest block
                   web3.eth.getBlockNumber(function(err, block) {

                       end_block = block;

                       getEvents();
                       console.log('here is web3-start');
                   })


               }



         } else {
             console.error(err);
         }
     });
    });
});

// Factory abi
var factoryABI = web3.eth.contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "_category",
				"type": "uint256"
			},
			{
				"name": "_description",
				"type": "string"
			},
			{
				"name": "_result",
				"type": "string"
			}
		],
		"name": "newChallenge",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_poster",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_category",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_description",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_result",
				"type": "string"
			}
		],
		"name": "Challenge",
		"type": "event"
	}
]);

// Factory address
var factoryAddress = '0x7f9dc102ce264cbc07b6c23dbded84e451d4d910'; // Mainnet Factory Address

// Web3 object
var factoryInstance = factoryABI.at(factoryAddress);
