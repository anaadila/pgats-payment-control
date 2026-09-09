const request = require('supertest')
const { expect } = require('chai')

describe('Mutation - Login', () => {

    it('Deve realizar login com sucesso quando informo credenciais válidas', async () => {
        const resposta = await request('http://localhost:4000')
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

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.login).to.have.property('token')
        expect(resposta.body.data.login.token).to.not.be.empty
        expect(resposta.body.data.login.token).to.include('eyJhbGciOiJIUzI1NiIsInR5cCI6Ik')
    })

    it('Deve fornecer token, email, id, nome e ativo na resposta', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `
                mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                        token
                        usuario {
                            email,
                            id,
                            nome,
                            ativo
                        }
                    }
                }`,
                variables: {
                    email: "admin@admin.com",
                    senha: "123456"
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.login).to.have.property('token')
        expect(resposta.body.data.login.token).to.not.be.empty
        expect(resposta.body.data.login.token).to.include('eyJhbGciOiJIUzI1NiIsInR5cCI6Ik')

        expect(resposta.body.data.login).to.have.property('usuario')
        expect(resposta.body.data.login.usuario).to.not.be.empty

        expect(resposta.body.data.login.usuario).to.have.property('email')
        expect(resposta.body.data.login.usuario.email).to.equals('admin@admin.com')

        expect(resposta.body.data.login.usuario).to.have.property('id')
        expect(resposta.body.data.login.usuario.id).to.equals('00000000-0000-4000-8000-000000000001')

        expect(resposta.body.data.login.usuario).to.have.property('nome')
        expect(resposta.body.data.login.usuario.nome).to.equals('ADMIN')

        expect(resposta.body.data.login.usuario).to.have.property('ativo')
        expect(resposta.body.data.login.usuario.ativo).to.equals(true)

    })

    it('Não deve realizar login quando informo credenciais inválidas', async () => {
        const resposta = await request('http://localhost:4000')
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
                    senha: "senhaInvalida"
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.equal('Credenciais inválidas ou usuário inativo.')
    })

    it('Não deve realizar login quando informo email inválido', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `
                mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                        token
                    }
                }`,
                variables: {
                    email: "emailInvalido",
                    senha: "123456"
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.equal('Credenciais inválidas ou usuário inativo.')
    })

    it('Não deve realizar login quando informo email vazio', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `
                mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                        token
                    }
                }`,
                variables: {
                    email: "",
                    senha: "123456"
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.equal('Credenciais inválidas ou usuário inativo.')
    })

    it('Não deve realizar login quando informo senha vazia', async () => {
        const resposta = await request('http://localhost:4000')
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
                    senha: ""
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.equal('Credenciais inválidas ou usuário inativo.')
    })

    it('Não deve realizar login quando não envio email', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `
                mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                        token
                    }
                }`,
                variables: {
                    senha: "123456"
                }
            })

        expect(resposta.status).to.equal(400)
        expect(resposta.body.errors[0].message).to.equal('Variable \"$email\" of required type \"String!\" was not provided.')
    })

    it('Não deve realizar login quando não envio senha', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `
                mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                        token
                    }
                }`,
                variables: {
                    email: "admin@admin.com"
                }
            })

        expect(resposta.status).to.equal(400)
        expect(resposta.body.errors[0].message).to.equal('Variable \"$senha\" of required type \"String!\" was not provided.')
    })

    it('Não deve realizar login quando informo credenciais inativas', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `
                mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                        token
                    }
                }`,
                variables: {
                    email: "inativa@inativa.com",
                    senha: "123456"
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.equal('Credenciais inválidas ou usuário inativo.')
    })

})