import {
	createLogger,
	format,
	transports,
	LogEntry as WinstonLogEntry,
	LoggerOptions,
	Logger as WinstonLogger,
} from 'winston';

const { combine, timestamp, colorize, printf } = format;

interface Metadata {
	[key: string]: any;
}

interface LogEntry extends WinstonLogEntry {
	metadata?: Metadata;
}

const consoleFormat = printf(
	({ level, message, timestamp, metadata }: LogEntry) => {
		return `${timestamp} ${level}: ${message} ${
			metadata ? JSON.stringify(metadata, null, 2) : ''
		}`;
	}
);

const loggerOptions: LoggerOptions = {
	transports: [
		new transports.File({
			level: 'error',
			filename: 'app-error.log',
		}),
	],
};

const LOGGER: WinstonLogger = createLogger(loggerOptions);

LOGGER.add(
	new transports.Console({
		level: 'debug',
		format: combine(
			colorize({
				colors: { info: 'blue', error: 'red' },
				level: true,
			}),
			timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			consoleFormat
		),
	})
);

export default LOGGER;
