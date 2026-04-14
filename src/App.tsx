
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css'
import MainRoute from './route/MainRoute'
import { ConfigProvider } from "antd";
import type { Usertbl } from './@types/Usertbl';
import { useState } from 'react';
import { UserContext } from './context/UserContext';
function App() {
  const queryClient = new QueryClient()
    const [user,setUser]= useState<Usertbl|null>(null);
    
  return (
    <QueryClientProvider client={queryClient}>
     <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#044989', 
            borderRadius: 8,
            fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
            colorInfo: '#1677ff',
          },
          components: {
            Button: {
              colorPrimary: '#044989', // Deep Navy for buttons
              colorPrimaryHover: '#0650b7',
              controlHeightLG: 45, // Makes "large" buttons look more premium
            },
            Card: {
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }
          }
        }}
      >
        <UserContext.Provider value={{user,setUser}}>
 <MainRoute />
        </UserContext.Provider>
       
      </ConfigProvider>

    </QueryClientProvider>


  )
}

export default App
