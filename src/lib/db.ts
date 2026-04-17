import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Stay } from './types';

const client = new DynamoDBClient({ region: process.env.APP_REGION ?? 'ca-central-1' });
const db = DynamoDBDocumentClient.from(client);

const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE ?? 'daystocitizen-users';
const STAYS_TABLE = process.env.DYNAMODB_STAYS_TABLE ?? 'daystocitizen-stays';
const OTPS_TABLE  = process.env.DYNAMODB_OTPS_TABLE  ?? 'daystocitizen-otps';

// ── Users ─────────────────────────────────────────────────────────────────────

export async function findUserByEmail(email: string): Promise<{ id: string; email: string; createdAt: string } | undefined> {
  const res = await db.send(new QueryCommand({
    TableName: USERS_TABLE,
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :e',
    ExpressionAttributeValues: { ':e': email },
    Limit: 1,
  }));
  return res.Items?.[0] as { id: string; email: string; createdAt: string } | undefined;
}

export async function findUserById(id: string): Promise<{ id: string; email: string; createdAt: string } | undefined> {
  const res = await db.send(new GetCommand({ TableName: USERS_TABLE, Key: { id } }));
  return res.Item as { id: string; email: string; createdAt: string } | undefined;
}

export async function upsertUser(email: string): Promise<{ id: string; email: string; createdAt: string }> {
  const existing = await findUserByEmail(email);
  if (existing) return existing;
  const user = { id: crypto.randomUUID(), email, createdAt: new Date().toISOString() };
  await db.send(new PutCommand({ TableName: USERS_TABLE, Item: user }));
  return user;
}

// ── Stays ─────────────────────────────────────────────────────────────────────

export async function getStays(userId: string): Promise<Stay[]> {
  const res = await db.send(new QueryCommand({
    TableName: STAYS_TABLE,
    KeyConditionExpression: 'userId = :u',
    ExpressionAttributeValues: { ':u': userId },
  }));
  return ((res.Items ?? []) as (Stay & { userId: string; createdAt: string })[])
    .map(({ userId: _u, createdAt: _c, ...stay }) => stay)
    .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
}

export async function createStay(userId: string, stay: Stay): Promise<Stay> {
  await db.send(new PutCommand({
    TableName: STAYS_TABLE,
    Item: { ...stay, userId, createdAt: new Date().toISOString() },
    ConditionExpression: 'attribute_not_exists(id)',
  })).catch(() => {}); // idempotent — ignore if already exists
  return stay;
}

export async function deleteStay(userId: string, id: string): Promise<boolean> {
  await db.send(new DeleteCommand({
    TableName: STAYS_TABLE,
    Key: { userId, id },
    ConditionExpression: 'attribute_exists(id)',
  })).catch(() => {});
  return true;
}

export async function updateStay(userId: string, id: string, updates: Partial<Stay>): Promise<Stay | null> {
  const keys = Object.keys(updates) as (keyof Stay)[];
  if (keys.length === 0) return null;

  const setExpr = keys.map((k) => `#${k} = :${k}`).join(', ');
  const names   = Object.fromEntries(keys.map((k) => [`#${k}`, k]));
  const values  = Object.fromEntries(keys.map((k) => [`:${k}`, updates[k]]));

  const res = await db.send(new UpdateCommand({
    TableName: STAYS_TABLE,
    Key: { userId, id },
    UpdateExpression: `SET ${setExpr}`,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    ConditionExpression: 'attribute_exists(id)',
    ReturnValues: 'ALL_NEW',
  })).catch(() => null);

  if (!res?.Attributes) return null;
  const { userId: _u, createdAt: _c, ...stay } = res.Attributes as Stay & { userId: string; createdAt: string };
  return stay;
}

// ── OTPs ──────────────────────────────────────────────────────────────────────

export async function saveOtp(email: string, code: string, expiresAt: Date): Promise<void> {
  const ttl = Math.floor(expiresAt.getTime() / 1000); // DynamoDB TTL is Unix epoch seconds
  await db.send(new PutCommand({
    TableName: OTPS_TABLE,
    Item: { email, code, expiresAt: expiresAt.toISOString(), ttl },
  }));
}

export async function verifyAndConsumeOtp(email: string, code: string): Promise<boolean> {
  const res = await db.send(new GetCommand({ TableName: OTPS_TABLE, Key: { email } }));
  const item = res.Item;
  if (!item || item.code !== code) return false;
  if (new Date() > new Date(item.expiresAt)) {
    await db.send(new DeleteCommand({ TableName: OTPS_TABLE, Key: { email } }));
    return false;
  }
  await db.send(new DeleteCommand({ TableName: OTPS_TABLE, Key: { email } }));
  return true;
}
