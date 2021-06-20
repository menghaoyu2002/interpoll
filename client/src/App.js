import Routes from './Routes';
import TopNavBar from './components/TopNavBar';
import './styles/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <TopNavBar />
      <div className="PageContainer">
        <Routes />
      </div>
    </div>
  );
}

export default App;
