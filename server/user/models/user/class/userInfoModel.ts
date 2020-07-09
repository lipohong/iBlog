import { Expose, plainToClass } from 'class-transformer';
import { IsString, ValidateIf, validateSync } from 'class-validator';
import 'reflect-metadata';

export default class UserInfoModel {

  @Expose({ groups: ['get', 'fetch', 'put', 'post'] })
  @IsString({ message: 'ex_input_accept_string_only' })
  @ValidateIf(o => o.avatar && o.avatar !== null)
  public avatar: string;

  @Expose({ groups: ['get', 'fetch', 'put', 'post'] })
  @IsString({ message: 'ex_input_accept_string_only' })
  @ValidateIf(o => o.avatar && o.avatar !== null)
  public description: string;

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