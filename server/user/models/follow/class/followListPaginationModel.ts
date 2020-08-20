import { validateSync } from 'class-validator';
import { Expose, plainToClass, Type } from 'class-transformer';
import FollowModel from './followModel';
import { IPaginationModel } from '../../commonModel';

export default class FollowListPaginationModel {
  @Expose()
  @Type(() => FollowModel)
  public followList: FollowModel[];

  @Expose()
  public pagination: IPaginationModel;

  constructor(data: Partial<FollowListPaginationModel>) {
    if (data) {
      Object.assign(this, plainToClass(FollowListPaginationModel, data, { excludeExtraneousValues: true }));

      this.followList = data.followList.map(follow => {
        return new FollowModel(follow, 'byUserIdReturn');
      });

      const errors = validateSync(this);
      if (errors.length > 0) {
        throw errors;
      }
    }
  }
}