module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true, // Torna possivel saber a data de cada registro: created_at updated_at
    underscored: true, // Padronizacao underscored ('user_groups') inves de camelcase ('UserGroup')
    underscoredAll: true, // transforma em snake_case as colunas do banco
  },
};
