import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@/shared/utils/validateEnv';
import { RoleRoute } from '@routes/roles.route';
import { OptionRoute } from '@routes/options.route';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new RoleRoute(), new OptionRoute()]);

app.listen();
