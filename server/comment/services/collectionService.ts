import * as mongoose from 'mongoose';
import { IPageModel } from '../models/commonModel';
import CollectionModel from '../models/collection/class/collectionModel';
import CollectionSchema from '../models/collection/schema/collectionSchema';
import { removeUndefinedField } from '../utils/removeUndefinedField';

const Collection = mongoose.model('Collection', CollectionSchema, 'Collection');

async function getCollection(expression: object): Promise<CollectionModel> {
  try {
    const collection: any = await Collection.findOne(expression).lean();

    return collection;
  }
  catch (err) {
    throw err;
  }
}

async function getCollections(expression: object): Promise<CollectionModel[]> {
  try {
    const collections: CollectionModel[] = await Collection.find(expression).sort({ createdDate: -1 }).lean();

    return collections.map(collection => (new CollectionModel(collection, 'fetch')));
  }
  catch (err) {
    throw err;
  }
}

async function saveNewCollection(model: CollectionModel): Promise<CollectionModel> {
  try {
    const collection: any = await new Collection(model).save();

    return new CollectionModel(collection, 'fetch');
  }
  catch (err) {
    throw err;
  }
}

async function updateCollection(expression: object, updateFields: object): Promise<CollectionModel> {
  try {
    const collection = await Collection.findOneAndUpdate(expression, { $set: removeUndefinedField(updateFields) }).lean();

    return new CollectionModel(await getCollection({ _id: collection._id }), 'fetch');
  }
  catch (err) {
    throw err;
  }
}

export { getCollection, getCollections, saveNewCollection, updateCollection }