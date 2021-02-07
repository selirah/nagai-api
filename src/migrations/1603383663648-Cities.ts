import { MigrationInterface, QueryRunner } from 'typeorm';

export class Cities1603383663648 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            insert into city ("city", "regionId") values ('Accra', 7);
            insert into city ("city", "regionId") values ('Adenta East', 7);
            insert into city ("city", "regionId") values ('Aflao', 14);
            insert into city ("city", "regionId") values ('Agogo', 2);
            insert into city ("city", "regionId") values ('Agona Swedru', 5);
            insert into city ("city", "regionId") values ('Ahwiaa', 2);
            insert into city ("city", "regionId") values ('Akatsi', 14);
            insert into city ("city", "regionId") values ('Akim Oda', 6);
            insert into city ("city", "regionId") values ('Akwatia', 6);
            insert into city ("city", "regionId") values ('Amanfrom', 7);
            insert into city ("city", "regionId") values ('Anloga', 14);
            insert into city ("city", "regionId") values ('Asamankese', 6);
            insert into city ("city", "regionId") values ('Ashaiman', 7);
            insert into city ("city", "regionId") values ('Assin Fosu', 5);
            insert into city ("city", "regionId") values ('Atebubu', 4);
            insert into city ("city", "regionId") values ('Awoshie', 7);
            insert into city ("city", "regionId") values ('Axim', 15);
            insert into city ("city", "regionId") values ('Bawku', 12);
            insert into city ("city", "regionId") values ('Bekwai', 2);
            insert into city ("city", "regionId") values ('Berekum', 3);
            insert into city ("city", "regionId") values ('Bibiani', 16);
            insert into city ("city", "regionId") values ('Bimbilla', 9);
            insert into city ("city", "regionId") values ('Bolgatanga', 12);
            insert into city ("city", "regionId") values ('Buduburam', 5);
            insert into city ("city", "regionId") values ('Cape Coast', 5);
            insert into city ("city", "regionId") values ('Dambai', 10);
            insert into city ("city", "regionId") values ('Damongo', 11);
            insert into city ("city", "regionId") values ('Dome', 7);
            insert into city ("city", "regionId") values ('Dormaa Ahenkro', 3);
            insert into city ("city", "regionId") values ('Dunkwa-on-Offin', 5);
            insert into city ("city", "regionId") values ('Dzodze', 14);
            insert into city ("city", "regionId") values ('Effiduase', 2);
            insert into city ("city", "regionId") values ('Ejura', 2);
            insert into city ("city", "regionId") values ('Elmina', 5);
            insert into city ("city", "regionId") values ('Gbawe', 7);
            insert into city ("city", "regionId") values ('Goaso', 1);
            insert into city ("city", "regionId") values ('Ho', 14);
            insert into city ("city", "regionId") values ('Hohoe', 14);
            insert into city ("city", "regionId") values ('Kade', 6);
            insert into city ("city", "regionId") values ('Kintampo', 4);
            insert into city ("city", "regionId") values ('Koforidua', 6);
            insert into city ("city", "regionId") values ('Konongo', 2);
            insert into city ("city", "regionId") values ('Kumasi', 2);
            insert into city ("city", "regionId") values ('Lashibi', 7);
            insert into city ("city", "regionId") values ('Madina', 7);
            insert into city ("city", "regionId") values ('Mampong', 2);
            insert into city ("city", "regionId") values ('Mandela', 7);
            insert into city ("city", "regionId") values ('Mankessim', 5);
            insert into city ("city", "regionId") values ('Mim', 1);
            insert into city ("city", "regionId") values ('Nalerigu', 8);
            insert into city ("city", "regionId") values ('New Achimota', 7);
            insert into city ("city", "regionId") values ('New Tafo', 6);
            insert into city ("city", "regionId") values ('Nkawkaw', 6);
            insert into city ("city", "regionId") values ('Nkoranza', 4);
            insert into city ("city", "regionId") values ('Nsawam', 6);
            insert into city ("city", "regionId") values ('Nsuatre', 3);
            insert into city ("city", "regionId") values ('Obuasi', 2);
            insert into city ("city", "regionId") values ('Kasoa', 5);
            insert into city ("city", "regionId") values ('Prestea', 15);
            insert into city ("city", "regionId") values ('Sakumono', 7);
            insert into city ("city", "regionId") values ('Savelugu', 9);
            insert into city ("city", "regionId") values ('Sefwi-Wiawso', 16);
            insert into city ("city", "regionId") values ('Sekondi', 15);
            insert into city ("city", "regionId") values ('Suhum', 6);
            insert into city ("city", "regionId") values ('Sunyani', 3);
            insert into city ("city", "regionId") values ('Taifa', 7);
            insert into city ("city", "regionId") values ('Takoradi', 15);
            insert into city ("city", "regionId") values ('Tamale', 9);
            insert into city ("city", "regionId") values ('Tarkwa', 15);
            insert into city ("city", "regionId") values ('Techiman', 4);
            insert into city ("city", "regionId") values ('Tema New Town', 7);
            insert into city ("city", "regionId") values ('Tema', 7);
            insert into city ("city", "regionId") values ('Wa', 13);
            insert into city ("city", "regionId") values ('Wenchi', 3);
            insert into city ("city", "regionId") values ('Winneba', 5);
            insert into city ("city", "regionId") values ('Yeji', 4);
            insert into city ("city", "regionId") values ('Yendi', 9);
        `);
  }

  public async down(_: QueryRunner): Promise<void> {}
}
