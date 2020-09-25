const httper = require("./httper");

async function get(config, path) {
  const url = `https://api.up.com.au/api/v1/${path}`
  const data = await httper.get(url, {'Authorization': config.upbank.key});
  //const data = await httpGet(url, {'Authorization': config.upbank.key});
  return data;
}

async function getAccount(config, id) {
  const account = await get(config, `/accounts/${id}`);
  return account;
}

module.exports = { get, getAccount };
