import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createScriptInputSchema,
  updateScriptInputSchema,
  deleteScriptInputSchema,
  getScriptsByCategoryInputSchema,
  getScriptByIdInputSchema,
  trackVisitorInputSchema,
  adminLoginInputSchema
} from './schema';

// Import handlers
import { createScript } from './handlers/create_script';
import { getAllScripts } from './handlers/get_all_scripts';
import { getScriptsByCategory } from './handlers/get_scripts_by_category';
import { getScriptById } from './handlers/get_script_by_id';
import { updateScript } from './handlers/update_script';
import { deleteScript } from './handlers/delete_script';
import { trackVisitor } from './handlers/track_visitor';
import { adminLogin } from './handlers/admin_login';
import { getDashboardStats } from './handlers/get_dashboard_stats';
import { verifyAdminToken } from './handlers/verify_admin_token';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Public routes for main application
  getAllScripts: publicProcedure
    .query(() => getAllScripts()),

  getScriptsByCategory: publicProcedure
    .input(getScriptsByCategoryInputSchema)
    .query(({ input }) => getScriptsByCategory(input)),

  getScriptById: publicProcedure
    .input(getScriptByIdInputSchema)
    .query(({ input }) => getScriptById(input)),

  trackVisitor: publicProcedure
    .input(trackVisitorInputSchema)
    .mutation(({ input }) => trackVisitor(input)),

  // Admin authentication
  adminLogin: publicProcedure
    .input(adminLoginInputSchema)
    .mutation(({ input }) => adminLogin(input)),

  // Admin-only routes (in production, these should be protected with middleware)
  getDashboardStats: publicProcedure
    .query(() => getDashboardStats()),

  createScript: publicProcedure
    .input(createScriptInputSchema)
    .mutation(({ input }) => createScript(input)),

  updateScript: publicProcedure
    .input(updateScriptInputSchema)
    .mutation(({ input }) => updateScript(input)),

  deleteScript: publicProcedure
    .input(deleteScriptInputSchema)
    .mutation(({ input }) => deleteScript(input)),

  // Utility route for token verification
  verifyAdminToken: publicProcedure
    .input(z.string())
    .query(({ input }) => verifyAdminToken(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Mobile Legends Script Management Server listening at port: ${port}`);
}

start();