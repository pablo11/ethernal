const SMART_CONTRACT_ADDR = "0x5205d148d750f1759c3a1ee689fe9989c78761a3"
const ABI_URL = "/abi.json"

var currentMsgs = []

$(document).ready(async function() {

    // Connect to the nodes
    const web3 = getWeb3()
    if (web3 == null) {
        console.log("ERROR: couldn't connect to ");
        return
    }

    const contract = await setupContract(web3, SMART_CONTRACT_ADDR)

    // Load history
    getAndDisplayHistory(contract)
    setInterval(() => {
        getAndDisplayHistory(contract)
    }, 2000)


    //getAndDisplayMsg(contract, "1")

    $("#msg").on('keyup', async (e) => {
        if (e.keyCode === 13) {
            const input = document.getElementById("msg")
            const text = input.value
            if (text == undefined || text == null || text == "") {
                displayAlert("You need to provide a non-empty")
                return
            }

            _ = await connectMetamask(web3)

            const typeSelector = document.getElementById("dropdownMenuButton")
            const type = typeSelector.innerHTML
            var msg = text
            if (type.toUpperCase() != "PERSONALIZED") {
                msg = type + " " + text
            }

            input.value = ""

            contract.postMessage(text, function(err, txHash) {
                console.log(err, txHash)
                if (err) {
                    const msg = "There was an error while publishing your message".
                    displayAlert(msg)
                } else {

                    displayWaitingTx(txHash)

                    // const txUrl = "https://ropsten.etherscan.io/tx/" + txHash;
                    // window.open(txUrl, '_blank');

                    waitTx(web3, txHash, (success) => {
                        document.getElementById("alert-" + txHash).remove()
                        if (!success) {
                            displayAlert("There was a problem adding your message to the blockchain 😩")
                        } else {
                            scrollToPosts()
                        }
                    })
                }
            })

        }
    });
})

function scrollToPosts() {
    $('html, body').animate({
        scrollTop: $('#services').offset().top
    }, 1000);
}

function displayWaitingTx(txHash) {
    const txUrl = "https://ropsten.etherscan.io/tx/" + txHash;
    var alertBox = `
    <div class="alert alert-success" style="position:fixed; bottom:20px; right:20px;" id="alert-` + txHash + `">
        <style>
        .addingToBlockchainMsg {
            float: left;
        }

        .loader {
            float: left;
            border: 4px solid #155724;
            border-top: 4px solid #d4edda;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 2s linear infinite;
            margin-right: 1.25rem;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        </style>
        <div class="loader"></div>
        <div class="addingToBlockchainMsg">
            Your messgage is beeing added to the blockchain.<br>
            <a href="` + txUrl + `" target="_blank">See transaction on etherscan.io</a>
        </div>
    </div>
    `

    $('body').append(alertBox)

}

function getAndDisplayHistory(contract) {
    contract.getHistory(function(err, data) {
        if (err) {
            displayResults(null)
        } else {
            var msgs = data.split("\n").filter((msg) => { return msg != "" }).map(parseMsg)
            msgs = msgs.sort((a, b) => parseInt(b.ts) - parseInt(a.ts))
            displayResults(msgs)
        }
    })
}

function getAndDisplayMsg(contract, id) {
    contract.getMessageById(id, function(err, data) {
        if (err) {
            console.log(err)
        } else {
            var msg = parseMsg(data)
            console.log(msg)
        }
    })
}

function parseMsg(rawMsg) {
    var splitted = rawMsg.split(" ")

    var text = splitted.slice(2, splitted.length).join(" ")

    return {
        id: splitted[0],
        ts: splitted[1],
        text: text
    }
}

function formatTimestamp(ts) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const d = new Date(ts * 1000);

    return monthNames[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear() + ", " + d.getHours() + ":" + d.getMinutes()
}

function displayResults(msgs) {
    if (msgs == null) {
        return
    }

    if (msgs.length != currentMsgs.length) {
        currentMsgs = msgs

        const resultsContiner = document.getElementById("posts")
        const content = msgs.reduce((acc, msg, i) => {
            var duration = 1 + 0.1 * i
            var newPost = `
                <div class="col-md-12 col-lg-10 offset-lg-1 wow bounceInUp" data-wow-duration="` + duration + `s">
                    <div class="box">
                        <div class="icon"><i class="ion-ios-analytics-outline" style="color: #ff689b;"></i></div>
                        <h4 class="title"><a href="https://ethernal.5w155.ch/msg.html?id=` + msg.id + `">` + msg.text + `</a></h4>
                        <p class="description">` + formatTimestamp(msg.ts) + `</p>
                    </div>
                </div>
            `

            return acc + newPost
        }, "")

        resultsContiner.innerHTML = content

    }

}

function displayAlert(msg) {
    var alertBox = `
    <div class="alert alert-danger alert-dismissible" style="position:fixed; bottom:20px; right:20px;">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <strong>Error!</strong><br>` + msg + `<br>
    </div>
    `

    $('body').append(alertBox)
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
        const msg = "ethernal requires Metamask in order to work,<br> and this is only available on Chrome..."
        displayAlert(msg)
    }

    return null
}

async function connectMetamask(web3) {
    try {
        // Request account access if needed
        const accounts = await ethereum.enable()
        console.log("Accounts:", accounts);
    } catch (error) {
        // User denied account access...
        console.log(error.message);

        const msg = "You need to authorize ethernal to connect to your Metamask!"
        displayAlert(msg)
    }
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

function waitTx(web3, txHash, callback) {
    var blockCounter = 15;
    // Wait for tx to be finished
    var filter = web3.eth.filter('latest').watch(function(err, blockHash) {
        if (err || blockCounter <= 0) {
            filter.stopWatching()
            callback(false)
        }
        // Get info about latest Ethereum block
        web3.eth.getBlock(blockHash, (err, block) => {
            if (err) {
                filter.stopWatching()
                callback(false)
            }

            --blockCounter;
            if (block.transactions.indexOf(txHash) > -1) {
                filter.stopWatching();
                callback(true)
            } else {
                // console.log('Waiting tx..', blockCounter);
            }
        });
    });
};
