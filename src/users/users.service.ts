import { createUserDto } from './dtos/create-user.dto';
import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import argon2 from 'argon2';
import pwValidator from 'password-validator';

// This should be a real class/interface representing a user entity
// export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findOneByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }
  async createOne(createUserDto: createUserDto): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username.toLowerCase() },
        { email: createUserDto.email.toLowerCase() },
      ],
    });
    console.log(createUserDto);
    console.log(existingUser);
    if (existingUser) {
      throw new BadRequestException({ error: 'Username or email is taken' });
    }
    const passwordSchema = new pwValidator();
    passwordSchema
      .is()
      .min(8) // Minimum length 8
      .is()
      .max(100) // Maximum length 100
      .has()
      .uppercase() // Must have uppercase letters
      .has()
      .lowercase() // Must have lowercase letters
      .has()
      .not()
      .spaces(); // Should not have spaces
    if (!passwordSchema.validate(createUserDto.password)) {
      console.log('invalid');
      throw new BadRequestException(
        'password is invalid',
        'must have at least 8 characters, less than 100 characters, 1 uppercase letter, 1 lowercase letter and no spaces',
      );
    }
    const hashedPassword = await argon2.hash(createUserDto.password);
    const newUser = this.userRepository.create({
      username: createUserDto.username.toLowerCase(),
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
    });
    console.log(newUser);
    await this.userRepository.save(newUser);

    return true;
  }
}
