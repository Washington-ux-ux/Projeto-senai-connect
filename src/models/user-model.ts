export interface User{
  id: "uuid", // Identificador único
  name: "string",
  email: "string", // Unique
  password: "string", // Hash criptografado (bcrypt)
  cpf: "string",
  registration: "string", // Matrícula SENAI
  role: "ENUM", // ['STUDENT', 'TEACHER', 'COORDINATOR', 'DIRECTOR', 'ADMIN']
  avatar_url: "string", // Foto de perfil
  course_id: "id_fk", // Relacionamento com o curso
  created_at: "datetime"
}