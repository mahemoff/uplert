const r2 = require("r2");
const url = `https://api.up.com.au/api/v1/accounts/${process.env.UP_ACCOUNT_ID}`
let headers = {'Authorization': process.env.UP_KEY}
let minBalance = 200;

const getData = async url => {
  try {
    const response = await r2(url, {headers}).json;
    let balance = response.data.attributes.balance.value;
    console.log ( `Balance ${(balance < minBalance) ? 'low!' : 'OK'}` );
  } catch (error) {
    console.log(error);
  }
};

getData(url);
