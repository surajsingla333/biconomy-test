import React, { Component } from 'react'

export default class Deposit extends Component {
  state = {
    currency: '0xE',
    walletAddress: '',
    amount: 0
  }

  deposit = async e => {
    e.preventDefault()
    const { currency, walletAddress, amount } = this.state

    if (!currency || currency === '0xE')
      await this.props.deposit(walletAddress.toLowerCase(), amount)
    else
      await this.props.depositToken(
        currency.toLowerCase(),
        walletAddress.toLowerCase(),
        amount
      )
  }

  setCurrency = e => {
    this.setState({ currency: e.target.value })
  }

  setWalletAddress = e => {
    this.setState({ walletAddress: e.target.value })
  }

  setAmount = e => {
    this.setState({ amount: e.target.value })
  }

  render () {
    return (
      <div
        className='container active border border-danger tab-pane fade show active'
        style={{ paddingBottom: 15 }}
      >
        <div
          className='row bg-danger text-white text-sm-center'
          style={{ paddingTop: 5 }}
        >
          <div className='col-12'>
            <h3>Deposit in Wallet Form</h3>
          </div>
        </div>
        <form id='deposti-wallet-form' onSubmit={this.deposit}>
          <div className='row'>
            <div className='col form-group'>
              <label htmlFor='sendWalletAddresses'>
                Wallet Contract Address
              </label>
              <input
                id='walletAddress'
                type='text'
                className='form-control'
                placeholder='Wallet address'
                onChange={e => this.setWalletAddress(e)}
                required={true}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col form-group'>
              <label htmlFor='amount'>Amount</label>
              <input
                id='amount'
                type='number'
                min='0'
                step='0.00001'
                className='form-control'
                placeholder='Currency amount'
                onChange={e => this.setAmount(e)}
                required={true}
              />
            </div>
            <div className='col form-group'>
              <label htmlFor='claimableCurrency'>Currency</label>
              <input
                id='receiverAddress'
                type='text'
                className='form-control'
                placeholder='Eth address: "0xE" [default] or token address'
                onChange={e => this.setCurrency(e)}
                required={true}
              />
            </div>
          </div>
          <button type='submit' className='btn btn-danger btn-block text-white'>
            Deposit Ether/ERC20 Tokens
          </button>
        </form>
      </div>
    )
  }
}
