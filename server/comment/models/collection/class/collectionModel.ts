import { Expose, plainToClass } from 'class-transformer';
import { ValidateIf, validateSync, IsIn } from 'class-validator';
import CollectionStatusEnum from '../enum/collectionStatusEnum';
import 'reflect-metadata';

export default class CollectionModel {

  @Expose({ groups: ['get', 'fetch'] })
  public _id: string;

  @Expose({ groups: ['get'] })
  public userId: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'put'] })
  public name: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'put'] })
  public description: string;

  @Expose({ groups: ['get', 'fetch'] })
  public blogIds: string[];

  @Expose({ groups: ['get', 'fetch', 'put'] })
  @IsIn(Object.values(CollectionStatusEnum), { message: 'ex_incorrect_collection_status' })
  @ValidateIf(o => o.status && o.status !== null)
  public status: string;

  @Expose({ groups: ['get', 'put'] })
  public isDeleted: boolean;

  @Expose({ groups: ['get', 'fetch'] })
  public createdDate: Date;

  @Expose({ groups: ['get', 'fetch'] })
  public updatedDate: Date;

  constructor(data: Partial<CollectionModel>, group: string) { 
    if (data) {
      data = JSON.parse(JSON.stringify(data));

      Object.assign(this, plainToClass(CollectionModel, data, { excludeExtraneousValues: true, groups: [group] }));

      const errors = validateSync(this);
      if (errors.length > 0) {
        throw errors;
      }
    }
  }
}