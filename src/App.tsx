import * as React from 'react';
import { createClient } from "@supabase/supabase-js";
import { Load } from '../compornents/organisms/load.tsx';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from '@chakra-ui/react';
import { useForm } from "react-hook-form";

const supabaseUrl: string = process.env.VITE_SUPABASE_URL!
const supabaseKey: string = process.env.VITE_SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

type Inputs = {
  id: number | null;
  title: string;
  time: number;
};

const App = () => {
  type Record = {
    id: number
    title: string
    time: number
    created_at: string
  }
  
  const [records, setRecords] = React.useState<Record[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const cancelRef = React.useRef(null)
  const [error, setError] = React.useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit, formState: { errors }, reset , setValue, getValues } = useForm<Inputs>({
    defaultValues: {
      id: null,
      title: '',
      time: 0
    }
  })

  const submit = async (inputData: Inputs) => {
    if(inputData.id) {
      const { data, error } = await supabase
        .from('study-record')
        .update(inputData)
        .eq('id', inputData.id)
        .select()
      if (error) {
        setError(error.message)
      }
      if (data) {
        setRecords([...records.filter(record => record.id !== inputData.id), ...data])
        reset({ title: '' })
        reset({ time: 0 })
      }
    }else{
      const { data, error } = await supabase
        .from('study-record')
        .insert(inputData)
        .select()
      if (error) {
        setError(error.message)
      }
      if (data) {
        setRecords([...records, ...data])
        reset({ title: '' })
        reset({ time: 0 })
      }
    }
        
    onClose()
  }


  React.useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from('study-record')
        .select('*')
      if (error) {
        console.error(error)
      } else {
        setRecords(data)
        setLoading(false)
      }
    }
    fetchRecords()
  }, [])

  const deleteRecord = async (id: number) => {
    const { error } = await supabase
      .from('study-record')
      .delete()
      .eq('id', id)
    if (error) {
      console.error(error)
    } else {
      setRecords(records.filter(record => record.id !== id))
    }
  }

  const setEdit = (id: number) => {
    setValue('title', records.find(record => record.id === id)?.title ?? '')
    setValue('time', records.find(record => record.id === id)?.time ?? 0)
    setValue('id', id)
  }
    

  return (
    <>
      <title data-testid='title'>学習記録一覧</title>
      <Load loading={loading}>
        <h1>学習記録一覧</h1>
        <Button colorScheme='blue' onClick={()=>{onOpen(); reset();}} data-testid='add-button'>
          追加
        </Button>
        {records.map((record, index) => (
          <div key={index} data-testid='content'>
            {record.title}: {record.time}時間
            <button type='button' onClick={()=>{onOpen(); setEdit(record.id)}} style={{marginLeft: '10px'}} data-testid='edit-button'>編集</button>
            <button type='button' onClick={()=>{deleteRecord(record.id)}} style={{marginLeft: '10px'}} data-testid='delete-button'>削除</button>
          </div>
        ))}
        <div>{error}</div>
        <div>合計時間: {records.reduce((acc, record) => acc + record.time, 0)} / 1000 (h)</div>
      </Load>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold' data-testid='modal-title'>
              {getValues("id") ? '記録編集' : '新規登録'}
            </AlertDialogHeader>

            <AlertDialogBody>
              <form>
                <div>
                  <label>
                    学習内容
                    <input
                      type="text"
                      data-testid='title-input'
                      {...register("title", { required: '内容の入力は必須です' })}
                    />
                  </label>
                  {errors.title && <div style={{color: 'red'}}>{errors.title.message?.toString()}</div>}
                </div>
                <div>
                  <label>
                    学習時間
                    <input
                      type="number"
                      data-testid='time-input'
                      {...register("time", { required: '時間の入力は必須です', min: { value: 0, message: '時間は0以上である必要があります' } })}
                    />
                    時間
                  </label>
                  {errors.time && <div style={{color: 'red'}}>{errors.time.message?.toString()}</div>}
                </div>
              </form>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button colorScheme='blue' onClick={handleSubmit(submit)} ml={3} data-testid='submit-button'>
                追加
              </Button>
              <Button ref={cancelRef} onClick={() => { onClose(); }} ml={3}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default App
