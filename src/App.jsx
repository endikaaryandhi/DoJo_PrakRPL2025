import AppRouter from './components/router/AppRouter';
import { Toaster } from 'react-hot-toast'; 

function App() {
  return (
    <div>
      <AppRouter />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
