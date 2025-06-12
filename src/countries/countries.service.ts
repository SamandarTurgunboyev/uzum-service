import { Injectable } from '@nestjs/common';
import { Country, ICountry } from 'country-state-city';

@Injectable()
export class CountriesService {
  getAllCountries(): ICountry[] {
    const allCountries = Country.getAllCountries();

    // Unique telefon kodlar bo‘yicha filterlash
    const seenPhonecodes = new Set<string>();
    const uniqueCountries = allCountries.filter((country) => {
      if (seenPhonecodes.has(country.phonecode)) {
        return false; // Bu telefon kodi oldin ishlatilgan
      } else {
        seenPhonecodes.add(country.phonecode);
        return true;
      }
    });

    return uniqueCountries;
  }

  getCountryByCode(isoCode: string): ICountry | undefined {
    return Country.getAllCountries().find(
      (country) => country.isoCode === isoCode.toUpperCase(),
    );
  }
}
