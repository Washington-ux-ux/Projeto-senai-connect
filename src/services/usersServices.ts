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
        const passwordToUse = userData.password || '123321'
        const userDataWithPassword = { ...userData, password: passwordToUse }
        const data = await repository.RegisterUser(userDataWithPassword)
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
        console.log("=== LoginUserService START ===");
        console.log("Input matricula:", matricula, "type:", typeof matricula);
        console.log("Input password:", password, "type:", typeof password);
        
        const user = await repository.LoginUser(matricula, password)
        
        if (!user) {
            console.log("User not found");
            return await httphelper.badRequest({ message: 'User not found' })
        }

        console.log("User found:", user);
        console.log("DB password:", user.password, "type:", typeof user.password);
        console.log("Password comparison - input:", password, "vs db:", user.password);
        console.log("Strict equality:", password === user.password);
        console.log("Trim comparison:", password.trim() === user.password.trim());

        const isPasswordValid = password === user.password
        
        if (!isPasswordValid) {
            console.log("Password validation FAILED");
            return await httphelper.badRequest({ message: 'Invalid password' })
        }

        console.log("Password validation SUCCESS");
        console.log("Generating token with user.id:", user.id, "user.matricula:", user.matricula, "user.role:", user.role);
        const token = auth.generateToken(user.id, user.matricula, user.role)
        console.log("Token generated successfully");
        return await httphelper.ok({
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                matricula: user.matricula
            },
            token
        })
    } catch (error) {
        console.error("LoginUserService error:", error)
        return await httphelper.badRequest()
    }
}