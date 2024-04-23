import { EntitySchema } from "typeorm";

export const UserSchema = new EntitySchema({
    name: "users",
    columns: {
        id: {
            type: String,
            primary: true
        },
        username: {
            type: String
        },
        password: {
            type: String
        },
        nombre: {
            type: String
        },
        apellidos: {
            type: String
        },
        email: {
            type: String
        },
        telefono: {
            type: Number
        }
    },
    relations: {
        facturas: {
            target: "facturas",
            type: "one-to-many",
            inverseSide: "games"
        }
    }
})