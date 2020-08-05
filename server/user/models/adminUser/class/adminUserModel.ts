import { Expose, plainToClass } from 'class-transformer';
import { IsString, ValidateIf, validateSync } from 'class-validator';
import 'reflect-metadata';

export default class UserAdminModel {

  @Expose({ groups: ['get', 'fetch'] })
  public _id: string;

  @Expose({ groups: ['get', 'fetch'] })
  @IsString({ message: 'ex_input_accept_string_only' })
  @ValidateIf(o => o.userId && o.userId !== null)
  public userId: string

  @Expose({ groups: ['get', 'fetch'] })
  @IsString({ message: 'ex_input_accept_string_only' })
  @ValidateIf(o => o.email && o.email !== null)
  public email: string;

  @Expose({ groups: ['get', 'fetch'] })
  @ValidateIf(o => o.isDeleted && o.isDeleted !== null)
  public isDeleted: boolean;

  constructor(data: Partial<UserAdminModel>, group: string) { 
    if (data) {
      data = JSON.parse(JSON.stringify(data));

      Object.assign(this, plainToClass(UserAdminModel, data, { excludeExtraneousValues: true, groups: [group] }));

      const errors = validateSync(this);
      if (errors.length > 0) {
        throw errors;
      }
    }
  }
}