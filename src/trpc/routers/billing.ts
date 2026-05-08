import { env } from "@/lib/env";
import { polar } from "@/lib/polar";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, orgProcedure } from "../init";

export const billingRouter = createTRPCRouter({
  createCheckout: orgProcedure.mutation(async ({ ctx }) => {
    const result = await polar.checkouts.create({
      products: [env.POLAR_PRODUCT_ID],
      externalCustomerId: ctx.orgId,
      successUrl: process.env.APP_URL,
    });

    if (!result.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create checkout session",
      });
    }

    return { checkoutUrl: result.url };
  }),

  createPortalSession: orgProcedure.mutation(async ({ ctx }) => {
    const result = await polar.customerSessions.create({
      externalCustomerId: ctx.orgId,
    });

    if (!result.customerPortalUrl) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create customer portal session",
      });
    }

    return { portalUrl: result.customerPortalUrl };
  }),

  getStatus: orgProcedure.query(async ({ ctx }) => {
    try {
      const customerState = await polar.customers.getStateExternal({
        externalId: ctx.orgId,
      });

      const hasActiveSubscription =
        (customerState.activeSubscriptions ?? []).length > 0;

      let estimatedCost = 0;
      for (const sub of customerState.activeSubscriptions ?? []) {
        for (const meter of sub.meters ?? []) {
          estimatedCost += meter.amount ?? 0;
        }
      }

      return {
        hasActiveSubscription,
        customerId: customerState.id,
        estimatedCost,
      };
    } catch {
      //Customer doesn't exist yet in Polar
      return {
        hasActiveSubscription: false,
        customerId: null,
        estimatedCost: 0,
      };
    }
  }),
});
