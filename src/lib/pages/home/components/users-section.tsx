'use client';

import { Flex, Image, Text } from '@chakra-ui/react';
import Link from 'next/link';

interface UserMeta {
  imagePath: string;
  name: string;
  url: string;
}

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

export const UsersSection = () => (
  <Flex alignItems="center" direction="column" gap={2}>
    <Text color="gray" fontSize="small">
      used by various companies and teams
    </Text>
    <Flex alignItems="center" gap={6} justifyContent="center" wrap="wrap">
      {users.map((user) => (
        <Link
          href={user.url}
          key={user.url}
          rel="noopener noreferrer"
          target="_blank"
          title={user.name}
        >
          <Image
            _hover={{
              filter: 'grayscale(0)',
            }}
            alt={user.name}
            filter="grayscale(1)"
            height="2.5rem"
            maxWidth={{ base: 32, md: 40 }}
            src={user.imagePath}
            transition="ease-in-out 0.15s"
          />
        </Link>
      ))}
    </Flex>
  </Flex>
);
