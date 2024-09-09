export const validateEnvs = (ENVS: { [index: string]: string }) => {
    if (!ENVS) {
        throw new Error('Environment variables are required');
    }

    const requiredEnvVars = ['DENO_ENV', 'PORT', 'ADMIN_ID'];

    requiredEnvVars.forEach((key) => {
        if (!ENVS[key]) {
            throw new Error(`${key} is required`);
        }
    });

    if (ENVS.DENO_ENV === 'development' && !ENVS.DEVELOPMENT_BOT_TOKEN) {
        throw new Error(
            'DEVELOPMENT_BOT_TOKEN is required in development mode'
        );
    }

    if (ENVS.DENO_ENV === 'production' && !ENVS.BOT_TOKEN) {
        throw new Error('BOT_TOKEN is required in production mode');
    }

    if (ENVS.USE_MONGO === 'true') {
        const mongoEnvVars = [
            'MONGO_DB',
            'MONGO_DB_USER',
            'MONGO_DB_PASSWORD',
            'MONGO_DB_NAME',
            'MONGO_DB_HOST',
        ];

        mongoEnvVars.forEach((key) => {
            if (!ENVS[key]) {
                throw new Error(`${key} is required when USE_MONGO is true`);
            }
        });
    }
};
