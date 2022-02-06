import type {LoggerService} from '@nestjs/common';
import type {Consola} from 'consola';

export type Logger = Consola & LoggerService;
