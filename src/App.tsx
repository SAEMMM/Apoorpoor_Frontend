import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components';
import {
  Account,
  AddAccount,
  AddAccountDone,
  IntroTalk,
  Login,
  Main,
  Nickname,
  PoorRoom,
  PoorTalk,
  Redirection,
  Age,
  Gender,
  Finished,
  StompClient,
  BadgeList,
} from './pages/index';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/nickname" element={<Nickname />} />
        <Route path="/" element={<Main />} />
        <Route path="/account" element={<Account />} />
        <Route path="/addAccount" element={<AddAccount />} />
        <Route path="/addAccountDone" element={<AddAccountDone />} />
        <Route path="/poorRoom" element={<PoorRoom />} />
        <Route path="/introTalk" element={<IntroTalk />} />
        <Route path="/poorTalk" element={<PoorTalk />} />
        <Route path="/oauth/kakao" element={<Redirection />} />
        <Route path="/age" element={<Age />} />
        <Route path="/gender" element={<Gender />} />
        <Route path="/finished" element={<Finished />} />
        <Route path="/poorTalk22" element={<StompClient />} />
        <Route path="/badgeList" element={<BadgeList />} />
      </Routes>
    </Layout>
  );
}

export default App;
