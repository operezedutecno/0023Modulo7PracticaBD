const { Pool } = require("pg")

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'telefonos',
    user: 'postgres',
    password: 'postgres'
});



(async () => {
    const client  = await pool.connect()

    // Función para agregar dispositivos
    const registrarDispositivo = async(id_modelo, anio) => {
        const consulta = {
            text: "INSERT INTO dispositivos(id_modelo, anio) VALUES($1, $2) RETURNING *",
            values: [id_modelo, anio]
        }
        const registro = await client.query(consulta)
        return registro.rows
    }

    const actualizarDispositivo = async (id, id_modelo, anio) => {
        const consulta = {
            text: "UPDATE dispositivos SET id_modelo=$1, anio=$2 WHERE id_dispositivo=$3 RETURNING *",
            values: [id_modelo, anio, id]
        }
        const actualizacion = await client.query(consulta)
        return actualizacion.rows
    }

    const listadoDispositivos = async() => {
        const consulta = `
            SELECT d.id_dispositivo, mr.nombre AS marca, md.nombre AS modelo, d.anio
            FROM dispositivos d 
            INNER JOIN modelos md ON md.id_modelo = d.id_modelo
            INNER JOIN marcas mr ON mr.id_marca = md.id_marca
        `
        const registros = await client.query(consulta)
        return registros.rows
    }

    const eliminarDispositivo = async (id) => {
        const consulta = {
            text: "DELETE FROM dispositivos WHERE id_dispositivo=$1 RETURNING *",
            values: [id]
        }
        const eliminacion = await client.query(consulta)
        return eliminacion.rows
    }

    try {
        await client.query("BEGIN")
        // const dispositivo3 = await registrarDispositivo(2, 2012)
        // const dispositivo4 = await registrarDispositivo(3, 2016)
        // const dispositivo5 = await registrarDispositivo(4, 2017)
        // console.log("dispositivo3", dispositivo3);
        // console.log("dispositivo4", dispositivo4);
        // console.log("dispositivo5", dispositivo5);
        
        // const dispositivo1 = await registrarDispositivo(1, 2011)
        // const dispositivo2 = await registrarDispositivo(1, 2012)

        // console.log("dispositivo1", dispositivo1);
        // console.log("dispositivo2", dispositivo2);


        //Actualización de dispositivos
        const cambio1 = await actualizarDispositivo(2, 5, 2012)
        console.log("Actualizado",cambio1);


        const listado = await listadoDispositivos()
        console.log("Listado de Dispositivos");
        console.table(listado);


        //Eliminación de Dispositivos
        // const eliminacion = await eliminarDispositivo(10)
        // console.log("Eliminado", eliminacion);


        console.log("Ejecución de consultas exitosa");
        await client.query("COMMIT")
    } catch (error) {
        console.log(error.message);
        await client.query("ROLLBACK")
    } finally {
        client.end()
    }

})()