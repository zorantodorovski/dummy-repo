'use server';

import { handleServerFunctions } from '@payloadcms/next/layouts';
import type { ServerFunctionClientArgs } from 'payload';

import config from '@payload-config';
import { importMap } from './admin/importMap';

export async function serverFunction(args: ServerFunctionClientArgs) {
  return handleServerFunctions({ ...args, config, importMap });
}
