import React, { Component } from 'react'

export default class Claim extends Component {
  state = {
    currency: '0xE',
    walletAddress: '',
    receiverAddress: ''
  }

  claim = e => {
    e.preventDefault()
    const { currency, walletAddress, receiverAddress } = this.state
    if (!currency || currency === '0xE')
      this.props.claim(
        walletAddress.toLowerCase(),
        receiverAddress.toLowerCase()
      )
    else
      this.props.claim(
        walletAddress.toLowerCase(),
        receiverAddress.toLowerCase(),
        currency.toLowerCase()
      )
  }

  setCurrency = e => {
    this.setState({ currency: e.target.value })
  }

  setWalletAddress = e => {
    this.setState({ walletAddress: e.target.value })
  }

  setReceiverAddress = e => {
    this.setState({ receiverAddress: e.target.value })
  }

  render () {
    return (
      <div
        className='container border border-warning  tab-pane show active fade '
        id='claim'
        role='tabpanel'
        aria-labelledby='claim-tab'
        style={{ paddingBottom: 15 }}
      >
        <div
          className='row bg-warning text-white text-sm-center'
          style={{ paddingTop: 5 }}
        >
          <div className='col-12'>
            <h3>Claim Funds Form</h3>
          </div>
        </div>
        <form id='claim-funds-form' onSubmit={this.claim}>
          <div className='row'>
            <div className='col form-group'>
              <label htmlFor='claimWalletAddresses'>
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
            <div className='col form-group'>
              <label htmlFor='receiverAddresses'>Receiver Address (to)</label>
              <input
                id='receiverAddress'
                type='text'
                className='form-control'
                placeholder='Receiver address'
                onChange={e => this.setReceiverAddress(e)}
                required={true}
              />
            </div>
          </div>
          <div className='row'>
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

          <button
            type='submit'
            id='claim-submit-button'
            className='btn btn-warning btn-block text-white'
          >
            Claim Ether/ERC20 Tokens
          </button>
        </form>
      </div>
    )
  }
}
