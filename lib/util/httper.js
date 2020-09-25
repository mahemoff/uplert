const r2 = require("r2");

module.exports = {

  get: async (url, headers) => {
    try {
      const response = await r2(url, {headers}).json;
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

}
