const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3050
const app = express()

app.use(bodyParser.json())

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test_api'
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
    description: req.body.description
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
  const { title, description } = req.body
  const sql = `UPDATE todos SET title = '${title}', description = '${description}' WHERE id = ${id}`

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
  const sql = `DELETE FROM todos WHERE id = ${id}`

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