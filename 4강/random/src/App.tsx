import React, { useEffect, useState } from 'react';
import Box from './components/Box';
import Flex from './components/Flex';
import { VscListFlat, VscArrowLeft, VscAdd, VscTrash, VscEdit, VscChromeClose, VscCheck } from "react-icons/vsc";
import axios from 'axios';
import Data from './interfaces/Data';

axios.defaults.baseURL = "http://localhost:4000"

function App() {
  const [page, setPage] = useState<'main' | 'edit'>('main')
  const [nowData, setNowData] = useState<null | Data>(null)
  const [dataList, setDataList] = useState<null | Data[]>(null)
  const [error , setError] = useState("")
  const [createMode ,setCreateMode] = useState(false)
  const [createInput, setCreateInput] = useState<[string, string]>(["", ""])
  const [editInput, setEditInput] = useState<[string, string]>(["", ""])
  const [selectedData, setSelectedData] = useState<string | null>(null)

  useEffect(() => {
    if(page === "main"){
      axios.get("/random")
      .then(e => setNowData(e.data))
      .catch(() => setError("명언을 불러오지 못했습니다."))
    }else{
      axios.get("/")
      .then(e => setDataList(e.data))
      .catch(() => setError("명언을 불러오지 못했습니다."))
    }
    
  }, [page])

  if(page === 'main')
      return (
        <>
        <Flex position={"fixed"} right="64px" top={"64px"}>
          <Flex bg="#2699fb" height={"48px"} width="48px" borderRadius={"5px"} alignItems="center" justifyContent={"center"} onClick={() => {setPage('edit')}}>
            <VscListFlat color='white' fontSize={"32px"}/>
          </Flex>
        </Flex>
          <Flex flexDirection={"column"} alignItems="center" height={"100vh"} width="100%" justifyContent="center" paddingX="16px">
            <Box fontSize={"24px"}>
              오늘의 명언
            </Box>
            <Flex
            alignItems={"center"} 
            justifyContent={"center"} 
            fontSize={"20px"}
            width="100%"
            height="160px" 
            border={"solid 1px #707070"} 
            mt="64px" 
            mb="16px"
            overflowX={"scroll"}
            >
              <Box width={"100%"} px="20px" style={{
              whiteSpace:"nowrap"
            }}>
                {error.length > 0 && error}
                {nowData && nowData?.message}
              </Box>
            </Flex>
            <Box fontSize={"24px"}>
              {nowData?.author}
            </Box>
          </Flex>
        </>
      );

      return (
        <Flex pt="64px" pl="64px" flexDirection={"column"}>
          <Flex 
          pb={"44px"}
          style={{
            gap: "44px"
          }}>
            <Flex bg="#2699fb" height={"48px"} width="48px" borderRadius={"5px"} alignItems="center" justifyContent={"center"} onClick={() => {setPage('main')}}>
              <VscArrowLeft color='white' fontSize={"32px"}/>
            </Flex>
            <Flex bg="#2699fb" height={"48px"} width="48px" borderRadius={"5px"} alignItems="center" justifyContent={"center"} onClick={() => {setCreateMode(prev => !prev)}}>
              {
                createMode ? <VscChromeClose color='white' fontSize={"32px"} /> : <VscAdd color='white' fontSize={"32px"}/>
              }
            </Flex>
          </Flex>

            {dataList?.map((data, idx) => 
            <Flex width="416px" height={"48px"} mb="16px" key={data.message}>
              <Flex border={"solid 1px #707070"} flex="1" style={{whiteSpace : "nowrap"}} overflowX="scroll">
                {
                  data.message === selectedData ? 
                  <>
                    <input type="text" value={editInput[0]} onChange={(e) => setEditInput(prev => [e.target.value, prev[1]])}/>
                    <input type="text" value={editInput[1]} onChange={(e) => setEditInput(prev => [prev[0], e.target.value])}/>
                  </> :
                  `[${data.author}] ${data.message}`
                }
                
              </Flex>
              <Flex bg="#2699fb" height={"48px"} width="48px" borderRadius={"5px"} alignItems="center" justifyContent={"center"} onClick={() => {
                if(data.message === selectedData){
                  axios.put(`/${idx}` , {
                    "author" : editInput[0],
                    "message" : editInput[1]
                  }).then(({data}) => {
                    if(data.rs){
                      setDataList([])
                      setEditInput(['',''])
                      setSelectedData(null)
                      alert(" 수정 완료 ! ")
                      axios.get("/")
                      .then(e => setDataList(e.data))
                      .catch(() => setError("명언을 불러오지 못했습니다."))}
                    else
                      alert("수정 실패!")
                  })
                }else{
                  setSelectedData(data.message)
                  setEditInput([data.author, data.message])
                }
                
              }}>
                {
                  data.message === selectedData ? <VscCheck color='white' fontSize={"32px"}/> : <VscEdit color='white' fontSize={"32px"}/>
                }
              </Flex>
              <Flex bg="#ff0c0c" height={"48px"} width="48px" borderRadius={"5px"} alignItems="center" justifyContent={"center"} onClick={() => {
                if(window.confirm("정말 제거하시겠습니까?")){
                  axios.delete(`/${idx}`)
                  .then(({data}) => {
                    if(data.rs){
                      setDataList([])
                      alert("제거 완료!")
                      axios.get("/")
                      .then(e => setDataList(e.data))
                      .catch(() => setError("명언을 불러오지 못했습니다."))}
                    else
                      alert("제거 실패!")
                  })
                }
              }}>
                <VscTrash color='white' fontSize={"32px"}/>
              </Flex>
            </Flex>
            )}
            {
              createMode && 
              <Flex width="416px" height={"48px"} mb="16px">
                <Flex border={"solid 1px #707070"} flex="1" style={{whiteSpace : "nowrap"}} overflowX="scroll">
                  <input type="text" value={createInput[0]} onChange={(e) => setCreateInput(prev => [e.target.value, prev[1]])}/>
                  <input type="text" value={createInput[1]} onChange={(e) => setCreateInput(prev => [prev[0], e.target.value])}/>
                </Flex>
                <Flex bg="#2699fb" height={"48px"} width="48px" borderRadius={"5px"} alignItems="center" justifyContent={"center"} onClick={() => {
                    if(createInput[0].length === 0 || createInput[1].length === 0){
                      alert(" 정상적인 값이 아닙니다. ")
                      return;
                    }
                    axios.post("/", {
                      "author" : createInput[0],
                      "message" : createInput[1]
                    }).then(({data}) => {
                      if(data.rs){
                        setDataList([])
                        setCreateInput(['',''])
                        setCreateMode(false)
                        alert(" 생성 완료 ! ")
                        axios.get("/")
                        .then(e => setDataList(e.data))
                        .catch(() => setError("명언을 불러오지 못했습니다."))}
                      else
                        alert("생성 실패!")
                    })
                  }}>
                  <VscCheck color='white' fontSize={"32px"}/>
                </Flex>
            </Flex>
            }
        </Flex>
      )

  
}

export default App;
