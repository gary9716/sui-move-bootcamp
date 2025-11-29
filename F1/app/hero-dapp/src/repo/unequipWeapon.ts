import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "../constants";

/**
 * Builds a moveCall transaction for unequipping a Weapon from a Hero.
 * @param tx - The transaction object to add the moveCall to
 * @param heroId - The object ID of the Hero
 * @returns The Weapon object result from the moveCall
 */
export const unequipWeapon = (
    tx: Transaction,
    heroId: string
) => {
    return tx.moveCall({
        target: `${PACKAGE_ID}::hero::unequip_weapon`,
        arguments: [
            tx.object(heroId),
        ],
    });
};

