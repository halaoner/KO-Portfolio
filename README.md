# Pipelines

## ci-pipeline
[Github Actions](https://docs.github.com/en/actions) are utilized to run CI pipeline. `ci-pipeline` creates a single instance of Ubuntu virtual machine, install pre-commit, clones the repository, install and run [pre-commit](https://pre-commit.com) hook scripts that are defined in `.pre-commit-config.yaml` file.