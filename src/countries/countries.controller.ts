import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ICountry } from 'country-state-city';
import { CountriesService } from './countries.service';

@ApiBearerAuth('JWT-auth')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @HttpCode(200)
  @Get()
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          name: 'Afghanistan',
          isoCode: 'AF',
          flag: '🇦🇫',
          phonecode: '93',
          currency: 'AFN',
          latitude: '33.00000000',
          longitude: '65.00000000',
          timezones: [
            {
              zoneName: 'Asia/Kabul',
              gmtOffset: 16200,
              gmtOffsetName: 'UTC+04:30',
              abbreviation: 'AFT',
              tzName: 'Afghanistan Time',
            },
          ],
        },
      ],
    },
  })
  getAllCountries(): any {
    return this.countriesService.getAllCountries();
  }

  @HttpCode(200)
  @Get(':isoCode')
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        name: 'Afghanistan',
        isoCode: 'AF',
        flag: '🇦🇫',
        phonecode: '93',
        currency: 'AFN',
        latitude: '33.00000000',
        longitude: '65.00000000',
        timezones: [
          {
            zoneName: 'Asia/Kabul',
            gmtOffset: 16200,
            gmtOffsetName: 'UTC+04:30',
            abbreviation: 'AFT',
            tzName: 'Afghanistan Time',
          },
        ],
      },
    },
  })
  getCountryByCode(@Param('isoCode') isoCode: string): ICountry | undefined {
    return this.countriesService.getCountryByCode(isoCode);
  }
}
