export default class Logger {
  static info(message: string) {
    console.log(`[LOG] ${message}`);
  }

  static error(message: string, error?: Error) {
    console.error(`[ERROR] ${message}: ${error?.message}`);
  }

  static warn(message: string) {
    console.warn(`[WARN] ${message}`);
  }
}