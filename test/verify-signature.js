const { assert, expect } = require('chai')
const chai = require('chai')
chai.use(require('chai-as-promised'))

const VerifySignature = artifacts.require('VerifySignature')

contract('VerifySignature', async (accounts) => {
  const { owner, key } = {
    owner: '0x7c525D67BaF23D51727D4db3f470a37D29166D3D',
    key: '0xfa6969a5b375a47949be76d47cc29b6c384df5ace3ea48e1462eb6997d511169',
  }

  // verify signature should succeed
  it('1. Should verify signature', async () => {
    const amount = 1
    const nonce = Math.round(Math.random(10))

    // Create a SHA3 hash of the message
    const messageHash = web3.utils.soliditySha3(owner, amount, nonce)
    const signature = await web3.eth.accounts.sign(messageHash, key)
    const sigV = signature.v
    const sigR = signature.r
    const sigS = signature.s

    const instance = await VerifySignature.new()
    const res = await instance.verify(owner, amount, nonce, sigV, sigR, sigS)

    const tx = await instance.seenNonces(owner, nonce)
    assert.equal(tx, true)
  })

  it('2. Should reject if signature not verified as owner', async () => {
    const amount = 1
    const nonce = Math.round(Math.random(10))

    // Create a SHA3 hash of the message
    const messageHash = web3.utils.soliditySha3(owner, amount, nonce)
    const signature = await web3.eth.accounts.sign(messageHash, key)
    const sigV = signature.v
    const sigR = signature.r
    const sigS = signature.s

    const instance = await VerifySignature.new()
    
    await expect(instance.verify(accounts[8], amount, nonce, sigV, sigR, sigS)).to.be
      .rejected
  })

  it('3. Should reject if owner repeats nonce', async () => {
    const amount = 1
    const nonce = Math.round(Math.random(10))

    // Create a SHA3 hash of the message
    const messageHash = web3.utils.soliditySha3(owner, amount, nonce)
    const signature = await web3.eth.accounts.sign(messageHash, key)
    const sigV = signature.v
    const sigR = signature.r
    const sigS = signature.s

    const instance = await VerifySignature.new()
    await instance.verify(owner, amount, nonce, sigV, sigR, sigS)

    await expect(instance.verify(owner, amount, nonce, sigV, sigR, sigS)).to.be
      .rejected
  })
})
