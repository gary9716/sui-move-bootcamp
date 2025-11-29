import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, HEROES_REGISTRY_ID } from "../constants";

/**
 * Builds a moveCall transaction for creating a new Hero.
 * @param tx - The transaction object to add the moveCall to
 * @param name - The name of the Hero
 * @param stamina - The stamina value of the Hero
 * @returns The Hero object result from the moveCall
 */
export const newHero = (
    tx: Transaction,
    name: string,
    stamina: number
) => {
    return tx.moveCall({
        target: `${PACKAGE_ID}::hero::new_hero`,
        arguments: [
            tx.pure.string(name),
            tx.pure.u64(stamina),
            tx.object(HEROES_REGISTRY_ID),
        ],
    });
};

