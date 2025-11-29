import { ENV } from "../env";
import { Transaction } from "@mysten/sui/transactions";

export const newHero = (tx: Transaction, name: string, stamina: number) => {
    return tx.moveCall({
        target: `${ENV.PACKAGE_ID}::hero::new_hero`,
        arguments: [
            tx.pure.string(name),
            tx.pure.u64(stamina),
            tx.object(ENV.HEROES_REGISTRY_ID),
        ],
    });
};