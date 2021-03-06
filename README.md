<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# [Google Cloud Resource Manager API: Node.js Client](https://github.com/googleapis/nodejs-resource)

[![release level](https://img.shields.io/badge/release%20level-alpha-orange.svg?style&#x3D;flat)](https://cloud.google.com/terms/launch-stages)
[![npm version](https://img.shields.io/npm/v/@google-cloud/resource.svg)](https://www.npmjs.org/package/@google-cloud/resource)
[![codecov](https://img.shields.io/codecov/c/github/googleapis/nodejs-resource/master.svg?style=flat)](https://codecov.io/gh/googleapis/nodejs-resource)

> Node.js idiomatic client for [Cloud Resource Manager API][product-docs].

Google Cloud Platform provides container resources such as Organizations and Projects, that allow you to group and hierarchically organize other Cloud Platform resources. This hierarchical organization lets you easily manage common aspects of your resources such as access control and configuration settings. The [Cloud Resource Manager API](https://cloud.google.com/resource-manager/docs/) enables you to programmatically manage these container resources.


* [Cloud Resource Manager API Node.js Client API Reference][client-docs]
* [github.com/googleapis/nodejs-resource](https://github.com/googleapis/nodejs-resource)
* [Cloud Resource Manager API Documentation][product-docs]

Read more about the client libraries for Cloud APIs, including the older
Google APIs Client Libraries, in [Client Libraries Explained][explained].

[explained]: https://cloud.google.com/apis/docs/client-libraries-explained

**Table of contents:**

* [Quickstart](#quickstart)
  * [Before you begin](#before-you-begin)
  * [Installing the client library](#installing-the-client-library)
  * [Using the client library](#using-the-client-library)
* [Samples](#samples)
* [Versioning](#versioning)
* [Contributing](#contributing)
* [License](#license)

## Quickstart

### Before you begin

1.  Select or create a Cloud Platform project.

    [Go to the projects page][projects]

1.  Enable billing for your project.

    [Enable billing][billing]

1.  Enable the Google Cloud Resource Manager API API.

    [Enable the API][enable_api]

1.  [Set up authentication with a service account][auth] so you can access the
    API from your local workstation.

[projects]: https://console.cloud.google.com/project
[billing]: https://support.google.com/cloud/answer/6293499#enable-billing
[enable_api]: https://console.cloud.google.com/flows/enableapi?apiid=cloudresourcemanager.googleapis.com
[auth]: https://cloud.google.com/docs/authentication/getting-started

### Installing the client library

    npm install --save @google-cloud/resource

### Using the client library

```javascript
// Imports the Google Cloud client library
const {Resource} = require('@google-cloud/resource');

// Your Google Cloud Platform project ID
const projectId = 'YOUR_PROJECT_ID';

// Creates a client
const resourceClient = new Resource({
  projectId: projectId,
});

// Lists current projects
resourceClient
  .getProjects()
  .then(results => {
    const projects = results[0];

    console.log('Projects:');
    projects.forEach(project => console.log(project.id));
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
```

## Samples

Samples are in the [`samples/`](https://github.com/googleapis/nodejs-resource/tree/master/samples) directory. The samples' `README.md`
has instructions for running the samples.

| Sample                      | Source Code                       | Try it |
| --------------------------- | --------------------------------- | ------ |
| Projects | [source code](https://github.com/googleapis/nodejs-resource/blob/master/samples/projects.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-resource&page=editor&open_in_editor=samples/projects.js,samples/README.md) |

The [Cloud Resource Manager API Node.js Client API Reference][client-docs] documentation
also contains samples.

## Versioning

This library follows [Semantic Versioning](http://semver.org/).

This library is considered to be in **alpha**. This means it is still a
work-in-progress and under active development. Any release is subject to
backwards-incompatible changes at any time.

More Information: [Google Cloud Platform Launch Stages][launch_stages]

[launch_stages]: https://cloud.google.com/terms/launch-stages

## Contributing

Contributions welcome! See the [Contributing Guide](https://github.com/googleapis/nodejs-resource/blob/master/CONTRIBUTING.md).

## License

Apache Version 2.0

See [LICENSE](https://github.com/googleapis/nodejs-resource/blob/master/LICENSE)

[client-docs]: https://cloud.google.com/nodejs/docs/reference/resource/latest/
[product-docs]: https://cloud.google.com/resource-manager/docs/
[shell_img]: //gstatic.com/cloudssh/images/open-btn.png

