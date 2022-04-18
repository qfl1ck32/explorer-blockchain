import { newSmart } from "@bluelibs/smart";
import { Home } from "@bundles/UIAppBundle/components";
import { EthereumSmart } from "@bundles/UIAppBundle/smarts";

export const HomePage = () => {
  const [_, Provider] = newSmart(EthereumSmart);

  return (
    <Provider>
      <Home />
    </Provider>
  );
};
