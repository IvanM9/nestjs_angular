import { ApiProperty } from '@nestjs/swagger';

export class ImportFromExcelDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  // @IsNotEmpty()
  file: Express.Multer.File;
}
