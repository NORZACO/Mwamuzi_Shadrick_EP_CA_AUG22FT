const axios = require('axios');
const db = require('./models')




let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'http://143.42.108.232:8888/items/stock',
  headers: { }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
