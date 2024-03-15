import { FormLabel, HStack, Input, Switch, Textarea } from "@chakra-ui/react";
import { Flag } from "~/schemas/flagSchema";

type FlagFormProps = {
  flag?: Flag;
};

export function FlagForm({ flag }: FlagFormProps) {
  return (
    <>
      <FormLabel fontWeight={800}>
        Key
        <Input
          bg="white"
          name="key"
          required
          placeholder="my-flag"
          defaultValue={flag?.key}
        />
      </FormLabel>

      <FormLabel fontWeight={800}>
        Title
        <Input
          bg="white"
          colorScheme="white"
          name="title"
          required
          placeholder="My Flag"
          defaultValue={flag?.title}
        />
      </FormLabel>

      <FormLabel fontWeight={800}>
        Description
        <Textarea
          bg="white"
          name="description"
          defaultValue={flag?.description}
        />
      </FormLabel>

      <FormLabel fontWeight={800}>
        Default Enabled
        <HStack>
          <Switch
            defaultChecked={flag?.defaultEnabled}
            size="lg"
            value="checked"
            name="defaultEnabled"
          />
        </HStack>
      </FormLabel>
    </>
  );
}
