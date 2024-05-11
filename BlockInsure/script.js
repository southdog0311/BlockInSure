$(document).ready(function(){
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // Set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }

    async function printPostsToConsole() {

        //取得帳號
        coinbase = await web3.eth.getCoinbase();

        //取得帳號餘額
        var balance = await web3.eth.getBalance(coinbase);
        console.log(`coinbase: ${coinbase}`);
        console.log(`balance: ${web3.utils.fromWei(balance)}`);
        $(".user-info").eq(0).text(coinbase)
        $(".user-info").eq(1).text(`${web3.utils.fromWei(balance)} ETH`)

        var contract_address = "0x13df0790aD7A9A3242F8E4b1b950331BB56f6098";
        var contract_abi = [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "policyId",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "carOwner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "claimAmount",
                        "type": "uint256"
                    }
                ],
                "name": "ClaimFiled",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_policyId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_claimAmount",
                        "type": "uint256"
                    }
                ],
                "name": "fileClaim",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "policyId",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "carOwner",
                        "type": "address"
                    }
                ],
                "name": "PolicyExpired",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "policyId",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "carOwner",
                        "type": "address"
                    }
                ],
                "name": "PolicyPurchased",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "policyId",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "carOwner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "PremiumPaid",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_policyId",
                        "type": "uint256"
                    }
                ],
                "name": "processPremiumPayment",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_premiumAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_coverageAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_durationInMonths",
                        "type": "uint256"
                    }
                ],
                "name": "purchaseInsurance",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "stateMutability": "payable",
                "type": "receive"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "policies",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "policyId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "carOwner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "premiumAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "coverageAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "purchaseTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expirationTimestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isClaimed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isPremiumPaid",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "policyCounter",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];
        myContract = new web3.eth.Contract(contract_abi, contract_address);

        //取得合約餘額
        balance_contract = await web3.eth.getBalance(contract_address);
        balance_contract = web3.utils.fromWei(balance_contract)
        //$("#total_balance").text(web3.utils.fromWei(balance_contract));
        console.log(`contract balance: ${balance_contract}`);
        $(".user-info").eq(2).text(contract_address)
        $(".user-info").eq(3).text(`${balance_contract} ETH`)
        // 先給定有幾張現成的保單ID (下拉選單用)
        num_insurances = await myContract.methods.policyCounter().call();
        for(let i=0; i<num_insurances; i++){
            $("#floatingSelect").append(`<option value="${i}">${i}</option>`);
            $("#processSelect").append(`<option value="${i}">${i}</option>`);
            $("#fileClaimSelect").append(`<option value="${i}">${i}</option>`)
        }
    };
    printPostsToConsole();

    $("#purchaseInsurance").click(function(){
        console.log($("#premiumAmount").val(), $("#coverageAmount").val(),  $("#durationInMonths").val());
        premiumAmount = $("#premiumAmount").val()
        coverageAmount = $("#coverageAmount").val()
        durationInMonths = $("#durationInMonths").val()
        myContract.methods.purchaseInsurance(premiumAmount, coverageAmount, durationInMonths).send({from: coinbase,}).then(function(receipt){
            location.reload();
        });
    })

    $("#processPremiumPayment").click( async function(){
        policyid = $("#processSelect :selected").text();
        insurancePay = $("#insurancePay").val();
        policy = await myContract.methods.policies(policyid).call();
        insurance_require_premium = policy[2];
        if(insurance_require_premium != insurancePay){ // 判斷保險費是否等於當初投保的金額
            console.log(`錢應該要等於 ${insurance_require_premium}`);
            //alert(`錢應該要等於 ${insurance_require_premium}`);
            $(".modal-body").text(`錢應該要等於 ${insurance_require_premium}`); 
            $("#alertBtn").click();
        } else{
            myContract.methods.processPremiumPayment(policyid).send({from: coinbase, value: insurancePay}).then(function(receipt){
                location.reload();
            });
        }
    })

    $("#fileClaim").click(async function(){
        policyid = $("#fileClaimSelect :selected").text();
        claimAmount = $("#claimAmount").val();
        curOwner = await web3.eth.getCoinbase();
        policy = await myContract.methods.policies(policyid).call();
        policyOwner = policy[1].toLowerCase();
        if(policyOwner != curOwner){ // 如果不是本人出險 (保單擁有者 != 網站目前使用者)
            console.log("你不是保單擁有者");
            $(".modal-body").text("你不是此保單擁有者"); 
            $("#alertBtn").click();
        } else if(policy[6]){ // 已出險
            console.log("已出險");
            $(".modal-body").text("你已經出險過了喔");
            $("#alertBtn").click();
        } else if($.now()/1000 >= policy[5]){ // 已經超過保險時間
            $(".modal-body").text("已經超過保險時間");
            $("#alertBtn").click();
        } else if(!policy[7]){ // 還沒繳保險費
            console.log("還沒繳保險費");
            $(".modal-body").text("你還沒繳保險費欸，還想出險"); 
            $("#alertBtn").click();
        } else if(claimAmount > parseInt(policy[3])){
            console.log("超過了給予的保險金額");
            $(".modal-body").text("超過了給予的保險金額"); 
            $("#alertBtn").click();
        } else{
            myContract.methods.fileClaim(policyid, claimAmount).send({from: coinbase,}).then(function(receipt){
                location.reload();
            });
        }
    })

    $("#floatingSelect").change(async function(){
        if(this.selectedIndex == 0) return
        insurance_id = $("#floatingSelect").val()
        console.log(`有人點選保單ID: ${$("#floatingSelect").val()}`);
        
        policy = await myContract.methods.policies(insurance_id).call();
        console.log(policy);
        policy[4] = timestamp_to_string(policy[4]);
        policy[5] = timestamp_to_string(policy[5]);
        $(".table > tbody > tr > td").each(function(index, element){
            $(element).text(policy[index+1])
        })
    })

    function timestamp_to_string(timestamp){
        // Assuming you have a Unix timestamp in seconds
        var unixTimestamp = timestamp; // Replace with your actual timestamp
        // Convert the Unix timestamp to milliseconds (required by JavaScript Date)
        var timestampInMilliseconds = unixTimestamp * 1000;
        // Create a new Date object with the timestamp in milliseconds
        var date = new Date(timestampInMilliseconds);
        // Format the date to a human-readable string (you can adjust the format as needed)
        var humanReadableString = date.toLocaleString(); 
        console.log(humanReadableString);
        return humanReadableString
    }
});

