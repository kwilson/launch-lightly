import { ComponentProps } from "react";
import { Button as ChakraButton, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "@remix-run/react";

type ButtonProps = ComponentProps<"button"> | ComponentProps<typeof Link>;

export function Button({ children, ...props }: ButtonProps) {
  if ("to" in props) {
    return (
      <ChakraLink as={Link} _hover={{ textDecoration: "none" }} {...props}>
        <ChakraButton colorScheme="cerulean" as="span">
          {children}
        </ChakraButton>
      </ChakraLink>
    );
  }

  return (
    <ChakraButton colorScheme="cerulean" {...props}>
      {children}
    </ChakraButton>
  );
}
