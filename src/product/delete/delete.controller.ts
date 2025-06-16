import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { DeleteService } from './delete.service';

@Controller('product')
@ApiTags('Product')
export class DeleteController {
  constructor(private readonly productService: DeleteService) {}

  @HttpCode(201)
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    return this.productService.deleteProduct(id, user);
  }
}
