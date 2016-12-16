# bibing-salas-api

API RESTful para acceder a la aplicación de reserva de salas de la Biblioteca
de la Escuela Técnica Superior de Ingenieros de la Universidad de Sevilla.

## Uso

```bash
git clone https://github.com/Bigomby/bibing-salas-api.git
cd bibing-salas-api
npm install
```

El servidor escucha por defecto en el puerto `8080`. Se puede cambiar el puerto
mediante la variable de entorno `PORT`, por ejemplo:

```bash
PORT=80 npm start
```

## Métodos

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
- `POST reseva`: Reserva una sala. Recibe un JSON con los siguiente parámetros:

```javascript
{
	"correo": "alumno@alum.us.es",
	"sala": "1",
	"turno": "6", /* El turno es la posición en la matriz de salas de forma
  que el primeor turno de la sala uno es el turno 1, el primer turno de la sala
  dos es el turno 7 y así hasta el turno 6 de la sala 12 que esl el 66 */
	"fecha": "17-12-2016",
	"nombre": "John+Doe+Ode", /* Separado por espacios */
	"uvus": "johdoeode", /* Se usa para reserver la sala */
	"usuario": "johdoeode", /* Se usa para autenticase en el sistema*/
	"password": "p4ssw0rd"
}
```
