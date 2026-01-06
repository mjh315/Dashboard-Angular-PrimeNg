import { Injectable } from '@angular/core';
import * as jalaali from 'jalaali-js';

@Injectable({ providedIn: 'root' })
export class JalaliDateAdapterService {

  toGregorian(jy: number, jm: number, jd: number): Date {
    const g = jalaali.toGregorian(jy, jm, jd);
    return new Date(g.gy, g.gm - 1, g.gd);
  }

  toJalali(date: Date) {
    const j = jalaali.toJalaali(date);
    return {
      jy: j.jy,
      jm: j.jm,
      jd: j.jd,
      formatted: `${j.jy}/${('0'+j.jm).slice(-2)}/${('0'+j.jd).slice(-2)}`
    };
  }
}
