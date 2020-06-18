require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true, // Torna possivel saber a data de cada registro: created_at updated_at
    underscored: true, // Padronizacao underscored ('user_groups') inves de camelcase ('UserGroup')
    underscoredAll: true, // transforma em snake_case as colunas do banco
  },
};
