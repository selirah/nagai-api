import { MigrationInterface, QueryRunner } from 'typeorm';

export class Units1603801335682 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        insert into unit (unit, description) values ('bg', 'bag');
        insert into unit (unit, description) values ('bf', 'board feet');
        insert into unit (unit, description) values ('bl', 'bale');
        insert into unit (unit, description) values ('bt', 'bottle');
        insert into unit (unit, description) values ('bx', 'box');
        insert into unit (unit, description) values ('c', 'hundred');
        insert into unit (unit, description) values ('cc', 'cubic centimeter');
        insert into unit (unit, description) values ('cf', 'cubic feet');
        insert into unit (unit, description) values ('ci', 'curie');
        insert into unit (unit, description) values ('cl', 'cylinder');
        insert into unit (unit, description) values ('cm', 'centimeter');
        insert into unit (unit, description) values ('cn', 'can');
        insert into unit (unit, description) values ('cs', 'case');
        insert into unit (unit, description) values ('cr', 'crate');
        insert into unit (unit, description) values ('ct', 'carton');
        insert into unit (unit, description) values ('cw', 'hundred|weight');
        insert into unit (unit, description) values ('cy', 'cubic yard');
        insert into unit (unit, description) values ('di', 'diameter');
        insert into unit (unit, description) values ('dr', 'drum');
        insert into unit (unit, description) values ('dw', 'dewar');
        insert into unit (unit, description) values ('dy', 'day');
        insert into unit (unit, description) values ('dz', 'dozen');
        insert into unit (unit, description) values ('ea', 'each');
        insert into unit (unit, description) values ('ft', 'feet');
        insert into unit (unit, description) values ('gl', 'gallon');
        insert into unit (unit, description) values ('gm', 'gram');
        insert into unit (unit, description) values ('gn', 'grain');
        insert into unit (unit, description) values ('gr', 'gross');
        insert into unit (unit, description) values ('hr', 'hour');
        insert into unit (unit, description) values ('in', 'inch');
        insert into unit (unit, description) values ('jr', 'jar');
        insert into unit (unit, description) values ('kg', 'kilogram');
        insert into unit (unit, description) values ('kt', 'kit');
        insert into unit (unit, description) values ('la', 'lambda');
        insert into unit (unit, description) values ('lb', 'pound');
        insert into unit (unit, description) values ('lf', 'linear feet');
        insert into unit (unit, description) values ('lg', 'length');
        insert into unit (unit, description) values ('li', 'litre');
        insert into unit (unit, description) values ('lt', 'lot');
        insert into unit (unit, description) values ('ly', 'linear yard');
        insert into unit (unit, description) values ('m', 'thousand');
        insert into unit (unit, description) values ('mg', 'milligram');
        insert into unit (unit, description) values ('ml', 'millilitre');
        insert into unit (unit, description) values ('mn', 'minute');
        insert into unit (unit, description) values ('mo', 'month');
        insert into unit (unit, description) values ('mr', 'micron');
        insert into unit (unit, description) values ('mt', 'meter');
        insert into unit (unit, description) values ('og', 'omega');
        insert into unit (unit, description) values ('oz', 'ounce');
        insert into unit (unit, description) values ('pa', 'package');
        insert into unit (unit, description) values ('pc', 'piece');
        insert into unit (unit, description) values ('pg', 'page');
        insert into unit (unit, description) values ('pk', 'pack');
        insert into unit (unit, description) values ('pl', 'pail');
        insert into unit (unit, description) values ('pr', 'pair');
        insert into unit (unit, description) values ('qr', 'quarter');
        insert into unit (unit, description) values ('qt', 'quart');
        insert into unit (unit, description) values ('rd', 'rod');
        insert into unit (unit, description) values ('rl', 'roll');
        insert into unit (unit, description) values ('rm', 'ream');
        insert into unit (unit, description) values ('sf', 'square feet');
        insert into unit (unit, description) values ('sh', 'sheet');
        insert into unit (unit, description) values ('st', 'set');
        insert into unit (unit, description) values ('sy', 'square yard');
        insert into unit (unit, description) values ('tb', 'tube');
        insert into unit (unit, description) values ('tr', 'transaction');
        insert into unit (unit, description) values ('ut', 'unit');
        insert into unit (unit, description) values ('vl', 'vial');
        insert into unit (unit, description) values ('wk', 'week');
        insert into unit (unit, description) values ('yd', 'yard');
        insert into unit (unit, description) values ('yr', 'year');
    `);
  }

  public async down(_: QueryRunner): Promise<void> {}
}
