import { Expose, plainToClass } from 'class-transformer';
import { ValidateIf, validateSync, IsIn } from 'class-validator';
import BlogStatus from '../enum/blogStatus';
import 'reflect-metadata';

export default class BlogModel {

  @Expose({ groups: ['get', 'fetch'] })
  public _id: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'put'] })
  public userId: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'put'] })
  public title: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'put'] })
  public content: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'put'] })
  public categories: string[];

  @Expose({ groups: ['get', 'fetch', 'post', 'put'] })
  public tags: string[];

  @Expose({ groups: ['get', 'fetch', 'post', 'put'] })
  @IsIn(Object.values(BlogStatus), { message: 'ex_incorrect_blog_status' })
  @ValidateIf(o => o.status && o.status !== null)
  public status: string;

  @Expose({ groups: ['get', 'put'] })
  public isDeleted: boolean;

  @Expose({ groups: ['get', 'fetch'] })
  public createdDate: Date;

  @Expose({ groups: ['get', 'fetch'] })
  public updatedDate: Date;

  constructor(data: Partial<BlogModel>, group: string) { 
    if (data) {
      data = JSON.parse(JSON.stringify(data));

      Object.assign(this, plainToClass(BlogModel, data, { excludeExtraneousValues: true, groups: [group] }));

      const errors = validateSync(this);
      if (errors.length > 0) {
        throw errors;
      }
    }
  }
}