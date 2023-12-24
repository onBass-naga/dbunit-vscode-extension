import {
  AddIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons'
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useColorMode } from '@chakra-ui/react'
import { Table } from '../core/types'

interface TableFormProps {
  tableFormType: TableFormType
  onSubmit: (data: {
    tableName: string
    columns: { name: string; originalName: string }[]
  }) => void
  onCancel?: () => void
  table: Table
  tableNames: string[]
}

export default function TableForm(props: TableFormProps) {
  const { colorMode } = useColorMode()
  const defaultValues = {
    defaultValues: {
      tableName: props.table.tableName,
      tableNames: props.tableNames,
      columns: Array.from(props.table.columnNames).map((name) => {
        return { name, originalName: name }
      }),
    },
  }
  const { control, register, handleSubmit, formState } = useForm<{
    columns: { name: string; originalName: string }[]
    tableName: string
    tableNames: string[]
  }>(defaultValues)

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'columns',
  })

  function addColumn() {
    append({ name: '', originalName: '' })
  }

  function deleteColumn(index: number) {
    remove(index)
  }

  function moveColumnToTop(index: number) {
    move(index, 0)
  }

  function moveColumnUp(index: number) {
    move(index, Math.max(0, index - 1))
  }

  function moveColumnDown(index: number, maxIndex: number) {
    move(index, Math.min(index + 1, maxIndex))
  }

  function columnErrors(errors: any) {
    if (!errors) {
      return <></>
    }

    const toArray = (org: any) => {
      return Array.isArray(org) ? [...org] : [org]
    }

    const messages = toArray(errors).reduce((acc: Set<string>, it: any) => {
      if (it?.name?.message) {
        acc.add(it?.name?.message + '')
      }
      return acc
    }, new Set<string>())

    const cssValue =
      colorMode === 'dark'
        ? 'var(--chakra-colors-red-300)'
        : 'var(--chakra-colors-red-500)'

    return Array.from(messages).map((message, index) => (
      <Text key={index} fontSize="sm" style={{ color: cssValue }}>
        {message}
      </Text>
    ))
  }

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <Stack spacing={'24px'}>
        <FormControl w="400px" isInvalid={!!formState?.errors?.tableName}>
          <FormLabel>Table name</FormLabel>
          <Input
            placeholder="Table name"
            {...register('tableName', {
              validate: (value, formValues) => {
                if (value.length < 1) {
                  return 'Required.'
                }

                if (value.match(/^[^"\s]+$/i) == null) {
                  return 'Spaces and double quotation marks are not allowed.'
                }
                const isUnique =
                  formValues.tableNames.filter((it) => it === value).length ===
                  0
                return isUnique || 'Must be unique.'
              },
            })}
          />
          <FormErrorMessage>
            {formState?.errors?.tableName?.message}
          </FormErrorMessage>
        </FormControl>

        <Stack spacing={1}>
          <Text fontSize="md" mb="6px">
            Columns
          </Text>
          {fields.map((field, index) => {
            return (
              <HStack key={field.id} spacing="8px">
                <Center w="32px" h="40px">
                  {index + 1}
                </Center>
                <Box w="400px" h="40px" mr={'16px'}>
                  <FormControl
                    w="400px"
                    isInvalid={!!formState?.errors?.columns?.[index]?.name}
                  >
                    <Input
                      placeholder="Column name"
                      {...register(`columns.${index}.name`, {
                        validate: (value, formValues) => {
                          if (value.length < 1) {
                            return 'Required.'
                          }

                          if (value.match(/^[^"\s]+$/i) == null) {
                            return 'Spaces and double quotation marks are not allowed.'
                          }

                          const isUnique =
                            formValues.columns.filter((it) => it.name === value)
                              .length === 1
                          return isUnique || 'Must be unique.'
                        },
                      })}
                    />
                    <input
                      type="hidden"
                      {...register(`columns.${index}.originalName`)}
                    />
                  </FormControl>
                </Box>
                {fields.length <= 1 ? (
                  <></>
                ) : (
                  <Center h="40px">
                    <ButtonGroup variant="solid" size="sm">
                      <Tooltip label="Move to top" fontSize="sm">
                        <IconButton
                          icon={<TriangleUpIcon />}
                          onClick={() => moveColumnToTop(index)}
                          aria-label={''}
                          size="sm"
                        />
                      </Tooltip>
                      <Tooltip label="Move up" fontSize="sm">
                        <IconButton
                          icon={<ChevronUpIcon />}
                          onClick={() => moveColumnUp(index)}
                          aria-label={''}
                          size="sm"
                        />
                      </Tooltip>
                      <Tooltip label="Move down" fontSize="sm">
                        <IconButton
                          icon={<ChevronDownIcon />}
                          onClick={() =>
                            moveColumnDown(index, fields.length - 1)
                          }
                          aria-label={''}
                          size="sm"
                        />
                      </Tooltip>
                    </ButtonGroup>

                    <ButtonGroup variant="solid" size="sm">
                      <Tooltip label="Delete" fontSize="sm">
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() => deleteColumn(index)}
                          aria-label={''}
                          size="sm"
                          ml={'24px'}
                        />
                      </Tooltip>
                    </ButtonGroup>
                  </Center>
                )}
              </HStack>
            )
          })}
          <Button
            leftIcon={<AddIcon />}
            colorScheme="teal"
            variant="outline"
            onClick={addColumn}
            w="100px"
            mt="16px"
            size="xs"
          >
            Add colum
          </Button>

          {columnErrors(formState?.errors?.columns)}
        </Stack>

        <Box mt={'24px'}>
          <ButtonGroup variant="solid" size="sm">
            {props.tableFormType === 'Create' ? (
              <></>
            ) : (
              <Button
                colorScheme="gray"
                variant="outline"
                onClick={() => !!props.onCancel && props.onCancel()}
                w="100px"
                size="md"
              >
                Cancel
              </Button>
            )}
            <Button
              colorScheme="teal"
              variant="solid"
              type={'submit'}
              w="100px"
              size="md"
            >
              {props.tableFormType}
            </Button>
          </ButtonGroup>
        </Box>
      </Stack>
    </form>
  )
}

export type TableFormType = 'Create' | 'Update'
