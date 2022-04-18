import { Kernel } from "@bluelibs/core";
import { XUIBundle } from "@bluelibs/x-ui";
import { UIAppBundle } from "../bundles/UIAppBundle/UIAppBundle";

// All UI bundles need to be prefixed with UI
// All X-Framework bundles have the first prefix X
export const kernel = new Kernel({
  bundles: [new XUIBundle(), new UIAppBundle()],
});
