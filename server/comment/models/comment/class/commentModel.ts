import { Expose, plainToClass } from 'class-transformer';
import { ValidateIf, validateSync, IsIn } from 'class-validator';
import CommentStatus from '../enum/commentStatus';
import 'reflect-metadata';

export default class CommentModel {

  @Expose({ groups: ['get', 'fetch', 'blogIdReturn'] })
  public _id: string;

  @Expose({ groups: ['get', 'fetch', 'blogIdReturn', 'post', 'put'] })
  public blogId: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'put'] })
  public userId: string;

  @Expose({ groups: ['get', 'fetch', 'blogIdReturn', 'post', 'put'] })
  public comment: string;

  @Expose({ groups: ['get', 'fetch', 'blogIdReturn', 'post', 'put'] })
  @IsIn(Object.values(CommentStatus), { message: 'ex_incorrect_comment_status' })
  @ValidateIf(o => o.status && o.status !== null)
  public status: string;

  @Expose({ groups: ['get', 'put'] })
  public isDeleted: boolean;

  @Expose({ groups: ['get', 'fetch', 'blogIdReturn'] })
  public createdDate: Date;

  @Expose({ groups: ['get', 'fetch', 'blogIdReturn'] })
  public updatedDate: Date;

  constructor(data: Partial<CommentModel>, group: string) { 
    if (data) {
      data = JSON.parse(JSON.stringify(data));

      Object.assign(this, plainToClass(CommentModel, data, { excludeExtraneousValues: true, groups: [group] }));

      const errors = validateSync(this);
      if (errors.length > 0) {
        throw errors;
      }
    }
  }
}