import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NotFoundPage from "./pages/NotFoundPage";

import "./App.css";
import MainLayout from "./components/layout/MainLayout";
import HelpDeskPage from "./pages/HelpDeskPage";
import AdminPage from "./pages/AdminPage";
import KnowlegeBasePage from "./pages/KnowlegeBasePage";
import ItAsseetsPage from "./pages/ItAsseetsPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HelpDeskPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/knowledge-base" element={<KnowlegeBasePage/>} />
          <Route path="/it-assets" element={<ItAsseetsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/** Страница 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
