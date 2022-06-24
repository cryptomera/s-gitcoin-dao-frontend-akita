import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Box } from "@mui/system";
import Header from "./components/common/Header";
import Home from "./components/Home";
import DaoPage from "./components/DaoPage";
import Tutor from "./components/Tutor";
import Promotions from "./components/Promotions";
function App() {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <BrowserRouter>
        <Header />
        <Box
          sx={{
            p: '20px'
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dao" element={<DaoPage />} />
            <Route path="/tutorials" element={<Tutor/>} />
            <Route path="/promotions" element={<Promotions/>} />
          </Routes>
        </Box>
      </BrowserRouter>
    </Box>
  );
}

export default App;
