/**
 * Title: employee.interface.ts
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/26/23
 * Description: ts for the nodebucket project
*/

import { Item } from './item.interface'

export interface Employee {
  empId: number;
  firstName: string;
  lastName: string;
  todo: Item[];
  done: Item[];
}
