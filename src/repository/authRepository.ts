import pool from '../config/database';
import bcrypt from 'bcrypt';

export const changePasswordRepository = async (userId: string, currentPassword: string, newPassword: string) => {
    try {
        // Buscar usuário na tabela alunos
        let result = await pool.query(
            'SELECT id, name, registration as "matricula", role, password FROM alunos WHERE id = $1',
            [userId]
        );

        // Se não encontrar, buscar na tabela gestores
        if (result.rows.length === 0) {
            result = await pool.query(
                'SELECT id, name, registration as "matricula", role, password FROM gestores WHERE id = $1',
                [userId]
            );
        }

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                body: { error: 'Usuário não encontrado' }
            }
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return {
                statusCode: 401,
                body: { error: 'Senha atual incorreta' }
            }
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const tableName = user.role === 'STUDENT' ? 'alunos' : 'gestores';

        await pool.query(
            `UPDATE ${tableName} SET password = $1 WHERE id = $2`,
            [hashedNewPassword, userId]
        );

        return {
            statusCode: 200,
            body: { message: 'Senha alterada com sucesso' }
        }
    } catch (error: any) {
        console.error('Erro ao alterar senha:', error);
        return {
            statusCode: 500,
            body: { error: 'Erro ao alterar senha' }
        }
    }
}

export const forgotPasswordRepository = async (matricula: string, newPassword: string) => {
    try {
        // Buscar usuário na tabela alunos
        let result = await pool.query(
            'SELECT id, name, registration as "matricula", role FROM alunos WHERE registration = $1',
            [matricula]
        );

        // Se não encontrar, buscar na tabela gestores
        if (result.rows.length === 0) {
            result = await pool.query(
                'SELECT id, name, registration as "matricula", role FROM gestores WHERE registration = $1',
                [matricula]
            );
        }

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                body: { error: 'Matrícula não encontrada' }
            }
        }

        const user = result.rows[0];
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const tableName = user.role === 'STUDENT' ? 'alunos' : 'gestores';

        await pool.query(
            `UPDATE ${tableName} SET password = $1 WHERE registration = $2`,
            [hashedNewPassword, matricula]
        );

        return {
            statusCode: 200,
            body: { message: 'Senha alterada com sucesso!' }
        }
    } catch (error: any) {
        console.error('Erro ao processar solicitação:', error);
        return {
            statusCode: 500,
            body: { error: 'Erro ao processar solicitação' }
        }
    }
}
