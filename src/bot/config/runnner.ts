import { run } from "https://deno.land/x/grammy_runner@v2.0.3/mod.ts";
import bot from "../bot.ts";


const runBot = () => {
    if (!bot.isInited()) {
        run(bot, {
            runner: {
                fetch: {
                    allowed_updates: [
                        'callback_query',
                        'channel_post',
                        'chat_join_request',
                        'chat_member',
                        'chosen_inline_result',
                        'edited_channel_post',
                        'message_reaction',
                        'message_reaction_count',
                        'edited_message',
                        'inline_query',
                        'message',
                        'my_chat_member',
                        'poll',
                        'poll_answer',
                        'pre_checkout_query',
                        'shipping_query',
                    ],
                },
            },
        });
    }
};

export { runBot };
