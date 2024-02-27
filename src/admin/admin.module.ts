import { Module } from '@nestjs/common';
import { AdminModule } from '@adminjs/nestjs';
import { ConfigModule } from '@nestjs/config';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';
import AdminJS from 'adminjs';

const prisma = new PrismaClient();

AdminJS.registerAdapter({ Database, Resource });

const DEFAULT_ADMIN = {
  email: 'test@gmail.com',
  password: '123',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AdminModule.createAdminAsync({
      useFactory: createAdminOptions,
    }),
  ],
})
export class AdminJsModule {}

async function createAdminOptions() {
  const tableNames = await fetchTableNames();
  const resources = createResources(tableNames);

  return {
    adminJsOptions: {
      rootPath: '/admin',
      resources,
    },
    auth: {
      authenticate,
      cookiePassword: 'secret',
      cookieName: 'adminjs',
    },
    sessionOptions: {
      resave: true,
      saveUninitialized: true,
      secret: 'secret',
    },
  };
}

async function fetchTableNames(): Promise<string[]> {
  return ['User', 'Post']; // Return dummy table names
}

function createResources(tableNames: string[]) {
  return tableNames.map((tableName) => ({
    resource: { model: getModelByName(tableName), client: prisma },
    options: {},
  }));
}
