import { Expose, plainToClass } from 'class-transformer';
import { ValidateIf, validateSync, IsIn } from 'class-validator';
import BlogStatus from '../enum/blogStatus';
import BlogLanguage from '../enum/blogLanguage';
import 'reflect-metadata';

export default class BlogModel {

  @Expose({ groups: ['get', 'fetch', 'create', 'update'] })
  public _id: string;

  @Expose({ groups: ['get', 'fetch'] })
  public userId: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'create', 'put', 'update'] })
  public title: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'create', 'put', 'update'] })
  public cover: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'create', 'put', 'update'] })
  public content: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'create', 'put', 'update'] })
  public categories: string[];

  @Expose({ groups: ['get', 'fetch', 'post', 'create', 'put', 'update'] })
  public tags: string[];

  @Expose({ groups: ['get', 'fetch', 'post', 'create', 'put', 'update'] })
  @IsIn(Object.values(BlogLanguage), { message: 'ex_incorrect_blog_language' })
  @ValidateIf(o => o.language && o.language !== null)
  public language: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'create', 'put', 'update'] })
  @IsIn(Object.values(BlogStatus), { message: 'ex_incorrect_blog_status' })
  @ValidateIf(o => o.status && o.status !== null)
  public status: string;

  @Expose({ groups: ['fetch'] })
  public likes: number;

  @Expose({ groups: ['fetch'] })
  public comments: number;

  @Expose({ groups: ['fetch', 'put'] })
  public viewed: number;

  @Expose({ groups: ['get', 'put'] })
  public isDeleted: boolean;

  @Expose({ groups: ['get', 'fetch', 'create', 'update'] })
  public createdDate: Date;

  @Expose({ groups: ['get', 'fetch', 'create', 'update'] })
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