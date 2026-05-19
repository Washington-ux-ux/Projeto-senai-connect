export interface Requests {
  id: "uuid",
  protocol: "string", // Ex: SENAI-2024-X821
  subject: "string", // Assunto
  description: "text",
  status: "ENUM", // ['SENT', 'ANALYZING', 'RESPONDED', 'FINISHED']
  student_id: "user_id_fk",
  response_content: "text", // Resposta da direção
  scheduled_at: "datetime", // Caso marque reunião
  created_at: "datetime"
}