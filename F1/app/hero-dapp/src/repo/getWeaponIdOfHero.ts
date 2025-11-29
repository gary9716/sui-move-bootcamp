import { SuiClient } from "@mysten/sui/client";

/**
 * Gets the object id of a Weapon that is attached to a Hero object by the hero's object id.
 * We need to get the Hero object, and find the value of the corresponding nested field.
 */
export const getWeaponIdOfHero = async (
    client: SuiClient,
    heroId: string
): Promise<string | undefined> => {
    const object = await client.getObject({
        id: heroId,
        options: {
            showContent: true,
        },
    });

    if (!object.data?.content || object.data.content.dataType !== "moveObject") {
        return undefined;
    }

    const fields = object.data.content.fields as {
        id: string;
        name: string;
        stamina: string;
        weapon: {
            fields?: {
                id: {
                    id: string;
                };
            };
        } | null;
    };

    if (fields.weapon && typeof fields.weapon === "object" && "fields" in fields.weapon) {
        return fields.weapon.fields?.id?.id;
    }

    return undefined;
};

