import {
  Controller,
  Body,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UpgradesService } from './upgrades.service';
import { UploadFileDto } from './dto/upload-file.dto';

@Controller('upgrades')
export class UpgradesController {
  constructor(private readonly upgradesService: UpgradesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto
  ) {
    return this.upgradesService.uploadFile(file, uploadFileDto);
  }

  @Delete(':version')
  async deleteUpgrade(@Param('version') version: string) {
    return this.upgradesService.deleteUpgrade(version);
  }

  @Get()
  getAllUpgrades() {
    return this.upgradesService.getAllUpgrades();
  }

  @Get(':version')
  getUpgrade(@Param('version') version: string) {
    return this.upgradesService.getUpgrade(version);
  }
}
