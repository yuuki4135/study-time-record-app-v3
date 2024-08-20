import * as React from 'react';
import { createClient } from "@supabase/supabase-js";
import { Load } from '../compornents/organisms/load.tsx';

const supabaseUrl: string = process.env.VITE_SUPABASE_URL!
const supabaseKey: string = process.env.VITE_SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const App = () => {
  interface Record {
    id: number;
    title: string;
    time: number;
    created_at: string;
  }
  
  const [records, setRecords] = React.useState<Record[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const [title, setTitle] = React.useState<string>('');
  const [time, setTime] = React.useState<number>(0);
  const [error, setError] = React.useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || typeof time != 'number') {
      setError('入力されていない項目があります')
    }else{
      const { error } = await supabase
        .from('study-record')
        .insert({ title, time })
      if(error){
        setError('保存に失敗しました') 
      }else{
        setRecords([...records, { title, time }])
        setTitle('')
        setTime(0)
        setError('')
      }
    }
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

  return (
    <>
      <title data-testid='title'>学習記録一覧</title>
      <Load loading={loading}>
        <h1>学習記録一覧</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              学習内容
              <input
                type="text"
                data-testid='title-input'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              学習時間
              <input
                type="number"
                data-testid='time-input'
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
              />
              時間
            </label>
          <button type="submit" data-testid='submit-button'>追加</button>
          </div>
          <div>
            入力されている学習内容: {title}
          </div>
          <div>
            入力されている学習時間: {time}時間
          </div>
          {records.map((record, index) => (
            <div key={index}>
              {record.title}: {record.time}時間
              <button type='button' onClick={()=>{deleteRecord(record.id)}} style={{marginLeft: '10px'}} data-testid='delete-button'>削除</button>
            </div>
          ))}
          <div>{error}</div>
          <div>合計時間: {records.reduce((acc, record) => acc + record.time, 0)} / 1000 (h)</div>
        </form>
      </Load>
    </>
  )
}

export default App