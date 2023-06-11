const { uid } = require('uid')
require('dotenv').config();
const fs = require('fs');



const Guest_information = {
    // ID
    id: uid(),
    name: 'Guest',
    username : 'Guest'
}

// append Guest_information in .env file

fs.appendFileSync('.env', `\nGUEST_ID=${Guest_information.id}\nGUEST_NAME=${Guest_information.name}\nGUEST_USERNAME=${Guest_information.username}\n`);






    module.exports = Guest_information
