import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { invoices } from "@/server/db/schema";
import { invoiceSchema } from "@/types/invoice";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const invoiceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ data: invoiceSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.user || !ctx.session.user.id) {
        throw new Error("Unauthorized");
      }
      const res = await ctx.db
        .insert(invoices)
        .values({
          userId: ctx.session.user.id,
          data: input.data,
        })
        .returning({
          id: invoices.id,
        });
      return res[0];
    }),

  get: protectedProcedure
    .input(z.object({ invoiceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const invoice = await ctx.db
        .select()
        .from(invoices)
        .where(eq(invoices.id, input.invoiceId));
      if (invoice.length !== 1 || !invoice[0]) {
        throw new Error("Post not found");
      }
      if (invoice[0].userId !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }
      return invoice[0];
    }),

  getByUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session || !ctx.session.user || !ctx.session.user.id) {
      throw new Error("Unauthorized");
    }
    const invoice = await ctx.db
      .select()
      .from(invoices)
      .where(eq(invoices.userId, ctx.session.user.id));
    return invoice;
  }),

  delete: protectedProcedure
    .input(z.object({ invoiceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db
        .delete(invoices)
        .where(eq(invoices.id, input.invoiceId))
        .returning();
      if (res.length === 0) {
        throw new Error("Post not found");
      }
    }),

  update: protectedProcedure
    .input(z.object({ invoiceId: z.string(), data: invoiceSchema }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(invoices)
        .set({
          data: input.data,
        })
        .where(eq(invoices.id, input.invoiceId));
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
        status: z.enum(["draft", "pending", "paid", "failed"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(invoices)
        .set({
          paymentStatus: input.status,
        })
        .where(eq(invoices.id, input.invoiceId));
    }),
});
