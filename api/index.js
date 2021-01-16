const yup = require('yup');
const client = require('./client');

const SORTABLE_FIELDS = [
  'Code',
  'Name',
  'SectorName',
  'SubSectorName',
  'Last',
  'AdjustedClosingPrice',
  'PrevClosingPrice',
  'AdjustedOpenPrice',
  'AdjustedHighPrice',
  'AdjustedLowPrice',
  'Per',
  'Pbr',
  'Volume',
  'Value',
  'Frequency',
  'OneDay',
  'OneWeek',
  'OneMonth',
  'ThreeMonth',
  'SixMonth',
  'OneYear',
  'ThreeYear',
  'FiveYear',
  'TenYear',
  'Mtd',
  'Ytd',
  'Capitalization',
  'BetaOneYear',
  'StdevOneYear',
  'LastDate',
];

const validate = async (params) => {
  const schema = yup.object().shape({
    search: yup.string().trim(),
    page: yup.number().positive().integer().default(1),
    per_page: yup.number().positive().integer().default(25),
    sort_by: yup.string().trim().oneOf(SORTABLE_FIELDS).default('Code'),
    sort_direction: yup.string().trim().lowercase().oneOf(['asc', 'desc']).default('asc'),
    index_id: yup.number().positive().integer(),
    sector_id: yup.number().positive().integer(),
    subsector_id: yup.number().positive().integer(),
  });

  await schema.validate(params);

  const data = schema.cast(params);

  return {
    Keywords: data.search,
    pageBegin: data.page,
    pageLength: data.per_page,
    sortField: data.sort_by,
    sortOrder: data.sort_direction.toUpperCase(),
    Index: data.index_id,
    StockSector: data.sector_id,
    StockSubSector: data.subsector_id,
  };
};

const getData = async (params = {}) => {
  const parsedParams = await validate(params);

  try {
    const response = await client.get('/StockSearchResult/GetAll', {
      params: parsedParams,
    });

    return response.data;
  } catch (error) {
    const message = error.response ? error.response.data.message : error.message;

    throw new Error(message);
  }
};

module.exports = async (req, res) => {
  try {
    const data = await getData(req.query);

    return res.json({ data });
  } catch (error) {
    const status = error.name === 'ValidationError' ? 422 : 500;

    return res.status(status).json({ error: error.message });
  }
};