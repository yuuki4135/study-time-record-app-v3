import * as React from 'react' 
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex
} from '@chakra-ui/react'
import { MdCreate, MdOutlineRestoreFromTrash } from "react-icons/md";

type Props = {
  records: {id: number, title: string, time: number, created_at: string}[]
  deleteRecord: (id: number) => void
  onOpen: () => void
  reset: () => void
  setEdit: (id: number) => void
}

export const Index:React.FC<Props> = ({records, deleteRecord, onOpen, reset, setEdit}) => {
  return (
    <Flex direction='column' align='center'>
      <h1>学習記録一覧</h1>
      <Button colorScheme='blue' onClick={()=>{onOpen(); reset();}} data-testid='add-button' style={{alignSelf: 'end'}}>
        新規登録
      </Button>
      <TableContainer>
        <Table variant='simple' size='lg'>
          <Thead>
            <Tr>
              <Th>学習内容</Th>
              <Th>学習時間</Th>
              <Th>操作</Th>
            </Tr>
          </Thead>
          <Tbody>
            {records.map((record, index) => (
              <Tr key={index} data-testid='content'>
                <Td>{record.title}</Td>
                <Td>{record.time}時間</Td>
                <Td>
                  <button type='button' onClick={()=>{onOpen(); setEdit(record.id)}} style={{marginLeft: '10px'}} data-testid='edit-button'><MdCreate /></button>
                  <button type='button' onClick={()=>{deleteRecord(record.id)}} style={{marginLeft: '10px'}} data-testid='delete-button'><MdOutlineRestoreFromTrash /></button>
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td style={{textAlign: 'center'}} colSpan={3}>合計時間: {records.reduce((acc, record) => acc + record.time, 0)} / 1000 (h)</Td>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Flex>
  )
}
