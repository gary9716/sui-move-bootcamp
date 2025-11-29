import { SuiParsedData } from "@mysten/sui/client";
import { suiClient } from "../suiClient";

/**
 * Gets the object id of a Weapon that is attached to a Hero object by the hero's object id.
 * We need to get the Hero object, and find the value of the corresponding nested field.
 */
export const getWeaponIdOfHero = async (
  heroId: string
): Promise<string | undefined> => {
  const hero = await suiClient.getObject({
    id: heroId,
    options: {
      showContent: true,
    },
  });

  if (!hero.data?.content || hero.data.content.dataType !== "moveObject") {
    return undefined;
  }

  const fields = hero.data.content.fields as {
    id: string;
    name: string;
    stamina: string;
    weapon: {
      fields?: {
        id: {
          id: string;
        };
        name: string;
        attack: string;
      };
    } | null;
  };

  // Option<Weapon> is serialized as an object with fields when Some, or null when None
  if (fields.weapon && typeof fields.weapon === "object" && "fields" in fields.weapon) {
    return fields.weapon.fields?.id?.id;
  }

  return undefined;
};
