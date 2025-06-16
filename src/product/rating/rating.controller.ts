import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RatingService } from './rating.service';

@Controller('/product/rating')
@ApiTags('Product')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @ApiBody({ schema: { example: { rating: 'number', product: 'productId' } } })
  @UseGuards(AuthGuard)
  async createRating(
    @Body() data: { rating: string; product: string },
    @Req() req: Request,
  ) {
    const user = req['user'];
    const res = await this.ratingService.createRating(
      user,
      data.product,
      data.rating,
    );

    return res;
  }
}
