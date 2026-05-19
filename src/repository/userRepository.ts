import userJson from '../data/user.json'

// Nota: retorna o usuário logado, ou seja, o usuário que fez login
export const getMyUser = async () => {
    return userJson
}

export const RegisterUser = async (userData: any) => {
    const newUser = {
        id: String(userJson.length + 1),
        name: userData.name,
        email: userData.email,
        registration: userData.registration,
        role: userData.role || 'STUDENT',
        avatarUrl: userData.avatarUrl || '',
        course: userData.course || '',
        createdAt: new Date().toISOString()
    }
    userJson.push(newUser)
    return newUser
}

export const LoginUser = async (email: string, password: string) => {
    const user = userJson.find((u: any) => u.email === email)
    if (!user) {
        throw new Error('User not found')
    }

    return user
    
}