import { Expose, plainToClass } from 'class-transformer';
import { validateSync, IsNotEmpty } from 'class-validator';
import 'reflect-metadata';

export default class UserInfoModel {

  @Expose({ groups: ['post'] })
  @IsNotEmpty()
  public accessToken: string;

  @Expose({ groups: ['post'] })
  @IsNotEmpty()
  public email: string;

  constructor(data: Partial<UserInfoModel>, group: string) { 
    if (data) {
      data = JSON.parse(JSON.stringify(data));

      Object.assign(this, plainToClass(UserInfoModel, data, { excludeExtraneousValues: true, groups: [group] }));

      const errors = validateSync(this);
      if (errors.length > 0) {
        throw errors;
      }
    }
  }
}