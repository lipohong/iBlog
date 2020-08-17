import { validateSync } from 'class-validator';
import { Expose, plainToClass, Type } from 'class-transformer';
import BlogModel from '../class/blogModel';
import { IPaginationModel } from '../../commonModel';

export default class BlogListPaginationModel {
  @Expose()
  @Type(() => BlogModel)
  public blogList: BlogModel[];

  @Expose()
  public pagination: IPaginationModel;

  constructor(data: Partial<BlogListPaginationModel>) {
    if (data) {
      Object.assign(this, plainToClass(BlogListPaginationModel, data, { excludeExtraneousValues: true }));

      this.blogList = data.blogList.map(blog => {
        return new BlogModel(blog, 'get');
      });

      const errors = validateSync(this);
      if (errors.length > 0) {
        throw errors;
      }
    }
  }
}
