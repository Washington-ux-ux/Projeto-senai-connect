import pool from '../config/database';

export const getMyUser = async (userMatricula: string) => {
  console.log("=== getMyUser called ===");
  console.log("userMatricula received:", userMatricula, "type:", typeof userMatricula);
  
  let result = await pool.query(
    'SELECT id, name, registration as "matricula", role FROM alunos WHERE registration = $1',
    [userMatricula]
  );
  console.log("Alunos query result:", result.rows.length, "rows");
  if (result.rows.length > 0) {
    console.log("Aluno found:", result.rows[0]);
  }
  
  if (result.rows.length === 0) {
    result = await pool.query(
      'SELECT id, name, registration as "matricula", role, cargo FROM gestores WHERE registration = $1',
      [userMatricula]
    );
    console.log("Gestores query result:", result.rows.length, "rows");
    if (result.rows.length > 0) {
      console.log("Gestor found:", result.rows[0]);
    }
  }
  
  if (result.rows.length === 0) {
    console.log("User not found for matricula:", userMatricula);
    throw new Error('User not found');
  }
  
  console.log("Returning user:", result.rows[0]);
  return result.rows[0];
}

export const RegisterUser = async (userData: any) => {
  const role = userData.role || 'STUDENT';
  const tableName = role === 'STUDENT' ? 'alunos' : 'gestores';
  
  if (role === 'STUDENT') {
    const result = await pool.query(
      `INSERT INTO alunos (id, name, registration, role, password, createdat)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userData.id,
        userData.name,
        userData.registration,
        role,
        userData.password,
        new Date().toISOString()
      ]
    );
    return result.rows[0];
  } else {
    const result = await pool.query(
      `INSERT INTO gestores (id, name, registration, role, cargo, password, createdat)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        userData.id,
        userData.name,
        userData.registration,
        role,
        userData.cargo || null,
        userData.password,
        new Date().toISOString()
      ]
    );
    return result.rows[0];
  }
}

export const LoginUser = async (matricula: string, password: string) => {
  console.log("LoginUser called with matricula:", matricula);
  
  let result = await pool.query(
    'SELECT id, name, registration as "matricula", role, password FROM alunos WHERE registration = $1',
    [matricula]
  );
  console.log("Aluno query result:", result.rows.length, "rows");

  if (result.rows.length === 0) {
    result = await pool.query(
      'SELECT id, name, registration as "matricula", role, password FROM gestores WHERE registration = $1',
      [matricula]
    );
    console.log("Gestor query result:", result.rows.length, "rows");
  }
  
  if (result.rows.length === 0) {
    console.log("User not found for matricula:", matricula);
    throw new Error('User not found');
  }

  console.log("User found:", result.rows[0]);
  return result.rows[0];
}