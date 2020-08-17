import { validateSync } from 'class-validator';
import { Expose, plainToClass, Type } from 'class-transformer';
import CommentModel from './commentModel';
import { IPaginationModel } from '../../commonModel';

export default class CommentListPaginationModel {
  @Expose()
  @Type(() => CommentModel)
  public commentList: CommentModel[];

  @Expose()
  public pagination: IPaginationModel;

  constructor(data: Partial<CommentListPaginationModel>) {
    if (data) {
      Object.assign(this, plainToClass(CommentListPaginationModel, data, { excludeExtraneousValues: true }));

      this.commentList = data.commentList.map(comment => {
        return new CommentModel(comment, 'blogIdReturn');
      });

      const errors = validateSync(this);
      if (errors.length > 0) {
        throw errors;
      }
    }
  }
}
