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
        trailer: {
            type: String
        },
        imagen: {
            type: String
        },
        stock: {
            type: Boolean
        }
    },
    relations: {
        detalle_facturas: {
            target: "detalle_facturas",
            type: "one-to-many",
            inverseSide: "games"
        },
    }
});