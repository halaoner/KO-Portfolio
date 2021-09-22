# Architecture Decision Log
This document addresses why particular architecture patterns and technologies have been chosen.

## Application Architecture

1. **Thin client**\
The requirement from the stakeholder is to develop a web application.


2. **The application architecture follows the monolithic architectural pattern**\
The [monolithic](https://www.redhat.com/en/topics/cloud-native-apps/what-is-an-application-architecture#overview) pattern has been chosen because:
- developer's experience with the monolithic application approach
- the application is not complex, and there is no need to follow microservices architecture pattern
- the presentation and the logical layer will share the same codebase (the same repository)
- the solution requires to be inexpensive, and therefore a microservice pattern would increase the finantial and overall operations costs


3. **[Server-side rendered](https://www.freecodecamp.org/news/what-exactly-is-client-side-rendering-and-hows-it-different-from-server-side-rendering-bd5c786b340d/) application**\
This approach has been chosen because:
- developer's experience with the development of server-side rendered application
- easier for implementation (e.g., authentication)

## Technology Stack

### SCM
**[GitHub](https://docs.github.com/en):**
- developer's experience with the GitHub

###  CI/ CD Pipeline
**[GitHub Actions](https://github.com/features/actions):**
- developer's goal is to use the native GitHub tool
- developer requires to get familiar with GitHub Actions
- managed service by GitHub
- ease of setup - does not require to install any tools, plugins, packages, etc.
- each job runs in an isolated virtual machine
- suitable for small projects

### IaC
**[Terraform](https://www.terraform.io/):**
- developer requires to enhance hands-on knowledge about [Terraform](https://www.oreilly.com/content/why-use-terraform/)
- infrastructure versioning (GitOps approach)
- immutable infrastructure
- declarative approach of the infrastructure definition
- state of the infrastructure can be saved in a persitance storage
- multi-cloud support
- portability (usage of one tool for describing infrastructure for multiple cloud providers)
- execution plan before infrastructure is deployed

### Language
**[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript):**
- developer's experience with JavaScript
- compatible with major browsers (e.g., Chrome, Mozilla, IE, Safari)
- simplicity in terms of learning and implementation in comparision to e.g., C++
- utilize for back-end and front-end
- [versatily](https://www.freecodecamp.org/news/the-advantages-and-disadvantages-of-javascript/) - easy to build a web application by using some JavaScript framework
- a large community

### Back-end
**[Express](https://expressjs.com/):**
- developer's experience with [Express](https://codersera.com/blog/learn-express-js/)
- simple a minimalist web framework for Node.js
- allows to quickly develop a web application
- simple to set up and customization
- enables to build a server with REST API
- easy to use middleware for database connection

### Front-end
**[EJS](https://ejs.co/):**
- developer's experience with EJS
- JavaScript templating
- simple syntax - quick development
- compatible with Express framework
- fast compilation and rendering
- both server JS and browser support
- static caching of templates
- static caching of intermediate JavaScript function for fast execution
- a large community

### Database
**NoSQL:**
- [AWS (Amazon Lightsail)](https://aws.amazon.com/lightsail/) as a targeted platform does not offer [SQL database](https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=*all&awsf.Free%20Tier%20Categories=categories%23databases) as "Always free" within Free Tier
- NoSQL DB is preffered due to costs perspective, eventhough the stored data (username, email, form, password, session data) has more relational character

**[Amazon DynamoDB](https://aws.amazon.com/dynamodb/):**
- [AWS](https://aws.amazon.com/) is a preferred platform
- NoSQL DB
- managed DB
- provides [SDK for Node.js]((https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-dynamodb))
- fast (miliseconds performace) and scalable
- free within [AWS Free Tier](https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=*all&awsf.Free%20Tier%20Categories=*all)
- allows to store sessions

### Object Storage
**[Amazon Lightsail Object Storage](https://aws.amazon.com/getting-started/hands-on/lightsail-object-storage/):**
- ideal for storing unstructed data, e.g., static content (documents, pictures)
- communication over REST API - integration with a web application
- [scalable](https://www.ibm.com/cloud/learn/object-storage#toc-benets-3qMqxdZH)
- managed storage
- customizable metadata
- life-cycle management (e.g., possible to set up a life-cycle management policy to store files for limited time only)
- cost-effective


### Containerization Engine
**[Docker](https://www.docker.com/)**
- developer's experience with Docker
- developer requires to enhnace knowledge about Docker
- rapid application development and deployment
- allows to run an application in an isolated environment
- easy to set up a development environment (in comparison with virtual machines)
- application's portability
- lightweight footprint
- simplified maintenance – Docker reduces effort and risk of problems with application dependencies
- cost-effectiveness
- easy to share containers with other developers
- a large community

### Target Platform
**[AWS(Amazon Lightsail)](https://aws.amazon.com/lightsail/):**
- [AWS](https://aws.amazon.com/) is a preferred platform
    - developer's experience with AWS
    - developer requires to enhnace knowledge about AWS
    - suitable for small projects

### Notification Service
TODO: choose a free email notification service
