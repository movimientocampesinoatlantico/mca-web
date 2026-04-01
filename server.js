const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY existe:', !!process.env.SUPABASE_KEY);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/registro', async (req, res) => {
  const { nombre, siglas, nit, municipio, nivel, tipo,
          representante, cedula, telefono, email, afiliados, motivacion,
          acepta_tratamiento_datos } = req.body;

  if (!nombre || !municipio || !nivel || !representante || !cedula || !telefono || !email) {
    return res.status(400).json({ ok: false, mensaje: 'Faltan campos obligatorios' });
  }

  if (acepta_tratamiento_datos !== true) {
    return res.status(400).json({ ok: false, mensaje: 'Debes aceptar el tratamiento de datos' });
  }

  const { data, error } = await supabase
    .from('asociaciones')
    .insert([{ nombre, siglas, nit, municipio, nivel, tipo,
               representante, cedula, telefono, email,
               afiliados: afiliados ? parseInt(afiliados) : null,
               motivacion,
               acepta_tratamiento_datos }])
    .select();

  if (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ ok: false, mensaje: 'Error al guardar' });
  }

  console.log('✅ Registrada:', nombre, '-', municipio);
  return res.status(201).json({ ok: true, mensaje: 'Asociación registrada', id: data[0].id });
});

app.get('/api/registros', async (req, res) => {
  if (req.query.clave !== 'mca2025admin') {
    return res.status(401).json({ ok: false, mensaje: 'No autorizado' });
  }
  const { data, error } = await supabase
    .from('asociaciones')
    .select('*')
    .order('fecha_registro', { ascending: false });

  if (error) return res.status(500).json({ ok: false });
  return res.json({ ok: true, total: data.length, asociaciones: data });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('');
  console.log('🌿 ══════════════════════════════════════════');
  console.log('🌿  Movimiento Campesino del Atlántico');
  console.log('🌿  Servidor corriendo: http://localhost:3000');
  console.log('🌿 ══════════════════════════════════════════');
  console.log('');
});
