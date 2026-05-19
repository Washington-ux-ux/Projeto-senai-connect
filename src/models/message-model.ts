export interface Message {
  id: "uuid",
  room_id: "room_id_fk",
  sender_id: "user_id_fk",
  content: "text",
  file_url: "string",
  is_pinned: "boolean", // Mensagem fixada
  created_at: "datetime"

}