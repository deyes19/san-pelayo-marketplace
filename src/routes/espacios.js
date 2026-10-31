import express from 'express';
import { pool } from '../db.js';

const router = express.Router();


// READ - Consultar todos los espacios
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM espacios ORDER BY id'
    );

    res.json(resultado.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error al consultar los espacios'
    });
  }
});


// CREATE - Crear un espacio
router.post('/', async (req, res) => {
  try {
    const { nombre, tipo, capacidad, estado } = req.body;

    const resultado = await pool.query(
      `INSERT INTO espacios
       (nombre, tipo, capacidad, estado)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombre, tipo, capacidad, estado]
    );

    res.status(201).json({
      mensaje: 'Espacio creado correctamente',
      espacio: resultado.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error al crear el espacio'
    });
  }
});


// UPDATE - Actualizar un espacio
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      tipo,
      capacidad,
      estado
    } = req.body;

    const resultado = await pool.query(
      `UPDATE espacios
       SET nombre = $1,
           tipo = $2,
           capacidad = $3,
           estado = $4
       WHERE id = $5
       RETURNING *`,
      [
        nombre,
        tipo,
        capacidad,
        estado,
        id
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: 'Espacio no encontrado'
      });
    }

    res.json({
      mensaje: 'Espacio actualizado correctamente',
      espacio: resultado.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error al actualizar el espacio'
    });
  }
});


// DELETE - Eliminar un espacio
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `DELETE FROM espacios
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: 'Espacio no encontrado'
      });
    }

    res.json({
      mensaje: 'Espacio eliminado correctamente',
      espacio: resultado.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error al eliminar el espacio'
    });
  }
});


export default router;