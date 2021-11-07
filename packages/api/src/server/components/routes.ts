import {routes as stats} from './stats/index.js';
import {routes as urls} from './urls/index.js';
import {routes as health} from './health/index.js';

// Manually doing this is required to avoid the compiler giving up and making these values any
const routes = [...Object.values(health), ...Object.values(stats), ...Object.values(urls)] as const;

export default routes;
