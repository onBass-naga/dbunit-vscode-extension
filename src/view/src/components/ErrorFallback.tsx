import { Code, Heading, Text } from '@chakra-ui/react'
import { FallbackProps } from 'react-error-boundary'

export default function ErrorFallback({ error }: FallbackProps) {
  const xml = `
<?xml version='1.0' encoding='UTF-8'?>
<dataset>
  <table_a id="1" column_a="aaa" column_b="bbb"/>
  <table_a id="2" column_a="abc" column_b="bcd"/>
  <table_b id="1" value_b="1"/>
</dataset>
    `.trim()
  return (
    <div role="alert" style={{height: "100vh", padding: "32px"}}>
      <Heading as='h1' size='xl' mb="8px">An error has occurred.</Heading>
      <Text fontSize='lg'>Please review the XML to ensure there are no issues.</Text>
      <Text fontSize='lg'>The following format is valid.</Text>
      <Code mt="16px" mb="16px" p="16px"><pre>{xml}</pre></Code>
    </div>
  )
}
