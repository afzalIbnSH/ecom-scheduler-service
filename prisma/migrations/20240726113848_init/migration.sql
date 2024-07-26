-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastRunTimestamp" TIMESTAMP(3),
    "nextRunTimestamp" TIMESTAMP(3) NOT NULL,
    "attributes" JSONB NOT NULL,
    "interval" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
