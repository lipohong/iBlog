import { Expose, plainToClass } from 'class-transformer';
import { IsString, ValidateIf, validateSync } from 'class-validator';
import UserInfoModel  from './userInfoModel';
import 'reflect-metadata';

export default class UserModel {

  @Expose({ groups: ['get', 'fetch'] })
  public _id: string;

  @Expose({ groups: ['get', 'fetch', 'put', 'update', 'post'] })
  @IsString({ message: 'ex_input_accept_string_only' })
  @ValidateIf(o => o.username && o.username !== null)
  public username: string;

  @Expose({ groups: ['get', 'post', 'resetPassword'] })
  public password: string;

  @Expose({ groups: ['get', 'fetch', 'put', 'post'] })
  @IsString({ message: 'ex_input_accept_string_only' })
  @ValidateIf(o => o.email && o.email !== null)
  public email: string;

  @Expose({ groups: ['get', 'fetch', 'put'] })
  @ValidateIf(o => o.isActived && o.isActived !== null)
  public isActived: boolean;

  @Expose({ groups: ['get', 'fetch', 'put'] })
  @ValidateIf(o => o.isDeleted && o.isDeleted !== null)
  public isDeleted: boolean;

  @Expose({ groups: ['get', 'fetch', 'post', 'put'] })
  @IsString({ message: 'ex_input_accept_string_only' })
  @ValidateIf(o => o.verifyCode && o.verifyCode !== null)
  public verifyCode: string;

  @Expose({ groups: ['get', 'fetch', 'put', 'update'] })
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