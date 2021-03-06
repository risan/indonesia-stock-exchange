const client = require('./client');

const getSubsectors = async sectorId => {
  const response = await client.get('/StockSubSector/GetSubSectorFromSector', {
    params: { sectorId },
  });

  return response.data;
};

module.exports = async (req, res) => {
  try {
    const response = await client.get('/StockSector/GetAll');

    const subSectors = await Promise.all(response.data.map(i => getSubsectors(i.Id)));

    const data = response.data.map((sector, idx) => ({
      id: sector.Id,
      name: sector.Name,
      stocks_url: `https://indonesia-stock-exchange.vercel.app/api?sector_id=${sector.Id}`,
      subsectors: subSectors[idx].map(subsector => ({
        id: subsector.Id,
        name: subsector.Name,
        stocks_url: `https://indonesia-stock-exchange.vercel.app/api?subsector_id=${subsector.Id}`,
      })),
    }));

    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};