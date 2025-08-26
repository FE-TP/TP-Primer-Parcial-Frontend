# 🐳 Entorno con Docker Compose

Este entorno levanta:

* **Frontend** Angular (dev con `ng serve`)
* **Backend** fake con `json-server` (`db.json`)

---

Flujo:
1. Levantar los contenedores luego de un pull: `docker compose up -d --build --force-recreate`
2. Eliminar los contenedores `docker compose down`
3. Levantar los contendedores normal: `docker compose up -d`

Comandos:

* levantar
  * `docker compose up -d`
  * `docker compose up -d --build --force-recreate`

* apagar
  * `docker compose down`

* logs
  * `docker compose logs -f`
  * `docker compose logs -f frontend`
  * `docker compose logs -f backend`

* entrar en contenedor
  * `docker compose exec frontend bash`
  * `docker compose exec backend sh`

* limpiar
  * `docker system prune`
  * `docker image prune -a`
  * `docker volume prune`

