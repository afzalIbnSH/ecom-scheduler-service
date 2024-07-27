# Scheduler Microservice

## Setup and Running Instructions

### Prerequisites

- Node.js (v18.17.0)
- npm (v10.8.2)
- PostgreSQL (v16.3)

### Setup

1. Clone the repository:

```

git clone https://github.com/afzalIbnSH/ecom-scheduler-service.git
cd ecom-scheduler-service

```

2. Install dependencies:

```

npm install

```

3. Add an `.env` file with following environment variables;

- `DATABASE_URL`. PostgreSQL URL in the below format;
  ```
  DATABASE_URL="postgresql://username:password@localhost:5432/scheduler_db?schema=public"
  ```

4. Set up the database:

```

npx prisma db push

```

### Running the Application

1. Start the development server:

```

npm run start:dev

```

2. The server should now be running on `http://localhost:3000`

### API Documentation

Once the server is running, you can access the Swagger API documentation at:
`http://localhost:3000/api`

## Scalability Considerations

I think the most glaring changes required are;

1. **Dedicated Job Execution Service**: Deploy a separate service for job execution, ideally on an auto-scaling platform such as ECS or Kubernetes. Refine the scheduler to focus solely on identifying due jobs and enqueueing them to a messaging system like AWS SQS or RabbitMQ, offloading the execution responsibility to the new dedicated service fo execution. Let it scale independently from the scheduling logic.

2. **Database Optimization**: Migrate to a managed, scalable database solution like AWS RDS to handle increased load and provide better performance as the number of jobs grow.

3. **User Authentication and Authorization**: User accounts and authentication mechanisms (e.g., JWT, OAuth) for maintaining security and managing access control. This shall ensure only authorized users can schedule and manage jobs, thereby protecting the system from unauthorized access and potential abuse.

## Additional Considerations for Scalability

1. **Load Balancing**: Utilize a load balancer to efficiently distribute incoming traffic across multiple instances of the application, there-by ensuring optimal resource utilization and preventing any single instance from becoming a bottleneck.

2. **Rate Limiting**: To prevent API abuse and fair usage, implement rate limiting on the endpoints.

3. **Monitoring and Logging**: Implement robust monitoring and logging to track system performance and identify bottlenecks or issues in real-time. Use something like Datadog.
