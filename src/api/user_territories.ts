import { router } from '../utils';
import { Request, Response } from 'express';
import { UserTerritory } from '../entities/UserTerritory';
import { User } from '../entities/User';
import { authorization } from '../middleware/auth';
import { getConnection } from 'typeorm';
import { validateUserTerritory } from '../validations';
import { __UserTerritory__ } from '../models/__UserTerritory__';

router.post(
  '/user-territories',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __UserTerritory__ = req.body;
    const errors = validateUserTerritory(inputs);

    if (errors) {
      return res.status(400).json({ errors });
    }

    const user = await User.findOne({ where: { id: inputs.userId } });
    if (!user) {
      const errors = [
        {
          field: 'userId',
          message: `User with that id does not exists`,
        },
      ];
      return res.status(404).json({ errors });
    }

    let userTerritory: __UserTerritory__;
    const queryResult = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(UserTerritory)
      .values({
        userId: inputs.userId,
        territories: inputs.territories,
      })
      .returning('*')
      .execute();

    userTerritory = queryResult.raw[0];
    if (!userTerritory) {
      return res.sendStatus(500);
    }

    return res.status(201).json(userTerritory);
  }
);

router.put(
  '/user-territories/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __UserTerritory__ = req.body;
    const errors = validateUserTerritory(inputs);
    const id: number = parseInt(req.params.id);

    if (errors) {
      return res.status(400).json({ errors });
    }

    const queryResult = await getConnection()
      .createQueryBuilder()
      .update(UserTerritory)
      .set({
        userId: inputs.userId,
        territories: inputs.territories,
      })
      .where('id = :id', {
        id: id,
      })
      .execute();

    if (queryResult.affected !== 1) {
      return res.sendStatus(500);
    }
    const userTerritory = await getConnection()
      .getRepository(UserTerritory)
      .createQueryBuilder('userTerritory')
      .where('id = :id', {
        id: id,
      })
      .getOne();

    if (!userTerritory) {
      return res.sendStatus(500);
    }

    return res.status(200).json(userTerritory);
  }
);

router.get('/user-territories', async (_: Request, res: Response) => {
  const userTerritories = await getConnection()
    .getRepository(UserTerritory)
    .createQueryBuilder('userTerritories')
    .leftJoinAndSelect('userTerritories.user', 'user')
    .getMany();

  return res.status(200).json(userTerritories);
});

router.delete(
  '/user-territories/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);

    const queryResult = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(UserTerritory)
      .where('id = :id', {
        id: id,
      })
      .execute();

    if (queryResult.affected !== 1) {
      return res.sendStatus(500);
    }
    return res.sendStatus(204);
  }
);

export { router as userTerritories };
