import {AddressModel} from './Address.model';
import {CompanyModel} from './Company.model';

export interface UserModel {
  id: number;
  name: string;
  username: string;
  email: string;
  address: AddressModel;
  phone: string;
  website: string;
  company: CompanyModel;
}
