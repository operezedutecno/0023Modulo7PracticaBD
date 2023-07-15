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

    try {
        await client.query("BEGIN")
        const dispositivo3 = await registrarDispositivo(2, 2012)
        const dispositivo4 = await registrarDispositivo(3, 2016)
        const dispositivo5 = await registrarDispositivo(4, 2017)
        console.log("dispositivo3", dispositivo3);
        console.log("dispositivo4", dispositivo4);
        console.log("dispositivo5", dispositivo5);
        
        // const dispositivo1 = await registrarDispositivo(1, 2011)
        // const dispositivo2 = await registrarDispositivo(1, 2012)

        // console.log("dispositivo1", dispositivo1);
        // console.log("dispositivo2", dispositivo2);
        console.log("Ejecución de consultas exitosa");
        await client.query("COMMIT")
    } catch (error) {
        console.log(error.message);
        await client.query("ROLLBACK")
    } finally {
        client.end()
    }

})()