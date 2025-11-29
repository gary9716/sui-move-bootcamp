import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "../constants";

/**
 * Builds a moveCall transaction for equipping a Weapon to a Hero.
 * @param tx - The transaction object to add the moveCall to
 * @param hero - The Hero transaction result (from newHero or object reference)
 * @param weapon - The Weapon transaction result (from newWeapon or object reference)
 */
export const equipWeapon = (
    tx: Transaction,
    hero: any,
    weapon: any
) => {
    tx.moveCall({
        target: `${PACKAGE_ID}::hero::equip_weapon`,
        arguments: [
            hero,
            weapon,
        ],
    });
};

