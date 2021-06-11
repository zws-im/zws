import {routes as stats} from './stats';
import {routes as urls} from './urls';
import {routes as health} from './health';

// Manually doing this is required to avoid the compiler giving up and making these values any
const routes = [...Object.values(health), ...Object.values(stats), ...Object.values(urls)] as const;

export default routes;
