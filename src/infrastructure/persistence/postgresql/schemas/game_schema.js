import { EntitySchema } from "typeorm";

export const GameSchema = new EntitySchema({
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
        rating: {
            type: "numeric",
            precision: 5,
            scale: 2
        },
        stock: {
            type: Number
        },
        plataforma:{
            type: String
        },
        categoria:{
            type: String
        },
        thumbnail: {
            type: String
        },
        imagen: {
            type: String,
            array:true
        },
        trailer: {
            type: String
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