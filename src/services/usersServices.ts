import * as httphelper from '../utils/http-helper'
import * as repository from '../repository/userRepository'
import * as auth from '../utils/auth'

export const getMyUserService = async (userId: string) => {
    try {
        const data = await repository.getMyUser(userId)
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
        const hashedPassword = await auth.hashPassword(userData.password)
        const userDataWithHash = { ...userData, password: hashedPassword }
        const data = await repository.RegisterUser(userDataWithHash)
        if (data) {
            return await httphelper.created(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const LoginUserService = async (matricula: string, password: string) => {
    try {
        const user = await repository.LoginUser(matricula, password)
        if (!user) {
            return await httphelper.badRequest({ message: 'User not found' })
        }

        const isPasswordValid = await auth.comparePassword(password, user.password)
        if (!isPasswordValid) {
            return await httphelper.badRequest({ message: 'Invalid password' })
        }

        const token = auth.generateToken(user.id, user.email, user.role)
        return await httphelper.ok({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatarUrl: user.avatarUrl,
                course: user.course,
                matricula: user.matricula
            },
            token
        })
    } catch (error) {
        return await httphelper.badRequest()
    }
}