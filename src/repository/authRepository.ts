import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFilePath = path.join(__dirname, '../../src/data/user.json');

export const changePasswordRepository = async (userId: string, currentPassword: string, newPassword: string) => {
    try {
        if (!fs.existsSync(usersFilePath)) {
            return {
                statusCode: 500,
                body: { error: 'Arquivo de usuários não encontrado' }
            }
        }

        const usersData = fs.readFileSync(usersFilePath, 'utf-8')
        const users = JSON.parse(usersData)

        const userIndex = users.findIndex((user: any) => user.id === userId)

        if (userIndex === -1) {
            return {
                statusCode: 404,
                body: { error: 'Usuário não encontrado' }
            }
        }

        const user = users[userIndex]
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

        if (!isPasswordValid) {
            return {
                statusCode: 401,
                body: { error: 'Senha atual incorreta' }
            }
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10)
        users[userIndex].password = hashedNewPassword

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))

        return {
            statusCode: 200,
            body: { message: 'Senha alterada com sucesso' }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: { error: 'Erro ao alterar senha' }
        }
    }
}

export const forgotPasswordRepository = async (email: string, newPassword: string) => {
    try {
        if (!fs.existsSync(usersFilePath)) {
            return {
                statusCode: 500,
                body: { error: 'Arquivo de usuários não encontrado' }
            }
        }

        const usersData = fs.readFileSync(usersFilePath, 'utf-8')
        const users = JSON.parse(usersData)

        const userIndex = users.findIndex((u: any) => u.email === email)

        if (userIndex === -1) {
            return {
                statusCode: 404,
                body: { error: 'Email não encontrado' }
            }
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10)
        users[userIndex].password = hashedNewPassword

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))

        return {
            statusCode: 200,
            body: { message: 'Senha alterada com sucesso!' }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: { error: 'Erro ao processar solicitação' }
        }
    }
}
