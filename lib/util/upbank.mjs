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

// attempt at a "smart" lookup which accepts multiple arg types to identify the account (can be low-level ID like 'a81-abb99-oba9' or display name like 'vacation fund'). Defaults to first transactional account.
export async function lookupAccount(config, id) {
  id = id || config?.upBank?.account
  const accounts = await getAccounts(config)
  return accounts.find( (account) => {
    if (id) {
      return (id.toLowerCase()==account?.attributes?.displayName?.toLowerCase() || id==account?.id)
    } else {
      return account?.attributes?.accountType=='TRANSACTIONAL'
    }
  });
}
