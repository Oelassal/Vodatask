import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom Character Limiting Pipe to limit post body characters
 * */
@Pipe({
  name: 'limitChar',
  standalone: false
})
export class LimitCharPipe implements PipeTransform {
  transform(value: string, limit: number = 100): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }

}
