import * as repository from "../repository/authRepository"

export const changePasswordService = async (userId: string, currentPassword: string, newPassword: string) => {
    const response = await repository.changePasswordRepository(userId, currentPassword, newPassword)
    return response
}

export const forgotPasswordService = async (matricula: string, newPassword: string) => {
    const response = await repository.forgotPasswordRepository(matricula, newPassword)
    return response
}
