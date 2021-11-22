import React, { Component } from 'react'

export default class NewWallet extends Component {
  state = {
    initialEth: 0,
    receiverAddress: '',
    unlockTime: ''
  }

  initCreateWalletForm = async e => {
    e.preventDefault()
    const { unlockTime, receiverAddress, initialEth } = this.state
    await this.props.initCreateWalletForm(
      receiverAddress.toLowerCase(),
      unlockTime,
      initialEth
    )
  }

  setInitialEth = e => {
    this.setState({ initialEth: e.target.value })
  }

  setReceiverAddress = e => {
    this.setState({ receiverAddress: e.target.value })
  }

  setUnlockTime = e => {
    this.setState({ unlockTime: new Date(e.target.value).getTime() / 1000 })
  }

  render () {
    return (
      <div
        className='container border border-primary tab-pane fade show active'
        style={{ paddingBottom: 15 }}
      >
        <div
          className='row bg-primary text-white text-sm-center '
          style={{ paddingTop: 5 }}
        >
          <div className='col-12'>
            <h3>Create Wallet Contract Form</h3>
          </div>
        </div>
        <form id='create-wallet-form' onSubmit={this.initCreateWalletForm}>
          <div className='row'>
            <div className='col form-group'>
              <label htmlFor='ethereumAddress'>Receiver Address</label>
              <input
                id='ethereumAddress'
                type='text'
                className='form-control'
                placeholder='Reciever eth address'
                onChange={e => this.setReceiverAddress(e)}
                required={true}
              />
            </div>
            <div className='col form-group'>
              <label htmlFor='unlockDate'>Unlock Time (UTC)</label>
              <input
                id='unlockDate'
                type='datetime-local'
                className='form-control'
                onChange={e => this.setUnlockTime(e)}
                required={true}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col form-group'>
              <label htmlFor='etherAmount'>Optional Ether Amount</label>
              <input
                id='etherAmount'
                type='number'
                min='0'
                step='0.001'
                className='form-control'
                placeholder='ETH amount'
                onChange={e => this.setInitialEth(e)}
                required={false}
              />
            </div>
          </div>
          <button
            type='submit'
            className='btn btn-primary btn-block text-white'
          >
            Create Wallet
          </button>
        </form>
      </div>
    )
  }
}
