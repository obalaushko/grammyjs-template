
import { runBot } from './bot/config/runnner.js';
import { ENV_VARIABLES } from './constants/global.js';
import { connectDb } from './db/connectDb.js';
import ENVS from "./helpers/loadEnv.js";
import LOGGER from './helpers/logger.js';
import { validateEnvs } from './validateEnvs.js';

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
