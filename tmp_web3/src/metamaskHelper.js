function isInstalled() {
    if (typeof web3 !== 'undefined'){
        console.log('MetaMask is installed')
    } else {
        console.log('MetaMask is not installed')
    }
}

function isLocked() {
    web3.eth.getAccounts(function(err, accounts){
        if (err != null) {
            console.log(err)
        } else if (accounts.length === 0) {
            console.log('MetaMask is locked')
        } else {
            console.log('MetaMask is unlocked')
        }
    });
}

function checkBalance() {
    tokenInst.balanceOf(
        web3.eth.accounts[0],
        function (error, result) {
            if (!error && result) {
                var balance = result.c[0];
                if (balance < balanceNeeded * (100000000)) {
                    console.log('MetaMask shows insufficient balance')
                    return false;
                }
                console.log('MetaMask shows sufficient balance')
                // Include here your transaction function here
            } else {
                console.error(error);
            }
            return false;
        }
    );
}

tokenInst.approve(
    addrHOLD,
    truePlanCost,
    gasPrice: web3.toWei('50', 'gwei') }, 
    function (error, result) {
        if (!error && result) {
            var data;
            console.log('approval sent to network');

            var url = 'https://etherscan.io/tx/' + result;
            var link = '<a href=\"" +
            url +
            "\" target=\"_blank\">View Transaction</a>';
            console.log('Waiting for approval ...');

            data = {
                txhash: result,
                account_type: selectedPlanId,
                txtype: 1, // Approval
            };
            apiService(data, '/transaction/create/', 'POST')
            .done(function (response) {
                location.href = response.tx_url;
            });
        }
        else {
            console.error(error);
            console.log('You reject the transaction');
        }
    }
);
