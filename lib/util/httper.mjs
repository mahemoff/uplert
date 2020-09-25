import r2 from 'r2';

export async function get(url, headers) {
  try {
    const response = await r2(url, {headers}).json;
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
