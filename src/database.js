/** Banco em memória. Os dados são perdidos quando a aplicação reinicia. */
module.exports = {
  // Senha inicial: 123456 (armazenada exclusivamente como hash bcrypt).
  usuarios: [{
    id: '00000000-0000-4000-8000-000000000001',
    email: 'admin@admin.com',
    senha: '$2a$10$xtqV3Pqp1ZK.lrKv3i5Piee/mk4ajBGh0MPV/NR7m9GILQErHw5gW',
    nome: 'ADMIN',
    ativo: true
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    email: 'inativo@inativo.com',
    senha: '$2a$10$xtqV3Pqp1ZK.lrKv3i5Piee/mk4ajBGh0MPV/NR7m9GILQErHw5gW',
    nome: 'Inativo',
    ativo: false
  }],
  funcionarios: [{
    id: "00000000-0000-4000-8000-000000000003",
    cpf: "123425167",
    nome: "Joao",
    salario_base: 10000,
    admissao: "2028-08-08",
    desligamento: null
  }],
  processamentos: [],
  historicosFuncionarios: []
};
