import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts';

await load({ export: true, allowEmptyValues: true });

const ENVS = Deno.env.toObject();
export default ENVS;
