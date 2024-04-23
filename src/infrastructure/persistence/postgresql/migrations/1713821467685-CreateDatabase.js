

export class CreateDatabase1713821467685 {
    name = 'CreateDatabase1713821467685'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "users" ("id" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "nombre" character varying NOT NULL, "apellidos" character varying NOT NULL, "email" character varying NOT NULL, "telefono" integer NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "games" ("id" character varying NOT NULL, "nombre" character varying NOT NULL, "descripcion" character varying NOT NULL, "precio" integer NOT NULL, "stock" boolean NOT NULL, CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "facturas" ("id" integer NOT NULL, "fecha" TIMESTAMP NOT NULL, "tarjeta" integer NOT NULL, "total" integer NOT NULL, "estado" character varying NOT NULL, "usersId" character varying, CONSTRAINT "PK_f302947c1e4773639b20707a8bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "detalle_facturas" ("id" SERIAL NOT NULL, "cantidad" integer NOT NULL, "descuento" integer NOT NULL, "facturasId" integer, "gamesId" character varying, CONSTRAINT "PK_aa7bd5763b128375ac946e6421a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "facturas" ADD CONSTRAINT "FK_8096cbffa24fcda7124f321f704" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_facturas" ADD CONSTRAINT "FK_40022d4a111538a2b94118ff8ac" FOREIGN KEY ("facturasId") REFERENCES "facturas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_facturas" ADD CONSTRAINT "FK_328db00f331c87d94107ebbd9b0" FOREIGN KEY ("gamesId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "detalle_facturas" DROP CONSTRAINT "FK_328db00f331c87d94107ebbd9b0"`);
        await queryRunner.query(`ALTER TABLE "detalle_facturas" DROP CONSTRAINT "FK_40022d4a111538a2b94118ff8ac"`);
        await queryRunner.query(`ALTER TABLE "facturas" DROP CONSTRAINT "FK_8096cbffa24fcda7124f321f704"`);
        await queryRunner.query(`DROP TABLE "detalle_facturas"`);
        await queryRunner.query(`DROP TABLE "facturas"`);
        await queryRunner.query(`DROP TABLE "games"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
