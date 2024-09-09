import { runBot } from './bot/config/runnner.ts';
import { ENV_VARIABLES } from './constants/global.ts';
import { connectDb } from './db/connectDb.ts';
import ENVS from "./helpers/loadEnv.ts";
import LOGGER from './helpers/logger.ts';
import { validateEnvs } from './validateEnvs.ts';

validateEnvs(ENVS);

const runApp = async () => {
    try {
        if (ENV_VARIABLES.USE_MONGO) {
            await connectDb()
                .then(() => {
                    runBot();
                    // serverInit();
                })
                .catch((error) => {
                    LOGGER.error(`[runApp][Error on connect db]`, {
                        metadata: {
                            error: error,
                            stack: error.stack.toString(),
                        },
                    });
                });
        } else runBot();
    } catch (error: any) {
        LOGGER.error(`[runApp][Error on run app]`, {
            metadata: { error: error, stack: error.stack.toString() },
        });
    }
};

runApp();
