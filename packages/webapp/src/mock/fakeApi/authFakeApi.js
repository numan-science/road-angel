import { Response } from 'miragejs'
import uniqueId from 'lodash/uniqueId'
import isEmpty from 'lodash/isEmpty'

export default function authFakeApi (server, API_PREFIX) {
    
    server.post(`${API_PREFIX}/sign-in`, (schema, {requestBody}) => {
        const { userName, password } = JSON.parse(requestBody)
        const user = schema.db.signInUserData.findBy({ accountUserName: userName, password })
        if (user) {
            const { avatar, userName, email, authority } = user
            return {
                user: { avatar, userName, email, authority },
                token: 'wVYrxaeNa9OxdnULvde1Au5m5w63'
            }
        }
        return new Response(401, { some: 'header' }, { message: `userName: admin | password: 123Qwe` })
    })

    server.post(`${API_PREFIX}/sign-out`, () => {
        return true
    })

    server.post(`${API_PREFIX}/sign-up`, (schema, {requestBody}) => {
        const { userName, password, email } = JSON.parse(requestBody)
        const userExist = schema.db.signInUserData.findBy({ accountUserName: userName })
        const emailUsed = schema.db.signInUserData.findBy({ email })
        const newUser = {
            avatar: '/img/avatars/thumb-1.jpg',
            userName,
            email,
            authority: ['admin', 'user'],
        }
        if (!isEmpty(userExist)) {
            const errors = [
                {message: '', domain: "global", reason: "invalid"}
            ]
            return new Response(400, { some: 'header' }, { errors, message: 'User already exist!' })
        } 

        if (!isEmpty(emailUsed)) {
            const errors = [
                {message: '', domain: "global", reason: "invalid"}
            ]
            return new Response(400, { some: 'header' }, { errors, message: 'Email already used' })
        } 

        schema.db.signInUserData.insert({...newUser, ...{id: uniqueId('user_'), password, accountUserName: userName}})
        return {
            user: newUser,
            token: 'wVYrxaeNa9OxdnULvde1Au5m5w63'
        }
    })

    server.post(`${API_PREFIX}/forgot-password`, () => {
        return true
    })

    server.post(`${API_PREFIX}/reset-password`, () => {
        return true
    })
}