import { Expose, plainToClass } from 'class-transformer';
import { ValidateIf, validateSync, IsIn } from 'class-validator';
import 'reflect-metadata';

export default class LikeModel {

  @Expose({ groups: ['get', 'fetch', 'post', 'put'] })
  public _id: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'put'] })
  public blogId: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'put'] })
  public userId: string;

  @Expose({ groups: ['get', 'fetch'] })
  public createdDate: Date;

  @Expose({ groups: ['get', 'fetch'] })
  public updatedDate: Date;

  constructor(data: Partial<LikeModel>, group: string) { 
    if (data) {
      data = JSON.parse(JSON.stringify(data));

      Object.assign(this, plainToClass(LikeModel, data, { excludeExtraneousValues: true, groups: [group] }));

      const errors = validateSync(this);
      if (errors.length > 0) {
        throw errors;
      }
    }
  }
}