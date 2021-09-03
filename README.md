# Pipelines

## ci-pipeline
[Github Actions](https://docs.github.com/en/actions) are utilized to run CI pipeline. [`ci-pipeline`](.github/workflows/ci-pipeline.yml) creates a single instance of Ubuntu container, install pre-commit, clones the repository, install and run [pre-commit](https://pre-commit.com) hook scripts that are defined in [`.pre-commit-config.yaml`](.pre-commit-config.yaml  ) file.

Diagram below describes the process flow of trigerring [ci-pipeline](#ci-pipeline) powered by [Github Actions](https://docs.github.com/en/actions).

![CI pipeline](doc/diagrams/ci-pipeline/ci-pipeline.png)
