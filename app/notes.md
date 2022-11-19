
1. Run DynamoDB localy in Docker container.
```bash
docker compose up
```

2. Create record in DynamoDB.
```bash
node dynamoDB/dynamodbWrite.js
```

3. Read data from DynamoDB table.
```bash
aws dynamodb scan --table-name Users --endpoint-url http://localhost:8000
```

