-- Script para recriar tabelas do banco de dados SENAI Connect
-- Execute este script para recriar todas as tabelas

-- Drop tabelas existentes
DROP TABLE IF EXISTS reactions CASCADE;
DROP TABLE IF EXISTS links CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS gestores CASCADE;
DROP TABLE IF EXISTS alunos CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Tabela de alunos
CREATE TABLE alunos (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    cpf VARCHAR(20),
    registration VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'STUDENT',
    avatarUrl TEXT,
    course VARCHAR(255),
    gender VARCHAR(20),
    birthdate DATE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de gestores
CREATE TABLE gestores (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    cpf VARCHAR(20),
    registration VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'TEACHER',
    avatarUrl TEXT,
    course VARCHAR(255),
    cargo VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de posts/eventos/comunicados
CREATE TABLE posts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    category VARCHAR(50) NOT NULL,
    visibility TEXT[],
    author_name VARCHAR(255),
    author_id VARCHAR(50),
    reactions JSONB DEFAULT '{"like": 0, "claps": 0}',
    attachmentUrl TEXT,
    imageUrl TEXT DEFAULT 'aviso1.png',
    eventDate DATE,
    location VARCHAR(255) DEFAULT 'SENAI Areias',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de links do mural
CREATE TABLE links (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de reações
CREATE TABLE reactions (
    id SERIAL PRIMARY KEY,
    post_id VARCHAR(50) NOT NULL,
    reactions JSONB DEFAULT '{}',
    user_reactions JSONB DEFAULT '{}',
    UNIQUE(post_id)
);

-- Índices para melhorar performance
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(createdAt);
CREATE INDEX idx_reactions_post ON reactions(post_id);
CREATE INDEX idx_alunos_registration ON alunos(registration);
CREATE INDEX idx_gestores_registration ON gestores(registration);

-- Mensagem de confirmação
DO $$
BEGIN
    RAISE NOTICE 'Tabelas criadas com sucesso!';
END $$;
