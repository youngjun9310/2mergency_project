import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateGroupMemberDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: '이메일이 존재하지 않습니다.' })
  @ApiProperty({
    description: '그룹 멤버의 이메일 주소',
    example: 'user@example.com',
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @ApiProperty({
    description: '그룹 멤버의 별명',
    example: 'nickname',
    required: true,
  })
  nickname: string;
}
