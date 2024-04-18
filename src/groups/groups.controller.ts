import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';
import { memberRolesGuard } from 'src/group-members/guard/members.guard';
import { MemberRoles } from 'src/group-members/decorator/memberRoles.decorator';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';

@UseGuards(JWTAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // 그룹 생성 //
  @ApiTags('groups')
  @ApiResponse({ description: '성공', status: 200 })
  @ApiOperation({ summary: '그룹 생성 API', description: '그룹을 생성한다.' })
  @Post()
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @UserInfo() users: Users,
  ) {
    console.log('그룹컨트롤러', users.userId);
    console.log('그룹컨트롤러', createGroupDto);
    return await this.groupsService.createGroup(createGroupDto, users.userId);
  }

  // 그룹 모든 목록 조회 //
  @ApiTags('groups')
  @ApiOperation({
    summary: '그룹 모든 목록 조회 API',
    description: '그룹의 모든 목록을 조회',
  })
  @ApiResponse({
    description: '성공적으로 그룹 조회를 하였습니다.',
    status: 200,
  })
  @Get()
  async findAllGroups() {
    return await this.groupsService.findAllGroups();
  }

  // 그룹 상세 조회 //
  @ApiTags('groups')
  @ApiOperation({
    summary: '그룹 상세 조회 API',
    description: '특정 그룹의 상세 정보를 조회',
  })
  @ApiResponse({
    description: '성공적으로 그룹의 상세 정보를 조회하였습니다.',
    status: 200,
  })
  @ApiResponse({
    description: '그룹이 존재하지 않습니다.',
    status: 404,
  })
  @ApiResponse({
    description: '유효하지 않은 그룹 ID입니다.',
    status: 400,
  })
  @Get(':groupId')
  async findOneGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupsService.findOneGroup(groupId);
  }

  // 그룹 수정 //
  @ApiTags('groups')
  @ApiOperation({
    summary: '그룹 업데이트 API',
    description: '그룹의 목록을 수정합니다.',
  })
  @ApiResponse({
    description: '성공적으로 그룹을 수정하였습니다.',
    status: 201,
  })
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Patch(':groupId')
  async updateGroup(
    @Param('groupId') groupId: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return await this.groupsService.updateGroup(groupId, updateGroupDto);
  }

  // 그룹 삭제 //
  @ApiTags('groups')
  @ApiOperation({ summary: '그룹 삭제 API', description: '그룹을 삭제합니다.' })
  @ApiResponse({
    description: '성공적으로 그룹을 삭제하였습니다.',
    status: 201,
  })
  @Delete(':groupId')
  async deleteGroup(@Param('groupId') groupId: number) {
    return await this.groupsService.deleteGroup(groupId);
  }
}
