import { useEffect, useState } from "react";
import { oauthProvidersRequest } from "@/services/authService";
import { oauthProviders } from "@/utils/oauthProviders";

// las redes con su estado ({ id, label, enabled }); mientras carga o si falla, se muestran todas habilitadas
// (si alguna no estuviera configurada, la API lo avisa al tocarla)
export function useOAuthProviders() {
  const [enabledById, setEnabledById] = useState(null);

  useEffect(() => {
    oauthProvidersRequest()
      .then((list) => setEnabledById(Object.fromEntries(list.map((item) => [item.id, item.enabled]))))
      .catch(() => setEnabledById(null));
  }, []);

  return oauthProviders.map((provider) => ({ ...provider, enabled: enabledById ? enabledById[provider.id] === true : true }));
}
