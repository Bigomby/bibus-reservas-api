# bibing-salas-api

API RESTful para acceder a la aplicación de reserva de salas de la Biblioteca
de la Escuela Técnica Superior de Ingenieros de la Universidad de Sevilla.

# Uso

```bash
git clone https://github.com/Bigomby/bibing-salas-api.git
cd bibing-salas-api
npm start
```

El servidor escucha por defecto en el puerto `8080`. Se puede cambiar el puerto
mediante la variable de entorno `PORT`, por ejemplo:

```bash
PORT=80 npm run
```

# Métodos

La API expone los siguientes métodos:

- `GET /salas`: Obtiene una lista con los horarios de las aulas y su
estado (si están reservadas o no).

```javascript
[
  {
    "id": "1",  // ID de la sala
    "booked": [ // Si está reservada la sala
      false,    // Turno 1
      true,     // Turno 2
      true,     // ...
      true,
      true,
      true
    ]
  },
  /* ... */
]
```

- `GET sala/id`: Obtiene los turnos para una sala dada.
- `GET turnos/id`: Obtiene las salas que hay libre para un turno dado.
