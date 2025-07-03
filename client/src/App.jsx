import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import HomePage from './HomePage';
import ResetPassword from './ResetPassword';
import ForgotPassword from './ForgotPassword'; 
import Login from './Login';
import LostFoundForm from './LostFoundForm';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import Lost from './Lost'; 
import Result from './Result';
import Found from './Found'; 
import ContactUs from './ContactUs';
import AboutUs from './AboutUs';
import FoundItemForm from './FoundItemForm';
import LostItemForm from './LostItemForm';
import HowItWorks from './HowItWorks';
import StudentPanel from './StudentPanel';
import AdminPanel from './AdminPanel';
import ApprovedItems from './ApprovedItems';
import StudentSignup from './StudentSignup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lostfound" element={<LostFoundForm />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/lost" element={<Lost />} />
        <Route path="/found" element={<Found />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/found/:itemId" element={<FoundItemForm />} />
        <Route path="/lost/:itemId" element={<LostItemForm />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/result" element={<Result />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/student" element={<StudentPanel />} />
        <Route path="/student/register" element={<StudentSignup />} />
        <Route path="/student/login" element={<Login />} />
        <Route path="/student/*" element={<StudentPanel />}>
          <Route path="register" element={<StudentSignup />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="lostfound" element={<LostFoundForm />} />
          <Route path="lost" element={<Lost />} />
          <Route path="found" element={<Found />} />
          <Route path="approved" element={<ApprovedItems />} />
          <Route path="aboutus" element={<AboutUs />} />
        </Route>
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/register" element={<Signup />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/lostfound" element={<LostFoundForm />} />
        <Route path="/student/lost" element={<Lost />} />
        <Route path="/student/found" element={<Found />} />
        <Route path="/student/approved" element={<ApprovedItems />} />
        <Route path="/student/aboutus" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
