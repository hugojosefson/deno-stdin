const isSilent = Deno.args.includes("--silent") || Deno.args.includes("-s");

export const info = console.log.bind(console);
export const debug = isSilent ? () => {} : console.error.bind(console);

export default {
  info,
  debug,
};
