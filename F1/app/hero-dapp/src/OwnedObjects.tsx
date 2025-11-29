import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { PACKAGE_ID } from "./constants";
import { HeroCard } from "./HeroCard";

export function OwnedObjects() {
  const account = useCurrentAccount();
  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
      filter: {
        StructType: `${PACKAGE_ID}::hero::Hero`,
      },
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!account,
    },
  );

  if (!account) {
    return (
      <Flex direction="column" my="2">
        <Text>Please connect your wallet to view your heroes</Text>
      </Flex>
    );
  }

  if (error) {
    return <Flex>Error: {error.message}</Flex>;
  }

  if (isPending || !data) {
    return <Flex>Loading...</Flex>;
  }

  const heroes = data.data
    .map((object) => {
      if (!object.data?.content || object.data.content.dataType !== "moveObject") {
        return null;
      }

      const fields = object.data.content.fields as {
        id: string;
        name: string;
        stamina: string;
        weapon: {
          fields?: {
            name: string;
            attack: string;
          };
        } | null;
      };

      return {
        heroId: object.data.objectId,
        name: fields.name,
        stamina: Number(fields.stamina),
        weapon: fields.weapon && typeof fields.weapon === "object" && "fields" in fields.weapon
          ? {
              name: fields.weapon.fields?.name,
              attack: fields.weapon.fields?.attack ? Number(fields.weapon.fields.attack) : undefined,
            }
          : null,
      };
    })
    .filter((hero): hero is NonNullable<typeof hero> => hero !== null);

  return (
    <Flex direction="column" my="2" gap="3">
      <Heading size="4">My Heroes</Heading>
      {heroes.length === 0 ? (
        <Text>No heroes owned by the connected wallet</Text>
      ) : (
        <Flex direction="column" gap="2">
          {heroes.map((hero) => (
            <HeroCard
              key={hero.heroId}
              heroId={hero.heroId}
              name={hero.name}
              stamina={hero.stamina}
              weapon={hero.weapon}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
}
