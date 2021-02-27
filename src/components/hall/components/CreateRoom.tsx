import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Switch,
  toast,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useState } from "react";

import SpokerInput, { contraInputStyle } from "components/ui/SpokerInput";
import SpokerWrapperGrid from "components/ui/SpokerWrapperGrid";

import { createRoom } from "functions/firebase/room";

import { CreateRoomFormSchema, CreateRoomFormType } from "../types";
import { nanoid } from "nanoid";

const CreateRoom = () => {
  const toast = useToast();
  const router = useRouter();
  const {
    values,
    errors,
    dirty,
    handleChange,
    handleSubmit,
  } = useFormik<CreateRoomFormType>({
    initialValues: {
      name: "",
      id: nanoid(21),
      isPrivate: false,
      password: "",
    },
    validationSchema: CreateRoomFormSchema,
    onSubmit: async (formValues: CreateRoomFormType) => {
      setIsLoading(true);
      await createRoom(formValues).then((res) => {
        setIsLoading(false);
        if (res !== true && res.message) {
          toast({
            position: "top-right",
            title: "Create Room Fail",
            description: res.message,
            status: "error",
            isClosable: true,
          });
        } else {
          router.push(`/join/${formValues.id}`);
        }
      });
    },
  });
  const { name, id, isPrivate, password } = values;
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { size: _, ...contraInputStyleCompact } = contraInputStyle;

  return (
    <SpokerWrapperGrid gap={8}>
      <Heading size="lg">Create Room</Heading>

      <Grid gap={4}>
        <SpokerInput
          label="Room Name"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="The Quick Brown Fox"
          isInvalid={(errors?.name?.length ?? 0) > 0}
          helperText={errors?.name}
        />
        <SpokerInput
          label="Room ID"
          name="id"
          value={id}
          onChange={handleChange}
          placeholder="define your own room slug"
          isInvalid={(errors?.id?.length ?? 0) > 0}
          helperText={errors.id}
        />

        {/* <FormControl display="flex" alignItems="center" gridGap={2}>
          <Switch
            name="isPrivate"
            isChecked={isPrivate}
            onChange={handleChange}
          />
          <FormLabel>private</FormLabel>
          <InputGroup size="md">
            <Input
              disabled={!isPrivate}
              onChange={handleChange}
              name="password"
              value={password}
              type={isPrivate && isPasswordShown ? "text" : "password"}
              placeholder="room password"
              size="md"
              {...contraInputStyleCompact}
            />
            <InputRightElement
              children={
                <IconButton
                  size="sm"
                  aria-label="show-password"
                  disabled={!isPrivate}
                  icon={
                    isPrivate && isPasswordShown ? (
                      <AiFillEye />
                    ) : (
                      <AiFillEyeInvisible />
                    )
                  }
                  onClick={() => setIsPasswordShown(!isPasswordShown)}
                />
              }
            />
          </InputGroup>
        </FormControl> */}
      </Grid>

      <Button
        isLoading={isLoading}
        disabled={!dirty || (dirty && Object.keys(errors).length > 0)}
        colorScheme="green"
        onClick={() => handleSubmit()}
      >
        Let's Have Some Fun!
      </Button>
    </SpokerWrapperGrid>
  );
};

export default CreateRoom;
