import type {OnModuleInit, Provider} from '@nestjs/common';
import {Inject, Injectable} from '@nestjs/common';
import * as ProfilerMod from '@google-cloud/profiler';

import {GoogleCloudConfig} from './google-cloud.config';

type Profiler = typeof ProfilerMod;

export const PROFILER_PROVIDER = Symbol('@google-cloud/profiler');

@Injectable()
export class GoogleCloudService implements OnModuleInit {
	static readonly profilerProvider: Provider<Profiler> = {
		// Just importing @google-cloud/profiler causes this message to be printed
		// Stderr: failed to set logging project id Error: Unable to detect a Project Id in the current environment.
		// Stderr: To learn more about authentication and Google APIs, visit:
		// Stderr: https://cloud.google.com/docs/authentication/getting-started
		// See https://github.com/googleapis/cloud-profiler-nodejs/issues/800

		provide: PROFILER_PROVIDER,
		useValue: ProfilerMod,
	};

	constructor(private readonly config: GoogleCloudConfig, @Inject(PROFILER_PROVIDER) public readonly profiler: Profiler) {}

	/**
	 * Starts the Google Cloud Profiler.
	 * @returns Whether the profiler was started
	 */
	async onModuleInit(): Promise<boolean> {
		if (this.config.credentials) {
			await this.profiler.start({
				projectId: this.config.credentials.projectId,
				keyFilename: this.config.credentials.keyFilename,
				serviceContext: {
					version: this.config.version,
					service: this.config.service,
				},
			});
		} else {
			// When running on Google Cloud you don't need to explicitly provide credentials to the profiler
			// TODO: Add a GOOGLE_CLOUD environment variable (optional boolean, default: false) to start the profiler even when credentials aren't explicitly provided

			return false;
		}

		return true;
	}
}
