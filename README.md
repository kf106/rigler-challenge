# John Rigler Signed Address Challenge

Back in early January 2024, John Rigler set a challenge to verify that a Bitcoin address signed with the ECDSA  private key that the address was derived from, was truly signed by that key.

Using only vanilla Javascript and ethers.js

## Solution

I decided to use ethers.js version 5.7, because I don't like the way they moved all the functions around into different modules when they upgraded to version 6.x

One of the problems with Ethereum signing libraries is that they won't just let you sign any old random thing. This is to prevent tricking you into signing a transaction that transfers all your NFTs and ERC20s to a scammer.

And so the ERC-191 signed data standard is used, which prefixes anything to sign with `"\x19Ethereum Signed Message:\n" + len(message)`.

Check `solve.js` for sample code that demonstrates:

1. deriving a Bitcoin legacy address from an ECDSA private key
2. produces a signature of that address
3. verifies that the public ECDSA address extracted from the signature derives the initial address
