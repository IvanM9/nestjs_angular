## Instalación
Ambos repositorios deben instalarse con el comando `yarn install` para instalar las dependencias necesarias.

## Ejecución
### Frontend
Para ejecutar el frontend, se debe ejecutar el comando `ng serve` en la carpeta `frontend`.

### Backend
Para ejecutar el backend, se debe ejecutar el comando `yarn run start` en la carpeta `backend`.

## Variables de entorno
### Backend
El backend necesita las siguientes variables de entorno para funcionar correctamente:

- `DB_USER`: Usuario de la base de datos.
- `DB_PASSWORD`: Contraseña del usuario de la base de datos.
- `DB_NAME`: Nombre de la base de datos.
- `DB_HOST`: Host de la base de datos. (Por defecto, `localhost`)
- `DB_PORT`: Puerto de la base de datos (Por defecto, `5432`)
- `JWT_SECRET`: Clave secreta para la generación de tokens JWT. (Por defecto, `secret`)
- `ADMIN_USER`: Usuario administrador. (Por defecto, `Admin_user1`)
- `ADMIN_PASSWORD`: Contraseña del usuario administrador. (Por defecto, `Admin_password1`)


## Documentación de la API
La documentación de la API se encuentra en formato OpenAPI 3.0. Para visualizarla, se puede acceder a la ruta `/api-docs` del backend.