import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { readFileSync } from 'fs';

const client = new DynamoDBClient({ region: 'ca-central-1' });
const db = DynamoDBDocumentClient.from(client);

const data = JSON.parse(readFileSync('.data/db-ec2-backup-20260416.json', 'utf8'));

for (const user of data.users) {
  await db.send(new PutCommand({ TableName: 'daystocitizen-users', Item: user }));
  console.log(`✓ user ${user.email}`);
}

for (const stay of data.stays) {
  await db.send(new PutCommand({ TableName: 'daystocitizen-stays', Item: stay }));
  console.log(`✓ stay ${stay.id} (user ${stay.userId})`);
}

console.log(`\nDone: ${data.users.length} users, ${data.stays.length} stays`);
