// $(window).ready(async function() {
//
//     var isMetamastInstalled = isInstalled()
//
//     console.log(isMetamastInstalled ? "yes" : "no");
//
//     await isInstalled2()
// })

const SMART_CONTRACT_ADDR = "0x692a70D2e424a56D2C6C27aA97D1a86395877b3A"
const ABI_URL = "/abi.json"

$(document).ready(async function() {
    const web3 = getWeb3()
    if (web3 == null) {
        console.log("ERROR: couldn't connect to ");
        return
    }

    const contract = await setupContract(web3, SMART_CONTRACT_ADDR)

    web3MethodsButton.addEventListener('click', async function() {

        // Call method
        contract.getHistory(function(err, data) {
            console.log(err, data)
        })


        // Send transactions
        // contract.postMessage("Hello", function(err, txHash) {
        //     console.log(err, txHash)
        //     if (err) {
        //         const msg = "There was an error while publishing your message".
        //         displayAlert(msg)
        //     } else {
        //         const txUrl = "https://ropsten.etherscan.io/tx/" + txHash;
        //         window.open(txUrl, '_blank');
        //     }
        // })

    })


})

function displayAlert(msg) {
    window.alert(msg)
}

function getWeb3() {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        return window.web3
    } else if (window.web3) {
        // Legacy dapp browsers...
        window.web3 = new Web3(web3.currentProvider);
        return window.web3
    } else {
        // Non-dapp browsers...
        const msg = "ETHernal requires Metamask in order to work, and this is only available on Chrome..."
        displayAlert(msg)
    }

    return null
}

async function connectMetamask(web3) {
    try {
        // Request account access if needed
        const accounts = await ethereum.enable()
        console.log("Accounts:", accounts);
        return window.web3
    } catch (error) {
        // User denied account access...
        console.log(error.message);

        const msg = "You need to authorize ETHernal to connect to your Metamask!"
        displayAlert(msg)
    }

    return null
}

async function setupContract(web3, addr) {
    try {
        const json = await $.getJSON(ABI_URL)
        console.log(json);
        const contract = web3.eth.contract(json)
        return contract.at(addr)
    } catch (error) {
        console.log("ERROR: couldn't get ABI");
        return
    }
}
