import Fastify from 'fastify'
import { Pool } from 'pg'
// Configuração da conexão com o Banco de Dados
const sql = new Pool({
 user: "postgres",
 password: "senai",
 host: "localhost",
 port: 5432,
 database: "cinema_db" // Certifique-se que o banco no pgAdmin tem este nome
})
const servidor = Fastify()
// --- ROTAS DE FILMES ---

// Listar todos os filmes
servidor.get('/filmes', async (request, reply) => {
  const resultado = await sql.query('SELECT * FROM filme')
  return resultado.rows
})

// Criar novo filme
servidor.post('/filmes', async (request, reply) => {
  const { titulo, genero, ano_lancamento } = request.body

  if (!titulo || !genero || !ano_lancamento) {
    return reply.status(400).send({ error: 'Dados do filme inválidos!' })
  }

  await sql.query(
    'INSERT INTO filme (titulo, genero, ano_lancamento) VALUES ($1, $2, $3)',
    [titulo, genero, ano_lancamento]
  )

  return reply.status(201).send({ mensagem: 'Filme cadastrado com sucesso!' })
})

// Editar filme
servidor.put('/filmes/:id', async (request, reply) => {
  const { id } = request.params
  const { titulo, genero, ano_lancamento } = request.body

  const busca = await sql.query('SELECT * FROM filme WHERE id = $1', [id])

  if (busca.rows.length === 0) {
    return reply.status(404).send({ error: 'Filme não encontrado!' })
  }

  await sql.query(
    'UPDATE filme SET titulo = $1, genero = $2, ano_lancamento = $3 WHERE id = $4',
    [titulo, genero, ano_lancamento, id]
  )

  return { mensagem: 'Filme atualizado com sucesso!' }
})

// Deletar filme
servidor.delete('/filmes/:id', async (request, reply) => {
  const { id } = request.params

  const busca = await sql.query('SELECT * FROM filme WHERE id = $1', [id])

  if (busca.rows.length === 0) {
    return reply.status(404).send({ error: 'Filme não encontrado!' })
  }

  await sql.query('DELETE FROM filme WHERE id = $1', [id])

  return reply.status(204).send()
})

servidor.listen({
    port:3000
})