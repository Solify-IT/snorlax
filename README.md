# Proyecto Snorlax

## Prerequisitos
1. Docker

## Instalación
1. Clona el repositorio en tu computadora local:

```git
git clone git@github.com:Solify-IT/snorlax.git
```

2. Entra al directorio del repo recién creado:

```sh
cd snorlax
```

3. Genera todos los archivos .env necesarios para configurar el proyecto:

```sh
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
co postgres/.env.example postgres/.env
```

4. Levanta el proyecto

```sh
docker-compose up
```

5. Expera a que todos los servicios se levanten (permanece atento a los logs de Docker).

6. Una vez los servicios estén arriba, abre en tu navegador la ruta `localhost`, deberías ver el frontend actual del proyecto. 

