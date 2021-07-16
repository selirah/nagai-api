import { router } from '../utils'
import { Request, Response } from 'express'
import { Inventory } from '../entities/Inventory'
import { InventoryTrail } from '../entities/InventoryTrail'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
import { validateInventory, productExists } from '../validations'
import { __Inventory__ } from '../models/__Inventory__'
import { __User__ } from '../models/__User__'

router.post(
  '/inventories',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Inventory__ = req.body
    const errors = validateInventory(inputs)

    if (errors) {
      return res.status(400).json({ errors })
    }

    let inventory: __Inventory__ | undefined
    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Inventory)
        .values({
          id: `INV-${Date.now()}`,
          productId: inputs.productId,
          unit: inputs.unit,
          description: inputs.description,
          unitPrice: inputs.unitPrice,
          quantityInStock: inputs.quantityInStock,
          reorderLevel: inputs.reorderLevel,
          reorderQuantity: inputs.reorderQuantity,
          reorderDate: inputs.reorderDate
        })
        .returning('*')
        .execute()

      inventory = queryResult.raw[0]
      if (!inventory) {
        return res.sendStatus(500)
      }
      // save inventory trail
      await InventoryTrail.create({
        productId: inputs.productId,
        unit: inputs.unit,
        description: inputs.description,
        unitPrice: inputs.unitPrice,
        quantity: inputs.quantityInStock,
        reorderLevel: inputs.reorderLevel,
        reorderQuantity: inputs.reorderQuantity,
        reorderDate: inputs.reorderDate,
        user: req.user
      }).save()
    } catch (err) {
      const errors = productExists(inputs, err)
      if (errors) {
        return res.status(400).json({ errors })
      }
    }
    return res.status(201).json(inventory)
  }
)

router.put(
  '/inventories/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Inventory__ = req.body
    const errors = validateInventory(inputs)
    const id: string = req.params.id

    if (errors) {
      return res.status(400).json({ errors })
    }

    const queryResult = await getConnection()
      .createQueryBuilder()
      .update(Inventory)
      .set({
        productId: inputs.productId,
        unit: inputs.unit,
        description: inputs.description,
        unitPrice: inputs.unitPrice,
        quantityInStock: () => `"quantityInStock" + ${inputs.quantityInStock}`,
        reorderLevel: inputs.reorderLevel,
        reorderQuantity: inputs.reorderQuantity,
        reorderDate: inputs.reorderDate
      })
      .where('"id" = :id', {
        id: id
      })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    // save inventory trail
    await InventoryTrail.create({
      productId: inputs.productId,
      unit: inputs.unit,
      description: inputs.description,
      unitPrice: inputs.unitPrice,
      quantity: inputs.quantityInStock,
      reorderLevel: inputs.reorderLevel,
      reorderQuantity: inputs.reorderQuantity,
      reorderDate: inputs.reorderDate,
      user: req.user
    }).save()
    const inventory = await getConnection()
      .getRepository(Inventory)
      .createQueryBuilder('inventory')
      .where('"id" = :id', {
        id: id
      })
      .getOne()

    if (!inventory) {
      return res.sendStatus(500)
    }

    return res.status(200).json(inventory)
  }
)

router.get(
  '/inventories',
  authorization,
  async (req: Request, res: Response) => {
    const limit = req.query.limit !== undefined ? +req.query.limit : 100
    const offset = req.query.offset !== undefined ? +req.query.offset : 0

    const inventories = await getConnection()
      .getRepository(Inventory)
      .createQueryBuilder('inventories')
      .orderBy('"createdAt"', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany()

    return res.status(200).json(inventories)
  }
)

router.get(
  '/inventories/trails',
  authorization,
  async (req: Request, res: Response) => {
    const limit = req.query.limit !== undefined ? +req.query.limit : 100
    const offset = req.query.offset !== undefined ? +req.query.offset : 0

    const trails = await getConnection()
      .getRepository(InventoryTrail)
      .createQueryBuilder('trails')
      .innerJoinAndSelect('trails.product', 'product')
      .innerJoinAndSelect('trails.user', 'user')
      // .orderBy('trails."createdAt"', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany()

    return res.status(200).json(trails)
  }
)

router.delete(
  '/inventories/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id)

    const queryResult = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Inventory)
      .where('"id" = :id', {
        id: id
      })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    return res.sendStatus(204)
  }
)

export { router as inventories }
