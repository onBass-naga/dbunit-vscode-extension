import { useAppContext } from '../core/Context'
import { useVsCodeApi } from '../core/useVsCodeApi'
import { convertToMarkDownText } from '../utils/markdown'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Flex,
  Select,
  useColorMode,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import {
  AddIcon,
  ArrowBackIcon,
  ArrowForwardIcon,
  CopyIcon,
  DeleteIcon,
  EditIcon,
  MoonIcon,
  RepeatIcon,
  SmallCloseIcon,
  SunIcon,
} from '@chakra-ui/icons'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import React, { ChangeEvent } from 'react'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import TableForm from './TableForm'

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [, copyToClipboard] = useCopyToClipboard()
  const toast = useToast()
  const vscode = useVsCodeApi()
  const { state, dispatch } = useAppContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const {
    isOpen: deleteTableIsOpen,
    onOpen: deleteTableOnOpen,
    onClose: deleteTableOnClose,
  } = useDisclosure()
  const deleteTableRef = React.useRef(null)

  function reload() {
    vscode.postMessage({
      type: 'ready',
    })
  }

  function cloneRow() {
    dispatch({
      type: 'cloneRow',
    })
  }

  function deleteRow() {
    dispatch({
      type: 'deleteRow',
    })
  }

  function moveRight() {
    dispatch({
      type: 'moveTableRight',
    })
  }

  function moveLeft() {
    dispatch({
      type: 'moveTableLeft',
    })
  }

  function deleteTable() {
    dispatch({
      type: 'deleteTable',
    })
  }

  function copyAsMarkdown() {
    const text = convertToMarkDownText(state.tables)
    copyToClipboard(text)
    toast({
      title: 'Copied',
      position: 'top-right',
      status: 'success',
      isClosable: true,
      duration: 1000,
    })
  }

  function updateTable(
    tabIndex: number,
    data: {
      tableName: string
      columns: { name: string; originalName: string }[]
    }
  ) {
    dispatch({
      type: 'updateTable',
      payload: {
        tabIndex,
        tableName: data.tableName,
        columnChanges: data.columns,
      },
    })
  }

  function onChangeXmlFormat(event: ChangeEvent<HTMLSelectElement>) {
    const xmlFormat = event.target.value === 'flat' ? 'flat' : 'standard'
    console.log(xmlFormat)
    dispatch({
      type: 'updateXmlFormat',
      payload: {
        xmlFormat,
      },
    })
  }

  return (
    <>
      <Flex justify="center" flexWrap="wrap" mb="24px" gap="16px" rowGap="16px">
        <ButtonGroup colorScheme="teal" variant="outline" size="xs" isAttached>
          <Button leftIcon={<AddIcon />} onClick={cloneRow}>
            Clone row
          </Button>

          <Button
            leftIcon={<DeleteIcon />}
            onClick={deleteRow}
            isDisabled={
              state.tables[state.tabIndex] == null ||
              state.tables[state.tabIndex].rows.length <= 1
            }
          >
            Delete row
          </Button>
        </ButtonGroup>

        <ButtonGroup colorScheme="teal" variant="outline" size="xs" isAttached>
          <Button
            leftIcon={<EditIcon />}
            colorScheme="teal"
            variant="outline"
            onClick={onOpen}
            size="xs"
          >
            Edit table...
          </Button>
          <Button
            leftIcon={<SmallCloseIcon />}
            colorScheme="teal"
            variant="outline"
            onClick={deleteTableOnOpen}
            isDisabled={state.tables.length <= 1}
            size="xs"
          >
            Delete table...
          </Button>

          <Button
            leftIcon={<ArrowBackIcon />}
            colorScheme="teal"
            variant="outline"
            onClick={moveLeft}
            size="xs"
          >
            Move left
          </Button>

          <Button
            leftIcon={<ArrowForwardIcon />}
            colorScheme="teal"
            variant="outline"
            onClick={moveRight}
            size="xs"
          >
            Move right
          </Button>
        </ButtonGroup>

        <Button
          leftIcon={<CopyIcon />}
          colorScheme="teal"
          variant="outline"
          onClick={copyAsMarkdown}
          size="xs"
        >
          Copy as Makdown
        </Button>

        <Button
          leftIcon={<RepeatIcon />}
          colorScheme="teal"
          variant="outline"
          onClick={reload}
          size="xs"
        >
          Reload
        </Button>

        <Flex justify="center" gap="8px">
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            aria-label={''}
            size="xs"
          />

          <Select
            size="xs"
            w="100px"
            value={state.xmlFormat}
            onChange={onChangeXmlFormat}
            style={{ display: 'flex' }}
          >
            <option value="flat">Flat</option>
            <option value="standard">Standard</option>
          </Select>
        </Flex>
      </Flex>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size={'full'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit table</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {state.tabIndex < state.tables.length && (
              <TableForm
                tableFormType="Update"
                onSubmit={(data) => {
                  onClose()
                  updateTable(state.tabIndex, data)
                }}
                onCancel={onClose}
                table={state.tables[state.tabIndex]}
                tableNames={state.tables
                  .map((it) => it.tableName)
                  .filter(
                    (it) => it !== state.tables[state.tabIndex].tableName
                  )}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={deleteTableIsOpen}
        leastDestructiveRef={deleteTableRef}
        onClose={deleteTableOnClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete table
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete '
              {state.tables[state.tabIndex]?.tableName}'
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={deleteTableRef} onClick={deleteTableOnClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteTableOnClose()
                  deleteTable()
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
