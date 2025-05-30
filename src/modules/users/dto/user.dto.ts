import { IsEmail, IsNotEmpty } from "@nestjs/class-validator";

class UserDto {

}

class CreateUserDto {
    firstName: string
    lastName: string
}