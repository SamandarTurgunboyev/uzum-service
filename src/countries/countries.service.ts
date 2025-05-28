import { Injectable } from '@nestjs/common';
import { Country, ICountry } from 'country-state-city';

@Injectable()
export class CountriesService {
  getAllCountries(): ICountry[] {
    return Country.getAllCountries();
  }

  getCountryByCode(isoCode: string): ICountry | undefined {
    return Country.getAllCountries().find((country) => country.isoCode === isoCode.toUpperCase());
  }
}