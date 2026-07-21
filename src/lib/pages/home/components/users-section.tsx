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
    imagePath: '/users/sirclo.png',
    name: 'SIRCLO',
    url: 'https://www.sirclo.com',
  },
  {
    imagePath: '/users/pinhome.svg',
    name: 'Pinhome',
    url: 'https://pinhome.id',
  },
  {
    imagePath: '/users/tokopedia.svg',
    name: 'Tokopedia',
    url: 'https://tokopedia.com',
  },
  {
    imagePath: '/users/rumahsiapkerja.svg',
    name: 'Rumah Siap Kerja',
    url: 'https://rumahsiapkerja.com',
  },
  {
    imagePath: '/users/ihc.png',
    name: 'IHC',
    url: 'https://pertamedika.co.id/',
  },
  {
    imagePath: '/users/universitas-indonesia.svg',
    name: 'Universitas Indonesia',
    url: 'https://ui.ac.id',
  },
  {
    imagePath: '/users/dimension.png',
    name: 'Dimension',
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
