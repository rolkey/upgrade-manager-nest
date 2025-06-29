import { IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  version: string;

  // 这里可以添加更多字段，例如文件描述等
  @IsNotEmpty()
  file: Express.Multer.File;
}
