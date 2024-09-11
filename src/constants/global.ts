import ENVS from "../helpers/loadEnv.js";

export const BOT_RIGHTS = {
  is_anonymous: true,
  can_manage_chat: true,
  can_delete_messages: true,
  can_manage_video_chats: false,
  can_restrict_members: true,
  can_promote_members: true,
  can_change_info: true,
  can_pin_messages: true,
  can_post_messages: true,
  can_invite_users: true,
  can_post_stories: true,
  can_delete_stories: true,
  can_edit_stories: true,
};


export const ENV_VARIABLES = {
  MODE: ENVS.DENO_ENV || "development",
  TOKEN:
    ENVS.DENO_ENV === "production"
      ? ENVS.PRODUCTION_BOT_TOKEN || ""
      : ENVS.DEVELOPMENT_BOT_TOKEN || "",
  USE_MONGO: ENVS.USE_MONGO || "",
  ADMIN_ID: Number(ENVS.ADMIN_ID) || 0,
  URL: ENVS.WEB_APP_URL || "",
  GROUP_ID: Number(ENVS.GROUP_ID) || 0,
  LOGTAIL_TOKEN: ENVS.LOGTAIL_TOKEN || "",
  DB: ENVS.MONGO_DB || "mongodb://",
  DB_USER: ENVS.MONGO_DB_USER || "",
  DB_PASSWORD: encodeURIComponent(ENVS.MONGO_DB_PASSWORD || ""),
  DB_NAME: ENVS.MONGO_DB_NAME || "",
  DB_HOST: ENVS.MONGO_DB_HOST || "localhost",
  PORT: ENVS.PORT || 3000,
};
