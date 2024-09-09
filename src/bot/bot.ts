import { BOT_RIGHTS, ENV_VARIABLES } from './../constants/global.ts';
import {
    Bot,
    GrammyError,
    HttpError,
    session,
} from 'https://deno.land/x/grammy@v1.30.0/mod.ts';
import type { ParseModeFlavor } from 'https://deno.land/x/grammy_parse_mode@1.10.0/mod.ts';

import { BotContext } from '../types/botContext.ts';
import { limit } from 'https://deno.land/x/grammy_ratelimiter@v1.2.0/mod.ts';
import { autoRetry } from 'https://deno.land/x/grammy_auto_retry@v2.0.2/mod.ts';
import { apiThrottler } from 'https://deno.land/x/grammy_transformer_throttler@v1.2.1/mod.ts';
import MSG from '../constants/messages/index.ts';
import { hydrateReply } from 'https://deno.land/x/grammy_parse_mode@1.10.0/mod.ts';
import { hydrate } from 'https://deno.land/x/grammy_hydrate@v1.4.1/mod.ts';
import { globalConfig, groupConfig, outConfig } from './config/limitsConfig.ts';
import { parseMode } from 'https://deno.land/x/grammy_parse_mode@1.10.0/transformer.ts';
import { hydrateFiles } from 'https://deno.land/x/grammy_files@v1.1.1/mod.ts';
import { COMMANDS } from './commands/commands.ts';
import { conversations } from 'https://deno.land/x/grammy_conversations@v1.2.0/mod.ts';
import LOGGER from '../helpers/logger.ts';

const bot = new Bot<ParseModeFlavor<BotContext>>(ENV_VARIABLES.TOKEN);

bot.api.config.use(
    autoRetry({
        maxRetryAttempts: 2,
        maxDelaySeconds: 10,
    })
);

const throttler = apiThrottler({
    global: globalConfig,
    group: groupConfig,
    out: outConfig,
});

try {
    await bot.api.setMyCommands([], { scope: { type: 'all_group_chats' } });
    await bot.api.setMyCommands(COMMANDS, {
        scope: { type: 'all_private_chats' },
    });
    await bot.api.setMyDescription(MSG.general.myDescriptions);
    await bot.api.setMyDefaultAdministratorRights({
        // https://core.telegram.org/bots/api#chatadministratorrights
        rights: BOT_RIGHTS,
    });
} catch (error) {
    LOGGER.error('[setBotApi]', { metadata: error });
}

bot.use(hydrateReply);
bot.use(hydrate());
bot.api.config.use(hydrateFiles(bot.token));
bot.api.config.use(throttler);
bot.api.config.use(parseMode('HTML')); // Sets default parse_mode for ctx.reply

// Session
bot.use(
    session({
        initial: () => ({ spamCounter: 0 }),
    })
);

// Limit
bot.use(
    limit({
        // Allow only 3 messages to be handled every 2 seconds.
        timeFrame: 2000,
        limit: 3,

        // This is called when the limit is exceeded.
        onLimitExceeded: async (ctx) => {
            if (ctx.chat?.type === 'private') {
                await ctx.reply(MSG.general.tooManyRequest);
            }
        },

        // Note that the key should be a number in string format such as "123456789".
        keyGenerator: (ctx) => {
            return ctx.from?.id.toString();
        },
    })
);

//Inject conversations
bot.use(conversations());

export const privateChat = bot.chatType('private');
export const groupChat = bot.chatType(['group', 'supergroup']);

privateChat.command('start', async (ctx) => {
    const { user } = await ctx.getAuthor();

    await ctx.reply(`Hello ${user.first_name}!`);
});

//CRASH HANDLER
bot.catch((err) => {
    const ctx = err.ctx;
    LOGGER.error(
        `[bot-catch][Error while handling update ${ctx.update.update_id}]`,
        { metadata: err }
    );
    const e = err.error;

    if (e instanceof GrammyError) {
        LOGGER.error(
            `[bot-catch][GrammyError][Error in request ${ctx.update.update_id}]`,
            {
                metadata: e.message,
                stack: e.stack,
            }
        );
    } else if (e instanceof HttpError) {
        LOGGER.error(
            `[bot-catch][HttpError][Error in request ${ctx.update.update_id}]`,
            {
                metadata: e.error,
                stack: e.stack,
            }
        );
    } else {
        LOGGER.error(`[bot-catch][Error in request ${ctx.update.update_id}]`, {
            metadata: e,
        });
    }
});

export default bot;
