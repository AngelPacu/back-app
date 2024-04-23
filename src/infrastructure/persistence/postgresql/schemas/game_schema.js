import { EntitySchema } from "typeorm";

export const ItemSchema = new EntitySchema({
    name: "games",
    columns: {
        id: {
            type: String,
            primary: true
        },
        nombre: {
            type: String
        },
        descripcion: {
            type: String
        },
        precio: {
            type: Number
        },
        stock: {
            type: Boolean
        }
    },
    relations: {
        facturas: {
            target: 'facturas',
            type: 'many-to-many',
            inverseSide: 'games'
        },
        detalle_facturas: {
            target: "detalle_facturas",
            type: "one-to-many",
            inverseSide: "games"
        },
    }
});