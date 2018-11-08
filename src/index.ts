/**
 * @module google.cloud.resource
 */

/*!
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

import {Service, Operation, GoogleAuthOptions} from '@google-cloud/common';
import {paginator} from '@google-cloud/paginator';
import {promisifyAll} from '@google-cloud/promisify';
import * as extend from 'extend';
import {Project} from './project';
import * as r from 'request';  // Only for type declarations.
import {teenyRequest} from 'teeny-request';

/**
 * Callback function passed to Resource#createProject().
 */
export type CreateProjectCallback =
    (err: Error|null, project?: Project|null, operation?: Operation,
      apiResponse?: r.Response) => void;

/**
 * Response from invoking Resource#createProject().
 */
export type CreateProjectResponse = [Project, Operation, r.Response];

/**
 * Configuration options passed to Resource#createProject().
 */
export interface CreateProjectOptions {
  /**
   * hi
   */
  projectNumber?: string;
  projectId?: string;
  lifecycleState?: LifecylceState;
  name: string;
  createTime: string;
  labels: {[index: string]: string};
  parent: {type: string, id: string};
}

/**
 * Response from invoking Resource#getProjects() without a callback.
 * @param 0 - A list of projects.
 * @param 1 - Full API response.
 */
export type GetProjectsResponse = [
  Project[],
  r.Response
];

/**
 * Callback function passed to Resource#getProjects().
 * @param err - hi
 * @param projects - the projects
 */
export interface GetProjectsCallback {
  (err: Error|null, projects?: Project[]|null, nextQuery?: object|null, apiResponse?: r.Response): void;
}

/**
 * Configuration option passed to Resource#getProject().
 */
export interface GetProjectOptions {
  autoPaginate?: boolean;
  filter?: string;
  maxApiCalls?: number;
  maxResults?: number;
  pageSize?: number;
  pageToken?: string;
}

/**
 * The state in the lifecycle of the resource.
 */
export enum LifecylceState {
  /**
   * Unspecified state. This is only used/useful for distinguishing unset
   * values.
   */
  'LIFECYCLE_STATE_UNSPECIFIED',
  /**
   * The normal and active state.
   */
  'ACTIVE',
  /**
   * The project has been marked for deletion by the user (by invoking
   * projects.delete) or by the system (Google Cloud Platform). This can
   * generally be reversed by invoking projects.undelete.
   */
  'DELETE_REQUESTED',
  /**
   * @deprecated This lifecycle state is no longer used and not returned by the API.
   */
  'DELETE_IN_PROGRESS',
}

/**
 * Configuration options when calling Resource constructor.
 */
export interface ClientConfig extends GoogleAuthOptions {
  /**
   * Automatically retry requests if the
   * response is related to rate limits or certain intermittent server errors.
   * We will exponentially backoff subsequent requests by default.
   * Defaults to true.
   */
  autoRetry?: boolean;
  /**
   * Maximum number of automatic retries attempted before returning the error.
   * Defaults to 3.
   */
  maxRetries?: boolean;
}

/**
 * The [Cloud Resource Manager](https://cloud.google.com/resource-manager/)
 * provides methods that you can use to programmatically manage your projects
 * in the Google Cloud Platform. With this API, you can do the following:
 *
 *   - Get a list of all projects associated with an account.
 *   - Create new projects.
 *   - Update existing projects.
 *   - Delete projects.
 *   - Recover projects.
 *
 * See [What is the Cloud Resource Manager?]{@link https://cloud.google.com/resource-manager}
 *
 * @example
 *  <caption>Import the client library</caption>
 *  const {Resource} = require('@google-cloud/resource');
 *
 * @example <caption>Create a client that uses <a
 * href="https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application">Application
 * Default Credentials (ADC)</a>:</caption> const resource = new Resource();
 *
 * @example <caption>Create a client with <a
 * href="https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually">explicit
 * credentials</a>:</caption> const resource = new Resource({ projectId:
 * 'your-project-id', keyFilename: '/path/to/keyfile.json'
 * });
 *
 * @example <caption>include:samples/quickstart.js</caption>
 * region_tag:resource_quickstart
 * Full quickstart example:
 */
export class Resource extends Service {
  getProjectsStream: Function;

  /**
   * @param options - Configuration options for the constructor.
   */
  constructor(options: ClientConfig = {}) {
    const config = {
      baseUrl: 'https://cloudresourcemanager.googleapis.com/v1',
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      projectIdRequired: false,
      packageJson: require('../../package.json'),
      requestModule: teenyRequest as typeof r,
    };
    super(config, options);

    /**
     * Get a list of {@link Resource/project} objects as a readable object
     * stream.
     *
     *
     * @method Resource#getProjectsStream
     * @param {object} query - Configuration object. See
     *     {@link Resource#getProjects} for a complete list of options.
     * @return {stream}
     *
     * @example
     * ```
     * const {Resource} = require('@google-cloud/resource');
     * const resource = new Resource();
     *
     * resource.getProjectsStream()
     *   .on('error', console.error)
     *   .on('data', project => {
     *     // `project` is a `Project` object.
     *   })
     *   .on('end', () => {
     *     // All projects retrieved.
     *   });
     *
     * //-
     * // If you anticipate many results, you can end a stream early to prevent
     * // unnecessary processing and API requests.
     * //-
     * resource.getProjectsStream()
     *   .on('data', function(project) {
     *     this.end();
     *   });
     * ``` 
     */
    this.getProjectsStream = paginator.streamify('getProjects');
  }

  /**
   * Create a project.
   *
   * **This method only works if you are authenticated as yourself, e.g. using
   * the gcloud SDK.**
   *
   * See [Projects Overview]{@link https://cloud.google.com/compute/docs/networking#networks}
   * See [projects: create API Documentation]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects/create}
   *
   * @param id - ID of the project.
   * @param options - See a
   *     [Project
   * resource](https://cloud.google.com/resource-manager/reference/rest/v1/projects#Project).
   * @param callback - The callback function.
   *
   * @example
   * ```
   * const {Resource} = require('@google-cloud/resource');
   * const resource = new Resource();
   *
   * const id = 'new-project-id';
   *
   * resource.createProject(id, (err, project, operation, apiResponse) => {
   *   if (err) {
   *     // Error handling omitted.
   *   }
   *
   *   // `project` is a new Project instance.
   *   // `operation` will emit `error` or `complete` when the status updates.
   *
   *   operation
   *     .on('error', err => {})
   *     .on('complete', () => {
   *       // Project was created successfully!
   *     });
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * resource.createProject(id)
   *   .then(data => {
   *     const project = data[0];
   *     const operation = data[1];
   *     const apiResponse = data[2];
   *
   *     return operation.promise();
   *   })
   *   .then(data => {
   *     const operationMetadata = data[0];
   *
   *     // Project created successfully!
   *   });
   * ```
   */
  createProject(id: string, options?: CreateProjectOptions):
      Promise<CreateProjectResponse>;
  createProject(
      id: string, options: CreateProjectOptions,
      callback: CreateProjectCallback): void;
  createProject(id: string, callback: CreateProjectCallback): void;
  createProject(
      id: string,
      optionsOrCallback?: CreateProjectOptions|CreateProjectCallback,
      callback?: CreateProjectCallback): void|Promise<CreateProjectResponse> {
    const options =
        typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
    callback =
        typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
    this.request(
        {
          method: 'POST',
          uri: '/projects',
          json: extend({}, options, {
            projectId: id,
          }),
        },
        (err, resp) => {
          if (err) {
            callback!(err, null, resp);
            return;
          }
          const project = this.project(resp.projectId);
          const operation = this.operation(resp.name);
          operation.metadata = resp;
          callback!(null, project, operation, resp);
        });
  }

  /**
   * Get a list of projects.
   *
   * See  [Projects Overview]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects}
   * See  [projects: list API Documentation]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects/list}
   *
   * @param options - Operation search options.
   * @param callback - The callback function.
   *
   * @example
   * const {Resource} = require('@google-cloud/resource');
   * const resource = new Resource();
   *
   * resource.getProjects((err, projects) => {
   *   // `projects` is an array of `Project` objects.
   * });
   *
   * //-
   * // To control how many API requests are made and page through the results
   * // manually, set `autoPaginate` to `false`.
   * //-
   * function callback(err, projects, nextQuery, apiResponse) {
   *   if (nextQuery) {
   *     // More results exist.
   *     resource.getProjects(nextQuery, callback);
   *   }
   * }
   *
   * resource.getProjects({
   *   autoPaginate: false
   * }, callback);
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * resource.getProjects().then(data => {
   *   const projects = data[0];
   * });
   */
  getProjects(options?: GetProjectOptions): Promise<GetProjectsResponse>;
  getProjects(options: GetProjectOptions, callback: GetProjectsCallback): void;
  getProjects(callback: GetProjectsCallback): void;
  getProjects(
      optionsOrCallback?: GetProjectOptions|GetProjectsCallback,
      callback?: GetProjectsCallback): void|Promise<GetProjectsResponse> {
    const options =
        typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
    callback =
        typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
    this.request(
        {
          uri: '/projects',
          qs: options,
        },
        (err, resp) => {
          if (err) {
            callback!(err, null, null, resp);
            return;
          }

          let nextQuery: GetProjectOptions;

          if (resp.nextPageToken) {
            nextQuery = extend({}, options, {
              pageToken: resp.nextPageToken,
            });
          }

          const projects = (resp.projects || []).map((project: Project) => {
            const projectInstance = this.project(project.projectId);
            projectInstance.metadata = project;
            return projectInstance;
          });

          callback!(null, projects, nextQuery!, resp);
        });
  }

  /*! Developer Documentation
   *
   * @returns {module:common/operation}
   */
  /**
   * Get a reference to an existing operation.
   *
   * Throws an error if a name is not provided.
   *
   * @param name - The name of the operation.
   *
   * @example
   * const {Resource} = require('@google-cloud/resource');
   * const resource = new Resource();
   *
   * const operation = resource.operation('68850831366825');
   */
  operation(name: string) {
    if (!name) {
      throw new Error('A name must be specified for an operation.');
    }
    return new Operation(
        {parent: this, id: name, requestModule: teenyRequest as typeof r});
  }

  /**
   * Create a Project object. See {@link Resource#createProject} to create
   * a project.
   *
   * @throws {Error} If an ID is not provided.
   *
   * @param id The ID of the project (eg: `grape-spaceship-123`).
   *
   * @example
   * const {Resource} = require('@google-cloud/resource');
   * const resource = new Resource();
   *
   * const project = resource.project('grape-spaceship-123');
   */
  project(id?: string) {
    id = id || this.projectId;
    if (!id) {
      throw new Error('A project ID is required.');
    }
    return new Project(this, id);
  }
}

/*! Developer Documentation
 *
 * These methods can be auto-paginated.
 */
paginator.extend(Resource, ['getProjects']);

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(Resource, {
  exclude: ['operation', 'project'],
});

/**
 * {@link Project} class.
 *
 * @name Resource.Project
 * See  Project
 * @type {constructor}
 */
export {Project};
