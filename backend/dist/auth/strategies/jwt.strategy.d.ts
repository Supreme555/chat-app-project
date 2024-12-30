import { UsersService } from '../../users/users.service';
import { Request } from 'express';
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(request: Request, payload: any): Promise<import("../../users/entities/user.entity").User>;
}
export {};
