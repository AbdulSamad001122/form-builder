import { router } from "./trpc";

import { authRouter } from "./routes/auth/route";
import { formRouter } from "./routes/form/route"
import { formFieldRouter } from "./routes/form-field/route"
import { formResponseRouter } from "./routes/form-response/route"

export const serverRouter = router({
  auth: authRouter,
  form: formRouter,
  formField: formFieldRouter,
  formResponse: formResponseRouter
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
