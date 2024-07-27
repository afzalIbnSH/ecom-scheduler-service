import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from '@prisma/client';
import { CreateJobDto } from './dto/create-job.dto';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all jobs' })
  @ApiResponse({
    status: 200,
    description: 'List of all jobs',
  })
  async getJobs(): Promise<Job[]> {
    return this.jobsService.getJobs();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by ID' })
  @ApiResponse({
    status: 200,
    description: 'The job with the given ID',
  })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getJobById(@Param('id', ParseIntPipe) id: number): Promise<Job> {
    const job = await this.jobsService.getJobById(id);
    if (!job) throw new NotFoundException();
    return job;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new job' })
  @ApiResponse({ status: 201, description: 'The created job' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createJob(@Body() createJobDto: CreateJobDto): Promise<Job> {
    return this.jobsService.createJob(createJobDto);
  }
}
