const fs = require('fs');
let rawdata = fs.readFileSync(__dirname + '/accounts.json');
let accounts = JSON.parse(rawdata);

function mergeAccounts(baseAccount, compareAccount) {
    let mergedEmails = [...new Set([...baseAccount.emails, ...compareAccount.emails])];

    if(typeof baseAccount.application === 'number') {
        baseAccount.application = [baseAccount.application];
    }
    if(typeof compareAccount.application === 'number') {
        compareAccount.application = [compareAccount.application]
    }

    let mergedApplications = [...baseAccount.application, ...compareAccount.application]
    return {application: mergedApplications, emails: mergedEmails};
}

//get the account we want to be as our base
for (let i = 0; i < accounts.length; i++) {
    let baseAccount = accounts[i];
    
    //compare the base account with every other account
    for (let j = 0; j < accounts.length; j++) {
        let hit = false;
        let compareAccount = accounts[j];

        if(i === j) {
            continue;
        }

        //loop through the compareAccount's emails
        if(!baseAccount.skip && !compareAccount.skip) {
            for (let k = 0; k < accounts[j].emails.length; k++) {
                if(baseAccount.emails.includes(compareAccount.emails[k])){
                    hit = true;
                }
            }
        }

        //do the merge
        if(hit === true) {
            const {emails, application} = mergeAccounts(baseAccount, compareAccount);
            baseAccount.emails = emails;
            baseAccount.application = application;

            compareAccount.skip = true; //add a skip marker to accounts already merged
        }
    }
}

//filter out the non-merged accounts
let people = accounts.filter(account => !account.skip)

console.log(JSON.stringify(people));