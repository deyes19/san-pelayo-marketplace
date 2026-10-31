import espaciosRouter from './routes/espacios.js';
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/espacios', espaciosRouter);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API SportBook funcionando');
});

app.get('/prueba-db', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT NOW()');

    res.json({
      mensaje: 'Conexión con PostgreSQL exitosa',
      fechaServidor: resultado.rows[0].now
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'No se pudo conectar con PostgreSQL'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor funcionando en http://localhost:${PORT}`);
});