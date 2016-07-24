/**
 * Get an environment variable
 * @param {string} name
 * @param {string} defaultValue
 * @returns {string}
 */
export function get(name: string, defaultValue: string = ''): string{
  if(!process.env.hasOwnProperty(name)){
    console.warn(`[ENV] variable '${name}' not found. Using default value '${defaultValue}'`);
    return defaultValue;
  } else {
    return process.env[name];
  }
}

/**
 * Check list of variable for exists
 * @param {Array<string>} list
 * @returns {boolean}
 */
export function check(list: string[]): boolean{
  let success: boolean = true;
  for(let name of list){
    if(!process.env.hasOwnProperty(name)){
      console.error(`[ENV] required variable '${name}' not found.`);
      success = false;
    }
  }
  return success;
}
