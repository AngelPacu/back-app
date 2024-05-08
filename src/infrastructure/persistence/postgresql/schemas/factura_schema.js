import { EntitySchema } from "typeorm";

export const FacturaSchema = new EntitySchema({
    name: "facturas",
    columns: {
        id: {
            primary: String,
            type: Number
        },
        fecha: {
            type: Date
        },
        tarjeta: {
            type: String
        },
        total: {
            type: Number
        },
        estado: {
            type: String
        },

    },
    relations: {
        users: {
            target: "users",
            type: "many-to-one",
            joinColumn: true,
        },
        detalles_factura: {
            target: 'detalle_facturas',
            type: 'one-to-many',
            joinTable: {
              name: 'factura_game', // Opcional: Nombre de la tabla de unión si quieres uno personalizado
            }
        }
    }
});