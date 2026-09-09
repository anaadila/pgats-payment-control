const request = require('supertest')

function login(variables) {
    return request('http://localhost:4000')
                .post('/graphql')
                .send({
                    query: `
                    mutation Login($email: String!, $senha: String!) {
                        login(email: $email, senha: $senha) {
                            token
                        }
                    }`,
                    variables: variables
                })
}

function loginTodosCampos(variables) {
    return request('http://localhost:4000')
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
                    variables: variables
                })
}

module.exports = {
    login,
    loginTodosCampos
}