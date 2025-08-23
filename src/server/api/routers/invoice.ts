import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {Invoice} from "@/server/db/schema";
import {invoiceSchema} from "@/types/invoice";
import {eq} from "drizzle-orm";
import {z} from "zod";

export const invoiceRouter = createTRPCRouter({
  create: publicProcedure
    .input(invoiceSchema)
    .mutation(async ({ctx, input}) => {
      if (!ctx.session || !ctx.session.user || !ctx.session.user.id) {
        throw new Error("Unauthorized");
      }
      const res = await ctx.db
        .insert(Invoice)
        .values({
          userId: ctx.session.user.id,
          data: input,
        })
        .returning({
          id: Invoice.id,
        });
      return res;
    }),

  get: protectedProcedure
    .input(z.object({invoiceId: z.string()}))
    .query(async ({ctx, input}) => {
      const invoice = await ctx.db
        .select()
        .from(Invoice)
        .where(eq(Invoice.id, input.invoiceId));
      if (invoice.length !== 1 || !invoice[0]) {
        throw new Error("Post not found");
      }
      if (invoice[0].userId !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }
      return invoice[0];
    }),

  getByUser: protectedProcedure.query(async ({ctx}) => {
    if (!ctx.session || !ctx.session.user || !ctx.session.user.id) {
      throw new Error("Unauthorized");
    }
    const invoices = await ctx.db
      .select()
      .from(Invoice)
      .where(eq(Invoice.userId, ctx.session.user.id));
    return invoices;
  }),

  delete: protectedProcedure
    .input(z.object({invoiceId: z.string()}))
    .mutation(async ({ctx, input}) => {
      const res = await ctx.db
        .delete(Invoice)
        .where(eq(Invoice.id, input.invoiceId))
        .returning();
      if (res.length === 0) {
        throw new Error("Post not found");
      }
    }),

  update: protectedProcedure
    .input(z.object({invoiceId: z.string(), data: invoiceSchema}))
    .mutation(async ({ctx, input}) => {
      await ctx.db
        .update(Invoice)
        .set({
          data: input.data,
        })
        .where(eq(Invoice.id, input.invoiceId));
    }),
});
