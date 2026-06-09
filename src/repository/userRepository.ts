import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userFilePath = path.join(__dirname, '../data/user.json');

const readUserJson = (): any[] => {
    const data = fs.readFileSync(userFilePath, 'utf-8');
    return JSON.parse(data);
};

const writeUserJson = (data: any[]): void => {
    fs.writeFileSync(userFilePath, JSON.stringify(data, null, 2));
};

export const getMyUser = async (userId: string) => {
    const users = readUserJson();
    const user = users.find((u: any) => u.id === userId)
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
    const users = readUserJson();
    const newUser = {
        id: String(users.length + 1),
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
    users.push(newUser);
    writeUserJson(users);
    return newUser
}

export const LoginUser = async (email: string, password: string) => {
    const users = readUserJson();
    const user: any = users.find((u: any) => u.email === email)
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