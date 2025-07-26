import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientForm from './pages/PatientForm';
import PatientDetail from './pages/PatientDetail';
import PatientEdit from './pages/PatientEdit';
import Calendar from './pages/Calendar';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patients/new" element={<PatientForm />} />
            <Route path="patients/:id" element={<PatientDetail />} />
            <Route path="patients/:id/edit" element={<PatientEdit />} />
            <Route path="calendar" element={<Calendar />} />
          </Route>
        </Routes>
        <ToastContainer />
      </Router>
    </ToastProvider>
  );
}

export default App;