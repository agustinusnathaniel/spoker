import { Grid, Heading, Skeleton } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "lib/components/auth/AuthProvider";

import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";

const HallWrapper = () => {
  const { currentUser, isCurrentUserUpdating } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState<string>();
  const [busy, setBusy] = useState<boolean>(true);

  const checkUser = async () => {
    if (currentUser) {
      setTimeout(() => {
        currentUser.reload().then(() => {
          setDisplayName(currentUser?.displayName ?? "");
          setBusy(false);
        });
      }, 500);
    } else {
      setBusy(false);
    }
  };

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isCurrentUserUpdating]);

  return (
    <Grid gap={12}>
      <Skeleton isLoaded={!busy}>
        <Heading>Hello, {displayName}</Heading>
      </Skeleton>
      <Grid templateColumns={["1fr", "1fr", "repeat(2, 1fr)"]} gap={12}>
        <CreateRoom />
        <JoinRoom />
      </Grid>
    </Grid>
  );
};

export default HallWrapper;