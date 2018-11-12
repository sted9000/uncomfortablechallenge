window.addEventListener('load', async () => {

    // First see you browser has a web3 injection
    if (typeof web3 === 'undefined') {

        // If not throw error
        $('body').addClass('error-no-metamask-plugin').addClass('error');

    // If yes get the account access
    } else {
        // *** Pattern for sites which need account address access **************
        // // Modern dapp browsers...
        // if (window.ethereum) {
        //
        //     window.web3 = new Web3(ethereum);
        //
        //     try {
        //         // Request account access if needed
        //         await ethereum.enable();
        //         var accountAddressNeeded = true;
        //         checkNetwork(accountAddressNeeded);
        //
        //     } catch (error) {
        //         // throw err message
        //         $('body').addClass('error-no-account-access').addClass('error');
        //     }
        // // Legacy dapp browsers...
        // } else if (window.web3) {
        //     window.web3 = new Web3(web3.currentProvider);
        //
        //     // Call network check
    //         var accountAddressNeeded = true;
        //     checkNetwork(accountAddressNeeded);
        // }
        //*************************************************************************

        // *** Pattern for stites which do NOT need account address access ********
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            var accountAddressNeeded = false
            checkNetwork(accountAddressNeeded);
        }
        else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
            checkNetwork(accountAddressNeeded);
        }

        //**************************************************************************

        // Non-dapp browsers... (no metamask plugin)
        else {
            $('body').addClass('error-no-metamask-plugin').addClass('error');
        }
    }
});

function checkNetwork(_accountAddressNeeded) {

    // Network check; else throw error
    web3.version.getNetwork((err, netId) => {

      switch (netId) {
        case "1":
          console.log('This is mainnet');
          // Case account check
          accountCheck(_accountAddressNeeded);
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
  });
}

function accountCheck(_accountAddressNeeded) {
    window.web3.eth.getAccounts((err, acc) => {

        if (!err) {
            console.log('here in accountcheck');
            console.log('accountAddressNeeded: ' + _accountAddressNeeded);

            if (_accountAddressNeeded) {

                if (acc.length <= 0) {
                    $('body').addClass('error-no-metamask-accounts').addClass('error');

                } else {
                    web3.eth.defaultAccount = web3.eth.accounts[0];
                    console.log("Active account: " + web3.eth.defaultAccount);
                    // Call set abi
                    getLastestBlock();
                }
            }
            else {
                console.log('No account address needed');
                getLastestBlock();
            }

       } else {
          // Terribly wrong error message
       }
   });
}


function getLastestBlock() {

    // get lastest block
    web3.eth.getBlockNumber(function(err, block) {

        console.log("Current Block Number: " + block);
        end_block = block;

        getEvents();
        console.log('web3_starter.js complete');
    });
}


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
