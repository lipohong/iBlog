import { Expose, plainToClass } from 'class-transformer';
import { IsString, ValidateIf, validateSync } from 'class-validator';
import UserInfoModel  from './userInfoModel';
import 'reflect-metadata';

export default class UserModel {

  @Expose({ groups: ['get', 'fetch', 'post'] })
  public _id: string;

  @Expose({ groups: ['get', 'fetch', 'put', 'post'] })
  @IsString({ message: 'ex_input_accept_string_only' })
  @ValidateIf(o => o.username && o.username !== null)
  public username: string;

  @Expose({ groups: ['get', 'post', 'resetPassword'] })
  public password: string;

  @Expose({ groups: ['get', 'fetch', 'put', 'post'] })
  @IsString({ message: 'ex_input_accept_string_only' })
  @ValidateIf(o => o.email && o.email !== null)
  public email: string;

  @Expose({ groups: ['get', 'fetch', 'put', 'post'] })
  @ValidateIf(o => o.userInfo && o.userInfo !== null)
  public userInfo: UserInfoModel;

  constructor(data: Partial<UserModel>, group: string) { 
    if (data) {
      data = JSON.parse(JSON.stringify(data));

      Object.assign(this, plainToClass(UserModel, data, { excludeExtraneousValues: true, groups: [group] }));

      const errors = validateSync(this);
      if (errors.length > 0) {
        throw errors;
      }
    }
  }
}