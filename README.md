[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fhalaoner%2FKO-Portfolio%2Fbadge%3Fref%3Ddev%26token%3D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&style=flat)](https://actions-badge.atrox.dev/halaoner/KO-Portfolio/goto?ref=dev&token=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)


# KO-Portfolio
KO-Portfolio is a [JavaScript](https://www.javascript.com) based web application runs on [AWS](https://aws.amazon.com) platform that serves a static and dynamic content. The KO-Portfolio application is based on [Express](http://expressjs.com) framework for back-end and [EJS](https://ejs.co) templating language along with JavaScript for front-end. Also, the application contains [authentication](https://auth0.com/docs/login/authentication) and [authorization](https://auth0.com/intro-to-iam/what-is-authorization/) methods based on username, password, and [JSON Web Token](https://jwt.io).

The major goal of this project is to create a web application that will serve a portfolio of a UX Designer. The side effect is to develop and enhance the skills of the developer of this project, such as web development (JavaScript), containerization, and CI/ CD automation within the cloud environment, especially, AWS.


## Documentation
- [Functional Requirements](doc/application-requirements/functional-requirements.md)
- [Non-Functional Requirements](doc/application-requirements/non-functional-requirements.md)
- [Solution Architecture](doc/diagrams/solution-architecture/solution-architecture.png)
- [Authentication & Authorization](doc/authentication/authentication.md)
- [Technology Stack](doc/decision-log.md)
- [Cost Estimation Plan](doc/cost-estimation-plan/cost-estimation-plan.md)
- [CI/ CD Pipeline](doc/pipelines/pipelines.md)


## Get Started
1. Clone repository via SSH:\
`git clone git@github.com:halaoner/KO-Portfolio.git`

    or

    Clone repository via HTTPS:\
    `git clone https://github.com/halaoner/KO-Portfolio.git`

1. Install node modules\
`npm install`

1. Create local `.env` file with the following variables:\
`PORT`\
`JWT_SECRET`\
`SESSION_SECRET`

1. Run application locally in a development mode by running following command:\
`npm run dev`

1. Open the browser and write `http://localhost:${PORT}/${RESOURCE}` in the URL field to access the application.\
For example: `http://localhost:3000/admin`


## Contribute
Contribution is possible via opening an [issue](https://github.com/halaoner/KO-Portfolio/issues) with a particular label (reporting bugs, new features, etc.).


## License
Code is licensed under the [MIT License](https://opensource.org/licenses/MIT), [BSD-2-Clause](https://opensource.org/licenses/BSD-2-Clause), and [Apache License](https://www.apache.org/licenses/LICENSE-2.0).
