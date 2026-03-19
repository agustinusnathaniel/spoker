'use client';

import { Button, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { EVENT_TYPE_NAVIGATE } from '~/lib/constants/tracking';
import { trackEvent } from '~/lib/utils/track-event';

import { UsersSection } from './components/users-section';

export const Home = () => {
  const router = useRouter();

  const handleClickStart = () => {
    trackEvent({
      eventName: 'Open app from Home page',
      eventData: { type: EVENT_TYPE_NAVIGATE },
    });
    router.push('/');
  };

  return (
    <Grid gap={16} minHeight={{ base: '50vh', sm: '60vh' }} paddingX={0}>
      <Flex
        alignItems="center"
        direction="column"
        gap={12}
        justifyContent="center"
        marginY={12}
        minHeight={400}
        textAlign="center"
      >
        <Flex direction="column" gap={4}>
          <Heading fontWeight="extrabold" size="6xl">
            <Text
              as="span"
              bgClip="text"
              bgGradient="to-br"
              gradientFrom="purple.300"
              gradientTo="purple.700"
            >
              Estimate
            </Text>{' '}
            with
            <br />
            your{' '}
            <Text
              as="span"
              bgClip="text"
              bgGradient="to-br"
              gradientFrom="teal.400"
              gradientTo="teal.700"
            >
              team
            </Text>
          </Heading>

          <Text color="gray" fontSize="large">
            spoker: real-time multiplayer scrum poker app.
          </Text>
        </Flex>

        <Button colorPalette="orange" onClick={handleClickStart}>
          Start
        </Button>

        <UsersSection />
      </Flex>

      <Grid
        color="white"
        gap={6}
        templateColumns={{ base: '1fr', md: 'repeat(3,1fr)' }}
      >
        <SpokerWrapperGrid
          bgGradient="to-br"
          gap={4}
          gradientFrom="teal.400"
          gradientTo="teal.800"
          gridColumn={{ md: 'span 2' }}
        >
          <Heading size="4xl">Real-time multiplayer scrum poker voting</Heading>
          <Text>
            Collaborate in real-time during scrum poker with Spoker&apos;s
            multiplayer feature. Vote simultaneously and see results instantly
            for collaborative decision-making.
          </Text>
        </SpokerWrapperGrid>

        <SpokerWrapperGrid
          bgGradient="to-br"
          gap={4}
          gradientFrom="pink.300"
          gradientTo="pink.800"
        >
          <Grid gap={1}>
            <Heading size="4xl">Open Sourced, self-hostable</Heading>
            <Text fontSize="xs">*self-host docs/guide coming soon</Text>
          </Grid>
          <Text>
            Spoker is open-sourced, allowing you to contribute to improving the
            app while hosting it yourself for data security. Customize it to fit
            your team&apos;s needs and help make it even better.
          </Text>
        </SpokerWrapperGrid>

        <SpokerWrapperGrid
          bgGradient="to-br"
          gap={4}
          gradientFrom="purple.300"
          gradientTo="purple.800"
        >
          <Heading size="4xl">Multi Story Queue</Heading>
          <Text>
            Easily manage and prioritize your team&apos;s stories with
            spoker&apos;s intuitive queue feature. Quickly switch between
            stories to vote on the next one, streamlining your team&apos;s
            workflow and keeping everyone on the same page.
          </Text>
        </SpokerWrapperGrid>

        <SpokerWrapperGrid
          bgGradient="to-br"
          gap={4}
          gradientFrom="cyan.300"
          gradientTo="cyan.800"
        >
          <Heading size="4xl">Responsive Design</Heading>
          <Text>
            Enjoy a seamless user experience with spoker&apos;s responsive
            design. The app adapts to your screen size and device, ensuring that
            you can use it anywhere, anytime.
          </Text>
        </SpokerWrapperGrid>

        <SpokerWrapperGrid
          bgGradient="to-br"
          gap={4}
          gradientFrom="green.300"
          gradientTo="green.800"
        >
          <Heading size="4xl">Performant</Heading>
          <Text>
            Spoker is built for speed and performance. It ensures a fast and
            smooth voting process, even with multiple team members voting at
            once. With Spoker, you can expect a responsive and reliable
            experience every time.
          </Text>
        </SpokerWrapperGrid>
      </Grid>
    </Grid>
  );
};
