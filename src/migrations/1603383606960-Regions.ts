import { MigrationInterface, QueryRunner } from 'typeorm';

export class Regions1603383606960 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            insert into region (region, abbreviation, "capital") values ('Ahafo', 'AHF', 'Goaso');
            insert into region (region, abbreviation, "capital") values ('Ashanti', 'ASH', 'Kumasi');
            insert into region (region, abbreviation, "capital") values ('Bono', 'BON', 'Sunyani');
            insert into region (region, abbreviation, "capital") values ('Bono East', 'BNE', 'Techiman');
            insert into region (region, abbreviation, "capital") values ('Central', 'CEN', 'Cape Coast');
            insert into region (region, abbreviation, "capital") values ('Eastern', 'EAS', 'Koforidua');
            insert into region (region, abbreviation, "capital") values ('Greater Accra', 'ACC', 'Accra');
            insert into region (region, abbreviation, "capital") values ('North East', 'NEA', 'Nalerigu');
            insert into region (region, abbreviation, "capital") values ('Northern', 'NOR', 'Tamale');
            insert into region (region, abbreviation, "capital") values ('Oti', 'OTI', 'Dambai');
            insert into region (region, abbreviation, "capital") values ('Savannah', 'SAV', 'Damongo');
            insert into region (region, abbreviation, "capital") values ('Upper East', 'UEA', 'Bolgatanga');
            insert into region (region, abbreviation, "capital") values ('Upper West', 'UWE', 'Wa');
            insert into region (region, abbreviation, "capital") values ('Volta', 'VOL', 'Ho');
            insert into region (region, abbreviation, "capital") values ('Western', 'WES', 'Takoradi');
            insert into region (region, abbreviation, "capital") values ('Western North', 'WNO', 'Sefwi-Wiawso');
        `);
  }

  public async down(_: QueryRunner): Promise<void> {}
}
