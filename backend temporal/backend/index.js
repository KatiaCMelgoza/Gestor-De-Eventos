require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Para manejar tokens JWT
const app = express();
const router = express.Router(); // Esto define el router
require('./cronJobs'); // Importa y ejecuta el archivo de cron jobs
const qrRoutes = require('./qrRoutes'); // Importa las rutas de QR



const PORT = process.env.PORT || 3000; // Define el puerto con variable de entorno o 3000
const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta'; // Define SECRET_KEY desde .env o por defecto

app.use(cors());
app.use(express.json());

// Configurar conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'SistemaEventos',
  port: 8889
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando');
});

// Endpoint para registrar usuario:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/api/register', async (req, res) => {
  const { nombre, apellido, telefono, correo_electronico, password, rol } = req.body;

  if (isNaN(telefono)) {
    return res.status(400).json({ error: 'El teléfono debe ser un número válido' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO usuarios (nombre, apellido, telefono, correo_electronico, password, rol) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [nombre, apellido, Number(telefono), correo_electronico, hashedPassword, rol];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al registrar el usuario:', err);
      return res.status(500).json({ error: 'Error al registrar el usuario en la base de datos' });
    } else {
      return res.status(201).json({ message: 'Usuario registrado con éxito', userId: result.insertId });
    }
  });
});

//endpoint para registrar asistencias::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Endpoint para registrar asistencia
router.post('/asistencia', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'El token es obligatorio.' });
  }

  try {
    const data = jwt.verify(token, SECRET_KEY);
    const { usuario_id, evento_id } = data;
    const fechaEntrada = new Date();

    // Verificar si ya existe un registro de asistencia
    const checkQuery = `
      SELECT COUNT(*) AS count FROM asistencias 
      WHERE usuario_id = ? AND evento_id = ?`;
    const [rows] = await connection.promise().query(checkQuery, [usuario_id, evento_id]);
    if (rows[0].count > 0) {
      return res.status(409).json({ error: 'Asistencia ya registrada para este evento y usuario.' });
    }

    // Insertar asistencia
    const insertQuery = `
      INSERT INTO asistencias (usuario_id, evento_id, fecha_entrada, asistencia_confirmada)
      VALUES (?, ?, ?, ?)`;
    const [result] = await connection.promise().query(insertQuery, [usuario_id, evento_id, fechaEntrada, 1]);

    res.status(201).json({ message: 'Asistencia registrada exitosamente.', asistenciaId: result.insertId });
  } catch (error) {
    console.error('Error al procesar el token:', error.message);
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
});

// // Endpoint para iniciar sesión::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// app.post('/api/auth/login', (req, res) => {
//   const { correo_electronico, password } = req.body;

//   const query = 'SELECT * FROM usuarios WHERE correo_electronico = ?';
//   connection.query(query, [correo_electronico], async (err, results) => {
//     if (err) {
//       console.error('Error al buscar el usuario:', err);
//       return res.status(500).json({ error: 'Error al buscar el usuario en la base de datos' });
//     }

//     if (results.length > 0) {
//       const user = results[0];
//       console.log(user); // Verifica aquí que el campo `nombre` exista y tenga un valor

//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       console.log(user.usuario_id)
//       if (isPasswordValid) {
//         const token = jwt.sign(
//           { userId: user.usuario_id, correo_electronico: user.correo_electronico },
//           SECRET_KEY,
//           { expiresIn: '1h' }
//         );
//         // Enviar el nombre en la respuesta
//         return res.json({
//           message: 'Inicio de sesión exitoso',
//           token,
//           name: user.nombre, // nombre de base de datos
//           userId: user.usuario_id  // ID único del usuario en la base de datos

//         });
//       } else {
//         return res.status(401).json({ error: 'Contraseña incorrecta' });
//       }
//     } else {
//       return res.status(404).json({ error: 'Usuario no encontrado' });
//     }
//   });
// });

app.post('/api/auth/login', (req, res) => {
  const { correo_electronico, password } = req.body;

  const query = 'SELECT * FROM usuarios WHERE correo_electronico = ?';
  connection.query(query, [correo_electronico], async (err, results) => {
    if (err) {
      console.error('Error al buscar el usuario:', err);
      return res.status(500).json({ error: 'Error al buscar el usuario en la base de datos' });
    }

    if (results.length > 0) {
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          { userId: user.usuario_id, correo_electronico: user.correo_electronico },
          SECRET_KEY,
          { expiresIn: '1h' }
        );

        return res.json({
          message: 'Inicio de sesión exitoso',
          token,
          name: user.nombre,
          userId: user.usuario_id,
          rol: user.rol // Asegúrate de que `rol` esté definido en la base de datos
        });
      } else {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
    } else {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
  });
});

// // Endpoint para cerrar sesión
// router.post('/api/auth/logout', (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del encabezado de autorización

//   if (!token) {
//     return res.status(400).json({ error: 'Token no proporcionado.' });
//   }

//   try {
//     // Verificar el token antes de invalidarlo
//     jwt.verify(token, SECRET_KEY);

//     // Aquí no se puede "invalidar" directamente el token, pero puedes configurarlo para que el cliente lo elimine
//     return res.status(200).json({ message: 'Sesión cerrada exitosamente. Por favor, elimina el token del cliente.' });
//   } catch (err) {
//     console.error('Error al cerrar sesión:', err);
//     return res.status(401).json({ error: 'Token inválido o expirado.' });
//   }
// });

// module.exports = router;

// Endpoint para registrar un evento:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/api/eventos', (req, res) => {
  const {
    nombre,
    descripcion,
    tipo,
    numero_asistentes,
    tipo_audiencia,
    requiere_registro,
    espacio,
    fecha,
    hora_inicio,
    hora_fin,
    tiempo_montaje,
    tiempo_desmontaje
  } = req.body;

 // Validar que los campos obligatorios estén presentes
 if (!espacio || !fecha || !hora_inicio || !hora_fin || !numero_asistentes) {
  return res.status(400).json({ error: 'Espacio, fecha y horarios son obligatorios.' });
}

// Verificar la capacidad del espacio
const capacityQuery = `SELECT capacidad FROM Espacios WHERE nombre = ?`;
connection.query(capacityQuery, [espacio], (err, results) => {
  if (err) {
    console.error('Error al verificar la capacidad del espacio:', err);
    return res.status(500).json({ error: 'Error al verificar la capacidad del espacio.' });
  }

  if (results.length === 0) {
    return res.status(404).json({ error: 'El espacio seleccionado no existe.' });
  }

  const capacidadEspacio = results[0].capacidad;

  if (numero_asistentes > capacidadEspacio) {
    return res.status(400).json({
      error: `La cantidad de asistentes (${numero_asistentes}) excede la capacidad del espacio (${capacidadEspacio}).`
    });
  }  

      // Verificar si ya existe un evento en el mismo espacio, fecha y horario
  const conflictQuery = `
  SELECT COUNT(*) AS count
  FROM Eventos
  WHERE espacio = ? AND fecha = ? AND (
    (? >= hora_inicio AND ? <= hora_fin) OR 
    (? <= hora_inicio AND ? >= hora_fin)
  )`;

    connection.query(
      conflictQuery,
      [espacio, fecha, hora_fin, hora_inicio, hora_inicio, hora_fin],
      (err, results) => {

        if (err) {
          console.error('Error al verificar conflictos:', err);
          return res.status(500).json({ error: 'Error al verificar conflictos.' });
        }
  
        if (results[0].count > 0) {
        // Si hay conflicto, devolver un error
        return res.status(409).json({ error: 'Zona ya ocupada para esta fecha y hora.' });
      }

//   const query = `
//     INSERT INTO Eventos (nombre, descripcion, tipo, numero_asistentes, tipo_audiencia, requiere_registro, espacio, fecha, hora_inicio, hora_fin, tiempo_montaje, tiempo_desmontaje, estado)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`;

//   const values = [
//     nombre,
//     descripcion,
//     tipo,
//     numero_asistentes,
//     tipo_audiencia,
//     requiere_registro,
//     espacio,
//     fecha,
//     hora_inicio,
//     hora_fin,
//     tiempo_montaje,
//     tiempo_desmontaje
//   ];

//   connection.query(query, values, (err) => {
//     if (err) {
//       console.error('Error al registrar el evento:', err);
//       return res.status(500).json({ error: 'Error al registrar el evento' });
//     }

//     res.status(201).json({ message: 'Evento registrado exitosamente con estado pendiente.' });
//   });
// });

// Si no hay conflicto, proceder con el registro
const insertQuery = `
INSERT INTO Eventos (nombre, descripcion, tipo, numero_asistentes, tipo_audiencia, requiere_registro, espacio, fecha, hora_inicio, hora_fin, tiempo_montaje, tiempo_desmontaje, estado)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`;

const values = [
nombre,
descripcion,
tipo,
numero_asistentes,
tipo_audiencia,
requiere_registro,
espacio,
fecha,
hora_inicio,
hora_fin,
tiempo_montaje,
tiempo_desmontaje
];

connection.query(insertQuery, values, (err) => {
if (err) {
  console.error('Error al registrar el evento:', err);
  return res.status(500).json({ error: 'Error al registrar el evento.' });
}

res.status(201).json({ message: 'Evento registrado exitosamente con estado pendiente.' });
        });
      }
    );
  });
});

// Endpoint para obtener eventos pasados::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get('/api/eventos/pasados', (req, res) => {
  const query = `
    SELECT * FROM Eventos
    WHERE estado = 'pasado';`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener eventos pasados:', err);
      return res.status(500).json({ error: 'Error al obtener eventos pasados.' });
    }

    res.json(results);
  });
});

// // Obtener eventos pasados:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// app.get('/api/eventos/pasados', (req, res) => {
//   const query = `
//     SELECT * FROM Eventos
//     WHERE estado = 'pasado';`;

//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error('Error al obtener eventos pasados:', err);
//       return res.status(500).json({ error: 'Error al obtener eventos pasados.' });
//     }

//     res.json(results);
//   });
// });

//endpoint para mostrar eventos aporbados unicamente en la pagina proximos eventos
app.get('/api/eventos/aprobados', (req, res) => {
  const query = 'SELECT * FROM Eventos WHERE estado = "aprobado"';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener eventos aprobados:', err);
      return res.status(500).json({ error: 'Error al obtener eventos aprobados.' });
    }

    res.json(results);
  });
});

// Endpoint para mostrar eventos aprobados y futuros en la página de Próximos Eventos
app.get('/api/eventos/pasados', (req, res) => {
  const query = 'SELECT * FROM Eventos WHERE estado = "pasado"';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener eventos pasados:', err);
      return res.status(500).json({ error: 'Error al obtener eventos pasados.' });
    }

    res.json(results);
  });
});

app.post('/api/registro-solicitantes', (req, res) => {
  const {
    nombre_completo,
    correo,
    telefono,
    id_universitario,
    departamento,
    evento_id,
    usuario_id
  } = req.body;

  if (!nombre_completo || !correo) {
    return res.status(400).json({ error: 'Los campos nombre_completo y correo son obligatorios.' });
  }

  const query1 = `
    INSERT INTO Registro_Solicitantes (nombre_completo, correo, telefono, id_universitario, departamento)
    VALUES (?, ?, ?, ?, ?)`;

  const values1 = [
    nombre_completo,
    correo,
    telefono || null, // Permitir valores nulos para campos opcionales
    id_universitario || null,
    departamento || null
  ];

  connection.query(query1, values1, (err, result1) => {
    if (err) {
      console.error('Error al registrar solicitante:', err);
      return res.status(500).json({ error: 'Error al registrar al solicitante.' });
    }

    const query2 = `
      INSERT INTO Notificaciones (evento_id, usuario_id)
      VALUES (?, ?)`;

    const values2 = [evento_id, usuario_id];

    connection.query(query2, values2, (err, result2) => {
      if (err) {
        console.error('Error al registrar notificación:', err);
        return res.status(500).json({ error: 'Error al registrar notificación.' });
      }

      // Enviar una única respuesta al cliente después de ambas operaciones
      res.status(201).json({
        message: 'Solicitante y notificación registrados exitosamente.',
        solicitanteId: result1.insertId,
        notificacionId: result2.insertId
      });
    });
  });
});


// Middleware para verificar el token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}


//::::::::::::::::::::::::::::::::::::::::::::::::Administrador::::::::::::::::::::::::::::::::::::::::::::::.
//endpoint para las consultas del administrador

//obtener los eventos
app.get('/api/administrador/eventos', (req, res) => {
  const query = 'SELECT * FROM Eventos';
  connection.query(query, (err, results) => {
    if(err){
      console.error('Error al obtener eventos', err);
      return res.status(500).send('Error al obtener eventos');
    } 
    res.json(results);
  });
});

// Endpoint para que el administrador acepte o rechace un evento
app.put('/api/administrador/eventos/:id', (req, res) => {
  const { estado } = req.body; // 'aprobado' o 'rechazado'
  const evento_id = req.params.id;

  const query = 'UPDATE Eventos SET estado = ? WHERE evento_id = ?';

  connection.query(query, [estado, evento_id], (err) => {
    if (err) {
      console.error('Error al actualizar el estado del evento:', err);
      return res.status(500).json({ error: 'Error al actualizar el estado del evento' });
    }

    res.json({ message: `El evento fue ${estado}.` });
  });
});

// Endpoint para agregar un espacio
app.post('/api/administrador/espacios', (req, res) => {
  const { tipo_espacio, nombre, capacidad } = req.body;

  if (!tipo_espacio || !nombre || !capacidad) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = 'INSERT INTO Espacios (tipo_espacio, nombre, capacidad) VALUES (?, ?, ?)';
  connection.query(query, [tipo_espacio, nombre, capacidad], (err) => {
    if (err) {
      console.error('Error al agregar espacio:', err);
      return res.status(500).json({ error: 'Error al agregar espacio' });
    }
    res.status(201).json({ message: 'Espacio agregado exitosamente' });
  });
});

// Obtener todos los espacios
app.get('/api/administrador/espacios', (req, res) => {
  const query = 'SELECT * FROM Espacios';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener espacios:', err);
      return res.status(500).json({ error: 'Error al obtener espacios.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron espacios registrados.' });
    }

    // Enviar los resultados directamente si no necesitas transformarlos
    res.json(results);
  });
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// Monta las rutas del módulo de QR
app.use('/api/qr', qrRoutes);

// Ruta protegida
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Acceso autorizado', user: req.user });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

