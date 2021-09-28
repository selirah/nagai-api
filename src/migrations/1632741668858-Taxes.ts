import { MigrationInterface, QueryRunner } from 'typeorm'

export class Taxes1632741668858 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            insert into tax (tax, rate) values ('VAT', '0.03');
            insert into tax (tax, rate) values ('COVID-19', '0.01');
            insert into tax (tax, rate) values ('NHIL', '0.025');
            insert into tax (tax, rate) values ('GETFL', '0.025');
        `)
  }

  public async down(_: QueryRunner): Promise<void> {}
}
