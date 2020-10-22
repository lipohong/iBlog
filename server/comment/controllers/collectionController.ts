import * as _ from 'lodash';
import { IERequest, IEResponse } from '../models/commonModel';
import CollectionModel  from '../models/collection/class/collectionModel';
import CollectionStatusEnum from '../models/collection/enum/collectionStatusEnum';
import { getCollection, getCollections, saveNewCollection, updateCollection } from '../services/collectionService';

export class CollectionController {

  public getCollectionById = async (req: IERequest, res: IEResponse) => {
    try {
      const expression = { _id: req.params.collectionId, isDeleted: false };
      const collection = await getCollection(expression);
      if (!collection) {
        throw new Error('ex_cannot_find_collection');
      }
      const userId = _.get(req, 'state.jwtPayload.userId');
      const isAdmin = _.get(req, 'state.jwtPayload.isAdmin');
      if (collection.userId !== userId || !isAdmin) {
        if (collection.status !== CollectionStatusEnum.published) {
          throw new Error('ex_cannot_find_collection');
        }
      }

      return res.success(null, new CollectionModel(collection, 'fetch'));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public getMyCollections = async (req: IERequest, res: IEResponse) => {
    try {
      let expression: object = { userId: req.state.jwtPayload.userId };
      const isAdmin = _.get(req, 'state.jwtPayload.isAdmin');
      if (!isAdmin) {
        expression['isDeleted'] = false;
      }
      const resultObject = await getCollections(expression);

      return res.success(null, resultObject);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public create = async (req: IERequest, res: IEResponse) => {
    try {
      const model = new CollectionModel(req.body, 'post');
      if (!model.name || !model.name.trim()) {
        throw new Error('ex_no_name');
      }
      model.name = model.name.trim();
      model.userId = req.state.jwtPayload.userId;
      const collection = await saveNewCollection(model);

      return res.success("msg_create_collection_success", collection);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public update = async (req: IERequest, res: IEResponse) => {
    try {
      const model = new CollectionModel(req.body, 'put');      
      const expression = { _id: req.params.collectionId, userId: req.state.jwtPayload.userId, isDeleted: false };
      await getCollection(expression);
      if (model.name) {
        model.name = model.name.trim();
      }

      return res.success("msg_update_collection_success", await updateCollection(expression, model));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public remove = async (req: IERequest, res: IEResponse) => {
    try {
      const expression = { _id: req.params.collectionId, userId: req.state.jwtPayload.userId, isDeleted: false };
      const collection = await getCollection(expression);      
      if (!collection) {
        throw new Error('ex_cannot_find_collection');
      }
      await updateCollection(expression, { isDeleted: true });

      return res.success("msg_remove_collection_success", null);
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public addBlogToCollection = async (req: IERequest, res: IEResponse) => {
    try {
      const expression = { _id: req.params.collectionId, userId: req.state.jwtPayload.userId, isDeleted: false };
      const collection = await getCollection(expression);      
      if (!collection) {
        throw new Error('ex_cannot_find_collection');
      }

      return res.success("msg_blog_added_to_collection", await updateCollection(expression, { blogIds: Array.from(new Set([...collection.blogIds, req.params.blogId])) }));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

  public removeBlogFromCollection = async (req: IERequest, res: IEResponse) => {
    try {
      const expression = { _id: req.params.collectionId, userId: req.state.jwtPayload.userId, isDeleted: false };
      const collection = await getCollection(expression);      
      if (!collection) {
        throw new Error('ex_cannot_find_collection');
      }
      const blogIds = collection.blogIds.filter(blogId => (blogId !== req.params.blogId))

      return res.success("msg_blog_removed_from_collection", await updateCollection(expression, { blogIds }));
    }
    catch (err) {
      return res.throwErr(err);
    }
  }

}