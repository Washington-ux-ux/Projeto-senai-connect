import * as repository from "../repository/authRepository"

export const changePasswordService = async (userId: string, currentPassword: string, newPassword: string) => {
    const response = await repository.changePasswordRepository(userId, currentPassword, newPassword)
    return response
}

export const forgotPasswordService = async (email: string, newPassword: string) => {
    const response = await repository.forgotPasswordRepository(email, newPassword)
    return response
}
