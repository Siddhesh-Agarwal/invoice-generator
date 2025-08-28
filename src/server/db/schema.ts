import type {InvoiceType} from "@/types/invoice";
import {relations} from "drizzle-orm";
import {
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import type {AdapterAccount} from "next-auth/adapters";

export const PaymentStatus = pgEnum("payment_status", [
  "draft",
  "pending",
  "paid",
  "failed",
]);

export const Invoice = pgTable("invoice", {
  id: varchar()
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id")
    .notNull()
    .references(() => Users.id),
  paymentStatus: PaymentStatus().notNull().default("pending"),
  data: json("data").$type<InvoiceType>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const UserType = pgEnum("user_type", ["free", "premium"]);

export const Users = pgTable("user", {
  id: varchar("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar({length: 255}),
  email: varchar({length: 255}).notNull(),
  emailVerified: timestamp().defaultNow(),
  image: varchar({length: 255}),
  userType: UserType().notNull().default("free"),
  createdAt: timestamp("updated_at").notNull().defaultNow(),
});

export const Accounts = pgTable(
  "account",
  {
    userId: varchar({length: 255})
      .notNull()
      .references(() => Users.id),
    type: varchar({length: 255}).$type<AdapterAccount["type"]>().notNull(),
    provider: varchar({length: 255}).notNull(),
    providerAccountId: varchar({length: 255}).notNull(),
    refresh_token: text(),
    access_token: text(),
    expires_at: integer(),
    token_type: varchar({length: 255}),
    scope: varchar({length: 255}),
    id_token: text(),
    session_state: varchar({length: 255}),
  },
  (t) => [
    primaryKey({columns: [t.provider, t.providerAccountId]}),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const AccountsRelations = relations(Accounts, ({one}) => ({
  user: one(Users, {fields: [Accounts.userId], references: [Users.id]}),
}));

export const Sessions = pgTable("session", {
  sessionToken: varchar({length: 255}).notNull().primaryKey(),
  userId: varchar({length: 255})
    .notNull()
    .references(() => Users.id),
  expires: timestamp({mode: "date", withTimezone: true}).notNull(),
});

export const SessionsRelations = relations(Sessions, ({one}) => ({
  user: one(Users, {fields: [Sessions.userId], references: [Users.id]}),
}));

export const VerificationTokens = pgTable(
  "verification_token",
  {
    identifier: varchar({length: 255}).notNull(),
    token: varchar({length: 255}).notNull(),
    expires: timestamp({mode: "date", withTimezone: true}).notNull(),
  },
  (t) => [primaryKey({columns: [t.identifier, t.token]})],
);
