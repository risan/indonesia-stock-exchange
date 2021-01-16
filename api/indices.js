const client = require('./client');

const BASE_URL = `${process.env.VERCEL_ENV === 'development' ? 'http://' : 'https://'}${process.env.VERCEL_URL}`;

module.exports = async (req, res) => {
  try {
    const response = await client.get('/Stock/GetIndexFilters');

    const data = response.data.map((i, idx) => ({
      id: i.Id,
      name: i.Name,
      stocks_url: `${BASE_URL}/api?index_id=${i.Id}`,
    }));

    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};