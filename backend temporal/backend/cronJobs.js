const cron = require('node-cron');
const mysql = require('mysql2');

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'SistemaEventos',
  port: 8889
});

// Tarea programada para mover eventos aprobados a pasados
cron.schedule('* * * * *', () => {
    console.log('Ejecutando tarea programada para mover eventos a pasados cada minuto');
  
    const query = `
      UPDATE Eventos
      SET estado = 'pasado'
      WHERE estado = 'aprobado' AND CONCAT(fecha, ' ', hora_fin) <= NOW();
    `;
  
    connection.query(query, (err, result) => {
      if (err) {
        console.error('Error al mover eventos a pasados:', err);
      } else {
        console.log(`Eventos actualizados a pasados: ${result.affectedRows}`);
      }
    });
  });
  

module.exports = connection;
