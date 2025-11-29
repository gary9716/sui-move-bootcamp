import { useSuiClientQuery, useSuiClient } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Box } from "@radix-ui/themes";
import { HEROES_REGISTRY_ID, PACKAGE_ID } from "./constants";
import { HeroCard } from "./HeroCard";
import { useEffect, useState } from "react";

interface HeroData {
  heroId: string;
  name?: string;
  stamina?: number;
  weapon?: {
    name?: string;
    attack?: number;
  } | null;
}

export function HeroList() {
  const suiClient = useSuiClient();
  const { data, isPending, error } = useSuiClientQuery(
    "getObject",
    {
      id: HEROES_REGISTRY_ID,
      options: {
        showContent: true,
      },
    },
  );

  const [heroesData, setHeroesData] = useState<HeroData[]>([]);
  const [isLoadingHeroes, setIsLoadingHeroes] = useState(false);

  useEffect(() => {
    const fetchHeroes = async () => {
      if (!data?.data?.content || data.data.content.dataType !== "moveObject") {
        return;
      }

      const registryFields = data.data.content.fields as {
        id: string;
        ids: string[];
        counter: string;
      };

      const heroIds = registryFields.ids || [];
      
      if (heroIds.length === 0) {
        setHeroesData([]);
        return;
      }

      setIsLoadingHeroes(true);
      try {
        const heroObjects = await suiClient.multiGetObjects({
          ids: heroIds,
          options: {
            showContent: true,
          },
        });

        const heroes: HeroData[] = heroObjects
          .map((obj, index) => {
            if (!obj.data?.content || obj.data.content.dataType !== "moveObject") {
              return null;
            }

            const fields = obj.data.content.fields as {
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
              heroId: heroIds[index],
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
          .filter((hero): hero is HeroData => hero !== null)
          .reverse(); // Display latest heroes first

        setHeroesData(heroes);
      } catch (err) {
        console.error("Error fetching heroes:", err);
      } finally {
        setIsLoadingHeroes(false);
      }
    };

    fetchHeroes();
  }, [data, suiClient]);

  if (error) {
    return (
      <Flex direction="column" my="2">
        <Text color="red">Error: {error.message}</Text>
      </Flex>
    );
  }

  if (isPending || !data) {
    return (
      <Flex direction="column" my="2">
        <Text>Loading Heroes Registry...</Text>
      </Flex>
    );
  }

  // Parse the HeroRegistry content
  const content = data.data?.content;
  if (!content || content.dataType !== "moveObject") {
    return (
      <Flex direction="column" my="2">
        <Text>Invalid registry data</Text>
      </Flex>
    );
  }

  const registryFields = content.fields as {
    id: string;
    ids: string[];
    counter: string;
  };

  return (
    <Flex direction="column" my="2" gap="3">
      <Heading size="4">Heroes Registry</Heading>
      <Box>
        <Text>Total Heroes: {registryFields.counter}</Text>
      </Box>
      {isLoadingHeroes ? (
        <Text>Loading hero details...</Text>
      ) : heroesData.length === 0 ? (
        <Text>No heroes created yet</Text>
      ) : (
        <Flex direction="column" gap="2">
          <Heading size="3">Latest Heroes:</Heading>
          {heroesData.map((hero) => (
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

