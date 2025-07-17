import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./components/layout/MainLayout";
import HelpDeskPage from "./pages/HelpDeskPage";
import ItAsseetsPage from "./pages/ItAsseetsPage";
import ProfilePage from "./pages/ProfilePage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";

import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HelpDeskPage />} />
          <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
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
