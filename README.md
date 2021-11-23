# Time Locked Wallets

This is a truffle project for creating a timelock wallet in which any user can create a smart wallet and add funds (ETH and ERC20 tokens) in it.</br>
There is a `walletFactory` contract which will be used to create a wallet and also keep a record of all the wallets linked to the address which will be the owner of the wallet.

Only owner can withdraw funds from the wallet and only after the lock time is passed. 

The withdrawal (claim) functions are meta transactions and thus, the owner needs to sign a message and anybody will be able to send the transaction if they have the valid signed message.

Also, Biconomy is integrated to perform the meta transactions making the whole process much more efficient and user friendly.
