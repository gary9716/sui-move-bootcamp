import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "../constants";

/**
 * Builds a moveCall transaction for creating a new Weapon.
 * @param tx - The transaction object to add the moveCall to
 * @param name - The name of the Weapon
 * @param attack - The attack value of the Weapon
 * @returns The Weapon object result from the moveCall
 */
export const newWeapon = (
    tx: Transaction,
    name: string,
    attack: number
) => {
    return tx.moveCall({
        target: `${PACKAGE_ID}::hero::new_weapon`,
        arguments: [
            tx.pure.string(name),
            tx.pure.u64(attack),
        ],
    });
};

