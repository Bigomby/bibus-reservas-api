[![Build Status](https://travis-ci.org/Bigomby/bibus-reservas-api.svg?branch=master)](https://travis-ci.org/Bigomby/bibus-reservas-api)
[![](https://img.shields.io/badge/api-documentation-blue.svg)](https://bigomby.github.io/bibus-reservas-api/docs/)

# bibus-reservas-api

API RESTful para acceder a la aplicación de reserva de salas de la Biblioteca
de la Universidad de Sevilla.

Se puede encontrar la API en funcionamiento en: http://api.salas.gonebe.com/

## ¿Por qué existe esta API?

Corre el año 2017. Todo el mundo utiliza _smartphones_, _apps_, webs adaptadas
a dispositivos móviles, _bots_, etc. Sin embargo, la Biblioteca de la US ofrece
un sistema de reserva de salas mediante una web obsoleta y poco flexible.

La aplicación web de reserva de salas no dispone de una API para interactuar con
ella, sino que su funcionamiento consiste en enviar HTML ya renderizado. Esto
dificulta el desarrollo aplicaciones que usen este sistema, por ejemplo,
una _app_ para Android o un _bot_ de Telegram.

Por todo esto nace esta API con el objetivo de ofrecer una forma de interactuar
con el sistema de reserva de salas de forma sencilla. Usando esta API, crear una
aplicación que sea capaz de consultar y reservar salas se convierte en un
proceso mucho más simple, pues no será necesario tener que realizar _scraping_
y otras técnicas para obtener la información necesaria.

## Estado de la aplicación

Actualmente el programa se encuentra en **desarrollo** por lo que no se espera
que funcione de forma estable. El funcionamiento interno y la API puede
cambiar en cualquier momento (y lo hará) hasta la versión 1.0.

Por ahora sólo funciona con la Biblioteca de la Escuela Técnica Superior de
Ingenieros, aunque próximamente se añadirán más centros.

## Uso

Para ejecutar la aplicación basta con seguir los siguientes pasos:

```bash
git clone https://github.com/Bigomby/bibus-reservas-api.git && cd bibus-reservas-api
npm install && npm run build && npm run app
```

### Usando Docker

```bash
docker run -p 8080:8080 bigomby/bibus-reservas-api
```

## Configuración

- `NODE_ENV` [**'development'**, 'production', 'test']: Entorno de ejecución.
- `PORT` [**8080**]: Puerto para la escucha del servidor.
- `LOG_LEVEL` ['error', 'warn', **'info'**, 'verbose', 'debug', 'silly']: Nivel de
depuración.

## Ejemplo

A continuación se muestra un ejemplo de cómo sería una pequeño script hecho
en Python que obtendría el estado de las salas y lo imprime por pantalla.

```python
# consulta_salas.py

import requests

class colors:
    OK = "\033[92m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"

def print_turn(turn):
    print(' ▶ [{}]:'.format(turn["time"]), end="")
    if turn["available"]:
        print("\t" + colors.OK + "Libre" + colors.ENDC)
    else:
        print("\t" + colors.FAIL + "Ocupada" + colors.ENDC)

def print_room(room):
    sala = "SALA " + str(room)
    print("-" * 31)
    print(colors.BOLD + sala.center(31, " ") + colors.ENDC)
    print("-" * 31)

response = requests.get("http://api.salas.gonebe.com/salas")
assert response.status_code == 200

for sala in response.json():
    print_room(sala["id"])
    for turn in sala["turns"]:
        print_turn(turn)
```
