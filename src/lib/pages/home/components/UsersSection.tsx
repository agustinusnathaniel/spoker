import { Flex, Image, Link, Text } from '@chakra-ui/react';

type UserMeta = {
  name: string;
  imagePath: string;
  url: string;
};

const users: Array<UserMeta> = [
  {
    name: 'SIRCLO',
    imagePath: '/users/sirclo.png',
    url: 'https://www.sirclo.com',
  },
  {
    name: 'Pinhome',
    imagePath: '/users/pinhome.svg',
    url: 'https://pinhome.id',
  },
  {
    name: 'Tokopedia',
    imagePath: '/users/tokopedia.svg',
    url: 'https://tokopedia.com',
  },
  {
    name: 'Rumah Siap Kerja',
    imagePath: '/users/rumahsiapkerja.svg',
    url: 'https://rumahsiapkerja.com',
  },
  {
    name: 'IHC',
    imagePath: '/users/ihc.png',
    url: 'https://pertamedika.co.id/',
  },
  {
    name: 'Universitas Indonesia',
    imagePath: '/users/universitas-indonesia.svg',
    url: 'https://ui.ac.id',
  },
  {
    name: 'Dimension',
    imagePath: '/users/dimension.png',
    url: 'https://dimension.dev',
  },
];

export const UsersSection = () => {
  return (
    <Flex direction="column" alignItems="center" gap={2}>
      <Text fontSize="small" color="gray">
        used by various companies and teams
      </Text>
      <Flex alignItems="center" justifyContent="center" wrap="wrap" gap={6}>
        {users.map((user) => (
          <Link
            key={user.url}
            href={user.url}
            isExternal
            rel="noopener noreferrer"
            title={user.name}
          >
            <Image
              alt={user.name}
              height="2.5rem"
              maxWidth={{ base: 32, md: 40 }}
              filter="grayscale(1)"
              transition="ease-in-out 0.15s"
              _hover={{
                filter: 'grayscale(0)',
              }}
              src={user.imagePath}
            />
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};
