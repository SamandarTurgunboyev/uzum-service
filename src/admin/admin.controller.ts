import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('auth')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }
    @HttpCode(201)
    @Post("/login/admin")
    async loginAdmin(@Body() data: { phone: string, password: string }) {
        return this.adminService.loginAdmin(data)
    }
}
