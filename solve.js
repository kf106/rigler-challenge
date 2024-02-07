const { ethers } = require('ethers')

// function returning legacy Bitcoin address from ECDSA private key
function publicToBitcoinLegacy (pub, tpgo = false) {
  const hash1 = ethers.utils.sha256(pub)
  const hash2 = ethers.utils.ripemd160(hash1)
  const nwbytes = '0x00' + hash2.slice(2)
  const hash3 = ethers.utils.sha256(nwbytes)
  const hash4 = ethers.utils.sha256(hash3)
  const chksum = hash4.slice(2, 10)
  const final = nwbytes + chksum
  const base58Addr = ethers.utils.base58.encode(final)

  if (tpgo === true) {
    // print out TP's Go Bitcoin Test format results
    // see https://gobittest.appspot.com/Address
    console.log()
    console.log('0 - Private ECDSA key: <redacted>')
    console.log('1 - Public ECDSA key: ' + pub)
    console.log('2 - SHA256 hash of 1: ' + hash1)
    console.log('3 - RIPEMD160 hash of 2: ' + hash2)
    console.log('4 - Adding network bytes to 3: ' + nwbytes)
    console.log('5 - SHA256 hash of 4: ' + hash3)
    console.log('6 - SHA256 hash of 5: ' + hash3)
    console.log('7 - First four bytes of 6: ' + chksum)
    console.log('8 - Adding 7 at the end of 4: ' + final)
    console.log('9 - Base58 encoding of 8: ' + base58Addr)
    console.log()
  }

  return base58Addr
}

// sign Bitcoin address with private key following EIP-191
async function main () {
  // generate a private key
  const addr = await ethers.Wallet.createRandom()
  // get Bitcoin address of private key
  const btcAddr = publicToBitcoinLegacy(addr.publicKey)

  // sign Bitcoin address with private key
  const signature = await addr.signMessage(btcAddr)
  // also get hash that was signed
  const hashMsg = ethers.utils.hashMessage(btcAddr)

  console.log('Private key: ' + addr.privateKey)
  console.log('Public key: ' + addr.publicKey)
  console.log('Bitcoin address: ' + btcAddr)
  console.log('Hash message signed: ' + hashMsg)
  console.log('Signature of Bitcoin address: ' + signature)

  // recover ECDSA public key using only Bitcoin address and signature
  const recoveredPubKey = ethers.utils.recoverPublicKey(hashMsg, signature)
  console.log('Recovered public key: ' + recoveredPubKey)
  // generate Bitcoin address from recovered public key
  const genBtcAddr = publicToBitcoinLegacy(recoveredPubKey)
  console.log('Recovered Bitcoin address: ' + genBtcAddr)
}

main()

/*

const message = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("1CsWiZVv7kUs4P2eTpbN4NLHDkVqhuALQj"))

const signatureb64 = "IDHGmGgp/ccov1CKl2nIuj6ZdLQD7IhmHWwgNQUnhPidf+HRbNgPizCZZ/6CtQhQh0Xh3A4hsWwDUdazW2VPmwY="

let sigBytes = ethers.utils.base64.decode(signatureb64)

//  sigBytes[64] = 1

// signature element

const signature = ethers.utils.splitSignature(sigBytes)

console.log(signature)

const publicKey = ethers.utils.recoverPublicKey(message, signature)
*/
