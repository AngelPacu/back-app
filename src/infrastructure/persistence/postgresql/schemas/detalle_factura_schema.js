import { EntitySchema, Generated } from "typeorm";

export const DetalleFacturaSchema = new EntitySchema({
    name: "detalle_facturas",
    columns: {
        id: {
            primary: String,
            type: Number,
            generated: true,
        },
        cantidad: {
            type: Number
        },
        descuento: {
            type: Number
        },
    },
    relations: {
        facturas: {
            target: "facturas",
            type: "many-to-one",
            joinColumn: true
        },
        games: {
            target: 'games',
            type: 'many-to-one',
            joinColumn: true
        }
    }
});