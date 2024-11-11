import { App } from '@/app';
import { AuthRoute } from '@/infrastructure/routes/auth.route';
import { UserRoute } from '@/infrastructure/routes/users.route';
import { ValidateEnv } from '@/shared/utils/validateEnv';
import { RoleRoute } from './infrastructure/routes/roles.route';
import { OptionRoute } from './infrastructure/routes/options.route';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new RoleRoute(), new OptionRoute()]);

app.listen();
