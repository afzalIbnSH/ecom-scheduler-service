import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Job } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { parseExpression } from 'cron-parser';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async getJobs(): Promise<Job[]> {
    return this.prisma.job.findMany();
  }

  async getJobById(id: number): Promise<Job | null> {
    return this.prisma.job.findUnique({
      where: { id },
    });
  }

  async createJob(createJobDto: CreateJobDto): Promise<Job> {
    let nextRunTimestamp: Date;
    try {
      nextRunTimestamp = this.calculateNextRun(createJobDto.interval);
    } catch (err) {
      throw new Error(`Invalid cron string: ${createJobDto.interval}`);
    }

    return this.prisma.job.create({
      data: {
        name: createJobDto.name,
        nextRunTimestamp,
        attributes: createJobDto.attributes,
        interval: createJobDto.interval,
      },
    });
  }

  private calculateNextRun(intervalStr: string): Date {
    const interval = parseExpression(intervalStr);
    const next = interval.next();

    // Our scheduler runs every minute, so can't support sub-minute crons
    const subsequent = interval.next();
    if (subsequent.getTime() - next.getTime() < 60000) {
      throw new Error(
        'Cron expressions with intervals less than one minute are not allowed.',
      );
    }

    return next.toDate();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async runJobs() {
    const now = new Date();
    const jobs = await this.prisma.job.findMany({
      where: {
        nextRunTimestamp: {
          lte: now,
        },
      },
    });

    const jobPromises = jobs.map((job) => this.processJob(job, now));
    while (jobPromises.length > 0) {
      const jobBatch = jobPromises.splice(0, 10);
      await Promise.all(jobBatch);
    }
  }

  private async processJob(job: Job, now: Date) {
    try {
      // Execute the job (dummy implementation)
      console.log(`Executing job: ${job.name}`);
      await this.prisma.job.update({
        where: { id: job.id },
        data: {
          lastRunTimestamp: now,
          nextRunTimestamp: this.calculateNextRun(job.interval),
        },
      });
    } catch (error) {
      console.error(`Error executing job ${job.id}:`, error);
      return null;
    }
  }
}
