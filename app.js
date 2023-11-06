const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3000
const app = express()

app.use(bodyParser.json())

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '[Yakys<3]&g_mysql;',
  database: process.env.DB_DATABASE || 'api_test',
  port: process.env.DB_PORT || 3306
})

app.get('/', (req, res) => {
  res.send('<h1>Welcome to my API</h1>')
})

app.get('/todos', (req, res) => {
  const sql = 'SELECT * FROM todos'
  connection.query(sql, (error, response) => {
    if (error) throw error
    if (response.length > 0) {
      res.status(200).json(response)
    } else {
      res.status(404).json({
        "message": "Table empty"
      })
    }
  })
})

app.get('/todo/:id', (req, res) => {
  const { id } = req.params
  const sql = `SELECT * FROM todos WHERE id = ${id}`
  connection.query(sql, (error, response) => {
    if (error) throw error
    if (response.length > 0) {
      res.status(200).json(response[0])
    } else {
      res.status(404).json({
        "message": "Todo not exist"
      })
    }
  })
})

app.post('/todos', (req, res) => {
  const sql = 'INSERT INTO todos SET ?'
  const postTodo = {
    title: req.body.title,
    description: req.body.description,
    status: 'ACTIVO'
  }

  connection.query(sql, postTodo, (error, response) => {
    if (error) throw error
    if (response.affectedRows == 1) {
      res.status(200).json({
        "message": "Todo added"
      })
    } else {
      res.status(404).json({
        "message": "Insert error"
      })
    }
  })
})


app.put('/todo/:id', (req, res) => {
  const { id } = req.params
  const { status } = req.body
  let sql
  if (status) {
    if (status == 'ACTIVO') {
      sql = `UPDATE todos SET status = 'INACTIVO' WHERE id = ${id}`
    } else if (status == 'INACTIVO') {
      sql = `UPDATE todos SET status = 'ACTIVO' WHERE id = ${id}`
    } else if (status == 'COMPLETADO') {
      sql = `UPDATE todos SET status = 'COMPLETADO' WHERE id = ${id}`
    }
  } else {
    const { title, description } = req.body
     sql = `UPDATE todos SET title = '${title}', description = '${description}', status = ${status} WHERE id = ${id}`
  }

  connection.query(sql, (error, response) => {
    if (error) throw error
    if (response.affectedRows == 1) {
      res.status(200).json({
        "message": "Todo update"
      })
    } else {
      res.status(404).json({
        "message": "Updated error"
      })
    }
  })
})

app.delete('/todo/:id', (req, res) => {
  const { id } = req.params
  const sql = `UPDATE todos SET status = 'ELIMINADO' WHERE id = ${id}`

  connection.query(sql, (error, response) => {
    if (error) throw error
    if (response.affectedRows == 1) {
      res.status(200).json({
        "message": "Todo deleted"
      })
    } else {
      res.status(404).json({
        "message": "Deleted error"
      })
    }
  })
})

connection.connect(error => {
  if (error) throw error;
  console.log('Database server running');
})



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
