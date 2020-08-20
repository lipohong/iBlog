import { Expose, plainToClass } from 'class-transformer';
import { IsString, IsIn, ValidateIf, validateSync } from 'class-validator';
import FollowStatus from '../enum/followStatusEnum';
import 'reflect-metadata';

export default class FollowModel {

  @Expose({ groups: ['get', 'fetch', 'byUserIdReturn'] })
  public _id: string;

  @Expose({ groups: ['get', 'fetch', 'post'] })
  @IsString({ message: 'ex_input_accept_string_only' })
  @ValidateIf(o => o.follow && o.follow !== null)
  public follow: string;

  @Expose({ groups: ['get', 'post', 'byUserIdReturn'] })
  @IsString({ message: 'ex_input_accept_string_only' })
  @ValidateIf(o => o.userId && o.userId !== null)
  public userId: string;

  @Expose({ groups: ['get', 'fetch', 'post', 'put'] })
  @IsIn(Object.values(FollowStatus), { message: 'ex_incorrect_follow_status' })
  @ValidateIf(o => o.status && o.status !== null)
  public status: string;

  @Expose({ groups: ['get', 'fetch', 'byUserIdReturn'] })
  public updatedDate: Date;

  @Expose({ groups: ['get', 'fetch', 'byUserIdReturn'] })
  public createdDate: Date;

  constructor(data: Partial<FollowModel>, group: string) { 
    if (data) {
      data = JSON.parse(JSON.stringify(data));

      Object.assign(this, plainToClass(FollowModel, data, { excludeExtraneousValues: true, groups: [group] }));

      const errors = validateSync(this);
      if (errors.length > 0) {
        throw errors;
      }
    }
  }
}