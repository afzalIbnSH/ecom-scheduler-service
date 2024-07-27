import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ example: 'Example Job', description: 'The name of the job' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: { key: 'value' },
    description: 'The attributes of the job',
    type: 'object',
  })
  @IsObject()
  @IsNotEmpty()
  attributes: object;

  @ApiProperty({
    example: '* * * * *',
    description: 'The cron interval for the job',
  })
  @IsString()
  @IsNotEmpty()
  interval: string;
}
