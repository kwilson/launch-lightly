import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form, json, redirect } from "@remix-run/react";
import { useState } from "react";
import { $params, $path } from "remix-routes";
import { deleteProjectFlag } from "~/data/projects.server";
import { Flag } from "~/schemas/flagSchema";

type DeleteFlagModalProps = {
  projectId: string;
  flag: Flag;
  isOpen: boolean;
  onClose: () => void;
};

export const action = async ({ params, context }: ActionFunctionArgs) => {
  const { projectId, flagId } = $params(
    "/projects/:projectId/:flagId/delete",
    params,
  );

  try {
    await deleteProjectFlag(projectId, flagId, context);
    return redirect($path("/projects/:projectId", { projectId }));
  } catch (e) {
    console.error(e);
    return json({ error: e });
  }
};

export function DeleteFlagModal({
  flag,
  projectId,
  onClose,
  isOpen,
}: DeleteFlagModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete '{flag.key}'</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete this flag? This cannot be undone.
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancel
          </Button>

          <Form
            method="post"
            action={$path("/projects/:projectId/:flagId/delete", {
              projectId,
              flagId: flag.id,
            })}
          >
            <Button colorScheme="red" type="submit">
              Delete Flag
            </Button>
          </Form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
