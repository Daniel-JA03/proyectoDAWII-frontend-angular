REM --- Construir imagen ---
docker build -t proyectoDAWII/frontend:1.0 -f Dockerfile .

REM --- Crear contenedor ---
docker run -d --name frontend --network proyectoDAWII -p 4201:80 proyectoDAWII/frontend:1.0
