import Partner from "../../src/entity/Partner.entity";
import User from "../../src/entity/User.entity";

declare global {
  namespace Express {
    // These open interfaces may be extended in an application-specific manner via declaration merging.
    // See for example method-override.d.ts (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/method-override/index.d.ts)
    interface Request {
      user: User | null;
      partner: Partner | null;
    }
    interface Response {}
    interface Application {}
  }
}
