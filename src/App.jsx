import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import NoticeManagement from './components/NoticeManagement'
import CreateNotice from './components/CreateNotice'

function App() {
  const [activeView, setActiveView] = useState('notice-management')

  const renderContent = () => {
    switch (activeView) {
      case 'notice-management':
        return <NoticeManagement onCreateNotice={() => setActiveView('create-notice')} />
      case 'create-notice':
        return <CreateNotice onBack={() => setActiveView('notice-management')} />
      default:
        return <NoticeManagement onCreateNotice={() => setActiveView('create-notice')} />
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'white' }}>
      <Sidebar onNavigate={setActiveView} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App
