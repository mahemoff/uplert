import getSymbolFromCurrency from 'currency-symbol-map'

export default class Summary {

  constructor(accounts, format) {
    this.accounts = accounts;
    this.format = format.toLowerCase();
  }

  render() {
    switch(this.format) {
      case 'basic':
        return this.accounts.map( (account) => {
          const attribs = account.attributes;
          const symbol = getSymbolFromCurrency(attribs.balance.currencyCode);
          return `${attribs.displayName}: ${attribs.balance.currencyCode} ${symbol}${attribs.balance.value} (${attribs.accountType.toLowerCase()})`
        }).join("\n");
      case 'json':
        return JSON.stringify(this.accounts, null, 2);
      default:
        return `Unknown format ${this.format}`;
    }
  }

}
