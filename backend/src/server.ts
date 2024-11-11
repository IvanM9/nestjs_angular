import { App } from '@/app';
import { AuthRoute } from '@/infrastructure/routes/auth.route';
import { UserRoute } from '@/infrastructure/routes/users.route';
import { ValidateEnv } from '@/shared/utils/validateEnv';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute()]);

app.listen();
