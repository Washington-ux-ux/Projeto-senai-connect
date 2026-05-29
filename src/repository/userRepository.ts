import userJson from '../data/user.json'
import * as fs from 'fs'
import * as path from 'path'

// Nota: retorna o usuário logado, ou seja, o usuário que fez login
export const getMyUser = async (userId: string) => {
    const user = userJson.find((u: any) => u.id === userId)
    if (!user) {
        throw new Error('User not found')
    }
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        registration: user.registration,
        role: user.role,
        avatarUrl: user.avatarUrl,
        course: user.course,
        gender: user.gender || 'Não informado',
        birthdate: user.birthdate || '',
        createdAt: user.createdAt
    }
}

export const RegisterUser = async (userData: any) => {
    const newUser = {
        id: String(userJson.length + 1),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        cpf: userData.cpf,
        registration: userData.registration,
        role: userData.role || 'STUDENT',
        avatarUrl: userData.avatarUrl || '',
        course: userData.course || '',
        gender: userData.gender || 'Não informado',
        birthdate: userData.birthdate || '',
        createdAt: new Date().toISOString()
    }
    userJson.push(newUser)
    
    const filePath = path.join(__dirname, '../data/user.json')
    fs.writeFileSync(filePath, JSON.stringify(userJson, null, 2))
    
    return newUser
}

export const LoginUser = async (email: string, password: string) => {
    const user: any = userJson.find((u: any) => u.email === email)
    if (!user) {
        throw new Error('User not found')
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        cpf: user.cpf,
        registration: user.registration,
        role: user.role,
        avatarUrl: user.avatarUrl,
        course: user.course,
        createdAt: user.createdAt
    }
    
}