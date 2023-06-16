# **<h1 align="center"> API de Check-in de Andes Airlines</h1>**

Esta API permite realizar la simulación de check-in automático para los pasajeros de Andes Airlines. Conecta con una base de datos MySQL para obtener los datos necesarios y asignar los asientos correspondientes a las tarjetas de embarque.

Requisitos previos
* Node.js (versión X.X.X)
* npm (versión X.X.X)

## **Instalación**
1 - Clona el repositorio de GitHub: https://github.com/MauricioGiaconia/bsale-prueba-tecnica

2 - Ve a la carpeta del proyecto.

3 - Instala las dependencias del proyecto: npm install.

4 - Crea un archivo .env en la raíz del proyecto y configura las variables de entorno necesarias. Las variables deben llamarse:
* PORT -> Puerto donde se iniciará el servidor 
* DB_USER -> Usuario de la database
* DB_PASSWORD -> Contraseña de la data base
* DB_NAME -> Nombre de la database
* DB_HOST -> Host de la database
* DB_MOTOR -> Motor de la database (ejemplo: MySQL)

5 - Inicia el servidor: npm start.

## **Uso**
La API se ejecutará en http://localhost:3000 de forma predeterminada. Puedes enviar una solicitud GET al siguiente endpoint para obtener la simulación del check-in para un vuelo específico:

GET /flights/:id/passengers

Reemplaza ":id" con el ID del vuelo que deseas consultar.

La respuesta será un objeto JSON con la simulación del check-in, incluyendo los datos de los pasajeros y los asientos asignados.


## **Estructura de la respuesta**
### Ejemplos:

* Respuesta exitosa:
```json
    {
        "code": 200,
        "data": {
            "flightId": 1,
            "takeoffDateTime": 1688207580,
            "takeoffAirport": "Aeropuerto Internacional Arturo Merino Benitez, Chile",
            "landingDateTime": 1688221980,
            "landingAirport": "Aeropuerto Internacional Jorge Cháve, Perú",
            "airplaneId": 1,
            "passengers": [
                {
                    "passengerId": 90,
                    "dni": 983834822,
                    "name": "Marisol",
                    "age": 44,
                    "country": "México",
                    "boardingPassId": 24,
                    "purchaseId": 47,
                    "seatTypeId": 1,
                    "seatId": 1
                },
                {...}
            ]
        }
    }
```

* Respuesta cuando no se encuentra la información solicitada:
```json
    {
        "code": 404,
        "data": {}
    }
```

* Respuesta en caso de error de conexión:
```json
    {
        "code": 400,
        "errors": "could not connect to db"
    }
```

## **Documentación**
La documentación del proyecto se encuentra en la carpeta docs. Puedes abrir el archivo index.html en tu navegador para acceder a la documentación generada con JSDocs.