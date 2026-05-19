export interface Posts {
  id: "uuid",
  title: "string",
  content: "text", // O texto completo do aviso
  summary: "text", // Resumo gerado automaticamente pela IA
  category: "ENUM", // ['EVENT', 'ACADEMIC', 'INTERNSHIP', 'MAINTENANCE']
  attachment_url: "string", // Link para PDF ou imagem
  author_id: "user_id_fk", // Quem postou (Professor ou Direção)
  reactions: "json", // Ex: { "like": 10, "claps": 5 }
  created_at: "datetime"
}
