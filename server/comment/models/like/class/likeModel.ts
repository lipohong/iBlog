import { Expose, plainToClass } from 'class-transformer';
import { ValidateIf, validateSync, IsIn } from 'class-validator';
import 'reflect-metadata';

export default class LikeModel {

  @Expose({ groups: ['get', 'likeReturn', 'getLikesByBlogId'] })
  public _id: string;

  @Expose({ groups: ['get', 'post'] })
  public blogId: string;

  @Expose({ groups: ['get', 'post', 'getLikesByBlogId'] })
  public userId: string;

  @Expose({ groups: ['get', 'getLikesByBlogId'] })
  public createdDate: Date;

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