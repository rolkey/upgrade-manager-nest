import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { UploadFileDto } from './dto/upload-file.dto';

@Injectable()
export class UpgradesService {
  // 注入configService: ConfigService
  private upgrades: any[];
  private uploadFilePath: string;

  constructor(private configService: ConfigService) {
    this.uploadFilePath = configService.get('UPLOAD_FILE_PATH');
    console.log('UPLOAD_FILE_PATH:', this.uploadFilePath);
    this.loadUpgrades();
  }

  private loadUpgrades() {
    const filePath = join(__dirname, '..', '..', 'public', 'upgrades.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    this.upgrades = JSON.parse(fileContent);
  }

  getAllUpgrades() {
    console.log('getAllUpgrades called', this.upgrades);
    return this.upgrades;
  }

  getUpgrade(version: string) {
    return this.upgrades.find(upgrade => upgrade.version === version);
  }

  async uploadFile(file: Express.Multer.File, uploadFileDto: UploadFileDto) {
    const filePath = join(this.uploadFilePath, file.originalname);

    // 保存文件
    writeFileSync(filePath, file.buffer);

    // 更新 upgrades.json
    this.updateUpgradesJson(uploadFileDto.version, file.originalname);

    return { message: 'File uploaded successfully', filePath };
  }

  async deleteUpgrade(version: string) {
    const upgradesFilePath = join(__dirname, '..', '..', 'public', 'upgrades.json');
    let upgrades = [];

    // 读取现有的 upgrades.json
    try {
      const fileContent = readFileSync(upgradesFilePath, 'utf-8');
      upgrades = JSON.parse(fileContent);
    } catch (e) {
      // 写错误日志
      console.error('Error reading upgrades.json:', e);
    }

    // 查找并删除指定版本
    upgrades = upgrades.filter(upgrade => upgrade.version !== version);
    this.upgrades = upgrades;

    // 写入更新后的内容到 upgrades.json
    writeFileSync(upgradesFilePath, JSON.stringify(upgrades, null, 2));

    // 删除对应的文件
    const filePath = join(this.uploadFilePath, version + '.zip'); // 假设文件名为版本号.zip
    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath);
      } catch (e) {
        // 处理文件删除错误，写错误日志
        console.error('Error deleting file:', e);
      }
    } else {
      console.log(`File ${filePath} does not exist, skipping delete.`);
    }
  }

  private updateUpgradesJson(version: string, filename: string) {
    const upgradesFilePath = join(__dirname, '..', '..', 'public', 'upgrades.json');
    let upgrades = [];

    // 读取现有的 upgrades.json
    try {
      const fileContent = readFileSync(upgradesFilePath, 'utf-8');
      upgrades = JSON.parse(fileContent);
    } catch (e) {
      // 如果文件不存在或格式错误，写入日志
      console.error('Error reading upgrades.json:', e);
    }

    // 添加新的版本信息
    upgrades.push({ version, filename });
    this.upgrades = upgrades;

    // 写入更新后的内容到 upgrades.json
    writeFileSync(upgradesFilePath, JSON.stringify(upgrades, null, 2));
  }
}
