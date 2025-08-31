

# **Agendamiento de Atención a Proveedores** 
Aplicación web en Angular, para la gestión de **reservas de turnos de recepción** y administración de **proveedores, productos y jaulas**.

Trabajo Práctico correspondiente al **Primer Examen Parcial – Frontend 2025**. 
## Integrantes
- Fleitas Cáceres, Fernando David
- Figueredo Rosa, Elias de Jesus
- Paredes Pérez, Atilio Sebastián
- Ramírez Dure, José Gabriel
- Vargas Florentín, Lucas Jesús Elias


## Módulos entregados
- Administración de proveedores 
- Administración de productos
- Administración de jaulas de recepción
- Reserva de turnos de recepción
- Modulo de ejecucion de recepción de productos

## Requisitos

- Docker.

## Instalación y ejecución

Clonar el repositorio:
```bash
git clone https://github.com/FE-TP/TP-Primer-Parcial-Frontend.git
```
Ingresar al proyecto:
```bash
cd TP-Primer-Parcial-Frontend
```
Construir imágenes y levantar servicios:
```bash
docker compose up --build -d
```
Abrir la aplicación en el navegador:
```bash
http://localhost:4200
```

## Comandos útiles

Ver logs:
```bash
docker compose logs -f frontend
```
Detener y eliminar contenedor:
```bash
docker compose down -v
```
