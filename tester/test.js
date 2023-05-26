// const { createECDH, createHash, } = require('node:crypto');
  
//   const alice = createECDH('secp256k1');
//   const bob = createECDH('secp256k1');
  
//   // This is a shortcut way of specifying one of Alice's previous private
//   // keys. It would be unwise to use such a predictable private key in a real
//   // application.
//   alice.setPrivateKey(createHash('sha256').update('alice', 'utf8').digest(),);
  
//   // Bob uses a newly generated cryptographically strong
//   // pseudorandom key pair
//   bob.generateKeys();
  
//   const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
//   const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');
  
//   // aliceSecret and bobSecret should be the same shared secret value
//   console.log(aliceSecret === bobSecret);

//   var salt = crypto.randomBytes(16);
//   var password = 'password123'
//   var encryptedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
//   var iv = crypto.randomBytes(16);
//   var cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptedPassword, 'hex'), iv);
//   var encrypted = cipher.update('some clear text data', 'utf8', 'hex');
//   encrypted += cipher.final('hex');


// //   https://nodejs.org/api/crypto.html#class-hash



// const crypto = require('node:crypto');

// function hashPassword(password) {
//   return crypto.createHash('sha256').update(password).digest('hex');
// }

// const hashedPassword = hashPassword('myPlaintextPassword');
// console.log(hashedPassword);



const db = require('../models');

(async () => {
  try {
    const cart = await db.Cart.create({
      created_at: new Date(),
      updated_at: new Date(),
      user_id: 1   // Replace with the user ID if applicable
    });

    console.log('Cart created:', cart);
  } catch (error) {
    console.error('Error creating cart:', error);
  } finally {
    db.sequelize.close();
  }
})();

