# Cost Estimation Plan

The below table describes costs for the particular Amazon Lighsail services, AWS services and custom domain name registration.\
Prices below are valid to 22.9.2021 and may vary in time.

The equirement from a stakeholder is to lower the price as much as possible, and therefore all pricing is within one environment DEV/ PROD due to small and non-critical project character.

| Service name    | Number of instances | Service location | Tier    | Configuration                    | Price/ configuration/ month [USD] | Price/ configuration /year [USD]  |
|-----------------|:-------------------:|:----------------:|:-------:|:--------------------------------:|:------------------:| :------------------:|
| Container       | 1x                  | Amazon Lightsail | Paid    | 512 MB RAM, 0.25 vCPUs           | 7                  | 84                  |
| Object Storage  | 1x                  | Amazon Lightsail | 1y free | 5 GB storage, 25 GB data transfer| 1 after 1y         | 12 after 1y         |
| CDN distributions| 1x                 | Amazon Lightsail | 1y free | 50 GB transfer                   | 2.50 after 1y      | 30 after 1y         |
| DNS Zone        | 1x                  | Amazon Lightsail | Free    | 3 million DNS queries/ month     | 0                  | 0                   |
| Amazon DynamoDB | 1x                  | AWS              | Free    | 25GB storage, 25 provisioned WCU+RCU *| 0             | 0                   |
| Domain Name     | 1x                  | -                | -       | -                                | 1.21               | 14.52               |
| **TOTAL PRICE FOR THE 1st YEAR** | -  | -                | -       | -                                | **8.21**           | **98.52**           |
| **TOTAL PRICE AFTER THE 1st YEAR** | -| -                | -       | -                                | **11.71**          | **140.52**          |

*WCU = Write Capacity Units; RCU = Read Capacity Units
More information about [WCU and RCU](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html).

[Official pricing](https://aws.amazon.com/lightsail/pricing/) from AWS.\
[Free services](https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=*all&awsf.Free%20Tier%20Categories=*all) within Free Tier.\
[DNS pricing](http://lightsail.aws.amazon.com) from AWS.
