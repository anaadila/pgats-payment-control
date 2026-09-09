const request = require('supertest')
const { expect } = require('chai')

describe('Mutation - Criar Funcionário', () => {

    before(async () => {
        const respostaToken = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `
                mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                        token
                    }
                }`,
                variables: {
                    email: "admin@admin.com",
                    senha: "123456"
                }
            })

        expect(respostaToken.status).to.equal(200)
        expect(respostaToken.body.data.login).to.have.property('token')
        token = respostaToken.body.data.login.token
    })

    it.only('Deve criar um funcionário quando preencho os campos obrigatórios de forma válida', async () => {

        let cpf = Date.now()

        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `
            mutation CriarFuncionario($input: CriarFuncionarioInput!) {
            criarFuncionario(input: $input) {
                id
                cpf
                nome
                salario_base
                admissao
                }
            }`,
                variables: {
                    input: {
                        cpf: `${cpf}`,
                        nome: "Ana Ádila",
                        salario_base: 10000.00,
                        admissao: "2026-08-08"
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.criarFuncionario).to.have.property('id')
        expect(resposta.body.data.criarFuncionario.id).to.not.be.empty
    })

    it.only('Deve criar um funcionário quando preencho todos os campos de forma válida', async () => {

        let cpf = Date.now()

        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `
            mutation CriarFuncionario($input: CriarFuncionarioInput!) {
            criarFuncionario(input: $input) {
                id
                cpf
                nome
                salario_base
                admissao
                desligamento
                }
            }`,
                variables: {
                    input: {
                        cpf: `${cpf}`,
                        nome: "Joao",
                        salario_base: 10000.00,
                        admissao: "2026-08-08",
                        desligamento: "2026-10-08"
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.criarFuncionario).to.have.property('id')
        expect(resposta.body.data.criarFuncionario.id).to.not.be.empty
        expect(resposta.body.data.criarFuncionario).to.have.property('desligamento')
    })

    it.only('Não deve criar um funcionário quando enviar um salário negativo', async () => {

        let cpf = Date.now()

        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `
            mutation CriarFuncionario($input: CriarFuncionarioInput!) {
            criarFuncionario(input: $input) {
                id
                cpf
                nome
                salario_base
                admissao
                }
            }`,
                variables: {
                    input: {
                        cpf: `${cpf}`,
                        nome: "Joao",
                        salario_base: -10000.00,
                        admissao: "2026-08-08"
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.equal('Salário base não pode ser negativo.')
    })

    it.only('Não deve criar um funcionário quando não envio o campo cpf', async () => {
        
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `
            mutation CriarFuncionario($input: CriarFuncionarioInput!) {
            criarFuncionario(input: $input) {
                id
                cpf
                nome
                salario_base
                admissao
                }
            }`,
                variables: {
                    input: {
                        nome: "Joao",
                        salario_base: 10000.00,
                        admissao: "2026-08-08"
                    }
                }
            })

        expect(resposta.status).to.equal(400)
        expect(resposta.body.errors[0].message).to.include('Field \"cpf\" of required type \"String!\" was not provided.')
    })

    it.only('Não deve criar um funcionário quando envio o campo cpf vazio', async () => {

        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `
            mutation CriarFuncionario($input: CriarFuncionarioInput!) {
            criarFuncionario(input: $input) {
                id
                cpf
                nome
                salario_base
                admissao
                }
            }`,
                variables: {
                    input: {
                        cpf: '',
                        nome: "Joao",
                        salario_base: 10000.00,
                        admissao: "2026-08-08",
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.equals('CPF, nome, salário base e admissão são obrigatórios.')
    })

    it.only('Não deve criar um funcionário quando data de desligamento é anterior a data de admissão', async () => {

        let cpf = Date.now()

        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `
            mutation CriarFuncionario($input: CriarFuncionarioInput!) {
            criarFuncionario(input: $input) {
                id
                cpf
                nome
                salario_base
                admissao
                desligamento
                }
            }`,
                variables: {
                    input: {
                        cpf: `${cpf}`,
                        nome: "Joao",
                        salario_base: 10000.00,
                        admissao: "2026-08-08",
                        desligamento: "2026-07-08"
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.equals('Desligamento não pode ser anterior à admissão.')
    })

    it.only('Não deve criar um funcionário já existente', async () => {

        let cpf = Date.now()

        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `
            mutation CriarFuncionario($input: CriarFuncionarioInput!) {
            criarFuncionario(input: $input) {
                id
                cpf
                nome
                salario_base
                admissao
                }
            }`,
                variables: {
                    input: {
                        cpf: '123425167',
                        nome: "joao",
                        salario_base: 10000.00,
                        admissao: "2026-08-08"
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.equals('Já existe funcionário com este CPF.')
    })
})