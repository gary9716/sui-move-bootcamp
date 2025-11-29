import { ENV } from "../env";
import { suiClient } from "../suiClient";

interface HeroesRegistry {
  ids: string[];
  counter: number;
}

/**
 * Gets the Heroes ids in the Hero Registry.
 * We need to get the Hero Registry object, and return the contents of the ids vector, along with the counter field.
 */
export const getHeroesRegistry = async (): Promise<HeroesRegistry> => {
  const object = await suiClient.getObject({
    id: ENV.HEROES_REGISTRY_ID,
    options: {
      showContent: true,
    },
  });

  if (!object.data?.content || object.data.content.dataType !== "moveObject") {
    return {
      ids: [],
      counter: 0,
    };
  }

  const fields = object.data.content.fields as {
    id: string;
    ids: string[];
    counter: string;
  };

  return {
    ids: fields.ids || [],
    counter: Number(fields.counter) || 0,
  };
};
