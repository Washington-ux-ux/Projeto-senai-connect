export interface Chat {
  id: "uuid",
  name: "string", // Ex: "Turma 2024 - Dev Sistemas"
  type: "ENUM", // ['PRIVATE', 'GROUP']
  members: "relation" // Muitos para muitos com Users
}