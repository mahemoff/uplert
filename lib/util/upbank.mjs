import * as httper from '../util/httper.mjs';

export async function get(config, path) {
  const url = `https://api.up.com.au/api/v1/${path}`
  const data = await httper.get(url, {'Authorization': config.upbank.key});
  return data;
}

// gets first transactional account (there will probably be only one)
export async function getTransactionalAccount(config, path) {
  const accounts = await getAccounts(config)
  return accounts.filter(account => account?.attributes?.accountType=='TRANSACTIONAL')[0]
}

export async function getAccount(config, id) {
  const account = await get(config, `/accounts/${id}`);
  return account;
}

export async function getAccounts(config) {
  const account = await get(config, `/accounts`);
  return account;
}
