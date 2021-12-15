import React, { Component } from "react";
import TimeLockedWallet from "./contracts/TimeLockedWallet.json";
import TimeLockedWalletFactory from "./contracts/TimeLockedWalletFactory.json";
import BiconomyToken from "./contracts/BiconomyToken.json";
import getWeb3 from "./getWeb3";

import { Tabs, Tab, Table } from 'react-bootstrap'

import "./App.css";
import NewWallet from "./components/NewWallet";
import Deposit from "./components/Deposit";
import Claim from "./components/Claim";

class App extends Component {
  state = {
    web3: null,
    web3Eth: null,
    accounts: null,
    walletContract: null,
    walletFactoryContract: null,
    tokenContract: null,
    selectedTab: 'newWallet',
    wallets: {}
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const { web3 } = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      // biconomy.onEvent(biconomy.READY, async () => {

      // const walletDeployedNetwork = TimeLockedWallet.networks[networkId];
      // const wallet = new web3.eth.Contract(
      //   TimeLockedWallet.abi,
      //   walletDeployedNetwork && walletDeployedNetwork.address,
      // );

      // const walletFactoryDeployedNetwork = TimeLockedWalletFactory.networks[networkId];
      // const walletFactory = new web3Eth.eth.Contract(
      //   TimeLockedWalletFactory.abi,
      //   walletFactoryDeployedNetwork && walletFactoryDeployedNetwork.address,
      // );

      // const tokenDeployedNetwork = BiconomyToken.networks[networkId];
      // const tokenContract = new web3Eth.eth.Contract(
      //   BiconomyToken.abi,
      //   tokenDeployedNetwork && tokenDeployedNetwork.address,
      // );

      // // get all previous events
      // const events = await walletFactory.getPastEvents('Created', {
      //   fromBlock: 0,
      //   toBlock: 'latest'
      // })
      // let walletObjs = {}
      // for (let i = 0; i < events.length; i++) {
      //   const { wallet, to } = events[i].returnValues
      //   if (!walletObjs[to])
      //     walletObjs[to] = []
      //   walletObjs[to].push(wallet)
      // }
      // this.setState({
      //   wallets: walletObjs
      // })

      this.setState({ web3, accounts });

      // }).onEvent(biconomy.ERROR, (error, message) => {
      //   // Handle error while initializing mexa
      //   console.log(error)
      // });


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  initCreateWalletForm = async (_receiverAddress, _unlockTime, _initialEth) => {
    const { web3, accounts, walletFactoryContract, wallets } = this.state

    let factory = await walletFactoryContract.methods.newTimeLockedWallet(_receiverAddress, _unlockTime).send({ from: accounts[0], value: web3.utils.toWei(_initialEth.toString(), "ether") })

    const { wallet, to } = factory.events.Created.returnValues;

    // add created wallet in state
    let walletObjs = { ...wallets }
    if (!walletObjs[to])
      walletObjs[to] = []
    walletObjs[to].push(wallet)

    this.setState({
      wallets: walletObjs
    })

  }

  claim = async () => {
    const { web3, accounts, walletContract } = this.state
    const _userAddress = '0x703375a427f7D3126fB4E97A0b8FacB7bD3b4E49';

    const delegatee = '0xC36ff6b5196198fea76f3C733E601A0dCb906804';
    const nonce = 0;
    const expiry = 1738935690;

    let domainData = {
      name: "Safle Token",
      chainId: 42, // Kovan
      // chainId: await web3.eth.net.getId() === 42 ? 42 : 1337, // Kovan
      verifyingContract: "0x0F08152AeCf470f98a258351a1115C7aC809BAA0"
    };

    const domainType = [
      { name: "name", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" }
    ];
    const delegateTransactionType = [
      { name: "delegatee", type: "address" },
      { name: "nonce", type: "uint256" },
      { name: "expiry", type: "uint256" }
    ];

    // const domainType = [
    //   { name: "name", type: "string" },
    //   { name: "version", type: "string" },
    //   { name: "chainId", type: "uint256" },
    //   { name: "verifyingContract", type: "address" }
    // ];
    // const metaTransactionType = [
    //   { name: "nonce", type: "uint256" },
    //   { name: "from", type: "address" }
    // ];

    // walletContract.options.address = _walletAddress;
    // const nonce = await walletContract.methods.nonces(_userAddress).call();

    let message = {
      delegatee: delegatee,
      nonce: nonce,
      expiry: expiry
    };

    const dataToSign = JSON.stringify({
      types: {
        EIP712Domain: domainType,
        Delegation: delegateTransactionType
      },
      domain: domainData,
      primaryType: "Delegation",
      message: message
    });

    web3.currentProvider.sendAsync({
      method: "eth_signTypedData_v4",
      params: [_userAddress, dataToSign],
      from: _userAddress
    }, async (err, result) => {
      if (err) {
        return console.error(err);
      }

      const signature = result.result.substring(2);
      const r = "0x" + signature.substring(0, 64);
      const s = "0x" + signature.substring(64, 128);
      const v = parseInt(signature.substring(128, 130), 16);

      console.log("delegate, nonce, expiry, v, r, s ", delegatee, nonce, expiry, v, r, s);
      // setTimeout(async () => {
      //   let withdraw;
      //   try {

      //     console.log("ACCOUNTS ", accounts)

      //     if (_tokenAddress)
      //       withdraw = await walletContract.methods.withdrawTokens(_tokenAddress, _userAddress, r, s, v).send({ from: accounts[0] })
      //     else
      //       withdraw = await walletContract.methods.withdraw(_userAddress, r, s, v).send({ from: accounts[0] })
      //   } catch (err) {
      //     console.log("ERR ", err)
      //   }
      //   console.log("withdraw ", withdraw)
      //   alert(`Withdawal complete - ${withdraw.transactionHash}`)
      // }, 20000);
    })
  }

  deposit = async (_walletAddress, _amount) => {
    const { web3Eth, accounts } = this.state

    let send = await web3Eth.eth.sendTransaction({ from: accounts[0], to: _walletAddress, value: web3Eth.utils.toWei(_amount, "ether") });
    console.log("send ", send)
  }

  depositToken = async (_tokenAddress, _walletAddress, _amount) => {
    const { accounts, walletContract, tokenContract } = this.state
    tokenContract.options.address = _tokenAddress;
    walletContract.options.address = _walletAddress;

    const decimals = await tokenContract.methods.decimals().call()
    const amountToSend = _amount * 10 ** decimals
    const transfer = await tokenContract.methods.transfer(_walletAddress, amountToSend).send({ from: accounts[0] })
    console.log("transfer ", transfer)

  }

  render() {
    const { wallets } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div id="dapp" className="container" style={{ paddingTop: 30 }}>

          <Tabs defaultActiveKey="newWallet"
            id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="newWallet" title="New Wallet">
              <NewWallet initCreateWalletForm={this.initCreateWalletForm} />
            </Tab>
            <Tab eventKey="depodit" title="Deposit">
              <Deposit deposit={this.deposit} depositToken={this.depositToken} />
            </Tab>
            <Tab eventKey="claim" title="Claim" >
              <Claim claim={this.claim} claimToken={this.claimToken} />
            </Tab>
          </Tabs>

          <div id="created-wallets" className="container border border-success rounded" style={{ marginTop: 15 }}>
            <div className="row bg-success text-white text-sm-center" style={{ paddingTop: 5 }}>
              <div className="col-12">
                <h3>Wallets</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-12 nopadding">
                {/* <table id="wallets-table" className="" style={{ margin: 'auto' }}> */}
                <Table striped bordered hover size="sm">

                  <thead>
                    <tr>
                      <th>To</th>
                      <th>Wallet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      wallets && Object.keys(wallets).length && Object.keys(wallets).map((r) => {
                        return (
                          <tr>
                            <td >
                              <p style={{ margin: 0, padding: 5, wordBreak: 'break-all' }}>{r}</p>
                            </td>
                            <td>
                              {wallets[r] && wallets[r].length && wallets[r].map(z => {
                                return (
                                  <div >
                                    <p style={{ margin: 0, padding: 5, wordBreak: 'break-all' }}>{z}</p>
                                  </div>
                                )
                              })}
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
              </div>
              <button onClick={this.claim}>CLICK TO SIGN</button>
            </div>
          </div>
        </div>

      </div >
    );
  }
}

export default App;
