import React, {useContext, useState, useEffect} from 'react';
import AppRoutes from './navigations/AppRoutes';
import {AuthProvider} from './components/AuthProvider';
import {ChatProvider} from './components/ChatProvider'

const App = ()  => {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppRoutes/>
      </ChatProvider>
    </AuthProvider>
  )
};

export default App;

