import * as httphelper from '../utils/http-helper'
import * as repository from '../repository/userRepository'

export const getMyUserService = async () => {
    try {
        const data = await repository.getMyUser()
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const RegisterUserService = async (userData: any) => {
    try {
        const data = await repository.RegisterUser(userData)
        if (data) {
            return await httphelper.created()
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const LoginUserService = async (email: string, password: string) => {
    try {
        const data = await repository.LoginUser(email, password)
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}