import { EntitySchema } from "typeorm";

export const FacturaSchema = new EntitySchema({
    name: "facturas",
    columns: {
        id: {
            primary: String,
            type: Number,
            generated: true
        },
        fecha: {
            type: Date,
            nullable: true
        },
        total: {
            type: Number,
            nullable: true
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