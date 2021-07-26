import { userError } from './dtos/register-response.dto';
import { createUserDto } from './dtos/create-user.dto';
import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import argon2 from 'argon2';
import pwValidator from 'password-validator';
import { UserDto } from './dtos/user.dto';

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
  async createOne(createUserDto: createUserDto): Promise<UserDto> {
    const { username, password, email } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() },
      ],
    });

    if (existingUser) {
      console.log('User exist', existingUser);
      throw new BadRequestException([
        {
          field: 'username',
          error: 'Username or email is taken',
        },
        {
          field: 'email',
          error: 'Username or email is taken',
        },
      ]);
    }

    this.validateRegister(createUserDto);

    const hashedPassword = await argon2.hash(password);
    const newUser = this.userRepository.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return {
      email: newUser.email,
      bio: newUser.bio,
      username: newUser.username,
    };
  }

  private validateRegister(user: createUserDto) {
    const { username, email, password } = user;
    const errors: userError[] = [];
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!username) {
      errors.push({ field: 'username', error: 'Username cannot be empty' });
    }
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', error: 'Email is not valid' });
      // throw new BadRequestException();
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
    if (!passwordSchema.validate(password)) {
      errors.push({
        field: 'password',
        error:
          'Password must have at least 8 characters, less than 100 characters, 1 uppercase letter, 1 lowercase letter and no spaces',
      });
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }
}
