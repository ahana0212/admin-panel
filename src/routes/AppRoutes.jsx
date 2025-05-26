// /src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Home from "../pages/home";
import LoginType from "../pages/loginType";
import StudentList from "../components/StudentList";
import CreateAssignment from "../components/CreateAssignment";
import AllVideoLec from "../components/AllVideoLec";
import CheckAssignment from "../components/CheckAssignment";
import JoinMeeting from "../components/JoinMeeting";
import UploadAssignment from "../components/UploadAssignment";
import CheckuploadedAssignment from "../components/CheckuploadedAssignment";
import UploadVideoLec from "../components/UploadVideoLec";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/loginType" element={<LoginType />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
        <Route path="/" element={<Home />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="teacher/students" element={<StudentList />} />
        <Route path="teacher/create-assignment" element={<CreateAssignment />} />
        <Route path="student/video-lectures" element={<AllVideoLec />} />
        <Route path="student/assignments"element={<CheckAssignment />} />
        <Route path="student/join-meeting"element={<JoinMeeting />} />
        <Route path="student/upload-assignment"element={<UploadAssignment/>}/>
        <Route path="teacher/check-submissions"element={<CheckuploadedAssignment/>}/>
        <Route path="teacher/upload-lecture" element={<UploadVideoLec />} />
        
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
